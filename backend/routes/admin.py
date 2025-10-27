from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List, Optional
import logging
from datetime import datetime, timedelta
import hashlib
import jwt
import os
from collections import Counter

from models.admin import (
    AdminUser, AdminUserCreate, AdminLoginRequest, AdminLoginResponse,
    InquiryNote, InquiryNoteCreate, DashboardStats, UserRole
)
from models import ContactInquiry
from motor.motor_asyncio import AsyncIOMotorClient

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/admin", tags=["admin"])
logger = logging.getLogger(__name__)

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == password_hash

def create_jwt_token(user_data: dict) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_data["id"],
        "username": user_data["username"],
        "role": user_data["role"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin_user(authorization: str = Header(None)):
    """Get current admin user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token erforderlich"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Ungültiger Token"
            )
        
        admin_user = await db.admin_users.find_one({"id": user_id})
        if not admin_user or not admin_user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Benutzer nicht gefunden oder deaktiviert"
            )
        
        return AdminUser(**admin_user)
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token abgelaufen"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ungültiger Token"
        )

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLoginRequest):
    """Admin login endpoint"""
    try:
        # Find admin user
        admin_user = await db.admin_users.find_one({"username": login_data.username})
        
        if not admin_user or not admin_user.get("is_active"):
            return AdminLoginResponse(
                success=False,
                message="Ungültige Anmeldedaten"
            )
        
        # Verify password
        if not verify_password(login_data.password, admin_user["password_hash"]):
            return AdminLoginResponse(
                success=False,
                message="Ungültige Anmeldedaten"
            )
        
        # Update last login
        await db.admin_users.update_one(
            {"id": admin_user["id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create token
        token = create_jwt_token(admin_user)
        
        # Remove password from response
        user_data = {k: v for k, v in admin_user.items() if k != "password_hash"}
        
        return AdminLoginResponse(
            success=True,
            token=token,
            user=user_data,
            message="Erfolgreich angemeldet"
        )
        
    except Exception as e:
        logger.error(f"Admin login error: {str(e)}")
        return AdminLoginResponse(
            success=False,
            message="Anmeldefehler"
        )

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: AdminUser = Depends(get_current_admin_user)):
    """Get dashboard statistics"""
    try:
        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # Total inquiries by status
        total_inquiries = await db.contact_inquiries.count_documents({})
        new_inquiries = await db.contact_inquiries.count_documents({"status": "new"})
        reviewed_inquiries = await db.contact_inquiries.count_documents({"status": "reviewed"})
        contacted_inquiries = await db.contact_inquiries.count_documents({"status": "contacted"})
        
        # Time-based statistics
        inquiries_today = await db.contact_inquiries.count_documents({
            "created_at": {"$gte": today}
        })
        inquiries_this_week = await db.contact_inquiries.count_documents({
            "created_at": {"$gte": week_ago}
        })
        inquiries_this_month = await db.contact_inquiries.count_documents({
            "created_at": {"$gte": month_ago}
        })
        
        # Popular services
        pipeline = [
            {"$match": {"service": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$service", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        popular_services_cursor = db.contact_inquiries.aggregate(pipeline)
        popular_services = []
        async for service in popular_services_cursor:
            popular_services.append({
                "service": service["_id"],
                "count": service["count"]
            })
        
        # Recent inquiries
        recent_cursor = db.contact_inquiries.find().sort("created_at", -1).limit(5)
        recent_inquiries = []
        async for inquiry in recent_cursor:
            recent_inquiries.append({
                "id": inquiry["id"],
                "name": inquiry["name"],
                "email": inquiry["email"],
                "service": inquiry.get("service", ""),
                "status": inquiry["status"],
                "created_at": inquiry["created_at"].isoformat()
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Laden der Dashboard-Daten"
        )

@router.get("/inquiries")
async def get_inquiries(
    page: int = 1,
    limit: int = 20,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    """Get paginated inquiries with filtering"""
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
        
        # Get total count
        total = await db.contact_inquiries.count_documents(filter_query)
        
        # Get inquiries
        cursor = db.contact_inquiries.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        inquiries = []
        async for inquiry in cursor:
            # Get notes for this inquiry
            notes_cursor = db.inquiry_notes.find({"inquiry_id": inquiry["id"]}).sort("created_at", -1)
            notes = []
            async for note in notes_cursor:
                notes.append(InquiryNote(**note))
            
            inquiry_data = ContactInquiry(**inquiry)
            inquiry_dict = inquiry_data.dict()
            inquiry_dict["notes"] = [note.dict() for note in notes]
            inquiries.append(inquiry_dict)
        
        return {
            "inquiries": inquiries,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Get inquiries error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Laden der Anfragen"
        )

@router.patch("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(
    inquiry_id: str,
    status_update: dict,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    """Update inquiry status"""
    try:
        new_status = status_update.get("status")
        valid_statuses = ["new", "reviewed", "contacted"]
        
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ungültiger Status"
            )
        
        result = await db.contact_inquiries.update_one(
            {"id": inquiry_id},
            {
                "$set": {
                    "status": new_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anfrage nicht gefunden"
            )
        
        return {"success": True, "message": "Status erfolgreich aktualisiert"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update inquiry status error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Aktualisieren des Status"
        )

@router.post("/inquiries/{inquiry_id}/notes")
async def add_inquiry_note(
    inquiry_id: str,
    note_data: InquiryNoteCreate,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    """Add note to inquiry"""
    try:
        # Verify inquiry exists
        inquiry = await db.contact_inquiries.find_one({"id": inquiry_id})
        if not inquiry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anfrage nicht gefunden"
            )
        
        note = InquiryNote(
            inquiry_id=inquiry_id,
            admin_user_id=current_user.id,
            admin_username=current_user.username,
            note=note_data.note
        )
        
        await db.inquiry_notes.insert_one(note.dict())
        
        return {"success": True, "message": "Notiz erfolgreich hinzugefügt", "note": note.dict()}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add inquiry note error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Hinzufügen der Notiz"
        )

@router.get("/export/inquiries")
async def export_inquiries(
    format_type: str = "csv",
    status_filter: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_admin_user)
):
    """Export inquiries to CSV or JSON"""
    try:
        filter_query = {}
        if status_filter:
            filter_query["status"] = status_filter
        
        cursor = db.contact_inquiries.find(filter_query).sort("created_at", -1)
        inquiries = []
        async for inquiry in cursor:
            inquiries.append(ContactInquiry(**inquiry).dict())
        
        if format_type.lower() == "csv":
            import csv
            from io import StringIO
            
            output = StringIO()
            if inquiries:
                fieldnames = inquiries[0].keys()
                writer = csv.DictWriter(output, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(inquiries)
            
            return {
                "success": True,
                "data": output.getvalue(),
                "filename": f"anfragen_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                "content_type": "text/csv"
            }
        else:
            return {
                "success": True,
                "data": inquiries,
                "filename": f"anfragen_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                "content_type": "application/json"
            }
        
    except Exception as e:
        logger.error(f"Export inquiries error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Exportieren der Daten"
        )

# Initialize admin user if none exists
@router.post("/init")
async def initialize_admin():
    """Initialize default admin user"""
    try:
        # Check if any admin user exists
        existing_admin = await db.admin_users.find_one({})
        if existing_admin:
            return {"message": "Admin bereits initialisiert"}
        
        # Create default admin
        default_admin = AdminUser(
            username="admin",
            email="admin@ammanncotransport.ch",
            password_hash=hash_password("admin123"),
            role=UserRole.admin,
            full_name="System Administrator"
        )
        
        await db.admin_users.insert_one(default_admin.dict())
        
        return {
            "message": "Admin erfolgreich erstellt",
            "username": "admin",
            "password": "admin123",
            "note": "Bitte ändern Sie das Passwort nach der ersten Anmeldung"
        }
        
    except Exception as e:
        logger.error(f"Initialize admin error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Initialisieren des Admin-Benutzers"
        )