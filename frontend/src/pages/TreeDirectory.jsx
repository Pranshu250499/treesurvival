import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  TreePine, 
  HeartHandshake, 
  Eye, 
  QrCode, 
  Camera, 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Droplet,
  Sparkles
} from 'lucide-react';
import { fetchTrees } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function TreeDirectory({ onSelectTree, onAdoptTree, onInspectTree, onOpenQR, onOpenRegister }) {
  const [trees, setTrees] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adoptedFilter, setAdoptedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  useEffect(() => {
    loadTrees();
  }, []);

  async function loadTrees() {
    setLoading(true);
    try {
      const data = await fetchTrees();
      setTrees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      const matchesSearch = 
        tree.tree_code.toLowerCase().includes(search.toLowerCase()) ||
        tree.common_name.toLowerCase().includes(search.toLowerCase()) ||
        tree.species.toLowerCase().includes(search.toLowerCase()) ||
        (tree.guardian_name && tree.guardian_name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;
      const matchesAdopted = 
        adoptedFilter === 'all' || 
        (adoptedFilter === 'adopted' && tree.is_adopted) ||
        (adoptedFilter === 'unadopted' && !tree.is_adopted);

      return matchesSearch && matchesStatus && matchesAdopted;
    });
  }, [trees, search, statusFilter, adoptedFilter]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isHi ? "पौधा डायरेक्टरी व डिजिटल पासपोर्ट" : "Sapling Directory & Digital Passports"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isHi ? "जमशेदपुर एवं झारखंड के प्रत्येक पौधे का व्यक्तिगत स्वास्थ्य, विकास एवं जन-अभिभावक रिकॉर्ड" : "Tracking individual tree health, growth metrics, and community guardianship across Jamshedpur & Jharkhand"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            {filteredTrees.length} {isHi ? "पौधे पाए गए" : "Trees Matched"}
          </span>

          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isHi ? "+ नया पौधा पंजीकृत करें" : "+ Register New Sapling"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isHi ? "कोड (जैसे VS-2026-JH-0101), प्रजाति (नीम, साखुआ), या अभिभावक खोजें..." : "Search by code (e.g. VS-2026-JH-0101), species (Neem, Sal), or guardian..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="all">{isHi ? "सभी स्वास्थ्य स्थितियां" : "All Health Statuses"}</option>
              <option value="healthy">{isHi ? "स्वस्थ (≥80%)" : "Healthy (≥80%)"}</option>
              <option value="needs_attention">{isHi ? "पानी की आवश्यकता (60-79%)" : "Needs Attention (60-79%)"}</option>
              <option value="critical">{isHi ? "गंभीर स्थिति (<60%)" : "Critical (<60%)"}</option>
              <option value="dead">{isHi ? "मृत्यु की पुष्टि" : "Mortality Confirmed"}</option>
            </select>
          </div>

          {/* Adoption Filter */}
          <div className="sm:col-span-3">
            <select
              value={adoptedFilter}
              onChange={(e) => setAdoptedFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="all">{isHi ? "सभी दत्तक स्थितियां" : "All Adoption States"}</option>
              <option value="adopted">{isHi ? "अभिभावक द्वारा गोद लिया" : "Adopted by Guardian"}</option>
              <option value="unadopted">{isHi ? "गोद लेने हेतु उपलब्ध" : "Open for Adoption"}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tree Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <TreePine className="w-8 h-8 animate-bounce mx-auto mb-2 text-emerald-500" />
          <p className="text-xs">{isHi ? "पौधों का रिकॉर्ड लोड हो रहा है..." : "Loading tree registries..."}</p>
        </div>
      ) : filteredTrees.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <TreePine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">{isHi ? "कोई पौधा नहीं मिला" : "No saplings match your search filters"}</p>
          <p className="text-xs text-slate-400 mt-1">{isHi ? "कृपया फिल्टर या खोज शब्द बदलें" : "Try resetting the status or keyword search"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTrees.map((tree) => (
            <div
              key={tree.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
            >
              {/* Photo & Status Badge */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={tree.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400'}
                  alt={tree.common_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                
                {/* Code Pill */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                  {tree.tree_code}
                </div>

                {/* Health Badge */}
                <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                  tree.status === 'healthy' ? 'bg-emerald-500 text-white' :
                  tree.status === 'needs_attention' ? 'bg-amber-500 text-white' :
                  tree.status === 'critical' ? 'bg-rose-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {tree.status === 'healthy' ? (isHi ? 'स्वस्थ' : 'THRIVING') :
                   tree.status === 'needs_attention' ? (isHi ? 'पानी चाहिए' : 'NEEDS WATER') :
                   tree.status === 'critical' ? (isHi ? 'गंभीर' : 'CRITICAL') : (isHi ? 'मृत' : 'DEAD')}
                </div>

                {/* Quick QR Trigger */}
                <button
                  onClick={() => onOpenQR(tree)}
                  title={isHi ? "आधिकारिक क्यूआर टैग देखें" : "View Official QR Tag"}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-sm transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {tree.common_name}
                      </h3>
                      <p className="text-[11px] text-slate-500 italic truncate">
                        {tree.species}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{tree.drive_title}</span>
                  </p>

                  {/* Survival Score Gauge */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">{isHi ? "एआई जीवन रक्षा सूचकांक" : "AI Survival Index"}</span>
                      <span className="text-emerald-700 font-bold">{tree.survival_score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          tree.survival_score >= 80 ? 'bg-emerald-500' :
                          tree.survival_score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${tree.survival_score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{isHi ? "ऊंचाई" : "Height"}: {tree.current_height_cm} cm</span>
                      <span>CO₂: {tree.carbon_absorbed_kg} kg</span>
                    </div>
                  </div>

                  {/* Guardian Status */}
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">{isHi ? "अभिभावक:" : "Guardian:"}</span>
                    {tree.is_adopted ? (
                      <span className="font-semibold text-slate-800 text-[11px] flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[120px]">{tree.guardian_name}</span>
                      </span>
                    ) : (
                      <span className="font-bold text-indigo-600 text-[11px]">{isHi ? "गोद लेने हेतु खुला" : "Open for Adoption"}</span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectTree(tree.id)}
                    className="py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isHi ? "पासपोर्ट" : "Passport"}</span>
                  </button>

                  {tree.is_adopted ? (
                    <button
                      onClick={() => onInspectTree(tree)}
                      className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border border-emerald-200 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isHi ? "देखभाल लॉग" : "Care Log"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAdoptTree(tree)}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{isHi ? "गोद लें" : "Adopt"}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
