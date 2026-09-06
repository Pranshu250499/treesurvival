import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.models.database import init_db, SessionLocal
from app.services.seed_data import seed_database
from app.api.trees import router as trees_router
from app.api.drives import router as drives_router
from app.api.inspections import router as inspections_router
from app.api.analytics import router as analytics_router

# Initialize database tables
init_db()

# Seed database with authentic regional data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="VrikshaSetu - Tree Survival & Community Stewardship API",
    description="Backend API with AI Computer Vision Vitality Analysis, Anti-Fraud Proof of Survival, CSR Milestone Escrow & Community Stewardship.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "qr_codes"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "inspections"), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(trees_router)
app.include_router(drives_router)
app.include_router(inspections_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {
        "project": "VrikshaSetu",
        "tagline": "Tree Survival, Not Just Plantation",
        "team": "Pandas Py",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "VrikshaSetu AI Engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
