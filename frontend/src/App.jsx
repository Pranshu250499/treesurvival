import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TreeDirectory from './pages/TreeDirectory';
import TreeDetail from './pages/TreeDetail';
import DrivesPage from './pages/DrivesPage';
import GuardianPortal from './pages/GuardianPortal';
import LeaderboardPage from './pages/LeaderboardPage';
import TreeMap from './components/TreeMap';
import AIHealthModal from './components/AIHealthModal';
import AdoptModal from './components/AdoptModal';
import LogInspectionModal from './components/LogInspectionModal';
import QRModal from './components/QRModal';
import RegisterSaplingModal from './components/RegisterSaplingModal';
import ScanQRModal from './components/ScanQRModal';
import HackathonPitchModal from './components/HackathonPitchModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchTrees } from './services/api';
import { TreePine, MapPin, Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  
  // Modals state
  const [isAIScanOpen, setIsAIScanOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isScanQROpen, setIsScanQROpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [adoptTreeTarget, setAdoptTreeTarget] = useState(null);
  const [inspectTreeTarget, setInspectTreeTarget] = useState(null);
  const [qrTreeTarget, setQrTreeTarget] = useState(null);

  // Map view trees cache
  const [mapTrees, setMapTrees] = useState([]);
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const handleSelectTree = (treeId) => {
    setSelectedTreeId(treeId);
  };

  const handleBackToDirectory = () => {
    setSelectedTreeId(null);
  };

  const handleRefreshDirectory = async () => {
    try {
      const data = await fetchTrees();
      setMapTrees(data);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedTreeId(null);
        }}
        onOpenAIScan={() => setIsAIScanOpen(true)}
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenScanQR={() => setIsScanQROpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* If a tree is selected, render TreeDetail view */}
        {selectedTreeId ? (
          <TreeDetail
            treeId={selectedTreeId}
            onBack={handleBackToDirectory}
            onAdoptTree={(tree) => setAdoptTreeTarget(tree)}
            onInspectTree={(tree) => setInspectTreeTarget(tree)}
            onOpenQR={(tree) => setQrTreeTarget(tree)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                onSelectTree={handleSelectTree}
                onAdoptTree={(tree) => setAdoptTreeTarget(tree)}
                onOpenAIScan={() => setIsAIScanOpen(true)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedTreeId(null);
                }}
              />
            )}

            {activeTab === 'map' && (
              <div className="space-y-4 pb-12 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {isHi ? "जीआईएस वनीकरण व उत्तरजीविता मानचित्र" : "Full-Screen GIS Afforestation Map"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isHi ? "जमशेदपुर शहरी गलियारे, दलमा बफर एवं बागबेड़ा ग्रामीण पंचायत के सभी जियोटैग पौधे" : "Explore geotagged saplings across Jamshedpur urban belts, Dalma buffer, and Bagbera rural panchayats"}
                    </p>
                  </div>
                </div>

                <TreeMap
                  trees={mapTrees.length > 0 ? mapTrees : []}
                  onSelectTree={handleSelectTree}
                  onAdoptTree={(tree) => setAdoptTreeTarget(tree)}
                />
              </div>
            )}

            {activeTab === 'trees' && (
              <TreeDirectory
                onSelectTree={handleSelectTree}
                onAdoptTree={(tree) => setAdoptTreeTarget(tree)}
                onInspectTree={(tree) => setInspectTreeTarget(tree)}
                onOpenQR={(tree) => setQrTreeTarget(tree)}
                onOpenRegister={() => setIsRegisterOpen(true)}
              />
            )}

            {activeTab === 'drives' && (
              <DrivesPage
                onSelectDrive={(d) => {}}
                onNavigateTree={handleSelectTree}
              />
            )}

            {activeTab === 'guardian' && (
              <GuardianPortal
                onSelectTree={handleSelectTree}
                onInspectTree={(tree) => setInspectTreeTarget(tree)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'rewards' && (
              <LeaderboardPage />
            )}
          </>
        )}

      </main>

      {/* Global Modals */}
      <HackathonPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      <ScanQRModal
        isOpen={isScanQROpen}
        onClose={() => setIsScanQROpen(false)}
        onSelectTree={handleSelectTree}
      />

      <RegisterSaplingModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          handleRefreshDirectory();
        }}
      />

      <AIHealthModal
        isOpen={isAIScanOpen}
        onClose={() => setIsAIScanOpen(false)}
      />

      <AdoptModal
        isOpen={!!adoptTreeTarget}
        tree={adoptTreeTarget}
        onClose={() => setAdoptTreeTarget(null)}
        onSuccess={() => {
          if (selectedTreeId) {
            setSelectedTreeId(selectedTreeId);
          }
        }}
      />

      <LogInspectionModal
        isOpen={!!inspectTreeTarget}
        tree={inspectTreeTarget}
        onClose={() => setInspectTreeTarget(null)}
        onSuccess={() => {
          if (selectedTreeId) {
            setSelectedTreeId(selectedTreeId);
          }
        }}
      />

      <QRModal
        isOpen={!!qrTreeTarget}
        tree={qrTreeTarget}
        onClose={() => setQrTreeTarget(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <TreePine className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">VrikshaSetu Platform</span>
            <span>•</span>
            <span>Hackathon 6.0</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-600">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by <strong className="text-slate-900 font-bold">Team Pandas Py</strong> (Jamshedpur)</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Tree Survival, Not Just Plantation • Low-Cost Scalable Stewardship
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
