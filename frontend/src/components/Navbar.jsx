import React, { useState } from 'react';
import { 
  TreePine, 
  MapPin, 
  ShieldCheck, 
  Award, 
  ScanLine, 
  Activity, 
  Wifi, 
  WifiOff, 
  FolderTree, 
  Coins, 
  Users,
  Sparkles,
  Languages,
  QrCode,
  PlusCircle,
  Presentation
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAIScan, 
  onOpenPitch, 
  onOpenScanQR, 
  onOpenRegister 
}) {
  const [isOffline, setIsOffline] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const toggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Activity },
    { id: 'map', label: t.nav.map, icon: MapPin },
    { id: 'trees', label: t.nav.trees, icon: FolderTree },
    { id: 'drives', label: t.nav.drives, icon: ShieldCheck },
    { id: 'guardian', label: t.nav.guardian, icon: Users },
    { id: 'rewards', label: t.nav.rewards, icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Team Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Vriksha<span className="text-emerald-600">Setu</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  वृक्ष सेतु
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <span>By <strong className="text-slate-700">Pandas Py</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Tree Survival, Not Just Plantation</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Judge Pitch Deck Button */}
            <button
              onClick={onOpenPitch}
              title="Open Hackathon Presentation Deck for Judges"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 transition cursor-pointer shadow-xs"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{t.nav.pitch}</span>
            </button>

            {/* Quick QR Lookup Button */}
            <button
              onClick={onOpenScanQR}
              title="Scan or Lookup Tree Passport"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">{t.nav.scanQR}</span>
            </button>

            {/* Register Sapling Button */}
            <button
              onClick={onOpenRegister}
              title="Register a newly planted sapling"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.nav.registerTree}</span>
            </button>

            {/* Live AI Health Scan Button */}
            <button
              onClick={onOpenAIScan}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span className="hidden sm:inline">AI Health Scan</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Language Switcher (EN / हिन्दी) */}
            <button
              onClick={toggleLanguage}
              title="Toggle between English and Hindi (हिन्दी)"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-xs"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Rural Offline Sync Toggle */}
            <button
              onClick={toggleOffline}
              title={isOffline ? 'Rural Offline Sync Active (Logs buffered locally)' : 'Online Cloud Connected'}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isOffline
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden lg:inline text-[11px]">Rural Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline text-[11px]">Cloud Sync</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Secondary Navigation Row for Smaller Screens */}
        <div className="flex xl:hidden overflow-x-auto py-2 border-t border-slate-100 space-x-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
