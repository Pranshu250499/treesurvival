import React, { useState } from 'react';
import './App.css';

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

import {
  LanguageProvider,
  useLanguage,
} from './context/LanguageContext';

import { fetchTrees } from './services/api';

import {
  TreePine,
  Heart,
  Activity,
  ShieldCheck,
} from 'lucide-react';


function AppContent() {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTreeId, setSelectedTreeId] = useState(null);

  /* -----------------------------
     MODALS
  ----------------------------- */

  const [isAIScanOpen, setIsAIScanOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isScanQROpen, setIsScanQROpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [adoptTreeTarget, setAdoptTreeTarget] = useState(null);
  const [inspectTreeTarget, setInspectTreeTarget] = useState(null);
  const [qrTreeTarget, setQrTreeTarget] = useState(null);

  /* -----------------------------
     MAP DATA
  ----------------------------- */

  const [mapTrees, setMapTrees] = useState([]);

  const { lang } = useLanguage();

  const isHi = lang === 'hi';


  /* -----------------------------
     NAVIGATION
  ----------------------------- */

  const navigateTo = (tab) => {

    setActiveTab(tab);
    setSelectedTreeId(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const handleSelectTree = (treeId) => {

    setSelectedTreeId(treeId);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const handleBackToDirectory = () => {
    setSelectedTreeId(null);
  };


  /* -----------------------------
     REFRESH TREES
  ----------------------------- */

  const handleRefreshDirectory = async () => {

    try {

      const data = await fetchTrees();

      setMapTrees(data);

    } catch (error) {

      console.error(
        'Failed to refresh tree data:',
        error
      );

    }

  };


  return (

    <div className="app-shell min-h-screen flex flex-col">

      {/* --------------------------------
          BACKGROUND AMBIENT EFFECTS
      -------------------------------- */}

      <div className="ambient-background">

        <div className="ambient-orb ambient-orb-one" />
        <div className="ambient-orb ambient-orb-two" />
        <div className="ambient-orb ambient-orb-three" />

      </div>


      {/* --------------------------------
          NAVBAR
      -------------------------------- */}

      <div className="app-navbar">

        <Navbar

          activeTab={activeTab}

          setActiveTab={navigateTo}

          onOpenAIScan={() =>
            setIsAIScanOpen(true)
          }

          onOpenPitch={() =>
            setIsPitchOpen(true)
          }

          onOpenScanQR={() =>
            setIsScanQROpen(true)
          }

          onOpenRegister={() =>
            setIsRegisterOpen(true)
          }

        />

      </div>


      {/* --------------------------------
          MAIN CONTENT
      -------------------------------- */}

      <main className="app-main flex-1">

        <div className="main-container">

          {/* Small live system indicator */}

          <div className="system-status-bar">

            <div className="system-status-left">

              <span className="live-dot" />

              <span>
                VrikshaSetu AI Engine
              </span>

              <span className="status-divider">
                /
              </span>

              <span className="status-online">
                System Online
              </span>

            </div>


            <div className="system-status-right">

              <span>
                <Activity size={13} />
                Live Monitoring
              </span>

              <span>
                <ShieldCheck size={13} />
                Verified Data
              </span>

            </div>

          </div>


          {/* --------------------------------
              PAGE CONTENT
          -------------------------------- */}

          <div
            key={`${activeTab}-${selectedTreeId}`}
            className="page-transition"
          >

            {selectedTreeId ? (

              <TreeDetail

                treeId={selectedTreeId}

                onBack={handleBackToDirectory}

                onAdoptTree={(tree) =>
                  setAdoptTreeTarget(tree)
                }

                onInspectTree={(tree) =>
                  setInspectTreeTarget(tree)
                }

                onOpenQR={(tree) =>
                  setQrTreeTarget(tree)
                }

              />

            ) : (

              <>

                {/* DASHBOARD */}

                {activeTab === 'dashboard' && (

                  <Dashboard

                    onSelectTree={handleSelectTree}

                    onAdoptTree={(tree) =>
                      setAdoptTreeTarget(tree)
                    }

                    onOpenAIScan={() =>
                      setIsAIScanOpen(true)
                    }

                    onNavigateTab={navigateTo}

                  />

                )}


                {/* GIS MAP */}

                {activeTab === 'map' && (

                  <div className="space-y-5 pb-12">

                    <div className="section-heading">

                      <div>

                        <div className="section-eyebrow">
                          LIVE GIS MONITORING
                        </div>

                        <h2 className="section-title">

                          {isHi
                            ? 'जीआईएस वनीकरण व उत्तरजीविता मानचित्र'
                            : 'GIS Afforestation & Survival Map'}

                        </h2>

                        <p className="section-description">

                          {isHi
                            ? 'जमशेदपुर क्षेत्र में जियोटैग किए गए पौधों की निगरानी करें।'
                            : 'Explore geotagged saplings and monitor survival across Jamshedpur.'}

                        </p>

                      </div>


                      <div className="live-badge">

                        <span className="live-dot" />

                        Live GIS Data

                      </div>

                    </div>


                    <div className="map-container-enhanced">

                      <TreeMap

                        trees={
                          mapTrees.length > 0
                            ? mapTrees
                            : []
                        }

                        onSelectTree={
                          handleSelectTree
                        }

                        onAdoptTree={(tree) =>
                          setAdoptTreeTarget(tree)
                        }

                      />

                    </div>

                  </div>

                )}


                {/* TREE DIRECTORY */}

                {activeTab === 'trees' && (

                  <TreeDirectory

                    onSelectTree={
                      handleSelectTree
                    }

                    onAdoptTree={(tree) =>
                      setAdoptTreeTarget(tree)
                    }

                    onInspectTree={(tree) =>
                      setInspectTreeTarget(tree)
                    }

                    onOpenQR={(tree) =>
                      setQrTreeTarget(tree)
                    }

                    onOpenRegister={() =>
                      setIsRegisterOpen(true)
                    }

                  />

                )}


                {/* DRIVES */}

                {activeTab === 'drives' && (

                  <DrivesPage

                    onSelectDrive={() => {}}

                    onNavigateTree={
                      handleSelectTree
                    }

                  />

                )}


                {/* GUARDIAN */}

                {activeTab === 'guardian' && (

                  <GuardianPortal

                    onSelectTree={
                      handleSelectTree
                    }

                    onInspectTree={(tree) =>
                      setInspectTreeTarget(tree)
                    }

                    onNavigateTab={
                      navigateTo
                    }

                  />

                )}


                {/* REWARDS */}

                {activeTab === 'rewards' && (

                  <LeaderboardPage />

                )}

              </>

            )}

          </div>

        </div>

      </main>


      {/* --------------------------------
          MODALS
      -------------------------------- */}

      <HackathonPitchModal

        isOpen={isPitchOpen}

        onClose={() =>
          setIsPitchOpen(false)
        }

      />


      <ScanQRModal

        isOpen={isScanQROpen}

        onClose={() =>
          setIsScanQROpen(false)
        }

        onSelectTree={
          handleSelectTree
        }

      />


      <RegisterSaplingModal

        isOpen={isRegisterOpen}

        onClose={() =>
          setIsRegisterOpen(false)
        }

        onSuccess={
          handleRefreshDirectory
        }

      />


      <AIHealthModal

        isOpen={isAIScanOpen}

        onClose={() =>
          setIsAIScanOpen(false)
        }

      />


      <AdoptModal

        isOpen={
          !!adoptTreeTarget
        }

        tree={
          adoptTreeTarget
        }

        onClose={() =>
          setAdoptTreeTarget(null)
        }

        onSuccess={() => {

          if (selectedTreeId) {
            setSelectedTreeId(
              selectedTreeId
            );
          }

        }}

      />


      <LogInspectionModal

        isOpen={
          !!inspectTreeTarget
        }

        tree={
          inspectTreeTarget
        }

        onClose={() =>
          setInspectTreeTarget(null)
        }

        onSuccess={() => {

          if (selectedTreeId) {
            setSelectedTreeId(
              selectedTreeId
            );
          }

        }}

      />


      <QRModal

        isOpen={
          !!qrTreeTarget
        }

        tree={
          qrTreeTarget
        }

        onClose={() =>
          setQrTreeTarget(null)
        }

      />


      {/* --------------------------------
          FOOTER
      -------------------------------- */}

      <footer className="app-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-logo">

              <TreePine size={17} />

            </div>

            <div>

              <div className="footer-title">
                VrikshaSetu
              </div>

              <div className="footer-subtitle">
                Tree Survival Platform
              </div>

            </div>

          </div>


         


          <div className="footer-tech">

            <span>
              <ShieldCheck size={13} />
              AI Powered
            </span>

            <span>
              <Heart
                size={13}
                className="footer-heart"
              />

              Built with care

            </span>

          </div>

        </div>

      </footer>

    </div>

  );

}


/* --------------------------------
   ROOT APP
-------------------------------- */

export default function App() {

  return (

    <LanguageProvider>

      <AppContent />

    </LanguageProvider>

  );

}