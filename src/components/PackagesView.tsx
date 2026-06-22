import React, { useState, useEffect } from 'react';
import { getPackages } from '../utils/cmsStore';
import { Compass, Calendar, Plane, CreditCard, ArrowRight, ExternalLink, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getFallbackImage = (word: string) => {
  switch (word?.toLowerCase()) {
    case 'bali': return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80';
    case 'safari': return 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80';
    case 'gramado': return 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80';
    case 'nordeste': return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
    case 'parque': return 'https://images.unsplash.com/photo-1513885045263-c2d22a5fcb0a?auto=format&fit=crop&w=600&q=80';
    case 'cruzeiro': return 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80';
    case 'disney': return 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80';
    case 'ny': return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80';
    default: return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
  }
};

export default function PackagesView() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'exotico' | 'nacional' | 'cruzeiro' | 'eua'>('all');
  const [packagesList, setPackagesList] = useState(() => getPackages());

  useEffect(() => {
    const handleCmsChange = () => {
      setPackagesList(getPackages());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const filterTabs = [
    { id: 'all', label: 'Todos os Pacotes' },
    { id: 'exotico', label: 'Destinos Exóticos' },
    { id: 'nacional', label: 'Nacionais' },
    { id: 'cruzeiro', label: 'Cruzeiros' },
    { id: 'eua', label: 'Estados Unidos & América' }
  ];

  // We Cast type for any packages inside the filtered list
  const filteredPackages = activeFilter === 'all' 
    ? packagesList 
    : packagesList.filter(p => p.category === activeFilter);

  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'exotico': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
      case 'nacional': return 'bg-brand-secondary/15 text-brand-chocolate border-brand-secondary/30';
      case 'cruzeiro': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
      case 'eua': return 'bg-brand-chocolate/10 text-brand-chocolate border-brand-chocolate/25';
      default: return 'bg-brand-beige/50 text-brand-dark/80 border-brand-border/40';
    }
  };

  const handleRequestPackage = (title: string, duration: string) => {
    const text = `Olá Arcadane! Vim pelo site e me interessei no pacote "${title}" (${duration}). Gostaria de falar com um consultor para receber mais detalhes e personalizar meu roteiro!`;
    window.dispatchEvent(new CustomEvent('open_whatsapp_modal', { detail: { message: text } }));
  };

  return (
    <div className="space-y-16 pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="packages-section">
      
      {/* Page Title & Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Roteiros Selecionados</span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Nossos Pacotes de Viagem
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
          Navegue pelas nossas sugestões exclusivas de roteiros. Lembre-se de que cada pacote é 100% flexível e pode ser recalculado de acordo com suas datas precisas e quantidade de viajantes.
        </p>
      </div>

      {/* Filter Segment Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-gray-100 pb-6" id="packages-filter-tabs">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                : 'bg-white text-gray-600 border border-gray-100 hover:border-brand-primary/20 hover:text-brand-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Packages Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        id="packages-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredPackages.map((p) => {
            // Support either a custom injected cover image or falls back nicely to Unsplash key visual
            const packageImage = (p as any).image || getFallbackImage(p.imageWord);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300 transform-gpu"
                id={`package-card-${p.id}`}
              >
                {/* Visual Cover Header */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={packageImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                <div className="p-6 text-left space-y-5 flex-grow">
                  
                  {/* Header segment inside card */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider font-mono ${getCategoryImage(p.category)}`}>
                      {p.category === 'exotico' ? 'Destino Exótico' : p.category === 'nacional' ? 'Nacional' : p.category === 'cruzeiro' ? 'Cruzeiro' : 'Estados Unidos'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.duration}
                    </span>
                  </div>

                  {/* Package Main Name & description */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-brand-dark group-hover:text-brand-primary transition-colors leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                      {p.description}
                    </p>
                  </div>

                  {/* List Bullet Highlights */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-brand-dark">O que está incluído</span>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Compass className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Booking details bottom Segment overlay WITHOUT price */}
                <div className="bg-brand-light/60 p-5 border-t border-gray-50 flex items-center justify-center text-left mt-auto">
                  <button
                    type="button"
                    onClick={() => handleRequestPackage(p.title, p.duration)}
                    className="w-full bg-brand-primary hover:bg-[#25D366] text-white py-3.5 rounded-xl text-xs font-bold font-display shadow-md shadow-brand-primary/10 inline-flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 text-center uppercase tracking-widest"
                  >
                    <span>Solicitar Roteiro via WhatsApp</span>
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
