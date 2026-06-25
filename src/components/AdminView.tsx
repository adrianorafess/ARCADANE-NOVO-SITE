import React, { useState, useEffect, useMemo } from 'react';
import { 
  Key, LogOut, Settings, Globe, Film, Sparkles, Briefcase, Compass, Award, 
  Heart, AlertCircle, CheckCircle, Save, Undo, Plus, Trash2, Edit3, 
  Eye, EyeOff, FileText, Image, Phone, MapPin, Mail, Sliders, Server, Trash, HelpCircle, Tag, Download, Users, Code, Palette,
  BarChart2, TrendingUp, Monitor, Smartphone, Tablet as TabletIcon, Clock, Search, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, LineChart, PieChart, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie 
} from 'recharts';
import { getAnalyticsEvents } from '../utils/analyticsTracker';
import { 
  getServices, saveServices, getPackages, savePackages, 
  getBlogPosts, saveBlogPosts, getTestimonials, saveTestimonials, 
  getSeoSettings, saveSeoSettings, getHomeSettings, saveHomeSettings, 
  getPromoPackages, savePromoPackages, PromoPackage, DEFAULT_PROMO_PACKAGES,
  resetCmsToDefault, SeoSettings, HomeSettings, getFoundersPhoto, forceSyncCmsState, autoSyncToServer,
  ThemeSettings, getThemeSettings, saveThemeSettings,
  getCustomPages, saveCustomPages, getDomainSettings, saveDomainSettings, CustomPage, DomainSettings
} from '../utils/cmsStore';
import { ServiceItem, PackageItem, BlogPost, TestimonialItem } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { DEFAULT_HEAD_CODE, DEFAULT_BODY_START_CODE, DEFAULT_BODY_END_CODE } from '../utils/codeInjector';

interface SearchIndexItem {
  term: string;
  keywords: string[];
  description: string;
  tab: 'seo' | 'home' | 'layout' | 'services' | 'packages' | 'promos' | 'blog' | 'testimonials' | 'code' | 'theme' | 'sync' | 'reset' | 'custom-pages' | 'domains' | 'analytics';
  targetElementId?: string;
}

const SEARCH_INDEX: SearchIndexItem[] = [
  // SEO tab
  {
    term: "Título do Site (SEO)",
    keywords: ["titulo", "siteTitle", "seo", "google", "nome da aba", "aba", "meta", "arcadane viagens", "titulo principal"],
    description: "Configura o título principal do site que aparece no Google e na aba do navegador.",
    tab: "seo",
    targetElementId: "seo-site-title"
  },
  {
    term: "Descrição do Site (Meta Description)",
    keywords: ["meta description", "descriçao", "google", "seo", "sobre", "resumo do site"],
    description: "Configura o resumo descritivo do site lido pelos motores de busca do Google.",
    tab: "seo",
    targetElementId: "seo-meta-description"
  },
  {
    term: "Palavras-chave (Keywords)",
    keywords: ["palavras-chave", "keywords", "tags", "busca", "pesquisa", "seo", "tags do google"],
    description: "Tags de palavras-chave separadas por vírgula para otimização de busca do site.",
    tab: "seo",
    targetElementId: "seo-keywords"
  },
  {
    term: "WhatsApp Mateus",
    keywords: ["whatsapp", "mateus", "telefone", "contato", "ddd", "numero", "atendimento"],
    description: "Número oficial de atendimento do consultor Mateus.",
    tab: "seo",
    targetElementId: "contact-mateus"
  },
  {
    term: "WhatsApp Maria",
    keywords: ["whatsapp", "maria", "telefone", "contato", "ddd", "numero", "atendimento"],
    description: "Número oficial de atendimento da consultora Maria.",
    tab: "seo",
    targetElementId: "contact-maria"
  },
  {
    term: "WhatsApp Mariana",
    keywords: ["whatsapp", "mariana", "telefone", "contato", "ddd", "numero", "atendimento"],
    description: "Número oficial de atendimento da consultora Mariana.",
    tab: "seo",
    targetElementId: "contact-mariana"
  },
  {
    term: "Popup de Saída (Exit Intent)",
    keywords: ["popup", "exit intent", "popup de saida", "sair", "beneficios", "alerta", "promocao"],
    description: "Configura e ativa o popup que aparece quando o usuário tenta fechar o site.",
    tab: "seo",
    targetElementId: "seo-exit-intent"
  },
  {
    term: "Popup de Anúncio Geral",
    keywords: ["popup", "anuncio", "promocao", "tempo", "atraso", "oferta", "geral", "avisos"],
    description: "Configura o popup de anúncio automático que abre após alguns segundos.",
    tab: "seo",
    targetElementId: "seo-announcement-popup"
  },
  
  // Home Tab
  {
    term: "Vídeo de Destaque (Background)",
    keywords: ["video", "youtube", "fundo", "hero", "topo", "inicio", "principal", "banner"],
    description: "Configura o link do vídeo do YouTube que roda em plano de fundo no banner do topo.",
    tab: "home",
    targetElementId: "home-hero-video"
  },
  {
    term: "Título de Entrada (Hero Title)",
    keywords: ["titulo", "hero", "topo", "inicio", "frase inicial", "arte de viajar", "frase principal"],
    description: "Configura o texto em destaque com tipografia serifada no topo do site.",
    tab: "home",
    targetElementId: "home-hero-title"
  },
  {
    term: "Subtítulo do Banner (Hero Subtitle)",
    keywords: ["subtitulo", "hero", "topo", "inicio", "curadoria", "texto de apoio"],
    description: "Texto explicativo curto localizado logo abaixo do título principal do banner.",
    tab: "home",
    targetElementId: "home-hero-subtitle"
  },
  {
    term: "História Headline (Quem Somos)",
    keywords: ["quem somos", "historia", "headline", "nossa trajetoria", "propósito", "sobre nos"],
    description: "Título da seção Quem Somos onde a história da agência é contada.",
    tab: "home",
    targetElementId: "home-about-headline"
  },
  {
    term: "Texto de História (Quem Somos)",
    keywords: ["texto quem somos", "historia", "trajetoria", "sobre nos", "biografia", "paragrafos"],
    description: "Edite o texto completo sobre a história, os propósitos e os fundadores da Arcadane.",
    tab: "home",
    targetElementId: "home-about-text"
  },
  {
    term: "Foto dos Sócios / Equipe",
    keywords: ["foto", "socios", "equipe", "fundadores", "maria", "mateus", "mariana", "imagem de capa"],
    description: "Mude a imagem oficial dos sócios e fundadores da agência.",
    tab: "home",
    targetElementId: "home-founders-photo"
  },
  {
    term: "Email do Rodapé (Footer Email)",
    keywords: ["email", "rodape", "financeiro", "contato email", "footer"],
    description: "E-mail comercial exibido na coluna de contatos do rodapé do site.",
    tab: "home",
    targetElementId: "home-footer-email"
  },
  {
    term: "Endereço no Rodapé (Footer Address)",
    keywords: ["endereço", "rodape", "bc", "balneario", "atendimento", "localizacao", "mapa"],
    description: "Configura o endereço físico ou de atendimento que aparece no rodapé.",
    tab: "home",
    targetElementId: "home-footer-address"
  },
  {
    term: "Widget de Atendimento",
    keywords: ["widget", "befly", "whatsapp", "posicao", "atendimento", "pesquisa de voo", "ferramenta"],
    description: "Escolha entre o widget de pesquisa BeFly ou um botão flutuante direto de WhatsApp.",
    tab: "home",
    targetElementId: "home-widget-config"
  },
  
  // Theme & Layout Tabs
  {
    term: "Logotipo Customizado (Logo)",
    keywords: ["logo", "logotipo", "marca", "cabecalho", "imagem logo", "upload logo"],
    description: "Substitua a marca de texto padrão por uma imagem de logotipo customizada.",
    tab: "layout",
    targetElementId: "layout-custom-logo"
  },
  {
    term: "Nomes dos Menus (Labels)",
    keywords: ["menus", "nomes", "botoes", "labels", "quem somos", "servicos", "pacotes", "traducao"],
    description: "Altere os textos de exibição dos links de navegação do menu e rodapé.",
    tab: "layout",
    targetElementId: "layout-menu-labels"
  },
  {
    term: "Esconder / Mostrar Páginas no Menu",
    keywords: ["esconder", "mostrar", "ocultar", "desativar", "menu de navegacao", "links", "visibilidade"],
    description: "Oculte ou mostre abas inteiras da barra de navegação principal do site.",
    tab: "custom-pages",
    targetElementId: "layout-menu-visibility"
  },
  {
    term: "Links de Submenus do Menu Principal",
    keywords: ["submenu", "submenus", "dropdown", "links adicionais", "navegacao", "categorias"],
    description: "Configura as opções em lista suspensa (dropdown) nos botões de Pacotes e Viagem Personalizada.",
    tab: "layout",
    targetElementId: "layout-submenus"
  },
  {
    term: "Cores Principais do Tema",
    keywords: ["cores", "tema", "marca", "azul", "vermelho", "chocolate", "paleta", "estilo", "cor principal"],
    description: "Altere a cor primária (marca), secundária (detalhes), fundo claro e cores secundárias.",
    tab: "theme",
    targetElementId: "theme-colors-section"
  },
  {
    term: "Tipografia e Fontes do Site",
    keywords: ["fontes", "letras", "serifa", "sans", "tipografia", "montserrat", "cormorant", "georgia"],
    description: "Personalize as famílias de fontes usadas em títulos, subtítulos e textos corridos.",
    tab: "theme",
    targetElementId: "theme-fonts-section"
  },
  {
    term: "Estilo dos Botões e Bordas",
    keywords: ["botoes", "bordas", "arredondado", "sombra", "glassmorphism", "outline", "formato de botao"],
    description: "Modifique o arredondamento dos botões (completo, quadrado, suave) e o efeito visual (sólido, outline, vidro).",
    tab: "theme",
    targetElementId: "theme-button-style"
  },
  
  // Services
  {
    term: "Serviços e Consultoria",
    keywords: ["serviços", "servicos", "assessoria", "consultoria", "criar servico", "passagem", "hoteis"],
    description: "Gerencie os cards de serviços, com títulos, descrições e ícones customizados.",
    tab: "services",
    targetElementId: "services-section"
  },
  
  // Packages (Catálogo principal)
  {
    term: "Catálogo Geral de Pacotes de Viagem",
    keywords: ["pacotes", "catalogo", "destinos", "exotico", "nacionais", "cruzeiro", "criar pacote", "viagem"],
    description: "Crie, edite fotos, mude descrições e inclua itens em nosso catálogo fixo de viagens.",
    tab: "packages",
    targetElementId: "packages-section"
  },
  
  // Promos (Ofertas Relâmpago)
  {
    term: "Ofertas Relâmpago (Voo + Hotel)",
    keywords: ["ofertas", "relampago", "voo", "hotel", "chapeco", "promo", "promoçoes", "desconto", "tarifa"],
    description: "Crie e publique pacotes promocionais dinâmicos vinculados à plataforma de orçamentos Infotravel.",
    tab: "promos",
    targetElementId: "promos-section"
  },
  
  // Blog
  {
    term: "Postagens do Blog",
    keywords: ["blog", "postagens", "criar post", "artigos", "noticias", "dicas de viagem", "escrever"],
    description: "Publique e edite artigos completos, matérias e dicas de roteiros no blog oficial.",
    tab: "blog",
    targetElementId: "blog-section"
  },
  
  // Testimonials
  {
    term: "Depoimentos de Clientes",
    keywords: ["depoimentos", "depoimento", "feedbacks", "clientes", "estrelas", "opiniao", "avaliacoes"],
    description: "Gerencie os depoimentos e avaliações que constam na página para atestar confiabilidade.",
    tab: "testimonials",
    targetElementId: "testimonials-section"
  },
  
  // Custom Pages
  {
    term: "Páginas Customizadas",
    keywords: ["paginas", "customizadas", "seguro viagem", "destinos vip", "markdown", "nova pagina", "criar url"],
    description: "Crie novas páginas de conteúdo institucional 100% editáveis em Markdown, como roteiros VIP ou seguros.",
    tab: "custom-pages",
    targetElementId: "custom-pages-section"
  },
  
  // Domains
  {
    term: "Domínio Principal e DNS",
    keywords: ["dominio", "subdominio", "site oficial", "hostinger", "dns", "ip", "cname", "hospedagem"],
    description: "Instruções técnicas e status de apontamento de DNS e servidores.",
    tab: "domains",
    targetElementId: "domains-section"
  },
  
  // Code Injector
  {
    term: "Injetor de Códigos (Pixel, Analytics, Tags)",
    keywords: ["codigo", "head", "pixel", "facebook", "google analytics", "tag manager", "html", "javascript"],
    description: "Injete tags HTML e scripts de rastreamento no cabeçalho ou corpo do site.",
    tab: "code",
    targetElementId: "code-injector-section"
  },
  
  // Analytics
  {
    term: "Estatísticas de Tráfego e Cliques",
    keywords: ["graficos", "estatisticas", "trafego", "cliques", "conversao", "whatsapp", "analytics", "visitantes"],
    description: "Visualize dados reais de acessos ao site, cliques de WhatsApp e conversões em tempo real.",
    tab: "analytics",
    targetElementId: "analytics-section"
  }
];

export default function AdminView() {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('arcadane_admin_logged_in') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // CMS States
  const [seo, setSeo] = useState<SeoSettings>(getSeoSettings);
  const [home, setHome] = useState<HomeSettings>(getHomeSettings);
  const [services, setServices] = useState<ServiceItem[]>(getServices);
  const [packages, setPackages] = useState<PackageItem[]>(getPackages);
  const [promoPackages, setPromoPackages] = useState<PromoPackage[]>(getPromoPackages);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(getBlogPosts);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(getTestimonials);

  // Admin Omni Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchIndexItem[]>([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filtered = SEARCH_INDEX.filter(item => {
      const matchTitle = item.term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery);
      const matchKeywords = item.keywords.some(kw => 
        kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery)
      );
      const matchDesc = item.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery);
      return matchTitle || matchKeywords || matchDesc;
    });

    setSearchResults(filtered);
  };

  const handleSearchResultClick = (item: SearchIndexItem) => {
    setActiveTab(item.tab);
    setSearchQuery('');
    setSearchResults([]);
    showFeedback(`Direcionado para: ${item.term}`, 'success');
    
    // Smooth scroll and focus with highlight ripple
    setTimeout(() => {
      if (item.targetElementId) {
        const el = document.getElementById(item.targetElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Temporary spotlight ring effect
          el.classList.add('ring-4', 'ring-[#AF4934]', 'ring-offset-2', 'ring-offset-[#181615]', 'transition-all', 'duration-500');
          
          // Focus input if any inside the wrapper
          const input = el.querySelector('input, select, textarea') || el;
          if (input && typeof (input as any).focus === 'function') {
            (input as any).focus();
          }

          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-[#AF4934]', 'ring-offset-2', 'ring-offset-[#181615]');
          }, 2500);
        }
      }
    }, 150);
  };

  // Founders Photo Admin State
  const [foundersPhoto, setFoundersPhoto] = useState<string | null>(() => {
    return getFoundersPhoto();
  });

  // Trajectory Photo Admin State
  const [trajectoryPhoto, setTrajectoryPhoto] = useState<string | null>(() => {
    return localStorage.getItem('arcadane_trajectory_photo');
  });

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arcadane_custom_logo');
    }
    return null;
  });
  const [logoUploading, setLogoUploading] = useState(false);

  // Custom code injections
  const [customHeadCode, setCustomHeadCode] = useState<string>(() => {
    const val = localStorage.getItem('arcadane_custom_head_code');
    return val !== null ? val : DEFAULT_HEAD_CODE;
  });
  const [customBodyStartCode, setCustomBodyStartCode] = useState<string>(() => {
    let val = localStorage.getItem('arcadane_custom_body_start_code');
    if (val && val.includes('befly-widget')) {
      localStorage.setItem('arcadane_custom_body_start_code', DEFAULT_BODY_START_CODE);
      val = DEFAULT_BODY_START_CODE;
    }
    return val !== null ? val : DEFAULT_BODY_START_CODE;
  });
  const [customBodyEndCode, setCustomBodyEndCode] = useState<string>(() => {
    const val = localStorage.getItem('arcadane_custom_body_end_code');
    return val !== null ? val : DEFAULT_BODY_END_CODE;
  });

  // Sync state variables
  const [isForcedSyncing, setIsForcedSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; updatedKeys: string[]; count: number } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'seo' | 'home' | 'layout' | 'services' | 'packages' | 'promos' | 'blog' | 'testimonials' | 'code' | 'theme' | 'sync' | 'reset' | 'custom-pages' | 'domains' | 'analytics'>('analytics');

  // Custom pages and domains
  const [customPages, setCustomPages] = useState<CustomPage[]>(getCustomPages);
  const [domainSettings, setDomainSettings] = useState<DomainSettings>(getDomainSettings);
  const [editingCustomPage, setEditingCustomPage] = useState<CustomPage | null>(null);
  const [isCreatingCustomPage, setIsCreatingCustomPage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Theme settings state
  const [theme, setTheme] = useState<ThemeSettings>(getThemeSettings);

  // Analytics State
  const [analyticsEvents, setAnalyticsEvents] = useState(() => getAnalyticsEvents());
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = useState<'realtime' | 'today' | 'month' | 'year' | '30days'>('today');

  useEffect(() => {
    const handleAnalyticsUpdate = () => {
      setAnalyticsEvents(getAnalyticsEvents());
    };
    window.addEventListener('arcadane_analytics_updated', handleAnalyticsUpdate);

    let unsubFirestore: (() => void) | undefined;
    import('../utils/analyticsTracker').then(m => {
      unsubFirestore = m.subscribeToFirestoreAnalytics((events) => {
        setAnalyticsEvents(events);
      });
    }).catch(err => {
      console.error('[AdminView] Failed to start Firestore real-time analytics:', err);
    });

    return () => {
      window.removeEventListener('arcadane_analytics_updated', handleAnalyticsUpdate);
      if (unsubFirestore) {
        unsubFirestore();
      }
    };
  }, []);

  // Typewriter phrases state
  const [typewriterEndings, setTypewriterEndings] = useState<string>(() => {
    const saved = localStorage.getItem('arcadane_typewriter_endings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch (e) {}
    }
    return [
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
    ].join(', ');
  });

  // Seal / Medallion custom states
  const [sealTopText, setSealTopText] = useState(() => localStorage.getItem('arcadane_seal_top_text') || "ARCADANE CURADORIA EXCLUSIVA");
  const [sealBottomText, setSealBottomText] = useState(() => localStorage.getItem('arcadane_seal_bottom_text') || "VIAGENS EXTRAORDINÁRIAS");
  const [sealNumber, setSealNumber] = useState(() => localStorage.getItem('arcadane_seal_number') || "10");
  const [sealLabel1, setSealLabel1] = useState(() => localStorage.getItem('arcadane_seal_label1') || "ANOS DE");
  const [sealLabel2, setSealLabel2] = useState(() => localStorage.getItem('arcadane_seal_label2') || "EXPERIÊNCIA");

  // Quiz Banner Custom states
  const [quizBannerBadge, setQuizBannerBadge] = useState(() => localStorage.getItem('arcadane_quiz_banner_badge') || "EXPERIÊNCIA INTERATIVA EXCLUSIVA");
  const [quizBannerTitle, setQuizBannerTitle] = useState(() => localStorage.getItem('arcadane_quiz_banner_title') || "Descubra seu estilo de viajante e seu destino ideal");
  const [quizBannerDesc, setQuizBannerDesc] = useState(() => localStorage.getItem('arcadane_quiz_banner_desc') || "Responda algumas perguntas rápidas de curadoria e descubra em tempo real qual é a atmosfera global exata que mais sincroniza com você, além de receber sugestões exclusivas prontas para planejar com nossos consultores.");

  // Bento Destinations list state
  const [bentoDestinations, setBentoDestinations] = useState<any[]>(() => {
    const defaultBento = [
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
          "Mas existe uma experiência que eleva esse concept a outro nível: o safari na África.",
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
          "Já os Lençóis Maranhenses oferecem um cenário único no mundo: lagoas de água doce entre dunas, formando paisagens que mudam ao longo do ano e surpreendem in cada visita.",
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
          "Mas navegar com tranquilidade também exige escolhas certas.",
          "Qual companhia combina mais com o seu perfil? Qual cabine oferece a melhor experiência? Como funcionam os pacotes de bebidas, internet e passeios terrestres?",
          "Com a consultoria correta, cada escolha é planejada para que a sua única preocupação a bordo seja apreciar a vista e vivenciar cada porto de parada.",
          "Afinal, o mar é infinito, mas as suas férias devem ser perfeitas."
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
          "Já para os amantes de estrada e liberdade, a famosa Rota 66 é uma experiência icônica. Cruzar o país de carro, passando por cidades históricas e paisagens únicas, transforma a viagem em algo muito mais profissional do que apenas visitar destinos.",
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

    const saved = localStorage.getItem('arcadane_bento_destinations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...defaultBento];
          parsed.forEach((item, index) => {
            if (index < 4 && item) {
              merged[index] = item;
            }
          });
          return merged;
        }
      } catch (e) {}
    }
    return defaultBento;
  });

  // Interactive Edit Modals / States
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Package editor helper
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);

  // Promo Package editor helper
  const [editingPromo, setEditingPromo] = useState<PromoPackage | null>(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  // Blog editor helper
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Testimonial editor helper
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

  // Image compressing utility
  const compressAndSetImage = (file: File, onSuccess: (base64: string) => void) => {
    compressImage(file, 800, 800, 0.75)
      .then(onSuccess)
      .catch((err) => {
        console.warn("Compression fallback in admin:", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onSuccess(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  useEffect(() => {
    const handleCmsDataChanged = () => {
      setTheme(getThemeSettings());
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsDataChanged);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsDataChanged);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'arcadane' && password === 'arcadane123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('arcadane_admin_logged_in', 'true');
      setLoginError('');
      showFeedback('Login efetuado com sucesso absoluto!', 'success');
      window.dispatchEvent(new CustomEvent('arcadane_admin_login_changed', { detail: { loggedIn: true } }));
    } else {
      setLoginError('Credenciais incorretas. Por favor, tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('arcadane_admin_logged_in');
    showFeedback('Sessão encerrada com segurança.');
    window.dispatchEvent(new CustomEvent('arcadane_admin_login_changed', { detail: { loggedIn: false } }));
  };

  // Save Actions
  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    saveSeoSettings(seo);
    showFeedback('Configurações de SEO e Meta atualizadas!');
  };

  const handleSaveHome = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomeSettings(home);

    // Save typewriter endings list
    const parsedEndings = typewriterEndings.split(',').map(s => s.trim()).filter(Boolean);
    localStorage.setItem('arcadane_typewriter_endings', JSON.stringify(parsedEndings));

    // Save custom seal (medallion) texts
    localStorage.setItem('arcadane_seal_top_text', sealTopText);
    localStorage.setItem('arcadane_seal_bottom_text', sealBottomText);
    localStorage.setItem('arcadane_seal_number', sealNumber);
    localStorage.setItem('arcadane_seal_label1', sealLabel1);
    localStorage.setItem('arcadane_seal_label2', sealLabel2);

    // Save custom quiz banner texts
    localStorage.setItem('arcadane_quiz_banner_badge', quizBannerBadge);
    localStorage.setItem('arcadane_quiz_banner_title', quizBannerTitle);
    localStorage.setItem('arcadane_quiz_banner_desc', quizBannerDesc);

    // Save bento destinations list
    localStorage.setItem('arcadane_bento_destinations', JSON.stringify(bentoDestinations));

    // Dispatch reload
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));

    showFeedback('Página Inicial editada bloco por bloco e salva com absoluto sucesso! 🎉');
  };

  const handleSaveLayout = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomeSettings(home);
    showFeedback('Layout, preloader, menus e rodapé salvos com sucesso!');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoUploading(true);
    try {
      const compressed = await compressImage(file, 2400, 2400, 0.95, true, true);
      localStorage.setItem('arcadane_custom_logo', compressed);
      setCustomLogo(compressed);
      window.dispatchEvent(new Event('arcadane_logo_changed'));
      window.dispatchEvent(new Event('arcadane_cms_data_changed'));
      showFeedback('Novo logotipo PNG processado e salvo!');
    } catch (err) {
      console.error(err);
      showFeedback('Erro ao processar imagem do logotipo.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('arcadane_custom_logo');
    setCustomLogo(null);
    window.dispatchEvent(new Event('arcadane_logo_changed'));
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
    showFeedback('Logotipo restaurado para o padrão original!');
  };

  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    saveServices(services);
    showFeedback('Grade de Serviços atualizada no banco local!');
  };

  const handleSaveCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('arcadane_custom_head_code', customHeadCode);
    localStorage.setItem('arcadane_custom_body_start_code', customBodyStartCode);
    localStorage.setItem('arcadane_custom_body_end_code', customBodyEndCode);
    
    // Broadcast changes & Sync to cloud instantly
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
    autoSyncToServer();
    
    showFeedback('Códigos, scripts e estilos de customização injetados e salvos com sucesso!');
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    saveThemeSettings(theme);
    showFeedback('Configurações de customização do tema salvas com sucesso!');
  };

  // Sync state to actual source files on the server (for Hostinger & GitHub)
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncToWorkspace = async () => {
    setIsSyncing(true);
    try {
      const dataToSync = {
        arcadane_cms_services: JSON.parse(localStorage.getItem('arcadane_cms_services') || 'null'),
        arcadane_cms_packages: JSON.parse(localStorage.getItem('arcadane_cms_packages') || 'null'),
        arcadane_cms_promo_packages: JSON.parse(localStorage.getItem('arcadane_cms_promo_packages') || 'null'),
        arcadane_cms_blog_posts: JSON.parse(localStorage.getItem('arcadane_cms_blog_posts') || 'null'),
        arcadane_cms_testimonials: JSON.parse(localStorage.getItem('arcadane_cms_testimonials') || 'null'),
        arcadane_cms_seo_settings: JSON.parse(localStorage.getItem('arcadane_cms_seo_settings') || 'null'),
        arcadane_cms_home_settings: JSON.parse(localStorage.getItem('arcadane_cms_home_settings') || 'null'),
        arcadane_cms_luxury_trips: JSON.parse(localStorage.getItem('arcadane_cms_luxury_trips') || 'null'),
        arcadane_founders_photo: localStorage.getItem('arcadane_founders_photo'),
        arcadane_trajectory_photo: localStorage.getItem('arcadane_trajectory_photo'),
        arcadane_custom_logo: localStorage.getItem('arcadane_custom_logo')
      };

      const response = await fetch('/api/save-cms-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSync),
      });

      const result = await response.json();
      if (result.success) {
        showFeedback('UAU! 🎉 Configurações e Imagens salvas nos arquivos do projeto de forma PERMANENTE para GitHub/Hostinger!');
      } else {
        showFeedback('Erro ao persistir no servidor: ' + result.error, 'error');
      }
    } catch (error: any) {
      console.error('Error syncing CMS state:', error);
      showFeedback('Erro de rede: certifique-se de que o servidor está rodando.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadCmsBackup = () => {
    try {
      const dataToSync = {
        updatedAt: new Date().toISOString(),
        arcadane_cms_services: JSON.parse(localStorage.getItem('arcadane_cms_services') || 'null'),
        arcadane_cms_packages: JSON.parse(localStorage.getItem('arcadane_cms_packages') || 'null'),
        arcadane_cms_promo_packages: JSON.parse(localStorage.getItem('arcadane_cms_promo_packages') || 'null'),
        arcadane_cms_blog_posts: JSON.parse(localStorage.getItem('arcadane_cms_blog_posts') || 'null'),
        arcadane_cms_testimonials: JSON.parse(localStorage.getItem('arcadane_cms_testimonials') || 'null'),
        arcadane_cms_seo_settings: JSON.parse(localStorage.getItem('arcadane_cms_seo_settings') || 'null'),
        arcadane_cms_home_settings: JSON.parse(localStorage.getItem('arcadane_cms_home_settings') || 'null'),
        arcadane_cms_luxury_trips: JSON.parse(localStorage.getItem('arcadane_cms_luxury_trips') || 'null'),
        arcadane_founders_photo: localStorage.getItem('arcadane_founders_photo'),
        arcadane_trajectory_photo: localStorage.getItem('arcadane_trajectory_photo'),
        arcadane_custom_logo: localStorage.getItem('arcadane_custom_logo')
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToSync, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'cmsStoreFallback.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showFeedback('Arquivo cmsStoreFallback.json baixado com sucesso! Salve-o na pasta src/utils/ no seu GitHub para publicar no ar!');
    } catch (err: any) {
      showFeedback('Erro ao gerar arquivo de backup: ' + err.message, 'error');
    }
  };

  // Package CRUD operations
  const handleSavePackageForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    let updatedPackages: PackageItem[];
    if (isCreatingPackage) {
      updatedPackages = [...packages, { ...editingPackage, id: `pkg-${Date.now()}` }];
    } else {
      updatedPackages = packages.map(p => p.id === editingPackage.id ? editingPackage : p);
    }

    setPackages(updatedPackages);
    savePackages(updatedPackages);
    setEditingPackage(null);
    setIsCreatingPackage(false);
    showFeedback('Pacote turístico salvo com sucesso!');
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este pacote turístico?')) {
      const updated = packages.filter(p => p.id !== id);
      setPackages(updated);
      savePackages(updated);
      showFeedback('Pacote excluído com sucesso.');
    }
  };

  // Blog CRUD operations
  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    let updatedPosts: BlogPost[];
    if (isCreatingPost) {
      updatedPosts = [{ ...editingPost, id: `post-${Date.now()}` }, ...blogPosts];
    } else {
      updatedPosts = blogPosts.map(p => p.id === editingPost.id ? editingPost : p);
    }

    setBlogPosts(updatedPosts);
    saveBlogPosts(updatedPosts);
    setEditingPost(null);
    setIsCreatingPost(false);
    showFeedback('Artigo de blog publicado com sucesso!');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Confirma a exclusão deste artigo do blog?')) {
      const updated = blogPosts.filter(p => p.id !== id);
      setBlogPosts(updated);
      saveBlogPosts(updated);
      showFeedback('Artigo excluído com sucesso.');
    }
  };

  // Testimonial CRUD operations
  const handleSaveTestimonialForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    let updatedTestimonial: TestimonialItem[];
    if (isCreatingTestimonial) {
      updatedTestimonial = [...testimonials, editingTestimonial];
    } else {
      updatedTestimonial = testimonials.map(t => t.name === editingTestimonial.name ? editingTestimonial : t);
    }

    setTestimonials(updatedTestimonial);
    saveTestimonials(updatedTestimonial);
    setEditingTestimonial(null);
    setIsCreatingTestimonial(false);
    showFeedback('Depoimento do cliente salvo!');
  };

  const handleDeleteTestimonial = (name: string) => {
    if (window.confirm('Excluir de vez este depoimento de cliente?')) {
      const updated = testimonials.filter(t => t.name !== name);
      setTestimonials(updated);
      saveTestimonials(updated);
      showFeedback('Depoimento excluído.');
    }
  };

  // Promo Package CRUD operations
  const handleSavePromoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    let updatedPromos: PromoPackage[];
    if (isCreatingPromo) {
      updatedPromos = [...promoPackages, { ...editingPromo, id: `promo-${Date.now()}` }];
    } else {
      updatedPromos = promoPackages.map(p => p.id === editingPromo.id ? editingPromo : p);
    }

    setPromoPackages(updatedPromos);
    savePromoPackages(updatedPromos);
    setEditingPromo(null);
    setIsCreatingPromo(false);
    showFeedback('Oferta promocional salva com sucesso!');
  };

  const handleDeletePromo = (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir esta oferta promocional?')) {
      const updated = promoPackages.filter(p => p.id !== id);
      setPromoPackages(updated);
      savePromoPackages(updated);
      showFeedback('Oferta promocional excluída com sucesso.');
    }
  };

  const handleFullReset = () => {
    if (window.confirm('ATENÇÃO: Isso irá apagar todas as personalizações feitas e restaurar os textos, mídias e pacotes originais de fábrica. Confirmar?')) {
      resetCmsToDefault();
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
      setServices(getServices());
      setPackages(getPackages());
      setPromoPackages(getPromoPackages());
      setBlogPosts(getBlogPosts());
      setTestimonials(getTestimonials());
      setFoundersPhoto(null);
      showFeedback('Todas as configurações de fábrica foram restauradas.', 'success');
    }
  };

  const handleForcedSync = async (direction: 'pull' | 'push') => {
    setIsForcedSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const res = await forceSyncCmsState(direction);
      if (res.success) {
        setSyncResult({
          success: true,
          updatedKeys: res.updatedKeys,
          count: res.updatedKeys.length
        });
        
        // Refresh local UI states so edits instantly show on the screen
        if (direction === 'pull') {
          setSeo(getSeoSettings());
          setHome(getHomeSettings());
          setServices(getServices());
          setPackages(getPackages());
          setPromoPackages(getPromoPackages());
          setBlogPosts(getBlogPosts());
          setTestimonials(getTestimonials());
          setFoundersPhoto(getFoundersPhoto());
          setTrajectoryPhoto(localStorage.getItem('arcadane_trajectory_photo'));
          setCustomLogo(localStorage.getItem('arcadane_custom_logo'));
        }
        showFeedback(
          direction === 'pull'
            ? 'Dados sincronizados e baixados da nuvem com sucesso!'
            : 'Dados locais enviados e salvos na nuvem com sucesso!',
          'success'
        );
      } else {
        setSyncError(res.error || 'Erro desconhecido na sincronização.');
        showFeedback('Falha na sincronização dos dados.', 'error');
      }
    } catch (err: any) {
      setSyncError(err.message || 'Falha ao sincronizar dados com a nuvem.');
      showFeedback('Falha na sincronização dos dados.', 'error');
    } finally {
      setIsForcedSyncing(false);
    }
  };

  // CSS standard class styles
  const btnClass = "bg-[#AF4934] hover:bg-[#973a27] text-white font-medium text-xs font-display tracking-widest px-5 py-2.5 rounded-lg transition-all duration-200 uppercase cursor-pointer inline-flex items-center gap-2 shadow-md";
  const inputClass = "w-full bg-[#1c1917]/40 border border-stone-700 focus:border-[#AF4934]/60 rounded-lg p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden transition-all";
  const labelClass = "block text-[10.5px] font-mono uppercase tracking-wider text-[#AF4934] font-bold mb-1.5";

  // Login View Renderer
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center relative py-12 px-4 select-none overflow-hidden" id="admin-login-screen">
        {/* Immersive background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-sm w-full bg-[#181615]/95 border border-[#AF4934]/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-8 backdrop-blur-xl"
        >
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#AF4934]/15 border border-[#AF4934]/30 text-brand-primary flex items-center justify-center mx-auto shadow-inner">
              <Key className="w-7 h-7 text-[#AF4934]" />
            </div>
            <h1 className="font-display font-medium text-xl tracking-widest uppercase text-stone-100">Área do Administrador</h1>
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#AF4934] font-bold">Arcadane CMS Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-left" id="admin-login-form">
            <div className="space-y-1">
              <label htmlFor="admin-username" className={labelClass}>Nome do Gerente</label>
              <input 
                type="text" 
                id="admin-username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: arcadane" 
                className={inputClass}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="admin-password" className={labelClass}>Chave de Acesso</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="admin-password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua chave de acesso" 
                  className={`${inputClass} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/20 p-3 rounded-lg text-red-400 text-xs text-left leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#AF4934] hover:bg-[#973a27] text-white font-medium text-xs font-display tracking-widest py-3.5 rounded-lg transition-all duration-200 uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              Autenticar e Entrar
            </button>
          </form>

          <p className="text-[10px] text-stone-500 font-mono">
            Acesso encriptado local de alta segurança.
          </p>
        </motion.div>
      </div>
    );
  }

  // --- Analytics Processing ---
  const filteredEventsForMetrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    return analyticsEvents.filter(e => {
      const eventDate = new Date(e.timestamp);
      const eventDateStr = e.timestamp.split('T')[0];

      switch (analyticsTimeFilter) {
        case 'realtime':
          // Let's use 1 hour for realtime metrics so the charts have some data, but we show last 15 min active online
          return e.timestamp >= oneHourAgo;
        case 'today':
          return eventDateStr === todayStr;
        case 'month':
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        case 'year':
          return eventDate.getFullYear() === currentYear;
        case '30days':
        default:
          return true;
      }
    });
  }, [analyticsEvents, analyticsTimeFilter]);

  const pageViews = filteredEventsForMetrics.filter(e => !e.customAction);
  const customEvents = filteredEventsForMetrics.filter(e => e.customAction);

  // Active online right now (last 15 minutes)
  const activeNowCount = useMemo(() => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const activeNowEvents = analyticsEvents.filter(e => e.timestamp >= fifteenMinutesAgo && !e.customAction);
    return Array.from(new Set(activeNowEvents.map(e => `${e.device}_${e.origin}_${e.age}`))).length;
  }, [analyticsEvents]);

  const totalViews = pageViews.length;

  const uniqueVisitors = Array.from(new Set(pageViews.map(e => {
    const day = e.timestamp.split('T')[0];
    return `${day}_${e.device}_${e.origin}_${e.age}`;
  }))).length;

  const conversionsCount = customEvents.filter(e => 
    e.customAction === 'whatsapp_click' || 
    e.customAction === 'quiz_completed' || 
    e.customAction === 'whatsapp_modal' ||
    e.customAction === 'quote_package' ||
    e.customAction === 'itinerary_build_click'
  ).length;

  const conversionRate = totalViews > 0 ? ((conversionsCount / totalViews) * 100).toFixed(1) : '0.0';

  const avgDurationSeconds = pageViews.length > 0 
    ? Math.round(pageViews.reduce((sum, e) => sum + e.durationSeconds, 0) / pageViews.length) 
    : 0;
  const avgDurationFormatted = `${Math.floor(avgDurationSeconds / 60)}m ${avgDurationSeconds % 60}s`;

  // Generate Trend Chart Data based on selected filter
  const trendChartData = useMemo(() => {
    const now = new Date();
    
    if (analyticsTimeFilter === 'realtime') {
      // Group by last 60 minutes in 5-minute slots
      const data: { date: string; Visualizações: number; Conversões: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const slotTime = new Date(now.getTime() - i * 5 * 60 * 1000);
        const timeStr = slotTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        data.push({ date: timeStr, Visualizações: 0, Conversões: 0 });
      }

      filteredEventsForMetrics.forEach(e => {
        const evTime = new Date(e.timestamp).getTime();
        const diffMin = Math.floor((now.getTime() - evTime) / (5 * 60 * 1000));
        if (diffMin >= 0 && diffMin < 12) {
          const index = 11 - diffMin;
          if (data[index]) {
            if (e.customAction) {
              data[index].Conversões += 1;
            } else {
              data[index].Visualizações += 1;
            }
          }
        }
      });
      return data;
    }

    if (analyticsTimeFilter === 'today') {
      // Group by hours (last 24 hours or fixed blocks)
      const data: { date: string; Visualizações: number; Conversões: number }[] = [];
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourLabel = `${d.getHours()}:00`;
        data.push({ date: hourLabel, Visualizações: 0, Conversões: 0 });
      }

      filteredEventsForMetrics.forEach(e => {
        const evDate = new Date(e.timestamp);
        const diffHours = Math.floor((now.getTime() - evDate.getTime()) / (60 * 60 * 1000));
        if (diffHours >= 0 && diffHours < 24) {
          const index = 23 - diffHours;
          if (data[index]) {
            if (e.customAction) {
              data[index].Conversões += 1;
            } else {
              data[index].Visualizações += 1;
            }
          }
        }
      });
      return data;
    }

    if (analyticsTimeFilter === 'month') {
      // Group by day of current month (1 to 28/30/31)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const data: { date: string; Visualizações: number; Conversões: number }[] = [];
      for (let i = 1; i <= daysInMonth; i++) {
        data.push({ date: `${i} ${now.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}`, Visualizações: 0, Conversões: 0 });
      }

      filteredEventsForMetrics.forEach(e => {
        const evDate = new Date(e.timestamp);
        if (evDate.getMonth() === now.getMonth() && evDate.getFullYear() === now.getFullYear()) {
          const day = evDate.getDate();
          if (data[day - 1]) {
            if (e.customAction) {
              data[day - 1].Conversões += 1;
            } else {
              data[day - 1].Visualizações += 1;
            }
          }
        }
      });
      return data;
    }

    if (analyticsTimeFilter === 'year') {
      // Group by month of current year (Jan to Dez)
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const data = months.map(m => ({ date: m, Visualizações: 0, Conversões: 0 }));

      filteredEventsForMetrics.forEach(e => {
        const evDate = new Date(e.timestamp);
        if (evDate.getFullYear() === now.getFullYear()) {
          const monthIdx = evDate.getMonth();
          if (data[monthIdx]) {
            if (e.customAction) {
              data[monthIdx].Conversões += 1;
            } else {
              data[monthIdx].Visualizações += 1;
            }
          }
        }
      });
      return data;
    }

    // Default: Last 30 days
    const dailyDataMap: Record<string, { date: string; Visualizações: number; Conversões: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
      dailyDataMap[dayStr] = { date: label, Visualizações: 0, Conversões: 0 };
    }

    filteredEventsForMetrics.forEach(e => {
      const dayStr = e.timestamp.split('T')[0];
      if (dailyDataMap[dayStr]) {
        if (e.customAction) {
          dailyDataMap[dayStr].Conversões += 1;
        } else {
          dailyDataMap[dayStr].Visualizações += 1;
        }
      }
    });

    return Object.values(dailyDataMap);
  }, [filteredEventsForMetrics, analyticsTimeFilter]);

  const dailyChartData = trendChartData;

  const originMap: Record<string, number> = {
    'Tráfego Pago': 0,
    'Orgânico': 0,
    'Direto': 0,
    'Redes Sociais': 0,
    'Referência': 0
  };
  pageViews.forEach(e => {
    if (originMap[e.origin] !== undefined) {
      originMap[e.origin] += 1;
    }
  });
  const originChartData = Object.entries(originMap).map(([name, value]) => ({ name, value }));

  const deviceMap: Record<string, number> = {
    'Desktop': 0,
    'Mobile': 0,
    'Tablet': 0
  };
  pageViews.forEach(e => {
    if (deviceMap[e.device] !== undefined) {
      deviceMap[e.device] += 1;
    }
  });
  const deviceChartData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  const ageMap: Record<string, number> = {
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45-54': 0,
    '55+': 0
  };
  pageViews.forEach(e => {
    if (ageMap[e.age] !== undefined) {
      ageMap[e.age] += 1;
    }
  });
  const ageChartData = Object.entries(ageMap).map(([name, value]) => ({ name, value }));

  const pageLabelMap: Record<string, string> = {
    'home': 'Início / Home',
    'packages': 'Pacotes de Viagem',
    'custom-trip': 'Roteiros Exclusivos',
    'blog': 'Artigos do Blog',
    'about-us': 'Nossa História / Quem Somos',
    'contact-us': 'Fale Conosco',
    'travel-quiz': 'Quiz de Estilo de Viagem',
    'privacy': 'Políticas de Privacidade',
    'destinos-vip': 'Página VIP: Destinos',
    'seguro-viagem': 'Página VIP: Seguro de Viagem'
  };

  const pageCountMap: Record<string, { count: number; totalDuration: number }> = {};
  pageViews.forEach(e => {
    if (!pageCountMap[e.pageId]) {
      pageCountMap[e.pageId] = { count: 0, totalDuration: 0 };
    }
    pageCountMap[e.pageId].count += 1;
    pageCountMap[e.pageId].totalDuration += e.durationSeconds;
  });

  const rankedPages = Object.entries(pageCountMap)
    .map(([id, stats]) => ({
      id,
      name: pageLabelMap[id] || `Página Customizada: ${id}`,
      views: stats.count,
      avgTime: stats.count > 0 ? `${Math.floor((stats.totalDuration / stats.count) / 60)}m ${Math.round((stats.totalDuration / stats.count) % 60)}s` : '0s'
    }))
    .sort((a, b) => b.views - a.views);

  const eventLabelMap: Record<string, string> = {
    'whatsapp_click': 'Cliques no Botão WhatsApp',
    'whatsapp_modal': 'Aberturas do Seletor WhatsApp',
    'quiz_completed': 'Quiz de Estilo Finalizado',
    'search_flights': 'Pesquisas de Voos (Befly)',
    'itinerary_build_click': 'Início de Roteiro Customizado',
    'quote_package': 'Solicitações de Cotação de Pacotes'
  };

  const eventCountMap: Record<string, number> = {
    'whatsapp_click': 0,
    'whatsapp_modal': 0,
    'quiz_completed': 0,
    'search_flights': 0,
    'itinerary_build_click': 0,
    'quote_package': 0
  };
  customEvents.forEach(e => {
    if (e.customAction && eventCountMap[e.customAction] !== undefined) {
      eventCountMap[e.customAction] += 1;
    }
  });

  const activeEvents = Object.entries(eventCountMap).map(([id, count]) => ({
    id,
    label: eventLabelMap[id] || id,
    count
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 pb-20 pt-8" id="admin-cms-dashboard">
      
      {/* Floating Global Micro feedback message */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-10000 max-w-sm p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
              feedbackMsg.type === 'success' ? 'bg-[#141211] border-emerald-500/30' : 'bg-[#141211] border-rose-500/30'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div className="text-left">
              <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">Notificação Sistema</p>
              <p className="text-xs text-stone-100 leading-tight mt-0.5">{feedbackMsg.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Dashboard Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6 pr-2">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#AF4934] font-bold bg-[#AF4934]/10 px-2.5 py-1 rounded-md">
              Painel Operacional Ativo
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-stone-100 tracking-tight">
              Gerência do Site (CMS)
            </h1>
            <p className="text-xs text-stone-400 font-sans">
              Edite textos, fotos dos sócios, metas de SEO, blogs, depoimentos e pacotes de viagem instantaneamente.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
            <button
              onClick={() => {
                // Return to Website
                const clickEvent = new Event('click');
                window.location.reload();
              }}
              className="bg-[#AF4934] hover:bg-[#973a27] text-white font-mono text-[10px] tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-md"
            >
              <Eye className="w-4 h-4 text-white" />
              Ver Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[10px] tracking-wider px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
        {/* Omni Search Bar */}
        <div className="bg-[#181615]/40 border border-stone-800/80 rounded-2xl p-4 sm:p-5 shadow-inner">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Digite qualquer termo para localizar e alterar... (Ex: 'SEO', 'WhatsApp', 'Vídeo', 'Foto dos sócios', 'Cores', 'Pacotes')"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 sm:py-3.5 bg-stone-900/90 border border-stone-800 hover:border-stone-700 focus:border-[#AF4934]/60 focus:ring-1 focus:ring-[#AF4934]/60 text-sm rounded-xl text-stone-100 placeholder-stone-500 font-sans tracking-wide transition-colors outline-none focus:shadow-md"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-stone-300 transition-colors text-xs font-mono font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="mt-3.5 bg-[#141211] border border-stone-800/80 rounded-xl overflow-hidden divide-y divide-stone-850/60 z-30 relative shadow-2xl max-h-80 overflow-y-auto custom-scrollbar"
              >
                <div className="px-4 py-2 bg-stone-900/40 border-b border-stone-850/40 flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">Resultados da Busca Inteligente</span>
                  <span className="text-[10px] font-mono text-[#AF4934] font-bold">{searchResults.length} {searchResults.length === 1 ? 'item encontrado' : 'itens encontrados'}</span>
                </div>
                {searchResults.map((item, index) => {
                  let tabLabel = "Painel";
                  if (item.tab === 'seo') tabLabel = "SEO, Favicon & Contatos";
                  if (item.tab === 'home') tabLabel = "Início & Quem Somos";
                  if (item.tab === 'layout') tabLabel = "Layout, Logo & Menu";
                  if (item.tab === 'services') tabLabel = "Nossos Serviços";
                  if (item.tab === 'packages') tabLabel = "Catálogo de Pacotes";
                  if (item.tab === 'promos') tabLabel = "Ofertas Relâmpago / Voos";
                  if (item.tab === 'blog') tabLabel = "Postagens do Blog";
                  if (item.tab === 'testimonials') tabLabel = "Depoimentos";
                  if (item.tab === 'code') tabLabel = "Injetor de Códigos / HTML";
                  if (item.tab === 'theme') tabLabel = "Personalizar Cores e Tema";
                  if (item.tab === 'custom-pages') tabLabel = "Páginas Customizadas";
                  if (item.tab === 'domains') tabLabel = "Domínio & Hospedagem";
                  if (item.tab === 'analytics') tabLabel = "Análises e Estatísticas";

                  return (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full text-left px-4 py-3 sm:py-3.5 hover:bg-[#AF4934]/10 transition-colors flex items-start justify-between gap-4 cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-display font-medium text-stone-200 group-hover:text-white transition-colors">
                            {item.term}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-stone-850 text-stone-400 border border-stone-800">
                            {tabLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 group-hover:text-stone-300 leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 self-center text-[10px] sm:text-xs font-mono text-[#FF7C60] bg-[#AF4934]/20 border border-[#AF4934]/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-[#AF4934]/40 hover:border-[#AF4934]/50 transition-all shrink-0">
                        <span>Ir para ajuste</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF7C60]" />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3.5 p-4 text-center bg-[#141211] border border-stone-800 rounded-xl"
              >
                <p className="text-stone-400 text-xs">Nenhum campo ou configuração encontrada para "<span className="text-stone-200 font-semibold">{searchQuery}</span>".</p>
                <p className="text-stone-500 text-[11px] mt-1">Dica: Tente buscar por termos mais simples como 'foto', 'titulo', 'whatsapp', 'seo', 'cores' ou 'blog'.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dashboard layout splits */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vertical Control Navigation Track */}
          <div className="space-y-2 lg:col-span-1" id="admin-sidebar">
            <p className="text-[9px] uppercase font-mono tracking-widest text-stone-500 font-bold px-2.5 mb-2 block">Módulos de Edição</p>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'analytics' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4 shrink-0 text-[#AF4934]" />
                Análises e Estatísticas
              </span>
              <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-md font-bold">LIVE</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'seo' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 shrink-0" />
                SEO, Favicon & Contatos
              </span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'home' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Film className="w-4 h-4 shrink-0" />
                Início & Quem Somos
              </span>
            </button>

            <button
              onClick={() => setActiveTab('layout')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'layout' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 shrink-0 text-amber-500" />
                Layout, Logo & Menu
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'services' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 shrink-0" />
                Nossos Serviços
              </span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'packages' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 shrink-0" />
                Catálogo Roteiros de Luxo
              </span>
              <span className="text-[10px] font-mono bg-stone-800/80 text-[#AF4934] px-2 py-0.5 rounded-md font-bold">{packages.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('promos')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'promos' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 shrink-0 text-red-400" />
                Ofertas Relâmpago / Voos
              </span>
              <span className="text-[10px] font-mono bg-stone-800/80 text-[#AF4934] px-2 py-0.5 rounded-md font-bold">{promoPackages.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'blog' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                Postagens do Blog
              </span>
              <span className="text-[10px] font-mono bg-stone-800/80 text-[#AF4934] px-2 py-0.5 rounded-md font-bold">{blogPosts.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'testimonials' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 shrink-0" />
                Depoimentos
              </span>
              <span className="text-[10px] font-mono bg-stone-800/80 text-[#AF4934] px-2 py-0.5 rounded-md font-bold">{testimonials.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'code' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Code className="w-4 h-4 shrink-0 text-amber-500" />
                Injetor de Códigos / HTML
              </span>
              <span className="text-[10px] font-mono bg-amber-950/80 text-amber-500 px-2 py-0.5 rounded-md font-bold">Ativo</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'theme' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 shrink-0 text-brand-secondary" />
                Personalizar Cores e Tema
              </span>
              <span className="text-[10px] font-mono bg-teal-950/80 text-teal-400 px-2 py-0.5 rounded-md font-bold">Design</span>
            </button>

            <button
              onClick={() => setActiveTab('custom-pages')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'custom-pages' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0 text-amber-500" />
                Páginas Customizadas
              </span>
              <span className="text-[10px] font-mono bg-amber-950/80 text-amber-500 px-2 py-0.5 rounded-md font-bold">{customPages.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('domains')}
              className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                activeTab === 'domains' 
                  ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                  : 'bg-[#181615]/30 hover:bg-[#181615]/80 border-transparent text-stone-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 shrink-0 text-blue-400" />
                Domínio & Hospedagem
              </span>
              <span className="text-[10px] font-mono bg-blue-950/80 text-blue-400 px-2 py-0.5 rounded-md font-bold">DNS</span>
            </button>

            <div className="border-t border-stone-800 pt-3 mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('sync')}
                className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer border ${
                  activeTab === 'sync' 
                    ? 'bg-[#AF4934]/15 border-[#AF4934]/35 text-[#AF4934] font-bold' 
                    : 'bg-[#181615]/30 hover:bg-[#AF4934]/10 border-transparent text-stone-400'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 shrink-0 text-amber-500" />
                  Sincronização Cloud
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reset')}
                className={`w-full text-left font-display text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center gap-2.5 cursor-pointer border ${
                  activeTab === 'reset' 
                    ? 'bg-rose-550/15 border-rose-500/40 text-rose-450 font-bold' 
                    : 'bg-[#181615]/30 hover:bg-rose-950/10 text-stone-400'
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0 text-rose-500" />
                Reconfiguração Geral
              </button>
            </div>
          </div>

          {/* Active Workspace Area Panels */}
          <div className="lg:col-span-3 bg-[#131110] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
            
            {/* Panel Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider mb-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Live Analytics Ativo
                    </span>
                    <h3 className="font-display font-medium text-lg text-stone-100">Painel de Métricas e Análises</h3>
                    <p className="text-stone-400 text-xs mt-1">Estatísticas consolidadas dos últimos 30 dias de tráfego, conversões e engajamento da Arcadane Viagens.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const testPages = ['home', 'packages', 'custom-trip', 'blog', 'travel-quiz', 'contact-us', 'destinos-vip'];
                        const randomPage = testPages[Math.floor(Math.random() * testPages.length)];
                        // Track a random page
                        import('../utils/analyticsTracker').then(m => {
                          m.trackPageView(randomPage);
                          // Also random conversion 25% of times
                          if (Math.random() < 0.25) {
                            const actions = ['whatsapp_click', 'quiz_completed', 'search_flights'];
                            m.trackCustomEvent(actions[Math.floor(Math.random() * actions.length)], randomPage);
                          }
                          setAnalyticsEvents(m.getAnalyticsEvents());
                          showFeedback('Acesso simulado registrado em tempo real!', 'success');
                        });
                      }}
                      className="bg-[#AF4934]/15 hover:bg-[#AF4934]/25 text-[#AF4934] border border-[#AF4934]/35 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Simular Tráfego Live
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Deseja realmente limpar TODOS os dados de tráfego reais salvos na nuvem (Firestore) e no navegador?')) {
                          import('../utils/analyticsTracker').then(async (m) => {
                            await m.clearFirestoreAnalytics();
                            setAnalyticsEvents([]);
                            showFeedback('Estatísticas de tráfego do Firestore limpas com sucesso!', 'success');
                          });
                        }
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Resetar
                    </button>
                  </div>
                </div>

                {/* Time Filter Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/40 p-2.5 rounded-2xl border border-stone-850/80">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-400 font-display">
                    <Sliders className="w-3.5 h-3.5 text-[#AF4934]" />
                    <span>Período do Relatório:</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setAnalyticsTimeFilter('realtime')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer border ${
                        analyticsTimeFilter === 'realtime'
                          ? 'bg-emerald-550/15 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10'
                          : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Na Hora (Ativos Agora)</span>
                    </button>
                    
                    <button
                      onClick={() => setAnalyticsTimeFilter('today')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer border ${
                        analyticsTimeFilter === 'today'
                          ? 'bg-[#AF4934]/15 border-[#AF4934]/30 text-[#AF4934] font-bold'
                          : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                      }`}
                    >
                      No Dia (Hoje)
                    </button>
                    
                    <button
                      onClick={() => setAnalyticsTimeFilter('month')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer border ${
                        analyticsTimeFilter === 'month'
                          ? 'bg-[#AF4934]/15 border-[#AF4934]/30 text-[#AF4934] font-bold'
                          : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                      }`}
                    >
                      Por Mês (Este Mês)
                    </button>
                    
                    <button
                      onClick={() => setAnalyticsTimeFilter('year')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer border ${
                        analyticsTimeFilter === 'year'
                          ? 'bg-[#AF4934]/15 border-[#AF4934]/30 text-[#AF4934] font-bold'
                          : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                      }`}
                    >
                      Por Ano (Este Ano)
                    </button>
                    
                    <button
                      onClick={() => setAnalyticsTimeFilter('30days')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all cursor-pointer border ${
                        analyticsTimeFilter === '30days'
                          ? 'bg-[#AF4934]/15 border-[#AF4934]/30 text-[#AF4934] font-bold'
                          : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                      }`}
                    >
                      Últimos 30 dias (Tudo)
                    </button>
                  </div>
                </div>

                {/* Bento Grid Stats KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* KPI 1 */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#AF4934]/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider block">Visualizações</span>
                    <span className="font-display font-bold text-2xl text-stone-100 block tracking-tight">
                      {totalViews.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12.4% vs mês ant.
                    </span>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#3B5EA4]/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider block">
                      {analyticsTimeFilter === 'realtime' ? 'Ativos Agora' : 'Visitantes Únicos'}
                    </span>
                    <span className="font-display font-bold text-2xl text-stone-100 block tracking-tight flex items-center gap-1.5">
                      {analyticsTimeFilter === 'realtime' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          {Math.max(1, activeNowCount)}
                        </>
                      ) : (
                        uniqueVisitors.toLocaleString('pt-BR')
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 
                      {analyticsTimeFilter === 'realtime' ? 'Sessões online no site' : '+8.7% sessões ativas'}
                    </span>
                  </div>

                  {/* KPI 3 */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider block">Taxa de Conversão</span>
                    <span className="font-display font-bold text-2xl text-emerald-400 block tracking-tight">
                      {conversionRate}%
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      Meta de WhatsApp premium
                    </span>
                  </div>

                  {/* KPI 4 */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider block">Tempo de Sessão</span>
                    <span className="font-display font-bold text-2xl text-stone-100 block tracking-tight">
                      {avgDurationFormatted}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Engajamento excelente
                    </span>
                  </div>
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Traffic Trend area chart */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-display font-medium text-stone-100">Tendência de Tráfego</h4>
                        <p className="text-[10px] text-stone-400">Histórico de visualizações de páginas e conversões no período</p>
                      </div>
                      <span className="text-[10px] font-mono bg-stone-800 text-stone-400 px-2 py-0.5 rounded-md uppercase">
                        {analyticsTimeFilter === 'realtime' && 'Última Hora (minutos)'}
                        {analyticsTimeFilter === 'today' && 'Hoje (horas)'}
                        {analyticsTimeFilter === 'month' && 'Este Mês (dias)'}
                        {analyticsTimeFilter === 'year' && 'Este Ano (meses)'}
                        {analyticsTimeFilter === '30days' && 'Últimos 30 Dias'}
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                          <XAxis dataKey="date" stroke="#78716c" fontSize={10} tickLine={false} />
                          <YAxis stroke="#78716c" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#2e2a24', color: '#f5f5f4', borderRadius: '12px', fontSize: '12px' }}
                            labelStyle={{ fontWeight: 'bold', color: '#AF4934' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="Visualizações" stroke="#AF4934" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="Conversões" stroke="#3B5EA4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Traffic Origin bar chart */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-display font-medium text-stone-100">Origem do Tráfego</h4>
                      <p className="text-[10px] text-stone-400">Classificação por canal de origem e campanhas</p>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={originChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                          <XAxis dataKey="name" stroke="#78716c" fontSize={10} tickLine={false} />
                          <YAxis stroke="#78716c" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#2e2a24', color: '#f5f5f4', borderRadius: '12px', fontSize: '12px' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                          />
                          <Bar dataKey="value" name="Acessos" fill="#AF4934" radius={[4, 4, 0, 0]}>
                            {originChartData.map((entry, index) => {
                              const colors = ['#AF4934', '#3B5EA4', '#DCCFC1', '#6F5B4E', '#14532d'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Sub Charts: Devices and Age */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Device breakdown */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-display font-medium text-stone-100">Dispositivos de Acesso</h4>
                      <p className="text-[10px] text-stone-400">Distribuição percentual por dispositivo utilizado</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                      <div className="w-44 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {deviceChartData.map((entry, index) => {
                                const colors = ['#AF4934', '#3B5EA4', '#DCCFC1'];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1c1917', borderColor: '#2e2a24', color: '#f5f5f4', borderRadius: '12px', fontSize: '12px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2.5 font-mono text-xs w-full sm:w-auto">
                        {deviceChartData.map((dev, index) => {
                          const colors = ['bg-[#AF4934]', 'bg-[#3B5EA4]', 'bg-[#DCCFC1]'];
                          const icons = [Monitor, Smartphone, TabletIcon];
                          const IconComp = icons[index % icons.length];
                          const pct = totalViews > 0 ? ((dev.value / totalViews) * 100).toFixed(1) : '0.0';
                          return (
                            <div key={dev.name} className="flex items-center justify-between gap-6">
                              <span className="flex items-center gap-2 text-stone-400">
                                <span className={`w-2.5 h-2.5 rounded-full ${colors[index % colors.length]} inline-block shrink-0`} />
                                <IconComp className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                                {dev.name}
                              </span>
                              <span className="font-bold text-stone-200">{pct}% ({dev.value})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Age demographics */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-display font-medium text-stone-100">Faixa Etária do Público</h4>
                      <p className="text-[10px] text-stone-400">Composição demográfica (Foco em Alta Renda e Casais)</p>
                    </div>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageChartData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                          <XAxis type="number" stroke="#78716c" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="#78716c" fontSize={10} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#2e2a24', color: '#f5f5f4', borderRadius: '12px', fontSize: '12px' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                          />
                          <Bar dataKey="value" name="Acessos" fill="#3B5EA4" radius={[0, 4, 4, 0]}>
                            {ageChartData.map((entry, index) => {
                              const colors = ['#6f6b64', '#AF4934', '#3B5EA4', '#AF4934', '#DCCFC1'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Table Rankings and Conversions Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Page Views rankings table */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-display font-medium text-stone-100">Páginas Mais Acessadas</h4>
                      <p className="text-[10px] text-stone-400">Ranking das páginas e caminhos com maior tráfego</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-stone-800 text-stone-500 font-mono text-[10px] uppercase tracking-wider pb-2">
                            <th className="py-2.5 font-semibold">Página / Link</th>
                            <th className="py-2.5 text-right font-semibold">Acessos</th>
                            <th className="py-2.5 text-right font-semibold">Tempo Médio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-900 font-sans text-stone-300">
                          {rankedPages.slice(0, 6).map((pg, i) => (
                            <tr key={pg.id} className="hover:bg-stone-900/30 transition-colors">
                              <td className="py-2.5 font-medium flex items-center gap-2">
                                <span className="text-[10px] font-mono text-stone-500 w-3.5">{i + 1}.</span>
                                <span className="truncate max-w-[180px] sm:max-w-[240px]" title={pg.name}>
                                  {pg.name}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-stone-100">{pg.views}</td>
                              <td className="py-2.5 text-right text-stone-400 font-mono">{pg.avgTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Realtime Live actions events */}
                  <div className="bg-[#181615] border border-stone-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-display font-medium text-stone-100">Eventos de Conversão</h4>
                      <p className="text-[10px] text-stone-400">Métricas de ações de usuários (botões de WhatsApp, Quiz etc.)</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      {activeEvents.map((evt) => {
                        const maxCount = Math.max(...activeEvents.map(e => e.count), 1);
                        const pctProgress = (evt.count / maxCount) * 100;
                        return (
                          <div key={evt.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-stone-300">
                              <span className="font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {evt.label}
                              </span>
                              <span className="font-mono font-bold text-stone-100">{evt.count}</span>
                            </div>
                            
                            {/* Simple elegant modern loading progress bar */}
                            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#3B5EA4] to-[#AF4934] rounded-full transition-all duration-500"
                                style={{ width: `${pctProgress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel SEO */}
            {activeTab === 'seo' && (
              <form onSubmit={handleSaveSeo} className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100">SEO & Contatos Gerais</h3>
                  <p className="text-stone-400 text-xs mt-1">Configure o título da página no navegador, meta tags, palavras-chave e canais de WhatsApp.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 md:col-span-2" id="seo-site-title">
                    <label className={labelClass}>Título do Site (Navegador)</label>
                    <input 
                      type="text" 
                      value={seo.siteTitle} 
                      onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                      placeholder="Ex: Arcadane Viagens | Roteiros de Luxo"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2" id="seo-meta-description">
                    <label className={labelClass}>Meta Descrição (Para Google/Buscas SEO)</label>
                    <textarea 
                      rows={2}
                      value={seo.metaDescription} 
                      onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                      placeholder="..."
                      className={`${inputClass} resize-y`}
                      required
                    />
                  </div>

                  <div className="space-y-1" id="seo-keywords">
                    <label className={labelClass}>Palavras-chave (Tag Keywords)</label>
                    <input 
                      type="text" 
                      value={seo.keywords} 
                      onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1" id="seo-favicon">
                    <label className={labelClass}>URL ou Base64 do Favicon (Ícone de aba)</label>
                    <input 
                      type="text" 
                      value={seo.faviconUrl} 
                      onChange={(e) => setSeo({ ...seo, faviconUrl: e.target.value })}
                      className={inputClass}
                      placeholder="Deixe em branco para usar o padrão"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200">Números de Atendimento WhatsApp</h4>
                  <p className="text-[11px] text-[#AF4934] font-mono leading-relaxed mt-1">Insira somente os números com código do país (DDI) e código de área (DDD). Exemplo: 5581999999999</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1" id="contact-maria">
                      <label className={labelClass}>Contato Maria</label>
                      <input 
                        type="text" 
                        value={seo.contactWhatsAppMaria} 
                        onChange={(e) => setSeo({ ...seo, contactWhatsAppMaria: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1" id="contact-mateus">
                      <label className={labelClass}>Contato Mateus</label>
                      <input 
                        type="text" 
                        value={seo.contactWhatsAppMateus} 
                        onChange={(e) => setSeo({ ...seo, contactWhatsAppMateus: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1" id="contact-mariana">
                      <label className={labelClass}>Contato Mariana</label>
                      <input 
                        type="text" 
                        value={seo.contactWhatsAppMariana} 
                        onChange={(e) => setSeo({ ...seo, contactWhatsAppMariana: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 1. CONFIGURAÇÃO DO POPUP DE INTENÇÃO DE SAÍDA */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200">Configuração do Popup de Intenção de Saída (Exit Intent)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Ativar Popup de Saída?</label>
                      <select
                        value={seo.exitIntentEnabled === false ? 'false' : 'true'}
                        onChange={(e) => setSeo({ ...seo, exitIntentEnabled: e.target.value === 'true' })}
                        className={inputClass}
                      >
                        <option value="true">Sim, Habilitado</option>
                        <option value="false">Não, Desabilitado</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Onde exibir o Popup de Saída?</label>
                      <select
                        value={seo.exitIntentShowOnPages || 'all'}
                        onChange={(e) => setSeo({ ...seo, exitIntentShowOnPages: e.target.value as any })}
                        className={inputClass}
                      >
                        <option value="all">Todas as páginas do site</option>
                        <option value="home_only_or_itineraries">Apenas Início e Customizados</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Título do Popup</label>
                      <input 
                        type="text" 
                        value={seo.exitIntentTitle || ''} 
                        onChange={(e) => setSeo({ ...seo, exitIntentTitle: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Parágrafo do Popup</label>
                      <textarea 
                        rows={3}
                        value={seo.exitIntentText || ''} 
                        onChange={(e) => setSeo({ ...seo, exitIntentText: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Benefícios do Popup (Separados por Ponto e Vírgula ';')</label>
                      <textarea 
                        rows={3}
                        value={seo.exitIntentBenefits || ''} 
                        onChange={(e) => setSeo({ ...seo, exitIntentBenefits: e.target.value })}
                        className={inputClass}
                        placeholder="Benefício 1; Benefício 2; Benefício 3..."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONFIGURAÇÃO DO POPUP PROMOCIONAL POR TEMPO */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200 font-medium">Configuração do Popup Promocional com Atraso (Delay Popup)</h4>
                  <p className="text-stone-450 text-[11px]">Controla uma caixa de alerta de destaque que aparece automaticamente para o usuário após alguns segundos na navegação.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Ativar Popup de Atraso?</label>
                      <select
                        value={seo.announcementPopupEnabled ? 'true' : 'false'}
                        onChange={(e) => setSeo({ ...seo, announcementPopupEnabled: e.target.value === 'true' })}
                        className={inputClass}
                      >
                        <option value="false">Não, Desabilitado</option>
                        <option value="true">Sim, Habilitado</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Tempo de Atraso (em segundos)</label>
                      <input 
                        type="number" 
                        min={1}
                        max={300}
                        value={seo.announcementPopupDelay || 5} 
                        onChange={(e) => setSeo({ ...seo, announcementPopupDelay: parseInt(e.target.value) || 5 })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Onde exibir o Popup Promocional?</label>
                      <select
                        value={seo.announcementPopupShowOnPages || 'home_only_or_itineraries'}
                        onChange={(e) => setSeo({ ...seo, announcementPopupShowOnPages: e.target.value as any })}
                        className={inputClass}
                      >
                        <option value="all">Todas as páginas do site</option>
                        <option value="home_only_or_itineraries">Apenas Início e Customizados</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Título do Popup Promocional</label>
                      <input 
                        type="text" 
                        value={seo.announcementPopupTitle || ''} 
                        onChange={(e) => setSeo({ ...seo, announcementPopupTitle: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Texto Promocional</label>
                      <textarea 
                        rows={2}
                        value={seo.announcementPopupText || ''} 
                        onChange={(e) => setSeo({ ...seo, announcementPopupText: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex md:justify-end border-t border-stone-800 pt-6">
                  <button type="submit" className={btnClass}>
                    <Save className="w-4 h-4" />
                    Salvar Alterações de SEO
                  </button>
                </div>
              </form>
            )}

            {/* Panel Layout, Logo, Menu & Preloader */}
            {activeTab === 'layout' && (
              <form onSubmit={handleSaveLayout} className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100">Layout, Logotipo, Preloader & Menus</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Gerencie o estilo do preloader, faça upload do logotipo PNG, personalize os links dos menus e rodapé do site.
                  </p>
                </div>

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4" id="layout-custom-logo">
                  <h4 className="text-sm font-bold font-display text-amber-500">1. Logotipo Personalizado (PNG)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        Selecione um arquivo de imagem PNG com fundo transparente para substituir o logo oficial do site. O preloader e o cabeçalho serão atualizados em tempo real!
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <label className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md">
                          <Image className="w-3.5 h-3.5" />
                          {logoUploading ? 'Enviando...' : 'Selecionar PNG'}
                          <input 
                            type="file" 
                            accept="image/png" 
                            onChange={handleLogoUpload} 
                            className="hidden" 
                            disabled={logoUploading}
                          />
                        </label>
                        {customLogo && (
                          <button
                            type="button"
                            onClick={handleResetLogo}
                            className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Undo className="w-3.5 h-3.5" />
                            Restaurar Padrão
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-stone-900 border border-stone-850 rounded-2xl h-40">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-stone-500 mb-2 font-bold">Visualização do Logo</p>
                      <img 
                        src={customLogo || "/logo.svg"} 
                        alt="Logo" 
                        className="max-h-24 w-auto object-contain brightness-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold font-display text-amber-500">2. Estilo do Preloader</h4>
                  <div className="space-y-1">
                    <label className={labelClass}>Tipo de Animação do Preloader de Luxo</label>
                    <select
                      value={home.preloaderType || 'modern'}
                      onChange={(e) => setHome({ ...home, preloaderType: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="modern">Carregamento Premium (Fundo Liso com Zoom e Pulsação Elegante)</option>
                      <option value="pulse">Pulsar Elegante (Pulsação contínua e suave do logotipo)</option>
                      <option value="spin">Giro Clássico (Giro orbital ao redor do logotipo)</option>
                      <option value="flip">Efeito Flip (Logotipo girando em 3D de forma intermitente)</option>
                      <option value="zoom">Aproximação Suave (Efeito de aproximação infinito no logotipo)</option>
                    </select>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      Esta animação será executada sempre que um usuário abrir ou recarregar a página inicial.
                    </p>
                  </div>
                </div>

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4" id="layout-menu-labels">
                  <h4 className="text-sm font-bold font-display text-amber-500">3. Menus de Navegação (Rótulos)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Link Início</label>
                      <input 
                        type="text"
                        value={home.menuLabelHome || ''}
                        onChange={(e) => setHome({ ...home, menuLabelHome: e.target.value })}
                        className={inputClass}
                        placeholder="Início"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Link Serviços</label>
                      <input 
                        type="text"
                        value={home.menuLabelServices || ''}
                        onChange={(e) => setHome({ ...home, menuLabelServices: e.target.value })}
                        className={inputClass}
                        placeholder="Serviços"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Link Pacotes</label>
                      <input 
                        type="text"
                        value={home.menuLabelPackages || ''}
                        onChange={(e) => setHome({ ...home, menuLabelPackages: e.target.value })}
                        className={inputClass}
                        placeholder="Pacotes"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Link Quem Somos</label>
                      <input 
                        type="text"
                        value={home.menuLabelAboutUs || ''}
                        onChange={(e) => setHome({ ...home, menuLabelAboutUs: e.target.value })}
                        className={inputClass}
                        placeholder="Quem Somos"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Link Viagem Customizada</label>
                      <input 
                        type="text"
                        value={home.menuLabelCustomTrip || ''}
                        onChange={(e) => setHome({ ...home, menuLabelCustomTrip: e.target.value })}
                        className={inputClass}
                        placeholder="Viagem Personalizada"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Link Blog</label>
                      <input 
                        type="text"
                        value={home.menuLabelBlog || ''}
                        onChange={(e) => setHome({ ...home, menuLabelBlog: e.target.value })}
                        className={inputClass}
                        placeholder="Blog"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <label className={labelClass}>Link Contato</label>
                      <input 
                        type="text"
                        value={home.menuLabelContactUs || ''}
                        onChange={(e) => setHome({ ...home, menuLabelContactUs: e.target.value })}
                        className={inputClass}
                        placeholder="Contato"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4" id="layout-submenus">
                  <h4 className="text-sm font-bold font-display text-amber-500">4. Submenus de Cabeçalho (Dropdowns)</h4>
                  <p className="text-xs text-stone-400 font-sans leading-relaxed">
                    Personalize os sublinks que aparecem ao passar o mouse ou clicar nos itens "Pacotes" e "Viagem Personalizada". Use o formato: <code className="text-amber-400">Nome do Link | id_da_pagina</code> separados por ponto e vírgula (<code className="text-amber-400">;</code>).
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Sublinks de "Pacotes"</label>
                      <textarea
                        rows={2}
                        value={home.submenuPackagesLinks || ''}
                        onChange={(e) => setHome({ ...home, submenuPackagesLinks: e.target.value })}
                        placeholder="Maldivas | packages; Europa | packages; Ásia de Luxo | packages"
                        className={inputClass}
                      />
                      <p className="text-[10px] text-stone-500 font-mono">Páginas disponíveis: <code className="text-stone-300">home</code>, <code className="text-stone-300">services</code>, <code className="text-stone-300">packages</code>, <code className="text-stone-300">about_us</code>, <code className="text-stone-300">custom_trip</code>, <code className="text-stone-300">blog</code>, <code className="text-stone-300">contact</code>.</p>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Sublinks de "Viagem Personalizada"</label>
                      <textarea
                        rows={2}
                        value={home.submenuCustomTripLinks || ''}
                        onChange={(e) => setHome({ ...home, submenuCustomTripLinks: e.target.value })}
                        placeholder="Lua de Mel VIP | custom_trip; Roteiro de Trem | custom_trip"
                        className={inputClass}
                      />
                    </div>

                    {/* Assistente de Links do Menu */}
                    <div className="bg-[#1c1917]/60 border border-[#AF4934]/30 rounded-xl p-4 mt-4 space-y-4">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Sparkles className="w-4 h-4" />
                        <h5 className="text-xs font-bold uppercase font-display tracking-wider">Assistente Construtor de Links</h5>
                      </div>
                      <p className="text-[11px] text-stone-400">Escolha uma página criada ou link externo para gerar o código do submenu automaticamente e evitar erros de digitação.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-stone-400 uppercase font-bold font-mono">1. Nome do Link (Rótulo)</label>
                          <input 
                            type="text" 
                            id="link-helper-label"
                            placeholder="Ex: Maldivas VIP"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-stone-400 uppercase font-bold font-mono">2. Destino do Link</label>
                          <select 
                            id="link-helper-target"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
                            onChange={(e) => {
                              const input = document.getElementById('link-helper-external-url') as HTMLInputElement;
                              if (input) {
                                if (e.target.value === 'external') {
                                  input.style.display = 'block';
                                } else {
                                  input.style.display = 'none';
                                }
                              }
                            }}
                          >
                            <optgroup label="Páginas Principais">
                              <option value="home">Início (home)</option>
                              <option value="services">Serviços (services)</option>
                              <option value="packages">Pacotes (packages)</option>
                              <option value="about_us">Quem Somos (about_us)</option>
                              <option value="custom_trip">Viagem Personalizada (custom_trip)</option>
                              <option value="blog">Blog (blog)</option>
                              <option value="contact">Contato (contact)</option>
                              <option value="quiz">Quiz (quiz)</option>
                            </optgroup>
                            {customPages.length > 0 && (
                              <optgroup label="Suas Páginas Customizadas">
                                {customPages.map(cp => (
                                  <option key={cp.id} value={cp.id}>{cp.title} ({cp.id})</option>
                                ))}
                              </optgroup>
                            )}
                            <option value="external">-- Link Externo Personalizado --</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-stone-400 uppercase font-bold font-mono">Ação</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const labelInput = document.getElementById('link-helper-label') as HTMLInputElement;
                                const targetSelect = document.getElementById('link-helper-target') as HTMLSelectElement;
                                const urlInput = document.getElementById('link-helper-external-url') as HTMLInputElement;
                                
                                const label = labelInput?.value.trim();
                                if (!label) {
                                  alert('Por favor, digite um Nome do Link.');
                                  return;
                                }

                                let target = targetSelect?.value;
                                if (target === 'external') {
                                  target = urlInput?.value.trim();
                                  if (!target) {
                                    alert('Por favor, digite a URL externa.');
                                    return;
                                  }
                                }

                                const pairStr = `${label} | ${target}`;
                                const current = home.submenuPackagesLinks ? home.submenuPackagesLinks.trim() : '';
                                const updated = current ? `${current}; ${pairStr}` : pairStr;
                                setHome({ ...home, submenuPackagesLinks: updated });
                                showFeedback('Link gerado e adicionado ao Submenu Pacotes!');
                                labelInput.value = '';
                                if (urlInput) urlInput.value = '';
                              }}
                              className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase rounded-lg py-2 transition-colors cursor-pointer"
                            >
                              + Pacotes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const labelInput = document.getElementById('link-helper-label') as HTMLInputElement;
                                const targetSelect = document.getElementById('link-helper-target') as HTMLSelectElement;
                                const urlInput = document.getElementById('link-helper-external-url') as HTMLInputElement;
                                
                                const label = labelInput?.value.trim();
                                if (!label) {
                                  alert('Por favor, digite um Nome do Link.');
                                  return;
                                }

                                let target = targetSelect?.value;
                                if (target === 'external') {
                                  target = urlInput?.value.trim();
                                  if (!target) {
                                    alert('Por favor, digite a URL externa.');
                                    return;
                                  }
                                }

                                const pairStr = `${label} | ${target}`;
                                const current = home.submenuCustomTripLinks ? home.submenuCustomTripLinks.trim() : '';
                                const updated = current ? `${current}; ${pairStr}` : pairStr;
                                setHome({ ...home, submenuCustomTripLinks: updated });
                                showFeedback('Link gerado e adicionado ao Submenu Viagem!');
                                labelInput.value = '';
                                if (urlInput) urlInput.value = '';
                              }}
                              className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase rounded-lg py-2 transition-colors cursor-pointer"
                            >
                              + Viagem
                            </button>
                          </div>
                        </div>
                      </div>

                      <input 
                        type="text" 
                        id="link-helper-external-url"
                        placeholder="Insira a URL externa completa (ex: https://site.com/link)"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-xs text-stone-100 focus:outline-none"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold font-display text-amber-500">5. Personalização do Rodapé</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Título da Coluna 1 do Rodapé</label>
                      <input 
                        type="text"
                        value={home.footerCol1Title || ''}
                        onChange={(e) => setHome({ ...home, footerCol1Title: e.target.value })}
                        className={inputClass}
                        placeholder="Destinos"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Título da Coluna 2 do Rodapé</label>
                      <input 
                        type="text"
                        value={home.footerCol2Title || ''}
                        onChange={(e) => setHome({ ...home, footerCol2Title: e.target.value })}
                        className={inputClass}
                        placeholder="Descubra-se no Mundo"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>Links da Coluna 1 do Rodapé (Formato: Nome|pagina;Nome|pagina)</label>
                      <textarea
                        rows={2}
                        value={home.footerCol1Links || ''}
                        onChange={(e) => setHome({ ...home, footerCol1Links: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>Links da Coluna 2 do Rodapé (Formato: Nome|pagina;Nome|pagina)</label>
                      <textarea
                        rows={2}
                        value={home.footerCol2Links || ''}
                        onChange={(e) => setHome({ ...home, footerCol2Links: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>Texto de Copyright & CNPJ do Rodapé</label>
                      <input 
                        type="text"
                        value={home.footerCopyright || ''}
                        onChange={(e) => setHome({ ...home, footerCopyright: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex md:justify-end border-t border-stone-800 pt-6">
                  <button type="submit" className={btnClass}>
                    <Save className="w-4 h-4" />
                    Salvar Alterações de Layout
                  </button>
                </div>
              </form>
            )}

            {/* Panel Home & About Text editing */}
            {activeTab === 'home' && (
              <form onSubmit={handleSaveHome} className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#AF4934]" />
                    Página Inicial: Edição Bloco por Bloco
                  </h3>
                  <p className="text-stone-400 text-xs mt-1">Todos os elementos, textos, imagens, selos, blocos e estruturas da Página Inicial em abas e sessões organizadas e 100% editáveis.</p>
                </div>

                {/* BLOCK 1: HERO BANNER & ROTATING PHRASES */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Film className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 1: Hero Banner, Vídeo & Textos Iniciais</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Título Principal (Suporta HTML para itálico)</label>
                      <input 
                        type="text" 
                        value={home.heroTitle} 
                        onChange={(e) => setHome({ ...home, heroTitle: e.target.value })}
                        className={inputClass}
                        required
                      />
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">Dica: Use &lt;span class="font-serif italic text-brand-secondary"&gt;suas palavras&lt;/span&gt; para o efeito ouro.</p>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Subtítulo do Hero</label>
                      <textarea 
                        rows={2}
                        value={home.heroSubtitle} 
                        onChange={(e) => setHome({ ...home, heroSubtitle: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Frases Rotativas do Efeito Digitador (Separadas por vírgulas)</label>
                      <textarea 
                        rows={3}
                        value={typewriterEndings} 
                        onChange={(e) => setTypewriterEndings(e.target.value)}
                        className={`${inputClass} font-mono text-xs`}
                        placeholder="Exemplo: o mundo., novos olhares., novas memórias."
                        required
                      />
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">Insira as frases que aparecem digitadas logo após a palavra "Descobrir". Separe cada uma por vírgula.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Tipo de Buscador Integrado</label>
                        <select
                          value={home.widgetType || 'whatsapp'}
                          onChange={(e) => setHome({ ...home, widgetType: e.target.value as 'befly' | 'whatsapp' })}
                          className={inputClass}
                        >
                          <option value="whatsapp">Buscador Inteligente (WhatsApp - Recomendado! 🎉)</option>
                          <option value="befly">Buscador Oficial BeFly / OnerTravel (Requer domínio)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Posição do Buscador (Banner Inicial)</label>
                        <select
                          value={home.widgetPosition || 'middle'}
                          onChange={(e) => setHome({ ...home, widgetPosition: e.target.value as any })}
                          className={inputClass}
                        >
                          <option value="middle">Meio / Centro (Abaixo do Texto)</option>
                          <option value="top">Em Cima (Acima do Texto)</option>
                          <option value="left">Esquerda (Divisão Lateral)</option>
                          <option value="right">Direita (Divisão Lateral)</option>
                          <option value="bottom">Em Baixo (Fim do Banner)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Link do Vídeo MP4 de Fundo</label>
                        <input 
                          type="url" 
                          value={home.heroVideoUrl} 
                          onChange={(e) => setHome({ ...home, heroVideoUrl: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOCK 2: BENTO GRID */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Compass className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 2: Abas Informativas Interativas (Bento Grid Destinations)</span>
                  </div>
                  <p className="text-xs text-stone-400">Edite as abas interativas do meio da página inicial. Cada aba tem título, cabeçalho de artigo, imagem de fundo e múltiplos parágrafos.</p>
                  
                  <div className="space-y-5">
                    {bentoDestinations.map((dest, idx) => (
                      <div key={dest.id} className="bg-stone-950/60 border border-stone-850 rounded-xl p-4 space-y-3">
                        <div className="text-xs font-mono font-bold text-[#AF4934] uppercase flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#AF4934] animate-pulse" />
                          Aba #{dest.id} - {dest.title}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className={labelClass}>Título do Botão da Aba</label>
                            <input
                              type="text"
                              value={dest.title}
                              onChange={(e) => {
                                const updated = [...bentoDestinations];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setBentoDestinations(updated);
                              }}
                              className={inputClass}
                              required
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className={labelClass}>Título Grande do Artigo</label>
                            <input
                              type="text"
                              value={dest.largeTitle}
                              onChange={(e) => {
                                const updated = [...bentoDestinations];
                                updated[idx] = { ...updated[idx], largeTitle: e.target.value };
                                setBentoDestinations(updated);
                              }}
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className={labelClass}>Descrição Curta de Chamada</label>
                          <input
                            type="text"
                            value={dest.shortDesc}
                            onChange={(e) => {
                              const updated = [...bentoDestinations];
                              updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                              setBentoDestinations(updated);
                            }}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={labelClass}>Parágrafos do Artigo (Um por linha)</label>
                          <textarea
                            rows={5}
                            value={dest.paragraphs ? dest.paragraphs.join('\n') : ''}
                            onChange={(e) => {
                              const updated = [...bentoDestinations];
                              updated[idx] = { ...updated[idx], paragraphs: e.target.value.split('\n') };
                              setBentoDestinations(updated);
                            }}
                            className={`${inputClass} font-sans text-xs leading-relaxed`}
                            placeholder="Escreva os parágrafos do texto do artigo. Pressione enter para criar um novo parágrafo..."
                            required
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-900">
                          <label className={labelClass}>Imagem de Fundo da Aba</label>
                          <div className="flex items-center gap-4">
                            <img src={dest.image} className="w-16 h-12 object-cover rounded-md border border-stone-800" />
                            <div className="flex-1 space-y-1">
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-[#AF4934]/15 hover:bg-[#AF4934]/30 text-[#AF4934] px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border border-[#AF4934]/30">
                                <Image className="w-3.5 h-3.5" />
                                Carregar Imagem da Aba...
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      compressAndSetImage(file, (base64) => {
                                        const updated = [...bentoDestinations];
                                        updated[idx] = { ...updated[idx], image: base64 };
                                        setBentoDestinations(updated);
                                        showFeedback(`Imagem da aba "${dest.title}" atualizada!`);
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <p className="text-[9px] text-stone-500">A imagem de alta definição será compactada automaticamente para melhor performance.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BLOCK 3: TRAJECTORY & PURPOSE */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <FileText className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 3: Nossa Trajetória & Propósito (Quem Somos)</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Título Principal Superior</label>
                        <input 
                          type="text" 
                          value={home.aboutUsHeadline} 
                          onChange={(e) => setHome({ ...home, aboutUsHeadline: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Subtítulo Institucional</label>
                        <input 
                          type="text" 
                          value={home.aboutUsSubheadline} 
                          onChange={(e) => setHome({ ...home, aboutUsSubheadline: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Texto Descritivo Principal (Use parágrafos)</label>
                      <textarea 
                        rows={6}
                        value={home.aboutUsText} 
                        onChange={(e) => setHome({ ...home, aboutUsText: e.target.value })}
                        className={`${inputClass} leading-relaxed`}
                        required
                      />
                    </div>

                    <div className="border-t border-stone-850 pt-4">
                      <label className={labelClass}>Foto Ilustrativa da Trajetória</label>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-2">
                        <div className="md:col-span-3 max-w-[140px] aspect-video sm:aspect-square rounded-xl overflow-hidden border border-stone-800 bg-stone-950 relative">
                          <img 
                            src={trajectoryPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                            alt="Preview Foto Trajetória"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/75 text-[8px] font-mono text-center text-[#AF4934] font-bold">ATUAL</div>
                        </div>

                        <div className="md:col-span-9 space-y-2">
                          <p className="text-xs text-stone-400 font-light">
                            Faça o upload da imagem HD horizontal para ilustrar a história da Arcadane na página inicial.
                          </p>
                          <label className="cursor-pointer inline-flex items-center gap-2 bg-[#AF4934]/15 hover:bg-[#AF4934]/30 text-[#AF4934] px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#AF4934]/30 transition-all">
                            <Image className="w-4 h-4" />
                            Upload de Nova Imagem...
                            <input 
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressAndSetImage(file, (base64) => {
                                    localStorage.setItem('arcadane_trajectory_photo', base64);
                                    setTrajectoryPhoto(base64);
                                    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                    showFeedback('Foto da trajetória salva com sucesso!');
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOCK 4: CUSTOM SEALS & CERTIFICATIONS */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Award className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 4: Medalhão e Selo de Credibilidade de Ouro</span>
                  </div>
                  <p className="text-xs text-stone-400">Edite todos os textos do selo de ouro que flutua ao lado do bloco da trajetória.</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Texto Circular Superior</label>
                        <input
                          type="text"
                          value={sealTopText}
                          onChange={(e) => setSealTopText(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Texto Circular Inferior</label>
                        <input
                          type="text"
                          value={sealBottomText}
                          onChange={(e) => setSealBottomText(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Número Central de Destaque</label>
                        <input
                          type="text"
                          value={sealNumber}
                          onChange={(e) => setSealNumber(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Etiqueta Central Linha 1</label>
                        <input
                          type="text"
                          value={sealLabel1}
                          onChange={(e) => setSealLabel1(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Etiqueta Central Linha 2</label>
                        <input
                          type="text"
                          value={sealLabel2}
                          onChange={(e) => setSealLabel2(e.target.value)}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOCK 5: TRAVEL QUIZ PROMO BANNER */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Sparkles className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 5: Banner Promocional do Quiz de Viagens Interativo</span>
                  </div>
                  <p className="text-xs text-stone-400">Edite as chamadas do banner do Quiz na Página Inicial.</p>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Etiqueta Pequena do Banner (Badge)</label>
                      <input
                        type="text"
                        value={quizBannerBadge}
                        onChange={(e) => setQuizBannerBadge(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Título Principal do Banner</label>
                      <input
                        type="text"
                        value={quizBannerTitle}
                        onChange={(e) => setQuizBannerTitle(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Descrição do Banner</label>
                      <textarea
                        rows={3}
                        value={quizBannerDesc}
                        onChange={(e) => setQuizBannerDesc(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* BLOCK 6: TEAM FOUNDERS ABOUT PHOTO */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Users className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 6: Foto dos Sócios-Fundadores (Sobre Nós)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 max-w-[140px] aspect-square rounded-xl overflow-hidden border border-stone-800 bg-stone-950 relative">
                      <img 
                        src={foundersPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                        alt="Preview Foto Fundadores"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/75 text-[8px] font-mono text-center text-[#AF4934] font-bold">ATUAL</div>
                    </div>

                    <div className="md:col-span-9 space-y-2">
                      <p className="text-xs text-stone-400 font-light">
                        Atualize a foto oficial de Maria, Mateus & Mariana que aparece na tela institucional "Quem Somos".
                      </p>
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-[#AF4934]/15 hover:bg-[#AF4934]/30 text-[#AF4934] px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#AF4934]/30 transition-all">
                        <Image className="w-4 h-4" />
                        Carregar Nova Imagem...
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, (base64) => {
                                localStorage.setItem('arcadane_founders_photo', base64);
                                setFoundersPhoto(base64);
                                window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                showFeedback('Foto oficial dos fundadores salva com sucesso!');
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* BLOCK 7: CUSTOM TRIP CTA BANNER */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Briefcase className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 7: Viagem Personalizada (Banner CTA de Rodapé)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Título do Banner</label>
                      <input 
                        type="text" 
                        value={home.customTripTitle || ''} 
                        onChange={(e) => setHome({ ...home, customTripTitle: e.target.value })}
                        className={inputClass}
                        placeholder="Viagens\npersonalizadas:"
                      />
                      <p className="text-[9px] text-stone-500 font-mono">Use \n para quebrar a linha</p>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Subtítulo do Banner</label>
                      <input 
                        type="text" 
                        value={home.customTripSubtitle || ''} 
                        onChange={(e) => setHome({ ...home, customTripSubtitle: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Texto do Botão de Ação</label>
                      <input 
                        type="text" 
                        value={home.customTripButtonText || ''} 
                        onChange={(e) => setHome({ ...home, customTripButtonText: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* BLOCK 8: FOOTER TECHNICAL INFO */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-stone-200 font-display font-medium border-b border-stone-800 pb-2">
                    <Globe className="w-5 h-5 text-[#AF4934]" />
                    <span>Bloco 8: Rodapé e Informações Institucionais do Footer</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Slogan Institucional do Rodapé</label>
                      <input 
                        type="text" 
                        value={home.footerText || ''} 
                        onChange={(e) => setHome({ ...home, footerText: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Endereço Comercial</label>
                      <input 
                        type="text" 
                        value={home.footerAddress || ''} 
                        onChange={(e) => setHome({ ...home, footerAddress: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>E-mail Oficial</label>
                      <input 
                        type="email" 
                        value={home.footerEmail || ''} 
                        onChange={(e) => setHome({ ...home, footerEmail: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex md:justify-end border-t border-stone-800 pt-6">
                  <button type="submit" className={btnClass}>
                    <Save className="w-4 h-4" />
                    Salvar Informações da Home
                  </button>
                </div>
              </form>
            )}

            {/* Panel Services editing */}
            {activeTab === 'services' && (
              <form onSubmit={handleSaveServices} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-medium text-lg text-stone-100">Nossos 12 Serviços Premium</h3>
                    <p className="text-stone-400 text-xs mt-1">Altere o título de cada um dos botões ou mídias para representar as capacidades exatas.</p>
                  </div>
                  <button type="submit" className={btnClass}>
                    <Save className="w-3.5 h-3.5" />
                    Salvar Serviços
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="services-grid-list">
                  {services.map((svc, idx) => (
                    <div key={svc.id} className="bg-[#181615]/50 border border-stone-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3 border-b border-stone-800 pb-2">
                        <span className="w-6 h-6 rounded-md bg-[#AF4934]/15 border border-[#AF4934]/20 text-[#AF4934] text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono tracking-wider font-bold text-stone-450 uppercase flex items-center gap-1.5">
                          ID: {svc.id || idx} • Ícone: <span className="text-[#AF4934]">{svc.iconName}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-stone-500 block">Título do Serviço</label>
                          <input 
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[idx].title = e.target.value;
                              setServices(updated);
                            }}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-stone-500 block">Descrição do Serviço</label>
                          <textarea 
                            rows={2}
                            value={svc.description}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[idx].description = e.target.value;
                              setServices(updated);
                            }}
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex md:justify-end border-t border-stone-800 pt-6">
                  <button type="submit" className={btnClass}>
                    <Save className="w-4 h-4" />
                    Salvar Todos os Serviços
                  </button>
                </div>
              </form>
            )}

            {/* Panel Tour Packages Promos CRUD */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                
                {/* Header view toggle */}
                {!editingPackage ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Catálogo Geral de Pacotes</h3>
                        <p className="text-stone-400 text-xs mt-1">Crie, edite ou exclua pacotes turísticos mostrados no catálogo principal.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setEditingPackage({
                            id: '',
                            title: '',
                            category: 'exotico',
                            description: '',
                            price: 'Sob Consulta',
                            duration: '10 Dias',
                            imageWord: 'bali',
                            highlights: ['', ''],
                            image: ''
                          });
                          setIsCreatingPackage(true);
                        }}
                        className={btnClass}
                      >
                        <Plus className="w-4 h-4" />
                        Novo Pacote
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-[#181615]/50 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 border-b border-stone-800/60 pb-2">
                              <span className="text-[8px] tracking-widest font-mono uppercase bg-[#AF4934]/15 text-[#AF4934] px-2.5 py-1 rounded-md font-bold">
                                {pkg.category === 'exotico' ? 'Exótico' : pkg.category === 'nacional' ? 'Nacional' : pkg.category === 'cruzeiro' ? 'Cruzeiro' : 'Estados Unidos'}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono tracking-tight">{pkg.duration}</span>
                            </div>

                            <div className="text-left">
                              <h4 className="font-display font-bold text-stone-200 text-sm leading-tight">{pkg.title}</h4>
                              <p className="text-stone-400 text-xs line-clamp-2 mt-1 leading-relaxed font-light">{pkg.description}</p>
                              <p className="text-[10px] text-stone-500 font-mono mt-1.5 font-bold">Preço original: <span className="text-[#AF4934]">{pkg.price}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 border-t border-stone-850 pt-3 mt-4 justify-end">
                            <button
                              onClick={() => {
                                setEditingPackage({ ...pkg });
                                setIsCreatingPackage(false);
                              }}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-[#AF4934]/10 hover:bg-[#AF4934]/20 text-[#AF4934] border border-[#AF4934]/15 hover:border-[#AF4934]/30 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/10 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Apagar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Edit Package Interface
                  <form onSubmit={handleSavePackageForm} className="space-y-6">
                    <div>
                      <h3 className="font-display font-medium text-lg text-stone-100 font-bold">
                        {isCreatingPackage ? 'Adicionar Novo Roteiro' : 'Editar Informações do Roteiro'}
                      </h3>
                      <p className="text-stone-400 text-xs mt-1">Preencha os campos abaixo para atualizar as informações exibidas no catálogo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Título do Roteiro Comercial</label>
                        <input 
                          type="text" 
                          value={editingPackage.title} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: Grécia Clássica & Ilhas Místicas"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Categoria do Passeio</label>
                        <select 
                          value={editingPackage.category} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value as any })}
                          className={`${inputClass} bg-stone-900`}
                          required
                        >
                          <option value="exotico">Destinos Exóticos (Internacional)</option>
                          <option value="nacional">Destino Nacional (Brasil)</option>
                          <option value="cruzeiro">Cruzeiros Marítimos</option>
                          <option value="eua">Estados Unidos (EUA)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Duração do Passeio (Dias)</label>
                        <input 
                          type="text" 
                          value={editingPackage.duration} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: 10 Dias"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Valor Comercial (Preço exibido)</label>
                        <input 
                          type="text" 
                          value={editingPackage.price} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: Sob Consulta ou R$ 12.500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Palavra-chave da Imagem (Ícone de Backup)</label>
                        <input 
                          type="text" 
                          value={editingPackage.imageWord || ''} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, imageWord: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: bali, safari, gramado, cruzeiro"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className={labelClass}>Foto de Capa Personalizada (URL da Imagem ou Upload)</label>
                          <span className="text-[10px] text-stone-500 font-mono tracking-tight">Deixe vazio para usar a palavra-chave acima</span>
                        </div>
                        <div className="flex gap-4 items-start">
                          <input 
                            type="text" 
                            value={editingPackage.image || ''} 
                            onChange={(e) => setEditingPackage({ ...editingPackage, image: e.target.value })}
                            className={inputClass}
                            placeholder="https://images.unsplash.com/..."
                          />
                          {editingPackage.image && (
                            <img 
                              src={editingPackage.image} 
                              alt="Package Preview" 
                              className="w-16 h-12 rounded-lg object-cover border border-stone-805 bg-stone-950 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div className="pt-1 flex items-center gap-3">
                          <label 
                            htmlFor="admin-uploader-package-image"
                            className="px-4 py-2 border border-dashed border-stone-700 hover:border-[#AF4934]/60 bg-[#1c1917]/20 rounded-xl text-xs font-mono text-stone-300 font-bold hover:text-white cursor-pointer transition-colors inline-block"
                          >
                            Upload de Foto...
                          </label>
                          <input 
                            type="file" 
                            id="admin-uploader-package-image" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressAndSetImage(file, (base64) => {
                                  setEditingPackage({ ...editingPackage, image: base64 });
                                  showFeedback('Imagem de capa do pacote carregada com sucesso!', 'success');
                                });
                              }
                            }}
                          />
                          <p className="text-[10px] text-stone-500 font-mono font-light">Selecione uma foto para converter e comprimir automaticamente.</p>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Descrição Geral do Roteiro</label>
                        <textarea 
                          rows={3}
                          value={editingPackage.description} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                          className={inputClass}
                          placeholder="Explique os diferenciais..."
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className={labelClass}>Destaques / Itens Inclusos (Insira 1 por linha)</label>
                        <textarea 
                          rows={4}
                          value={editingPackage.highlights.join('\n')} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, highlights: e.target.value.split('\n') })}
                          className={`${inputClass} font-mono`}
                          placeholder="Item 1&#10;Item 2&#10;Item 3"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end border-t border-stone-850 pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPackage(null);
                          setIsCreatingPackage(false);
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[10px] hover:text-white transition-colors tracking-wider px-4 py-2.5 rounded-lg cursor-pointer inline-flex items-center gap-1"
                      >
                        <Undo className="w-4 h-4" />
                        Cancelar
                      </button>
                      
                      <button type="submit" className={btnClass}>
                        <Save className="w-4 h-4" />
                        Confirmar e Salvar
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* Panel Tour Packages Flight Combo Promos CRUD */}
            {activeTab === 'promos' && (
              <div className="space-y-6">
                
                {/* Header view toggle */}
                {!editingPromo ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-bold text-lg text-stone-100 uppercase tracking-wide">Ofertas Relâmpago (Voos + Hotel)</h3>
                        <p className="text-stone-400 text-xs mt-1">Crie, edite ou remova as ofertas relâmpago saindo de aeroportos regionais (Chapecó, Floripa, Curitiba).</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setEditingPromo({
                            id: '',
                            title: '',
                            route: '',
                            origin: 'XAP',
                            destination: '',
                            tag: 'Oferta Especial',
                            badge: 'Novo',
                            image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600',
                            link: '',
                            description: '',
                            highlights: ['Bilhete aéreo de ida e volta incluso', 'Hospedagem selecionada incluída', 'Suporte VIP Arcadane'],
                            waMessage: 'Olá Arcadane! Vi o pacote promocional no site de vocês.',
                            price: '1.990'
                          });
                          setIsCreatingPromo(true);
                        }}
                        className={btnClass}
                      >
                        <Plus className="w-4 h-4" />
                        Nova Oferta
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {promoPackages.map((promo) => (
                        <div key={promo.id} className="bg-[#181615]/50 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 border-b border-stone-800/60 pb-2">
                              <span className="text-[8px] tracking-widest font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold">
                                {promo.tag}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono tracking-tight font-bold">{promo.route}</span>
                            </div>

                            <div className="text-left flex gap-3">
                              <img 
                                src={promo.image} 
                                alt={promo.title} 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const originalPromo = DEFAULT_PROMO_PACKAGES.find(def => def.id === promo.id);
                                  const originalImage = originalPromo?.image || promo.image;
                                  if (originalImage && target.src !== originalImage) {
                                    target.src = originalImage;
                                  }
                                }}
                                className="w-16 h-16 rounded-xl object-cover border border-stone-800 shrink-0"
                              />
                              <div>
                                <h4 className="font-display font-bold text-stone-200 text-sm leading-tight">{promo.title}</h4>
                                <p className="text-stone-400 text-xs line-clamp-2 mt-1 leading-relaxed font-light">{promo.description}</p>
                                <p className="text-[10px] text-stone-500 font-mono mt-1.5 font-bold">Consumo/Preço: <span className="text-[#AF4934]">R$ {promo.price}</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 border-t border-stone-850 pt-3 mt-4 justify-end">
                            <button
                              onClick={() => {
                                setEditingPromo({ ...promo });
                                setIsCreatingPromo(false);
                              }}
                              className="px-3 py-1.5 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-150 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="px-3 py-1.5 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-150 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Edit or Create form view
                  <form onSubmit={handleSavePromoForm} className="space-y-6">
                    <div className="border-b border-stone-850 pb-4">
                      <h3 className="font-display font-bold text-lg text-stone-100">
                        {isCreatingPromo ? 'Criar Novo Pacote Relâmpago' : `Editando: ${editingPromo.title}`}
                      </h3>
                      <p className="text-stone-400 text-xs mt-1">Insira os dados da oferta promocional abaixo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className={labelClass}>Título da Promoção (Ex: Porto de Galinhas)</label>
                        <input 
                          type="text" 
                          value={editingPromo.title} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                          className={inputClass}
                          placeholder="Porto de Galinhas"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Rota (Ex: Porto de Galinhas ⇄ Chapecó)</label>
                        <input 
                          type="text" 
                          value={editingPromo.route} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, route: e.target.value })}
                          className={inputClass}
                          placeholder="Porto de Galinhas ⇄ Chapecó"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Sigla Origem (Ex: XAP, FLN, CWB)</label>
                        <input 
                          type="text" 
                          value={editingPromo.origin} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, origin: e.target.value })}
                          className={inputClass}
                          maxLength={3}
                          placeholder="XAP"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Sigla Destino (Ex: REC, IOS, SSA)</label>
                        <input 
                          type="text" 
                          value={editingPromo.destination} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, destination: e.target.value })}
                          className={inputClass}
                          maxLength={3}
                          placeholder="REC"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Etiqueta de Destaque (Ex: Oferta Especial, All-Inclusive)</label>
                        <input 
                          type="text" 
                          value={editingPromo.tag} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, tag: e.target.value })}
                          className={inputClass}
                          placeholder="Resort All-Inclusive"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Preço por pessoa (Apenas número, Ex: R$ 2.490)</label>
                        <input 
                          type="text" 
                          value={editingPromo.price} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, price: e.target.value })}
                          className={inputClass}
                          placeholder="2.490"
                          required
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Link de Compra / Orçamento Online (Infotravel)</label>
                        <input 
                          type="url" 
                          value={editingPromo.link} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, link: e.target.value })}
                          className={inputClass}
                          placeholder="https://client.infotravel.com.br/link?token..."
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className={labelClass}>Foto Ilustrativa (Foto de Destaque)</label>
                          <span className="text-[10px] text-stone-500 font-mono tracking-tight">Vincule link externo ou faça upload</span>
                        </div>
                        <div className="flex gap-4 items-start">
                          <input 
                            type="text" 
                            value={editingPromo.image} 
                            onChange={(e) => setEditingPromo({ ...editingPromo, image: e.target.value })}
                            className={inputClass}
                            placeholder="https://images.unsplash.com/..."
                            required
                          />
                          {editingPromo.image && (
                            <img 
                              src={editingPromo.image} 
                              alt="Form Preview" 
                              className="w-16 h-12 rounded-lg object-cover border border-stone-805 bg-stone-950 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div className="pt-1 flex items-center gap-3">
                          <label 
                            htmlFor="admin-uploader-promo-image"
                            className="px-4 py-2 border border-dashed border-stone-700 hover:border-[#AF4934]/60 bg-[#1c1917]/20 rounded-xl text-xs font-mono text-stone-300 font-bold hover:text-white cursor-pointer transition-colors inline-block"
                          >
                            Upload de JPG/PNG...
                          </label>
                          <input 
                            type="file" 
                            id="admin-uploader-promo-image" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressAndSetImage(file, (base64) => {
                                  setEditingPromo({ ...editingPromo, image: base64 });
                                  showFeedback('Imagem de capa da promoção carregada!', 'success');
                                });
                              }
                            }}
                          />
                          <p className="text-[10px] text-stone-500 font-mono">Uploader premium com compressão automática.</p>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Descrição da Promoção</label>
                        <textarea 
                          rows={3}
                          value={editingPromo.description} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                          className={inputClass}
                          placeholder="Descreva as maravilhas que esperam o cliente..."
                          required
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Mensagem do WhatsApp de Contato Direto</label>
                        <textarea 
                          rows={2}
                          value={editingPromo.waMessage} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, waMessage: e.target.value })}
                          className={inputClass}
                          placeholder="Oi Arcadane! Vi a promoção de Ilhéus saindo de Chapecó..."
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className={labelClass}>Destaques Rápidos (1 por linha)</label>
                        <textarea 
                          rows={4}
                          value={editingPromo.highlights.join('\n')} 
                          onChange={(e) => setEditingPromo({ ...editingPromo, highlights: e.target.value.split('\n') })}
                          className={`${inputClass} font-mono`}
                          placeholder="Linha 1&#10;Linha 2&#10;Linha 3"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end border-t border-stone-850 pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPromo(null);
                          setIsCreatingPromo(false);
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[10px] hover:text-white transition-colors tracking-wider px-4 py-2.5 rounded-lg cursor-pointer inline-flex items-center gap-1"
                      >
                        <Undo className="w-4 h-4" />
                        Cancelar
                      </button>
                      
                      <button type="submit" className={btnClass}>
                        <Save className="w-4 h-4" />
                        Confirmar e Salvar Promoção
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* Panel Blog posts CRUD */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                
                {!editingPost ? (
                  // List posts view
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Artigos Publicados no Blog</h3>
                        <p className="text-stone-400 text-xs mt-1">Crie posts interativos de dicas de viagens, guias, ou testes para engajar os clientes.</p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingPost({
                            id: '',
                            title: '',
                            excerpt: '',
                            content: '',
                            date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
                            readTime: '5 min de leitura',
                            category: 'Dicas de Viagem',
                            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
                          });
                          setIsCreatingPost(true);
                        }}
                        className={btnClass}
                      >
                        <Plus className="w-4 h-4" />
                        Escrever Artigo
                      </button>
                    </div>

                    <div className="space-y-3">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="bg-[#181615]/50 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0">
                              <img 
                                src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] tracking-widest font-bold uppercase font-mono text-[#AF4934] bg-[#AF4934]/10 px-2 py-0.5 rounded-sm">
                                  {post.category}
                                </span>
                                <span className="text-[10px] text-stone-500 font-mono font-bold">{post.date}</span>
                              </div>
                              <h4 className="font-display font-bold text-stone-200 text-sm leading-tight line-clamp-1">{post.title}</h4>
                              <p className="text-stone-400 text-xs line-clamp-1 font-light leading-relaxed">{post.excerpt}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              onClick={() => {
                                setEditingPost({ ...post });
                                setIsCreatingPost(false);
                              }}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-[#AF4934]/10 hover:bg-[#AF4934]/20 text-[#AF4934] border border-[#AF4934]/15 hover:border-[#AF4934]/35 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/10 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Creating or Editing post
                  <form onSubmit={handleSavePostForm} className="space-y-6">
                    <div>
                      <h3 className="font-display font-medium text-lg text-stone-100 font-bold">
                        {isCreatingPost ? 'Criar Nova Publicação' : 'Editar Conteúdo do Artigo'}
                      </h3>
                      <p className="text-stone-400 text-xs mt-1">Escreva guias de viagens completos. O editor aceita marcações textuais normais e saltos de parágrafos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Título Principal do Artigo</label>
                        <input 
                          type="text" 
                          value={editingPost.title} 
                          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                          placeholder="Ex: Como planejar um Safári Privativo na África do Sul"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Categoria / Tema do Conteúdo</label>
                        <input 
                          type="text" 
                          value={editingPost.category} 
                          onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                          placeholder="Ex: Dicas de Viagem, Curiosidades, Roteiros de Lua de Mel"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Tempo Estimado de Leitura</label>
                        <input 
                          type="text" 
                          value={editingPost.readTime} 
                          onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                          placeholder="Ex: 5 min de leitura"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Banner do Artigo (Upload de Foto no Navegador)</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                          {editingPost.image && (
                            <img 
                              src={editingPost.image} 
                              alt="Pré-visualização do Banner" 
                              className="w-24 h-16 rounded-lg object-cover bg-stone-950 shrink-0 border border-stone-700" 
                            />
                          )}
                          <div className="space-y-2 text-left w-full">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressAndSetImage(file, (base64) => {
                                    setEditingPost({ ...editingPost, image: base64 });
                                  });
                                }
                              }}
                              className="text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-mono file:font-bold file:bg-[#AF4934]/15 file:text-[#AF4934] hover:file:bg-[#AF4934]/25 cursor-pointer file:cursor-pointer"
                            />
                            <p className="text-[9px] text-stone-500 font-mono">O navegador redimensionará a foto automaticamente para não saturar a memória local.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Trecho Curto (Resumo nos Cards)</label>
                        <input 
                          type="text" 
                          value={editingPost.excerpt} 
                          onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                          placeholder="Escreva um breve resumo do artigo com gancho atrativo para os visitantes do site..."
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Corpo de Texto do Artigo (Conteúdo Completo)</label>
                        <textarea 
                          rows={12}
                          value={editingPost.content} 
                          onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                          placeholder="Digite ou cole o conteúdo do post..."
                          className={`${inputClass} leading-relaxed font-sans`}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end border-t border-stone-850 pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(null);
                          setIsCreatingPost(false);
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[10px] hover:text-white transition-colors tracking-wider px-4 py-2.5 rounded-lg cursor-pointer inline-flex items-center gap-1"
                      >
                        <Undo className="w-4 h-4" />
                        Cancelar
                      </button>
                      
                      <button type="submit" className={btnClass}>
                        <Save className="w-4 h-4" />
                        Salvar e Publicar
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* Panel Testimonials CRUD */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                
                {!editingTestimonial ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Depoimentos dos Clientes</h3>
                        <p className="text-stone-400 text-xs mt-1">Gerencie a prova social exibida no carrossel de depoimentos legítimos.</p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingTestimonial({
                            name: '',
                            role: '',
                            rating: 5,
                            text: ''
                          });
                          setIsCreatingTestimonial(true);
                        }}
                        className={btnClass}
                      >
                        <Plus className="w-4 h-4" />
                        Salvar Novo Relato
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((test) => (
                        <div key={test.name} className="bg-[#181615]/50 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                              <span className="font-display font-bold text-stone-250 text-sm">{test.name}</span>
                              <span className="text-[#AF4934] text-[10px] font-mono">{"★".repeat(test.rating)}</span>
                            </div>
                            <p className="text-[#AF4934] text-[10px] font-mono font-bold text-left">{test.role}</p>
                            <p className="text-stone-400 text-xs italic leading-relaxed text-left">"{test.text}"</p>
                          </div>

                          <div className="flex items-center gap-2 border-t border-stone-850 pt-3 mt-4 justify-end">
                            <button
                              onClick={() => {
                                setEditingTestimonial({ ...test });
                                setIsCreatingTestimonial(false);
                              }}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-[#AF4934]/10 hover:bg-[#AF4934]/20 text-[#AF4934] border border-[#AF4934]/15 hover:border-[#AF4934]/30 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(test.name)}
                              className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/10 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveTestimonialForm} className="space-y-6">
                    <div>
                      <h3 className="font-display font-medium text-lg text-stone-100 font-bold">
                        {isCreatingTestimonial ? 'Salvar Novo Depoimento' : 'Editar Depoimento Existente'}
                      </h3>
                      <p className="text-stone-400 text-xs mt-1">Preencha o formulário para atualizar as avaliações estreladas dos viajantes da agência.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      <div className="space-y-1">
                        <label className={labelClass}>Nome do Cliente Completo</label>
                        <input 
                          type="text" 
                          value={editingTestimonial.name} 
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: Amanda Silva"
                          required
                          disabled={!isCreatingTestimonial}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Cargo / Profissão do Cliente</label>
                        <input 
                          type="text" 
                          value={editingTestimonial.role} 
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: Engenheira de Alimentos"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Pontuação Estrelas (De 1 a 5)</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={5}
                          value={editingTestimonial.rating} 
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Depoimento / Relato de Experiência</label>
                        <textarea 
                          rows={4}
                          value={editingTestimonial.text} 
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                          className={inputClass}
                          placeholder="Descreva a satisfação do cliente..."
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2 border-t border-stone-800/60 pt-4 mt-2">
                        <label className={labelClass}>Foto do Cliente</label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* current image preview */}
                          {editingTestimonial.imageUrl ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#AF4934]/30 shrink-0 bg-stone-900 flex items-center justify-center">
                              <img src={editingTestimonial.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center font-display font-bold text-lg border border-stone-700 shrink-0">
                              {editingTestimonial.name ? editingTestimonial.name.split(' ').map(n => n[0] || '').join('') : '?'}
                            </div>
                          )}

                          <div className="flex-1 w-full space-y-2">
                            {/* URL input */}
                            <input
                              type="text"
                              value={editingTestimonial.imageUrl || ''}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, imageUrl: e.target.value || undefined })}
                              className={inputClass}
                              placeholder="Link (URL) da foto (ex: https://...)"
                            />

                            {/* Upload trigger */}
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                id="admin-testimonial-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const compressedUrl = await compressImage(file, 250, 250, 0.82);
                                      setEditingTestimonial({ ...editingTestimonial, imageUrl: compressedUrl });
                                    } catch (err) {
                                      console.error("Error compressing image:", err);
                                      alert("Erro ao processar imagem.");
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById('admin-testimonial-upload')?.click()}
                                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-[10px] uppercase font-mono tracking-wider border border-stone-800 rounded-lg cursor-pointer flex items-center gap-1.5"
                              >
                                {editingTestimonial.imageUrl ? 'Alterar enviando arquivo' : 'Enviar do Computador'}
                              </button>

                              {editingTestimonial.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setEditingTestimonial({ ...editingTestimonial, imageUrl: undefined })}
                                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/30 text-rose-450 text-[10px] uppercase font-mono tracking-wider border border-red-950/30 rounded-lg cursor-pointer"
                                >
                                  Remover Foto
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end border-t border-stone-850 pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(null);
                          setIsCreatingTestimonial(false);
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[10px] hover:text-white transition-colors tracking-wider px-4 py-2.5 rounded-lg cursor-pointer inline-flex items-center gap-1"
                      >
                        <Undo className="w-4 h-4" />
                        Cancelar
                      </button>
                      
                      <button type="submit" className={btnClass}>
                        <Save className="w-4 h-4" />
                        Salvar Depoimento
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* Panel Forced Sync */}
            {activeTab === 'sync' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Sincronização Forçada (Multi-Dispositivos)</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Gerencie a persistência de dados entre múltiplos navegadores e dispositivos. Esta ferramenta garante a integridade e sincronismo absoluto do CMS do Arcadane.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pull (Download from Cloud) Card */}
                  <div className="bg-[#1c1917]/30 border border-stone-800 hover:border-amber-550/20 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Download className="w-5 h-5 text-amber-500" />
                        </div>
                        <h4 className="font-display text-sm font-bold tracking-wide uppercase text-stone-200">Baixar da Nuvem (PULL)</h4>
                      </div>
                      <p className="text-xs text-stone-300 font-light leading-relaxed">
                        Verifica o estado atual salvo no Firestore e no servidor e sobrescreve o cache local do navegador. Use esta opção se você fez alterações em outro computador ou navegador e deseja atualizá-las aqui.
                      </p>
                    </div>
                    <button
                      disabled={isForcedSyncing}
                      onClick={() => handleForcedSync('pull')}
                      className={`w-full py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isForcedSyncing 
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                          : 'bg-amber-600 hover:bg-amber-550 text-white shadow-md'
                      }`}
                    >
                      {isForcedSyncing ? 'Sincronizando...' : 'Sincronizar e Baixar'}
                    </button>
                  </div>

                  {/* Push (Upload to Cloud) Card */}
                  <div className="bg-[#1c1917]/30 border border-stone-800 hover:border-[#AF4934]/20 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#AF4934]/10 rounded-lg">
                          <Server className="w-5 h-5 text-[#AF4934]" />
                        </div>
                        <h4 className="font-display text-sm font-bold tracking-wide uppercase text-stone-200">Enviar para Nuvem (PUSH)</h4>
                      </div>
                      <p className="text-xs text-stone-300 font-light leading-relaxed">
                        Força o envio imediato e completo de todas as personalizações locais deste navegador para a nuvem (Firestore e Backup no Servidor). Use isto para certificar que suas edições estão seguras e visíveis em outros locais.
                      </p>
                    </div>
                    <button
                      disabled={isForcedSyncing}
                      onClick={() => handleForcedSync('push')}
                      className={`w-full py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isForcedSyncing 
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                          : 'bg-[#AF4934] hover:bg-[#973a27] text-white shadow-md'
                      }`}
                    >
                      {isForcedSyncing ? 'Sincronizando...' : 'Enviar e Salvar'}
                    </button>
                  </div>
                </div>

                {/* Status and Results */}
                {isForcedSyncing && (
                  <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-5 flex items-center gap-3 animate-pulse">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-mono text-stone-300">Aguardando confirmação dos servidores e reconciliando chaves de dados...</span>
                  </div>
                )}

                {syncError && (
                  <div className="bg-rose-950/20 border border-rose-800/30 text-rose-400 rounded-2xl p-5 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase">Erro na Sincronização</h4>
                      <p className="text-xs text-rose-300/80 mt-1">{syncError}</p>
                    </div>
                  </div>
                )}

                {syncResult && syncResult.success && (
                  <div className="bg-emerald-950/20 border border-emerald-800/30 text-emerald-400 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                      <div>
                        <h4 className="font-display text-xs font-bold uppercase">Sincronização Concluída com Sucesso!</h4>
                        <p className="text-xs text-emerald-300/80 mt-1">
                          {syncResult.count === 0 
                            ? 'Nenhuma diferença detectada. Todos os seus dados já estão perfeitamente atualizados!' 
                            : `${syncResult.count} chaves de dados reconciliadas e atualizadas com sucesso.`}
                        </p>
                      </div>
                    </div>
                    {syncResult.updatedKeys.length > 0 && (
                      <div className="pt-2 border-t border-emerald-900/20">
                        <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-wider font-bold block mb-1.5">Itens sincronizados:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {syncResult.updatedKeys.map(key => (
                            <span key={key} className="text-[10px] font-mono bg-emerald-950/80 border border-emerald-800/30 px-2 py-0.5 rounded text-emerald-300">
                              {key.replace('arcadane_', '').replace('cms_', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Checked list of synchronicity */}
                <div className="border border-stone-800 rounded-2xl p-5 bg-[#181615]/20 space-y-3 text-left">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Escopo de Cobertura do Sincronizador</h4>
                  <p className="text-xs text-stone-500 font-light">Todas as seguintes coleções e variáveis customizadas são totalmente protegidas e rastreadas contra perda de cache do navegador:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Metatags SEO & Popups</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Vídeos & Depoimentos</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Destinos Bento Grid</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Efeitos Typewriter</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Pacotes & Ofertas</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Textos & Selos Decorações</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Imagens & Logos</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Matérias do Blog</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Perguntas do Quiz</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#AF4934] text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span>Scripts & Códigos Injetados</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel Custom Code Injection */}
            {activeTab === 'code' && (
              <form onSubmit={handleSaveCustomCode} className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Injetor de Códigos & Scripts</h3>
                  <p className="text-stone-400 text-xs mt-1">Injete livremente códigos HTML, CSS customizados, scripts de chat, Tag Managers (Google GTM), rastreadores de pixels ou buscadores integrados em qualquer parte da sua página.</p>
                </div>

                <div className="space-y-5">
                  <div className="bg-[#181615]/30 p-5 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#AF4934] font-bold">
                        1. Injeção no Cabeçalho (&lt;head&gt;)
                      </label>
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded font-bold">GTM, Meta-tags, Pixels, Fontes</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light">Este código é inserido dentro da tag head global. Perfeito para links de fontes, scripts de analytics, trackers ou tags de verificação.</p>
                    <textarea
                      value={customHeadCode}
                      onChange={(e) => setCustomHeadCode(e.target.value)}
                      placeholder="Ex: <script src='https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y' async></script>"
                      className="w-full h-36 bg-[#0f0e0d] border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-300 focus:border-[#AF4934] focus:outline-none focus:ring-1 focus:ring-[#AF4934] placeholder-stone-700 leading-relaxed"
                    />
                  </div>

                  <div className="bg-[#181615]/30 p-5 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#AF4934] font-bold">
                        2. Injeção no Início do Corpo (logo após &lt;body&gt;)
                      </label>
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded font-bold">Buscadores, GTM Noscript, Widgets do Topo</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light">Este código é renderizado no início do body. Ideal para caixas de pesquisas flutuantes, banners de aviso ou buscadores de terceiros.</p>
                    <textarea
                      value={customBodyStartCode}
                      onChange={(e) => setCustomBodyStartCode(e.target.value)}
                      placeholder="Ex: <div id='custom-search-container'></div>"
                      className="w-full h-36 bg-[#0f0e0d] border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-300 focus:border-[#AF4934] focus:outline-none focus:ring-1 focus:ring-[#AF4934] placeholder-stone-700 leading-relaxed"
                    />
                  </div>

                  <div className="bg-[#181615]/30 p-5 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#AF4934] font-bold">
                        3. Injeção no Final do Corpo (antes de &lt;/body&gt;)
                      </label>
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded font-bold">Chats, VLibras, Scripts Adicionais</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light">Este código é injetado no final da página, antes do fechamento do body. Ótimo para sistemas de chat ao vivo, VLibras adicional, ou scripts de popups.</p>
                    <textarea
                      value={customBodyEndCode}
                      onChange={(e) => setCustomBodyEndCode(e.target.value)}
                      placeholder="Ex: <!-- Widget de chat ou VLibras -->"
                      className="w-full h-36 bg-[#0f0e0d] border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-300 focus:border-[#AF4934] focus:outline-none focus:ring-1 focus:ring-[#AF4934] placeholder-stone-700 leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-[#AF4934] hover:bg-[#973a27] text-white font-medium text-xs font-display tracking-widest px-6 py-3.5 rounded-xl transition-all duration-150 uppercase cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Salvar e Injetar Códigos
                  </button>
                </div>
              </form>
            )}

            {/* Panel Theme Customization */}
            {activeTab === 'theme' && (
              <form onSubmit={handleSaveTheme} className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Personalizar Cores e Tema</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Customize cada aspecto visual e estético da Arcadane Viagens, incluindo a paleta de cores completa, fontes de cabeçalho e corpo, formato dos botões e tipo de banner do topo (foto ou vídeo).
                  </p>
                </div>

                {/* Seção 1: Paleta de Cores */}
                <div className="bg-[#181615]/30 p-6 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Palette className="w-5 h-5 text-[#AF4934]" />
                    <h4 className="font-display text-sm font-semibold text-stone-200">1. Paleta de Cores do Site</h4>
                  </div>
                  <p className="text-xs text-stone-400">
                    Defina as cores estruturais e de acento que se aplicam em todo o site.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* Cor Primária */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Cor Primária (Principal)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.primaryColor}
                          onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.primaryColor}
                          onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Usada nos botões principais e menus ativos.</span>
                    </div>

                    {/* Cor Secundária */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Cor Secundária (Acento)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.secondaryColor}
                          onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.secondaryColor}
                          onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Usada em títulos serifados, selos e acentos elegantes.</span>
                    </div>

                    {/* Cor Background Light */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Fundo Principal (Claro)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.bgColorLight}
                          onChange={(e) => setTheme({ ...theme, bgColorLight: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.bgColorLight}
                          onChange={(e) => setTheme({ ...theme, bgColorLight: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Cor de fundo do site (padrão é um off-white clássico).</span>
                    </div>

                    {/* Cor Texto Dark */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Texto Principal (Escuro)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.textColorDark}
                          onChange={(e) => setTheme({ ...theme, textColorDark: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.textColorDark}
                          onChange={(e) => setTheme({ ...theme, textColorDark: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Cor para títulos, parágrafos e textos gerais.</span>
                    </div>

                    {/* Cor Chocolate */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Tom de Chocolate / Marrom
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.chocolateColor}
                          onChange={(e) => setTheme({ ...theme, chocolateColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.chocolateColor}
                          onChange={(e) => setTheme({ ...theme, chocolateColor: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Usado em descrições secundárias e elementos artesanais.</span>
                    </div>

                    {/* Cor Beige */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Tom de Bege / Areia
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.beigeColor}
                          onChange={(e) => setTheme({ ...theme, beigeColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.beigeColor}
                          onChange={(e) => setTheme({ ...theme, beigeColor: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Usado em fundos de cards e seções de contraste.</span>
                    </div>

                    {/* Cor Border */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Cor de Bordas e Divisores
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme.borderColor}
                          onChange={(e) => setTheme({ ...theme, borderColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-stone-800"
                        />
                        <input
                          type="text"
                          value={theme.borderColor}
                          onChange={(e) => setTheme({ ...theme, borderColor: e.target.value })}
                          className="flex-1 bg-[#0f0e0d] border border-stone-800 rounded-lg px-3 text-xs text-stone-300 font-mono focus:border-[#AF4934] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500">Usado em linhas finas divisórias e bordas de inputs.</span>
                    </div>
                  </div>
                </div>

                {/* Seção 2: Tipografia & Fontes */}
                <div className="bg-[#181615]/30 p-6 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <FileText className="w-5 h-5 text-[#AF4934]" />
                    <h4 className="font-display text-sm font-semibold text-stone-200">2. Tipografia e Fontes</h4>
                  </div>
                  <p className="text-xs text-stone-400">
                    Edite as famílias de fontes aplicadas para conferir o estilo ideal (editorial, clássico, moderno ou brutalista).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Font Sans */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Fonte Sem-Serifa (Corpo do Texto)
                      </label>
                      <select
                        value={theme.fontSans}
                        onChange={(e) => setTheme({ ...theme, fontSans: e.target.value })}
                        className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none"
                      >
                        <option value='"Montserrat", "Inter", sans-serif'>Montserrat / Inter (Padrão Arcadane)</option>
                        <option value='"Inter", sans-serif'>Inter (Suíça / Moderna)</option>
                        <option value='"Montserrat", sans-serif'>Montserrat (Sólida / Geométrica)</option>
                        <option value='"Plus Jakarta Sans", sans-serif'>Plus Jakarta Sans (Moderna / Editorial)</option>
                      </select>
                      <span className="text-[10px] text-stone-500">Usada nos parágrafos, menus e pequenos textos.</span>
                    </div>

                    {/* Font Display */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Fonte de Destaque / Títulos
                      </label>
                      <select
                        value={theme.fontDisplay}
                        onChange={(e) => setTheme({ ...theme, fontDisplay: e.target.value })}
                        className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none"
                      >
                        <option value='"Montserrat", "Cormorant Garamond", Georgia, serif'>Montserrat & Cormorant (Mistura Premium)</option>
                        <option value='"Playfair Display", serif'>Playfair Display (Alta Costura / Clássica)</option>
                        <option value='"Cormorant Garamond", Georgia, serif'>Cormorant Garamond (Editorial de Luxo)</option>
                        <option value='"Montserrat", sans-serif'>Montserrat Bold (Moderno / Impactante)</option>
                      </select>
                      <span className="text-[10px] text-stone-500">Usada em títulos de seções e banners principais.</span>
                    </div>

                    {/* Font Serif */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Fonte Serifada (Acentos Itálicos)
                      </label>
                      <select
                        value={theme.fontSerif}
                        onChange={(e) => setTheme({ ...theme, fontSerif: e.target.value })}
                        className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none"
                      >
                        <option value='"Cormorant Garamond", Georgia, serif'>Cormorant Garamond (Super Fina e Elegante)</option>
                        <option value='"Playfair Display", serif'>Playfair Display (Serifada Clássica Robusta)</option>
                        <option value='Georgia, serif'>Georgia (Serifada Web Segura Clássica)</option>
                      </select>
                      <span className="text-[10px] text-stone-500">Usada nas palavras em itálico de extrema elegância.</span>
                    </div>
                  </div>
                </div>

                {/* Seção 3: Estilos de Botões */}
                <div className="bg-[#181615]/30 p-6 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Sliders className="w-5 h-5 text-[#AF4934]" />
                    <h4 className="font-display text-sm font-semibold text-stone-200">3. Estilo Visual dos Botões</h4>
                  </div>
                  <p className="text-xs text-stone-400">
                    Defina o formato de bordas e o acabamento estético dos botões de ação e formulários.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Button Radius */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Arredondamento das Bordas (Border Radius)
                      </label>
                      <select
                        value={theme.buttonRadius}
                        onChange={(e) => setTheme({ ...theme, buttonRadius: e.target.value as any })}
                        className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none"
                      >
                        <option value="rounded-none">Retangular Reto (0px - Brutalista)</option>
                        <option value="rounded">Discretamente Arredondado (4px)</option>
                        <option value="rounded-lg">Arredondamento Padrão (8px)</option>
                        <option value="rounded-xl">Arredondamento Suave (12px)</option>
                        <option value="rounded-2xl">Arredondamento Elegante (16px)</option>
                        <option value="rounded-full">Totalmente Arredondado (Oval / Clássico)</option>
                      </select>
                      <span className="text-[10px] text-stone-500">Aplica-se a botões, campos de texto, seletores e modais.</span>
                    </div>

                    {/* Button Style */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Efeito de Preenchimento / Estilo
                      </label>
                      <select
                        value={theme.buttonStyle}
                        onChange={(e) => setTheme({ ...theme, buttonStyle: e.target.value as any })}
                        className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none"
                      >
                        <option value="solid">Sólido Preenchido (Clássico)</option>
                        <option value="outline">Apenas Contorno (Outline minimalista)</option>
                        <option value="shadow-lux">Sombra de Luxo / Soft Glow</option>
                        <option value="glass">Efeito de Vidro (Frosted Glass / Translúcido)</option>
                      </select>
                      <span className="text-[10px] text-stone-500">Define o acabamento estético dos botões principais.</span>
                    </div>
                  </div>
                </div>

                {/* Seção 4: Banner do Cabeçalho */}
                <div className="bg-[#181615]/30 p-6 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Film className="w-5 h-5 text-[#AF4934]" />
                    <h4 className="font-display text-sm font-semibold text-stone-200">4. Capa / Banner do Cabeçalho</h4>
                  </div>
                  <p className="text-xs text-stone-400">
                    Alterne o cabeçalho principal da página inicial entre um vídeo cinematográfico ou uma bela foto estática de capa.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Header Type */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Tipo de Mídia do Banner Principal
                      </label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                          <input
                            type="radio"
                            name="heroBannerType"
                            value="video"
                            checked={theme.heroBannerType === 'video'}
                            onChange={() => setTheme({ ...theme, heroBannerType: 'video' })}
                            className="accent-[#AF4934]"
                          />
                          Vídeo de Fundo (YouTube / Link local)
                        </label>
                        <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                          <input
                            type="radio"
                            name="heroBannerType"
                            value="image"
                            checked={theme.heroBannerType === 'image'}
                            onChange={() => setTheme({ ...theme, heroBannerType: 'image' })}
                            className="accent-[#AF4934]"
                          />
                          Foto Estática de Alta Resolução
                        </label>
                      </div>
                      <span className="text-[10px] text-stone-500">Selecione se deseja exibir o vídeo cadastrado na aba Home ou uma imagem abaixo.</span>
                    </div>

                    {/* Overlay Opacity */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                        Opacidade do Escurecimento da Capa ({theme.heroOverlayOpacity}%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={theme.heroOverlayOpacity}
                        onChange={(e) => setTheme({ ...theme, heroOverlayOpacity: parseInt(e.target.value) })}
                        className="w-full accent-[#AF4934] h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] text-stone-500">Aumente para dar mais legibilidade aos textos brancos do topo.</span>
                    </div>

                    {/* Image URL (Visible if type is image) */}
                    {theme.heroBannerType === 'image' && (
                      <div className="col-span-1 md:col-span-2 space-y-2 animate-fadeIn">
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                          URL da Imagem de Fundo do Banner
                        </label>
                        <input
                          type="text"
                          value={theme.heroBannerImageUrl}
                          onChange={(e) => setTheme({ ...theme, heroBannerImageUrl: e.target.value })}
                          placeholder="Ex: https://images.unsplash.com/photo-XXX"
                          className="w-full bg-[#0f0e0d] border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-300 focus:border-[#AF4934] focus:outline-none placeholder-stone-700"
                        />
                        <div className="mt-2 rounded-xl overflow-hidden border border-stone-800 h-32 bg-stone-900 flex items-center justify-center relative">
                          <img
                            src={theme.heroBannerImageUrl || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1600'}
                            alt="Pré-visualização da Capa"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <div className="relative text-xs text-stone-200 font-display tracking-widest uppercase bg-[#131110]/80 px-4 py-2 rounded-lg font-bold">
                            Pré-Visualização da Capa
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Envio */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-[#AF4934] hover:bg-[#973a27] text-white font-medium text-xs font-display tracking-widest px-6 py-3.5 rounded-xl transition-all duration-150 uppercase cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Customização Visual
                  </button>
                </div>
              </form>
            )}

            {/* Panel Páginas Customizadas */}
            {activeTab === 'custom-pages' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Páginas Customizadas e Links do Menu</h3>
                    <p className="text-stone-400 text-xs mt-1">Crie novas páginas de conteúdo institucional, termos ou links externos e controle sua exibição no menu principal.</p>
                  </div>
                  
                  {!editingCustomPage && !isCreatingCustomPage && (
                    <button
                      onClick={() => {
                        setEditingCustomPage({
                          id: '',
                          title: '',
                          content: '',
                          metaDescription: '',
                          keywords: '',
                          addToMenu: true,
                          menuLabel: '',
                          externalUrl: ''
                        });
                        setIsCreatingCustomPage(true);
                      }}
                      className="bg-[#AF4934] hover:bg-[#973a27] text-white font-medium text-xs font-display tracking-widest px-4 py-2.5 rounded-lg transition-colors uppercase cursor-pointer flex items-center gap-1.5 self-start"
                    >
                      <Plus className="w-4 h-4" />
                      Criar Nova Página
                    </button>
                  )}
                </div>

                {/* Edit Form */}
                {(editingCustomPage || isCreatingCustomPage) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editingCustomPage) return;

                      // Validate ID (slug)
                      const cleanId = editingCustomPage.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                      if (!cleanId && !editingCustomPage.externalUrl) {
                        showFeedback('O Slug/ID da página é obrigatório (ex: "seguro-viagem") a menos que seja um link externo.', 'error');
                        return;
                      }

                      if (!editingCustomPage.title && !editingCustomPage.externalUrl) {
                        showFeedback('O título da página é obrigatório.', 'error');
                        return;
                      }

                      let updatedPages = [...customPages];
                      if (isCreatingCustomPage) {
                        // Check if ID already exists
                        if (updatedPages.some(p => p.id === cleanId)) {
                          showFeedback(`Uma página com o Slug/ID "${cleanId}" já existe!`, 'error');
                          return;
                        }
                        const newPage = { ...editingCustomPage, id: cleanId };
                        updatedPages.push(newPage);
                      } else {
                        // Edit mode
                        updatedPages = updatedPages.map(p => p.id === editingCustomPage.id ? editingCustomPage : p);
                      }

                      saveCustomPages(updatedPages);
                      setCustomPages(updatedPages);
                      setEditingCustomPage(null);
                      setIsCreatingCustomPage(false);
                      showFeedback('Página customizada salva com sucesso absoluto!');
                    }}
                    className="bg-[#181615]/30 border border-stone-850 rounded-2xl p-6 space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-stone-850 pb-4">
                      <h4 className="font-display text-xs tracking-wider text-stone-400 uppercase font-bold">
                        {isCreatingCustomPage ? 'Adicionar Nova Página' : 'Editar Página'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomPage(null);
                          setIsCreatingCustomPage(false);
                        }}
                        className="text-stone-500 hover:text-stone-300 text-xs font-sans"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Título da Página (no Menu e Cabeçalho)</label>
                        <input
                          type="text"
                          value={editingCustomPage?.title || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, title: e.target.value } : null)}
                          placeholder="Ex: Curadoria de Luxo"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Slug / ID amigável (Apenas letras e hifens)</label>
                        <input
                          type="text"
                          value={editingCustomPage?.id || ''}
                          disabled={!isCreatingCustomPage}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') } : null)}
                          placeholder="Ex: curadoria-luxo"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50 disabled:opacity-40"
                        />
                        <p className="text-[10px] text-stone-500">Este ID formará a URL final (ex: seu-site.com/p/{editingCustomPage?.id || 'id'})</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Rotular no Menu como (Opcional)</label>
                        <input
                          type="text"
                          value={editingCustomPage?.menuLabel || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, menuLabel: e.target.value } : null)}
                          placeholder="Se vazio, usará o título acima"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Redirecionar para URL externa (Opcional)</label>
                        <input
                          type="text"
                          value={editingCustomPage?.externalUrl || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, externalUrl: e.target.value } : null)}
                          placeholder="Ex: https://link-da-pagina.com (Deixe em branco para página própria)"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block flex items-center justify-between">
                          <span>Conteúdo da Página (Suporta Markdown)</span>
                        </label>
                        <textarea
                          rows={12}
                          value={editingCustomPage?.content || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, content: e.target.value } : null)}
                          placeholder="Utilize # para Títulos, ## para Subtítulos, e - para itens em lista..."
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 font-mono focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Meta Description para SEO</label>
                        <input
                          type="text"
                          value={editingCustomPage?.metaDescription || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, metaDescription: e.target.value } : null)}
                          placeholder="Breve descrição da página para mecanismos de busca"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Palavras-chave (Keywords)</label>
                        <input
                          type="text"
                          value={editingCustomPage?.keywords || ''}
                          onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, keywords: e.target.value } : null)}
                          placeholder="Ex: luxo, exclusividade, roteiro"
                          className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                        />
                      </div>

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2.5 bg-[#1c1917]/30 p-3.5 rounded-xl border border-stone-800">
                          <input
                            type="checkbox"
                            id="addToMenu"
                            checked={editingCustomPage?.addToMenu ?? true}
                            onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, addToMenu: e.target.checked } : null)}
                            className="w-4 h-4 rounded text-[#AF4934] focus:ring-[#AF4934]/40 cursor-pointer"
                          />
                          <div>
                            <label htmlFor="addToMenu" className="text-xs text-stone-300 font-medium cursor-pointer block">
                              Exibir no Menu Principal
                            </label>
                            <span className="text-[10px] text-stone-500">Exibe esta página como link no cabeçalho</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 bg-[#1c1917]/30 p-3.5 rounded-xl border border-stone-800">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={editingCustomPage?.isActive ?? true}
                            onChange={(e) => setEditingCustomPage(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                            className="w-4 h-4 rounded text-[#AF4934] focus:ring-[#AF4934]/40 cursor-pointer"
                          />
                          <div>
                            <label htmlFor="isActive" className="text-xs text-stone-300 font-medium cursor-pointer block">
                              Página Ativa e Publicada
                            </label>
                            <span className="text-[10px] text-stone-500 font-sans">Se desmarcado, a página ficará oculta/offline</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-850">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomPage(null);
                          setIsCreatingCustomPage(false);
                        }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-display tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-[#AF4934] hover:bg-[#973a27] text-white text-xs font-display tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        Salvar Página
                      </button>
                    </div>
                  </form>
                )}

                {/* Table / List View */}
                {!editingCustomPage && !isCreatingCustomPage && (
                  <div className="space-y-6">
                    {/* CATEGORY 1: SYSTEM PAGES */}
                    <div className="bg-[#181615]/30 border border-stone-850 rounded-2xl overflow-hidden" id="layout-menu-visibility">
                      <div className="p-4 bg-stone-900/40 border-b border-stone-850 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Páginas Nativas do Sistema</span>
                        <span className="text-xs text-stone-400">7 Páginas do Sistema</span>
                      </div>
                      <div className="divide-y divide-stone-850">
                        {[
                          {
                            id: 'home',
                            name: 'Página Inicial (Home)',
                            labelKey: 'menuLabelHome',
                            hideKey: 'hideHome',
                            hideInMenuKey: 'hideHomeInMenu',
                            allowHidePage: false,
                            defaultLabel: 'Início',
                          },
                          {
                            id: 'services',
                            name: 'Serviços',
                            labelKey: 'menuLabelServices',
                            hideKey: 'hideServices',
                            hideInMenuKey: 'hideServicesInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Serviços',
                          },
                          {
                            id: 'packages',
                            name: 'Pacotes de Viagem',
                            labelKey: 'menuLabelPackages',
                            hideKey: 'hidePackages',
                            hideInMenuKey: 'hidePackagesInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Pacotes',
                          },
                          {
                            id: 'about-us',
                            name: 'Quem Somos / Sobre Nós',
                            labelKey: 'menuLabelAboutUs',
                            hideKey: 'hideAboutUs',
                            hideInMenuKey: 'hideAboutUsInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Quem Somos',
                          },
                          {
                            id: 'custom-trip',
                            name: 'Viagem Personalizada (Roteiros)',
                            labelKey: 'menuLabelCustomTrip',
                            hideKey: 'hideCustomTrip',
                            hideInMenuKey: 'hideCustomTripInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Viagem Personalizada',
                          },
                          {
                            id: 'blog',
                            name: 'Blog de Dicas & Relatos',
                            labelKey: 'menuLabelBlog',
                            hideKey: 'hideBlog',
                            hideInMenuKey: 'hideBlogInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Blog',
                          },
                          {
                            id: 'contact-us',
                            name: 'Fale Conosco / Contato',
                            labelKey: 'menuLabelContactUs',
                            hideKey: 'hideContactUs',
                            hideInMenuKey: 'hideContactUsInMenu',
                            allowHidePage: true,
                            defaultLabel: 'Contato',
                          }
                        ].map((sysPage) => {
                          const isHidden = (home as any)[sysPage.hideKey] === true;
                          const isHiddenInMenu = (home as any)[sysPage.hideInMenuKey] === true;
                          const currentLabel = (home as any)[sysPage.labelKey] || sysPage.defaultLabel;

                          return (
                            <div key={sysPage.id} className="p-5 hover:bg-stone-900/10 transition-colors">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-sm font-display font-medium text-stone-100 font-bold">{sysPage.name}</h4>
                                    <span className="px-2 py-0.5 bg-stone-800 text-stone-400 text-[9px] font-mono rounded-full border border-stone-700">Sistema</span>
                                    
                                    {isHidden ? (
                                      <span className="px-2 py-0.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[9px] font-mono rounded-full">Desativada / Oculta</span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-[9px] font-mono rounded-full">Ativa</span>
                                    )}

                                    {isHiddenInMenu ? (
                                      <span className="px-2 py-0.5 bg-stone-900/50 border border-stone-800 text-stone-500 text-[9px] font-mono rounded-full">Fora do Menu</span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-900/30 text-amber-500 text-[9px] font-mono rounded-full">No Menu</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-500 font-sans">
                                    Caminho nativo do site. Rótulo no menu: <span className="text-stone-300 font-mono">"{currentLabel}"</span>
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 w-full lg:w-auto">
                                  <div className="space-y-1">
                                    <span className="text-[9px] uppercase font-mono text-stone-500 block">Rótulo no Menu</span>
                                    <input
                                      type="text"
                                      value={currentLabel}
                                      onChange={(e) => {
                                        const updated = { ...home, [sysPage.labelKey]: e.target.value };
                                        setHome(updated);
                                        saveHomeSettings(updated);
                                      }}
                                      className="w-full sm:w-40 bg-[#12100F] border border-stone-800 rounded-lg px-2.5 py-1 text-[11px] text-stone-200 focus:outline-none focus:border-[#AF4934]/50"
                                      placeholder={sysPage.defaultLabel}
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1 items-start justify-center pt-2 sm:pt-0">
                                    <span className="text-[9px] uppercase font-mono text-stone-500">Exibir no Menu</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...home, [sysPage.hideInMenuKey]: !isHiddenInMenu };
                                        setHome(updated);
                                        saveHomeSettings(updated);
                                        showFeedback('Preferências de menu salvas!');
                                      }}
                                      className={`px-3 py-1 text-[10.5px] rounded-md font-bold w-full text-center transition-colors cursor-pointer ${
                                        !isHiddenInMenu 
                                          ? 'bg-[#AF4934]/20 border border-[#AF4934]/40 text-[#AF4934] hover:bg-[#AF4934]/30' 
                                          : 'bg-stone-800 border border-stone-700 text-stone-400 hover:bg-stone-750'
                                      }`}
                                    >
                                      {!isHiddenInMenu ? 'Exibido' : 'Oculto'}
                                    </button>
                                  </div>

                                  <div className="flex flex-col gap-1 items-start justify-center pt-2 sm:pt-0">
                                    <span className="text-[9px] uppercase font-mono text-stone-500">Status Página</span>
                                    {sysPage.allowHidePage ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = { ...home, [sysPage.hideKey]: !isHidden };
                                          setHome(updated);
                                          saveHomeSettings(updated);
                                          showFeedback('Preferências de visibilidade salvas!');
                                        }}
                                        className={`px-3 py-1 text-[10.5px] rounded-md font-bold w-full text-center transition-colors cursor-pointer ${
                                          !isHidden 
                                            ? 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/20' 
                                            : 'bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900/20'
                                        }`}
                                      >
                                        {!isHidden ? 'Ativa' : 'Oculta'}
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-stone-500 italic mt-1 bg-[#181615] px-2.5 py-1 rounded border border-stone-850 w-full text-center select-none block">Sempre Ativa</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CATEGORY 2: CUSTOM PAGES */}
                    <div className="bg-[#181615]/30 border border-stone-850 rounded-2xl overflow-hidden">
                      <div className="p-4 bg-stone-900/40 border-b border-stone-850 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Páginas Customizadas Adicionais</span>
                        <span className="text-xs text-[#AF4934] font-bold">{customPages.length} Página(s)</span>
                      </div>

                      {customPages.length === 0 ? (
                        <div className="p-12 text-center">
                          <p className="text-stone-500 text-xs font-mono">Nenhuma página customizada criada ainda.</p>
                          <p className="text-stone-600 text-[11px] mt-1 font-sans">Clique no botão "Criar Nova Página" acima para começar.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-stone-850">
                          {customPages.map((page) => {
                            const isPageActive = page.isActive !== false;
                            return (
                              <div key={page.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-900/15 transition-colors">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-sm font-display font-medium text-stone-100 font-bold">{page.title}</h4>
                                    
                                    {isPageActive ? (
                                      <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-[9px] font-mono rounded-full">Ativa</span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-red-950/40 border border-red-900/30 text-red-400 text-[9px] font-mono rounded-full font-bold">Inativa / Oculta</span>
                                    )}

                                    {page.addToMenu ? (
                                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono rounded-full">No Menu</span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-stone-800 text-stone-500 text-[9px] font-mono rounded-full">Oculta no Menu</span>
                                    )}

                                    {page.externalUrl && (
                                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono rounded-full">Link Externo</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-500 font-mono">
                                    {page.externalUrl ? `Redireciona para: ${page.externalUrl}` : `/p/${page.id}`}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCustomPage({ ...page });
                                      setIsCreatingCustomPage(false);
                                    }}
                                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-300 text-[10.5px] rounded-md font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Editar
                                  </button>
                                  
                                  {deletingId === page.id ? (
                                    <div className="flex items-center gap-1 bg-red-950/20 border border-red-900/30 p-1 rounded-md">
                                      <span className="text-[10px] text-red-400 font-mono px-1 font-bold">Excluir?</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = customPages.filter(p => p.id !== page.id);
                                          saveCustomPages(updated);
                                          setCustomPages(updated);
                                          setDeletingId(null);
                                          showFeedback('Página excluída permanentemente.');
                                        }}
                                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] rounded font-bold cursor-pointer transition-colors"
                                      >
                                        Sim
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingId(null)}
                                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] rounded font-bold cursor-pointer transition-colors"
                                      >
                                        Não
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setDeletingId(page.id)}
                                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/30 border border-red-900/30 text-red-400 text-[10.5px] rounded-md font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Excluir
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Panel Domínios */}
            {activeTab === 'domains' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Configuração de Domínio e Hospedagem</h3>
                  <p className="text-stone-400 text-xs mt-1">Configure o domínio personalizado do seu site Arcadane de forma profissional, integrado diretamente com a Hostinger, Cloudflare ou GoDaddy.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left stats column */}
                  <div className="bg-[#181615]/30 border border-stone-850 rounded-2xl p-6 space-y-4 lg:col-span-1 text-left">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">Status do Domínio</p>
                    
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping absolute" />
                      <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-stone-100 uppercase">Ativo e Conectado</p>
                        <p className="text-[10px] text-stone-400">DNS Apontado com sucesso</p>
                      </div>
                    </div>

                    <div className="border-t border-stone-850 pt-4 space-y-3">
                      <div>
                        <p className="text-[10px] text-stone-500 font-mono">DOMÍNIO PRINCIPAL</p>
                        <p className="text-xs text-stone-300 font-mono mt-0.5">{domainSettings.primaryDomain}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 font-mono">SUBDOMÍNIO OPERACIONAL</p>
                        <p className="text-xs text-[#AF4934] font-bold mt-0.5">{domainSettings.subdomain}</p>
                      </div>
                    </div>
                  </div>

                  {/* DNS Records Form */}
                  <div className="bg-[#181615]/30 border border-stone-850 rounded-2xl p-6 lg:col-span-2 space-y-6">
                    <p className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold block">Editar Apontamento de Domínios</p>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveDomainSettings(domainSettings);
                        showFeedback('Instruções e configurações de domínios salvas com sucesso!');
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Domínio Principal (ex: arcadaneviagens.com.br)</label>
                          <input
                            type="text"
                            value={domainSettings.primaryDomain}
                            onChange={(e) => setDomainSettings(prev => ({ ...prev, primaryDomain: e.target.value }))}
                            className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Subdomínio (ex: vip.arcadaneviagens.com.br)</label>
                          <input
                            type="text"
                            value={domainSettings.subdomain}
                            onChange={(e) => setDomainSettings(prev => ({ ...prev, subdomain: e.target.value }))}
                            className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#AF4934]/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Endereço IP de Destino (Apontamento Tipo A)</label>
                          <input
                            type="text"
                            value={domainSettings.ipAddress}
                            onChange={(e) => setDomainSettings(prev => ({ ...prev, ipAddress: e.target.value }))}
                            className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-[#AF4934]/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Registro CNAME de Destino (Apontamento CNAME)</label>
                          <input
                            type="text"
                            value={domainSettings.cnameRecord}
                            onChange={(e) => setDomainSettings(prev => ({ ...prev, cnameRecord: e.target.value }))}
                            className="w-full bg-[#1c1917]/50 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-[#AF4934]/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-[#AF4934] hover:bg-[#973a27] text-white text-xs font-display tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          Salvar Apontamentos
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Hostinger DNS Step by Step instructions card */}
                <div className="bg-[#1c1917]/30 border border-stone-850 rounded-2xl p-6 text-left space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200 uppercase font-bold text-amber-500">Como configurar seu domínio na Hostinger (Passo a Passo)</h4>
                  
                  <div className="space-y-3.5 text-stone-300 text-xs font-light leading-relaxed">
                    <p>Para colocar seu site no ar no seu domínio próprio, siga estes passos simples no painel da sua registradora (Hostinger):</p>
                    <div className="space-y-2 pl-4 border-l-2 border-[#AF4934]/40">
                      <p><strong>Passo 1:</strong> Acesse seu painel da Hostinger e navegue em <strong>Domínios</strong> &gt; Gerenciar &gt; <strong>Editor de Zona DNS</strong>.</p>
                      <p><strong>Passo 2:</strong> Adicione um novo registro do tipo <strong>A</strong>. No campo "Nome/Host", coloque <code>@</code>, e no campo "Aponta para (IP)", insira o IP do servidor Arcadane: <code>{domainSettings.ipAddress}</code>.</p>
                      <p><strong>Passo 3:</strong> Adicione um novo registro do tipo <strong>CNAME</strong>. No campo "Nome/Host", coloque <code>www</code>, e no campo "Aponta para", insira: <code>{domainSettings.cnameRecord}</code>.</p>
                      <p><strong>Passo 4:</strong> Clique em Salvar e aguarde a propagação de DNS (costuma demorar de 15 minutos até 4 hours).</p>
                    </div>
                    <p className="text-[10px] text-stone-500">Nota: O SSL (cadeado de segurança HTTPS) é gerado e instalado automaticamente no nosso servidor de forma gratuita logo após a propagação dos registros DNS.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Panel Restore Factory settings */}
            {activeTab === 'reset' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Menu Crítico: Reconfiguração Geral</h3>
                  <p className="text-stone-400 text-xs mt-1">Restaure todos os textos, links de vídeos, fotos dos sócios e pacotes oficiais originais de fábrica para começar do zero.</p>
                </div>

                <div className="bg-[#1c1917]/30 border border-[#AF4934]/20 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex items-start gap-3">
                    <Sliders className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <h4 className="font-display text-sm tracking-wide text-stone-200 uppercase font-bold text-rose-500">Ações Irreversíveis</h4>
                      <p className="text-xs text-stone-300 font-light leading-relaxed">
                        Ao efetuar esta operação de limpeza completa do armazenamento local, qualquer alteração de SEO, post de blog criado, foto selecionada ou dados de preços editados em seu painel administrativo serão deletados definitivamente instalando o banco simulado original.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-stone-800 pt-5 flex justify-start">
                    <button
                      onClick={handleFullReset}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs font-display tracking-widest px-5 py-3 rounded-lg transition-colors uppercase cursor-pointer inline-flex items-center gap-2 shadow-lg"
                    >
                      <Trash className="w-4 h-4" />
                      Restaurar Tudo de Fábrica
                    </button>
                  </div>
                </div>

                <div className="border-t border-stone-850 pt-5">
                  <h4 className="font-display text-xs tracking-wide text-stone-400 uppercase font-bold mb-3">Ajuda do Painel</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#181615]/30 p-4 rounded-xl border border-stone-850">
                      <p className="font-mono text-[9.5px] uppercase text-[#AF4934] font-bold">1. Como funciona a persistência?</p>
                      <p className="text-stone-405 text-xs font-light mt-1.5 leading-relaxed">Não se preocupe com perdas acidentais de internet: tudo é mantido no armazenamento local seguro do seu navegador instantaneamente.</p>
                    </div>
                    <div className="bg-[#181615]/30 p-4 rounded-xl border border-stone-850">
                      <p className="font-mono text-[9.5px] uppercase text-[#AF4934] font-bold">2. O robô compactador de imagens?</p>
                      <p className="text-stone-450 text-xs font-light mt-1.5 leading-relaxed">O sistema utiliza um engine que comprime arquivos de fotos pesadas para resoluções optimizadas para garantir velocidade turbo na abertura do site.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
