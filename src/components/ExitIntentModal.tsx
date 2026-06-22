import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Compass, User, Users, Megaphone, Bell } from 'lucide-react';
import { PageId } from '../types';
import { getSeoSettings } from '../utils/cmsStore';

interface ExitIntentModalProps {
  activePage: PageId;
}

export default function ExitIntentModal({ activePage }: ExitIntentModalProps) {
  const [seo, setSeo] = useState(() => getSeoSettings());
  const [exitOpen, setExitOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  // Synchronize state with CMS changes immediately
  useEffect(() => {
    const handleCmsChange = () => {
      setSeo(getSeoSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  // Helper to determine if continuous layout matches selected pages
  const pageMatches = (configMode: 'all' | 'home_only_or_itineraries' | undefined) => {
    if (!configMode || configMode === 'all') return true;
    if (configMode === 'home_only_or_itineraries') {
      return activePage === PageId.Home || activePage === PageId.CustomTrip;
    }
    return true;
  };

  // 1. Exit Intent Detect Logic
  useEffect(() => {
    if (seo.exitIntentEnabled === false) return;
    if (!pageMatches(seo.exitIntentShowOnPages)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 15) {
        const hasShownExitThisSession = sessionStorage.getItem('arcadane_exit_intent_displayed');
        if (!hasShownExitThisSession) {
          setExitOpen(true);
          sessionStorage.setItem('arcadane_exit_intent_displayed', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activePage, seo.exitIntentEnabled, seo.exitIntentShowOnPages]);

  // 2. Scheduled Time-Delay Promo Announcement Logic
  useEffect(() => {
    if (!seo.announcementPopupEnabled) return;
    if (!pageMatches(seo.announcementPopupShowOnPages)) return;

    const delayMs = (seo.announcementPopupDelay || 5) * 1000;
    
    const timer = setTimeout(() => {
      const hasShownAnnounceThisSession = sessionStorage.getItem('arcadane_announcement_displayed');
      if (!hasShownAnnounceThisSession) {
        // Only show if the exit intent popup isn't currently active
        setAnnouncementOpen(true);
        sessionStorage.setItem('arcadane_announcement_displayed', 'true');
      }
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [activePage, seo.announcementPopupEnabled, seo.announcementPopupDelay, seo.announcementPopupShowOnPages]);

  const handleCloseExit = () => setExitOpen(false);
  const handleCloseAnnouncement = () => setAnnouncementOpen(false);

  // Message Payloads
  const mateusMsg = "Olá Mateus! Estive navegando no site da Arcadane e decidi entrar em contato direto por aqui. Gostaria de uma consultoria técnica sobre opções de voos de luxo e pacotes sob medida.";
  const girlsMsg = "Olá Maria e Mariana! Estive navegando no site da Arcadane e gostei muito da curadoria. Gostaria de tirar dúvidas e desenhar um roteiro boutique personalizado!";

  // Benefits parsing helper
  const parsedBenefits = seo.exitIntentBenefits
    ? seo.exitIntentBenefits.split(';').map(b => b.trim()).filter(b => b.length > 0)
    : [
        "Acesso exclusivo a tarifas confidenciais e upgrades",
        "Suporte premium 24 horas por dia em sua jornada",
        "Pesquisa personalizada de aéreo emitida com milhas",
        "Curadoria fina de experiências boutique singulares"
      ];

  return (
    <>
      <AnimatePresence>
        {/* ======================================= */}
        {/* EXIT INTENT MODAL                       */}
        {/* ======================================= */}
        {exitOpen && (
          <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4" id="exit-intent-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseExit}
              className="absolute inset-0 bg-[#6F5B4E]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-xl bg-[#FBF8E8] border border-[#DCCFC1] rounded-3xl shadow-2xl p-6 sm:p-10 overflow-hidden text-left"
              id="exit-intent-card"
            >
              {/* Highlight gradient */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#AF4934]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#3B5EA4]/5 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={handleCloseExit}
                className="absolute top-4 right-4 text-[#6F5B4E] hover:text-[#AF4934] bg-[#DCCFC1]/20 hover:bg-[#DCCFC1]/40 p-2.5 rounded-full transition-all border border-[#DCCFC1]/30 cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 text-left relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#AF4934]/10 border border-[#AF4934]/20 px-3 py-1 rounded-full">
                  <Compass className="w-3.5 h-3.5 text-[#AF4934] animate-spin-slow" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#AF4934] uppercase font-bold">
                    CONSULTORIA HUMANIZADA ARCADANE
                  </span>
                </div>

                <h3 className="font-display font-bold text-2.5xl sm:text-3.5xl text-[#AF4934] tracking-tight leading-tight">
                  {seo.exitIntentTitle || "Não encontrou o que estava procurando?"}
                </h3>
                
                <p className="text-[#6F5B4E] text-xs sm:text-sm leading-relaxed font-sans font-light">
                  {seo.exitIntentText || "O mundo é vasto demais para ser planejado por meio de caixas padronizadas. Nossos consultores especializados estão apostos para desenhar sob medida o roteiro exato que você tem em mente, sem burocracias."}
                </p>
              </div>

              {/* Core Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 py-5 border-y border-[#DCCFC1]/50 font-sans text-xs text-[#6F5B4E] relative z-10">
                {parsedBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#AF4934] mt-0.5">✦</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Contacts */}
              <div className="space-y-4 relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#6F5B4E]/80 font-bold block">
                  FALE DIRETAMENTE COM NOSSA EQUIPE NO WHATSAPP:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(mateusMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseExit}
                    className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-white/40 border border-[#DCCFC1]/50 hover:border-[#3B5EA4]/40 hover:bg-white transition-all duration-300 text-left"
                  >
                    <div className="absolute top-3 right-3 text-[#25D366] font-mono text-[8px] font-bold tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#25D366] animate-ping" />
                      ONLINE
                    </div>
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-full bg-[#3B5EA4] flex items-center justify-center text-white shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#AF4934] group-hover:text-[#3B5EA4] transition-colors font-display">
                          Falar com Mateus
                        </h4>
                        <p className="text-[10px] text-[#6F5B4E] font-sans mt-0.5">
                          Passagens aéreas com milhas, suporte de viagens e operacional técnico.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6F5B4E] font-mono mt-3 block group-hover:text-[#AF4934] transition-colors">
                      Iniciar atendimento ➜
                    </span>
                  </a>

                  <a
                    href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(girlsMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseExit}
                    className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-white/40 border border-[#DCCFC1]/50 hover:border-[#AF4934]/40 hover:bg-white transition-all duration-300 text-left"
                  >
                    <div className="absolute top-3 right-3 text-[#25D366] font-mono text-[8px] font-bold tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#25D366] animate-ping" />
                      ONLINE
                    </div>
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#AF4934] to-[#DCCFC1] flex items-center justify-center text-white shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#AF4934] group-hover:text-[#3B5EA4] transition-colors font-display">
                          Maria & Mariana
                        </h4>
                        <p className="text-[10px] text-[#6F5B4E] font-sans mt-0.5">
                          Curadoria luxuosa de hotéis boutique, mimos, gastronomia e lua de mel.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6F5B4E] font-mono mt-3 block group-hover:text-[#AF4934] transition-colors">
                      Iniciar atendimento ➜
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-5 text-center relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#6F5B4E]/60">
                  ★ ARCADANE TRAVEL EXPERIENCE • NOVO PORTAL
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ======================================= */}
        {/* PROMOTIONAL ANNOUNCEMENT DELAY MODAL     */}
        {/* ======================================= */}
        {announcementOpen && !exitOpen && (
          <div className="fixed inset-0 z-[29999] flex items-center justify-center p-4" id="announcement-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAnnouncement}
              className="absolute inset-0 bg-[#1C1815]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#1C1815] to-[#2B2420] border border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-10 text-left text-stone-200"
              id="announcement-card"
            >
              {/* Luxury gold/red ambient backdrop glow */}
              <div className="absolute top-0 left-12 w-48 h-48 bg-[#AF4934]/15 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={handleCloseAnnouncement}
                className="absolute top-4 right-4 text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-all border border-white/5 cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-[#AF4934]/20 border border-[#AF4934]/30 px-3 py-1 rounded-full text-[#FFAB9B]">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold">
                    DESTAQUE EXCLUSIVO ARCADANE
                  </span>
                </div>

                <h3 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {seo.announcementPopupTitle || "Novidades Arcadane: Roteiros Exclusivos!"}
                </h3>
                
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  {seo.announcementPopupText || "Preparamos uma seleção incomparável de destinos selecionados para quem busca o máximo de conforto, mimos e personalização."}
                </p>
              </div>

              {/* Action and Contacts */}
              <div className="mt-8 space-y-4 relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
                  CONVERSE AGORA MESMO COM NOSSOS ESPECIALISTAS:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mateus */}
                  <a
                    href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(mateusMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseAnnouncement}
                    className="group relative flex flex-col justify-between p-4 rounded-xl bg-white/5 border border-stone-850 hover:border-brand-primary hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white transition-colors font-display">
                        Falar com Mateus
                      </h4>
                      <p className="text-[10px] text-stone-450 font-sans mt-0.5">
                        Dúvidas operacionais e voos.
                      </p>
                    </div>
                    <span className="text-[10px] text-[#FFAB9B] font-mono mt-3 block group-hover:text-white transition-colors">
                      Chamar no WhatsApp ➜
                    </span>
                  </a>

                  {/* Maria/Mariana */}
                  <a
                    href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(girlsMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseAnnouncement}
                    className="group relative flex flex-col justify-between p-4 rounded-xl bg-white/5 border border-stone-850 hover:border-brand-secondary hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white transition-colors font-display">
                        Falar com Consultoria
                      </h4>
                      <p className="text-[10px] text-stone-450 font-sans mt-0.5">
                        Roteiros e hotéis boutique.
                      </p>
                    </div>
                    <span className="text-[10px] text-[#FFAB9B] font-mono mt-3 block group-hover:text-white transition-colors">
                      Chamar no WhatsApp ➜
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-850 text-center relative z-10 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
                  ★ LUXURY CONCIERGE SERVICE
                </span>
                <button
                  onClick={handleCloseAnnouncement}
                  className="text-[10px] uppercase font-mono tracking-wider text-stone-400 hover:text-white"
                >
                  Fechar janela
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
