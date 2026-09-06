import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TreePine, 
  MapPin, 
  Calendar, 
  Droplet, 
  ShieldCheck, 
  ShieldAlert, 
  HeartHandshake, 
  Camera, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Clock,
  UserCheck,
  Volume2,
  VolumeX
} from 'lucide-react';
import TimelineSlider from '../components/TimelineSlider';
import { fetchTreeDetail } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function TreeDetail({ treeId, onBack, onAdoptTree, onInspectTree, onOpenQR }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang, t, speakCareGuide, stopSpeaking, isSpeaking } = useLanguage();
  const isHi = lang === 'hi';

  useEffect(() => {
    loadDetail();
  }, [treeId]);

  async function loadDetail() {
    setLoading(true);
    try {
      const data = await fetchTreeDetail(treeId);
      setTree(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <TreePine className="w-10 h-10 animate-bounce mx-auto mb-2 text-emerald-500" />
        <p className="text-xs">{isHi ? "डिजिटल ट्री पासपोर्ट लोड हो रहा है..." : "Loading Digital Tree Passport..."}</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-bold text-slate-700">{isHi ? "पौधे का रिकॉर्ड नहीं मिला" : "Tree record not found"}</p>
        <button onClick={onBack} className="mt-3 text-xs text-emerald-600 font-bold hover:underline cursor-pointer">
          {isHi ? "डायरेक्टरी में वापस जाएं" : "Return to Directory"}
        </button>
      </div>
    );
  }

  const handleAudioGuide = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakCareGuide(tree.common_name, tree.species, tree.watering_frequency_days || 3, Math.round(tree.survival_score));
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => {
            stopSpeaking();
            onBack();
          }}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? "डायरेक्टरी में वापस जाएं" : "Back to Directory"}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Vernacular Web Speech Audio Guide Button */}
          <button
            onClick={handleAudioGuide}
            title={isHi ? "देखभाल सलाह आवाज़ में सुनें" : "Listen to Care Advisory Audio"}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            <span>{isSpeaking ? (isHi ? "ऑडियो चल रहा है..." : "Playing Audio...") : (isHi ? "आवाज़ में सुनें (ऑडियो गाइड)" : "Listen to Care Audio")}</span>
          </button>

          <button
            onClick={() => onOpenQR(tree)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? "आधिकारिक क्यूआर" : "Official QR Passport"}</span>
          </button>

          <button
            onClick={() => onInspectTree(tree)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isHi ? "देखभाल / एआई स्कैन" : "Log Care / AI Scan"}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Main Photo */}
          <div className="md:col-span-5">
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={tree.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600'}
                alt={tree.common_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono font-bold">
                {tree.tree_code}
              </div>
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${
                tree.status === 'healthy' ? 'bg-emerald-500 text-white' :
                tree.status === 'needs_attention' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {tree.status === 'healthy' ? (isHi ? 'स्वस्थ' : 'HEALTHY') :
                 tree.status === 'needs_attention' ? (isHi ? 'ध्यान चाहिए' : 'NEEDS ATTENTION') : (isHi ? 'गंभीर' : 'CRITICAL')}
              </div>
            </div>
          </div>

          {/* Botanical & Status Info */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? "वृक्ष सेतु पंजीकृत जैव-संपत्ति" : "VrikshaSetu Registered Bio-Asset"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {tree.common_name}
              </h1>
              <p className="text-sm font-medium italic text-slate-500">
                {tree.species}
              </p>
            </div>

            {/* AI Survival Score Highlights */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase">
                  {isHi ? "एआई जीवन रक्षा स्कोर" : "AI Survival Score"}
                </span>
                <p className="text-2xl font-black text-emerald-700">{tree.survival_score}%</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase">
                  {isHi ? "वर्तमान ऊंचाई" : "Current Height"}
                </span>
                <p className="text-2xl font-black text-slate-800">{tree.current_height_cm} <span className="text-xs font-normal">cm</span></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase">
                  {isHi ? "अवशोषित कार्बन" : "CO₂ Absorbed"}
                </span>
                <p className="text-2xl font-black text-teal-700">{tree.carbon_absorbed_kg} <span className="text-xs font-normal">kg</span></p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  {isHi ? "पौधरोपण अभियान" : "Plantation Drive"}
                </span>
                <span className="font-semibold text-slate-800 truncate block">
                  {tree.drive?.title || 'Jamshedpur Green Corridor'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  {isHi ? "मिट्टी का प्रकार" : "Soil Medium"}
                </span>
                <span className="font-semibold text-slate-800 truncate block">{tree.soil_type}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  {isHi ? "जीपीएस जियोटैग" : "GPS Geotag"}
                </span>
                <span className="font-mono text-slate-700 truncate block">
                  {tree.lat.toFixed(4)}° N, {tree.lng.toFixed(4)}° E
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  {isHi ? "सिंचाई आवश्यकता" : "Water Frequency"}
                </span>
                <span className="font-semibold text-slate-800 truncate block">
                  {isHi ? `हर ${tree.watering_frequency_days} दिन में` : `Every ${tree.watering_frequency_days} days`}
                </span>
              </div>
            </div>

            {/* Guardian Info Banner */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {isHi ? "संबद्ध अभिभावक (वन रक्षक)" : "Assigned Guardian"}
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {tree.is_adopted ? tree.guardian_name : (isHi ? 'अभी तक कोई अभिभावक नहीं' : 'No Guardian Assigned Yet')}
                  </p>
                  <p className="text-[10px] text-slate-500">{tree.guardian_role || (isHi ? 'नागरिक द्वारा गोद लेने हेतु खुला' : 'Open for citizen adoption')}</p>
                </div>
              </div>

              {!tree.is_adopted && (
                <button
                  onClick={() => onAdoptTree(tree)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{isHi ? "गोद लें" : "Adopt This Tree"}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Growth Slider */}
      <TimelineSlider
        initialPhoto={tree.initial_photo_url}
        currentPhoto={tree.photo_url}
        plantedDate={tree.planted_date}
        lastDate={tree.last_inspected_at}
      />

      {/* Chronological Inspection & AI Verification History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {isHi ? "प्रूफ-ऑफ-सर्वाइवल ऑडिट ट्रेल" : "Proof-of-Survival Audit Trail"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHi ? "ऐतिहासिक निरीक्षण लॉग, जियोफेंस दूरी परीक्षण एवं एआई क्लोरोफिल विश्लेषण" : "Historical monitoring check-ins, geofence radius tests, and AI chlorophyll scans"}
            </p>
          </div>
          <button
            onClick={() => onInspectTree(tree)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isHi ? "+ देखभाल लॉग जोड़ें" : "+ Add Care Log"}</span>
          </button>
        </div>

        {tree.inspections.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            {isHi ? "अभी कोई निरीक्षण लॉग नहीं है। नया लॉग दर्ज करने के लिए ऊपर क्लिक करें।" : 'No inspection logs submitted yet. Click "Log Care" to record the first inspection.'}
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {tree.inspections.map((insp, idx) => (
              <div key={idx} className="relative group">
                
                {/* Timeline Pin */}
                <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-emerald-600 border-4 border-white shadow-xs"></div>

                {/* Log Entry Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{insp.inspector_name}</span>
                      <span className="text-[11px] text-slate-500 ml-2">({insp.inspector_role})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono text-slate-500">
                        {insp.inspection_date ? new Date(insp.inspection_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        AI Score: {insp.ai_survival_score}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {insp.photo_url && (
                      <div className="sm:col-span-3">
                        <img
                          src={insp.photo_url}
                          alt="Inspection"
                          className="h-24 w-full object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}

                    <div className={insp.photo_url ? 'sm:col-span-9 space-y-2' : 'sm:col-span-12 space-y-2'}>
                      {/* Metric pills */}
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                          {isHi ? "ऊंचाई" : "Height"}: {insp.height_cm} cm
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                          {isHi ? "फैलाव" : "Spread"}: {insp.canopy_spread_cm} cm
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                          {isHi ? "नमी" : "Soil"}: {insp.soil_moisture_level}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                          {isHi ? "सिंचाई" : "Watered"}: {insp.is_watered ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                          {isHi ? "निराई" : "Weeded"}: {insp.is_weeded ? (isHi ? 'हाँ' : 'Yes') : (isHi ? 'नहीं' : 'No')}
                        </span>
                      </div>

                      {/* AI agronomist notes */}
                      <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200">
                        "{insp.ai_notes}"
                      </p>

                      {/* Geofence verification */}
                      <div className="flex items-center space-x-2 text-[10px]">
                        {insp.fraud_flag ? (
                          <span className="text-rose-600 font-bold flex items-center space-x-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Flagged: {insp.fraud_reason}</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isHi ? `जियोफेंस सत्यापित (मूल रोपण स्थल से ${insp.distance_from_origin_m?.toFixed(1) || '0.0'}मी)` : `Geofenced & Verified (${insp.distance_from_origin_m?.toFixed(1) || '0.0'}m from planted coordinates)`}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
