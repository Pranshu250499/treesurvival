import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Coins, 
  Trophy, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Gift, 
  Percent, 
  Sprout, 
  Ticket,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchLeaderboard, fetchRewards, redeemReward } from '../services/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Redemption State
  const [selectedReward, setSelectedReward] = useState(null);
  const [phone, setPhone] = useState('9835100001'); // Default demo phone (Ramesh Hansda)
  const [redeeming, setRedeeming] = useState(false);
  const [voucherData, setVoucherData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [lbRes, rewRes] = await Promise.all([
        fetchLeaderboard(),
        fetchRewards()
      ]);
      setLeaderboard(lbRes);
      setRewards(rewRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!selectedReward) return;
    setRedeeming(true);
    setError('');

    try {
      const res = await redeemReward(selectedReward.id, phone);
      setVoucherData(res);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      await loadData();
    } catch (err) {
      setError(err.message || 'Redemption failed');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Prithvi Credits, Leaderboard & Rewards
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tangible incentives for verified survival: Redeem green credits for tax rebates, compost bags, and CSR vouchers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center space-x-1.5">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Survival-to-Value Protocol</span>
          </span>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            <span>Green Credit Marketplace</span>
          </h3>
          <span className="text-xs text-slate-500">Sponsored by Municipalities & CSR Partners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    {reward.category.includes('Tax') ? <Percent className="w-5 h-5" /> :
                     reward.category.includes('Agri') ? <Sprout className="w-5 h-5" /> :
                     reward.category.includes('CSR') ? <Gift className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold flex items-center space-x-1 border border-amber-200">
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span>{reward.cost_credits} Pts</span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">{reward.title}</h4>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{reward.sponsor}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{reward.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{reward.stock} vouchers left</span>
                <button
                  onClick={() => {
                    setSelectedReward(reward);
                    setVoucherData(null);
                    setError('');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">Vriksha Rakshak Honor Roll</h3>
          </div>
          <span className="text-xs text-slate-500">Ranked by verified tree survival milestones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Guardian</th>
                <th className="py-2.5 px-3">Role & Location</th>
                <th className="py-2.5 px-3">Badge Tier</th>
                <th className="py-2.5 px-3">Care Streak</th>
                <th className="py-2.5 px-3 text-right">Prithvi Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      g.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-xs' :
                      g.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      g.rank === 3 ? 'bg-amber-100 text-amber-900' : 'text-slate-500'
                    }`}>
                      {g.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={g.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={g.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{g.name}</span>
                        <span className="text-[10px] text-slate-400">{g.trees_adopted_count} adopted trees</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 block">{g.role}</span>
                    <span className="text-[11px] text-slate-400">{g.ward_or_village}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {g.badge_tier}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1 text-slate-700 font-bold">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span>{g.streak_days}d streak</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-extrabold text-sm text-emerald-700 font-mono">
                      {g.prithvi_credits} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redemption Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 mb-1">Redeem Benefit</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedReward.title} ({selectedReward.cost_credits} Pts)</p>

            {voucherData ? (
              <div className="text-center py-4 space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">Voucher Generated!</h4>
                <p className="text-xs text-slate-600">{voucherData.message}</p>
                
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-emerald-400 font-mono text-base font-extrabold text-emerald-800">
                  {voucherData.voucher_code}
                </div>
                <p className="text-[11px] text-slate-400">Present this voucher code at {voucherData.sponsor} or the municipal ward office.</p>

                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold mt-3"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRedeem} className="space-y-3">
                {error && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guardian Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9835100001"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Demo phones: 9835100001 (Ramesh, 480 pts), 9835100004 (Sunita, 650 pts)</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    disabled={redeeming}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {redeeming ? 'Validating...' : `Confirm & Deduct ${selectedReward.cost_credits} Pts`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
