import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Check, ExternalLink } from 'lucide-react';
import { getSeoSettings } from '../utils/cmsStore';
import { trackCustomEvent } from '../utils/analyticsTracker';

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.016-5.08-2.87-6.934C16.32 2.019 13.84 1.002 11.22 1c-5.41 0-9.81 4.403-9.813 9.802-.001 1.772.475 3.502 1.38 5.027L1.693 21.5l5.8-.846h.154zm11.332-6.417c-.31-.155-1.833-.904-2.115-1.006-.281-.102-.486-.155-.69.155-.205.31-.795.102-.975.31-.18.205-.359.231-.67.076-.31-.155-1.309-.482-2.493-1.538-.922-.822-1.543-1.839-1.724-2.149-.18-.31-.019-.478.136-.632.14-.139.31-.362.465-.544.155-.18.206-.31.31-.518.103-.207.051-.389-.026-.544-.077-.155-.69-1.662-.946-2.28-.249-.597-.502-.516-.69-.526-.18-.008-.385-.01-.59-.01-.205 0-.539.077-.822.389-.282.31-1.077 1.051-1.077 2.562 0 1.511 1.099 2.97 1.253 3.176.154.207 2.164 3.31 5.242 4.639.731.317 1.302.507 1.748.649.735.233 1.4.2 1.929.122.589-.088 1.833-.75 2.09-1.449.256-.699.256-1.295.18-1.425-.077-.13-.282-.208-.59-.364z"/>
  </svg>
);

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [seo, setSeo] = useState(() => getSeoSettings());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside and handle CMS updates
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleCms = () => setSeo(getSeoSettings());
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('arcadane_cms_data_changed', handleCms);
    };
  }, []);

  const messageText = encodeURIComponent("Olá! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento para planejar minha próxima viagem.");

  const contacts = [
    {
      name: "Mateus",
      role: "Atendimento & Roteiros Personalizados",
      phone: seo.contactWhatsAppMateus || "554791492704",
      description: "Planejamento tático, voos e orçamentos.",
      avatarBg: "bg-teal-500",
      link: `https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${messageText}`
    },
    {
      name: "Maria e Mariana",
      role: "Curadoria de Experiências & Lua de Mel",
      phone: seo.contactWhatsAppMaria || "5547992008571",
      description: "Hotéis boutique, pacotes cooperados e mimos exclusivos.",
      avatarBg: "bg-rose-500",
      link: `https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${messageText}`
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      id="global-floating-whatsapp"
    >
      {/* Pop up Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-80 sm:w-88 bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden glass-card"
            id="whatsapp-channel-selector"
          >
            {/* Header part */}
            <div className="bg-stone-950 p-5 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-display font-black tracking-wide uppercase leading-none">Consultores Arcadane</h4>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Online • Resposta imediata
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of custom advisors */}
            <div className="p-4 space-y-3 bg-stone-900/60 max-h-[380px] overflow-y-auto">
              <p className="text-[11px] text-stone-400 px-1 text-left font-sans">
                Selecione o consultor ideal para iniciar a criação do seu roteiro dos sonhos:
              </p>
              
              {contacts.map((c, index) => (
                <a
                  key={index}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCustomEvent('whatsapp_click', 'floating_whatsapp')}
                  className="block group rounded-2xl border border-stone-800 bg-black/30 hover:bg-stone-950 p-3.5 transition-all text-left relative overflow-hidden"
                >
                  {/* Decorative faint glow */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full shrink-0 ${c.avatarBg} text-white font-display font-bold text-sm flex items-center justify-center shadow-inner`}>
                      {c.name.split(' ')[0][0]}
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs font-display">{c.name}</span>
                        <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-[#25D366] transition-colors" />
                      </div>
                      <span className="text-[10px] font-semibold text-stone-300 block font-mono leading-none">
                        {c.role}
                      </span>
                      <p className="text-[10px] text-stone-400 leading-relaxed font-sans pt-0.5">
                        {c.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer with branding */}
            <div className="bg-stone-950 px-5 py-3 text-center border-t border-stone-850">
              <span className="text-[9px] tracking-[0.2em] text-stone-500 font-sans uppercase">
                Arcadane Agência de Viagens
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Pulsating CTA button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`shadow-2xl rounded-full flex items-center justify-center relative cursor-pointer group transition-all duration-300 ${
          isOpen 
            ? 'bg-rose-600 text-white w-14 h-14' 
            : 'bg-[#25D366] text-white w-15 h-15'
        }`}
        title="Fale com a Arcadane no WhatsApp"
        id="whatsapp-pulsating-bubble"
      >
        {/* Pulsating background ring effect */}
        {!isOpen && (
          <>
            <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-30 animate-ping" />
            <span className="absolute -inset-3.5 rounded-full bg-[#25D366] opacity-15 animate-ping [animation-delay:0.3s]" />
          </>
        )}

        {isOpen ? (
          <X className="w-6 h-6 animate-rotate-once" />
        ) : (
          <WhatsAppIcon className="w-7 h-7 drop-shadow-md text-white fill-white" />
        )}
      </motion.button>
    </div>
  );
}
