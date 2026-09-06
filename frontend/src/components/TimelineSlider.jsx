import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function TimelineSlider({ initialPhoto, currentPhoto, plantedDate, lastDate }) {
  const [sliderPos, setSliderPos] = useState(50);

  const initialImg = initialPhoto || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80';
  const currentImg = currentPhoto || 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900">Visual Growth Progression</h4>
          <p className="text-xs text-slate-500">Interactive Before & After slider proving long-term vegetative survival</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Day 0 (Planted)</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Current Day</span>
        </div>
      </div>

      {/* Split Comparison Slider Container */}
      <div 
        className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden select-none cursor-ew-resize border border-slate-200"
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            setSliderPos((x / rect.width) * 100);
          }
        }}
        onTouchMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
          setSliderPos((x / rect.width) * 100);
        }}
      >
        {/* Background Image (Current / Grown) */}
        <img
          src={currentImg}
          alt="Current growth state"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
          Today: Robust Canopy
        </div>

        {/* Foreground Clipped Image (Day 0 / Baseline) */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={initialImg}
            alt="Day 0 Sapling"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-700/80 backdrop-blur-xs text-white text-[11px] font-bold">
            Day 0: Sapling Stage
          </div>
        </div>

        {/* Divider Handle */}
        <div 
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-700 shadow-lg flex items-center justify-center font-bold text-xs border-2 border-emerald-500">
            ⇄
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Slide horizontally to inspect physical crown & foliage development</span>
        <span className="font-semibold text-emerald-700">Verified by Satellite & AI Vision</span>
      </div>
    </div>
  );
}
