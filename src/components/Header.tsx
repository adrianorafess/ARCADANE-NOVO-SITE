import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ArcadaneIcon from './ArcadaneBrandIcon';
import { getSeoSettings, getCustomLogo, getHomeSettings, HomeSettings, getCustomPages, CustomPage } from '../utils/cmsStore';

interface HeaderProps {
  activePage: PageId | string;
  setActivePage: (page: PageId | string) => void;
}

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.016-5.08-2.87-6.934C16.32 2.019 13.84 1.002 11.22 1c-5.41 0-9.81 4.403-9.813 9.802-.001 1.772.475 3.502 1.38 5.027L1.693 21.5l5.8-.846h.154zm11.332-6.417c-.31-.155-1.833-.904-2.115-1.006-.281-.102-.486-.155-.69.155-.205.31-.795.102-.975.31-.18.205-.359.231-.67.076-.31-.155-1.309-.482-2.493-1.538-.922-.822-1.543-1.839-1.724-2.149-.18-.31-.019-.478.136-.632.14-.139.31-.362.465-.544.155-.18.206-.31.31-.518.103-.207.051-.389-.026-.544-.077-.155-.69-1.662-.946-2.28-.249-.597-.502-.516-.69-.526-.18-.008-.385-.01-.59-.01-.205 0-.539.077-.822.389-.282.31-1.077 1.051-1.077 2.562 0 1.511 1.099 2.97 1.253 3.176.154.207 2.164 3.31 5.242 4.639.731.317 1.302.507 1.748.649.735.233 1.4.2 1.929.122.589-.088 1.833-.75 2.09-1.449.256-.699.256-1.295.18-1.425-.077-.13-.282-.208-.59-.364z"/>
  </svg>
);

export default function Header({ activePage, setActivePage }: HeaderProps) {
  const [seo, setSeo] = useState(() => getSeoSettings());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatsDropdownOpen, setIsWhatsDropdownOpen] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [home, setHome] = useState<HomeSettings>(() => getHomeSettings());
  const [customMenuPages, setCustomMenuPages] = useState<CustomPage[]>(() => getCustomPages().filter(p => p.addToMenu && p.isActive !== false));
  
  const whatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getCustomLogo();
    if (stored) {
      setCustomLogo(stored);
    }
    const handleLogoChange = () => {
      const updated = getCustomLogo();
      setCustomLogo(updated);
      if (updated) {
        setLogoError(false);
      }
    };
    window.addEventListener('arcadane_logo_changed', handleLogoChange);
    return () => {
      window.removeEventListener('arcadane_logo_changed', handleLogoChange);
    };
  }, []);

  useEffect(() => {
    const handleCmsChange = () => {
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
      setCustomMenuPages(getCustomPages().filter(p => p.addToMenu && p.isActive !== false));
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const isHome = activePage === PageId.Home;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (whatsRef.current && !whatsRef.current.contains(event.target as Node)) {
        setIsWhatsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseSublinks = (sublinksStr?: string) => {
    if (!sublinksStr) return [];
    return sublinksStr.split(';').map(pair => {
      const parts = pair.split('|');
      const label = parts[0]?.trim();
      const pageId = parts[1]?.trim() || PageId.Home;
      return { label, pageId };
    }).filter(x => x.label);
  };

  const baseItems = [
    { id: PageId.Home, label: home.menuLabelHome || 'Início', hide: home.hideHome, hideInMenu: home.hideHomeInMenu },
    { id: PageId.Services, label: home.menuLabelServices || 'Serviços', hide: home.hideServices, hideInMenu: home.hideServicesInMenu },
    { id: PageId.Packages, label: home.menuLabelPackages || 'Pacotes', sublinks: undefined, hide: home.hidePackages, hideInMenu: home.hidePackagesInMenu },
    { id: PageId.AboutUs, label: home.menuLabelAboutUs || 'Quem Somos', hide: home.hideAboutUs, hideInMenu: home.hideAboutUsInMenu },
    { id: PageId.CustomTrip, label: home.menuLabelCustomTrip || 'Viagem Personalizada', sublinks: undefined, hide: home.hideCustomTrip, hideInMenu: home.hideCustomTripInMenu },
    { id: PageId.Blog, label: home.menuLabelBlog || 'Blog', hide: home.hideBlog, hideInMenu: home.hideBlogInMenu },
    { id: PageId.ContactUs, label: home.menuLabelContactUs || 'Contato', hide: home.hideContactUs, hideInMenu: home.hideContactUsInMenu }
  ].filter(item => !item.hide && !item.hideInMenu);

  const extraItems = customMenuPages.map(page => ({
    id: page.externalUrl ? page.externalUrl : page.id,
    label: page.menuLabel || page.title,
    sublinks: undefined
  }));

  const navItems = [...baseItems, ...extraItems];

  const handleNavClick = (pageId: PageId | string) => {
    if (typeof pageId === 'string' && (pageId.startsWith('http://') || pageId.startsWith('https://'))) {
      window.open(pageId, '_blank');
      setIsMobileMenuOpen(false);
      return;
    }

    if (pageId === PageId.Services) {
      setActivePage(PageId.Home);
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        const el = document.getElementById('home-services');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      setActivePage(pageId);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`${isHome ? 'absolute' : 'relative'} top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isHome 
          ? isScrolled 
            ? 'bg-black/35 backdrop-blur-md border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
          : 'bg-stone-950/95 border-b border-stone-850 py-3.5'
      }`} 
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-6 lg:py-8">
                   {/* Logo Brand Brand Image with Elegant Auto-Fallback */}
          <div className="flex items-center gap-3 sm:gap-4" id="brand-logo-wrapper">
            <div 
              className="flex flex-col items-center justify-center cursor-pointer group select-none shrink-0"
              onClick={() => handleNavClick(PageId.Home)}
              id="brand-logo"
            >
              <img 
                src={customLogo || "/logo.svg"} 
                alt="Arcadane Viagens" 
                className="h-24 sm:h-32 md:h-36 w-auto object-contain brightness-100 transition-all duration-300 group-hover:scale-[1.02]" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                }}
              />
            </div>
          </div>

          {/* Desktop Navigation Capsule Pill */}
          <nav 
            className="hidden xl:flex items-center gap-1.5 border border-white/15 bg-black/25 backdrop-blur-md py-1.5 px-4.5 rounded-full animate-fadeIn" 
            id="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const hasSub = item.sublinks && item.sublinks.length > 0;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    id={`nav-item-${item.id}`}
                    className={`relative px-4 py-2 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-xs' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasSub && <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-300" />}
                  </button>
                  
                  {hasSub && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 w-52 text-left">
                        {item.sublinks.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavClick(sub.pageId);
                            }}
                            className="block w-full text-left px-3 py-2 text-[10.5px] text-white/70 hover:text-white hover:bg-white/10 rounded-xl font-sans font-bold uppercase tracking-wider transition-colors"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* WhatsApp Action Button with Double channel popover dropdown */}
          <div className="flex items-center gap-3 relative" id="header-actions" ref={whatsRef}>
            <div className="relative">
              <button
                onClick={() => setIsWhatsDropdownOpen(!isWhatsDropdownOpen)}
                id="header-cta-whatsapp"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                  isWhatsDropdownOpen ? 'bg-rose-600 text-white' : 'bg-[#25D366] hover:bg-[#128C7E] text-white'
                }`}
                aria-expanded={isWhatsDropdownOpen}
                title="Fale Conosco pelo WhatsApp"
              >
                {isWhatsDropdownOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <WhatsAppIcon className="w-5.5 h-5.5 fill-white text-white" />
                )}
              </button>

              {/* Popover Dropdown containing Mateus and Maria & Mariana contacts */}
              <AnimatePresence>
                {isWhatsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-72 sm:w-80 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
                    id="header-whatsapp-dropdown"
                  >
                    <div className="bg-stone-950 p-4 border-b border-stone-850">
                      <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-mono font-bold block">
                        • FALE COM UM CONSULTOR
                      </span>
                      <h4 className="text-white text-xs font-bold mt-1 font-display">Selecione o melhor canal:</h4>
                    </div>

                    <div className="p-3 space-y-2">
                       <a
                        href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent("Olá Mateus! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsWhatsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-800 bg-black/25 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-display font-semibold flex items-center justify-center text-xs">
                          M
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white group-hover:text-brand-secondary transition-colors">Mateus</span>
                            <span className="text-[8px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">Ativo</span>
                          </div>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5 font-sans">
                            Atendimento & Roteiros Personalizados
                          </p>
                        </div>
                      </a>

                      <a
                        href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent("Olá Maria e Mariana! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsWhatsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-800 bg-black/25 hover:bg-brand-secondary/10 hover:border-brand-secondary/30 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-full bg-brand-secondary text-white font-display font-semibold flex items-center justify-center text-xs">
                          MM
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white group-hover:text-brand-secondary transition-colors">Maria e Mariana</span>
                            <span className="text-[8px] bg-brand-secondary/20 text-brand-secondary px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">Ativo</span>
                          </div>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5 font-sans">
                            Curadoria de Experiências & Lua de Mel
                          </p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle"
              className="xl:hidden p-2 rounded-full border border-white/15 bg-black/10 text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden bg-stone-950/95 border-b border-stone-800 overflow-hidden backdrop-blur-xl absolute top-full left-0 right-0"
            id="mobile-nav-menu"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                const hasSub = item.sublinks && item.sublinks.length > 0;
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      id={`mobile-nav-${item.id}`}
                      className={`block w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive 
                          ? 'bg-white/15 text-white' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                    {hasSub && (
                      <div className="pl-6 space-y-1 border-l border-stone-850 ml-4">
                        {item.sublinks.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNavClick(sub.pageId)}
                            className="block w-full text-left px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                          >
                            • {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
