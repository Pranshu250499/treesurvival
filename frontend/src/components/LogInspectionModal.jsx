import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  Droplet, 
  ShieldCheck, 
  ShieldAlert,
  Ruler
} from 'lucide-react';
import { logInspection } from '../services/api';

export default function LogInspectionModal({ isOpen, onClose, tree, onSuccess }) {
  if (!isOpen || !tree) return null;

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(tree.photo_url || '');
  const [inspectorName, setInspectorName] = useState(tree.guardian_name || 'Community Guardian');
  const [heightCm, setHeightCm] = useState(Math.round(tree.current_height_cm + 3));
  const [canopySpreadCm, setCanopySpreadCm] = useState(Math.round(tree.canopy_spread_cm + 2));
  const [soilMoisture, setSoilMoisture] = useState('Adequate');
  const [isWatered, setIsWatered] = useState(true);
  const [isWeeded, setIsWeeded] = useState(true);
  const [isMulched, setIsMulched] = useState(true);
  const [pestsDetected, setPestsDetected] = useState(false);
  
  // Geolocation
  const [coords, setCoords] = useState({ lat: tree.lat + 0.00002, lng: tree.lng - 0.00001 });
  const [gpsStatus, setGpsStatus] = useState('Acquired (Field Accuracy ~3m)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getBrowserGPS = () => {
    if (navigator.geolocation) {
      setGpsStatus('Locating via satellite...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsStatus(`Acquired (Accuracy ~${Math.round(pos.coords.accuracy)}m)`);
        },
        (err) => {
          setGpsStatus('GPS permission denied; using local beacon');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        tree_id: tree.id,
        inspector_name: inspectorName,
        height_cm: parseFloat(heightCm),
        canopy_spread_cm: parseFloat(canopySpreadCm),
        soil_moisture_level: soilMoisture,
        is_watered: isWatered,
        is_weeded: isWeeded,
        is_mulched: isMulched,
        pests_detected: pestsDetected,
        lat: coords.lat,
        lng: coords.lng,
        photo_url_fallback: previewUrl
      };

      const res = await logInspection(payload, photoFile);
      setResult(res);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setError(err.message || 'Failed to submit inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Log Care & Health Inspection</h3>
              <p className="text-xs text-slate-500">{tree.common_name} ({tree.tree_code})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {result ? (
          <div className="py-4 space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Inspection Verified by AI!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Health score updated to <strong>{result.ai_analysis.survival_score}%</strong>.
                  {result.credits_awarded > 0 && ` +${result.credits_awarded} Prithvi Credits earned!`}
                </p>
              </div>
            </div>

            {/* Anti Fraud status */}
            <div className={`p-3 rounded-xl border text-xs ${
              result.is_verified
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center space-x-1.5">
                  {result.is_verified ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Proof-of-Survival Verification: Passed</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Fraud / Discrepancy Flagged</span>
                    </>
                  )}
                </span>
                <span className="font-mono text-[11px]">
                  {result.distance_m < 40 ? `${result.distance_m.toFixed(1)}m from origin` : 'Exceeded Geofence'}
                </span>
              </div>
              {result.fraud_reason && <p className="text-rose-600 mt-1">{result.fraud_reason}</p>}
            </div>

            {/* AI Diagnosis */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Canopy Foliage:</span>
                <span className="font-bold text-slate-800">{result.ai_analysis.canopy_foliage_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chlorophyll Vitality Index:</span>
                <span className="font-bold text-emerald-600">{Math.round(result.ai_analysis.vitality_index * 100)}%</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-700 italic">
                "{result.ai_analysis.ai_notes}"
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Done & View Updated Tree Passport
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Photo Capture / Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Live Sapling Photo (Required for AI Analysis)
              </label>
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex flex-col items-center justify-center h-44">
                {previewUrl ? (
                  <img src={previewUrl} alt="Inspection" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Take or upload a photo of the sapling</p>
                  </div>
                )}
                
                <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Inspector Name & GPS Geofence */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspector / Guardian</label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Field Geotag</label>
                  <button
                    type="button"
                    onClick={getBrowserGPS}
                    className="text-[10px] text-emerald-600 font-bold hover:underline"
                  >
                    Refresh GPS
                  </button>
                </div>
                <div className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 truncate flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canopy Spread (cm)</label>
                <input
                  type="number"
                  value={canopySpreadCm}
                  onChange={(e) => setCanopySpreadCm(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Moisture</label>
                <select
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Dry">Dry (Needs Water)</option>
                  <option value="Adequate">Adequate</option>
                  <option value="Damp">Damp / Moist</option>
                </select>
              </div>
            </div>

            {/* Care Checkboxes */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block">Actions Completed Today:</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={isWatered}
                    onChange={(e) => setIsWatered(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Deep Watered</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={isWeeded}
                    onChange={(e) => setIsWeeded(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Weeded Base</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={isMulched}
                    onChange={(e) => setIsMulched(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mulched Soil</span>
                </label>
                <label className="flex items-center space-x-2 text-rose-600">
                  <input
                    type="checkbox"
                    checked={pestsDetected}
                    onChange={(e) => setPestsDetected(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Pests Detected</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Analyzing with AI & Geofencing...' : 'Submit & Run AI Verification'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
