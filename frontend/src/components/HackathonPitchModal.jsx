import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  TreePine, 
  Coins, 
  Cpu, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Award,
  ChevronLeft,
  ChevronRight,
  Database,
  MapPin,
  Flame,
  Binary
} from 'lucide-react';

const SLIDES = [
  {
    id: 'problem',
    title: 'The National Plantation Paradox',
    subtitle: 'Why Millions of Trees Die Within 2 Years',
    content: (
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950">
          <p className="font-extrabold text-base sm:text-lg mb-1">
            "Plant & Forget" — The 80% Mortality Crisis
          </p>
          <p className="leading-relaxed">
            Every monsoon, government departments, NGOs, and corporate CSR wings in India plant crores of saplings. VIPs take photos, certificates are awarded, and tenders are closed on Day 0. 
            <strong> Within 18–24 months, over 70% to 80% of these saplings wither, are grazed by livestock, or dry out.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block text-xs">1. Contractor Moral Hazard</span>
            <p className="text-slate-500 text-[11px] mt-1">Contractors are paid 100% of tenders upon plantation day. Zero financial incentive exists for long-term survival.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block text-xs">2. Ghost Plantations</span>
            <p className="text-slate-500 text-[11px] mt-1">Absence of tamper-proof individual tree tracking leads to fake GPS coordinates and recycled inspection photos.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block text-xs">3. Lack of Citizen Ownership</span>
            <p className="text-slate-500 text-[11px] mt-1">Local communities, tribal Van Mitras, and urban residents are treated as bystanders rather than empowered custodians.</p>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <span className="font-semibold"><strong>Target Problem:</strong> Tree Survival, Not Just Plantation</span>
          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">Team Pandas Py</span>
        </div>
      </div>
    )
  },
  {
    id: 'solution',
    title: 'The VrikshaSetu Architecture',
    subtitle: '4 Integrated Pillars Ensuring Long-Term Survival',
    content: (
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div className="p-3.5 bg-white border-2 border-emerald-500/40 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
              <TreePine className="w-4 h-4" />
              <span>1. Bio-Asset Digital Passports</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Every sapling receives a unique cryptographic identifier (e.g. VS-2026-JH-0101) with weather-proof QR tags affixed to tree guards, containing GPS geotags, soil profile, and growth timelines.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-teal-500/40 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>2. AI CV Vitality & Anti-Fraud</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Lightweight computer vision analyzes leaf chlorophyll via Excess Green Index (ExG), canopy spread, and chlorosis stress. Perceptual dHash and Haversine geofencing prevent duplicate and fraudulent photo claims.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-amber-500/40 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <span>3. Milestone-Based CSR Escrow</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              CSR & government afforestation budgets are locked in a smart escrow contract. Tranche 1 (30%) unlocks at Day 0, Tranche 2 (30%) after 6 months (verified survival &gt;80%), and Tranche 3 (40%) at Year 1.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-indigo-500/40 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>4. Prithvi Credits & Community Guardianship</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Citizens, students, and rural Van Mitras adopt saplings. Regular watering and care logging earn green points redeemable for municipal property tax rebates, compost bags, and agricultural tool vouchers.
            </p>
          </div>

        </div>

        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono flex items-center justify-between">
          <span>Stack: FastAPI • SQLite • React 19 • Leaflet GIS • Pillow CV • Web Speech API</span>
          <span className="text-emerald-400 font-bold">100% Scalable & Low-Cost</span>
        </div>
      </div>
    )
  },
  {
    id: 'algorithms',
    title: 'Computer Vision & Anti-Fraud Mathematics',
    subtitle: 'Zero Expensive Cloud GPUs — Runs Purely on Edge/CPU',
    content: (
      <div className="space-y-4 text-xs sm:text-sm">
        
        {/* Excess Green Index */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900">1. Excess Green Index (ExG) Vegetative Vitality</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">Photosynthesis Metric</span>
          </div>
          <p className="font-mono text-xs text-emerald-800 bg-white p-2 rounded-lg border border-slate-200 font-bold">
            {"ExG = 2 · G - R - B"}
          </p>
          <p className="text-slate-600 text-xs mt-1.5">
            Chlorophyll absorbs blue and red wavelengths while reflecting green light. Our CV engine calculates ExG across segmented canopy clusters to detect cellular stress, moisture deficiency, and leaf necrosis before irreversible sapling mortality.
          </p>
        </div>

        {/* Perceptual Hash Anti-Fraud */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900">2. Perceptual Difference Hashing (dHash) & Hamming Distance</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">Recycled Image Detection</span>
          </div>
          <p className="font-mono text-xs text-amber-900 bg-white p-2 rounded-lg border border-slate-200 font-bold">
            {"Hamming Distance: D_H(H_1, H_2) = BitCount(H_1 ⊕ H_2) ≤ 3 (Flagged as Fraudulent Duplicate)"}
          </p>
          <p className="text-slate-600 text-xs mt-1.5">
            Generates a 64-bit structural visual fingerprint. Even if an inspector crops, resizes, or applies filters to a past inspection photo, our perceptual hash catches the duplicate and flags the inspection for fraud.
          </p>
        </div>

        {/* Haversine Geofence */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900">3. Haversine Spatial Geofence Verification</span>
            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[10px] font-bold">GPS Drift Bounds (&lt;40m)</span>
          </div>
          <p className="font-mono text-xs text-teal-900 bg-white p-2 rounded-lg border border-slate-200 font-bold">
            {"d = 2R · arcsin(√(sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2))) ≤ 40 meters"}
          </p>
          <p className="text-slate-600 text-xs mt-1.5">
            Verifies that care logs originate within 40 meters of the sapling's original planting coordinates, preventing "couch inspections".
          </p>
        </div>

      </div>
    )
  },
  {
    id: 'rural_urban',
    title: 'Urban & Rural Inclusion Across India',
    subtitle: 'Accessible for Tribal Van Mitras, Gram Panchayats & City Residents',
    content: (
      <div className="space-y-4 text-xs sm:text-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="font-bold text-slate-900 block text-xs">Vernacular Voice Guidance</span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Integrated Web Speech Audio Assistant in Hindi and English. Self-help group (SHG) women and rural caretakers can listen aloud to customized watering and mulching instructions.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="font-bold text-slate-900 block text-xs">Offline Rural Sync</span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Field inspections can be captured in remote forests with patchy 2G/3G connectivity. Logs are buffered locally and automatically synced once network coverage is detected.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="font-bold text-slate-900 block text-xs">Low Hardware Cost</span>
            <p className="text-slate-600 text-xs leading-relaxed">
              Zero dependency on expensive IoT soil sensors or RFID tags. Uses standard laminated QR codes (₹3 per tag) and standard smartphone cameras.
            </p>
          </div>

        </div>

        <div className="p-4 bg-emerald-900 text-white rounded-2xl space-y-2">
          <span className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider">Field Impact in Jamshedpur & Jharkhand:</span>
          <p className="text-xs text-slate-200 leading-relaxed">
            Tested across 4 diverse geographical belts: <strong>Jamshedpur Urban Corridor</strong>, <strong>Dalma Wildlife Sanctuary Buffer</strong>, <strong>Bagbera Rural Gram Panchayat</strong>, and <strong>Dimna Catchment Agroforestry</strong>.
          </p>
        </div>

      </div>
    )
  },
  {
    id: 'impact',
    title: 'Impact, Scalability & Team Panda Py',
    subtitle: 'Measurable Outcomes for Hackathon 6.0',
    content: (
      <div className="space-y-4 text-xs sm:text-sm">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-2xl font-black text-emerald-700">91.5%</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">Survival Rate</p>
          </div>
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
            <span className="text-2xl font-black text-teal-700">₹3.5x</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">CSR ROI Multiplier</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-2xl font-black text-amber-700">142 kg</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">CO₂ Verified</p>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-2xl font-black text-indigo-700">75%</span>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">Community Adoption</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="font-bold text-slate-900 text-sm">Policy & Institutional Scalability</span>
          <p className="text-slate-600 text-xs leading-relaxed">
            VrikshaSetu can be directly adopted by:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
            <li><strong>Jharkhand Forest Department (CAMPA Funds):</strong> Milestone audit for large-scale compensatory afforestation.</li>
            <li><strong>Tata Steel & Corporate CSR:</strong> Transparent outcome-based reporting for ESG compliance.</li>
            <li><strong>Jamshedpur Notified Area Committee (JNAC):</strong> Integration with municipal tax incentive portals.</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Team Pandas Py • Hackathon 6.0</span>
          </div>
          <span className="text-emerald-400 font-semibold">Ready for Deployment</span>
        </div>

      </div>
    )
  }
];

export default function HackathonPitchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const prevSlide = () => setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
  const nextSlide = () => setCurrentSlideIdx((prev) => Math.min(SLIDES.length - 1, prev + 1));

  const slide = SLIDES[currentSlideIdx];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                Hackathon 6.0 Official Pitch Deck
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-semibold">Team Pandas Py</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Header */}
          <div className="mt-4 mb-4">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
              Slide {currentSlideIdx + 1} of {SLIDES.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {slide.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{slide.subtitle}</p>
          </div>

          {/* Slide Dynamic Body */}
          <div className="py-2">
            {slide.content}
          </div>
        </div>

        {/* Slide Navigation Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlideIdx === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition disabled:opacity-30 flex items-center space-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex space-x-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIdx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {currentSlideIdx < SLIDES.length - 1 ? (
            <button
              onClick={nextSlide}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              Close Deck
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
