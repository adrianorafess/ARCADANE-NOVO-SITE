import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, X, MessageSquare, Clock, Sparkles, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { getSeoSettings, getPromoPackages } from '../utils/cmsStore';
import { trackCustomEvent } from '../utils/analyticsTracker';

export default function FloatingFlashDeals() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [promoTitle, setPromoTitle] = useState('Plantão de Ofertas Relâmpago ⚡');
  const [promoMessage, setPromoMessage] = useState('Aproveite as tarifas exclusivas do plantão de hoje!');
  
  // Load default promotional items or get custom promo packages
  const promoPackages = getPromoPackages().slice(0, 3);

  useEffect(() => {
    // Show tooltip automatically after 4 seconds to grab attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    // Hide tooltip automatically after 10 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 14000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleOpenPanel = () => {
    setIsOpen(true);
    setShowTooltip(false);
    trackCustomEvent('flash_deals_open', 'floating_red_button');
  };

  const handleClosePanel = () => {
    setIsOpen(false);
  };

  const handleContactAdvisor = (packageName: string) => {
    trackCustomEvent('flash_deals_contact', packageName);
    const msg = `Olá! Vi o Plantão de Ofertas no site e tenho muito interesse na tarifa promocional para: *${packageName}*. Como posso garantir esta vaga?`;
    window.dispatchEvent(new CustomEvent('open_whatsapp_modal', { detail: { message: msg } }));
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Blinking Red Button */}
      <div 
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3"
        id="floating-flash-deals-root"
      >
        <div className="relative">
          {/* Attention-grabbing Tooltip Speech bubble */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                className="absolute bottom-16 left-0 bg-red-600 text-white text-xs font-sans font-bold py-2.5 px-4 rounded-2xl shadow-xl whitespace-nowrap flex items-center gap-2 border border-red-500"
                id="flash-deals-bubble"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                <span>Ofertas de Plantão Ativas! ⚡</span>
                <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-red-600 rotate-45 border-r border-b border-red-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Pulsating Red Button */}
          <motion.button
            onClick={handleOpenPanel}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl relative cursor-pointer focus:outline-hidden transition-all duration-300 border border-red-500/30"
            title="Ver Ofertas de Plantão"
            id="flash-deals-floating-btn"
          >
            {/* Blinking Halo Effect */}
            <span className="absolute -inset-1.5 rounded-full bg-red-600 opacity-40 animate-ping" />
            <span className="absolute -inset-3.5 rounded-full bg-red-600 opacity-20 animate-ping [animation-delay:0.3s]" />
            
            <Flame className="w-7 h-7 text-white fill-white/10 animate-pulse" />
          </motion.button>
        </div>
      </div>

      {/* Stunning Modern Flash Deals Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[30000] flex justify-start" id="flash-deals-drawer-overlay">
            {/* Dark elegant backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePanel}
              className="absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md"
            />

            {/* Sidebar content container */}
            <motion.div
              initial={{ x: '-100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#12100E] border-r border-stone-800 text-stone-200 shadow-2xl flex flex-col justify-between"
              id="flash-deals-drawer"
            >
              {/* Inner content */}
              <div className="flex-grow overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
                
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500">
                      <Flame className="w-5 h-5 fill-red-500/20 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-500 font-bold block">
                        EXCLUSIVO ARCADANE
                      </span>
                      <h3 className="font-display font-bold text-lg text-white">
                        Plantão de Tarifas 24h
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={handleClosePanel}
                    className="text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 p-2 rounded-full border border-stone-800 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtitle/Ticker banner */}
                <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                    <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                    <span>TARIFAS COM VAGAS LIMITADAS</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Negociamos tarifas promocionais diretamente com hotéis boutique e companhias aéreas para emissão imediata. O atendimento de plantão está ativo agora!
                  </p>
                </div>

                {/* Flash Deals items list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-500" /> Pacotes em Destaque no Plantão
                  </h4>

                  {promoPackages.length > 0 ? (
                    promoPackages.map((pkg, idx) => (
                      <div 
                        key={idx}
                        className="bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between gap-4 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-stone-500 tracking-wider">
                              {pkg.tag || pkg.badge || pkg.route || 'Oferta Relâmpago'}
                            </span>
                            <span className="bg-red-600/10 text-red-500 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-red-500/20">
                              TARIFAS EXCLUSIVAS
                            </span>
                          </div>
                          <h5 className="font-display font-bold text-white group-hover:text-red-400 transition-colors">
                            {pkg.title}
                          </h5>
                          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                            {pkg.description}
                          </p>
                          
                          {/* Premium Price details */}
                          {pkg.price && (
                            <div className="pt-2 flex items-baseline gap-1.5">
                              <span className="text-[10px] text-stone-500 font-mono">Sob consulta ou</span>
                              <span className="text-sm font-display font-black text-white group-hover:text-red-500 transition-colors">
                                {pkg.price}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleContactAdvisor(pkg.title)}
                          className="w-full py-2.5 px-4 bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-stone-700/80 hover:border-red-500 group-hover:shadow-md"
                        >
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          Garantir Vaga de Plantão
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    ))
                  ) : (
                    // Beautiful Default Fallbacks in case CMS is loading or empty
                    <>
                      <div className="bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-stone-500 tracking-wider">8 DIAS / 7 NOITES</span>
                            <span className="bg-red-600/10 text-red-500 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-red-500/20">HOT DEAL</span>
                          </div>
                          <h5 className="font-display font-bold text-white">Maldivas Clássico & Overwater Villa</h5>
                          <p className="text-xs text-stone-400 leading-relaxed">
                            Resort 5 estrelas all-inclusive com bangalô sobre as águas e transfer premium em hidroavião.
                          </p>
                        </div>
                        <button
                          onClick={() => handleContactAdvisor('Maldivas Clássico')}
                          className="w-full py-2.5 px-4 bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Consultar Tarifa Exclusiva
                        </button>
                      </div>

                      <div className="bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-stone-500 tracking-wider">10 DIAS</span>
                            <span className="bg-red-600/10 text-red-500 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-red-500/20">MAIS DESEJADO</span>
                          </div>
                          <h5 className="font-display font-bold text-white">Itália Toscana & Costa Amalfitana</h5>
                          <p className="text-xs text-stone-400 leading-relaxed">
                            Experiência de luxo com hotéis boutique selecionados, passeios privados e guia exclusivo em português.
                          </p>
                        </div>
                        <button
                          onClick={() => handleContactAdvisor('Itália Toscana & Amalfi')}
                          className="w-full py-2.5 px-4 bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Consultar Tarifa Exclusiva
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Footer Section */}
              <div className="p-6 border-t border-stone-800 bg-stone-950/40 space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-mono text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Sua cotação é protegida por assessoria jurídica e seguro viagem.</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleContactAdvisor('Plantão Geral')}
                    className="flex-grow py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/20 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    Chamar Plantão Geral
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
