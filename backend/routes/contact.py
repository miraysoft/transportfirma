from fastapi import APIRouter, HTTPException, status
from typing import List
import logging
from datetime import datetime

from ..models import ContactInquiry, ContactInquiryCreate, ContactInquiryResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/contact", tags=["contact"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=ContactInquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_inquiry(inquiry_data: ContactInquiryCreate):
    """
    Create a new contact inquiry
    """
    try:
        # Create inquiry object
        inquiry = ContactInquiry(
            name=inquiry_data.name,
            email=inquiry_data.email,
            phone=inquiry_data.phone,
            company=inquiry_data.company,
            service=inquiry_data.service.value if inquiry_data.service else None,
            message=inquiry_data.message
        )
        
        # Insert into database
        result = await db.contact_inquiries.insert_one(inquiry.dict())
        
        if result.inserted_id:
            logger.info(f"New contact inquiry created: {inquiry.id}")
            return ContactInquiryResponse(
                success=True,
                message="Vielen Dank für Ihre Anfrage! Wir melden uns bald bei Ihnen.",
                inquiry_id=inquiry.id
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Fehler beim Speichern der Anfrage"
            )
            
    except Exception as e:
        logger.error(f"Error creating contact inquiry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
        )

@router.get("/", response_model=List[ContactInquiry])
async def get_contact_inquiries():
    """
    Get all contact inquiries (admin endpoint)
    """
    try:
        inquiries = await db.contact_inquiries.find().sort("created_at", -1).to_list(100)
        return [ContactInquiry(**inquiry) for inquiry in inquiries]
    except Exception as e:
        logger.error(f"Error fetching contact inquiries: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Laden der Anfragen"
        )

@router.get("/{inquiry_id}", response_model=ContactInquiry)
async def get_contact_inquiry(inquiry_id: str):
    """
    Get a specific contact inquiry by ID
    """
    try:
        inquiry = await db.contact_inquiries.find_one({"id": inquiry_id})
        if not inquiry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anfrage nicht gefunden"
            )
        return ContactInquiry(**inquiry)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact inquiry {inquiry_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Laden der Anfrage"
        )

@router.patch("/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str):
    """
    Update inquiry status (admin endpoint)
    """
    try:
        valid_statuses = ["new", "reviewed", "contacted"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ungültiger Status"
            )
            
        result = await db.contact_inquiries.update_one(
            {"id": inquiry_id},
            {
                "$set": {
                    "status": status,
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
        logger.error(f"Error updating inquiry status {inquiry_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Fehler beim Aktualisieren der Anfrage"
        )