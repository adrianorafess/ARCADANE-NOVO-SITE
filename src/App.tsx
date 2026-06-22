import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomTripsCtaBanner from './components/CustomTripsCtaBanner';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import PackagesView from './components/PackagesView';
import CustomTripView from './components/CustomTripView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import TravelQuizView from './components/TravelQuizView';
import AdminView from './components/AdminView';
import ExitIntentModal from './components/ExitIntentModal';
import TravelerUtilityHub from './components/TravelerUtilityHub';
import CustomCursor from './components/CustomCursor';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WhatsAppSelectorModal from './components/WhatsAppSelectorModal';
import ArcadaneIcon from './components/ArcadaneBrandIcon';
import RafesVisualBuilder from './components/RafesVisualBuilder';
import { AnimatePresence, motion } from 'motion/react';
import { getSeoSettings, applySeoSettings } from './utils/cmsStore';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(PageId.Home);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const logo = localStorage.getItem('arcadane_custom_logo');
    if (logo) {
      setCustomLogo(logo);
    }
    const handleLogoChange = () => {
      setCustomLogo(localStorage.getItem('arcadane_custom_logo'));
    };
    window.addEventListener('arcadane_logo_changed', handleLogoChange);
    return () => {
      window.removeEventListener('arcadane_logo_changed', handleLogoChange);
    };
  }, []);

  useEffect(() => {
    // Apply SEO and configurations immediately
    applySeoSettings(getSeoSettings());

    // Listen to changes from CMS to immediately re-apply SEO
    const handleCmsChange = () => {
      applySeoSettings(getSeoSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);

    // Beautiful progres bar emulation for high luxury feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const renderActiveView = () => {
    switch (activePage) {
      case PageId.Home:
        return <HomeView setActivePage={setActivePage} />;
      case PageId.Packages:
        return <PackagesView />;
      case PageId.AboutUs:
        return <AboutView />;
      case PageId.CustomTrip:
        return <CustomTripView />;
      case PageId.Blog:
        return <BlogView setActivePage={setActivePage} />;
      case PageId.ContactUs:
        return <ContactView />;
      case PageId.Privacy:
        return <PrivacyPolicyView />;
      case PageId.TravelQuiz:
        return <TravelQuizView />;
      case PageId.Admin:
        return <AdminView />;
      default:
        return <HomeView setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      {/* Premium Circular Stamp / Logo Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }}
            className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-[#6F5B4E]"
            id="arcadane-luxury-loader"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center max-w-xs px-6"
            >
              {/* Spinning/pulsating branding mark (original image or vector fallback) */}
              {customLogo ? (
                <img 
                  src={customLogo} 
                  alt="Arcadane Viagens" 
                  className="h-28 sm:h-36 w-auto object-contain mb-8 animate-pulse text-white brightness-200" 
                />
              ) : (
                <ArcadaneIcon
                  variant="full"
                  size={180}
                  primaryColor="#fdfcf9"
                  secondaryColor="#fdfcf9"
                  textColor="#fdfcf9"
                  animate={true}
                  className="mb-8"
                />
              )}

              {/* Progress feedback */}
              <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden relative mb-3">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#fdfcf9]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              {/* Luxury descriptive subtitle */}
              <p className="text-[10px] tracking-[0.3em] font-sans font-bold text-white/80 uppercase select-none animate-pulse">
                Curando Experiências Singulares
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-brand-primary/25 selection:text-brand-dark" id="applet-root">

      
      {/* 1. Header Navigation Wrapper */}
      <Header activePage={activePage} setActivePage={setActivePage} />

      {/* 2. Main Page content area with dynamic motion transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            id="fade-transition-wrapper"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 2.5. Elegant Call-To-Action Banner */}
      <CustomTripsCtaBanner setActivePage={setActivePage} />

      {/* 3. Footer Segment */}
      <Footer setActivePage={setActivePage} />

      {/* Global Pulsating WhatsApp Channel Switcher */}
      <FloatingWhatsApp />

      {/* Elegant WhatsApp Channel Choice Modal */}
      <WhatsAppSelectorModal />

      {/* Luxury exit intent offer popup */}
      <ExitIntentModal activePage={activePage} />

      {/* Traveler utilities assistant (Translate, A11y, VLibras, Currency, Weather) */}
      <TravelerUtilityHub />

      {/* Rafes Visual Builder & Quick Live Overlay System */}
      <RafesVisualBuilder activePage={activePage} />

      {/* Elegant custom luxury interactive airplane pointer */}
      <CustomCursor />

    </div>
    </>
  );
}
