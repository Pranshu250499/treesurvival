import os
import datetime
import qrcode
from sqlalchemy.orm import Session
from app.models.database import PlantationDrive, Tree, InspectionLog, Guardian, Reward

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
QR_DIR = os.path.join(UPLOAD_DIR, "qr_codes")
os.makedirs(QR_DIR, exist_ok=True)

def generate_qr_code(tree_code: str) -> str:
    """Generate a clean QR code PNG for a tree."""
    qr_filename = f"{tree_code}.png"
    qr_path = os.path.join(QR_DIR, qr_filename)
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(f"VRIKSHASETU://TREE/{tree_code}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="#15803d", back_color="white")
    img.save(qr_path)
    
    return f"/uploads/qr_codes/{qr_filename}"

def seed_database(db: Session):
    # Check if data already exists
    if db.query(PlantationDrive).count() > 0:
        return

    # 1. Create Plantation Drives (Jamshedpur & Jharkhand regional context)
    drives = [
        PlantationDrive(
            title="Tata Steel Urban Green Belt - Jubilee Park Corridor",
            organization="Tata Steel CSR & JUSCO",
            description="Urban afforestation to expand green lung coverage along Subarnarekha River and Jubilee Park perimeter. Focus on broad-canopy native species.",
            location_name="Jubilee Park, Northern Town, Jamshedpur",
            district="East Singhbhum (Jamshedpur)",
            state="Jharkhand",
            center_lat=22.8056,
            center_lng=86.1950,
            target_count=500,
            planted_count=420,
            budget_inr=650000.0,
            escrow_stage="Phase 2 (6-Month Survival Audit)",
            escrow_released_pct=60,
            status="Active",
            banner_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
        ),
        PlantationDrive(
            title="Dalma Wildlife Sanctuary Eco-Buffer Afforestation",
            organization="Jharkhand Forest Dept & Wildlife Trust",
            description="Restoration of degraded elephant corridor foothills with native Sal, Mahua, and Arjun trees to reduce human-elephant conflict.",
            location_name="Dalma Foothills, Chandil Range",
            district="Seraikela-Kharsawan",
            state="Jharkhand",
            center_lat=22.8980,
            center_lng=86.2085,
            target_count=1200,
            planted_count=1150,
            budget_inr=1500000.0,
            escrow_stage="Phase 1 (Planting Verified)",
            escrow_released_pct=30,
            status="Active",
            banner_url="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80"
        ),
        PlantationDrive(
            title="Bagbera Gram Panchayat Community Agro-Forestry",
            organization="Bagbera Village Council & PRADAN",
            description="Empowering rural self-help groups and smallholder farmers with fruit-bearing and medicinal timber trees (Jamun, Neem, Mahua) with direct survival incentives.",
            location_name="Bagbera Colony & Rural Panchayat",
            district="East Singhbhum (Jamshedpur)",
            state="Jharkhand",
            center_lat=22.7712,
            center_lng=86.1820,
            target_count=350,
            planted_count=310,
            budget_inr=420000.0,
            escrow_stage="Phase 3 (1-Year Survival Completion)",
            escrow_released_pct=100,
            status="Completed",
            banner_url="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop&q=80"
        ),
        PlantationDrive(
            title="Telco Colony Citizen RWA Adopt-a-Canopy",
            organization="Telco Residents Welfare Association",
            description="Neighborhood citizen stewardship initiative where each resident family adopts and nurtures saplings outside their avenue.",
            location_name="Telco Colony, Sector 2 & 4, Jamshedpur",
            district="East Singhbhum (Jamshedpur)",
            state="Jharkhand",
            center_lat=22.7845,
            center_lng=86.2415,
            target_count=200,
            planted_count=185,
            budget_inr=180000.0,
            escrow_stage="Phase 2 (6-Month Survival Audit)",
            escrow_released_pct=60,
            status="Active",
            banner_url="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80"
        )
    ]
    db.add_all(drives)
    db.commit()

    # 2. Guardians (Local community representatives)
    guardians = [
        Guardian(
            name="Ramesh Hansda",
            phone="9835100001",
            email="ramesh.hansda@gmail.com",
            role="Farmer & Van Mitra",
            ward_or_village="Bagbera Gram Panchayat",
            prithvi_credits=480,
            streak_days=18,
            badge_tier="Forest Custodian",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        ),
        Guardian(
            name="Priya Sharma",
            phone="9835100002",
            email="priya.sharma@nitjsr.ac.in",
            role="Student, NIT Jamshedpur",
            ward_or_village="Adityapur Green Club",
            prithvi_credits=310,
            streak_days=12,
            badge_tier="Canopy Champion",
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
        ),
        Guardian(
            name="Amit Verma",
            phone="9835100003",
            email="amit.verma@telco-rwa.org",
            role="Citizen / RWA Secretary",
            ward_or_village="Telco Colony Sector 4",
            prithvi_credits=220,
            streak_days=9,
            badge_tier="Sapling Guardian",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
        ),
        Guardian(
            name="Sunita Murmu",
            phone="9835100004",
            email="sunita.murmu@jharkhandpanchayat.in",
            role="Panchayat Ward Head",
            ward_or_village="Bagbera Ward 3",
            prithvi_credits=650,
            streak_days=28,
            badge_tier="Forest Custodian",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        ),
        Guardian(
            name="Vikramaditya Roy",
            phone="9835100005",
            email="vikram.roy@tatasteel.com",
            role="Corporate Volunteer",
            ward_or_village="Northern Town, Jamshedpur",
            prithvi_credits=140,
            streak_days=6,
            badge_tier="Seedling Sentry",
            avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        )
    ]
    db.add_all(guardians)
    db.commit()

    # 3. Species catalog and sapling templates
    species_pool = [
        {"species": "Azadirachta indica", "common": "Neem (नीम)", "soil": "Red Gravel Loam", "water": 3, "co2": 5.2},
        {"species": "Shorea robusta", "common": "Sal / Sakhua (साल/साखुआ)", "soil": "Deep Laterite Clay", "water": 4, "co2": 6.8},
        {"species": "Ficus religiosa", "common": "Peepal (पीपल)", "soil": "Alluvial Loam", "water": 5, "co2": 8.4},
        {"species": "Ficus benghalensis", "common": "Banyan / Bargad (बरगद)", "soil": "Sandy Loam", "water": 4, "co2": 9.1},
        {"species": "Syzygium cumini", "common": "Jamun (जामुन)", "soil": "Moist Clay Loam", "water": 2, "co2": 4.5},
        {"species": "Madhuca longifolia", "common": "Mahua (महुआ)", "soil": "Red Rocky Soil", "water": 5, "co2": 5.8},
        {"species": "Delonix regia", "common": "Gulmohar (गुलमोहर)", "soil": "Well-drained Loam", "water": 3, "co2": 3.9},
        {"species": "Terminalia arjuna", "common": "Arjun (अर्जुन)", "soil": "Riverbank Alluvial", "water": 2, "co2": 6.1}
    ]

    sample_photos = [
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80"
    ]

    # Pre-populate 20 Realistic Trees across the 4 drives
    trees_to_add = []
    tree_specs = [
        # Jubilee Park Drive (Drive ID 1, lat: ~22.8056, lng: ~86.1950)
        (1, "VS-2026-JH-0101", 0, 22.8061, 86.1945, "healthy", 94.0, 95.0, 68.0, 1, "Ramesh Hansda", 140),
        (1, "VS-2026-JH-0102", 1, 22.8048, 86.1962, "healthy", 89.5, 78.0, 52.0, 2, "Priya Sharma", 110),
        (1, "VS-2026-JH-0103", 2, 22.8070, 86.1930, "healthy", 96.0, 115.0, 85.0, 5, "Vikramaditya Roy", 180),
        (1, "VS-2026-JH-0104", 4, 22.8035, 86.1975, "needs_attention", 64.0, 55.0, 38.0, None, None, 45),
        (1, "VS-2026-JH-0105", 6, 22.8080, 86.1940, "critical", 38.0, 42.0, 24.0, None, None, 30),

        # Dalma Wildlife Eco-Buffer (Drive ID 2, lat: ~22.8980, lng: ~86.2085)
        (2, "VS-2026-JH-0201", 1, 22.8975, 86.2090, "healthy", 91.0, 82.0, 58.0, 1, "Ramesh Hansda", 90),
        (2, "VS-2026-JH-0202", 5, 22.8992, 86.2078, "healthy", 88.0, 70.0, 48.0, 4, "Sunita Murmu", 90),
        (2, "VS-2026-JH-0203", 7, 22.8965, 86.2102, "healthy", 93.0, 90.0, 64.0, 4, "Sunita Murmu", 120),
        (2, "VS-2026-JH-0204", 0, 22.8985, 86.2065, "needs_attention", 68.0, 58.0, 36.0, None, None, 60),
        (2, "VS-2026-JH-0205", 1, 22.9001, 86.2110, "dead", 12.0, 38.0, 15.0, None, None, 75),

        # Bagbera Gram Panchayat Agro-Forestry (Drive ID 3, lat: ~22.7712, lng: ~86.1820)
        (3, "VS-2026-JH-0301", 4, 22.7708, 86.1815, "healthy", 97.0, 130.0, 95.0, 4, "Sunita Murmu", 210),
        (3, "VS-2026-JH-0302", 0, 22.7725, 86.1832, "healthy", 95.0, 125.0, 90.0, 1, "Ramesh Hansda", 210),
        (3, "VS-2026-JH-0303", 5, 22.7695, 86.1802, "healthy", 92.5, 110.0, 78.0, 4, "Sunita Murmu", 180),
        (3, "VS-2026-JH-0304", 2, 22.7730, 86.1840, "healthy", 98.0, 145.0, 110.0, 1, "Ramesh Hansda", 240),
        (3, "VS-2026-JH-0305", 7, 22.7715, 86.1825, "needs_attention", 71.0, 85.0, 55.0, None, None, 150),

        # Telco Colony RWA (Drive ID 4, lat: ~22.7845, lng: ~86.2415)
        (4, "VS-2026-JH-0401", 6, 22.7850, 86.2410, "healthy", 93.0, 88.0, 62.0, 3, "Amit Verma", 130),
        (4, "VS-2026-JH-0402", 0, 22.7838, 86.2425, "healthy", 90.0, 76.0, 50.0, 3, "Amit Verma", 110),
        (4, "VS-2026-JH-0403", 4, 22.7860, 86.2402, "healthy", 95.0, 98.0, 72.0, 2, "Priya Sharma", 140),
        (4, "VS-2026-JH-0404", 3, 22.7830, 86.2430, "needs_attention", 66.0, 62.0, 40.0, None, None, 50),
        (4, "VS-2026-JH-0405", 1, 22.7855, 86.2420, "healthy", 89.0, 80.0, 54.0, 3, "Amit Verma", 100),
    ]

    for d_id, code, sp_idx, lat, lng, status, score, height, canopy, g_id, g_name, days_ago in tree_specs:
        sp = species_pool[sp_idx]
        qr_url = generate_qr_code(code)
        photo = sample_photos[sp_idx % len(sample_photos)]
        planted_dt = datetime.datetime.utcnow() - datetime.timedelta(days=days_ago)

        t = Tree(
            tree_code=code,
            drive_id=d_id,
            species=sp["species"],
            common_name=sp["common"],
            planted_date=planted_dt,
            lat=lat,
            lng=lng,
            soil_type=sp["soil"],
            status=status,
            survival_score=score,
            current_height_cm=height,
            canopy_spread_cm=canopy,
            last_inspected_at=datetime.datetime.utcnow() - datetime.timedelta(days=min(5, days_ago % 10)),
            qr_code_url=qr_url,
            photo_url=photo,
            initial_photo_url="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&auto=format&fit=crop&q=80",
            is_adopted=(g_id is not None),
            guardian_id=g_id,
            guardian_name=g_name,
            guardian_role="Community Guardian" if g_name else None,
            watering_frequency_days=sp["water"],
            is_fenced=True,
            carbon_absorbed_kg=round((height / 100.0) * sp["co2"], 2)
        )
        trees_to_add.append(t)

    db.add_all(trees_to_add)
    db.commit()

    # 4. Create Historical Inspection Logs for key trees (Demonstrating timeline progression)
    sample_tree = db.query(Tree).filter(Tree.tree_code == "VS-2026-JH-0101").first()
    if sample_tree:
        logs = [
            InspectionLog(
                tree_id=sample_tree.id,
                inspection_date=sample_tree.planted_date,
                inspector_name="Tata Green Team",
                inspector_role="Drive Organizer",
                photo_url="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80",
                height_cm=45.0,
                canopy_spread_cm=25.0,
                soil_moisture_level="Damp",
                health_status="healthy",
                ai_survival_score=95.0,
                ai_vitality_index=0.92,
                ai_notes="Day 0 Baseline: Sapling transplanted with protective bamboo tree-guard. Soil prepared with compost.",
                lat=sample_tree.lat,
                lng=sample_tree.lng,
                distance_from_origin_m=0.0,
                fraud_flag=False,
                is_verified=True
            ),
            InspectionLog(
                tree_id=sample_tree.id,
                inspection_date=sample_tree.planted_date + datetime.timedelta(days=45),
                inspector_name="Ramesh Hansda",
                inspector_role="Guardian",
                photo_url="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80",
                height_cm=62.0,
                canopy_spread_cm=40.0,
                soil_moisture_level="Adequate",
                health_status="healthy",
                ai_survival_score=92.0,
                ai_vitality_index=0.88,
                ai_notes="Day 45 Milestone: Active apical shoot growth. Weeding completed around root base.",
                lat=sample_tree.lat + 0.00002,
                lng=sample_tree.lng - 0.00001,
                distance_from_origin_m=2.6,
                fraud_flag=False,
                is_verified=True
            ),
            InspectionLog(
                tree_id=sample_tree.id,
                inspection_date=sample_tree.planted_date + datetime.timedelta(days=120),
                inspector_name="Ramesh Hansda",
                inspector_role="Guardian",
                photo_url="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
                height_cm=95.0,
                canopy_spread_cm=68.0,
                soil_moisture_level="Adequate",
                health_status="healthy",
                ai_survival_score=94.0,
                ai_vitality_index=0.91,
                ai_notes="Day 120 Milestone: Sturdy trunk lignification. Canopy expanding well, pest resistance high.",
                lat=sample_tree.lat + 0.00001,
                lng=sample_tree.lng + 0.00001,
                distance_from_origin_m=1.8,
                fraud_flag=False,
                is_verified=True
            )
        ]
        db.add_all(logs)
        db.commit()

    # 5. Rewards / Green Credit Marketplace
    rewards = [
        Reward(
            title="15% Municipal Property Tax Rebate",
            category="Municipal Benefit",
            cost_credits=300,
            sponsor="Jamshedpur Notified Area Committee (JNAC)",
            description="Official property tax rebate voucher issued by JNAC for maintaining verified surviving trees for over 6 months.",
            icon_name="Percent",
            stock=45
        ),
        Reward(
            title="50kg Certified Vermicompost Bag",
            category="Agri Supplies",
            cost_credits=150,
            sponsor="Jharkhand State Organic Mission",
            description="High-grade nutrient-rich organic vermicompost to enrich your home garden or farm soil.",
            icon_name="Sprout",
            stock=80
        ),
        Reward(
            title="Rs 500 Tata 1mg / Retail CSR Voucher",
            category="CSR Voucher",
            cost_credits=250,
            sponsor="Tata Steel CSR Foundation",
            description="Redeemable retail voucher acknowledging active green citizenship and tree survival stewardship.",
            icon_name="Gift",
            stock=30
        ),
        Reward(
            title="Van Rakshak Honor Certificate",
            category="Forest Certificate",
            cost_credits=100,
            sponsor="Divisional Forest Office, Dalma Range",
            description="Officially recognized certificate of environmental stewardship signed by the Divisional Forest Officer.",
            icon_name="Award",
            stock=100
        )
    ]
    db.add_all(rewards)
    db.commit()
