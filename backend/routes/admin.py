from fastapi import APIRouter, HTTPException, status, Depends, Request
from typing import Optional
import logging
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import os

from models.admin import (
    AdminUser, AdminLoginRequest, AdminLoginResponse,
    InquiryNote, InquiryNoteCreate, DashboardStats, UserRole
)
from models import ContactInquiry
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/admin", tags=["admin"])
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_data: dict) -> str:
    payload = {
        "sub": user_data["id"],
        "email": user_data["email"],
        "role": user_data["role"],
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_admin_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Oturum acilmadi")

    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Gecersiz token tipi")
        user_id = payload.get("sub")
        admin_user = await db.admin_users.find_one({"id": user_id})
        if not admin_user or not admin_user.get("is_active"):
            raise HTTPException(status_code=401, detail="Kullanici bulunamadi")
        return AdminUser(**admin_user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token suresi doldu")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Gecersiz token")


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLoginRequest):
    try:
        admin_user = await db.admin_users.find_one({"email": login_data.email.lower().strip()})

        if not admin_user or not admin_user.get("is_active"):
            return AdminLoginResponse(success=False, message="Gecersiz giris bilgileri")

        if not verify_password(login_data.password, admin_user["password_hash"]):
            return AdminLoginResponse(success=False, message="Gecersiz giris bilgileri")

        await db.admin_users.update_one(
            {"id": admin_user["id"]},
            {"$set": {"last_login": datetime.now(timezone.utc)}}
        )

        token = create_access_token(admin_user)
        user_data = {k: v for k, v in admin_user.items() if k not in ("password_hash", "_id")}

        return AdminLoginResponse(
            success=True,
            token=token,
            user=user_data,
            message="Basarili giris"
        )
    except Exception as e:
        logger.error(f"Admin login error: {str(e)}")
        return AdminLoginResponse(success=False, message="Giris hatasi")


@router.get("/me")
async def get_current_user(current_user: AdminUser = Depends(get_current_admin_user)):
    user_dict = current_user.dict()
    user_dict.pop("password_hash", None)
    return user_dict


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: AdminUser = Depends(get_current_admin_user)):
    try:
        now = datetime.now(timezone.utc)
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        total_inquiries = await db.contact_inquiries.count_documents({})
        new_inquiries = await db.contact_inquiries.count_documents({"status": "new"})
        reviewed_inquiries = await db.contact_inquiries.count_documents({"status": "reviewed"})
        contacted_inquiries = await db.contact_inquiries.count_documents({"status": "contacted"})

        inquiries_today = await db.contact_inquiries.count_documents({"created_at": {"$gte": today}})
        inquiries_this_week = await db.contact_inquiries.count_documents({"created_at": {"$gte": week_ago}})
        inquiries_this_month = await db.contact_inquiries.count_documents({"created_at": {"$gte": month_ago}})

        pipeline = [
            {"$match": {"service": {"$nin": [None, ""]}}},
            {"$group": {"_id": "$service", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        popular_services = []
        async for service in db.contact_inquiries.aggregate(pipeline):
            popular_services.append({"service": service["_id"], "count": service["count"]})

        recent_inquiries = []
        async for inquiry in db.contact_inquiries.find().sort("created_at", -1).limit(5):
            recent_inquiries.append({
                "id": inquiry["id"],
                "name": inquiry["name"],
                "email": inquiry["email"],
                "service": inquiry.get("service", ""),
                "status": inquiry["status"],
                "created_at": inquiry["created_at"].isoformat() if isinstance(inquiry["created_at"], datetime) else str(inquiry["created_at"])
            })

        return DashboardStats(
            total_inquiries=total_inquiries,
            new_inquiries=new_inquiries,
            reviewed_inquiries=reviewed_inquiries,
            contacted_inquiries=contacted_inquiries,
            inquiries_today=inquiries_today,
            inquiries_this_week=inquiries_this_week,
            inquiries_this_month=inquiries_this_month,
            popular_services=popular_services,
            recent_inquiries=recent_inquiries
        )
    except Exception as e:
        logger.error(f"Dashboard stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Dashboard verileri yuklenemedi")


@router.get("/inquiries")
async def get_inquiries(
    page: int = 1,
    limit: int = 20,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    try:
        skip = (page - 1) * limit
        filter_query = {}

        if status_filter:
            filter_query["status"] = status_filter

        if search:
            filter_query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"message": {"$regex": search, "$options": "i"}}
            ]

        total = await db.contact_inquiries.count_documents(filter_query)
        cursor = db.contact_inquiries.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)

        inquiries = []
        async for inquiry in cursor:
            notes_cursor = db.inquiry_notes.find({"inquiry_id": inquiry["id"]}).sort("created_at", -1)
            notes = []
            async for note in notes_cursor:
                notes.append(InquiryNote(**note).dict())

            inquiry_data = ContactInquiry(**inquiry).dict()
            inquiry_data["notes"] = notes
            inquiries.append(inquiry_data)

        return {
            "inquiries": inquiries,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": max(1, (total + limit - 1) // limit)
        }
    except Exception as e:
        logger.error(f"Get inquiries error: {str(e)}")
        raise HTTPException(status_code=500, detail="Mesajlar yuklenemedi")


@router.patch("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(
    inquiry_id: str,
    status_update: dict,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    try:
        new_status = status_update.get("status")
        valid_statuses = ["new", "reviewed", "contacted"]
        if new_status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Gecersiz durum")

        result = await db.contact_inquiries.update_one(
            {"id": inquiry_id},
            {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc)}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Mesaj bulunamadi")
        return {"success": True, "message": "Durum guncellendi"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update inquiry status error: {str(e)}")
        raise HTTPException(status_code=500, detail="Durum guncellenemedi")


@router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    try:
        result = await db.contact_inquiries.delete_one({"id": inquiry_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Mesaj bulunamadi")
        await db.inquiry_notes.delete_many({"inquiry_id": inquiry_id})
        return {"success": True, "message": "Mesaj silindi"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete inquiry error: {str(e)}")
        raise HTTPException(status_code=500, detail="Mesaj silinemedi")


@router.post("/inquiries/{inquiry_id}/notes")
async def add_inquiry_note(
    inquiry_id: str,
    note_data: InquiryNoteCreate,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    try:
        inquiry = await db.contact_inquiries.find_one({"id": inquiry_id})
        if not inquiry:
            raise HTTPException(status_code=404, detail="Mesaj bulunamadi")

        note = InquiryNote(
            inquiry_id=inquiry_id,
            admin_user_id=current_user.id,
            admin_username=current_user.username,
            note=note_data.note
        )
        await db.inquiry_notes.insert_one(note.dict())
        return {"success": True, "message": "Not eklendi", "note": note.dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add inquiry note error: {str(e)}")
        raise HTTPException(status_code=500, detail="Not eklenemedi")
