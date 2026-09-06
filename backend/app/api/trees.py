import os
import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.models.database import get_db, Tree, PlantationDrive, Guardian, InspectionLog
from app.services.seed_data import generate_qr_code

router = APIRouter(prefix="/api/trees", tags=["Trees"])

@router.get("/")
def get_trees(
    drive_id: Optional[int] = None,
    status: Optional[str] = None,
    is_adopted: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Tree)
    if drive_id is not None:
        query = query.filter(Tree.drive_id == drive_id)
    if status:
        query = query.filter(Tree.status == status)
    if is_adopted is not None:
        query = query.filter(Tree.is_adopted == is_adopted)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Tree.tree_code.ilike(search_fmt)) |
            (Tree.common_name.ilike(search_fmt)) |
            (Tree.species.ilike(search_fmt)) |
            (Tree.guardian_name.ilike(search_fmt))
        )
    trees = query.all()
    
    result = []
    for t in trees:
        result.append({
            "id": t.id,
            "tree_code": t.tree_code,
            "drive_id": t.drive_id,
            "drive_title": t.drive.title if t.drive else "Independent Drive",
            "species": t.species,
            "common_name": t.common_name,
            "planted_date": t.planted_date.isoformat() if t.planted_date else None,
            "lat": t.lat,
            "lng": t.lng,
            "soil_type": t.soil_type,
            "status": t.status,
            "survival_score": t.survival_score,
            "current_height_cm": t.current_height_cm,
            "canopy_spread_cm": t.canopy_spread_cm,
            "last_inspected_at": t.last_inspected_at.isoformat() if t.last_inspected_at else None,
            "qr_code_url": t.qr_code_url,
            "photo_url": t.photo_url,
            "initial_photo_url": t.initial_photo_url,
            "is_adopted": t.is_adopted,
            "guardian_id": t.guardian_id,
            "guardian_name": t.guardian_name,
            "guardian_role": t.guardian_role,
            "watering_frequency_days": t.watering_frequency_days,
            "carbon_absorbed_kg": t.carbon_absorbed_kg
        })
    return result


@router.get("/qr/{tree_code}")
def get_tree_by_qr(tree_code: str, db: Session = Depends(get_db)):
    tree = db.query(Tree).filter(Tree.tree_code == tree_code).first()
    if not tree:
        raise HTTPException(status_code=404, detail=f"Tree with QR code {tree_code} not found")
    return get_tree_detail(tree.id, db)


@router.get("/{tree_id}")
def get_tree_detail(tree_id: int, db: Session = Depends(get_db)):
    tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")

    inspections_data = []
    for insp in tree.inspections:
        inspections_data.append({
            "id": insp.id,
            "inspection_date": insp.inspection_date.isoformat() if insp.inspection_date else None,
            "inspector_name": insp.inspector_name,
            "inspector_role": insp.inspector_role,
            "photo_url": insp.photo_url,
            "height_cm": insp.height_cm,
            "canopy_spread_cm": insp.canopy_spread_cm,
            "soil_moisture_level": insp.soil_moisture_level,
            "is_weeded": insp.is_weeded,
            "is_mulched": insp.is_mulched,
            "is_watered": insp.is_watered,
            "pests_detected": insp.pests_detected,
            "health_status": insp.health_status,
            "ai_survival_score": insp.ai_survival_score,
            "ai_vitality_index": insp.ai_vitality_index,
            "ai_notes": insp.ai_notes,
            "distance_from_origin_m": insp.distance_from_origin_m,
            "fraud_flag": insp.fraud_flag,
            "fraud_reason": insp.fraud_reason,
            "is_verified": insp.is_verified
        })

    return {
        "id": tree.id,
        "tree_code": tree.tree_code,
        "drive_id": tree.drive_id,
        "drive": {
            "id": tree.drive.id,
            "title": tree.drive.title,
            "organization": tree.drive.organization,
            "location_name": tree.drive.location_name
        } if tree.drive else None,
        "species": tree.species,
        "common_name": tree.common_name,
        "planted_date": tree.planted_date.isoformat() if tree.planted_date else None,
        "lat": tree.lat,
        "lng": tree.lng,
        "soil_type": tree.soil_type,
        "status": tree.status,
        "survival_score": tree.survival_score,
        "current_height_cm": tree.current_height_cm,
        "canopy_spread_cm": tree.canopy_spread_cm,
        "last_inspected_at": tree.last_inspected_at.isoformat() if tree.last_inspected_at else None,
        "qr_code_url": tree.qr_code_url,
        "photo_url": tree.photo_url,
        "initial_photo_url": tree.initial_photo_url,
        "is_adopted": tree.is_adopted,
        "guardian_id": tree.guardian_id,
        "guardian_name": tree.guardian_name,
        "guardian_role": tree.guardian_role,
        "watering_frequency_days": tree.watering_frequency_days,
        "is_fenced": tree.is_fenced,
        "carbon_absorbed_kg": tree.carbon_absorbed_kg,
        "inspections": inspections_data
    }


@router.post("/register")
def register_tree(
    species: str = Form(...),
    common_name: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    drive_id: Optional[int] = Form(None),
    soil_type: Optional[str] = Form("Alluvial Red Loam"),
    height_cm: Optional[float] = Form(45.0),
    watering_frequency_days: Optional[int] = Form(3),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Auto generate unique tree code
    count = db.query(Tree).count() + 101
    tree_code = f"VS-2026-JH-{count:04d}"
    qr_url = generate_qr_code(tree_code)

    photo_url = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80"
    if photo and photo.filename:
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "inspections")
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"{tree_code}_p0_{photo.filename}"
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, "wb") as f:
            f.write(photo.file.read())
        photo_url = f"/uploads/inspections/{filename}"

    new_tree = Tree(
        tree_code=tree_code,
        drive_id=drive_id,
        species=species,
        common_name=common_name,
        planted_date=datetime.datetime.utcnow(),
        lat=lat,
        lng=lng,
        soil_type=soil_type,
        status="healthy",
        survival_score=95.0,
        current_height_cm=height_cm,
        canopy_spread_cm=30.0,
        last_inspected_at=datetime.datetime.utcnow(),
        qr_code_url=qr_url,
        photo_url=photo_url,
        initial_photo_url=photo_url,
        is_adopted=False,
        watering_frequency_days=watering_frequency_days,
        is_fenced=True,
        carbon_absorbed_kg=1.5
    )
    db.add(new_tree)
    
    # Increment planted count in drive if specified
    if drive_id:
        drive = db.query(PlantationDrive).filter(PlantationDrive.id == drive_id).first()
        if drive:
            drive.planted_count += 1

    db.commit()
    db.refresh(new_tree)
    return {"message": "Sapling registered successfully", "tree_code": tree_code, "id": new_tree.id, "qr_code_url": qr_url}


@router.post("/{tree_id}/adopt")
def adopt_tree(
    tree_id: int,
    guardian_name: str = Form(...),
    guardian_phone: str = Form(...),
    guardian_role: Optional[str] = Form("Citizen Guardian"),
    db: Session = Depends(get_db)
):
    tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    if tree.is_adopted:
        raise HTTPException(status_code=400, detail=f"This tree has already been adopted by {tree.guardian_name}")

    # Find or create guardian
    guardian = db.query(Guardian).filter(Guardian.phone == guardian_phone).first()
    if not guardian:
        guardian = Guardian(
            name=guardian_name,
            phone=guardian_phone,
            role=guardian_role or "Citizen",
            prithvi_credits=50,  # Bonus credits for first adoption
            streak_days=1,
            badge_tier="Sapling Guardian"
        )
        db.add(guardian)
        db.commit()
        db.refresh(guardian)
    else:
        guardian.prithvi_credits += 30

    tree.is_adopted = True
    tree.guardian_id = guardian.id
    tree.guardian_name = guardian.name
    tree.guardian_role = guardian.role
    db.commit()

    return {
        "message": f"Congratulations! You have adopted {tree.common_name} ({tree.tree_code})",
        "tree_id": tree.id,
        "tree_code": tree.tree_code,
        "guardian_name": guardian.name,
        "earned_credits": 30,
        "total_credits": guardian.prithvi_credits
    }
