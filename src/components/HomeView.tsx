import React, { useState, useEffect, useRef } from 'react';
import { PageId, ServiceItem } from '../types';
import { BLOG_POSTS } from '../data';
import TestimonialsCarousel from './TestimonialsCarousel';
import LuxuryItineraries from './LuxuryItineraries';
import PromotionalPackages from './PromotionalPackages';
import { getHomeSettings, saveHomeSettings, getServices, saveServices, getSeoSettings, getTrajectoryPhoto } from '../utils/cmsStore';
import { compressImage } from '../utils/imageCompressor';
import { useRafesEditor } from './RafesVisualBuilder';
import { 
  Briefcase, Car, Hotel, ShieldCheck, Ticket, Sparkles, Heart, 
  Navigation, Compass, Plane, Languages, Sliders, ArrowUpRight, Star,
  CheckCircle, Play, Pause, Settings, MapPin, Calendar, Users, ChevronDown, Check, X, Phone,
  Instagram, MessageCircle, Clock, RefreshCw, Upload, Link, Camera, Plus, Trash2, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  setActivePage: (page: PageId) => void;
}

const BeflySearchWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'voos' | 'hoteis' | 'pacotes'>('voos');
  const [origem, setOrigem] = useState('Chapecó (XAP)');
  const [destino, setDestino] = useState('Orlando (MCO)');
  const [dataIda, setDataIda] = useState('2026-07-15');
  const [dataVolta, setDataVolta] = useState('2026-07-25');
  const [passageiros, setPassageiros] = useState('2 Adultos');
  const [settings, setSettings] = useState(() => getHomeSettings());

  useEffect(() => {
    const handleCmsChange = () => {
      setSettings(getHomeSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
  }, []);

  const useRealBeflyWidget = settings.widgetType === 'befly';

  useEffect(() => {
    if (useRealBeflyWidget && containerRef.current) {
      containerRef.current.innerHTML = `
        <div id="wrapper">
          <befly-widget language="pt-br" new-tab="true"></befly-widget>
        </div>
      `;
    }
  }, [useRealBeflyWidget]);

  if (useRealBeflyWidget) {
    return (
      <div 
        ref={containerRef}
        className="w-full min-h-[140px]" 
      />
    );
  }

  return (
    <div className="w-full bg-white text-stone-800 rounded-xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 pb-3 mb-4 gap-6">
        <button 
          onClick={() => setActiveTab('voos')}
          className={`pb-2 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'voos' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Plane className="w-4 h-4" />
          Passagens Aéreas
        </button>
        <button 
          onClick={() => setActiveTab('hoteis')}
          className={`pb-2 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'hoteis' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Hotel className="w-4 h-4" />
          Hotéis de Luxo
        </button>
        <button 
          onClick={() => setActiveTab('pacotes')}
          className={`pb-2 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'pacotes' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Pacotes Completos
        </button>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
        {/* Origem */}
        <div className="space-y-1 text-left">
          <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">Origem</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
            <input 
              type="text" 
              value={origem} 
              onChange={(e) => setOrigem(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Destino */}
        <div className="space-y-1 text-left">
          <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">Destino</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary" />
            <input 
              type="text" 
              value={destino} 
              onChange={(e) => setDestino(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Datas */}
        <div className="space-y-1 text-left">
          <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">Ida e Volta</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Ida e Volta"
              value={`${dataIda} • ${dataVolta}`}
              onChange={() => {}}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Passageiros */}
        <div className="space-y-1 text-left">
          <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">Viajantes</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              value={passageiros} 
              onChange={(e) => setPassageiros(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button 
            type="button"
            onClick={() => {
              const text = `Olá Arcadane! Gostaria de cotar ${activeTab === 'voos' ? 'voos' : activeTab === 'hoteis' ? 'hospedagem' : 'um pacote completo'} de ${origem} para ${destino} saindo em ${dataIda} e retornando em ${dataVolta} para ${passageiros}.`;
              window.open(`https://wa.me/5547992008571?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Buscar Viagem
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          </button>
        </div>
      </div>

      {/* Subtle Dev mode badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 text-[9px] text-stone-400 border-t border-gray-50 pt-2 font-mono gap-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Buscador Arcadane inteligente integrado ao WhatsApp em Modo Sandbox
        </span>
        <span className="text-stone-300">
          O widget oficial OnerTravel/BeFly carregará em produção no seu domínio oficial
        </span>
      </div>
    </div>
  );
};

const FloatingBuscador = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(() => getHomeSettings());
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const handleCmsChange = () => {
      setSettings(getHomeSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
  }, []);

  const useRealBeflyWidget = settings.widgetType === 'befly';

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past 500px down on PC
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject widget HTML when visible and not minimized
  useEffect(() => {
    if (useRealBeflyWidget && isVisible && !isMinimized && containerRef.current) {
      // We schedule a microtask or small timeout to ensure the DOM is painted and ready
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div id="wrapper">
              <befly-widget language="pt-br" new-tab="true"></befly-widget>
            </div>
          `;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [useRealBeflyWidget, isVisible, isMinimized]);

  if (!useRealBeflyWidget || !isVisible) return null;

  return (
    <div className="hidden lg:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            key="minimized-pill"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-display font-bold text-xs rounded-full shadow-2xl hover:shadow-brand-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-white/10 whitespace-nowrap"
          >
            <Plane className="w-4 h-4 text-brand-secondary animate-bounce" />
            <span className="tracking-wider uppercase">BUSCADOR DE PASSAGENS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-[540px] bg-white rounded-2xl shadow-2xl border border-brand-border/40 overflow-hidden flex flex-col text-left"
          >
            {/* Header */}
            <div className="bg-brand-primary/5 px-4.5 py-3 border-b border-brand-border/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary">
                  Buscador Oficial Arcadane
                </span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg hover:bg-black/5 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold"
                title="Minimizar Buscador"
              >
                <span>MINIMIZAR</span>
                <ChevronDown className="w-4 h-4 text-brand-primary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-white max-h-[420px] overflow-y-auto">
              <div ref={containerRef} className="w-full min-h-[140px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


interface TypewriterTitleProps {
  rafesOpen: boolean;
  editField: any;
}

const TypewriterTitle = React.memo(({ rafesOpen, editField }: TypewriterTitleProps) => {
  const [endings, setEndings] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arcadane_typewriter_endings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return ENDINGS_LIST;
  });

  const [currentEndingIndex, setCurrentEndingIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleCmsChange = () => {
      const saved = localStorage.getItem('arcadane_typewriter_endings');
      if (saved) {
        try {
          setEndings(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
  }, []);

  useEffect(() => {
    let timer: any;
    const currentList = endings.length > 0 ? endings : ENDINGS_LIST;
    const safeIndex = currentEndingIndex % currentList.length;
    const fullText = currentList[safeIndex] || "o mundo.";
    
    const tick = () => {
      if (!isDeleting) {
        const nextText = fullText.slice(0, currentText.length + 1);
        setCurrentText(nextText);
        
        if (nextText === fullText) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 3000);
        } else {
          timer = setTimeout(tick, 90);
        }
      } else {
        const nextText = fullText.slice(0, currentText.length - 1);
        setCurrentText(nextText);
        
        if (nextText === "") {
          setIsDeleting(false);
          setCurrentEndingIndex((prev) => (prev + 1) % currentList.length);
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 40);
        }
      }
    };
    
    timer = setTimeout(tick, isDeleting ? 40 : 90);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentEndingIndex, endings]);

  return (
    <h1 
      className={`font-display font-medium text-4xl sm:text-5.5xl md:text-6.5xl lg:text-[5rem] xl:text-[5.5rem] tracking-tight leading-[1.1] text-white min-h-[3.3em] md:min-h-[2.2em] lg:min-h-0 select-none ${
        rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/15 p-2 rounded-2xl cursor-pointer hover:bg-amber-500/10' : ''
      }`}
      onClick={() => {
        if (rafesOpen) {
          const saved = localStorage.getItem('arcadane_typewriter_endings');
          const currentList = saved ? JSON.parse(saved) : ENDINGS_LIST;
          editField('typewriter-endings', 'Frases do Tipo Escritor da Hero (Separadas por vírgulas)', currentList.join(', '), false, (newVal: string) => {
            const parsed = newVal.split(',').map(s => s.trim()).filter(Boolean);
            localStorage.setItem('arcadane_typewriter_endings', JSON.stringify(parsed));
            window.dispatchEvent(new Event('arcadane_cms_data_changed'));
          });
        }
      }}
      title={rafesOpen ? "Clique para editar as frases rotativas do topo estilo Rafes!" : undefined}
    >
      “Viajar é descobrir <span className="text-brand-secondary inline-block relative after:content-[''] after:inline-block after:w-[2px] after:h-[0.8em] after:bg-brand-secondary/80 after:ml-0.5 after:animate-[pulse_1s_infinite]">{currentText}</span>”
    </h1>
  );
});

interface DestinationBento {
  id: number;
  title: string;
  largeTitle: string;
  image: string;
  shortDesc: string;
  paragraphs: string[];
}

interface BentoImageUploaderProps {
  index: number;
  onImageChange: (index: number, url: string) => void;
  className?: string;
  alwaysVisible?: boolean;
  onUrlEditRequest?: (index: number) => void;
}

function BentoImageUploader({
  index,
  onImageChange,
  className = "",
  alwaysVisible = false,
  onUrlEditRequest
}: BentoImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { rafesOpen } = useRafesEditor();

  if (!rafesOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImage(file, 800, 800, 0.75);
      onImageChange(index, compressedUrl);
    } catch (error) {
      console.error("Error compressing bento image:", error);
      alert("Falha ao processar a imagem. Tente outro arquivo.");
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUrlEditRequest) {
      onUrlEditRequest(index);
    } else {
      const url = window.prompt("Insira o link (URL) da nova imagem:");
      if (url && url.trim() !== "") {
        onImageChange(index, url.trim());
      }
    }
  };

  return (
    <div
      className={`absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-brand-dark/85 hover:bg-brand-dark backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 transition-all duration-300 ${
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        title="Enviar foto do computador"
        className="flex items-center gap-1 text-[11px] font-display text-white hover:text-brand-secondary transition-colors cursor-pointer font-medium"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Enviar</span>
      </button>
      <span className="text-white/20 text-xs">|</span>
      <button
        onClick={handleLinkClick}
        title="Colar link de imagem da internet"
        className="flex items-center gap-1 text-[11px] font-display text-white hover:text-brand-secondary transition-colors cursor-pointer font-medium"
      >
        <Link className="w-3.5 h-3.5" />
        <span>Link</span>
      </button>
    </div>
  );
}

const BENTO_DESTINATIONS: DestinationBento[] = [
  {
    id: 1,
    title: "Destinos Exóticos",
    largeTitle: "Destinos exóticos para viajar: experiências únicas que vão além do comum",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Viagens extraordinárias para lugares remotos e fascinantes.",
    paragraphs: [
      "Viajar para destinos exóticos é, muitas vezes, sair do roteiro tradicional e se permitir viver algo verdadeiramente transformador.",
      "São viagens que não se resumem a fotos bonitas, elas despertam sensações, ampliam perspectivas e criam memórias que permanecem por toda a vida.",
      "Entre os destinos exóticos mais desejados do mundo, Bali, na Indonésia, encanta pela espiritualidade e pela conexão com a natureza. Já o Deserto do Atacama, no Chile, impressiona pela imensidão silenciosa e pelas paisagens quase surreais.",
      "Mas existe uma experiência que eleva esse conceito a outro nível: o safari na África.",
      "Explorar regiões como o Serengeti, na Tanzânia, ou reservas no Quênia é vivenciar a natureza em seu estado mais puro. Observar animais selvagens em liberdade, acompanhar o ritmo da vida natural e sentir a grandiosidade daquele cenário é algo difícil de traduzir em palavras e impossível de esquecer.",
      "Destinos como Maldivas também entram nesse universo, combinando exclusividade, tranquilidade e paisagens que parecem irreais. Já em Marrakech, no Marrocos, cada detalhe, das cores aos aromas, transforma o simples ato de caminhar em uma experiência cultural profunda.",
      "Mas viajar para lugares assim exige mais do que vontade.",
      "Questões como melhor época, deslocamentos internos, escolha de hospedagens e experiências fazem toda a diferença entre uma viagem comum e uma jornada memorável.",
      "E é justamente nesse nível de detalhe que viagens bem planejadas se destacam.",
      "Porque quando tudo está alinhado, o viajante deixa de se preocupar com a logística e passa a viver o que realmente importa: o momento."
    ]
  },
  {
    id: 2,
    title: "Nacionais",
    largeTitle: "Destinos nacionais para viajar: lugares incríveis no Brasil que você precisa conhecer",
    image: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Descubra a grandiosidade e os paraísos secretos do Brasil.",
    paragraphs: [
      "O Brasil é um dos países mais ricos do mundo quando o assunto é diversidade de paisagens e experiências.",
      "Ainda assim, muitos viajantes acabam subestimando o potencial de destinos nacionais, sem perceber que algumas das experiências mais marcantes podem estar mais próximas do que imaginam.",
      "Entre os destaques, Fernando de Noronha continua sendo um dos destinos mais desejados, com águas cristalinas, vida marinha abundante e uma atmosfera que combina preservação e exclusividade.",
      "Já os Lençóis Maranhenses oferecem um cenário único no mundo: lagoas de água doce entre dunas, formando paisagens que mudam ao longo do ano e surpreendem em cada visita.",
      "Outro destino que vem ganhando cada vez mais destaque é Alter do Chão, no Pará. Conhecido como o “Caribe Amazônico”, encanta pelas praias de água doce, pela tranquilidade e pela conexão com a natureza.",
      "Para quem busca experiências mais reservadas e sofisticadas, a Praia do Espelho, na Bahia, oferece um equilíbrio perfeito entre rusticidade e charme, com cenários preservados e uma atmosfera mais exclusiva.",
      "Mas viajar pelo Brasil também exige estratégia.",
      "Questões como Sazonalidade, acesso, escolha de hospedagem e organização de roteiro impactam diretamente na experiência. É comum que destinos incríveis sejam mal aproveitados simplesmente por falta de planejamento adequado.",
      "Quando bem estruturada, a viagem ganha outro nível. E é nesse cuidado com os detalhes que o Brasil revela todo o seu potencial, muitas vezes surpreendendo até os viajantes mais experientes."
    ]
  },
  {
    id: 3,
    title: "Cruzeiros",
    largeTitle: "Cruzeiros: como escolher a experiência ideal para sua próxima viagem",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800",
    shortDesc: "Navegue pelo mundo cercado por conforto cinco estrelas.",
    paragraphs: [
      "Os cruzeiros têm se consolidado como uma das formas mais completas e encantadoras de viajar.",
      "A proposta é simples, mas extremamente sofisticada: conhecer diferentes destinos, com conforto, praticidade e uma estrutura que acompanha você durante toda a jornada.",
      "Hoje, os cruzeiros vão muito além da ideia tradicional. São verdadeiros resorts flutuantes, com gastronomia refinada, entretenimento de alto nível, spas, atividades e experiências pensadas para diferentes perfis de viajantes.",
      "Rotas pelo Caribe estão entre as mais procuradas, passando por destinos como Bahamas e Cozumel, ideais para quem busca águas cristalinas e clima descontraído. Já o Mediterrâneo oferece uma imersão cultural única, conectando cidades como Roma, Barcelona e Atenas em um único roteiro.",
      "Para quem deseja algo ainda mais exclusivo, existem cruzeiros de luxo e expedição, com itinerários diferenciados e serviços altamente personalizados.",
      "Mas apesar de toda essa praticidade, a escolha do cruzeiro ideal exige atenção.",
      "Companhia marítima, tipo de cabine, localização dentro do navio, roteiro e época do ano são fatores que influenciam diretamente na experiência. Muitas vezes, o que parece apenas uma escolha simples pode definir o ritmo, o conforto e até o nível de aproveitamento da viagem.",
      "Por isso, entender o perfil do viajante e alinhar expectativas é parte essencial do planejamento.",
      "Quando essa escolha é bem feita, o cruzeiro deixa de ser apenas uma viagem e se torna uma experiência fluida, surpreendente e extremamente prazerosa do início ao fim."
    ]
  },
  {
    id: 4,
    title: "Estados Unidos",
    largeTitle: "Viagem para os Estados Unidos: roteiros além do óbvio para explorar o país",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Roteiros sob medida para famílias e experiências VIPs imbatíveis.",
    paragraphs: [
      "Falar em viagem para os Estados Unidos ainda leva muitas pessoas a pensarem automaticamente em Orlando e nos parques temáticos.",
      "Mas o país vai muito além disso.",
      "Os Estados Unidos são um destino extremamente diverso, capaz de oferecer experiências completamente diferentes — muitas vezes dentro da mesma viagem.",
      "Para quem busca neve e esportes de inverno, regiões como Colorado e Lake Tahoe se destacam, com estações de ski bem estruturadas e paisagens impressionantes durante a temporada de inverno.",
      "Já para os amantes de estrada e liberdade, a famosa Rota 66 é uma experiência icônica. Cruzar o país de carro, passando por cidades históricas e paisagens únicas, transforma a viagem em algo muito mais profundo do que apenas visitar destinos.",
      "Os parques nacionais também merecem destaque. Lugares como o Grand Canyon e Yellowstone revelam um lado surpreendente do país, com cenários naturais grandiosos e experiências que fogem completamente do turismo tradicional.",
      "E claro, cidades como Nova York, Las Vegas, Los Angeles e San Francisco continuam sendo referências globais, cada uma com sua personalidade, estilo e ritmo.",
      "Mas o grande diferencial de uma viagem para os Estados Unidos está na forma como ela é construída.",
      "Roteiros mal planejados podem gerar deslocamentos cansativos, perda de tempo e experiências superficiais.",
      "Por outro lado, quando há estratégia na escolha dos destinos, na logística e na distribuição dos dias, a viagem ganha fluidez e profundidade.",
      "E é nesse equilíbrio entre planejamento e experiência que o destino realmente se revela.",
      "Porque no final, não se trata apenas de conhecer os Estados Unidos mas de viver o melhor que eles têm a oferecer, de forma inteligente e memorável."
    ]
  }
];

const getIcon = (name: string, className = "w-6 h-6") => {
  switch (name) {
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Hotel': return <Hotel className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Ticket': return <Ticket className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Plane': return <Plane className={className} />;
    case 'Languages': return <Languages className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    default: return <Compass className={className} />;
  }
};

const ENDINGS_LIST = [
  "o mundo.",
  "novos olhares.",
  "outras versões de si.",
  "caminhos por dentro.",
  "lugares que ficam.",
  "histórias pelo caminho.",
  "o extraordinário.",
  "novos sentidos.",
  "que o mundo é maior.",
  "memórias antes de viver.",
  "a beleza do agora.",
  "o que te move.",
  "novos começos.",
  "o mundo e voltar diferente.",
  "que há muito além daqui."
];

export default function HomeView({ setActivePage }: HomeViewProps) {
  const { rafesOpen, editField } = useRafesEditor();

  // Contact Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modalPreMessage, setModalPreMessage] = useState('');
  
  // Bento Grid state
  const [bentoDestinations, setBentoDestinations] = useState<DestinationBento[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arcadane_bento_destinations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return BENTO_DESTINATIONS;
  });

  const [editingUrlIdx, setEditingUrlIdx] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState('');

  const handleUpdateBentoImage = (index: number, newImageUrl: string) => {
    const updated = [...bentoDestinations];
    updated[index] = { ...updated[index], image: newImageUrl };
    setBentoDestinations(updated);
    localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
  };

  const handleBentoImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          handleUpdateBentoImage(index, event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeBentoItem, setActiveBentoItem] = useState<number | null>(null);

  const handleRequestContact = (initialMessage: string) => {
    setModalPreMessage(initialMessage);
    setIsContactModalOpen(true);
  };

  // Extract YouTube ID if present
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Video Background URL - State fully persistent via LocalStorage and HomeSettings CMS
  const [videoUrl, setVideoUrl] = useState(() => {
    const homeSettingsVal = getHomeSettings().heroVideoUrl;
    if (homeSettingsVal && !homeSettingsVal.includes('mixkit-safari')) return homeSettingsVal;

    const saved = localStorage.getItem('arcadane_video_url');
    // Automigrate old safari assets to the new requested premium YouTube experience
    if (!saved || saved.includes('mixkit-safari')) {
      return 'https://www.youtube.com/watch?v=1VhezN-EFfg';
    }
    return saved;
  });
  const [tempVideoUrl, setTempVideoUrl] = useState(videoUrl);
  const [showVideoConfig, setShowVideoConfig] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const youtubeId = getYouTubeId(videoUrl);

  // Active Tab state for search booking table
  const [activeTab, setActiveTab] = useState<'voos' | 'hoteis' | 'pacotes' | 'carros' | 'exclusivos' | 'seguros'>('voos');
  
  // Search state variables
  const [optionCount, setOptionCount] = useState('1'); // Dropdown values
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');

  // Check if we are on a non-production or development domain to default to manual elegant form
  const isDevDomain = typeof window !== 'undefined' && (
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('run.app') || 
    window.location.hostname.includes('aistudio') || 
    window.location.hostname.includes('127.0.0.1')
  );

  const [mode, setMode] = useState<'automatic' | 'manual'>(() => {
    const saved = localStorage.getItem('arcadane_search_mode');
    if (saved === 'automatic' || saved === 'manual') return saved;
    return isDevDomain ? 'manual' : 'automatic';
  });

  const handleModeChange = (newMode: 'automatic' | 'manual') => {
    setMode(newMode);
    localStorage.setItem('arcadane_search_mode', newMode);
  };

  // Trajectory Photo & Home Settings CMS States
  const [trajectoryPhoto, setTrajectoryPhoto] = useState<string | null>(() => {
    return getTrajectoryPhoto();
  });
  const [homeSettings, setHomeSettings] = useState(() => getHomeSettings());
  const [services, setServices] = useState<ServiceItem[]>(() => getServices());
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCmsChange = () => {
      setTrajectoryPhoto(getTrajectoryPhoto());
      const nextSettings = getHomeSettings();
      setHomeSettings(nextSettings);
      if (nextSettings.heroVideoUrl) {
        setVideoUrl(nextSettings.heroVideoUrl);
        setTempVideoUrl(nextSettings.heroVideoUrl);
      }
      setServices(getServices());
      setSeo(getSeoSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const handleUpdateTrajectoryPhoto = (newUrl: string) => {
    if (newUrl) {
      localStorage.setItem('arcadane_trajectory_photo', newUrl);
    } else {
      localStorage.removeItem('arcadane_trajectory_photo');
    }
    setTrajectoryPhoto(newUrl || null);
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  };

  useEffect(() => {
    if (!youtubeId && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoUrl, youtubeId]);

  const handleVideoSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('arcadane_video_url', tempVideoUrl);
    setVideoUrl(tempVideoUrl);
    
    // Also save to homeSettings to synchronize with Admin View / Visual Builder
    const nextHomeSettings = { ...homeSettings, heroVideoUrl: tempVideoUrl };
    saveHomeSettings(nextHomeSettings);

    setShowVideoConfig(false);
    setIsPlaying(true);
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  };

  const togglePlay = () => {
    if (!youtubeId && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetVideo = () => {
    const defaultUrl = 'https://www.youtube.com/watch?v=1VhezN-EFfg';
    localStorage.setItem('arcadane_video_url', defaultUrl);
    setVideoUrl(defaultUrl);
    setTempVideoUrl(defaultUrl);

    // Also save to homeSettings to synchronize with Admin View / Visual Builder
    const nextHomeSettings = { ...homeSettings, heroVideoUrl: defaultUrl };
    saveHomeSettings(nextHomeSettings);

    setShowVideoConfig(false);
    setIsPlaying(true);
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: "Consórcio de Viagens",
      description: "Planeje e garanta sua próxima grande jornada com economia, flexibilidade e total segurança patrimonial.",
      iconName: "Compass"
    };
    const updated = [...services, newService];
    setServices(updated);
    saveServices(updated);
  };

  const handleDeleteService = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("⚠️ Tem certeza que deseja remover este serviço da página inicial?")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      saveServices(updated);
    }
  };

  const handleBookingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build descriptive message based on selected options
    let tabLabel = 'Seguro Viagem';
    let countLabel = 'segurado(s)';

    if (activeTab === 'voos') { tabLabel = 'Cotação de Voo'; countLabel = 'passageiro(s)'; }
    else if (activeTab === 'hoteis') { tabLabel = 'Hospedagem'; countLabel = 'hóspede(s)'; }
    else if (activeTab === 'pacotes') { tabLabel = 'Pacote Cooperativo Voo + Hotel'; countLabel = 'viajante(s)'; }
    else if (activeTab === 'carros') { tabLabel = 'Aluguel de Veículos'; countLabel = 'veículo(s)'; }
    else if (activeTab === 'exclusivos') { tabLabel = 'Experiência Exclusiva Curada'; countLabel = 'estilo'; }

    const optionValue = activeTab === 'carros' ? `${optionCount}` : `${optionCount} ${countLabel}`;

    const textPayload = `Olá Arcadane! Vim pelo link do site e gostaria de cotar o serviço de *${tabLabel}* para minha próxima viagem:\n\n` +
      (origem ? `🛫 *Origem:* ${origem}\n` : '') +
      `📍 *Destino:* ${destino || 'A combinar com consultor'}\n` +
      `📅 *Data de Ida:* ${dataIda ? new Date(dataIda).toLocaleDateString('pt-BR') : 'A definir'}\n` +
      `📅 *Data de Volta:* ${dataVolta ? new Date(dataVolta).toLocaleDateString('pt-BR') : 'A definir'}\n` +
      `👤 *Especificação:* ${optionValue}\n\n` +
      `Por favor, me enviem orçamentos de experiência exclusivos!`;

    const encoded = encodeURIComponent(textPayload);
    const mateusPhone = seo.contactWhatsAppMateus || '554791492704';
    window.open(`https://wa.me/${mateusPhone}?text=${encoded}`, '_blank');
  };

  // Configure Dynamic Options based on the Active tab
  const getDropdownLabel = () => {
    switch (activeTab) {
      case 'voos': return 'Número de passageiros';
      case 'hoteis': return 'Número de hóspedes';
      case 'pacotes': return 'Número de viajantes';
      case 'carros': return 'Categoria do veículo';
      case 'exclusivos': return 'Estilo de experiência';
      case 'seguros': return 'Número de segurados';
      default: return 'Número de pessoas';
    }
  };

  const getDropdownOptions = () => {
    switch (activeTab) {
      case 'carros':
        return [
          { value: 'Econômico', label: 'Econômico' },
          { value: 'Intermediário', label: 'Intermediário (SUV)' },
          { value: 'Luxo Premium', label: 'Luxo Premium' },
          { value: 'Minivan / Familiar', label: 'Minivan' }
        ];
      case 'exclusivos':
        return [
          { value: 'Viagem de Luxo / Sob Medida', label: 'Viagem de Luxo Sob Medida' },
          { value: 'Expedição Cultural / Gastronômica', label: 'Cultural & Gastronômica' },
          { value: 'Ecoturismo / Aventura', label: 'Ecoturismo e Aventura' },
          { value: 'Lua de Mel Romântica', label: 'Romântico / Lua de Mel' }
        ];
      default:
        return [
          { value: '1', label: '1 pessoa' },
          { value: '2', label: '2 pessoas' },
          { value: '3', label: '3 pessoas' },
          { value: '4', label: '4 pessoas' },
          { value: '5+', label: '5 ou mais pessoas' }
        ];
    }
  };

  const getDestinationPlaceholder = () => {
    switch (activeTab) {
      case 'carros': return 'Local de retirada';
      case 'hoteis': return 'Cidade de destino ou hotel';
      default: return 'Digite o destino desejado';
    }
  };

  // Preset travel videos that can be quickly loaded
  const PRESET_VIDEOS = [
    { label: 'Vídeo Oficial (YouTube)', url: 'https://www.youtube.com/watch?v=1VhezN-EFfg' },
    { label: 'Safari Africano', url: 'https://assets.mixkit.co/videos/preview/mixkit-safari-under-sunset-sky-43152-large.mp4' },
    { label: 'Costa Amalfitana', url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-green-forest-and-mountains-41585-large.mp4' },
    { label: 'Praia Tropical', url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-golden-sandy-beach-and-the-ocean-43237-large.mp4' }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden" id="home-view">
      
      {/* 1. Immersive Video Hero Showcase Banner Section */}
      <section 
        className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-between overflow-hidden text-white" 
        id="home-hero"
      >
        {/* Full Video Background Layer with Ambient Overlays */}
        <div className="absolute inset-0 -z-10 bg-black overflow-hidden">
          {youtubeId ? (
            isPlaying ? (
              <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1`}
                  title="Scenic Background Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute pointer-events-none select-none max-w-none"
                  style={{
                    width: '100vw',
                    height: '56.25vw', // 16:9 aspect ratio
                    minHeight: '100vh',
                    minWidth: '177.77vh', // 16:9 aspect ratio
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.15)', // Scale removes unwanted black bars and controls
                    opacity: 0.60,
                  }}
                />
              </div>
            ) : (
              // YouTube high-resolution custom blurred cover backplate
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 transition-opacity duration-500"
                style={{ backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg)` }}
              />
            )
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-55 transition-opacity duration-500"
            />
          )}
          {/* Gradients to blend with header and search card */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-black/35 to-stone-950/90" />
        </div>

        {/* Hero Central Text Callout */}
        <div className="flex-grow flex items-center justify-center pt-24 sm:pt-32 pb-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
            
            {/* Tag badge with link to Instagram */}
            <a 
              href="https://www.instagram.com/arcadaneviagens/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 bg-black/45 backdrop-blur-md border border-white/10 text-white/95 rounded-full text-[10px] font-mono tracking-widest uppercase hover:bg-brand-primary/25 hover:border-[#AF4934]/40 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span>@ARCADANEVIAGENS</span>
            </a>

            {/* Immersive Title with Elegant Hand-picked Fonts and Typewriter Animation */}
            <TypewriterTitle rafesOpen={rafesOpen} editField={editField} />

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 flex items-center justify-center transition-all active:scale-95 text-white/90"
                title={isPlaying ? "Pausar Vídeo" : "Reproduzir Vídeo"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Floating Custom Booking Engine & Search Bar (Aligned Bottom of Hero) */}
        <div className="w-full max-w-6xl mx-auto px-4 pb-8 relative z-10 -mt-32 sm:-mt-44 lg:-mt-60 xl:-mt-72" id="booking-area">
          
          {/* Real Live Befly Widget Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-border p-4.5 sm:p-5 lg:p-7 text-brand-dark max-w-6xl mx-auto text-left relative">
            
            {/* Perfect Responsive Wrapper: Horizontal Scroll only on Mobile, Native Widths on PC */}
            <div className="w-full overflow-x-auto overflow-y-hidden pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[850px] lg:min-w-0 pr-4 sm:pr-0">
                <BeflySearchWidget />
              </div>
            </div>

            {/* Mini helper hint on small devices */}
            <div className="block lg:hidden text-center mt-3 border-t border-gray-100 pt-3 select-none">
              <span className="inline-flex items-center gap-1.5 bg-stone-50 text-stone-500 px-3 py-1 font-mono text-[9px] rounded-full uppercase tracking-wider leading-none">
                ↔ Deslize para as laterais se precisar preencher todos os campos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Service List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="home-services">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-3 flex-1">
            <h2 className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Serviços Completos</h2>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight">Conheça nossos serviços</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-lg">
              Oferecemos uma prateleira completa de soluções para que sua única preocupação seja desfrutar da experiência.
            </p>
          </div>
          {rafesOpen && (
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Serviço</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="services-grid">
          {services.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-6.5 rounded-2xl border border-brand-border hover:border-brand-primary/20 shadow-xs hover:shadow-lg transition-all duration-300 group text-left flex flex-col justify-between relative ${
                rafesOpen ? 'hover:scale-[1.01]' : ''
              }`}
              id={`service-card-${item.id}`}
            >
              {rafesOpen && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteService(item.id, e)}
                  className="absolute top-4 right-4 z-10 w-7 h-7 bg-red-650 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border border-red-500/20"
                  title="Excluir este serviço"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div>
                <div 
                  className={`w-12 h-12 rounded-xl bg-brand-primary/5 group-hover:bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors mb-5 select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={() => {
                    if (rafesOpen) {
                      const ans = window.prompt("Digite o nome do ícone (Opções: Briefcase, Car, Hotel, ShieldCheck, Ticket, Sparkles, Heart, Navigation, Compass, Plane, Languages, Sliders):", item.iconName);
                      if (ans !== null && ans.trim() !== '') {
                        const updated = services.map(s => s.id === item.id ? { ...s, iconName: ans.trim() } : s);
                        setServices(updated);
                        saveServices(updated);
                      }
                    }
                  }}
                  title={rafesOpen ? "Clique para trocar o ícone" : undefined}
                >
                  {getIcon(item.iconName)}
                </div>

                <h4 
                  className={`font-display font-bold text-lg text-brand-dark group-hover:text-brand-primary transition-colors mb-2.5 select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1.5 rounded-lg cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={() => {
                    if (rafesOpen) {
                      editField(`srv-title-${item.id}`, 'Editar Título do Serviço', item.title, false, (newVal) => {
                        const updated = services.map(s => s.id === item.id ? { ...s, title: newVal } : s);
                        setServices(updated);
                        saveServices(updated);
                      });
                    }
                  }}
                >
                  {item.title}
                </h4>

                <p 
                  className={`text-xs sm:text-sm text-gray-500 leading-relaxed font-sans select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1.5 rounded-lg cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={() => {
                    if (rafesOpen) {
                      editField(`srv-desc-${item.id}`, 'Editar Descrição do Serviço', item.description, true, (newVal) => {
                        const updated = services.map(s => s.id === item.id ? { ...s, description: newVal } : s);
                        setServices(updated);
                        saveServices(updated);
                      });
                    }
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div 
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary mt-5 cursor-pointer hover:text-brand-secondary transition-colors"
                onClick={() => handleRequestContact(`Olá Arcadane! Vim pelo link do site e gostaria de solicitar um orçamento para o serviço de *${item.title}*.`)}
              >
                <span>Solicitar orçamento</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 Bento Grid Destinations Section (Matching layout in attached image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12" id="home-destinations-bento">
        <div className="text-center space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Portfólio Exclusivo</h2>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight">Experiências mais desejadas</h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Descubra destinos selecionados a dedo e viva momentos inesquecíveis desenhados sob medida para você.
          </p>
        </div>

        {/* Bento Grid layout matching the requested bento structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[240px]">
          
          {/* Card 1 - Destinos Exóticos (Tall: spans Row 1 & 2, Column 1) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveBentoItem(0)}
            className="md:row-span-2 md:col-span-1 h-[450px] md:h-auto relative rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 border border-brand-border/10"
          >
            <BentoImageUploader index={0} onImageChange={handleUpdateBentoImage} onUrlEditRequest={(idx) => { setTempUrl(bentoDestinations[idx].image.startsWith('data:') ? '' : bentoDestinations[idx].image); setEditingUrlIdx(idx); }} />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-500 z-10" />
            <img 
              referrerPolicy="no-referrer"
              src={bentoDestinations[0].image} 
              alt={bentoDestinations[0].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20 text-left">
              <div className="flex items-center justify-between">
                <h4 
                  className={`font-display font-bold text-2xl sm:text-3xl text-white tracking-wide select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/25 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={(e) => {
                    if (rafesOpen) {
                      e.stopPropagation();
                      editField('bento-title-0', 'Editar Nome do Destino 1', bentoDestinations[0].title, false, (newVal) => {
                        const updated = [...bentoDestinations];
                        updated[0] = { ...updated[0], title: newVal };
                        setBentoDestinations(updated);
                        localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                        window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                      });
                    }
                  }}
                >
                  {bentoDestinations[0].title}
                </h4>
                <span className="w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Nacionais (Top Row, Column 2) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveBentoItem(1)}
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 border border-brand-border/10 animate-fade-in"
          >
            <BentoImageUploader index={1} onImageChange={handleUpdateBentoImage} onUrlEditRequest={(idx) => { setTempUrl(bentoDestinations[idx].image.startsWith('data:') ? '' : bentoDestinations[idx].image); setEditingUrlIdx(idx); }} />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-500 z-10" />
            <img 
              referrerPolicy="no-referrer"
              src={bentoDestinations[1].image} 
              alt={bentoDestinations[1].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 text-left">
              <div className="flex items-center justify-between">
                <h4 
                  className={`font-display font-bold text-xl sm:text-2xl text-white tracking-wide select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/25 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={(e) => {
                    if (rafesOpen) {
                      e.stopPropagation();
                      editField('bento-title-1', 'Editar Nome do Destino 2', bentoDestinations[1].title, false, (newVal) => {
                        const updated = [...bentoDestinations];
                        updated[1] = { ...updated[1], title: newVal };
                        setBentoDestinations(updated);
                        localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                        window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                      });
                    }
                  }}
                >
                  {bentoDestinations[1].title}
                </h4>
                <span className="w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Cruzeiros (Top Row, Column 3) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveBentoItem(2)}
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 border border-brand-border/10"
          >
            <BentoImageUploader index={2} onImageChange={handleUpdateBentoImage} onUrlEditRequest={(idx) => { setTempUrl(bentoDestinations[idx].image.startsWith('data:') ? '' : bentoDestinations[idx].image); setEditingUrlIdx(idx); }} />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-500 z-10" />
            <img 
              referrerPolicy="no-referrer"
              src={bentoDestinations[2].image} 
              alt={bentoDestinations[2].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 text-left">
              <div className="flex items-center justify-between">
                <h4 
                  className={`font-display font-bold text-xl sm:text-2xl text-white tracking-wide select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/25 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={(e) => {
                    if (rafesOpen) {
                      e.stopPropagation();
                      editField('bento-title-2', 'Editar Nome do Destino 3', bentoDestinations[2].title, false, (newVal) => {
                        const updated = [...bentoDestinations];
                        updated[2] = { ...updated[2], title: newVal };
                        setBentoDestinations(updated);
                        localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                        window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                      });
                    }
                  }}
                >
                  {bentoDestinations[2].title}
                </h4>
                <span className="w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4 - Estados Unidos (Bottom Row, spans Column 2 & 3) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveBentoItem(3)}
            className="md:col-span-2 relative rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 border border-brand-border/10"
          >
            <BentoImageUploader index={3} onImageChange={handleUpdateBentoImage} onUrlEditRequest={(idx) => { setTempUrl(bentoDestinations[idx].image.startsWith('data:') ? '' : bentoDestinations[idx].image); setEditingUrlIdx(idx); }} />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-500 z-10" />
            <img 
              referrerPolicy="no-referrer"
              src={bentoDestinations[3].image} 
              alt={bentoDestinations[3].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20 text-left">
              <div className="flex items-center justify-between">
                <h4 
                  className={`font-display font-bold text-xl sm:text-2xl text-white tracking-wide select-none ${
                    rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/25 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                  }`}
                  onClick={(e) => {
                    if (rafesOpen) {
                      e.stopPropagation();
                      editField('bento-title-3', 'Editar Nome do Destino 4', bentoDestinations[3].title, false, (newVal) => {
                        const updated = [...bentoDestinations];
                        updated[3] = { ...updated[3], title: newVal };
                        setBentoDestinations(updated);
                        localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                        window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                      });
                    }
                  }}
                >
                  {bentoDestinations[3].title}
                </h4>
                <span className="w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.7. Curated Luxury Itineraries Ready to Book (China & Iceland) */}
      <LuxuryItineraries />

      {/* 2.7.5. Dynamic Promotional Packages for Easy Booking */}
      <PromotionalPackages />

      {/* 2.8. Viagem Personalizada Promovida Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="home-custom-travel-promo">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-border/30 bg-brand-dark text-white flex flex-col lg:flex-row items-stretch min-h-[460px] text-left">
          {/* Background image half with gradient */}
          <div className="lg:w-1/2 h-64 lg:h-auto relative">
            <img
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
              alt="Montanhas Majestosas e Roteiro Curado"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 lg:inset-y-0 lg:right-0 lg:w-48 bg-gradient-to-t lg:bg-gradient-to-r from-brand-dark via-brand-dark/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-brand-dark/20" />
            
            {/* Elegant compass overlay decoration */}
            <div className="absolute top-8 left-8 bg-brand-primary/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-secondary animate-spin-slow" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-white font-bold">Consultoria de Alto Padrão</span>
            </div>
          </div>

          {/* Prompting block detail half */}
          <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-8 select-none relative bg-brand-dark">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-blue font-extrabold flex items-center gap-1.5 leading-none">
                <Sparkles className="w-4 h-4 text-brand-blue" /> Roteiro Customizado
              </span>
              <h3 
                className={`font-display font-black text-3xl sm:text-4.5xl text-white tracking-tight leading-tight select-none ${
                  rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                }`}
                onClick={() => {
                  if (rafesOpen) {
                    editField('customTripTitle', 'Editar Título da Seção Sob Medida', homeSettings.customTripTitle || 'Viagens personalizadas:', false, (newVal) => {
                      const next = { ...homeSettings, customTripTitle: newVal };
                      setHomeSettings(next);
                      saveHomeSettings(next);
                    });
                  }
                }}
              >
                {homeSettings.customTripTitle || 'Viagens personalizadas:'}
              </h3>
              <p 
                className={`text-lg sm:text-xl text-stone-200 leading-relaxed font-sans font-light select-none ${
                  rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-1 rounded-md cursor-pointer hover:bg-amber-500/15' : ''
                }`}
                onClick={() => {
                  if (rafesOpen) {
                    editField('customTripSubtitle', 'Editar Subtítulo da Seção Sob Medida', homeSettings.customTripSubtitle || 'Experiências exclusivas, desenhadas para você.', false, (newVal) => {
                      const next = { ...homeSettings, customTripSubtitle: newVal };
                      setHomeSettings(next);
                      saveHomeSettings(next);
                    });
                  }
                }}
              >
                {homeSettings.customTripSubtitle || 'Experiências exclusivas, desenhadas para você.'}
              </p>
            </div>

            <div className="pt-4 relative z-10">
              {rafesOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    editField('customTripButtonText', 'Editar Texto do Botão Sob Medida', homeSettings.customTripButtonText || 'Clique e fale com a Arcadane!', false, (newVal) => {
                      const next = { ...homeSettings, customTripButtonText: newVal };
                      setHomeSettings(next);
                      saveHomeSettings(next);
                    });
                  }}
                  className="w-full sm:w-auto bg-amber-500 text-stone-900 border border-dashed border-stone-900 font-bold font-display uppercase tracking-widest text-xs px-10 py-5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{homeSettings.customTripButtonText || 'Clique e fale com a Arcadane!'} (Editar Botão)</span>
                  <Edit2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleRequestContact("Olá Arcadane! Vi sobre as viagens personalizadas e sob medida no site de vocês. Gostaria de iniciar um atendimento para desenhar o meu roteiro exclusivo.")}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold font-display uppercase tracking-widest text-xs px-10 py-5 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{homeSettings.customTripButtonText || 'Clique e fale com a Arcadane!'}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Highlight Strategic Purposes */}
      <section className="bg-brand-dark text-white py-24 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8" id="home-purpose">
        {/* Ambient luxury blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Poetic & Structured Typography */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/20 text-brand-secondary border border-brand-primary/30 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              Nossa Essência
            </div>
            
            <h3 
              className={`font-display font-black text-3.5xl sm:text-5xl tracking-tight text-white leading-tight ${
                rafesOpen ? "border border-dashed border-amber-500 bg-amber-500/10 p-2.5 rounded-2xl cursor-pointer hover:bg-amber-500/20 transition-all text-amber-200" : ""
              }`}
              onClick={() => {
                if (rafesOpen) {
                  editField('aboutUsHeadline', 'Editar Título Sobre Nós', homeSettings.aboutUsHeadline, false, (newVal) => {
                    const next = { ...homeSettings, aboutUsHeadline: newVal };
                    setHomeSettings(next);
                    saveHomeSettings(next);
                  });
                }
              }}
              title={rafesOpen ? "Clique para editar o título Sobre Nós estilo Rafes!" : undefined}
            >
              {homeSettings.aboutUsHeadline.includes(",") ? (
                <>
                  {homeSettings.aboutUsHeadline.split(",")[0]}, <br className="hidden sm:inline" />
                  <span className="font-serif font-normal italic text-[#AF4934]">
                    {homeSettings.aboutUsHeadline.split(",")[1]}
                  </span>
                </>
              ) : (
                homeSettings.aboutUsHeadline
              )}
            </h3>

            {/* Subheadline! Display the aboutUsSubheadline and make it clickable and editable in Rafes edit mode */}
            <p 
              className={`text-base sm:text-lg text-gray-400 font-sans tracking-wide font-normal select-none ${
                rafesOpen ? 'border border-dashed border-amber-500 bg-amber-500/10 p-2 rounded-xl cursor-pointer hover:bg-amber-500/15 text-amber-100' : ''
              }`}
              onClick={() => {
                if (rafesOpen) {
                  editField('aboutUsSubheadline', 'Editar Subtítulo Sobre Nós', homeSettings.aboutUsSubheadline || 'Sua jornada desenhada por especialistas', false, (newVal) => {
                    const next = { ...homeSettings, aboutUsSubheadline: newVal };
                    setHomeSettings(next);
                    saveHomeSettings(next);
                  });
                }
              }}
              title={rafesOpen ? "Clique para editar o subtítulo Sobre Nós" : undefined}
            >
              {homeSettings.aboutUsSubheadline || 'Sua jornada desenhada por especialistas'}
            </p>
            
            <div 
              className={`space-y-5 text-justify font-sans text-sm text-gray-300 leading-relaxed font-light ${
                rafesOpen ? "border border-dashed border-amber-500 bg-amber-500/10 p-3.5 rounded-2xl cursor-pointer hover:bg-amber-500/20 transition-all" : ""
              }`}
              onClick={() => {
                if (rafesOpen) {
                  editField('aboutUsText', 'Editar Texto da História ODS', homeSettings.aboutUsText, true, (newVal) => {
                    const next = { ...homeSettings, aboutUsText: newVal };
                    setHomeSettings(next);
                    saveHomeSettings(next);
                  });
                }
              }}
              title={rafesOpen ? "Clique para editar a história da Arcadane estilo Rafes!" : undefined}
            >
              {homeSettings.aboutUsText.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="pt-4">
              <button 
                onClick={() => setActivePage(PageId.AboutUs)} 
                className="group bg-brand-primary hover:bg-[#AF4934] text-white px-8 py-4 rounded-xl font-bold font-display uppercase tracking-wider text-xs transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2.5 shadow-md shadow-brand-primary/15"
              >
                Conheça Nossa História
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Right Column: Dynamic Corporate / Founders Trajectory Photo with Floating Gold Emblem */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0 flex items-center justify-center">
            
            {/* Floating Gold Medallion Emblem - Redesigned as a modern, high-end luxury badge */}
            <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 md:-top-10 md:-right-10 z-20 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 bg-transparent drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none animate-fade-in">
              <svg viewBox="0 0 200 200" className="w-full h-full filter backdrop-blur-[0.5px]">
                <defs>
                  <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9A7B3E" />
                    <stop offset="20%" stopColor="#E6C87C" />
                    <stop offset="40%" stopColor="#FFFAD0" />
                    <stop offset="60%" stopColor="#E6C87C" />
                    <stop offset="80%" stopColor="#B38E46" />
                    <stop offset="100%" stopColor="#785B24" />
                  </linearGradient>
                  <linearGradient id="gold-light" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFDE9" />
                    <stop offset="50%" stopColor="#D9BF7D" />
                    <stop offset="100%" stopColor="#8A6B29" />
                  </linearGradient>
                  <path id="circle-text-path-top" d="M 32,100 A 68,68 0 0,1 168,100" fill="none" />
                  <path id="circle-text-path-bottom" d="M 168,100 A 68,68 0 0,1 32,100" fill="none" />
                </defs>
                
                {/* Outer premium concentric metallic gold rings */}
                <circle cx="100" cy="100" r="92" fill="#090807" stroke="url(#gold-grad)" strokeWidth="3.5" />
                <circle cx="100" cy="100" r="86" fill="transparent" stroke="url(#gold-light)" strokeWidth="1.25" strokeDasharray="5 3" />
                <circle cx="100" cy="100" r="81" fill="transparent" stroke="url(#gold-grad)" strokeWidth="1.5" />
                
                {/* Modern Curved Texts - Styled for extreme premium feel using clean tracking-stretched sans-serif */}
                <text className="font-sans text-[7.5px] tracking-[0.24em] font-extrabold uppercase" fill="url(#gold-light)">
                  <textPath href="#circle-text-path-top" startOffset="50%" textAnchor="middle">
                    ARCADANE CURADORIA EXCLUSIVA
                  </textPath>
                </text>
                
                <text className="font-sans text-[6.5px] tracking-[0.22em] font-semibold uppercase" fill="url(#gold-light)">
                  <textPath href="#circle-text-path-bottom" startOffset="50%" textAnchor="middle">
                    VIAGENS EXTRAORDINÁRIAS
                  </textPath>
                </text>
                
                {/* Inner Obsidian Face and Border */}
                <circle cx="100" cy="100" r="61" fill="transparent" stroke="url(#gold-grad)" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="57" fill="#110f0e" stroke="url(#gold-light)" strokeWidth="1" />
                
                {/* 5-Star Luxury Curved Rating at the top */}
                <text x="100" y="65" textAnchor="middle" fill="url(#gold-light)" className="font-sans text-[7.5px] tracking-[0.3em] opacity-95">
                  ★★★★★
                </text>
                
                {/* Clean, unmistakable modern numbers centerpiece representing 10+ Years of Experience */}
                <g fill="url(#gold-grad)" className="select-none font-sans font-black" style={{ fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                  <text x="93" y="112" textAnchor="middle" className="text-[46px] tracking-tighter">10</text>
                  <text x="122" y="90" className="text-[20px] font-bold" fill="url(#gold-light)">+</text>
                </g>
                
                {/* Core description labels beneath the numbers */}
                <text x="100" y="127" textAnchor="middle" fill="url(#gold-light)" className="font-sans text-[8.5px] font-extrabold tracking-[0.25em] uppercase">
                  ANOS DE
                </text>
                <text x="100" y="139" textAnchor="middle" fill="url(#gold-grad)" className="font-sans text-[9px] font-black tracking-[0.3em] uppercase">
                  EXPERIÊNCIA
                </text>
              </svg>
            </div>
            
            {/* Elegant visual frame for the photo with organic corners */}
            <div className="relative group w-full aspect-[4/3] md:aspect-[1.25/1] rounded-[2.5rem] overflow-hidden border-2 border-brand-primary/10 hover:border-brand-primary/30 shadow-2xl transition-all duration-500 ease-out">
              <img 
                src={trajectoryPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                alt="Nossa trajetória, nosso propósito - Diretoria Arcadane Viagens"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              {/* Soft warm luxurious vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
              
              {/* In-place trajectory photo editor bar */}
              {rafesOpen && (
                <div 
                  className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-brand-dark/85 hover:bg-brand-dark backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="file"
                    id="trajectory-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressedUrl = await compressImage(file, 1000, 1000, 0.75);
                          handleUpdateTrajectoryPhoto(compressedUrl);
                        } catch (error) {
                          console.error("Error compressing trajectory photo:", error);
                          alert("Falha ao processar a imagem. Tente outro arquivo.");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('trajectory-file-input')?.click()}
                    title="Enviar foto do computador"
                    className="flex items-center gap-1 text-[11px] font-display text-white hover:text-brand-secondary transition-colors cursor-pointer font-medium"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                  <span className="text-white/20 text-xs">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt("Insira o link (URL) da nova imagem:");
                      if (url && url.trim() !== "") {
                        handleUpdateTrajectoryPhoto(url.trim());
                      }
                    }}
                    title="Colar link de imagem da internet"
                    className="flex items-center gap-1 text-[11px] font-display text-white hover:text-brand-secondary transition-colors cursor-pointer font-medium"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Link</span>
                  </button>
                  {trajectoryPhoto && (
                    <>
                      <span className="text-white/20 text-xs">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Deseja realmente voltar para a imagem original?")) {
                            handleUpdateTrajectoryPhoto("");
                          }
                        }}
                        title="Restaurar imagem padrão"
                        className="flex items-center gap-1 text-[11px] font-display text-red-400 hover:text-red-300 transition-colors cursor-pointer font-medium"
                      >
                        <span>Resetar</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Corner geometric lines accents */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[#AF4934]/30 pointer-events-none rounded-tl-xl" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[#AF4934]/30 pointer-events-none rounded-br-xl" />
          </div>
          
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in" id="home-testimonials">
        <div className="text-center space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Depoimentos Reais</h2>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight">Quem vive, recomenda</h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Relatos de quem transformou destinos nas mais bonitas memórias.
          </p>
        </div>

        <TestimonialsCarousel />
      </section>

      {/* 4.25. Travel Quiz Promo Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="home-travel-quiz-banner">
        <div className="bg-gradient-to-br from-[#3A2F28] to-[#1E1815] border border-[#AF4934]/30 rounded-3xl relative overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-left">
          {/* Decorative luxury ambient glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AF4934]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-36 w-96 h-96 bg-[#3B5EA4]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#AF4934]/20 border border-[#AF4934]/30 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#AF4934] animate-pulse" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#AF4934] font-bold">
                EXPERIÊNCIA INTERATIVA EXCLUSIVA
              </span>
            </div>
            
            <h3 className="font-serif italic text-3.5xl sm:text-4.5xl lg:text-5.xl text-white tracking-tight leading-tight">
              Descubra seu estilo de viajante e seu destino ideal
            </h3>
            
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl font-light">
              Responda algumas perguntas rápidas de curadoria e descubra em tempo real qual é a atmosfera global exata que mais sincroniza com você, além de receber sugestões exclusivas prontas para planejar com nossos consultores.
            </p>
            
            {/* Quick value badges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#AF4934]/20 flex items-center justify-center text-[10px] text-[#AF4934] font-bold">
                  ✓
                </div>
                <span className="text-stone-200 text-xs font-medium font-sans">Resultado Imediato</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#AF4934]/20 flex items-center justify-center text-[10px] text-[#AF4934] font-bold">
                  ✓
                </div>
                <span className="text-stone-200 text-xs font-medium font-sans">Curadoria Premium</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Previews block / Call to Action */}
          <div className="w-full lg:w-auto shrink-0 relative z-10 flex flex-col items-stretch sm:items-center lg:items-end gap-5">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 text-left shadow-xl hidden sm:block">
              <span className="font-mono text-[9px] tracking-widest text-[#AF4934] uppercase font-bold">PRÉVIA DO TESTE</span>
              <h4 className="text-white font-serif italic text-sm font-semibold leading-snug">"Qual cenário faz seu coração bater mais forte ao planejar?"</h4>
              <div className="space-y-2">
                <div className="bg-white/10 border border-[#AF4934]/30 p-2.5 rounded-xl flex items-center gap-2.5">
                  <span className="text-base">🏔️</span>
                  <span className="text-xs text-[#AF4934] font-semibold">Montanhas frias & Vinhos Finos</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl flex items-center gap-2.5">
                  <span className="text-base">🏝️</span>
                  <span className="text-xs text-stone-300">Praias Paradisíacas Privadas</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActivePage(PageId.TravelQuiz);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="bg-[#3B5EA4] hover:bg-[#314f8c] text-white font-bold font-display uppercase tracking-widest text-xs sm:text-sm px-10 py-5 rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ease-out shadow-lg shadow-[#3B5EA4]/15 flex items-center justify-center gap-2.5 cursor-pointer w-full"
            >
              <span>Fazer o Quiz de Estilo</span>
              <ArrowUpRight className="w-4.5 h-4.5 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* 4.5. Latest Blog Posts Miniature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-14" id="home-blog-miniatures">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border/40 pb-6">
          <div className="space-y-3 text-left">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary font-bold block">
              DIÁRIOS DE CURADORIA • INFORMATIVO
            </span>
            <h3 className="font-serif italic text-3xl sm:text-5xl text-brand-dark tracking-tight">
              Últimas Dicas do Blog
            </h3>
            <p className="text-sm text-[#6e401e]/80 max-w-xl font-sans font-medium">
              Aprenda a viajar com inteligência militar e sofisticação cinco estrelas. Artigos refinados escritos por nossos especialistas.
            </p>
          </div>
          <button
            onClick={() => {
              setActivePage(PageId.Blog);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-[0.15em] hover:text-[#6e401e] transition-all duration-300 shrink-0 group py-2.5 px-5 rounded-full border border-brand-primary/30 hover:border-brand-primary bg-white/20 hover:bg-white/80 cursor-pointer shadow-xs"
          >
            Ver todas as matérias
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-brand-primary" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BLOG_POSTS.slice(0, 3).map((post, idx) => (
            <article
              key={post.id}
              onClick={() => {
                if (post.id === 'quiz') {
                  setActivePage(PageId.TravelQuiz);
                } else {
                  localStorage.setItem('arcadane_selected_post_id', post.id);
                  setActivePage(PageId.Blog);
                }
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="group flex flex-col justify-between overflow-hidden cursor-pointer bg-white rounded-3xl border border-brand-border/40 hover:border-brand-primary/25 hover:shadow-card transition-all duration-500 transform hover:-translate-y-1.5"
            >
              <div className="space-y-6">
                {post.image && (
                  <div className="h-56 overflow-hidden relative m-3.5 rounded-2xl shadow-xs">
                    <img
                      referrerPolicy="no-referrer"
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-stone-900/5 to-transparent" />
                    
                    {/* Floating Luxury Tag on image */}
                    <div className="absolute top-4 left-4">
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-brand-primary text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Floating Read Time tag on bottom right */}
                    <div className="absolute bottom-4 right-4 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-secondary" />
                      <span className="font-mono text-[9px] text-stone-200 font-medium">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="px-6 pb-6 space-y-4 text-left">
                  <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary/80" />
                    <span>Publicado em {post.date}</span>
                  </div>

                  <h4 className="font-serif font-semibold text-lg sm:text-xl text-brand-dark group-hover:text-brand-primary transition-colors duration-400 leading-snug line-clamp-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans font-normal opacity-90 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-brand-beige/10 border-t border-brand-border/30 flex items-center justify-between group-hover:bg-brand-beige/25 transition-all duration-400">
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                  REF • 00{idx + 1}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-brand-primary group-hover:text-[#6e401e] transition-colors duration-300 font-display uppercase tracking-wider">
                  Ler Matéria Completa
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bento Destination Info Modal Popup */}
      <AnimatePresence>
        {activeBentoItem !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBentoItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-brand-dark border border-brand-border/20 text-white rounded-3xl max-w-3xl w-full mx-auto overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row"
            >
              {/* Visual Image Banner */}
              <div className="w-full md:w-5/12 h-48 md:h-auto md:min-h-[420px] relative">
                <BentoImageUploader index={activeBentoItem} onImageChange={handleUpdateBentoImage} onUrlEditRequest={(idx) => { setTempUrl(bentoDestinations[idx].image.startsWith('data:') ? '' : bentoDestinations[idx].image); setEditingUrlIdx(idx); }} alwaysVisible={true} className="top-4 left-4 right-auto" />
                <img
                  referrerPolicy="no-referrer"
                  src={bentoDestinations[activeBentoItem].image}
                  alt={bentoDestinations[activeBentoItem].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-dark via-transparent to-transparent md:from-brand-dark md:via-brand-dark/10 md:to-transparent" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between relative bg-brand-dark">
                {/* Close button */}
                <button
                  onClick={() => setActiveBentoItem(null)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white bg-black/35 hover:bg-black/50 p-2 rounded-full transition-all focus:outline-hidden cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Scrollable text block */}
                <div className="space-y-4 text-left overflow-y-auto max-h-[320px] md:max-h-[380px] pr-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                  <span className="text-[10px] font-mono tracking-widest text-brand-secondary uppercase font-bold block mb-1">
                    CURADORIA ARCADANE
                  </span>
                  
                  <h3 
                    className={`font-display font-black text-xl sm:text-2xl text-white leading-tight mb-4 select-none ${
                      rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/20 p-2 rounded-xl cursor-pointer hover:bg-amber-500/10' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField('bento-large-title-' + activeBentoItem, 'Editar Título Detalhado do Destino', bentoDestinations[activeBentoItem].largeTitle, false, (newVal) => {
                          const updated = [...bentoDestinations];
                          updated[activeBentoItem] = { ...updated[activeBentoItem], largeTitle: newVal };
                          setBentoDestinations(updated);
                          localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                          window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                        });
                      }
                    }}
                  >
                    {bentoDestinations[activeBentoItem].largeTitle}
                  </h3>
                  
                  <div 
                    className={`space-y-4 select-none ${
                      rafesOpen ? 'border border-dashed border-amber-500 bg-amber-550/20 p-2 rounded-xl cursor-pointer hover:bg-amber-500/10' : ''
                    }`}
                    onClick={() => {
                      if (rafesOpen) {
                        editField('bento-desc-' + activeBentoItem, 'Editar Parágrafos de Descrição (Pule duas linhas para criar um novo parágrafo)', bentoDestinations[activeBentoItem].paragraphs.join('\n\n'), true, (newVal) => {
                          const updated = [...bentoDestinations];
                          updated[activeBentoItem] = { 
                            ...updated[activeBentoItem], 
                            paragraphs: newVal.split('\n\n').filter(p => p.trim()) 
                          };
                          setBentoDestinations(updated);
                          localStorage.setItem('arcadane_bento_destinations', JSON.stringify(updated));
                          window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                        });
                      }
                    }}
                  >
                    {bentoDestinations[activeBentoItem].paragraphs.map((para, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-light">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA Action button */}
                <div className="pt-6 border-t border-brand-border/10 mt-4 shrink-0">
                  <button
                    onClick={() => {
                      const targetItem = bentoDestinations[activeBentoItem];
                      setActiveBentoItem(null);
                      handleRequestContact(`Olá Arcadane! Vim pelo link do site e fiquei muito interessado no roteiro de *${targetItem.title}*. Gostaria de solicitar uma consultoria personalizada.`);
                    }}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold font-display uppercase tracking-wider text-[11px] sm:text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
                  >
                    <span>Solicitar Roteiro Personalizado</span>
                    <ArrowUpRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reusable Select-Contact Modal Dialog */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-brand-dark border border-brand-border/20 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 overflow-hidden shadow-2xl relative z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all focus:outline-hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover Head */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-mono font-bold block font-sans">
                  • ATENDIMENTO EXCLUSIVO
                </span>
                <h3 className="font-display font-bold text-2.5xl text-white">Fale com um Consultor</h3>
                <p className="text-xs text-gray-450 font-sans leading-relaxed">
                  Escolha com quem gostaria de falar para iniciar seu planejamento de viagem por WhatsApp:
                </p>
              </div>

              {/* Option Listing */}
              <div className="space-y-3">
                {/* Mateus */}
                <a
                  href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent(modalPreMessage || "Olá Mateus! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-white/10 transition-all duration-300 group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-lg border border-brand-primary/20 shrink-0 select-none">
                    M
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-bold text-white group-hover:text-brand-secondary transition-colors">Mateus</span>
                  </div>
                </a>

                {/* Maria & Mariana */}
                <a
                  href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent(modalPreMessage || "Olá Maria e Mariana! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-white/10 transition-all duration-300 group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-secondary/15 text-brand-secondary flex items-center justify-center font-bold text-lg border border-brand-secondary/20 shrink-0 select-none">
                    MM
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-bold text-white group-hover:text-brand-secondary transition-colors">Maria & Mariana</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal para Colar URL de Imagem da Internet */}
      <AnimatePresence>
        {editingUrlIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUrlIdx(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-dark/95 border border-brand-border/20 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setEditingUrlIdx(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all focus:outline-hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-mono font-bold block font-sans">
                  • GERENCIADOR DE IMAGENS
                </span>
                <h3 className="font-display font-bold text-2xl text-white">Alterar por URL</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Insira o link (URL) da internet para atualizar a imagem de <span className="text-brand-primary font-semibold">"{bentoDestinations[editingUrlIdx]?.title}"</span>:
                </p>
              </div>

              <div className="space-y-4 text-left">
                <input
                  type="text"
                  placeholder="https://exemplo.com/nordeste.jpg"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-brand-primary placeholder:text-gray-600 font-sans font-light"
                />

                {tempUrl && (
                  <div className="rounded-2xl overflow-hidden h-32 border border-brand-border/10 relative">
                    <img
                      src={tempUrl}
                      alt="Prévia da nova cobertura de destino"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute bottom-2.5 left-3 text-[9px] font-mono bg-black/60 px-2 py-0.5 rounded-full text-white">
                      Prévia da Capa
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setEditingUrlIdx(null)}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (tempUrl.trim()) {
                      handleUpdateBentoImage(editingUrlIdx, tempUrl.trim());
                    }
                    setEditingUrlIdx(null);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-colors cursor-pointer"
                >
                  Salvar Imagem
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FloatingBuscador />

    </div>
  );
}
