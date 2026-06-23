import { ServiceItem, TestimonialItem, PackageItem, BlogPost, LuxuryTrip } from '../types';
import { SERVICES as DEFAULT_SERVICES, TESTIMONIALS as DEFAULT_TESTIMONIALS, PACKAGES as DEFAULT_PACKAGES, BLOG_POSTS as DEFAULT_BLOG_POSTS } from '../data';
import fallbackData from './cmsStoreFallback.json';

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  faviconUrl: string;
  contactWhatsAppMateus: string;
  contactWhatsAppMaria: string;
  contactWhatsAppMariana: string;
  
  // Exit Intent Popup Configuration
  exitIntentTitle: string;
  exitIntentText: string;
  exitIntentEnabled?: boolean;
  exitIntentShowOnPages?: 'all' | 'home_only_or_itineraries';
  exitIntentBenefits?: string; // Semicolon-separated values
  
  // General Promotional Announcement Popup Configuration
  announcementPopupEnabled?: boolean;
  announcementPopupDelay?: number; // Delay in seconds (e.g., 5 seconds)
  announcementPopupTitle?: string;
  announcementPopupText?: string;
  announcementPopupShowOnPages?: 'all' | 'home_only_or_itineraries';

  primaryColor?: string;
  secondaryColor?: string;
}

export interface HomeSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  aboutUsHeadline: string;
  aboutUsSubheadline: string;
  aboutUsText: string; // Separated by \n or paragraphs
  footerText: string;
  footerAddress: string;
  footerEmail: string;
  customTripTitle?: string;
  customTripSubtitle?: string;
  customTripButtonText?: string;
  widgetType?: 'befly' | 'whatsapp';
}

export interface PromoPackage {
  id: string;
  title: string;
  route: string;
  origin: string;
  destination: string;
  tag: string;
  badge: string;
  image: string;
  link: string;
  description: string;
  highlights: string[];
  waMessage: string;
  price: string;
}

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: "Arcadane Viagens | Roteiros Personalizados de Luxo",
  metaDescription: "A Arcadane Viagens une planejamento técnico cirúrgico e sensibilidade para criar roteiros de viagem personalizados de alto padrão.",
  keywords: "arcadane, viagens de luxo, roteiros sob medida, turismo personalizado, maria mateus mariana, roteiros exclusivos",
  faviconUrl: "",
  contactWhatsAppMateus: "554791492704", // Authentic contact WhatsApps
  contactWhatsAppMaria: "5547992008571",
  contactWhatsAppMariana: "5547992008571",
  
  exitIntentTitle: "Não encontrou o que estava procurando?",
  exitIntentText: "O mundo é vasto demais para ser planejado por meio de caixas padronizadas. Nossos consultores especializados estão apostos para desenhar sob medida o roteiro exato que você tem em mente, sem burocracias.",
  exitIntentEnabled: true,
  exitIntentShowOnPages: 'all',
  exitIntentBenefits: "Acesso exclusivo a tarifas confidenciais e upgrades;Suporte premium 24 horas por dia em sua jornada;Pesquisa personalizada de aéreo emitida com milhas;Curadoria fina de experiências boutique singulares",

  announcementPopupEnabled: false,
  announcementPopupDelay: 5,
  announcementPopupTitle: "Novidades Arcadane: Roteiros Exclusivos de Lua de Mel!",
  announcementPopupText: "Preparamos uma seleção incomparável de destinos selecionados para quem busca o máximo de conforto, mimos e personalização. Entre em contato conosco hoje mesmo e garanta tarifas negociadas com agentes preferenciais e upgrades!",
  announcementPopupShowOnPages: 'home_only_or_itineraries',

  primaryColor: "#3B5EA4",
  secondaryColor: "#AF4934"
};

const DEFAULT_HOME_SETTINGS: HomeSettings = {
  heroTitle: "A arte de viajar <span class=\"font-serif font-normal italic text-brand-secondary\">sob medida</span>",
  heroSubtitle: "Curadoria de destinos exclusivos, hotéis extraordinários e planejamento técnico de excelência.",
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-safari-under-sunset-sky-43152-large.mp4",
  aboutUsHeadline: "Nossa trajetória, nosso propósito",
  aboutUsSubheadline: "Sua jornada desenhada por especialistas",
  aboutUsText: "A Arcadane Viagens nasceu com o propósito de transformar o simples ato de viajar em uma experiência de significado. Unimos planejamento técnico e sensibilidade humana para criar roteiros sob medida, que refletem o estilo, o ritmo e os sonhos de cada cliente.\n\nMais do que uma agência de viagens convencional, somos uma consultoria de experiências completas. Cuidamos com amor de cada detalhe, desde a primeira conversa até o seu retorno, com total transparência, segurança e um atendimento que é verdadeiramente próximo de você.\n\nAcreditamos que viajar é uma das formas mais bonitas de viver e registrar memórias. É por isso que trabalhamos todos os dias para transformar destinos marcantes em histórias reais.",
  footerText: "Curadoria de Roteiros Exclusivos",
  footerAddress: "Atendimento Presencial & On-line, Balneário Camboriú - SC",
  footerEmail: "financeiro@arcadaneviagens.com",
  customTripTitle: "Viagens personalizadas:",
  customTripSubtitle: "Experiências exclusivas, desenhadas para você.",
  customTripButtonText: "Clique e fale com a Arcadane!",
  widgetType: "whatsapp"
};

export const DEFAULT_PROMO_PACKAGES: PromoPackage[] = [
  {
    id: "ilheus-chapeco",
    title: "Ilhéus & Costa do Cacau",
    route: "Ilhéus ⇄ Chapecó",
    origin: "XAP",
    destination: "IOS",
    tag: "Nordeste Paradisíaco",
    badge: "Oferta Exclusiva",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=RlJUIHwgNDIwNzE0IHwgMDFDOUVFRDAzQzUwRkY5RERGNjcwQTA5MUZCNjZBQ0Q=&shouldShowPay=true",
    description: "Desfrute do sol baiano na aprazível Costa do Cacau. Lindas praias cercadas por coqueirais, história colonial rica e o cenário gastronômico único idealizado nas obras de Jorge Amado.",
    highlights: [
      "Passagem aérea ida e volta inclusa",
      "Hospedagem selecionada à beira-mar",
      "Ideal para famílias e casais",
      "Suporte Arcadane durante toda a estadia"
    ],
    waMessage: "Olá Arcadane! Vi a promoção de Ilhéus saindo de Chapecó no site de vocês. Gostaria de saber mais informações e personalizar as datas.",
    price: "1.890"
  },
  {
    id: "salvador-sauipe",
    title: "Salvador & Costa do Sauípe",
    route: "Salvador / Costa do Sauípe ⇄ Chapecó",
    origin: "XAP",
    destination: "SSA",
    tag: "Resort All-Inclusive",
    badge: "Mais Procurado",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/link?token=RlJUIHwgNDIwNzMyIHwgQjBEOUJGRjYyNTQ1NzhEMTUyODEwQjgwMDQ0QkE1QkI%3D&shouldShowPay=true&option=2",
    description: "O melhor de dois mundos: o axé vibrante da histórica capital de Salvador combinado à sofisticação e infraestrutura de lazer incomparável de um resort de alto padrão na Costa do Sauípe.",
    highlights: [
      "Voo saindo direto de Chapecó",
      "Opções de resorts com tudo incluso",
      "Acesso à gastronomia e atrações do Pelourinho",
      "Experiência relaxante de frente para o mar"
    ],
    waMessage: "Olá Arcadane! Estou muito interessada no pacote de Salvador / Costa do Sauípe saindo de Chapecó. Como faço para reservar?",
    price: "3.490"
  },
  {
    id: "porto-galinhas",
    title: "Porto de Galinhas",
    route: "Porto de Galinhas ⇄ Chapecó",
    origin: "XAP",
    destination: "REC",
    tag: "Piscinas Naturais",
    badge: "Favorito do Público",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=RlJUIHwgNDIwNzUxIHwgNjYzMUQyRTUxMjk4MjY5NUIyRDVBMzFCM0NEMkEyQjk=&shouldShowPay=true",
    description: "Mergulhe nas famosas piscinas naturais de águas mornas e cristalinas repletas de peixes coloridos. Um destino encantador com excelente gastronomia e passeios de jangada clássicos.",
    highlights: [
      "Aéreo completo de ida e volta",
      "Hospedagem em pousada charmosa ou resort",
      "Passeios incríveis de bugue pelas praias",
      "Assistência VIP Arcadane"
    ],
    waMessage: "Olá Arcadane! Vi o orçamento promocional para Porto de Galinhas saindo de Chapecó. Gostaria de consultar disponibilidade para outras datas.",
    price: "2.690"
  },
  {
    id: "fln-natal",
    title: "Natal & Dunas de Genipabu",
    route: "Natal ⇄ Florianópolis",
    origin: "FLN",
    destination: "NAT",
    tag: "Sol & Aventura",
    badge: "Tarifa Especial",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=Q0FUSSB8IDU1NjkxNzcgfCAxQkFCQUU2ODE5QThDQkRCRDEzOTMxNzM1M0FDRTM0MA==&shouldShowPay=true",
    description: "A encantadora Cidade do Sol espera por você. Maravilhe-se com as dunas móveis monumentais de Genipabu, tome banho nas lagoas cristalinas e desfrute de alta hotelaria em Ponta Negra.",
    highlights: [
      "Partida confortável de Florianópolis",
      "Hotéis selecionados com café da manhã farto",
      "Roteiro de sol o ano inteiro garantido",
      "Condições de pagamento facilitadas"
    ],
    waMessage: "Olá Arcadane! Vi a oferta sensacional de Florianópolis para Natal no site. Gostaria de obter mais detalhes sobre o voo e reservas.",
    price: "2.990"
  },
  {
    id: "curitiba-foz",
    title: "Foz do Iguaçu Maravilhosa",
    route: "Foz do Iguaçu ⇄ Curitiba",
    origin: "CWB",
    destination: "IGU",
    tag: "Natureza Monumental",
    badge: "Ecoturismo de Elite",
    image: "https://images.unsplash.com/photo-1581404476143-fb31d742929f?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=RlJUIHwgNDI2MTE1IHwgRkJCMkI3MjUzNEU0OENEREQ0QzkyQjQ0OTE2OUQyQTU=&shouldShowPay=true",
    description: "Uma das novas 7 maravilhas naturais do mundo. Sinta a imensa energia das Cataratas do Iguaçu e divirta-se com passeios de barco Macuco Safari e parque das aves.",
    highlights: [
      "Curta viagem saindo diretamente de Curitiba",
      "Hospedagem próxima aos principais pontos turísticos",
      "Perfeito para feriados prolongados",
      "Suporte completo local Arcadane"
    ],
    waMessage: "Olá Arcadane! Gostaria de consultar o pacote promocional de Curitiba para Foz do Iguaçu. Vi o link no site de vocês.",
    price: "1.290"
  },
  {
    id: "fln-santiago",
    title: "Santiago & Cordilheira",
    route: "Santiago ⇄ Florianópolis",
    origin: "FLN",
    destination: "SCL",
    tag: "Neve & Vinhedos",
    badge: "Destaque Sul",
    image: "https://images.unsplash.com/photo-1512813583145-baaa340ef29f?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=Q0FUSSB8IDU1ODI4NDAgfCAyQjcyQ0JGOERGNEJEMTZDMzhFMENBMEI3RTFGRTNERA==&shouldShowPay=true",
    description: "Explore a vibrante capital chilena emoldurada pela imponente Cordilheira dos Andes. Roteiro unindo degustação em vinícolas premiadas como Concha y Toro, visita a Valparaíso e passeios panorâmicos na neve.",
    highlights: [
      "Partida confortável saindo de Florianópolis",
      "Hospedagem em área nobre de Providencia ou Las Condes",
      "Tour panorâmico Cordilheira dos Andes",
      "Passeio guiado de vinhos com degustações inclusas"
    ],
    waMessage: "Olá Arcadane! Gostaria de consultar o pacote promocional de Florianópolis para Santiago. Vocês conseguem personalizar as datas para mim?",
    price: "2.895"
  },
  {
    id: "fln-bue",
    title: "Buenos Aires Especial",
    route: "Buenos Aires ⇄ Florianópolis",
    origin: "FLN",
    destination: "BUE",
    tag: "Tango & Gastronomia",
    badge: "Favorito Latino",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=Q0FUSSB8IDU1ODI4MzEgfCA5NUVENkUyMDc4MTM1OEY2RTZFNkExMzI2RUQxODRFOQ==&shouldShowPay=true",
    description: "Sinta a pulsação cultural da charmosa Buenos Aires. Roteiro exclusivo unindo apresentações de Tango apaixonantes, alta gastronomia com vinhos incomparáveis, passeios históricos e compras.",
    highlights: [
      "Voo direto ou rápida conexão de Florianópolis",
      "Hospedagem em hotel boutique central em Recoleta ou Palermo",
      "Show de tango clássico com jantar especial de cortes finos incluso",
      "Atendimento e suporte personalizado Arcadane"
    ],
    waMessage: "Olá Arcadane! Vi o pacote promocional de Florianópolis para Buenos Aires no site de vocês. Gostaria de mais informações sobre disponibilidade.",
    price: "2.490"
  },
  {
    id: "fln-punta-cana",
    title: "Punta Cana Resorts All-Inclusive",
    route: "Punta Cana ⇄ Florianópolis",
    origin: "FLN",
    destination: "PUJ",
    tag: "Paraíso no Caribe",
    badge: "Premium Exclusivo",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=600",
    link: "https://premium.infotravel.com.br/orcamento-web/pt/link?token=Q0FUSSB8IDU1ODI4NTAgfCAwQUMxNTAxRTUyNTg3NjYyQ0U5Rjg2OTQzQzk5N0JFOA==&shouldShowPay=true",
    description: "Relaxe nas areias brancas e sob as palmeiras de Punta Cana de frente para o mar azul-turquesa do Caribe. Viva uma estadia dos sonhos em resort All-Inclusive premium repleto de entretenimento e gastronomia 5 estrelas.",
    highlights: [
      "Venda de aéreo saindo de Florianópolis incluso",
      "Hospedagem de luxo em resort All-Inclusive",
      "Bebidas, refeições e lazer sem limite inclusos",
      "Suporte Arcadane 24h para assistência em viagem"
    ],
    waMessage: "Olá Arcadane! Vi a incrível promoção All-Inclusive para Punta Cana saindo de Florianópolis. Gostaria de cotar para mim e minha família.",
    price: "5.890"
  }
];

export const DEFAULT_LUXURY_TRIPS: LuxuryTrip[] = [
  {
    id: "belezas-da-china",
    title: "Belezas da China",
    subTitle: "A perfeita união entre Dinastias Milenares e o Futuro Digital",
    operator: "Queensberry Especial",
    duration: "15 Dias",
    tag: "Ásia & Legado Histórico",
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800",
    description: "Uma fascinante imersão que interliga mais de cinco mil anos de sabedoria e tradição milenar com o auge da vanguarda e modernidade digital. Explore palácios imperiais, as paisagens de calcário de Guilin que inspiraram pinturas clássicas e a pulsação de Xangai.",
    highlights: [
      "Pequim: A imponente Cidade Proibida e a Grande Muralha",
      "Xian: Os misteriosos Soldados de Terracota de Qin Shi Huang",
      "Guilin: Cruzeiro exuberante pelo idílico Rio Li",
      "Xangai: Modernidade no The Bund e arquitetura futurista"
    ],
    link: "https://queensberry.com.br/programa/detalhes/tourregular/asia/R024/belezas-da-china/",
    badgeColor: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    waMessage: "Olá Arcadane! Vi o roteiro de luxo curado 'Belezas da China' (Queensberry) no site e gostaria de agendar uma consultoria exclusiva com vocês."
  },
  {
    id: "islandia-magia-luzes",
    title: "Elas Viajam Islândia: A Magia das Luzes do Norte",
    subTitle: "Grupo Exclusivo para Mulheres na Terra do Gelo e Fogo",
    operator: "Orinter Especial",
    duration: "10 Dias / 8 Noites",
    tag: "Aurora Boreal & Bem-Estar",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=80&w=800",
    description: "Uma jornada extraordinária desenhada especialmente para um grupo unido de mulheres audazes. Contemplem o céu noturno dançando em tons esmeralda nas caçadas guiadas de Aurora Boreal e relaxem nas águas termais rejuvenescedoras da mística Blue Lagoon.",
    highlights: [
      "Caçadas noturnas à magnífica Aurora Boreal guiadas",
      "Visitas ao Círculo de Ouro: Geysir e as cataratas Gullfoss",
      "Acesso Premium VIP à famosa lagoa termal Blue Lagoon",
      "Voo panorâmico e passeios pelas enigmáticas praias negras de Vik"
    ],
    link: "https://online.orinter.com.br/orcamento-web/pt/link?token=T1JJIHwgMTI5MjQyMTkgfCBDM0Q2MUNBNDc3M0Q5Q0U4NjkwODI3MzIyRkZBMDA4Mw==",
    badgeColor: "bg-brand-secondary/20 text-brand-chocolate border-brand-secondary/30",
    waMessage: "Olá Arcadane! Estou muito interessada no grupo de luxo 'Elas Viajam Islândia: Luzes do Norte' (Orinter) e gostaria de solicitar uma consultoria para mim."
  }
];

// Keys
const KEYS = {
  SERVICES: 'arcadane_cms_services',
  PACKAGES: 'arcadane_cms_packages',
  PROMO_PACKAGES: 'arcadane_cms_promo_packages',
  BLOG_POSTS: 'arcadane_cms_blog_posts',
  TESTIMONIALS: 'arcadane_cms_testimonials',
  SEO: 'arcadane_cms_seo_settings',
  HOME: 'arcadane_cms_home_settings',
  LUXURY_TRIPS: 'arcadane_cms_luxury_trips',
};

// Helpers
const fallbackServices = fallbackData.arcadane_cms_services as ServiceItem[] | null;
const fallbackPackages = fallbackData.arcadane_cms_packages as PackageItem[] | null;
const fallbackPromoPackages = fallbackData.arcadane_cms_promo_packages as PromoPackage[] | null;
const fallbackBlogPosts = fallbackData.arcadane_cms_blog_posts as BlogPost[] | null;
const fallbackTestimonials = fallbackData.arcadane_cms_testimonials as TestimonialItem[] | null;
const fallbackSeoSettings = fallbackData.arcadane_cms_seo_settings as SeoSettings | null;
const fallbackHomeSettings = fallbackData.arcadane_cms_home_settings as HomeSettings | null;
const fallbackLuxuryTrips = fallbackData.arcadane_cms_luxury_trips as LuxuryTrip[] | null;

const FALLBACK_SERVICES = fallbackServices && fallbackServices.length > 0 ? fallbackServices : DEFAULT_SERVICES;
const FALLBACK_PACKAGES = fallbackPackages && fallbackPackages.length > 0 ? fallbackPackages : DEFAULT_PACKAGES;
const FALLBACK_PROMO_PACKAGES = fallbackPromoPackages && fallbackPromoPackages.length > 0 ? fallbackPromoPackages : DEFAULT_PROMO_PACKAGES;
const FALLBACK_BLOG_POSTS = fallbackBlogPosts && fallbackBlogPosts.length > 0 ? fallbackBlogPosts : DEFAULT_BLOG_POSTS;
const FALLBACK_TESTIMONIALS = fallbackTestimonials && fallbackTestimonials.length > 0 ? fallbackTestimonials : DEFAULT_TESTIMONIALS;
const FALLBACK_SEO_SETTINGS = fallbackSeoSettings ? { ...DEFAULT_SEO_SETTINGS, ...fallbackSeoSettings } : DEFAULT_SEO_SETTINGS;
const FALLBACK_HOME_SETTINGS = fallbackHomeSettings ? { ...DEFAULT_HOME_SETTINGS, ...fallbackHomeSettings } : DEFAULT_HOME_SETTINGS;
const FALLBACK_LUXURY_TRIPS = fallbackLuxuryTrips && fallbackLuxuryTrips.length > 0 ? fallbackLuxuryTrips : DEFAULT_LUXURY_TRIPS;

export function getServices(): ServiceItem[] {
  if (typeof window === 'undefined') return FALLBACK_SERVICES;
  const data = localStorage.getItem(KEYS.SERVICES);
  if (!data) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(FALLBACK_SERVICES));
    return FALLBACK_SERVICES;
  }
  return JSON.parse(data);
}

export function saveServices(services: ServiceItem[]): void {
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
  broadcastChange();
}

export function getPackages(): PackageItem[] {
  if (typeof window === 'undefined') return FALLBACK_PACKAGES;
  const data = localStorage.getItem(KEYS.PACKAGES);
  if (!data) {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(FALLBACK_PACKAGES));
    return FALLBACK_PACKAGES;
  }
  return JSON.parse(data);
}

export function savePackages(packages: PackageItem[]): void {
  localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packages));
  broadcastChange();
}

export function getPromoPackages(): PromoPackage[] {
  if (typeof window === 'undefined') return FALLBACK_PROMO_PACKAGES;
  const data = localStorage.getItem(KEYS.PROMO_PACKAGES);
  if (!data) {
    localStorage.setItem(KEYS.PROMO_PACKAGES, JSON.stringify(FALLBACK_PROMO_PACKAGES));
    return FALLBACK_PROMO_PACKAGES;
  }
  
  let parsed = JSON.parse(data) as PromoPackage[];
  
  // Rule out any legacy default promo packages that are no longer in FALLBACK_PROMO_PACKAGES
  const defaultIds = FALLBACK_PROMO_PACKAGES.map(d => d.id);
  
  let hasChanges = false;
  const updatedList = parsed.filter(item => {
    // Keep user-created ones (usually starting with 'promo-') or if they are in defaultIds
    return item.id.startsWith('promo-') || defaultIds.includes(item.id);
  });
  
  if (parsed.length !== updatedList.length) {
    hasChanges = true;
  }
  
  const merged = [...updatedList];
  FALLBACK_PROMO_PACKAGES.forEach(def => {
    if (!merged.some(m => m.id === def.id)) {
      merged.push(def);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    localStorage.setItem(KEYS.PROMO_PACKAGES, JSON.stringify(merged));
    return merged;
  }
  
  return parsed;
}

export function savePromoPackages(promos: PromoPackage[]): void {
  try {
    localStorage.setItem(KEYS.PROMO_PACKAGES, JSON.stringify(promos));
    broadcastChange();
  } catch (error) {
    console.error('Failed to save promo packages to localStorage:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Erro: Limite de armazenamento excedido! A imagem que você tentou enviar é muito grande. Nós reduzimos o tamanho automaticamente, mas se o erro persistir, use um link de imagem ou remova fotos antigas.');
    } else {
      alert('Erro ao salvar as alterações do pacote.');
    }
  }
}

export function getBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return FALLBACK_BLOG_POSTS;
  const data = localStorage.getItem(KEYS.BLOG_POSTS);
  if (!data) {
    localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(FALLBACK_BLOG_POSTS));
    return FALLBACK_BLOG_POSTS;
  }
  return JSON.parse(data);
}

export function saveBlogPosts(posts: BlogPost[]): void {
  localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(posts));
  broadcastChange();
}

export function getTestimonials(): TestimonialItem[] {
  if (typeof window === 'undefined') return FALLBACK_TESTIMONIALS;
  const data = localStorage.getItem(KEYS.TESTIMONIALS);
  if (!data) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(FALLBACK_TESTIMONIALS));
    return FALLBACK_TESTIMONIALS;
  }
  try {
    const list = JSON.parse(data) as TestimonialItem[];
    if (list.length === 0) {
      localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(FALLBACK_TESTIMONIALS));
      return FALLBACK_TESTIMONIALS;
    }
    return list;
  } catch (e) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(FALLBACK_TESTIMONIALS));
    return FALLBACK_TESTIMONIALS;
  }
}

export function saveTestimonials(testimonials: TestimonialItem[]): void {
  try {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    broadcastChange();
  } catch (error) {
    console.error('Failed to save testimonials to localStorage:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Erro: Limite de armazenamento excedido! A foto que você tentou enviar é muito grande. Nós reduzimos o tamanho automaticamente, mas se o erro persistir, tente outra foto ou use um link de URL.');
    } else {
      alert('Erro ao salvar as alterações do depoimento.');
    }
  }
}

export function getSeoSettings(): SeoSettings {
  if (typeof window === 'undefined') return FALLBACK_SEO_SETTINGS;
  const data = localStorage.getItem(KEYS.SEO);
  if (!data) {
    localStorage.setItem(KEYS.SEO, JSON.stringify(FALLBACK_SEO_SETTINGS));
    return FALLBACK_SEO_SETTINGS;
  }
  return { ...FALLBACK_SEO_SETTINGS, ...JSON.parse(data) };
}

export function saveSeoSettings(settings: SeoSettings): void {
  localStorage.setItem(KEYS.SEO, JSON.stringify(settings));
  applySeoSettings(settings);
  broadcastChange();
}

export function getHomeSettings(): HomeSettings {
  if (typeof window === 'undefined') return FALLBACK_HOME_SETTINGS;
  const data = localStorage.getItem(KEYS.HOME);
  if (!data) {
    localStorage.setItem(KEYS.HOME, JSON.stringify(FALLBACK_HOME_SETTINGS));
    return FALLBACK_HOME_SETTINGS;
  }
  return { ...FALLBACK_HOME_SETTINGS, ...JSON.parse(data) };
}

export function saveHomeSettings(settings: HomeSettings): void {
  localStorage.setItem(KEYS.HOME, JSON.stringify(settings));
  broadcastChange();
}

export function getLuxuryItineraries(): LuxuryTrip[] {
  if (typeof window === 'undefined') return FALLBACK_LUXURY_TRIPS;
  const data = localStorage.getItem(KEYS.LUXURY_TRIPS);
  if (!data) {
    localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(FALLBACK_LUXURY_TRIPS));
    return FALLBACK_LUXURY_TRIPS;
  }
  try {
    const list = JSON.parse(data) as LuxuryTrip[];
    if (list.length === 0) {
      localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(FALLBACK_LUXURY_TRIPS));
      return FALLBACK_LUXURY_TRIPS;
    }
    return list;
  } catch (e) {
    localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(FALLBACK_LUXURY_TRIPS));
    return FALLBACK_LUXURY_TRIPS;
  }
}

export function saveLuxuryItineraries(trips: LuxuryTrip[]): void {
  localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(trips));
  broadcastChange();
}

export function getFoundersPhoto(): string | null {
  if (typeof window === 'undefined') return fallbackData.arcadane_founders_photo || null;
  const data = localStorage.getItem('arcadane_founders_photo');
  if (!data) {
    if (fallbackData.arcadane_founders_photo) {
      localStorage.setItem('arcadane_founders_photo', fallbackData.arcadane_founders_photo);
      return fallbackData.arcadane_founders_photo;
    }
    return null;
  }
  return data;
}

export function getCustomLogo(): string | null {
  if (typeof window === 'undefined') return (fallbackData as any).arcadane_custom_logo || null;
  const data = localStorage.getItem('arcadane_custom_logo');
  if (!data) {
    if ((fallbackData as any).arcadane_custom_logo) {
      localStorage.setItem('arcadane_custom_logo', (fallbackData as any).arcadane_custom_logo);
      return (fallbackData as any).arcadane_custom_logo;
    }
    return null;
  }
  return data;
}

export function getTrajectoryPhoto(): string | null {
  if (typeof window === 'undefined') return fallbackData.arcadane_trajectory_photo || null;
  const data = localStorage.getItem('arcadane_trajectory_photo');
  if (!data) {
    if (fallbackData.arcadane_trajectory_photo) {
      localStorage.setItem('arcadane_trajectory_photo', fallbackData.arcadane_trajectory_photo);
      return fallbackData.arcadane_trajectory_photo;
    }
    return null;
  }
  return data;
}

// Reset entire database to defaults
export function resetCmsToDefault(): void {
  localStorage.removeItem(KEYS.SERVICES);
  localStorage.removeItem(KEYS.PACKAGES);
  localStorage.removeItem(KEYS.PROMO_PACKAGES);
  localStorage.removeItem(KEYS.BLOG_POSTS);
  localStorage.removeItem(KEYS.TESTIMONIALS);
  localStorage.removeItem(KEYS.SEO);
  localStorage.removeItem(KEYS.HOME);
  localStorage.removeItem(KEYS.LUXURY_TRIPS);
  localStorage.removeItem('arcadane_founders_photo');
  localStorage.removeItem('arcadane_trajectory_photo');
  localStorage.removeItem('arcadane_custom_logo');
  applySeoSettings(DEFAULT_SEO_SETTINGS);
  broadcastChange();
}

// Apply SEO dynamically to browser tabs
export function applySeoSettings(settings: SeoSettings): void {
  if (typeof document !== 'undefined') {
    document.title = settings.siteTitle;
    
    // Dynamically apply primary and secondary brand colors
    const primary = settings.primaryColor || '#3B5EA4';
    const secondary = settings.secondaryColor || '#AF4934';
    document.documentElement.style.setProperty('--color-brand-primary', primary);
    document.documentElement.style.setProperty('--color-brand-secondary', secondary);
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', settings.metaDescription);

    let keysMeta = document.querySelector('meta[name="keywords"]');
    if (!keysMeta) {
      keysMeta = document.createElement('meta');
      keysMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keysMeta);
    }
    keysMeta.setAttribute('content', settings.keywords);

    // Apply custom favicon if specified, or inject custom stylesheet
    if (settings.faviconUrl) {
      let iconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.setAttribute('rel', 'icon');
        document.head.appendChild(iconLink);
      }
      iconLink.setAttribute('href', settings.faviconUrl);
    }
  }
}

// Custom event notifier to update components instantly
export function broadcastChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  }
}

// Automatic synchronization from browser local storage to workspace file on server
export async function autoSyncToServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const dataToSync = {
      arcadane_cms_services: JSON.parse(localStorage.getItem(KEYS.SERVICES) || 'null'),
      arcadane_cms_packages: JSON.parse(localStorage.getItem(KEYS.PACKAGES) || 'null'),
      arcadane_cms_promo_packages: JSON.parse(localStorage.getItem(KEYS.PROMO_PACKAGES) || 'null'),
      arcadane_cms_blog_posts: JSON.parse(localStorage.getItem(KEYS.BLOG_POSTS) || 'null'),
      arcadane_cms_testimonials: JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || 'null'),
      arcadane_cms_seo_settings: JSON.parse(localStorage.getItem(KEYS.SEO) || 'null'),
      arcadane_cms_home_settings: JSON.parse(localStorage.getItem(KEYS.HOME) || 'null'),
      arcadane_cms_luxury_trips: JSON.parse(localStorage.getItem(KEYS.LUXURY_TRIPS) || 'null'),
      arcadane_founders_photo: localStorage.getItem('arcadane_founders_photo'),
      arcadane_trajectory_photo: localStorage.getItem('arcadane_trajectory_photo'),
      arcadane_custom_logo: localStorage.getItem('arcadane_custom_logo')
    };

    // Only sync if at least some customized data exists
    const hasAnyLocalData = Object.values(dataToSync).some(val => val !== null);
    if (!hasAnyLocalData) return;

    await fetch('/api/save-cms-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSync),
    });
  } catch (error) {
    console.warn('Silent CMS state background sync failed:', error);
  }
}

// Web-only startup and event listeners to keep localStorage synced to project files
export async function initializeCmsStore(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // 1. Check if we have any data in localStorage. If we don't, or if the code revision (updatedAt) is different,
  // initialize/overwrite with the statically bundled fallbackData. This allows chat-modified code values to instantly apply!
  try {
    const currentRevision = localStorage.getItem('arcadane_cms_revision');
    const incomingRevision = (fallbackData as any).updatedAt || 'initial';
    const hasExistingData = localStorage.getItem(KEYS.SERVICES) !== null;
    
    if (!hasExistingData || currentRevision !== incomingRevision) {
      console.log(`Initializing/Updating localStorage with bundled fallbackData (revision: ${incomingRevision})...`);
      
      localStorage.setItem('arcadane_cms_revision', incomingRevision);
      
      if (fallbackServices && fallbackServices.length > 0) {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(fallbackServices));
      } else {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      }
      
      if (fallbackPackages && fallbackPackages.length > 0) {
        localStorage.setItem(KEYS.PACKAGES, JSON.stringify(fallbackPackages));
      } else {
        localStorage.setItem(KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
      }
      
      if (fallbackPromoPackages && fallbackPromoPackages.length > 0) {
        localStorage.setItem(KEYS.PROMO_PACKAGES, JSON.stringify(fallbackPromoPackages));
      } else {
        localStorage.setItem(KEYS.PROMO_PACKAGES, JSON.stringify(DEFAULT_PROMO_PACKAGES));
      }
      
      if (fallbackBlogPosts && fallbackBlogPosts.length > 0) {
        localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(fallbackBlogPosts));
      } else {
        localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(DEFAULT_BLOG_POSTS));
      }
      
      if (fallbackTestimonials && fallbackTestimonials.length > 0) {
        localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(fallbackTestimonials));
      } else {
        localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
      }
      
      if (fallbackSeoSettings) {
        localStorage.setItem(KEYS.SEO, JSON.stringify({ ...DEFAULT_SEO_SETTINGS, ...fallbackSeoSettings }));
      } else {
        localStorage.setItem(KEYS.SEO, JSON.stringify(DEFAULT_SEO_SETTINGS));
      }
      
      if (fallbackHomeSettings) {
        localStorage.setItem(KEYS.HOME, JSON.stringify({ ...DEFAULT_HOME_SETTINGS, ...fallbackHomeSettings }));
      } else {
        localStorage.setItem(KEYS.HOME, JSON.stringify(DEFAULT_HOME_SETTINGS));
      }
      
      if (fallbackLuxuryTrips && fallbackLuxuryTrips.length > 0) {
        localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(fallbackLuxuryTrips));
      } else {
        localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(DEFAULT_LUXURY_TRIPS));
      }
      
      if (fallbackData.arcadane_founders_photo) {
        localStorage.setItem('arcadane_founders_photo', fallbackData.arcadane_founders_photo);
      } else {
        localStorage.removeItem('arcadane_founders_photo');
      }
      if (fallbackData.arcadane_trajectory_photo) {
        localStorage.setItem('arcadane_trajectory_photo', fallbackData.arcadane_trajectory_photo);
      } else {
        localStorage.removeItem('arcadane_trajectory_photo');
      }
      if ((fallbackData as any).arcadane_custom_logo) {
        localStorage.setItem('arcadane_custom_logo', (fallbackData as any).arcadane_custom_logo);
      } else {
        localStorage.removeItem('arcadane_custom_logo');
      }
    }
    
    // Always apply current SEO settings immediately so page title matches loaded config
    const currentSeo = localStorage.getItem(KEYS.SEO);
    if (currentSeo) {
      applySeoSettings(JSON.parse(currentSeo));
    } else {
      applySeoSettings(fallbackSeoSettings ? { ...DEFAULT_SEO_SETTINGS, ...fallbackSeoSettings } : DEFAULT_SEO_SETTINGS);
    }
  } catch (err) {
    console.warn('Failed to perform initial localStorage check:', err);
  }

  // 2. Try to fetch the latest saved state from the server.
  // This ensures that updates written to the server's disk are pulled and applied
  // to the user's/visitor's browser, overcoming static bundle limitations!
  try {
    const response = await fetch('/api/get-cms-state');
    if (response.ok) {
      const serverData = await response.json();
      if (serverData && typeof serverData === 'object') {
        console.log('Successfully fetched updated CMS state from server! Synchronizing...');
        let updated = false;

        const updateKey = (localKey: string, serverVal: any) => {
          if (serverVal !== undefined && serverVal !== null) {
            const currentVal = localStorage.getItem(localKey);
            const serverValStr = typeof serverVal === 'string' ? serverVal : JSON.stringify(serverVal);
            if (currentVal !== serverValStr) {
              localStorage.setItem(localKey, serverValStr);
              updated = true;
            }
          }
        };

        updateKey(KEYS.SERVICES, serverData.arcadane_cms_services);
        updateKey(KEYS.PACKAGES, serverData.arcadane_cms_packages);
        updateKey(KEYS.PROMO_PACKAGES, serverData.arcadane_cms_promo_packages);
        updateKey(KEYS.BLOG_POSTS, serverData.arcadane_cms_blog_posts);
        updateKey(KEYS.TESTIMONIALS, serverData.arcadane_cms_testimonials);
        updateKey(KEYS.SEO, serverData.arcadane_cms_seo_settings);
        updateKey(KEYS.HOME, serverData.arcadane_cms_home_settings);
        updateKey(KEYS.LUXURY_TRIPS, serverData.arcadane_cms_luxury_trips);
        updateKey('arcadane_founders_photo', serverData.arcadane_founders_photo);
        updateKey('arcadane_trajectory_photo', serverData.arcadane_trajectory_photo);
        updateKey('arcadane_custom_logo', serverData.arcadane_custom_logo);
        updateKey('arcadane_cms_revision', serverData.updatedAt);

        if (updated) {
          console.log('CMS state updated from server. Broadcasting change...');
          broadcastChange();
          // Apply new SEO settings
          const freshSeo = localStorage.getItem(KEYS.SEO);
          if (freshSeo) {
            try {
              applySeoSettings(JSON.parse(freshSeo));
            } catch (e) {}
          }
        }
      }
    }
  } catch (err) {
    console.info('Server CMS state fetch not available or failed:', err);
  }
}

if (typeof window !== 'undefined') {
  initializeCmsStore();

  window.addEventListener('arcadane_cms_data_changed', () => {
    autoSyncToServer();
  });
  window.addEventListener('arcadane_logo_changed', () => {
    autoSyncToServer();
  });
}
