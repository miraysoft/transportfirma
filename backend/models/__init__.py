from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid
from enum import Enum

class ServiceType(str, Enum):
    lkw = "lkw"
    kuehl = "kuehl" 
    luft = "luft"
    post = "post"
    beratung = "beratung"

class InquiryStatus(str, Enum):
    new = "new"
    reviewed = "reviewed"
    contacted = "contacted"

class ContactInquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[ServiceType] = None
    message: str = Field(..., min_length=10, max_length=1000)

class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    status: InquiryStatus = InquiryStatus.new
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContactInquiryResponse(BaseModel):
    success: bool
    message: str
    inquiry_id: Optional[str] = None