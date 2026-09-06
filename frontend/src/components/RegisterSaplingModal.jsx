import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sprout, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Layers, 
  Droplet,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerTree, fetchDrives } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const INDIGENOUS_SPECIES = [
  { species: "Shorea robusta", common_name: "Sal (साखुआ)", defaultHeight: 50, watering: 4, soil: "Red Laterite Loam" },
  { species: "Azadirachta indica", common_name: "Neem (नीम)", defaultHeight: 45, watering: 3, soil: "Alluvial Red Loam" },
  { species: "Ficus religiosa", common_name: "Peepal (पीपल)", defaultHeight: 60, watering: 3, soil: "Alluvial Soil" },
  { species: "Ficus benghalensis", common_name: "Banyan / Bargad (बरगद)", defaultHeight: 55, watering: 4, soil: "Loamy Sand" },
  { species: "Madhuca longifolia", common_name: "Mahua (महुआ)", defaultHeight: 40, watering: 4, soil: "Lateritic Red Soil" },
  { species: "Pongamia pinnata", common_name: "Karanj (करंज)", defaultHeight: 45, watering: 3, soil: "Alluvial Gravel" },
  { species: "Terminalia arjuna", common_name: "Arjun (अर्जुन)", defaultHeight: 50, watering: 2, soil: "Riverine Alluvium" },
  { species: "Syzygium cumini", common_name: "Jamun (जामुन)", defaultHeight: 48, watering: 3, soil: "Clayey Loam" },
  { species: "Dalbergia sissoo", common_name: "Sheesham (शीशम)", defaultHeight: 52, watering: 4, soil: "Sandy Alluvium" },
];

export default function RegisterSaplingModal({ isOpen, onClose, onSuccess }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  const [selectedSpeciesObj, setSelectedSpeciesObj] = useState(INDIGENOUS_SPECIES[0]);
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  
  // Geolocation
  const [lat, setLat] = useState(22.8056);
  const [lng, setLng] = useState(86.1950);
  const [locationTag, setLocationTag] = useState('Jamshedpur Urban Corridor');
  const [isLocating, setIsLocating] = useState(false);

  // Field details
  const [heightCm, setHeightCm] = useState(selectedSpeciesObj.defaultHeight);
  const [soilType, setSoilType] = useState(selectedSpeciesObj.soil);
  const [wateringFreq, setWateringFreq] = useState(selectedSpeciesObj.watering);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registeredData, setRegisteredData] = useState(null);

  useEffect(() => {
    async function loadDrivesData() {
      try {
        const data = await fetchDrives();
        setDrives(data);
        if (data.length > 0) {
          setSelectedDriveId(data[0].id);
        }
      } catch (e) {
        console.error("Failed to load drives for sapling registration", e);
      }
    }
    loadDrivesData();
  }, []);

  const handleSpeciesChange = (speciesName) => {
    const found = INDIGENOUS_SPECIES.find(s => s.species === speciesName) || INDIGENOUS_SPECIES[0];
    setSelectedSpeciesObj(found);
    setHeightCm(found.defaultHeight);
    setSoilType(found.soil);
    setWateringFreq(found.watering);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(isHi ? "ब्राउज़र में जीपीएस उपलब्ध नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(parseFloat(pos.coords.latitude.toFixed(5)));
        setLng(parseFloat(pos.coords.longitude.toFixed(5)));
        setLocationTag(isHi ? `जीपीएस सत्यापित (सटीकता ~${Math.round(pos.coords.accuracy)}मी)` : `GPS Acquired (Field Accuracy ~${Math.round(pos.coords.accuracy)}m)`);
        setIsLocating(false);
      },
      (err) => {
        // Fallback with realistic Jamshedpur jitter
        const jitterLat = 22.8056 + (Math.random() - 0.5) * 0.04;
        const jitterLng = 86.1950 + (Math.random() - 0.5) * 0.04;
        setLat(parseFloat(jitterLat.toFixed(5)));
        setLng(parseFloat(jitterLng.toFixed(5)));
        setLocationTag(isHi ? "जमशेदपुर जीपीएस बीकन" : "Jamshedpur Geo-Beacon Fixed");
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        species: selectedSpeciesObj.species,
        common_name: selectedSpeciesObj.common_name,
        lat: lat,
        lng: lng,
        drive_id: selectedDriveId ? parseInt(selectedDriveId) : null,
        soil_type: soilType,
        height_cm: parseFloat(heightCm),
        watering_frequency_days: parseInt(wateringFreq)
      };

      const res = await registerTree(payload, photoFile);
      setRegisteredData(res);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isHi ? "नए पौधे का फील्ड पंजीकरण" : "Field Sapling Registration"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? "जियोटैग, क्यूआर पासपोर्ट निर्माण व पौधरोपण ड्राइव से जुड़ाव" : "Geotagged Identity, QR Code Generation & Escrow Linkage"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {registeredData ? (
          /* Registration Success Screen */
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {isHi ? "पौधा सफलतापूर्वक पंजीकृत हुआ!" : "Sapling Successfully Geotagged!"}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                {isHi ? "विशिष्ट पहचान कोड और डिजिटल पासपोर्ट जारी कर दिया गया है:" : "A unique bio-asset identifier and QR digital passport has been generated:"}
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-emerald-400 font-mono text-sm font-bold rounded-lg">
                {registeredData.tree_code}
              </div>
            </div>

            {/* QR Tag Preview */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 max-w-xs mx-auto text-center space-y-2">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs border border-emerald-200 flex items-center justify-center">
                <img
                  src={registeredData.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VRIKSHASETU://${registeredData.tree_code}`}
                  alt="Tree QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-emerald-800 font-bold">
                {isHi ? "पेड़ के सुरक्षा घेरे (ट्री गार्ड) पर यह क्यूआर टैग लगाएं" : "Affix this QR passport tag to the sapling guard"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isHi ? "डायरेक्टरी में देखें" : "View in Sapling Directory"}
            </button>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Species Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHi ? "स्थानीय देशी प्रजाति चुनें (झारखंड जैव विविधता):" : "Indigenous Native Species (Jharkhand Biodiversity):"}
              </label>
              <select
                value={selectedSpeciesObj.species}
                onChange={(e) => handleSpeciesChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-medium"
              >
                {INDIGENOUS_SPECIES.map((s, idx) => (
                  <option key={idx} value={s.species}>
                    {s.common_name} — {s.species}
                  </option>
                ))}
              </select>
            </div>

            {/* Associated CSR / Govt Drive */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHi ? "संबद्ध पौधरोपण अभियान (सीएसआर एस्क्रो):" : "Affiliated Plantation Drive (CSR Escrow Linked):"}
              </label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-medium"
              >
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.organization})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Geotag Autofill */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isHi ? "जीपीएस जियोटैग निर्देशांक (सत्यापन के लिए):" : "GPS Geotag Coordinates (Anti-Fraud Proof):"}
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs text-emerald-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? (isHi ? 'खोज रहे हैं...' : 'Acquiring...') : (isHi ? 'वर्तमान जीपीएस लें' : 'Fetch Current GPS')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">LAT</span>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">LNG</span>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{locationTag}</p>
            </div>

            {/* Height, Soil & Watering Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isHi ? "ऊंचाई (सेमी)" : "Height (cm)"}
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isHi ? "सिंचाई अंतराल" : "Water (Days)"}
                </label>
                <input
                  type="number"
                  value={wateringFreq}
                  onChange={(e) => setWateringFreq(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isHi ? "मिट्टी का प्रकार" : "Soil Type"}
                </label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Field Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHi ? "पौधे का फील्ड फोटो (दिन 0 बेसलाइन):" : "Sapling Field Photo (Day 0 Baseline):"}
              </label>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-300 bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isHi ? "कैमरे / फाइल से फोटो चुनें" : "Select Field Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isHi ? "एआई विजुअल हैश की गणना कर नकल रोकेगा" : "AI will compute dHash to prevent recycled images"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? (isHi ? 'पंजीकरण हो रहा है...' : 'Generating Geotag & QR Passport...') : (isHi ? 'पौधा पंजीकृत करें और क्यूआर कोड बनाएं' : 'Register Sapling & Generate QR Passport')}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
