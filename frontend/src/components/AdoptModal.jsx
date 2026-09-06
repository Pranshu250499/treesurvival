import React, { useState } from 'react';
import { X, HeartHandshake, Sparkles, CheckCircle2, User, Phone, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { adoptTree } from '../services/api';

export default function AdoptModal({ isOpen, onClose, tree, onSuccess }) {
  if (!isOpen || !tree) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Citizen Guardian');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and mobile number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await adoptTree(tree.id, { name, phone, role });
      setSuccessData(res);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onSuccess) onSuccess(res);
    } catch (err) {
      setError(err.message || 'Adoption failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Adopt this Sapling</h3>
              <p className="text-xs text-slate-500">Vriksha Rakshak Stewardship Pledge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Adoption Confirmed!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                You are now the official guardian of <strong>{tree.common_name}</strong> ({tree.tree_code}).
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <p className="font-bold">🎉 +{successData.earned_credits} Prithvi Credits Awarded!</p>
              <p className="text-[11px] mt-0.5">Your credits can be redeemed for municipal property tax rebates and compost vouchers.</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Go to My Adopted Trees
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            
            {/* Tree Info Pill */}
            <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={tree.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200'}
                alt={tree.common_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{tree.common_name}</p>
                <p className="text-[11px] text-slate-500 italic truncate">{tree.species}</p>
                <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold rounded">
                  {tree.tree_code}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Hansda / Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (for care SMS & credits)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9835100001"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Role</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  <option value="Citizen Guardian">Citizen Guardian (Near Home / Office)</option>
                  <option value="Student Green Club">Student (NIT Jsr / University Club)</option>
                  <option value="Farmer / Van Mitra">Farmer / Village Van Mitra</option>
                  <option value="RWA Community Volunteer">RWA / Colony Volunteer</option>
                  <option value="Corporate Green Champion">Corporate Volunteer (CSR)</option>
                </select>
              </div>
            </div>

            {/* Commitment Note */}
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
              <p className="font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guardian Commitment:</span>
              </p>
              <p>Water every {tree.watering_frequency_days || 3} days and submit a quick monthly photo to earn survival milestone credits!</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming Adoption...' : 'Pledge & Adopt Sapling'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
