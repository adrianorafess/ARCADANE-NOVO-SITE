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
import CustomPageView from './components/CustomPageView';
import ErrorBoundary from './components/ErrorBoundary';
import ExitIntentModal from './components/ExitIntentModal';
import TravelerUtilityHub from './components/TravelerUtilityHub';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WhatsAppSelectorModal from './components/WhatsAppSelectorModal';
import ArcadaneIcon from './components/ArcadaneBrandIcon';
import RafesVisualBuilder from './components/RafesVisualBuilder';
import { AnimatePresence, motion } from 'motion/react';
import { getSeoSettings, applySeoSettings, getCustomLogo, getHomeSettings, HomeSettings, getCustomPages } from './utils/cmsStore';
import { applyAllCustomInjections } from './utils/codeInjector';
import { trackPageView, trackCustomEvent } from './utils/analyticsTracker';

export default function App() {
  const [activePage, setActivePage] = useState<PageId | string>(PageId.Home);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(() => getCustomLogo());
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(() => getHomeSettings());

  useEffect(() => {
    trackPageView(String(activePage));
    window.scrollTo({ top: 0 });
    const timer1 = setTimeout(() => window.scrollTo({ top: 0 }), 50);
    const timer2 = setTimeout(() => window.scrollTo({ top: 0 }), 150);
    const timer3 = setTimeout(() => window.scrollTo({ top: 0 }), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activePage]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.includes('wa.me')) {
          trackCustomEvent('whatsapp_click', String(activePage));
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [activePage]);

  useEffect(() => {
    setCustomLogo(getCustomLogo());
    const handleLogoChange = () => {
      setCustomLogo(getCustomLogo());
    };
    window.addEventListener('arcadane_logo_changed', handleLogoChange);
    return () => {
      window.removeEventListener('arcadane_logo_changed', handleLogoChange);
    };
  }, []);

  useEffect(() => {
    // Apply SEO and custom code injections immediately
    applySeoSettings(getSeoSettings());
    applyAllCustomInjections();

    // Listen to changes from CMS to immediately re-apply SEO, Code Injections & Home Settings
    const handleCmsChange = () => {
      applySeoSettings(getSeoSettings());
      applyAllCustomInjections();
      setHomeSettings(getHomeSettings());
      setCustomLogo(getCustomLogo());
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
    // If a system page is disabled, fall back to Home
    if (activePage === PageId.Packages && homeSettings.hidePackages) return <HomeView setActivePage={setActivePage} />;
    if (activePage === PageId.AboutUs && homeSettings.hideAboutUs) return <HomeView setActivePage={setActivePage} />;
    if (activePage === PageId.CustomTrip && homeSettings.hideCustomTrip) return <HomeView setActivePage={setActivePage} />;
    if (activePage === PageId.Blog && homeSettings.hideBlog) return <HomeView setActivePage={setActivePage} />;
    if (activePage === PageId.ContactUs && homeSettings.hideContactUs) return <HomeView setActivePage={setActivePage} />;

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
      default: {
        const customPages = getCustomPages();
        const found = customPages.find(p => p.id === activePage);
        if (found && found.isActive !== false) {
          return <CustomPageView page={found} />;
        }
        return <HomeView setActivePage={setActivePage} />;
      }
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
            className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-[#12100E]"
            id="arcadane-luxury-loader"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center max-w-md px-6"
            >
              {/* Spinning/pulsating branding mark (original image or vector fallback) */}
              {(!homeSettings.preloaderType || homeSettings.preloaderType === 'pulse') && (
                <img 
                  src={customLogo || "/logo.svg"} 
                  alt="Arcadane Viagens" 
                  className="h-44 sm:h-56 md:h-64 lg:h-72 max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-auto object-contain mb-8 animate-pulse" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                  }}
                />
              )}

              {homeSettings.preloaderType === 'spin' && (
                <div className="relative mb-8 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-6 rounded-full border-2 border-dashed border-[#AF4934]/50"
                  />
                  <img 
                    src={customLogo || "/logo.svg"} 
                    alt="Arcadane Viagens" 
                    className="h-44 sm:h-56 md:h-64 lg:h-72 max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-auto object-contain relative z-10" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                    }}
                  />
                </div>
              )}

              {homeSettings.preloaderType === 'flip' && (
                <motion.img 
                  src={customLogo || "/logo.svg"} 
                  alt="Arcadane Viagens" 
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="h-44 sm:h-56 md:h-64 lg:h-72 max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-auto object-contain mb-8" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                  }}
                />
              )}

              {homeSettings.preloaderType === 'modern' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
                  transition={{ duration: 0.8, y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
                  className="mb-8"
                >
                  <img 
                    src={customLogo || "/logo.svg"} 
                    alt="Arcadane Viagens" 
                    className="h-44 sm:h-56 md:h-64 lg:h-72 max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-auto object-contain" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                    }}
                  />
                </motion.div>
              )}

              {homeSettings.preloaderType === 'zoom' && (
                <motion.img 
                  src={customLogo || "/logo.svg"} 
                  alt="Arcadane Viagens" 
                  animate={{ scale: [0.93, 1.07, 0.93] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="h-44 sm:h-56 md:h-64 lg:h-72 max-w-[340px] sm:max-w-[420px] md:max-w-[480px] w-auto object-contain mb-8" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                  }}
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
            <ErrorBoundary>
              {renderActiveView()}
            </ErrorBoundary>
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

    </div>
    </>
  );
}
