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

    return () => {
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
