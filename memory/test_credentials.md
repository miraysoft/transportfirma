# Test Credentials

## Admin Account
- **Email:** admin@ammanncotransport.ch
- **Password:** Admin2024!
- **Role:** admin
- **Username:** admin

## Auth Endpoints
- POST `/api/admin/login` — Admin login (email + password)
- GET `/api/admin/me` — Get current admin user
- GET `/api/admin/dashboard` — Dashboard stats
- GET `/api/admin/inquiries` — List inquiries (paginated)
- PATCH `/api/admin/inquiries/{id}/status` — Update inquiry status
- DELETE `/api/admin/inquiries/{id}` — Delete inquiry
- POST `/api/admin/inquiries/{id}/notes` — Add note to inquiry
