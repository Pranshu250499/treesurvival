import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TreePine, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  AlertTriangle, 
  Droplet, 
  Sparkles, 
  ArrowUpRight, 
  Coins, 
  ChevronRight, 
  Flame, 
  Leaf
} from 'lucide-react';
import TreeMap from '../components/TreeMap';
import { fetchOverviewStats, fetchTrees, fetchSpeciesBreakdown } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ onSelectTree, onAdoptTree, onOpenAIScan, onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [trees, setTrees] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  useEffect(() => {
    async function loadData() {
      try {
        const [overviewRes, treesRes, speciesRes] = await Promise.all([
          fetchOverviewStats(),
          fetchTrees(),
          fetchSpeciesBreakdown()
        ]);
        setStats(overviewRes);
        setTrees(treesRes);
        setSpeciesData(speciesRes);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stressedTrees = trees.filter(t => t.status === 'needs_attention' || t.status === 'critical');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-emerald-900/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.teamBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t.hero.title} <span className="text-emerald-400">{t.hero.titleHighlight}</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {t.hero.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenAIScan}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>{t.hero.launchAI}</span>
            </button>
            <button
              onClick={() => onNavigateTab('drives')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.exploreEscrow}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Primary Survival KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Survival Rate Card */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.kpi.trueSurvival}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{t.kpi.verified}</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-700">
              {stats?.overall_survival_pct ?? 91.5}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-1">
            <span className="text-emerald-600 font-bold">vs 22%</span>
            <span>{t.kpi.vsNational}</span>
          </div>
        </div>

        {/* Tracked Trees */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.kpi.livingSaplings}</span>
            <TreePine className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats?.living_trees ?? 19} <span className="text-xs text-slate-400 font-normal">/ {stats?.total_trees ?? 20}</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            {stats?.healthy_count ?? 15} {t.kpi.thriving}
          </p>
        </div>

        {/* Community Ownership */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.kpi.adoptedGuardianship}</span>
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats?.adoption_rate_pct ?? 75}%
          </p>
          <p className="mt-1 text-[11px] text-indigo-700 font-medium">
            {stats?.total_guardians ?? 5} {t.kpi.activeCaretakers}
          </p>
        </div>

        {/* Carbon Sequestration */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.kpi.co2Absorbed}</span>
            <Leaf className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {stats?.total_co2_kg ?? 142} <span className="text-xs text-slate-500 font-normal">kg</span>
          </p>
          <p className="mt-1 text-[11px] text-teal-700 font-medium">
            {t.kpi.derivedFrom}
          </p>
        </div>

        {/* CSR Milestone Escrow */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.kpi.milestoneEscrow}</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            ₹{((stats?.disbursed_budget_inr ?? 1620000) / 100000).toFixed(1)}L
          </p>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">
            ₹{((stats?.escrow_locked_inr ?? 1130000) / 100000).toFixed(1)}L {t.kpi.lockedAudit}
          </p>
        </div>

      </div>

      {/* Urgent Field Alerts Bar */}
      {stressedTrees.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>{isHi ? "देखभाल चेतावनी:" : "Care Dispatch Alert:"}</strong> {stressedTrees.length} {isHi ? "पौधों में नमी की कमी अथवा पत्तियों में पीलापन पाया गया है। संबंधित अभिभावकों को सिंचाई सूचना प्रेषित कर दी गई है।" : "saplings show chlorosis or moisture stress in the Jamshedpur region. Automated care notifications have been dispatched to assigned guardians."}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('trees')}
            className="shrink-0 ml-3 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
          >
            {isHi ? "जोखिम वाले पौधे देखें" : "Review At-Risk Trees"}
          </button>
        </div>
      )}

      {/* Main Grid: GIS Map + Analytics Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GIS Map (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isHi ? "लाइव जीआईएस उत्तरजीविता हीटमैप" : "Live GIS Survival Heatmap"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? "जमशेदपुर शहरी व ग्रामीण गलियारों के पौधों का रियल-टाइम स्वास्थ्य" : "Real-time geospatial health pins across Jamshedpur urban and rural afforestation corridors"}
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● {trees.length} {isHi ? "सक्रिय बीकन" : "Live Sapling Beacons"}
            </span>
          </div>

          <TreeMap
            trees={trees}
            onSelectTree={onSelectTree}
            onAdoptTree={onAdoptTree}
          />
        </div>

        {/* Right 4 Cols: Species Survival & AI Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Native Species Survival Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900">
                {isHi ? "देशी प्रजातियों की उत्तरजीविता" : "Native Species Survival Index"}
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {isHi ? "झारखंड की वनस्पति" : "Jharkhand Flora"}
              </span>
            </div>

            <div className="space-y-2.5">
              {speciesData.slice(0, 5).map((sp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">{sp.common_name}</span>
                    <span className="text-emerald-700 font-bold">{sp.survival_rate_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sp.survival_rate_pct >= 90 ? 'bg-emerald-500' :
                        sp.survival_rate_pct >= 75 ? 'bg-teal-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${sp.survival_rate_pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>{sp.planted_count} {isHi ? "पौधे" : "saplings"}</span>
                    <span>{sp.co2_absorbed_kg} kg CO₂</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
              💡 <strong>{isHi ? "विश्लेषण:" : "Insight:"}</strong> {isHi ? "साखुआ (Sal) व नीम (Neem) जैसी स्थानीय प्रजातियां 95%+ उत्तरजीविता दर्शाती हैं।" : "Native species like Sal and Neem demonstrate a 95%+ survival rate compared to non-indigenous varieties."}
            </div>
          </div>

          {/* CSR Milestone Escrow Framework */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-slate-900">
                {isHi ? "माइलस्टोन आधारित सीएसआर एस्क्रो" : "Milestone-Based Escrow"}
              </h4>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {isHi ? "घोटालों की रोकथाम: फंड केवल सत्यापित जैविक जीवित रहने पर ही किस्तों में जारी होता है:" : "Preventing fraud: CSR & Govt funds unlock in tranches strictly tied to verified biological survival:"}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <div className="flex-1">
                  <p className="font-bold text-emerald-900">{isHi ? "किस्त 1 (30%): दिन 0 रोपण" : "Tranche 1 (30%): Day 0 Planting"}</p>
                  <p className="text-[10px] text-emerald-700">{isHi ? "जियोटैग फोटो व पंजीकरण पर जारी" : "Released upon geotagged photo registration"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-2 bg-amber-50 rounded-xl border border-amber-200">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <div className="flex-1">
                  <p className="font-bold text-amber-900">{isHi ? "किस्त 2 (30%): माह 6 जीवित रहने पर" : "Tranche 2 (30%): Month 6 Survival"}</p>
                  <p className="text-[10px] text-amber-700">{isHi ? "80% से अधिक जीवित रहने पर ही अनलॉक" : "Unlocked only if verified survival > 80%"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{isHi ? "किस्त 3 (40%): वर्ष 1 परिपक्वता" : "Tranche 3 (40%): Year 1 Establishment"}</p>
                  <p className="text-[10px] text-slate-600">{isHi ? "एआई व फील्ड ऑडिट के उपरांत अंतिम भुगतान" : "Final payout following AI satellite + field audit"}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('drives')}
              className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition cursor-pointer"
            >
              <span>{isHi ? "पौधरोपण एस्क्रो प्रबंधित करें" : "Manage Plantation Escrow"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
