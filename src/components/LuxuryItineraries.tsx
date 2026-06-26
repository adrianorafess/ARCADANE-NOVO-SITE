import React, { useState, useEffect } from 'react';
import { Compass, Calendar, ArrowUpRight, Sparkles, X, Plus, Trash2, Camera, Upload, Link, RotateCcw, CheckCircle2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLuxuryItineraries, saveLuxuryItineraries, DEFAULT_LUXURY_TRIPS, getSeoSettings } from '../utils/cmsStore';
import { useRafesEditor } from './RafesVisualBuilder';
import { compressImage } from '../utils/imageCompressor';
import { LuxuryTrip } from '../types';

export default function LuxuryItineraries() {
  const { rafesOpen, editField } = useRafesEditor();
  const [trips, setTrips] = useState<LuxuryTrip[]>(() => getLuxuryItineraries());
  const [activeEditTripId, setActiveEditTripId] = useState<string | null>(null);
  const [seo, setSeo] = useState(() => getSeoSettings());

  // Sync with CMS updates
  useEffect(() => {
    const handleCmsChange = () => {
      setTrips(getLuxuryItineraries());
      setSeo(getSeoSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  // Close image editor dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.luxury-photo-editor-container')) {
        setActiveEditTripId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleUpdateTripPhoto = (tripId: string, newUrl: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return { ...t, image: newUrl };
      }
      return t;
    });
    setTrips(updated);
    saveLuxuryItineraries(updated);
    setActiveEditTripId(null);
  };

  const handleAddTrip = () => {
    const newTrip: LuxuryTrip = {
      id: `luxury-${Date.now()}`,
      title: "Roteiro Exclusivo das Maldivas",
      subTitle: "Bangalôs sobre a água e pôr do sol eterno em águas turquesas",
      operator: "Consultoria Premium Arcadane",
      duration: "8 Dias",
      tag: "Maldivas • Oceano Índico",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
      description: "Desfrute de uma experiência majestosa no paraíso das Maldivas. Hospede-se nos resorts mais exclusivos com mordomo privativo, jantares sob as estrelas na areia branca e passeios de iate privativos.",
      highlights: [
        "Hospedagem em Resort 5★ com bangalô privativo sobre a água",
        "Jantar romântico exclusivo na praia privativa ao pôr do sol",
        "Mergulho guiado com arraias jamanta e peixes exóticos",
        "Atendimento VIP e transfer marítimo de hidroavião incluso"
      ],
      link: "https://www.arcadaneviagens.com",
      badgeColor: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
      waMessage: "Olá Arcadane! Vi o roteiro exclusivo curado 'Roteiro Exclusivo das Maldivas' no site e gostaria de agendar uma consultoria exclusiva com vocês."
    };
    const updated = [...trips, newTrip];
    setTrips(updated);
    saveLuxuryItineraries(updated);
  };

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("⚠️ Tem certeza que deseja remover este roteiro exclusivo do site?")) {
      const updated = trips.filter(t => t.id !== id);
      setTrips(updated);
      saveLuxuryItineraries(updated);
    }
  };

  const handleConsult = (message: string) => {
    window.dispatchEvent(new CustomEvent('open_whatsapp_modal', { detail: { message } }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-14" id="luxury-itineraries-curated">
      
      {/* Editor top action button bar */}
      {rafesOpen && (
        <div className="flex justify-end pt-2 pb-1 text-right">
          <button
            type="button"
            onClick={handleAddTrip}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Roteiro Exclusivo</span>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue border border-brand-blue/10 font-sans text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-blue" /> Uma seleção especial de viagens para quem busca o extraordinário.
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4.5xl text-stone-900 tracking-tight leading-tight">
            Curadoria Signature
          </h2>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl leading-relaxed">
            Roteiros exclusivos, experiências raras e serviços escolhidos para transformar cada etapa da viagem em algo verdadeiramente único.
          </p>
        </div>
        

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {trips.map((trip) => {
          const originalTrip = DEFAULT_LUXURY_TRIPS.find(d => d.id === trip.id);
          const originalImage = originalTrip?.image || trip.image;

          return (
            <div 
              key={trip.id}
              id={`luxury-card-${trip.id}`}
              className="flex flex-col bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left group relative"
            >
              {/* Image banner overlayed with Tag & Indicator */}
              <div className="relative h-56 sm:h-60 lg:h-64 overflow-hidden shrink-0">
                <img 
                  referrerPolicy="no-referrer"
                  src={trip.image} 
                  alt={trip.title} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (originalImage && target.src !== originalImage) {
                      target.src = originalImage;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                />
                
                {/* Soft overlay protection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Badge for premium alignment */}
                <div 
                  className={`absolute top-5 left-5 inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white font-bold tracking-wide select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/20 text-amber-200 cursor-pointer hover:bg-amber-550/35 transition-all' : ''
                  }`}
                  onClick={() => {
                    if (rafesOpen) {
                      editField(`luxury-tag-${trip.id}`, 'Editar Categoria/Tag', trip.tag, false, (newVal) => {
                        const updated = trips.map(t => t.id === trip.id ? { ...t, tag: newVal } : t);
                        setTrips(updated);
                        saveLuxuryItineraries(updated);
                      });
                    }
                  }}
                >
                  <Compass className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>{trip.tag}</span>
                </div>

                {/* Tag Duration overlay bottom-left */}
                <div 
                  className={`absolute bottom-5 left-5 flex items-center gap-1.5 text-white select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/20 text-amber-200 cursor-pointer hover:bg-amber-550/35 px-2.5 py-1 rounded-lg transition-all' : ''
                  }`}
                  onClick={() => {
                    if (rafesOpen) {
                      editField(`luxury-duration-${trip.id}`, 'Editar Duração do Roteiro', trip.duration, false, (newVal) => {
                        const updated = trips.map(t => t.id === trip.id ? { ...t, duration: newVal } : t);
                        setTrips(updated);
                        saveLuxuryItineraries(updated);
                      });
                    }
                  }}
                >
                  <Calendar className="w-4 h-4 text-brand-secondary" />
                  <span className="font-mono text-sm uppercase tracking-wide font-extrabold">{trip.duration}</span>
                </div>

                {/* Photo Editor trigger / Delete trigger overlay */}
                {rafesOpen && (
                  <div className="absolute top-5 right-5 z-20 flex items-center gap-2 luxury-photo-editor-container">
                    
                    {/* Delete card */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="w-9 h-9 bg-red-650 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border border-red-500/30"
                      title="Excluir este roteiro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Camera Change triggers */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEditTripId(activeEditTripId === trip.id ? null : trip.id);
                      }}
                      className="w-9 h-9 bg-black/55 hover:bg-stone-900 text-white rounded-full flex items-center justify-center transition-all shadow-md border border-white/15 cursor-pointer"
                      title="Clique para trocar a foto"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    {activeEditTripId === trip.id && (
                      <div 
                        className="absolute right-0 top-11 z-50 flex flex-col gap-1.5 bg-stone-900 border border-white/10 p-2.5 rounded-2xl shadow-2xl min-w-[210px] text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/5">
                          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-stone-400">Alterar Imagem</span>
                          <button 
                            type="button" 
                            onClick={() => setActiveEditTripId(null)}
                            className="text-stone-500 hover:text-stone-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="file"
                          id={`luxury-image-file-input-${trip.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressedUrl = await compressImage(file, 800, 800, 0.75);
                                handleUpdateTripPhoto(trip.id, compressedUrl);
                              } catch (err) {
                                console.error("Error compressing luxury image:", err);
                                alert("Falha ao processar arquivo.");
                              }
                            }
                          }}
                        />

                        {/* Local upload */}
                        <button
                          type="button"
                          onClick={() => document.getElementById(`luxury-image-file-input-${trip.id}`)?.click()}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Fazer upload de arquivo</span>
                        </button>

                        {/* URL upload */}
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt("Insira o link (URL) da imagem deste roteiro:");
                            if (url && url.trim() !== "") {
                              handleUpdateTripPhoto(trip.id, url.trim());
                            }
                          }}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-medium"
                        >
                          <Link className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Inserir link da foto</span>
                        </button>

                        {originalImage && trip.image !== originalImage && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Restaurar a imagem original padrão do roteiro?")) {
                                handleUpdateTripPhoto(trip.id, originalImage);
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

              </div>

              {/* Inner Content Block */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    
                    {/* Operator */}
                    <span 
                      className={`font-mono text-[10px] uppercase tracking-widest text-[#AF4934] font-bold block select-none ${
                        rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-sm cursor-pointer hover:bg-amber-500/15 text-amber-600' : ''
                      }`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField(`luxury-operator-${trip.id}`, 'Editar Operadora', trip.operator, false, (newVal) => {
                            const updated = trips.map(t => t.id === trip.id ? { ...t, operator: newVal } : t);
                            setTrips(updated);
                            saveLuxuryItineraries(updated);
                          });
                        }
                      }}
                    >
                      {trip.operator}
                    </span>

                    {/* Title */}
                    <h3 
                      className={`font-display font-bold text-2xl sm:text-3xl text-stone-900 group-hover:text-brand-primary transition-colors leading-snug select-none ${
                        rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1.5 rounded-lg cursor-pointer hover:bg-amber-500/15 text-amber-700' : ''
                      }`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField(`luxury-title-${trip.id}`, 'Editar Título do Roteiro', trip.title, false, (newVal) => {
                            const updated = trips.map(t => t.id === trip.id ? { ...t, title: newVal } : t);
                            setTrips(updated);
                            saveLuxuryItineraries(updated);
                          });
                        }
                      }}
                    >
                      {trip.title}
                    </h3>

                    {/* SubTitle */}
                    <p 
                      className={`text-xs text-stone-400 font-serif italic mt-0.5 select-none ${
                        rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-md cursor-pointer hover:bg-amber-500/15 text-amber-500' : ''
                      }`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField(`luxury-subtitle-${trip.id}`, 'Editar Subtítulo do Roteiro', trip.subTitle, false, (newVal) => {
                            const updated = trips.map(t => t.id === trip.id ? { ...t, subTitle: newVal } : t);
                            setTrips(updated);
                            saveLuxuryItineraries(updated);
                          });
                        }
                      }}
                    >
                      {trip.subTitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p 
                    className={`text-sm text-stone-600 leading-relaxed font-light select-none ${
                      rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-2 rounded-xl cursor-pointer hover:bg-amber-500/15 text-amber-600' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField(`luxury-description-${trip.id}`, 'Editar Descrição do Roteiro', trip.description, true, (newVal) => {
                          const updated = trips.map(t => t.id === trip.id ? { ...t, description: newVal } : t);
                          setTrips(updated);
                          saveLuxuryItineraries(updated);
                        });
                      }
                    }}
                  >
                    {trip.description}
                  </p>

                  {/* Highlights List checkmarks */}
                  <div 
                    className={`space-y-2.5 pt-2 select-none ${
                      rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-2.5 rounded-xl cursor-pointer hover:bg-amber-500/15 text-amber-700' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField(`luxury-highlights-${trip.id}`, 'Editar Destaques (Um por linha)', trip.highlights.join('\n'), true, (newVal) => {
                          const lines = newVal.split('\n').map(l => l.trim()).filter(l => l !== "");
                          const updated = trips.map(t => t.id === trip.id ? { ...t, highlights: lines } : t);
                          setTrips(updated);
                          saveLuxuryItineraries(updated);
                        });
                      }
                    }}
                  >
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold block">Destaques Exclusivos (Clique para editar):</span>
                    <ul className="grid grid-cols-1 gap-2 text-xs text-stone-600">
                      {trip.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <span className="leading-tight">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Link & Button Config */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  {rafesOpen && (
                    <div className="flex flex-col gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 mb-2.5">
                      <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400">Configurações de Ações de Botões</span>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const res = window.prompt("Digite a nova mensagem padrão do WhatsApp:", trip.waMessage);
                          if (res !== null) {
                            const updated = trips.map(t => t.id === trip.id ? { ...t, waMessage: res } : t);
                            setTrips(updated);
                            saveLuxuryItineraries(updated);
                          }
                        }}
                        className="text-left font-sans text-xs text-brand-primary hover:underline font-bold"
                      >
                        ✏️ Redefinir Mensagem do WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const res = window.prompt("Digite o link oficial de reserva ou página Externa:", trip.link);
                          if (res !== null) {
                            const updated = trips.map(t => t.id === trip.id ? { ...t, link: res } : t);
                            setTrips(updated);
                            saveLuxuryItineraries(updated);
                          }
                        }}
                        className="text-left font-sans text-xs text-brand-primary hover:underline font-bold"
                      >
                        ✏️ Redefinir Link Externo
                      </button>
                    </div>
                  )}

                  {/* Standard CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* WhatsApp Consult Button - DIRECT TO MATEUS */}
                    <a
                      href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(trip.waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-chocolate active:scale-95 text-white font-display font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:no-underline decoration-none"
                    >
                      <span>Consultor Mateus</span>
                      <Navigation className="w-4 h-4 rotate-45 shrink-0" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
