import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(DB_DIR, "vrikshasetu.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PlantationDrive(Base):
    __tablename__ = "plantation_drives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    organization = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    location_name = Column(String(120), nullable=False)
    district = Column(String(80), default="East Singhbhum (Jamshedpur)")
    state = Column(String(80), default="Jharkhand")
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    target_count = Column(Integer, default=100)
    planted_count = Column(Integer, default=0)
    budget_inr = Column(Float, default=250000.0)
    escrow_stage = Column(String(50), default="Phase 1 (Planting Verified)")
    escrow_released_pct = Column(Integer, default=30)  # 30%, 60%, 100%
    status = Column(String(40), default="Active")  # Active, Completed, Auditing
    banner_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trees = relationship("Tree", back_populates="drive", cascade="all, delete-orphan")


class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    tree_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g. VS-2026-JH-0101
    drive_id = Column(Integer, ForeignKey("plantation_drives.id"), nullable=True)
    species = Column(String(100), nullable=False)  # Botanical name
    common_name = Column(String(100), nullable=False)  # Local/Hindi name e.g. Neem, Peepal, Sal
    planted_date = Column(DateTime, default=datetime.datetime.utcnow)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    soil_type = Column(String(60), default="Red Laterite Loam")
    status = Column(String(40), default="healthy")  # healthy, needs_attention, critical, dead
    survival_score = Column(Float, default=92.0)  # 0 to 100%
    current_height_cm = Column(Float, default=65.0)
    canopy_spread_cm = Column(Float, default=45.0)
    last_inspected_at = Column(DateTime, default=datetime.datetime.utcnow)
    qr_code_url = Column(String(300), nullable=True)
    photo_url = Column(String(300), nullable=True)
    initial_photo_url = Column(String(300), nullable=True)
    
    # Community Adoption
    is_adopted = Column(Boolean, default=False)
    guardian_id = Column(Integer, ForeignKey("guardians.id"), nullable=True)
    guardian_name = Column(String(100), nullable=True)
    guardian_role = Column(String(50), nullable=True)  # Citizen, Student, Farmer, etc.
    watering_frequency_days = Column(Integer, default=3)
    is_fenced = Column(Boolean, default=True)
    carbon_absorbed_kg = Column(Float, default=2.8)

    drive = relationship("PlantationDrive", back_populates="trees")
    guardian = relationship("Guardian", back_populates="trees")
    inspections = relationship("InspectionLog", back_populates="tree", cascade="all, delete-orphan", order_by="desc(InspectionLog.inspection_date)")


class InspectionLog(Base):
    __tablename__ = "inspection_logs"

    id = Column(Integer, primary_key=True, index=True)
    tree_id = Column(Integer, ForeignKey("trees.id"), nullable=False)
    inspection_date = Column(DateTime, default=datetime.datetime.utcnow)
    inspector_name = Column(String(100), default="Vriksha Volunteer")
    inspector_role = Column(String(60), default="Guardian")
    photo_url = Column(String(300), nullable=False)
    photo_hash = Column(String(64), nullable=True)  # pHash for anti-fraud
    height_cm = Column(Float, nullable=True)
    canopy_spread_cm = Column(Float, nullable=True)
    soil_moisture_level = Column(String(30), default="Adequate")  # Dry, Adequate, Damp
    is_weeded = Column(Boolean, default=True)
    is_mulched = Column(Boolean, default=True)
    is_watered = Column(Boolean, default=True)
    pests_detected = Column(Boolean, default=False)
    health_status = Column(String(40), default="healthy")
    
    # AI CV Analytics
    ai_survival_score = Column(Float, default=90.0)
    ai_vitality_index = Column(Float, default=0.88)
    ai_notes = Column(Text, nullable=True)
    
    # Verification & Anti-Fraud
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    distance_from_origin_m = Column(Float, default=0.0)
    fraud_flag = Column(Boolean, default=False)
    fraud_reason = Column(String(200), nullable=True)
    is_verified = Column(Boolean, default=True)

    tree = relationship("Tree", back_populates="inspections")


class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(100), nullable=True)
    role = Column(String(50), default="Citizen")  # Citizen, Student, Farmer, Panchayat Volunteer
    ward_or_village = Column(String(100), default="Jamshedpur Urban Ward 14")
    prithvi_credits = Column(Integer, default=120)
    streak_days = Column(Integer, default=5)
    badge_tier = Column(String(50), default="Sapling Guardian")  # Seedling Sentry, Sapling Guardian, Canopy Champion, Forest Custodian
    avatar_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trees = relationship("Tree", back_populates="guardian")


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    category = Column(String(50), default="Municipal Benefit")  # Municipal Benefit, Agri Supplies, CSR Voucher, Forest Certificate
    cost_credits = Column(Integer, nullable=False)
    sponsor = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(50), default="Award")
    stock = Column(Integer, default=50)


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
