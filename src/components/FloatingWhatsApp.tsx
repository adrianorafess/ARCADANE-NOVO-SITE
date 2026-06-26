import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCms);
    };
  }, []);

  const handleClick = () => {
    trackCustomEvent('whatsapp_click', 'floating_whatsapp');
    const defaultMsg = "Olá! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento para planejar minha próxima viagem.";
    window.dispatchEvent(new CustomEvent('open_whatsapp_modal', { detail: { message: defaultMsg } }));
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      id="global-floating-whatsapp"
    >
      {/* Floating Main Pulsating CTA button */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="shadow-2xl rounded-full flex items-center justify-center relative cursor-pointer group transition-all duration-300 bg-[#25D366] text-white w-15 h-15 border-none focus:outline-hidden"
        title="Fale com nossos consultores no WhatsApp"
        id="whatsapp-pulsating-bubble"
      >
        {/* Pulsating background ring effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-30 animate-ping" />
        <span className="absolute -inset-3.5 rounded-full bg-[#25D366] opacity-15 animate-ping [animation-delay:0.3s]" />

        <WhatsAppIcon className="w-7 h-7 drop-shadow-md text-white fill-white" />
      </motion.button>
    </div>
  );
}
