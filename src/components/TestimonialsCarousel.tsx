import { uploadImageToStorage } from '../utils/firebase';
import React, { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote, Camera, Upload, Link, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTestimonials, saveTestimonials } from '../utils/cmsStore';
import { compressImage } from '../utils/imageCompressor';
import { useRafesEditor } from './RafesVisualBuilder';

export default function TestimonialsCarousel() {
  const { rafesOpen, editField } = useRafesEditor();
  const [testimonials, setTestimonials] = useState(() => getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [itemsToShow, setItemsToShow] = useState(3);
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with CMS updates
  useEffect(() => {
    const handleCmsChange = () => {
      setTestimonials(getTestimonials());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  // Clear imageErrors list whenever testimonials list is modified/saved
  useEffect(() => {
    setImageErrors({});
  }, [testimonials]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Soft loop navigation
  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Continuous Autoplay management
  useEffect(() => {
    if (testimonials.length === 0) return;
    autoplayTimerRef.current = setInterval(() => {
      handleNext();
    }, 5000); // Cycle every 5 seconds

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, testimonials.length]);

  // Determine indices of current cards to render in the viewport
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const indices = [];
    for (let i = 0; i < itemsToShow; i++) {
      indices.push((currentIndex + i) % testimonials.length);
    }
    return indices;
  };

  const handleUpdateTestimonialPhoto = (index: number, newUrl: string) => {
    const currentTestimonials = getTestimonials();
    const updated = [...currentTestimonials];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        imageUrl: newUrl || undefined
      };
      saveTestimonials(updated);
    }
    setActiveEditIndex(null);
  };

  const handleUpdateTestimonialField = (index: number, field: 'name' | 'text' | 'role' | 'rating', value: any) => {
    const currentTestimonials = getTestimonials();
    const updated = [...currentTestimonials];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      saveTestimonials(updated);
      setTestimonials(updated);
    }
  };

  const visibleIndices = getVisibleTestimonials();

  // Close editing menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.photo-editor-container')) {
        return; // Click happened inside, let's keep it open
      }
      setActiveEditIndex(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="space-y-6 relative" id="testimonials-carousel">
      {/* Navigation buttons toolbar */}
      <div className="flex items-center justify-end px-2 sm:px-4" id="carousel-controls">
        {/* Arrow navigators */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="w-10 h-10 rounded-full border border-stone-150 bg-white shadow-xs hover:shadow-md text-stone-600 hover:text-brand-primary flex items-center justify-center hover:border-brand-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
            aria-label="Depoimento Anterior"
            id="btn-prev-testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="w-10 h-10 rounded-full border border-stone-150 bg-white shadow-xs hover:shadow-md text-stone-600 hover:text-brand-primary flex items-center justify-center hover:border-brand-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
            aria-label="Próximo Depoimento"
            id="btn-next-testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid viewport with responsive item layout slide support */}
      <div className="relative overflow-hidden min-h-[340px] md:min-h-[300px] px-2 py-4" id="testimonials-view-stage">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleIndices.map((index) => {
              const t = testimonials[index];
              if (!t) return null;
              return (
                <motion.div
                  key={`${index}-${itemsToShow}`} // include itemsToShow key to force reset positions when resizing
                  initial={{ opacity: 0, x: direction * 80, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 80, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 38 }}
                  className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xs text-left relative flex flex-col justify-between group hover:border-brand-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 min-h-[280px]"
                  id={`carousel-card-${index}`}
                >
                  {/* Chic Quote decoration in top-right */}
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-primary/5 group-hover:text-brand-primary/8 transition-colors select-none pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    {/* 5 Stars rating display with delay stagger entrance */}
                    <div 
                      className={`flex gap-1 select-none ${rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-md cursor-pointer hover:bg-amber-500/20' : ''}`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField('testimonial-stars-' + index, 'Estrelas de avaliação (1 a 5)', String(t.rating), false, (newVal) => {
                            const stars = Math.min(5, Math.max(1, parseInt(newVal) || 5));
                            handleUpdateTestimonialField(index, 'rating', stars);
                          });
                        }
                      }}
                    >
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quotation text content with premium scroll if text is super large */}
                    <div 
                      className={`overflow-y-auto max-h-[140px] pr-1 scrollbar-thin scrollbar-thumb-stone-100 select-none ${
                        rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1.5 rounded-lg cursor-pointer hover:bg-amber-500/20' : ''
                      }`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField('testimonial-text-' + index, 'Editar Texto do Depoimento', t.text, true, (newVal) => {
                            handleUpdateTestimonialField(index, 'text', newVal);
                          });
                        }
                      }}
                    >
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic font-sans antialiased font-medium ml-1">
                        "{t.text}"
                      </p>
                    </div>
                  </div>

                  {/* Profile section bottom row */}
                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-stone-50 shrink-0 relative photo-editor-container">
                                        {/* Floating trigger on avatar circle */}
                    <div 
                      className={`relative shrink-0 ${rafesOpen ? 'group/avatar cursor-pointer' : ''}`}
                      onClick={(e) => {
                        if (!rafesOpen) return;
                        e.stopPropagation();
                        setActiveEditIndex(activeEditIndex === index ? null : index);
                      }}
                      title={rafesOpen ? "Clique para trocar esta foto" : undefined}
                    >
                      {t.imageUrl && !imageErrors[index] ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-primary/20 shadow-inner shrink-0 bg-stone-100">
                          <img 
                            src={t.imageUrl} 
                            alt={t.name} 
                            className={`w-full h-full object-cover transition-transform duration-350 animate-fade-in ${rafesOpen ? 'group-hover/avatar:scale-105' : ''}`}
                            referrerPolicy="no-referrer"
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, [index]: true }));
                            }}
                          />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold font-display text-xs sm:text-sm select-none shadow-inner shrink-0 transition-colors animate-fade-in ${rafesOpen ? 'group-hover/avatar:bg-brand-primary/25' : ''}`}>
                          {t.name.split(' ').map(n => n[0] || '').join('')}
                        </div>
                      )}

                      {/* Luxurious mini edit overlay badge */}
                      {rafesOpen && (
                        <div className="absolute inset-0 bg-stone-950/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-250">
                          <Camera className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    <div 
                      className={`flex flex-col select-none ${rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''}`}
                      onClick={() => {
                        if (rafesOpen) {
                          editField('testimonial-name-' + index, 'Editar Nome do Cliente', t.name, false, (newVal) => {
                            handleUpdateTestimonialField(index, 'name', newVal);
                          });
                        }
                      }}
                      title={rafesOpen ? "Clique para editar nome/cargo deste autor de depoimento!" : undefined}
                    >
                      <span className="font-display font-black text-brand-dark text-xs sm:text-sm leading-none">
                        {t.name}
                      </span>
                      {t.role && (
                        <span className="text-[10px] sm:text-xs text-stone-400 mt-1 leading-none font-mono">
                          {t.role}
                        </span>
                      )}
                    </div>

                    {/* Compact elegant in-place popup for changing testimonial photo */}
                    {rafesOpen && activeEditIndex === index && (
                      <div 
                        className="absolute bottom-14 left-0 z-50 flex flex-col gap-1.5 bg-stone-900 border border-white/10 p-2.5 rounded-2xl shadow-xl min-w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/5">
                          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-stone-400">Alterar Foto</span>
                          <button 
                            type="button" 
                            onClick={() => setActiveEditIndex(null)}
                            className="text-stone-500 hover:text-stone-300 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="file"
                          id={`testimonial-file-input-${index}`}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressedUrl = await uploadImageToStorage(file);
                                handleUpdateTestimonialPhoto(index, compressedUrl);
                              } catch (error) {
                                console.error("Error compressing image:", error);
                                alert("Falha ao processar a imagem. Tente outro arquivo.");
                              }
                            }
                          }}
                        />

                        {/* Button 1: Upload */}
                        <button
                          type="button"
                          onClick={(e) => {
                            const container = e.currentTarget.closest('.photo-editor-container');
                            const input = container?.querySelector('input[type="file"]') as HTMLInputElement;
                            if (input) {
                              input.click();
                            } else {
                              document.getElementById(`testimonial-file-input-${index}`)?.click();
                            }
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer font-medium"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Enviar arquivo</span>
                        </button>

                        {/* Button 2: URL Link */}
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt("Insira o link (URL) da nova imagem:");
                            if (url && url.trim() !== "") {
                              handleUpdateTestimonialPhoto(index, url.trim());
                            }
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-stone-200 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer font-medium"
                        >
                          <Link className="w-3.5 h-3.5 text-brand-secondary" />
                          <span>Link da foto</span>
                        </button>

                        {/* Button 3: Restore Default */}
                        {DEFAULT_TESTIMONIALS[index]?.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Restaurar imagem padrão original deste cliente?")) {
                                handleUpdateTestimonialPhoto(index, DEFAULT_TESTIMONIALS[index].imageUrl || "");
                              }
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-stone-300 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer font-medium"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                            <span>Foto original</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination bullets indicators at footer */}
      <div className="flex items-center justify-center gap-2 pt-2" id="carousel-dots">
        {testimonials.map((_, idx) => {
          // Highlight dot if it points to active index
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-350 cursor-pointer focus:outline-hidden ${
                isActive ? 'w-6 bg-brand-primary' : 'w-2 bg-stone-200 hover:bg-stone-300'
              }`}
              title={`Ir para o depoimento ${idx + 1}`}
              aria-label={`Ir para o depoimento ${idx + 1}`}
              aria-selected={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
