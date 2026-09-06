import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  HeartHandshake, 
  Eye, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  Droplet,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// Create custom colored markers with pure HTML/SVG
const createTreeIcon = (status, score) => {
  let bgColor = '#10b981'; // emerald-500
  let ringColor = 'rgba(16, 185, 129, 0.4)';
  let label = 'Healthy';

  if (status === 'needs_attention') {
    bgColor = '#f59e0b'; // amber-500
    ringColor = 'rgba(245, 158, 11, 0.4)';
    label = 'Attention';
  } else if (status === 'critical') {
    bgColor = '#ef4444'; // red-500
    ringColor = 'rgba(239, 68, 68, 0.4)';
    label = 'Critical';
  } else if (status === 'dead') {
    bgColor = '#64748b'; // slate-500
    ringColor = 'rgba(100, 116, 139, 0.4)';
    label = 'Dead';
  }

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: ${bgColor};
      border: 2.5px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 10px ${ringColor};
      cursor: pointer;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m8 14 4 6 4-6"/>
        <path d="M12 2v18"/>
        <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 2.5 1.1 4.8 3 6.3"/>
      </svg>
      <span style="
        position: absolute;
        bottom: -6px;
        font-size: 8px;
        font-weight: 800;
        background: #0f172a;
        color: white;
        padding: 0px 4px;
        border-radius: 4px;
        white-space: nowrap;
      ">${score}%</span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-tree-pin',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

export default function TreeMap({ trees = [], onSelectTree, onAdoptTree }) {
  const [filter, setFilter] = useState('all');

  // Filter trees based on selected status
  const filteredTrees = useMemo(() => {
    if (filter === 'healthy') return trees.filter(t => t.status === 'healthy');
    if (filter === 'needs_attention') return trees.filter(t => t.status === 'needs_attention');
    if (filter === 'critical') return trees.filter(t => t.status === 'critical');
    if (filter === 'unadopted') return trees.filter(t => !t.is_adopted);
    return trees;
  }, [trees, filter]);

  // Center on Jamshedpur coordinates
  const defaultCenter = [22.8056, 86.1950];

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      
      {/* Map Filter Controls Floating Bar */}
      <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-200 flex flex-wrap gap-1 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Trees ({trees.length})
        </button>
        <button
          onClick={() => setFilter('healthy')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
            filter === 'healthy' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Thriving (≥80%)</span>
        </button>
        <button
          onClick={() => setFilter('needs_attention')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
            filter === 'needs_attention' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Needs Water ({trees.filter(t => t.status === 'needs_attention').length})</span>
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
            filter === 'critical' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>Critical Alert ({trees.filter(t => t.status === 'critical').length})</span>
        </button>
        <button
          onClick={() => setFilter('unadopted')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
            filter === 'unadopted' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Adoptable ({trees.filter(t => !t.is_adopted).length})</span>
        </button>
      </div>

      {/* Map Legend Floating Bottom Right */}
      <div className="absolute bottom-4 right-4 z-[500] bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-slate-200 text-xs hidden sm:block">
        <p className="font-bold text-slate-800 mb-2">GIS Survival Health Legend</p>
        <div className="space-y-1.5 text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Healthy (80% - 100% ExG Index)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Needs Attention / Watering</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Critical Dehydration / Pest Threat</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredTrees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.lat, tree.lng]}
            icon={createTreeIcon(tree.status, Math.round(tree.survival_score))}
          >
            <Popup className="custom-popup">
              <div className="w-64 p-1">
                {/* Photo Header */}
                <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    src={tree.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300'}
                    alt={tree.common_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    {tree.tree_code}
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tree.status === 'healthy' ? 'bg-emerald-500 text-white' :
                    tree.status === 'needs_attention' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {tree.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Details */}
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {tree.common_name}
                </h4>
                <p className="text-xs text-slate-500 italic mb-2">
                  {tree.species}
                </p>

                {/* Survival Score Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs font-semibold mb-0.5">
                    <span className="text-slate-600">Survival Index</span>
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
                </div>

                {/* Guardian Info */}
                <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-md mb-2 flex items-center justify-between">
                  <span>Guardian:</span>
                  <span className="font-semibold text-slate-800">
                    {tree.is_adopted ? tree.guardian_name : 'Unassigned (Open)'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => onSelectTree(tree.id)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center justify-center space-x-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Passport</span>
                  </button>

                  {!tree.is_adopted && (
                    <button
                      onClick={() => onAdoptTree(tree)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Adopt</span>
                    </button>
                  )}
                </div>

              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}
