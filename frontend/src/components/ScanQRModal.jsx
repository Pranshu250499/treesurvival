import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Camera, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TreePine,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { fetchTreeByQR } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const DEMO_QR_TAGS = [
  { code: 'VS-2026-JH-0101', name: 'Neem (नीम) • Northern Town', status: 'Healthy (94%)' },
  { code: 'VS-2026-JH-0201', name: 'Sal (साखुआ) • Dalma Wildlife Corridor', status: 'Healthy (98%)' },
  { code: 'VS-2026-JH-0301', name: 'Peepal (पीपल) • Bagbera Rural Panchayat', status: 'Needs Water (68%)' },
  { code: 'VS-2026-JH-0401', name: 'Mahua (महुआ) • Dimna Catchment', status: 'Healthy (91%)' },
];

export default function ScanQRModal({ isOpen, onClose, onSelectTree }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [simulatingCam, setSimulatingCam] = useState(true);

  const handleLookup = async (codeToSearch) => {
    const code = (codeToSearch || inputCode).trim().toUpperCase();
    if (!code) {
      setError(isHi ? 'कृपया क्यूआर कोड दर्ज करें' : 'Please enter a valid Tree Code');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      // Simulate quick scan time if camera view active
      await new Promise(r => setTimeout(r, 600));
      const tree = await fetchTreeByQR(code);
      if (tree && tree.id) {
        onClose();
        onSelectTree(tree.id);
      } else {
        setError(isHi ? `कोड "${code}" वाला पौधा नहीं मिला` : `Tree with code "${code}" not found`);
      }
    } catch (err) {
      setError(err.message || (isHi ? 'क्यूआर कोड लोड करने में असमर्थ' : 'Failed to find tree by QR code'));
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isHi ? "क्यूआर कोड स्कैनर व पासपोर्ट खोज" : "QR Tag Scanner & Passport Lookup"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? "फील्ड में लगे ट्री गार्ड क्यूआर को स्कैन करें" : "Instant verification for field guards and citizens"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          
          {/* Simulated Camera Viewfinder */}
          {simulatingCam && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex flex-col items-center justify-center p-4 border border-slate-800">
              {/* Corner Targets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Animated Laser Scanning Line */}
              <div className="w-3/4 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce mb-3"></div>

              <div className="text-center z-10 px-4">
                <p className="text-xs font-mono font-bold text-emerald-300">
                  {isHi ? "स्मार्टफोन कैमरा दृश्य सक्रिय" : "Optical Barcode / QR Target Active"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isHi ? "पौधे के टैग को कैमरे के सामने रखें या नीचे सैंपल चुनें" : "Align camera with tree tag or select a sample tag below"}
                </p>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex items-center justify-center space-x-2 text-emerald-300 text-xs font-bold font-mono">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{isHi ? "डेटाबेस में सत्यापित कर रहे हैं..." : "Querying Geo-Ledger..."}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Manual Input Form */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {isHi ? "अथवा ट्री कोड सीधे दर्ज करें:" : "Or Enter Tree Identifier Manually:"}
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. VS-2026-JH-0101"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup()}
                disabled={isScanning}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isHi ? "खोजें" : "Lookup"}
              </button>
            </div>
          </div>

          {/* Instant Demo Samples for Hackathon Judges */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHi ? "तुरंत परीक्षण के लिए सैंपल क्यूआर कोड्स:" : "One-Click Quick Test QR Codes (Demo):"}
            </span>
            <div className="space-y-1.5">
              {DEMO_QR_TAGS.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputCode(demo.code);
                    handleLookup(demo.code);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                        {demo.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                        {demo.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{demo.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anti-Spoofing Cryptographic Hash ID</span>
            </span>
            <span className="font-semibold text-slate-700">Jamshedpur Geo-Ledger</span>
          </div>

        </div>

      </div>
    </div>
  );
}
