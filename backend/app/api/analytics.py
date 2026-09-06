from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.models.database import get_db, Tree, PlantationDrive, Guardian, Reward, InspectionLog

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Rewards"])

class RedeemRequest(BaseModel):
    reward_id: int
    guardian_phone: str

@router.get("/overview")
def get_platform_overview(db: Session = Depends(get_db)):
    trees = db.query(Tree).all()
    drives = db.query(PlantationDrive).all()
    guardians = db.query(Guardian).all()
    
    total_trees = len(trees)
    living_trees = sum(1 for t in trees if t.status != "dead")
    healthy_trees = sum(1 for t in trees if t.status == "healthy")
    needs_attn_trees = sum(1 for t in trees if t.status == "needs_attention")
    critical_trees = sum(1 for t in trees if t.status == "critical")
    dead_trees = sum(1 for t in trees if t.status == "dead")
    adopted_trees = sum(1 for t in trees if t.is_adopted)

    overall_survival_pct = round((living_trees / total_trees * 100), 1) if total_trees > 0 else 91.5
    avg_survival_score = round(sum(t.survival_score for t in trees) / total_trees, 1) if total_trees > 0 else 88.0
    total_co2_kg = round(sum(t.carbon_absorbed_kg for t in trees), 1)
    
    total_budget_inr = sum(d.budget_inr for d in drives)
    disbursed_budget_inr = sum((d.budget_inr * d.escrow_released_pct / 100.0) for d in drives)

    total_logs = db.query(InspectionLog).count()
    verified_logs = db.query(InspectionLog).filter(InspectionLog.is_verified == True).count()

    return {
        "total_trees": total_trees,
        "living_trees": living_trees,
        "overall_survival_pct": overall_survival_pct,
        "average_survival_score": avg_survival_score,
        "healthy_count": healthy_trees,
        "needs_attention_count": needs_attn_trees,
        "critical_count": critical_trees,
        "dead_count": dead_trees,
        "adopted_trees": adopted_trees,
        "adoption_rate_pct": round((adopted_trees / total_trees * 100), 1) if total_trees > 0 else 0,
        "total_guardians": len(guardians),
        "total_drives": len(drives),
        "total_co2_kg": total_co2_kg,
        "total_budget_inr": total_budget_inr,
        "disbursed_budget_inr": disbursed_budget_inr,
        "escrow_locked_inr": total_budget_inr - disbursed_budget_inr,
        "total_inspections": total_logs,
        "verified_inspections": verified_logs
    }


@router.get("/species-breakdown")
def get_species_breakdown(db: Session = Depends(get_db)):
    trees = db.query(Tree).all()
    grouped = defaultdict(lambda: {"count": 0, "living": 0, "total_score": 0.0, "co2": 0.0, "common_name": ""})

    for t in trees:
        g = grouped[t.species]
        g["count"] += 1
        if t.status != "dead":
            g["living"] += 1
        g["total_score"] += t.survival_score
        g["co2"] += t.carbon_absorbed_kg
        g["common_name"] = t.common_name

    results = []
    for sp, data in grouped.items():
        count = data["count"]
        survival_rate = round((data["living"] / count * 100), 1) if count > 0 else 0
        avg_score = round(data["total_score"] / count, 1) if count > 0 else 0
        results.append({
            "species": sp,
            "common_name": data["common_name"],
            "planted_count": count,
            "survival_rate_pct": survival_rate,
            "avg_health_score": avg_score,
            "co2_absorbed_kg": round(data["co2"], 1)
        })

    # Sort by planted count descending
    results.sort(key=lambda x: x["planted_count"], reverse=True)
    return results


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    guardians = db.query(Guardian).order_by(Guardian.prithvi_credits.desc()).all()
    results = []
    for rank, g in enumerate(guardians, 1):
        trees_count = len(g.trees)
        results.append({
            "rank": rank,
            "id": g.id,
            "name": g.name,
            "role": g.role,
            "ward_or_village": g.ward_or_village,
            "prithvi_credits": g.prithvi_credits,
            "streak_days": g.streak_days,
            "badge_tier": g.badge_tier,
            "avatar_url": g.avatar_url,
            "trees_adopted_count": trees_count
        })
    return results


@router.get("/rewards")
def get_rewards(db: Session = Depends(get_db)):
    rewards = db.query(Reward).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "cost_credits": r.cost_credits,
            "sponsor": r.sponsor,
            "description": r.description,
            "icon_name": r.icon_name,
            "stock": r.stock
        } for r in rewards
    ]


@router.post("/rewards/redeem")
def redeem_reward(payload: RedeemRequest, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == payload.reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    if reward.stock <= 0:
        raise HTTPException(status_code=400, detail="Reward out of stock")

    guardian = db.query(Guardian).filter(Guardian.phone == payload.guardian_phone).first()
    if not guardian:
        raise HTTPException(status_code=404, detail="Guardian with this phone number not found")

    if guardian.prithvi_credits < reward.cost_credits:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient Prithvi Credits. You have {guardian.prithvi_credits} pts, but {reward.cost_credits} pts required."
        )

    guardian.prithvi_credits -= reward.cost_credits
    reward.stock -= 1
    db.commit()

    # Generate voucher code
    voucher_code = f"VS-{reward.category[:3].upper()}-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M')}"

    return {
        "success": True,
        "message": f"Successfully redeemed '{reward.title}'!",
        "voucher_code": voucher_code,
        "remaining_credits": guardian.prithvi_credits,
        "sponsor": reward.sponsor
    }
