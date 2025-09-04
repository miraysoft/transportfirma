# Backend Integration Contracts - Ammann & Co Transport

## Overview
This document outlines the API contracts and integration points between the frontend and backend for the Ammann & Co Transport website.

## Current Mock Data to Replace

### Contact Form (ContactSection.js)
- **Current Mock**: Form submission only shows success toast and resets form
- **Backend Needed**: Store contact inquiries in database and send confirmation

## API Endpoints to Implement

### 1. Contact Inquiry Submission
**Endpoint**: `POST /api/contact`

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, email format)", 
  "phone": "string (optional)",
  "company": "string (optional)",
  "service": "string (optional, enum: lkw|kuehl|luft|post|beratung)",
  "message": "string (required)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Vielen Dank für Ihre Anfrage! Wir melden uns bald bei Ihnen.",
  "inquiry_id": "uuid"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": {
    "field": ["error details"]
  }
}
```

### 2. Get Contact Inquiries (Admin endpoint)
**Endpoint**: `GET /api/contact`

**Response**:
```json
{
  "inquiries": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string", 
      "phone": "string",
      "company": "string",
      "service": "string",
      "message": "string",
      "created_at": "timestamp",
      "status": "new|reviewed|contacted"
    }
  ]
}
```

## Database Schema

### ContactInquiry Model
```python
class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None  
    service: Optional[str] = None
    message: str
    status: str = "new"  # new, reviewed, contacted
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Frontend Integration Changes

### ContactSection.js
**Current**:
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
  toast.success("Vielen Dank für Ihre Anfrage! Wir melden uns bald bei Ihnen.");
  // Reset form
};
```

**New Implementation**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post(`${API}/contact`, formData);
    
    if (response.data.success) {
      toast.success(response.data.message);
      // Reset form
      setFormData({...});
    }
  } catch (error) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    }
  }
};
```

## Implementation Steps

1. **Backend Models**: Create ContactInquiry model
2. **Database Setup**: Add contact_inquiries collection to MongoDB
3. **API Endpoints**: Implement POST /api/contact and GET /api/contact
4. **Validation**: Add email validation and required field checks
5. **Frontend Integration**: Replace mock submission with real API calls
6. **Error Handling**: Implement proper error responses and frontend error handling
7. **Testing**: Test form submission and data persistence

## Validation Rules

### Required Fields
- name: minimum 2 characters
- email: valid email format
- message: minimum 10 characters

### Optional Fields  
- phone: Swiss format validation (+41 XX XXX XX XX)
- company: maximum 100 characters
- service: must be one of predefined options

## Error Messages (German)

- Missing name: "Name ist erforderlich"
- Invalid email: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
- Missing message: "Nachricht ist erforderlich" 
- Message too short: "Nachricht muss mindestens 10 Zeichen lang sein"
- Server error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."