import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSeoSettings, getHomeSettings } from '../utils/cmsStore';
import { trackCustomEvent } from '../utils/analyticsTracker';

interface CustomTripsCtaBannerProps {
  setActivePage?: (page: PageId) => void;
}

export default function CustomTripsCtaBanner({ setActivePage }: CustomTripsCtaBannerProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [seo, setSeo] = useState(() => getSeoSettings());
  const [home, setHome] = useState(() => getHomeSettings());

  useEffect(() => {
    const handleCms = () => {
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);

  const textMsg = "Olá Arcadane! Vi o banner de viagens personalizadas no site de vocês. Gostaria de iniciar um atendimento para desenhar o meu roteiro exclusivo.";

  const handleClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <section 
      id="custom-trips-footer-cta-banner" 
      className="relative w-full overflow-hidden min-h-[500px] md:min-h-[550px] flex items-center justify-center text-center bg-brand-dark"
    >
      {/* Cinematic wide parallax-ready background of Amalfi Cliffside / Positano */}
      <div className="absolute inset-0 z-0">
        <img
          referrerPolicy="no-referrer"
          src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=2200"
          alt="Cinque Terre Cliffside Coastline"
          className="w-full h-full object-cover object-center opacity-45 scale-[1.01] hover:scale-105 transition-transform duration-[8000ms] ease-out"
        />
        {/* Subtle vignette/shading overlays to ensure high-contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-brand-dark/70" />
        <div className="absolute inset-0 bg-brand-primary/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-7 text-white">
        
        {/* Sparkle subtle modern floating tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-secondary/20 bg-brand-secondary/5 backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-brand-secondary font-bold">Assessoria Premium</span>
        </div>

        {/* Heading Container: Serif, Dramatic and Editorial */}
        <div className="space-y-1">
          <h2 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-white tracking-normal leading-none block select-none whitespace-pre-wrap">
            {home.customTripTitle || "Viagens\npersonalizadas:"}
          </h2>
        </div>

        {/* Dynamic Descriptive Subheadings */}
        <div className="space-y-2 max-w-xl">
          <p className="font-sans text-sm md:text-base text-gray-200 tracking-wide font-light">
            {home.customTripSubtitle || "Experiências exclusivas, desenhadas para você."}
          </p>
          <p className="font-sans text-sm md:text-base text-white tracking-wide font-bold">
            {home.customTripButtonText || "Clique e fale com a Arcadane!"}
          </p>
        </div>

        {/* Elegant Centered Pill Button */}
        <div className="pt-4">
          <a
            href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(textMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCustomEvent('start_custom_trip', 'cta_banner')}
            className="group px-10 py-4.5 rounded-full bg-white text-stone-950 font-display font-bold uppercase tracking-widest text-xs hover:bg-brand-beige transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-white/10 flex items-center gap-2 inline-flex hover:no-underline decoration-none"
          >
            <span>COMECE POR AQUI</span>
            <ArrowRight className="w-4 h-4 text-stone-950 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>

    </section>
  );
}
