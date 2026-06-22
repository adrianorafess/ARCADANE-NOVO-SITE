import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSeoSettings, getHomeSettings } from '../utils/cmsStore';

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
          <button
            onClick={handleClick}
            className="group px-10 py-4.5 rounded-full bg-white text-stone-950 font-display font-bold uppercase tracking-widest text-xs hover:bg-brand-beige transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-white/10 flex items-center gap-2"
          >
            <span>COMECE POR AQUI</span>
            <ArrowRight className="w-4 h-4 text-stone-950 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Select-Contact Modal Dialog aligned with global choices */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-stone-950 border border-stone-850 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all focus:outline-hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover Head */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-mono font-bold block">
                  • ATENDIMENTO EXCLUSIVO
                </span>
                <h3 className="font-display font-bold text-2.5xl text-white">Fale com um Consultor</h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  Escolha com quem gostaria de falar para iniciar seu planejamento de viagem por WhatsApp:
                </p>
              </div>

              {/* Option Listing */}
              <div className="space-y-3">
                {/* Mateus */}
                <a
                  href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(textMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-white/10 transition-all duration-300 group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-lg border border-brand-primary/20 shrink-0 select-none">
                    M
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-bold text-white group-hover:text-brand-secondary transition-colors">Mateus</span>
                  </div>
                </a>

                {/* Maria & Mariana */}
                <a
                  href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(textMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-white/10 transition-all duration-300 group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-secondary/15 text-brand-secondary flex items-center justify-center font-bold text-lg border border-brand-secondary/20 shrink-0 select-none">
                    MM
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-bold text-white group-hover:text-brand-secondary transition-colors">Maria & Mariana</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
