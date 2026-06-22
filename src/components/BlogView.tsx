import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data';
import { BlogPost, PageId } from '../types';
import { Calendar, Clock, ChevronLeft, ArrowRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSeoSettings } from '../utils/cmsStore';

interface BlogViewProps {
  setActivePage?: (page: PageId) => void;
}

export default function BlogView({ setActivePage }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);

  useEffect(() => {
    const savedId = localStorage.getItem('arcadane_selected_post_id');
    if (savedId) {
      const found = BLOG_POSTS.find(p => String(p.id) === savedId);
      if (found) {
        if (found.id === 'quiz' && setActivePage) {
          setActivePage(PageId.TravelQuiz);
          localStorage.removeItem('arcadane_selected_post_id');
          return;
        }
        setSelectedPost(found);
      }
      localStorage.removeItem('arcadane_selected_post_id');
    }
  }, [setActivePage]);

  const handlePostClick = (post: BlogPost) => {
    if (post.id === 'quiz') {
      if (setActivePage) {
        setActivePage(PageId.TravelQuiz);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Dicas de Viagem': return 'bg-brand-secondary/20 text-brand-chocolate border border-brand-secondary/30';
      case 'Lua de Mel': return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/15';
      case 'Corporativo': return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/15';
      default: return 'bg-stone-100 text-stone-700 border border-stone-200';
    }
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Check tier 3 header
      if (trimmed.startsWith('### ')) {
        return (
          <h2 key={idx} className="font-display font-black text-xl sm:text-2xl text-brand-dark pt-6 pb-2 border-b border-stone-100 flex items-center gap-2 mt-8">
            {trimmed.replace('### ', '')}
          </h2>
        );
      }

      // Check subheader bold styled elements
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <h3 key={idx} className="font-display font-bold text-lg text-brand-dark pt-4">
            {trimmed.replace(/\*\*/g, '')}
          </h3>
        );
      }

      // Check checklist bullet lines
      if (trimmed.includes('✔') || trimmed.includes('✔️')) {
        const items = trimmed.split('\n').map(item => item.replace(/^[✔✔️]\s*/, '').trim());
        return (
          <ul key={idx} className="list-none pl-1 space-y-2.5 my-5 bg-stone-50/50 p-5 rounded-2xl border border-stone-100 text-left">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-stone-700 font-medium text-xs sm:text-sm">
                <span className="text-brand-primary font-bold select-none text-base">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Bullets check
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.includes('\n- ')) {
        const items = trimmed.split('\n').map(item => item.replace(/^[-•]\s*/, '').trim());
        return (
          <ul key={idx} className="list-none pl-1 space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-stone-600 text-xs sm:text-sm">
                <span className="text-brand-primary font-bold text-lg leading-none select-none mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Ordered list check
      if (/^\d+\.\s+/.test(trimmed) || trimmed.includes('\n1.')) {
        const items = trimmed.split('\n').map(item => {
          const cleanItem = item.replace(/^\d+\.\s+/, '');
          const match = cleanItem.match(/^\*\*(.*?)\*\*:\s*(.*)/);
          if (match) {
            return { bold: match[1], rest: match[2] };
          }
          return { bold: '', rest: cleanItem };
        });
        return (
          <ol key={idx} className="space-y-4 my-6">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3.5 text-stone-600 text-xs sm:text-sm leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="font-sans">
                  {item.bold ? <strong className="text-brand-dark font-bold font-display block mb-1">{item.bold}</strong> : null}
                  {item.rest}
                </span>
              </li>
            ))}
          </ol>
        );
      }

      // Plain paragraph
      return (
        <p key={idx} className="text-stone-600 text-xs sm:text-sm leading-relaxed text-justify font-sans">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-16 pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="blog-section">
      
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          
          /* LIST VIEW */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12 text-left"
          >
            
            {/* Header titles */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Blog de Viagens</span>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
                Dicas & Experiências
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
                Acompanhe as nossas principais matérias escritas com cuidado, curiosidades de destinos exuberantes e as melhores recomendações práticas para preparar sua próxima jornada especial.
              </p>
            </div>

            {/* Post cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="bg-white rounded-3xl border border-stone-100 shadow-xs flex flex-col justify-between overflow-hidden cursor-pointer group hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300"
                  id={`blog-article-${post.id}`}
                >
                  <div className="flex flex-col">
                    {/* Post Card Image */}
                    {post.image && (
                      <div className="h-48 sm:h-52 overflow-hidden relative">
                        <img
                          referrerPolicy="no-referrer"
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
                      </div>
                    )}
                    
                    <div className="p-6 sm:p-7 space-y-4">
                      {/* post metadata */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider font-mono ${getCategoryTheme(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 font-sans text-[11px]">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                      </div>

                      {/* post body excerpt */}
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-brand-dark group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* footer item layout */}
                  <div className="px-6 sm:p-7 py-4.5 bg-brand-light/40 border-t border-stone-50 flex items-center justify-between mt-auto">
                    <span className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-primary group-hover:text-brand-secondary transition-colors font-display uppercase tracking-wider">
                      Ler Matéria
                      <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                </article>
              ))}
            </div>

          </motion.div>
        ) : (
          
          /* DETAILED ARTICLE READING VIEW */
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="max-w-3xl mx-auto space-y-8 text-left"
            id="blog-reader"
          >
            {/* Back to list button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-brand-primary cursor-pointer hover:bg-stone-50 py-2.5 px-4 rounded-xl transition-colors font-display uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Feed do Blog
            </button>

            {/* Article Heading */}
            <div className="space-y-5">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${getCategoryTheme(selectedPost.category)}`}>
                {selectedPost.category}
              </span>
              <h1 className="font-display font-black text-2.5xl sm:text-4xl lg:text-4.5xl text-brand-dark tracking-tight leading-tight">
                {selectedPost.title}
              </h1>
              
              {/* post subtext metadata row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-stone-400 border-b border-stone-100 pb-5">
                <span className="flex items-center gap-1.5 font-sans">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  Publicado em {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5 font-sans">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  Tempo de leitura: {selectedPost.readTime}
                </span>
                <span className="text-brand-primary font-mono font-bold uppercase tracking-wider text-[10px]">
                  Por Equipe Arcadane Viagens
                </span>
              </div>
            </div>

            {/* Large full-bleed reading banner */}
            {selectedPost.image && (
              <div className="w-full aspect-video md:h-[350px] rounded-3xl overflow-hidden shadow-xs border border-stone-100">
                <img
                  referrerPolicy="no-referrer"
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Body content rendering of formatted components style */}
            <div className="font-sans space-y-6 pt-2" id="article-main-content">
              {renderFormattedContent(selectedPost.content)}
            </div>

            {/* Quote block inside details */}
            <div className="bg-gradient-to-br from-brand-light/50 to-brand-primary/5 p-6 sm:p-8 rounded-3xl border border-brand-primary/10 space-y-4 mt-12 text-left relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-[10px] uppercase tracking-widest font-mono font-black text-brand-primary flex items-center gap-1.5">
                <Compass className="w-4 h-4 animate-spin-slow text-brand-secondary" /> PLANEJE SEU ROTEIRO COM A ARCADANE
              </span>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans max-w-xl">
                Se inspirou com as nossas dicas exclusivas? Entre em contato agora mesmo e fale com nosso time de consultores para construir um roteiro sob medida do seu jeito, com toda a segurança técnica e condições especiais diferenciadas com os melhores parceiros de hotelaria e aviação.
              </p>
              <a
                href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(`Olá! Vim pelo link do site da Arcadane (Blog) e adorei a matéria de "*${selectedPost.title}*". Gostaria de programar uma consultoria personalizada.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-brand-primary hover:bg-brand-secondary text-white font-bold text-[11px] sm:text-xs font-display uppercase tracking-widest px-6 py-3.5 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              >
                Falar com a Consultoria no WhatsApp
              </a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
