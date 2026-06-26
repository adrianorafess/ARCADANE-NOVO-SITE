import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { Phone, Mail, MapPin, Instagram, ArrowRight, Compass, Sparkles, Trash2, Plus, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import ArcadaneIcon from './ArcadaneBrandIcon';
import { getSeoSettings, getHomeSettings, saveHomeSettings, saveSeoSettings, getCustomLogo, getLastUpdatedTime } from '../utils/cmsStore';
import { useRafesEditor } from './RafesVisualBuilder';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const { rafesOpen, editField } = useRafesEditor();
  const [customLogo, setCustomLogo] = useState<string | null>(() => getCustomLogo());
  const [logoError, setLogoError] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [seo, setSeo] = useState(() => getSeoSettings());
  const [home, setHome] = useState(() => getHomeSettings());
  const [lastUpdated, setLastUpdated] = useState(() => getLastUpdatedTime());

  useEffect(() => {
    setCustomLogo(getCustomLogo());
    const handleLogoChange = () => {
      const updated = getCustomLogo();
      setCustomLogo(updated);
      setLogoError(false);
    };
    
    const handleCmsChange = () => {
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
      setCustomLogo(getCustomLogo());
      setLastUpdated(getLastUpdatedTime());
    };

    window.addEventListener('arcadane_logo_changed', handleLogoChange);
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_logo_changed', handleLogoChange);
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const formatWhatsAppDisplay = (num: string) => {
    const clean = num.replace(/^55/, '');
    if (clean.length === 11) {
      return `${clean.substring(0, 2)} ${clean.substring(2, 7)}.${clean.substring(7)}`;
    }
    return clean;
  };

  const parseFooterLinks = (linksStr?: string) => {
    if (!linksStr) return [];
    return linksStr.split(';').map(item => {
      const parts = item.split('|');
      const label = parts[0]?.trim();
      const rawPageId = parts[1]?.trim();
      let pageId: PageId = PageId.Packages;
      if (rawPageId === 'custom_trip') pageId = PageId.CustomTrip;
      else if (rawPageId === 'about_us') pageId = PageId.AboutUs;
      else if (rawPageId === 'blog') pageId = PageId.Blog;
      else if (rawPageId === 'contact') pageId = PageId.ContactUs;
      else if (rawPageId === 'services') pageId = PageId.Services;
      else if (rawPageId === 'home') pageId = PageId.Home;
      return { label, pageId };
    }).filter(x => x.label);
  };

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#AF4934] text-[#FDFBF6] pt-20 pb-0 relative overflow-hidden border-t border-[#DCCFC1]" id="main-footer">
      {/* Editorial Sophisticated Spark Gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FDFBF6]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-[#FBF8E8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* UPPER GRID - High-End Editorial Style split by elegant vertical lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0 pb-16">
          
          {/* COLUMN 1: BRAND LOGO & ADDRESSES (lg:span-4) */}
          <div className="lg:col-span-4 lg:pr-12 lg:border-r lg:border-[#DCCFC1]/30 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Logo Brand Segment */}
              <div 
                className="flex items-center gap-3 w-fit cursor-pointer group select-none"
                onClick={() => handleNavClick(PageId.Home)}
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

              {/* Editorial Address List */}
              <div className="space-y-5 text-xs font-sans tracking-wide">
                <div className="space-y-2 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#FBF8E8] font-bold block">
                    {home.footerAddress.split(',')[2]?.trim() || 'Balneário Camboriú — SC'}
                  </span>
                  <p 
                    className={`text-[#FDFBF6] font-medium select-none ${
                      rafesOpen ? 'border border-dashed border-white/40 bg-white/10 p-1 rounded-md cursor-pointer hover:bg-white/15' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField('footerAddress', 'Editar Endereço do Rodapé', home.footerAddress, false, (newVal) => {
                          const updated = { ...home, footerAddress: newVal };
                          setHome(updated);
                          saveHomeSettings(updated);
                        });
                      }
                    }}
                  >
                    {home.footerAddress}
                  </p>
                  
                  <p 
                    className={`text-[#F3EEE3] select-none ${
                      rafesOpen ? 'border border-dashed border-white/40 bg-white/10 p-1 rounded-md cursor-pointer hover:bg-white/15' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField('footerText', 'Editar Frase/Curadoria do Rodapé', home.footerText, false, (newVal) => {
                          const updated = { ...home, footerText: newVal };
                          setHome(updated);
                          saveHomeSettings(updated);
                        });
                      }
                    }}
                  >
                    {home.footerText}
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#FBF8E8] font-bold block">
                    Canais de Atendimento
                  </span>
                  
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#F3EEE3]/80 uppercase tracking-wider font-mono">Mateus</span>
                      {rafesOpen ? (
                        <span
                          className="text-[#FDFBF6] hover:text-[#FBF8E8] font-bold text-xs cursor-pointer border border-dashed border-white/30 bg-white/5 px-1 py-0.5 rounded-sm w-fit"
                          onClick={() => {
                            editField('contactWhatsAppMateus', 'WhatsApp do Mateus (Apenas números + DDI)', seo.contactWhatsAppMateus, false, (newVal) => {
                              const clean = newVal.replace(/\D/g, '');
                              const updated = { ...seo, contactWhatsAppMateus: clean };
                              setSeo(updated);
                              saveSeoSettings(updated);
                            });
                          }}
                        >
                          {formatWhatsAppDisplay(seo.contactWhatsAppMateus)} (Editar)
                        </span>
                      ) : (
                        <a 
                          href={`https://wa.me/${seo.contactWhatsAppMateus}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#FDFBF6] hover:text-[#FBF8E8] font-bold text-xs transition-colors mt-0.5"
                        >
                          {formatWhatsAppDisplay(seo.contactWhatsAppMateus)}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#F3EEE3]/80 uppercase tracking-wider font-mono">Maria & Mariana</span>
                      {rafesOpen ? (
                        <span
                          className="text-[#FDFBF6] hover:text-[#FBF8E8] font-bold text-xs cursor-pointer border border-dashed border-white/30 bg-white/5 px-1 py-0.5 rounded-sm w-fit"
                          onClick={() => {
                            editField('contactWhatsAppMaria', 'WhatsApp de Maria & Mariana (Apenas números + DDI)', seo.contactWhatsAppMaria, false, (newVal) => {
                              const clean = newVal.replace(/\D/g, '');
                              const updated = { ...seo, contactWhatsAppMaria: clean };
                              setSeo(updated);
                              saveSeoSettings(updated);
                            });
                          }}
                        >
                          {formatWhatsAppDisplay(seo.contactWhatsAppMaria)} (Editar)
                        </span>
                      ) : (
                        <a 
                          href={`https://wa.me/${seo.contactWhatsAppMaria}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#FDFBF6] hover:text-[#FBF8E8] font-bold text-xs transition-colors mt-0.5"
                        >
                          {formatWhatsAppDisplay(seo.contactWhatsAppMaria)}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons & Privacy Policy */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/arcadaneviagens/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full border border-[#DCCFC1]/40 bg-[#3B5EA4]/20 hover:bg-[#3B5EA4] flex items-center justify-center text-[#FDFBF6] hover:text-[#FBF8E8] transition-all cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:financeiro@arcadaneviagens.com"
                  className="w-8 h-8 rounded-full border border-[#DCCFC1]/40 bg-[#3B5EA4]/20 hover:bg-[#3B5EA4] flex items-center justify-center text-[#FDFBF6] hover:text-[#FBF8E8] transition-all cursor-pointer"
                  aria-label="E-mail"
                  title="Fale conosco por e-mail"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <button 
                onClick={() => handleNavClick(PageId.Privacy)}
                className="text-[10px] text-[#F3EEE3] hover:text-[#FBF8E8] transition-colors uppercase tracking-widest font-mono block text-left"
              >
                Política de Privacidade & Termos
              </button>
            </div>
          </div>

          {/* COLUMN 2: DESTINOS (lg:span-2) */}
          <div className="lg:col-span-2 lg:px-8 lg:border-r lg:border-[#DCCFC1]/30">
            <h3 className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-[#FDFBF6] pt-2 mb-6">
              {home.footerCol1Title || 'Destinos'}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FBF8E8] font-sans">
              {parseFooterLinks(home.footerCol1Links).map((item, idx) => (
                <li key={idx}>
                  <button onClick={() => handleNavClick(item.pageId)} className="hover:text-white hover:underline transition-all cursor-pointer text-left">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: DESCUBRA-SE NO MUNDO (lg:span-3) */}
          <div className="lg:col-span-3 lg:px-10 lg:border-r lg:border-[#DCCFC1]/30">
            <h3 className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-[#FDFBF6] pt-2 mb-6">
              {home.footerCol2Title || 'Descubra-se no Mundo'}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FBF8E8] font-sans">
              {parseFooterLinks(home.footerCol2Links).map((item, idx) => (
                <li key={idx}>
                  <button onClick={() => handleNavClick(item.pageId)} className="hover:text-white hover:underline transition-all cursor-pointer text-left">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: SOBRE & NEWSLETTER (lg:span-3) */}
          <div className="lg:col-span-3 lg:pl-10 space-y-8">
            <div className="space-y-5">
              <h3 className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-[#FDFBF6] pt-2">
                Curadoria Arcadane
              </h3>
              <ul className="space-y-2.5 text-xs text-[#FBF8E8] font-sans">
                <li>
                  <button onClick={() => handleNavClick(PageId.AboutUs)} className="hover:text-white hover:underline transition-all cursor-pointer text-left">
                    Quem Somos (Nossa História)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick(PageId.Blog)} className="hover:text-white hover:underline transition-all cursor-pointer text-left">
                    Dicas de Viagem (Nosso Blog)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick(PageId.CustomTrip)} className="hover:text-white hover:underline transition-all cursor-pointer text-left font-bold text-[#F3EEE3] flex items-center gap-1">
                    <span>★ Planejar Roteiro Customizado</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick(PageId.ContactUs)} className="hover:text-white hover:underline transition-all cursor-pointer text-left">
                    Fale com Nossos Especialistas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavClick(PageId.Admin)} 
                    className="text-[10px] text-[#F3EEE3] hover:text-[#FDFBF6] transition-colors cursor-pointer text-left uppercase tracking-wider font-mono font-bold mt-2.5 pt-2.5 border-t border-[#DCCFC1]/30 flex items-center gap-1.5"
                  >
                    <span>⚙ Portal Administrativo</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#FDFBF6] font-bold">
                Assine Nosso Diário de Viagens
              </h4>
              <p className="text-xs text-[#F3EEE3]/90 leading-normal">
                Curadoria quinzenal com segredos de viagens e ofertas premium do mercado de turismo.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="relative mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="bg-[#AF4934] border-b border-[#F3EEE3]/55 text-xs text-[#FDFBF6] placeholder-[#DCCFC1] px-1 py-2.5 w-full focus:outline-none focus:border-[#FDFBF6] transition-colors pr-8 font-sans"
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#F3EEE3] hover:text-[#FDFBF6] transition-colors cursor-pointer"
                  aria-label="Inscrever email"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[10px] text-white font-medium font-mono mt-1"
                >
                  ✓ Assinatura confirmada com sucesso!
                </motion.p>
              )}
            </div>
          </div>

        </div>

        {/* TRUST BADGES & REGISTRATIONS - Site Seguro & CADASTUR */}
        <div className="border-t border-[#DCCFC1]/35 pt-10 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10" id="trust-badges-row">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#FDFBF6] font-bold">
              Segurança & Credibilidade
            </h4>
            <p className="text-[11px] text-[#F3EEE3]/85 font-sans leading-normal max-w-md">
              Viaje com segurança sob a proteção de canais criptografados de nível bancário e com o credenciamento completo de nosso registro CADASTUR nacional.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* SSL Site Seguro badge */}
            <div className="flex items-center gap-3 bg-[#F3EEE3]/10 px-4 py-2.5 rounded-xl border border-[#DCCFC1]/20 select-none transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 shrink-0" viewBox="0 0 45 45" fill="none">
                  <path d="M 14 19 C 14 10, 31 10, 31 19" stroke="#FDFBF6" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <rect x="8" y="18" width="29" height="21" rx="4.5" fill="#F3EEE3" />
                  <circle cx="22.5" cy="27" r="2.5" fill="#AF4934" />
                  <path d="M 22.5 28.5 L 22.5 33.5" stroke="#AF4934" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col items-start font-sans leading-none">
                <span className="text-[11px] font-bold tracking-wider text-white uppercase">SITE SEGURO</span>
                <div className="mt-1 bg-white/20 border border-white/30 px-2 py-0.5 rounded flex items-center justify-center leading-none">
                  <span className="text-white text-[8px] font-bold tracking-widest uppercase font-mono">SSL ATIVO</span>
                </div>
              </div>
            </div>

            {/* CADASTUR Oficial Badge */}
            <div className="flex items-center gap-3.5 bg-[#F3EEE3]/10 px-4 py-2.5 rounded-xl border border-[#DCCFC1]/20 select-none transform hover:scale-[1.02] transition-all duration-300">
              <svg className="w-14 h-9 shrink-0" viewBox="0 0 100 50">
                <path 
                  d="M 10,25 C 20,43 40,43 50,25 C 60,7 80,7 90,25 C 80,43 60,43 50,25 C 40,7 20,7 10,25 Z" 
                  fill="none" 
                  stroke="url(#cadastur-gradient)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cadastur-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DCCFC1" />
                    <stop offset="50%" stopColor="#F3EEE3" />
                    <stop offset="100%" stopColor="#FDFBF6" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="flex flex-col text-left font-sans leading-none">
                <span className="text-[8px] text-[#FDFBF6] tracking-wider font-bold">certificado</span>
                <span className="text-[17px] font-black text-white tracking-tighter leading-none mt-0.5">Cadastur</span>
                <span className="text-[7.5px] text-[#F3EEE3]/80 font-bold tracking-tight mt-0.5 whitespace-nowrap">Fazendo o turismo legal.</span>
              </div>
            </div>

            {/* PROTUR Blindado Badge */}
            <div className="flex items-center gap-3.5 bg-[#F3EEE3]/10 px-4 py-2.5 rounded-xl border border-[#DCCFC1]/20 select-none transform hover:scale-[1.02] transition-all duration-300">
              <img 
                referrerPolicy="no-referrer"
                className="w-10 h-10 shrink-0 object-contain brightness-110" 
                src="https://protur.com.br/wp-content/webp-express/webp-images/uploads/2023/02/logo_Agente_blindado-1024x984.png.webp"
                alt="Agente Blindado Protur"
              />
              <div className="flex flex-col text-left font-sans leading-none">
                <span className="text-[8px] text-[#FDFBF6] tracking-wider font-bold">membro oficial</span>
                <span className="text-[17px] font-black text-white tracking-tighter leading-none mt-0.5">Protur</span>
                <span className="text-[7.5px] text-[#F3EEE3]/80 font-bold tracking-tight mt-0.5 whitespace-nowrap">Agente Blindado certificado.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BALNEÁRIO CAMBORIÚ MAJESTIC PANORAMIC ARTISTIC WORK */}
      <div className="relative w-full h-[160px] md:h-[200px] mt-4 border-t border-[#DCCFC1]/30 bg-gradient-to-t from-[#6F5B4E] via-[#8E857D] to-[#AF4934] select-none pointer-events-none" id="balneario-vector-skyline">
        
        {/* Subtle glowing lights in the sky & clouds */}
        <div className="absolute inset-0 bg-radial-at-b from-[#FDFBF6]/5 via-transparent to-transparent opacity-60" />
        
        {/* Responsive Vector Sky Canvas */}
        <svg 
          viewBox="0 0 1200 160" 
          className="absolute bottom-0 left-0 w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Constellation / Small luxury stars sparkle */}
          <circle cx="150" cy="30" r="0.75" fill="#ffffff" opacity="0.4" />
          <circle cx="340" cy="20" r="0.6" fill="#ffffff" opacity="0.3" />
          <circle cx="580" cy="40" r="0.8" fill="#ffffff" opacity="0.5" />
          <circle cx="720" cy="25" r="0.5" fill="#ffffff" opacity="0.3" />
          <circle cx="950" cy="35" r="0.7" fill="#ffffff" opacity="0.4" />
          <circle cx="1110" cy="15" r="0.9" fill="#DCCFC1" opacity="0.6" />

          {/* Sleek High-Altitude Passenger Jet flying gracefully across the skyline layout */}
          <motion.g
            animate={{ 
              x: [-100, 1300],
              y: [15, 30]
            }}
            transition={{
              duration: 28,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {/* Jet fuel trail */}
            <line x1="-35" y1="3" x2="-2" y2="3" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="3 2" opacity="0.3" />
            
            {/* Fuselage/Aircraft nose and tail */}
            <path d="M 0,3 C 3,1.5 10,1 15,2.5 L 20,3 C 18,3.5 15,4.5 10,4 C 6,4.5 3,4.5 0,3.5 Z" fill="#ffffff" opacity="0.95" />
            {/* Luxury Tail Fin */}
            <path d="M 1.5,3 L -1.5,-1 L 1.5,-1 L 3.5,3 Z" fill="#DCCFC1" opacity="0.9" />
            {/* Upper Swept wing */}
            <path d="M 8.5,3 L 12.5,10.5 L 14.5,10.5 L 11.5,3 Z" fill="#ffffff" />
            {/* Under Swept wing (shaded) */}
            <path d="M 8.5,2.5 L 11.5,-4 L 13,-4 L 11,2.5 Z" fill="#AF4934" opacity="0.8" />
            
            {/* Red flashing collision alert beacon */}
            <circle cx="10" cy="3.5" r="0.6" fill="#EF4444">
              <animate attributeName="opacity" values="0.1;1;0.1" dur="1s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* BACKGROUND SHADOW HILLS (Barra Sul / Morro da Aguada) */}
          <path 
            d="M 0,165 L 0,60 Q 90,45 170,75 T 280,140 T 360,165" 
            fill="#6F5B4E" 
            opacity="0.85" 
          />
          
          {/* CABLE CAR WIRE (Morro da Aguada Station down to seaside terminal) */}
          <line 
            x1="90" y1="62" 
            x2="240" y2="127" 
            stroke="#AF4934" 
            strokeWidth="0.75" 
            strokeDasharray="2 2" 
            opacity="0.6" 
          />

          {/* CABLE CAR CABIN (Smooth movement back and forth following y = 0.433 * x + 23) */}
          <motion.g
            animate={{ 
              x: [0, 130, 0],
              y: [0, 56, 0]
            }}
            transition={{
              duration: 25,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >
            {/* Hanging arm */}
            <path d="M 100,66 L 100,58 L 102,58" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.8" />
            {/* Cable car capsule body */}
            <rect x="94" y="66" width="13" height="9.5" rx="2" fill="#DCCFC1" stroke="#ffffff" strokeWidth="0.6" />
            {/* Windows */}
            <rect x="96" y="68" width="4.5" height="4.5" rx="0.5" fill="#6F5B4E" />
            <rect x="101" y="68" width="4.5" height="4.5" rx="0.5" fill="#6F5B4E" />
            {/* Glow under cabin */}
            <circle cx="100.5" cy="76" r="1.5" fill="#DCCFC1" opacity="0.5" className="blur-[1px]" />
          </motion.g>

          {/* BALNEÁRIO CAMBORIÚ HIGH-RISE MODERN LUXURY SKYLINE */}
          {/* Tower 1 (One Tower Template with spire) */}
          <path d="M 310,165 L 310,50 L 320,32 L 330,50 L 330,165 Z" fill="#6F5B4E" stroke="#AF4934" strokeWidth="0.75" />
          <line x1="320" y1="32" x2="320" y2="12" stroke="#AF4934" strokeWidth="0.75" /> {/* Spire */}
          
          {/* Tower 2 & 3 (Yachthouse Twin Towers) */}
          <path d="M 355,165 L 355,42 L 368,34 L 368,165 M 373,165 L 373,34 L 386,42 L 386,165 M 368,60 L 373,60" fill="#6F5B4E" stroke="#DCCFC1" strokeWidth="0.75" />
          
          {/* Secondary architectural buildings with light patterns */}
          <path d="M 410,165 L 410,75 L 428,75 L 428,165 Z" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />
          
          {/* Tower 4 (Elegant Step design) */}
          <path d="M 445,165 L 445,67 L 454,58 L 454,48 L 468,48 L 468,58 L 477,67 L 477,165 Z" fill="#6F5B4E" stroke="#AF4934" strokeWidth="0.75" />
          
          {/* Mini skyscrapers filling gaps */}
          <rect x="495" y="85" width="16" height="80" fill="#8E857D" stroke="#6F5B4E" strokeWidth="0.75" />
          <rect x="520" y="95" width="12" height="70" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />
          
          {/* Tower 5 (Epic slender skyscraper) */}
          <path d="M 545,165 L 545,55 L 558,40 L 571,55 L 571,165 Z" fill="#6F5B4E" stroke="#DCCFC1" strokeWidth="0.75" />
          <line x1="558" y1="40" x2="558" y2="25" stroke="#DCCFC1" strokeWidth="0.75" />

          {/* Tower 6 */}
          <path d="M 590,165 L 590,75 L 612,75 L 612,165 Z" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />
          
          {/* Tower 7 (Curved crown) */}
          <path d="M 630,165 L 630,68 Q 643,54 656,68 L 656,165 Z" fill="#6F5B4E" stroke="#AF4934" strokeWidth="0.75" />
          
          {/* Tower 8 (Diagonal window slit structure) */}
          <path d="M 675,165 L 675,48 L 690,32 L 705,48 L 705,165 Z" fill="#6F5B4E" stroke="#DCCFC1" strokeWidth="0.75" />

          {/* Small fillers */}
          <rect x="720" y="80" width="15" height="85" fill="#8E857D" stroke="#6F5B4E" strokeWidth="0.75" />
          <rect x="745" y="90" width="18" height="75" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />

          {/* Tower 9 (Epic modern high-altitude complex) */}
          <path d="M 780,165 L 780,50 L 795,35 L 810,50 L 810,165 Z" fill="#6F5B4E" stroke="#AF4934" strokeWidth="0.75" />
          <line x1="795" y1="35" x2="795" y2="15" stroke="#AF4934" strokeWidth="0.75" />

          {/* Tower 10 */}
          <path d="M 830,165 L 830,75 L 852,75 L 852,165 Z" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />

          {/* Tower 11 (Twin pinnacles template) */}
          <path d="M 870,165 L 870,58 L 880,48 L 880,165 M 885,165 L 885,48 L 895,58 L 895,165" fill="#6F5B4E" stroke="#DCCFC1" strokeWidth="0.75" />

          {/* Tower 12 */}
          <rect x="915" y="85" width="22" height="80" fill="#6F5B4E" stroke="#8E857D" strokeWidth="0.75" />

          {/* Tower 13 (Arched tall luxury residence) */}
          <path d="M 955,165 L 955,68 Q 970,55 985,68 L 985,165 Z" fill="#6F5B4E" stroke="#AF4934" strokeWidth="0.75" />

          {/* Tiny yellow lighting sparkles inside buildings representing seaside windows */}
          <circle cx="320" cy="70" r="0.6" fill="#fcd34d" opacity="0.6" />
          <circle cx="320" cy="88" r="0.6" fill="#fcd34d" opacity="0.5" />
          <circle cx="360" cy="65" r="0.6" fill="#fcd34d" opacity="0.7" />
          <circle cx="360" cy="85" r="0.6" fill="#fcd34d" opacity="0.4" />
          <circle cx="380" cy="65" r="0.6" fill="#fcd34d" opacity="0.7" />
          <circle cx="380" cy="85" r="0.6" fill="#fcd34d" opacity="0.5" />
          <circle cx="455" cy="70" r="0.6" fill="#fcd34d" opacity="0.8" />
          <circle cx="467" cy="85" r="0.6" fill="#fcd34d" opacity="0.4" />
          <circle cx="558" cy="74" r="0.6" fill="#fcd34d" opacity="0.7" />
          <circle cx="558" cy="94" r="0.6" fill="#fcd34d" opacity="0.5" />
          <circle cx="685" cy="65" r="0.6" fill="#fcd34d" opacity="0.6" />
          <circle cx="695" cy="85" r="0.6" fill="#fcd34d" opacity="0.7" />
          <circle cx="795" cy="65" r="0.6" fill="#fcd34d" opacity="0.8" />
          <circle cx="795" cy="85" r="0.6" fill="#fcd34d" opacity="0.4" />
          <circle cx="875" cy="75" r="0.6" fill="#fcd34d" opacity="0.6" />
          <circle cx="890" cy="85" r="0.6" fill="#fcd34d" opacity="0.5" />
          <circle cx="970" cy="85" r="0.6" fill="#fcd34d" opacity="0.8" />

          {/* FERRIS WHEEL (Morro da Barra Norte / FG Big Wheel template) */}
          {/* Standard tripod bases */}
          <path d="M 1060,165 L 1090,82 L 1120,165" stroke="#AF4934" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 1090,165 L 1090,82" stroke="#6F5B4E" strokeWidth="0.75" />

          {/* ROTATING PART of FG BIG WHEEL */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity
            }}
            style={{
              transformOrigin: "1090px 82px"
            }}
          >
            {/* Concentric wheel circles  */}
            <circle cx="1090" cy="82" r="42" fill="none" stroke="#DCCFC1" strokeWidth="1.25" opacity="0.8" />
            <circle cx="1090" cy="82" r="35" fill="none" stroke="#AF4934" strokeWidth="0.75" opacity="0.5" />
            <circle cx="1090" cy="82" r="12" fill="none" stroke="#DCCFC1" strokeWidth="0.75" opacity="0.4" />
            <circle cx="1090" cy="82" r="3" fill="#ffffff" />

            {/* Ferris Wheel Spokes */}
            <line x1="1090" y1="40" x2="1090" y2="124" stroke="#DCCFC1" strokeWidth="0.5" opacity="0.5" />
            <line x1="1048" y1="82" x2="1132" y2="82" stroke="#DCCFC1" strokeWidth="0.5" opacity="0.5" />
            <line x1="1060" y1="52" x2="1120" y2="112" stroke="#DCCFC1" strokeWidth="0.5" opacity="0.5" />
            <line x1="1060" y1="112" x2="1120" y2="52" stroke="#DCCFC1" strokeWidth="0.5" opacity="0.5" />
            {/* Intercardinal spokes */}
            <line x1="1071" y1="45" x2="1109" y2="119" stroke="#AF4934" strokeWidth="0.4" opacity="0.4" />
            <line x1="1071" y1="119" x2="1109" y2="45" stroke="#AF4934" strokeWidth="0.4" opacity="0.4" />
            <line x1="1051" y1="67" x2="1129" y2="97" stroke="#AF4934" strokeWidth="0.4" opacity="0.4" />
            <line x1="1051" y1="97" x2="1129" y2="67" stroke="#AF4934" strokeWidth="0.4" opacity="0.4" />

            {/* Passenger cabins (Pods) dot markers */}
            <circle cx="1090" cy="40" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1090" cy="124" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1048" cy="82" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1132" cy="82" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1060" cy="52" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1120" cy="112" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1060" cy="112" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1120" cy="52" r="1.75" fill="#ffffff" stroke="#AF4934" strokeWidth="0.5" />
            <circle cx="1071" cy="45" r="1.4" fill="#ffffff" />
            <circle cx="1109" cy="119" r="1.4" fill="#ffffff" />
            <circle cx="1071" cy="119" r="1.4" fill="#ffffff" />
            <circle cx="1109" cy="45" r="1.4" fill="#ffffff" />
            <circle cx="1051" cy="67" r="1.4" fill="#ffffff" />
            <circle cx="1129" cy="97" r="1.4" fill="#ffffff" />
            <circle cx="1051" cy="97" r="1.4" fill="#ffffff" />
            <circle cx="1129" cy="67" r="1.4" fill="#ffffff" />
          </motion.g>

          {/* FOREGROUND WAVES (Parallax rolling effect at beach) */}
          <path 
            d="M -20,147 C 200,143 400,150 600,146 C 800,142 1000,149 1220,145 L 1220,165 L -20,165 Z" 
            fill="#8E857D" 
            stroke="#AF4934" 
            strokeWidth="0.5" 
            opacity="0.9" 
          />

          <path 
            d="M 10,151 C 250,148 500,154 750,150 C 1000,146 1150,152 1240,149 L 1240,165 L 10,165 Z" 
            fill="#6F5B4E" 
            stroke="#DCCFC1" 
            strokeWidth="0.5" 
            opacity="1" 
          />
        </svg>

        {/* Small badge overlay in the sand */}
        <div className="absolute bottom-3 left-4 md:left-8 flex items-center gap-1.5 opacity-65">
          <Sparkles className="w-3 h-3 text-white animate-pulse" />
          <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#FDFBF6]/90 font-bold">
            Balneário Camboriú — SC • Brasil
          </span>
        </div>
      </div>

      {/* CREDITS & COPYRIGHT INNER ROW */}
      <div className="bg-[#6F5B4E] border-t border-[#DCCFC1]/30 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#F3EEE3] font-mono tracking-wider gap-4">
            <p className="font-medium text-center sm:text-left text-[#FDFBF6]/90">
              {home.footerCopyright || '© 2026 Arcadane Viagens LTDA. Todos os direitos reservados. CNPJ 48.799.471/0001-38.'}
            </p>
            <div className="flex items-center gap-2">
              <span>Orgulhosamente criado por:</span>
              <a 
                href="https://www.rafes.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FDFBF6] hover:text-[#F3EEE3] font-bold tracking-widest uppercase transition-colors"
              >
                rafes.com.br
              </a>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-[8.5px] text-[#FDFBF6]/40 font-mono tracking-widest text-center mt-1 pt-2 border-t border-[#DCCFC1]/10 w-full">
              {lastUpdated}
            </div>
          )}
        </div>
      </div>

    </footer>
  );
}
