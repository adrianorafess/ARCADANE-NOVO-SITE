import React from 'react';
import { CustomPage } from '../utils/cmsStore';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CustomPageViewProps {
  page: CustomPage;
}

export default function CustomPageView({ page }: CustomPageViewProps) {
  // Simple yet highly robust renderer that turns markdown-like syntax into beautiful HTML
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }
      
      // Headers
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={idx} className="text-lg font-display font-bold text-[#3A2F28] mt-6 mb-3 tracking-tight">
            {trimmed.replace('###', '').trim()}
          </h3>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h2 key={idx} className="text-xl font-display font-bold text-[#3A2F28] mt-8 mb-4 tracking-tight">
            {trimmed.replace('##', '').trim()}
          </h2>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h1 key={idx} className="text-2xl font-display font-bold text-[#3A2F28] mt-10 mb-5 tracking-tight">
            {trimmed.replace('#', '').trim()}
          </h1>
        );
      }
      
      // List Items
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const itemText = trimmed.substring(1).trim();
        return (
          <ul key={idx} className="list-disc list-inside my-2 pl-4 text-sm text-[#6F5B4E] leading-relaxed">
            <li>{parseInlineMarkup(itemText)}</li>
          </ul>
        );
      }
      
      // Standard Paragraph
      return (
        <p key={idx} className="text-sm text-[#6F5B4E] leading-relaxed mb-4">
          {parseInlineMarkup(trimmed)}
        </p>
      );
    });
  };

  // Turn simple bold **text** or italic *text* into JSX
  const parseInlineMarkup = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[#3A2F28]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-[#6F5B4E]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="bg-[#FDFBF6] text-[#3A2F28] min-h-screen pt-44 pb-24 relative overflow-hidden" id={`custom-page-container-${page.id}`}>
      {/* Decorative background visual elements */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#AF4934]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Premium Hero Section */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-700 text-[10px] font-mono tracking-widest uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curadoria Exclusiva Arcadane</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight text-[#3A2F28] leading-tight mb-6">
          {page.title}
        </h1>
        
        <div className="h-[1px] w-24 bg-[#AF4934]/30 mx-auto mb-6" />
        
        {page.metaDescription && (
          <p className="text-xs sm:text-sm font-sans text-[#6F5B4E] leading-relaxed max-w-2xl mx-auto italic">
            "{page.metaDescription}"
          </p>
        )}
      </div>

      {/* Main Content Card */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="bg-[#FDFBF6] border border-[#DCCFC1]/50 shadow-2xl rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-md">
          {/* Elegant corner highlights */}
          <div className="absolute top-0 left-0 w-16 h-[1px] bg-[#AF4934]/40" />
          <div className="absolute top-0 left-0 w-[1px] h-16 bg-[#AF4934]/40" />
          <div className="absolute bottom-0 right-0 w-16 h-[1px] bg-[#AF4934]/40" />
          <div className="absolute bottom-0 right-0 w-[1px] h-16 bg-[#AF4934]/40" />

          {/* Render content */}
          <div className="font-sans space-y-2">
            {renderContent(page.content)}
          </div>

          {/* Quick CTA inside custom page */}
          <div className="mt-12 pt-8 border-t border-[#DCCFC1]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#AF4934]">Deseja planejar esta viagem?</h4>
              <p className="text-[11px] text-[#6F5B4E] mt-1">Converse diretamente com os curadores de sonhos da Arcadane.</p>
            </div>
            
            <a
              href="https://wa.me/554791492704?text=Ol%C3%A1!%20Estou%20na%20p%C3%A1gina%20sobre%20Destinos%20VIP%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#AF4934] text-white rounded-full text-xs font-bold font-sans uppercase tracking-widest hover:bg-[#AF4934]/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#AF4934]/25 cursor-pointer"
            >
              <span>Falar no WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
