import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Phone, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { getSeoSettings } from '../utils/cmsStore';
import { trackCustomEvent } from '../utils/analyticsTracker';

interface Contact {
  name: string;
  role: string;
  phone: string;
  description: string;
  avatarBg: string;
  link: string;
}

export default function WhatsAppSelectorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      if (customEvent.detail && customEvent.detail.message) {
        setCustomMessage(customEvent.detail.message);
      } else {
        setCustomMessage("Olá! Vim pelo site da Arcadane e gostaria de iniciar um atendimento para planejar minha viagem.");
      }
      setIsOpen(true);
    };

    const handleCms = () => setSeo(getSeoSettings());

    window.addEventListener('open_whatsapp_modal', handleOpen);
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => {
      window.removeEventListener('open_whatsapp_modal', handleOpen);
      window.removeEventListener('arcadane_cms_data_changed', handleCms);
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const contacts: Contact[] = [
    {
      name: "Mateus",
      role: "Atendimento & Roteiros Personalizados",
      phone: seo.contactWhatsAppMateus || "554791492704",
      description: "Planejamento estruturado, voos, aéreo emitido com as melhores milhas e assessoria operacional.",
      avatarBg: "bg-gradient-to-tr from-[#3B5EA4] to-[#364d7c] border border-[#3B5EA4]/20",
      link: `https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=`
    },
    {
      name: "Maria & Mariana",
      role: "Curadoria de Experiências & Lua de Mel",
      phone: seo.contactWhatsAppMaria || "5547992008571",
      description: "Hotéis boutique espetaculares, mimos exclusivos, roteiros românticos e vivências singulares.",
      avatarBg: "bg-gradient-to-tr from-[#AF4934] to-[#DCCFC1] border border-white/20",
      link: `https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=`
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4" id="whatsapp-selector-overlay">
          {/* Backdrop screen protection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#6F5B4E]/80 backdrop-blur-md"
          />

          {/* Modal Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#FBF8E8] border border-[#DCCFC1] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden text-left"
            id="whatsapp-selector-inner-card"
          >
            {/* Background luxury gradient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#AF4934]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#3B5EA4]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button top corner */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#6F5B4E] hover:text-[#AF4934] bg-[#DCCFC1]/20 hover:bg-[#DCCFC1]/40 p-2 rounded-full transition-all cursor-pointer border border-[#DCCFC1]/30"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Content */}
            <div className="space-y-3 pr-6 select-none text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#AF4934] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Atendimento Exclusivo Arcadane
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#AF4934] tracking-tight leading-none">
                Escolha seu Canal de Atendimento
              </h3>
              <p className="text-xs text-[#6F5B4E] font-sans leading-relaxed">
                Temos consultores dedicados para cada tipo de solicitação. Escolha o contato ideal para iniciar o planejamento do seu roteiro premium:
              </p>
            </div>

            {/* Advisors list row */}
            <div className="space-y-4 mt-6">
              {contacts.map((c, idx) => {
                const completeLink = `${c.link}${encodeURIComponent(customMessage)}`;
                return (
                  <a
                    key={idx}
                    href={completeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackCustomEvent('whatsapp_click', 'whatsapp_modal');
                      closeModal();
                    }}
                    className="block group rounded-2xl border border-[#DCCFC1]/60 bg-white/40 hover:bg-white p-4 sm:p-5 transition-all text-left relative overflow-hidden"
                  >
                    {/* Interactive left bar */}
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#AF4934] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-4">
                      {/* Avatar container */}
                      <div className={`w-12 h-12 rounded-full shrink-0 ${c.avatarBg} text-white flex items-center justify-center font-display font-black text-sm uppercase`}>
                        {c.name === 'Mateus' ? <User className="w-5 h-5 text-white" /> : <Users className="w-5 h-5 text-white" />}
                      </div>

                      {/* Content column */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AF4934] font-bold text-sm tracking-wide font-display group-hover:text-[#3B5EA4] transition-colors">
                            Conversar com {c.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#25D366] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse inline-block" />
                            WHATSAPP
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-[#3B5EA4] font-mono tracking-wider uppercase font-semibold block leading-tight">
                          {c.role}
                        </span>
                        
                        <p className="text-[11px] text-[#6F5B4E] font-sans leading-relaxed pt-1">
                          {c.description}
                        </p>
                        
                        <span className="text-[10px] text-[#6F5B4E] font-mono block pt-1 group-hover:text-[#AF4934] transition-colors font-bold">
                          Chamar no {c.phone} ➜
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Bottom Safe Badge info */}
            <div className="mt-6 pt-5 border-t border-[#DCCFC1] flex items-center justify-between text-[10px] text-[#6F5B4E] font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B5EA4]" /> Ambientes com Criptografia de Ponta
              </span>
              <span className="uppercase tracking-widest text-[8px] text-[#AF4934] font-bold">Arcadane Viagens</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
