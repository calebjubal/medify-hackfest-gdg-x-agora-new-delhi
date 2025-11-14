from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Doctor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    specialty: str
    email: str
    phone: str
    rating: float = 4.5
    experience: int = 5
    availability: List[dict] = []
    image: str = ""

class Patient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    age: int
    gender: str
    medicalHistory: List[str] = []

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patientId: str
    patientName: str
    doctorId: str
    doctorName: str
    doctorSpecialty: str
    date: str
    time: str
    status: str = "upcoming"
    symptoms: str = ""
    notes: str = ""

class Stats(BaseModel):
    totalPatients: int
    totalDoctors: int
    todayAppointments: int
    availabilityUsed: int

# Mock data initialization
mock_doctors = [
    {
        "id": "doc1",
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiology",
        "email": "sarah.j@hospital.com",
        "phone": "+1-555-0101",
        "rating": 4.8,
        "experience": 12,
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        "availability": [{"day": "Monday", "slots": ["09:00", "10:00", "14:00"]}, {"day": "Wednesday", "slots": ["09:00", "11:00", "15:00"]}]
    },
    {
        "id": "doc2",
        "name": "Dr. Michael Chen",
        "specialty": "Neurology",
        "email": "michael.c@hospital.com",
        "phone": "+1-555-0102",
        "rating": 4.9,
        "experience": 15,
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        "availability": [{"day": "Tuesday", "slots": ["10:00", "11:00", "16:00"]}, {"day": "Thursday", "slots": ["09:00", "13:00", "14:00"]}]
    },
    {
        "id": "doc3",
        "name": "Dr. Emily Rodriguez",
        "specialty": "Pediatrics",
        "email": "emily.r@hospital.com",
        "phone": "+1-555-0103",
        "rating": 4.7,
        "experience": 8,
        "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
        "availability": [{"day": "Monday", "slots": ["08:00", "09:00", "10:00"]}, {"day": "Friday", "slots": ["14:00", "15:00", "16:00"]}]
    },
    {
        "id": "doc4",
        "name": "Dr. James Wilson",
        "specialty": "Orthopedics",
        "email": "james.w@hospital.com",
        "phone": "+1-555-0104",
        "rating": 4.6,
        "experience": 10,
        "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
        "availability": [{"day": "Wednesday", "slots": ["10:00", "11:00", "15:00"]}, {"day": "Thursday", "slots": ["09:00", "10:00", "14:00"]}]
    }
]

mock_patients = [
    {"id": "pat1", "name": "John Doe", "email": "john.doe@email.com", "phone": "+1-555-1001", "age": 45, "gender": "Male", "medicalHistory": ["Hypertension", "Diabetes"]},
    {"id": "pat2", "name": "Jane Smith", "email": "jane.smith@email.com", "phone": "+1-555-1002", "age": 32, "gender": "Female", "medicalHistory": ["Asthma"]},
    {"id": "pat3", "name": "Robert Brown", "email": "robert.b@email.com", "phone": "+1-555-1003", "age": 58, "gender": "Male", "medicalHistory": ["Heart Disease"]},
]

mock_appointments = [
    {
        "id": "apt1",
        "patientId": "pat1",
        "patientName": "John Doe",
        "doctorId": "doc1",
        "doctorName": "Dr. Sarah Johnson",
        "doctorSpecialty": "Cardiology",
        "date": "2025-01-20",
        "time": "09:00",
        "status": "upcoming",
        "symptoms": "Chest pain, shortness of breath",
        "notes": ""
    },
    {
        "id": "apt2",
        "patientId": "pat2",
        "patientName": "Jane Smith",
        "doctorId": "doc3",
        "doctorName": "Dr. Emily Rodriguez",
        "doctorSpecialty": "Pediatrics",
        "date": "2025-01-21",
        "time": "10:00",
        "status": "upcoming",
        "symptoms": "Regular checkup",
        "notes": ""
    },
    {
        "id": "apt3",
        "patientId": "pat3",
        "patientName": "Robert Brown",
        "doctorId": "doc1",
        "doctorName": "Dr. Sarah Johnson",
        "doctorSpecialty": "Cardiology",
        "date": "2025-01-15",
        "time": "14:00",
        "status": "completed",
        "symptoms": "Follow-up consultation",
        "notes": "Patient is responding well to treatment"
    }
]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Medical Appointment System API"}

@api_router.get("/doctors")
async def get_doctors():
    return mock_doctors

@api_router.get("/doctors/{doctor_id}")
async def get_doctor(doctor_id: str):
    doctor = next((d for d in mock_doctors if d["id"] == doctor_id), None)
    return doctor if doctor else {"error": "Doctor not found"}

@api_router.get("/patients")
async def get_patients():
    return mock_patients

@api_router.get("/appointments")
async def get_appointments():
    return mock_appointments

@api_router.post("/appointments")
async def create_appointment(appointment: dict):
    new_appointment = {
        "id": str(uuid.uuid4()),
        **appointment,
        "status": "upcoming"
    }
    mock_appointments.append(new_appointment)
    return new_appointment

@api_router.put("/appointments/{appointment_id}")
async def update_appointment(appointment_id: str, data: dict):
    for apt in mock_appointments:
        if apt["id"] == appointment_id:
            apt.update(data)
            return apt
    return {"error": "Appointment not found"}

@api_router.get("/stats")
async def get_stats():
    return {
        "totalPatients": len(mock_patients),
        "totalDoctors": len(mock_doctors),
        "todayAppointments": len([a for a in mock_appointments if a["status"] == "upcoming"]),
        "availabilityUsed": 75
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()