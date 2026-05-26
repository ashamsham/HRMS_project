# HRMS Frontend-Backend Connection Guide

## Quick Start

### Option 1: Using PowerShell Script (Recommended for Windows)

```powershell
# Navigate to project root
cd D:\HRMS_Project

# Run the startup script
.\start.ps1
```

This will automatically:
- Activate the Python virtual environment
- Start the backend on `http://127.0.0.1:8000`
- Start the frontend on `http://localhost:5173`

### Option 2: Manual Startup

#### Step 1: Start the Backend

```powershell
# Terminal 1 - Backend
cd D:\HRMS_Project
.\venv\Scripts\Activate.ps1
python -m uvicorn backend.main:backend --reload --host 127.0.0.1 --port 8000
```

#### Step 2: Start the Frontend

```powershell
# Terminal 2 - Frontend
cd D:\HRMS_Project\frontend
npm install  # First time only
npm run dev
```

## Connection Configuration

### Backend URL
- **Address:** `http://127.0.0.1:8000`
- **API Documentation:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

### Frontend URL
- **Address:** `http://localhost:5173`

### API Endpoints

All endpoints use the base URL: `http://127.0.0.1:8000`

#### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user

#### Employees
- `GET /employee/all` - Get all employees
- `POST /employee/add` - Add new employee
- `PUT /employee/update/{employee_id}` - Update employee
- `DELETE /employee/delete/{employee_id}` - Delete employee

#### Attendance
- `GET /attendance/all` - Get all attendance records
- `POST /attendance/mark` - Mark attendance

#### Leaves
- `GET /leave/all` - Get all leaves
- `POST /leave/apply` - Apply leave
- `PUT /leave/approve/{leave_id}` - Approve leave
- `PUT /leave/reject/{leave_id}` - Reject leave

#### Payroll
- `GET /payroll/all` - Get all payroll records
- `POST /payroll/generate` - Generate payroll
- `GET /payroll/payslip/{payroll_id}` - Download payslip

#### Appraisals
- `GET /appraisal/all` - Get all appraisals
- `POST /appraisal/create` - Create appraisal
- `PUT /appraisal/update/{appraisal_id}` - Update appraisal

#### Assets
- `GET /asset/all` - Get all assets
- `POST /asset/assign` - Assign asset
- `PUT /asset/update/{asset_id}` - Update asset

#### Notifications
- `GET /notification/all` - Get notifications
- `PUT /notification/mark-read/{notification_id}` - Mark as read
- `PUT /notification/mark-all-read` - Mark all as read

#### Holidays
- `GET /holidays/all` - Get all holidays
- `POST /holidays/create` - Create holiday
- `PUT /holidays/update/{holiday_id}` - Update holiday
- `DELETE /holidays/delete/{holiday_id}` - Delete holiday

#### Audit Logs
- `GET /audit-log/all` - Get audit logs

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Frontend)

This is set in `backend/main.py`:
```python
backend.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Frontend can't connect to backend

**Error:** `Failed to fetch` or `CORS error`

**Solution:**
1. Ensure backend is running on `http://127.0.0.1:8000`
2. Check frontend is running on `http://localhost:5173`
3. Verify CORS settings in `backend/main.py`

### Backend won't start

**Error:** `Port 8000 already in use`

**Solution:**
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000

# Kill the process (replace PID)
Stop-Process -Id <PID> -Force
```

### Frontend npm issues

**Error:** `npm: command not found`

**Solution:**
```powershell
# Install Node.js from https://nodejs.org/
# Or use Chocolatey (if installed)
choco install nodejs
```

### Database connection issues

**Error:** `Cannot connect to MySQL`

**Solution:**
1. Ensure MySQL is running
2. Check database credentials in `backend/database.py`
3. Run migrations if needed

## Testing the Connection

### 1. Test Backend API
```powershell
# Open browser and visit:
http://127.0.0.1:8000/docs

# Or test with curl:
curl -X GET http://127.0.0.1:8000/
```

### 2. Test Frontend
```
http://localhost:5173
```

### 3. Test Login
- Frontend will make request to `POST /auth/login`
- Backend will validate credentials and return JWT token
- Frontend will store token in localStorage
- Subsequent requests will include token in Authorization header

## Environment Setup

### Backend Requirements
- Python 3.8+
- MySQL database (configured in backend/database.py)
- Virtual environment (venv)

### Frontend Requirements
- Node.js 16+
- npm or yarn

### Created Virtual Environment
```powershell
# Virtual environment is located at:
D:\HRMS_Project\venv

# To create a new one:
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Development Tips

### Frontend Development
- Hot reload enabled with `npm run dev`
- Changes save automatically
- Open DevTools: `F12`

### Backend Development
- Auto-reload enabled with `--reload` flag
- Check `backend/routes/` for API endpoints
- Check `backend/services/` for business logic
- API documentation auto-generated at `/docs`

### Database Debugging
- Check connection in `backend/database.py`
- Models defined in `backend/models/`
- Migrations in `migrations/` folder

## Security Notes

- JWT tokens stored in browser localStorage
- Tokens validated on each protected route
- Passwords hashed with bcrypt
- CORS restricted to frontend origin only

## Project Structure

```
HRMS_Project/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── database.py      # DB configuration
│   └── utils/           # Utilities
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── components/  # Reusable components
│   │   ├── routes/      # Route configuration
│   │   └── utils/       # Utilities
│   └── package.json
├── requirements.txt     # Python dependencies
└── start.ps1           # Startup script
```

## Next Steps

1. Verify both services are running
2. Test login at `http://localhost:5173`
3. Use API documentation at `http://127.0.0.1:8000/docs`
4. Create test data through frontend or API
5. Verify database records are saved

---

**Created:** May 11, 2026
**Last Updated:** May 11, 2026
