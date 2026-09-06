import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  TreePine, 
  Droplet, 
  Flame, 
  Sparkles, 
  Camera, 
  Coins, 
  Calendar, 
  Award, 
  CheckCircle2, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { fetchTrees } from '../services/api';

export default function GuardianPortal({ onSelectTree, onInspectTree, onNavigateTab }) {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const allTrees = await fetchTrees();
        // Filter trees that have an assigned guardian
        setTrees(allTrees.filter(t => t.is_adopted));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Guardian Profile Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-inner">
              <HeartHandshake className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black">Vriksha Rakshak Portal</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  Sapling Guardian Tier
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Stewardship hub for community caretakers, farmers, and students across Jharkhand
              </p>
            </div>
          </div>

          {/* Points & Streaks */}
          <div className="flex items-center space-x-3 bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="px-3 border-r border-white/10 text-center">
              <div className="flex items-center space-x-1 text-amber-300 text-xs font-bold justify-center">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span>18 Days</span>
              </div>
              <span className="text-[10px] text-slate-300">Care Streak</span>
            </div>

            <div className="px-3 text-center">
              <div className="flex items-center space-x-1 text-emerald-300 text-xs font-bold justify-center">
                <Coins className="w-4 h-4 text-amber-300" />
                <span>480 Pts</span>
              </div>
              <span className="text-[10px] text-slate-300">Prithvi Credits</span>
            </div>
          </div>

        </div>
      </div>

      {/* Care Tasks Due Today */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Scheduled Care Tasks (Today)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Weather: 28°C Partly Cloudy (Good for watering)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-emerald-950">Water & Check Soil Moisture</p>
              <p className="text-[11px] text-emerald-700">Neem Sapling (VS-2026-JH-0101) • Northern Town</p>
            </div>
            <button
              onClick={() => onInspectTree(trees[0] || { id: 1, tree_code: "VS-2026-JH-0101", common_name: "Neem" })}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-950">Inspect Tree Guard / Fencing</p>
              <p className="text-[11px] text-amber-800">Sal Tree (VS-2026-JH-0201) • Dalma Corridor</p>
            </div>
            <button
              onClick={() => onInspectTree(trees[1] || { id: 2, tree_code: "VS-2026-JH-0201", common_name: "Sal" })}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Adopted Trees Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">My Adopted Saplings ({trees.length})</h3>
          <button
            onClick={() => onNavigateTab('trees')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Adopt More Saplings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <div
              key={tree.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <img
                    src={tree.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200'}
                    alt={tree.common_name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {tree.tree_code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight mt-1">{tree.common_name}</h4>
                    <p className="text-[11px] text-slate-500 italic truncate">{tree.species}</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mt-3 p-2 bg-slate-50 rounded-xl">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Survival Vitality</span>
                    <span className="text-emerald-700 font-bold">{tree.survival_score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${tree.survival_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>Guardian: {tree.guardian_name}</span>
                  <span>Water every {tree.watering_frequency_days}d</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex space-x-2">
                <button
                  onClick={() => onSelectTree(tree.id)}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Passport
                </button>
                <button
                  onClick={() => onInspectTree(tree)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
