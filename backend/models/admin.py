from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    viewer = "viewer"

class AdminUserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.viewer
    full_name: Optional[str] = None

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    role: UserRole
    full_name: Optional[str] = None
    is_active: bool = True
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    user: Optional[dict] = None
    message: str

class InquiryNote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    inquiry_id: str
    admin_user_id: str
    note: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    admin_username: str

class InquiryNoteCreate(BaseModel):
    note: str

class DashboardStats(BaseModel):
    total_inquiries: int
    new_inquiries: int
    reviewed_inquiries: int
    contacted_inquiries: int
    inquiries_today: int
    inquiries_this_week: int
    inquiries_this_month: int
    popular_services: List[dict]
    recent_inquiries: List[dict]