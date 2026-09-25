# 🌲 VrikshaSetu (वृक्ष सेतु)
### *Tree Survival, Not Just Plantation*
**Hackathon 6.0 • Team Pandas Py (Jamshedpur)**

---

## 📌 Problem Statement
> **"Tree Survival, Not Just Plantation"**
> *India's tree plantation drives focus heavily on planting, but weak monitoring and ownership mean millions of saplings fail to survive beyond a few years. Design a low-cost, scalable system that ensures long-term tree survival through tracking, accountability, community ownership, and incentives across urban and rural India.*

---

## 💡 The VrikshaSetu Solution
In India, an estimated **70% to 80% of saplings die within 24 months** of afforestation drives due to contractor moral hazard and "Plant & Forget" culture. **VrikshaSetu** transforms afforestation into an outcome-verified, community-sustained bio-asset ecosystem.

```
                                VrikshaSetu Ecosystem
                                
       [ Field Planting ]                   [ AI Verification ]               [ Escrow & Incentives ]
                │                                    │                                   │
 ┌──────────────▼──────────────┐      ┌──────────────▼──────────────┐     ┌──────────────▼──────────────┐
 │ • Indigenous Sapling Geotag │      │ • Excess Green Index (ExG)  │     │ • Milestone CSR Escrow      │
 │ • Unique QR Bio-Passport    │ ───► │ • Anti-Fraud dHash Fingerpr.│ ──► │   (30% -> 30% -> 40%)       │
 │ • Offline Rural Buffer      │      │ • Haversine Geofence (<40m) │     │ • Prithvi Credits / Rebates │
 └─────────────────────────────┘      └─────────────────────────────┘     └─────────────────────────────┘
                │                                    │                                   │
                └────────────────────────────────────┼───────────────────────────────────┘
                                                     ▼
                                      [ Community Guardianship ]
                                 (Citizens, Students, Van Mitras)
```

---

## 🚀 Key Features

### 1. 🆔 Individual Bio-Asset Passports & Instant QR Scanner
- Unique identifiers for every sapling (e.g. `VS-2026-JH-0101`).
- Physical laminated QR tags affixed to tree guards (costing < ₹3).
- Instant lookup via camera or code search to access growth timelines, soil profiles, and health indices.

### 2. 🧠 Edge Computer Vision Health Engine (Zero Cost GPUs)
- **Excess Green Index ($ExG = 2G - R - B$)**: Analyzes chlorophyll reflectance to detect dehydration, leaf wilting, and chlorosis before sapling mortality.
- **Perceptual Difference Hashing ($dHash$)**: Detects recycled or duplicate photos using 64-bit visual fingerprints ($D_H \le 3$ flags fraud).
- **Haversine Geofence Validation**: Flags inspections logged $>40\text{m}$ away from the initial planting GPS coordinates.

### 3. 🛡️ Milestone-Based CSR & Government Escrow
- Tenders and CSR funds are released in 3 survival-locked tranches:
  - **Tranche 1 (30%)**: Day 0 geotagged planting verification.
  - **Tranche 2 (30%)**: Month 6 audit (released only if verified survival $>80\%$).
  - **Tranche 3 (40%)**: Year 1 maturity and canopy establishment.

### 4. 🪙 Prithvi Credits & Community Guardianship
- Citizens, college students, and tribal **Van Mitras** adopt saplings.
- Periodic watering and care logging earn **Prithvi Credits**.
- Redeemable for **municipal property tax rebates**, organic vermicompost bags, and agricultural toolkits.

### 5. 🗣️ Rural Vernacular Inclusion & Web Speech Audio Guide
- Instant toggle between **English** and **हिन्दी (Hindi)**.
- **Web Speech Audio Guide**: Speaks personalized care instructions aloud in Hindi for rural Gram Panchayat and Self-Help Group (SHG) volunteers.
- **Rural Offline Buffer**: Stores logs locally in low-connectivity forest patches and auto-syncs when online.



---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Leaflet GIS, Lucide Icons, Web Speech API, Canvas Confetti
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite, Pillow (PIL) Computer Vision, QRCode Generator
- **Algorithms**: Excess Green Index (ExG), Difference Hash (dHash), Haversine Distance

---

## ⚡ Quick Start (1-Click Run)

### Option A: Windows Batch Launcher (Recommended for Judges)
Simply double-click:
```bat
start_vrikshasetu.bat
```
This script tests the backend, spins up FastAPI on `http://127.0.0.1:8000`, starts Vite on `http://localhost:5173`, and opens your browser automatically!

### Option B: Manual Terminal Execution

#### 1. Start Backend:
```bash
cd backend
python test_api.py   # Verify database & AI engine
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: `http://127.0.0.1:8000/docs`

#### 2. Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open in Browser: `http://localhost:5173`

---

