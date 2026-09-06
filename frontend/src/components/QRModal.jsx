import React from 'react';
import { X, QrCode, Download, Printer, ShieldCheck, MapPin } from 'lucide-react';

export default function QRModal({ isOpen, onClose, tree }) {
  if (!isOpen || !tree) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 print:shadow-none print:border-0">
        
        {/* Header (hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Official Tree Passport</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card */}
        <div className="mt-4 p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/20 text-center space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 border-b border-emerald-200 pb-1.5">
            <span>VRIKSHASETU REGISTRY</span>
            <span>JHARKHAND FOREST DEPT</span>
          </div>

          <div className="w-44 h-44 mx-auto bg-white p-2 rounded-xl shadow-xs border border-emerald-200 flex items-center justify-center">
            <img
              src={tree.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=VRIKSHASETU://${tree.tree_code}`}
              alt={`QR for ${tree.tree_code}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unique Tree Identifier</span>
            <p className="text-base font-extrabold font-mono text-slate-900">{tree.tree_code}</p>
          </div>

          <div className="text-left text-xs bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Common Name:</span>
              <span className="font-bold text-slate-800">{tree.common_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Species:</span>
              <span className="font-medium italic text-slate-700 truncate">{tree.species}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GPS Geotag:</span>
              <span className="font-mono text-[10px] text-slate-700">{tree.lat.toFixed(4)}, {tree.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guardian:</span>
              <span className="font-semibold text-emerald-700 truncate">{tree.guardian_name || 'Open for Adoption'}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scan with any smartphone to inspect or water</span>
          </div>
        </div>

        {/* Action Buttons (hidden in print) */}
        <div className="mt-4 flex space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tree Tag</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
