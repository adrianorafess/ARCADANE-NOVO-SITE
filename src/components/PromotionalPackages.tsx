import React, { useState, useEffect } from 'react';
import { Plane, MapPin, CheckCircle2, X, MessageSquare, Tag, Camera, Upload, Link, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPromoPackages, savePromoPackages, DEFAULT_PROMO_PACKAGES, PromoPackage, getSeoSettings } from '../utils/cmsStore';
import { compressImage } from '../utils/imageCompressor';
import { useRafesEditor } from './RafesVisualBuilder';

export default function PromotionalPackages() {
  const { rafesOpen } = useRafesEditor();
  const [selectedPromo, setSelectedPromo] = useState<PromoPackage | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [promos, setPromos] = useState<PromoPackage[]>(() => getPromoPackages());
  const [activeEditPromoId, setActiveEditPromoId] = useState<string | null>(null);
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);

  const getInstallmentValue = (priceStr: string) => {
    const numericStr = priceStr.replace(/[^0-9]/g, '');
    const numeric = parseInt(numericStr, 10);
    if (isNaN(numeric)) return '00';
    const inst = Math.floor(numeric / 10);
    return inst.toLocaleString('pt-BR');
  };

  useEffect(() => {
    const handleCmsChange = () => {
      setPromos(getPromoPackages());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  // Close photo editing popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.photo-editor-container')) {
        return; // Click happened inside, let's keep it open
      }
      setActiveEditPromoId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const triggerContactModal = (promo: PromoPackage) => {
    setSelectedPromo(promo);
    setIsContactModalOpen(true);
  };

  const handleUpdatePromoPhoto = (promoId: string, newUrl: string) => {
    const currentPromos = getPromoPackages();
    const updated = currentPromos.map(p => {
      if (p.id === promoId) {
        return { ...p, image: newUrl };
      }
      return p;
    });
    savePromoPackages(updated);
    setActiveEditPromoId(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12 text-left" id="promotional-packages-promo">
      {/* Block Headings */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-mono text-[10px] uppercase tracking-widest font-bold">
            <Tag className="w-3.5 h-3.5 text-brand-primary animate-pulse" /> Pacotes Especiais Selecionados
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4.5xl text-stone-900 tracking-tight leading-tight">
            Pacotes em Destaque
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl leading-relaxed">
            Aproveite estes pacotes selecionados e consulte o orçamento completo online. Totalmente personalizáveis para as datas que desejar.
          </p>
        </div>
        

      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promos.map((promo) => {
          // Find original fallback photo if needed
          const originalPromo = DEFAULT_PROMO_PACKAGES.find(def => def.id === promo.id);
          const originalImage = originalPromo?.image || promo.image;

          return (
            <div 
              key={promo.id}
              className="flex flex-col bg-white rounded-3xl border border-stone-200 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden text-left group"
            >
              {/* Image Box */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <img 
                  referrerPolicy="no-referrer"
                  src={promo.image} 
                  alt={promo.title} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (originalImage && target.src !== originalImage) {
                      target.src = originalImage;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-brand-primary border border-blue-400/30 text-white font-mono text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-xs">
                  {promo.badge}
                </div>

                {/* Photo Change trigger button (Luxury Glassmorphic camera on top-right) */}
                {rafesOpen && (
                  <div className="absolute top-4 right-4 z-20 photo-editor-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEditPromoId(activeEditPromoId === promo.id ? null : promo.id);
                      }}
                      className="w-9 h-9 bg-black/55 hover:bg-stone-900 backdrop-blur-md hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-md border border-white/15 cursor-pointer focus:outline-hidden"
                      title="Clique para trocar a foto deste pacote"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    {/* Elegant dropdown popup overlay for picture update */}
                    {activeEditPromoId === promo.id && (
                      <div 
                        className="absolute right-0 top-11 z-50 flex flex-col gap-1.5 bg-stone-900 border border-white/10 p-2.5 rounded-2xl shadow-2xl min-w-[210px] text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/5">
                          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-stone-400">Alterar Imagem</span>
                          <button 
                            type="button" 
                            onClick={() => setActiveEditPromoId(null)}
                            className="text-stone-500 hover:text-stone-300 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Hidden input file tag */}
                        <input
                          type="file"
                          id={`promo-image-file-input-${promo.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressedUrl = await compressImage(file, 800, 800, 0.75);
                                handleUpdatePromoPhoto(promo.id, compressedUrl);
                              } catch (error) {
                                console.error("Error compressing image:", error);
                                alert("Falha ao processar a imagem. Tente outro arquivo.");
                              }
                            }
                          }}
                        />

                        {/* Upload local file */}
                        <button
                          type="button"
                          onClick={() => document.getElementById(`promo-image-file-input-${promo.id}`)?.click()}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Fazer upload de arquivo</span>
                        </button>

                        {/* URL Link */}
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt("Insira o link (URL) da imagem para este pacote:");
                            if (url && url.trim() !== "") {
                              handleUpdatePromoPhoto(promo.id, url.trim());
                            }
                          }}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                        >
                          <Link className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Inserir link da foto</span>
                        </button>

                        {/* Reset default picture */}
                        {originalImage && promo.image !== originalImage && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Restaurar a imagem original padrão deste destino?")) {
                                handleUpdatePromoPhoto(promo.id, originalImage);
                              }
                            }}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-stone-300 hover:text-red-400 hover:bg-red-950/25 transition-all cursor-pointer font-medium"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                            <span>Restaurar original</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tag Category bottom-left */}
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-white/90 font-sans text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                  <span>{promo.tag}</span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-stone-400 text-xs font-mono font-semibold uppercase tracking-wider">
                      <Plane className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{promo.route}</span>
                    </div>
                    <h3 className="font-display font-medium sm:font-bold text-xl sm:text-2xl text-stone-900 group-hover:text-brand-primary transition-colors leading-tight">
                      {promo.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light line-clamp-3">
                    {promo.description}
                  </p>

                  {/* Minimized highlights lists */}
                  <div className="pt-2 space-y-1.5">
                    {promo.highlights.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs text-stone-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlighted promotional instalment pricing */}
                  <div className="pt-2 flex flex-col gap-0.5 select-none text-left">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold">Plano de parcelamento</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-stone-900 font-sans text-sm font-medium">10x de</span>
                      <span className="text-xl font-bold text-brand-primary font-mono">R$</span>
                      <span className="text-3xl font-black text-stone-900 tracking-tight">{getInstallmentValue(promo.price)}</span>
                    </div>
                    <span className="text-[9.5px] text-stone-550 font-mono font-bold mt-1 uppercase tracking-wider block">
                      POR PESSOA EM APARTAMENTO DUPLO.
                    </span>
                  </div>
                </div>

                {/* CTA Button (WhatsApp contact) */}
                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(promo.waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white font-display font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 cursor-pointer hover:no-underline decoration-none"
                  >
                    <span>Reservar via WhatsApp</span>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
