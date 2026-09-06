import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  TreePine, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { fetchDrives, advanceDriveEscrow } from '../services/api';

export default function DrivesPage({ onSelectDrive, onNavigateTree }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advancingId, setAdvancingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    loadDrives();
  }, []);

  async function loadDrives() {
    setLoading(true);
    try {
      const data = await fetchDrives();
      setDrives(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdvanceEscrow = async (driveId) => {
    setAdvancingId(driveId);
    try {
      const res = await advanceDriveEscrow(driveId);
      setAlertMessage(res.message);
      await loadDrives();
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancingId(null);
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">CSR & Government Plantation Drives</h2>
          <p className="text-xs text-slate-500 mt-1">
            Outcome-Based Funding: CSR capital is held in milestone escrow and disbursed strictly upon verified sapling survival
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Escrow Protected Drives
          </span>
        </div>
      </div>

      {alertMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Escrow Mechanism Explainer Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 border border-slate-700 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Zero-Waste CSR Protocol
          </span>
          <h3 className="text-xl font-extrabold mt-2">How VrikshaSetu Eliminates "Plant & Forget" Waste</h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Traditional corporate & govt drives hand over 100% of the funds on plantation day. Contractors disappear, and 80% of trees die within months. 
            VrikshaSetu locks funds into smart tranches: <strong>30% at planting, 30% after 6-month AI survival audit, and 40% at Year 1 maturity.</strong>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-emerald-400">Tranche 1 (30%)</span>
            <p className="text-sm font-extrabold mt-0.5">Day 0 Planting Verified</p>
            <p className="text-[11px] text-slate-400 mt-1">Geotagged registration + physical QR tag attached.</p>
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-amber-400">Tranche 2 (30%)</span>
            <p className="text-sm font-extrabold mt-0.5">Month 6 Survival Audit</p>
            <p className="text-[11px] text-slate-400 mt-1">Released only if survival rate exceeds 80%.</p>
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-teal-400">Tranche 3 (40%)</span>
            <p className="text-sm font-extrabold mt-0.5">Year 1 Canopy Established</p>
            <p className="text-[11px] text-slate-400 mt-1">Final payout to community caretakers & contractors.</p>
          </div>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {drives.map((drive) => (
          <div
            key={drive.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-emerald-200 transition"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {drive.organization}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{drive.location_name}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{drive.title}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total CSR Budget</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{(drive.budget_inr / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* Metrics and Escrow Progress Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* Stats column */}
              <div className="sm:col-span-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Tracked Saplings</span>
                  <p className="text-base font-extrabold text-slate-900">{drive.stats?.total_tracked_trees ?? 0}</p>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-emerald-800 text-[10px] uppercase font-bold">Survival Rate</span>
                  <p className="text-base font-extrabold text-emerald-700">{drive.stats?.survival_rate_pct ?? 92}%</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Adopted Trees</span>
                  <p className="text-base font-extrabold text-indigo-700">{drive.stats?.adopted_count ?? 0}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">CO₂ Absorbed</span>
                  <p className="text-base font-extrabold text-teal-700">{drive.stats?.carbon_absorbed_kg ?? 0} kg</p>
                </div>
              </div>

              {/* Escrow Progress Bar */}
              <div className="sm:col-span-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">
                    Escrow Stage: <strong className="text-emerald-700">{drive.escrow_stage}</strong>
                  </span>
                  <span className="text-slate-900 font-bold">
                    {drive.escrow_released_pct}% Disbursed (₹{((drive.budget_inr * drive.escrow_released_pct) / 10000000).toFixed(2)}L)
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${drive.escrow_released_pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    Locked in Escrow: <strong>₹{((drive.budget_inr * (100 - drive.escrow_released_pct)) / 100000).toFixed(2)} Lakhs</strong>
                  </span>

                  {drive.escrow_released_pct < 100 ? (
                    <button
                      onClick={() => handleAdvanceEscrow(drive.id)}
                      disabled={advancingId === drive.id}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{advancingId === drive.id ? 'Verifying...' : 'Audit & Release Next Tranche'}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>100% Escrow Disbursed</span>
                    </span>
                  )}
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
