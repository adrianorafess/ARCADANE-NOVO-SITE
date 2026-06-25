import { ServiceItem, TestimonialItem, PackageItem, BlogPost, LuxuryTrip } from '../types';
import { SERVICES as DEFAULT_SERVICES, TESTIMONIALS as DEFAULT_TESTIMONIALS, PACKAGES as DEFAULT_PACKAGES, BLOG_POSTS as DEFAULT_BLOG_POSTS } from '../data';
import fallbackData from './cmsStoreFallback.json';
import { saveToFirebase, setupFirebaseRealtimeListener, loadFromFirebase } from './firebase';

let isSyncingFromFirebase = false;

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

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  bgColorLight: string;
  textColorDark: string;
  chocolateColor: string;
  beigeColor: string;
  borderColor: string;
  
  fontSans: string;
  fontDisplay: string;
  fontSerif: string;
  
  buttonRadius: 'rounded-none' | 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  buttonStyle: 'solid' | 'outline' | 'shadow-lux' | 'glass';
  
  heroBannerType: 'video' | 'image';
  heroBannerImageUrl: string;
  heroOverlayOpacity: number;
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
  widgetPosition?: 'top' | 'bottom' | 'left' | 'right' | 'middle';
  
  // Custom Dynamic Layout configurations
  preloaderType?: 'pulse' | 'spin' | 'flip' | 'modern' | 'zoom';
  footerCopyright?: string;
  footerCol1Title?: string;
  footerCol1Links?: string; // Semicolon-separated label|pageId or label|url
  footerCol2Title?: string;
  footerCol2Links?: string; // Semicolon-separated label|pageId or label|url
  
  // Custom Menu & Sub-menu Configurations
  menuLabelHome?: string;
  menuLabelServices?: string;
  menuLabelPackages?: string;
  menuLabelAboutUs?: string;
  menuLabelCustomTrip?: string;
  menuLabelBlog?: string;
  menuLabelContactUs?: string;
  
  // Submenus configuration strings (label|targetPageId or label|url)
  submenuPackagesLinks?: string;
  submenuCustomTripLinks?: string;

  // Show/Hide pages in menu
  hideHomeInMenu?: boolean;
  hideServicesInMenu?: boolean;
  hidePackagesInMenu?: boolean;
  hideAboutUsInMenu?: boolean;
  hideCustomTripInMenu?: boolean;
  hideBlogInMenu?: boolean;
  hideContactUsInMenu?: boolean;

  // Show/Hide pages on site entirely
  hideHome?: boolean;
  hideServices?: boolean;
  hidePackages?: boolean;
  hideAboutUs?: boolean;
  hideCustomTrip?: boolean;
  hideBlog?: boolean;
  hideContactUs?: boolean;
}

export interface CustomPage {
  id: string; // Slug/ID
  title: string;
  content: string; // Markdown / Text
  metaDescription?: string;
  keywords?: string;
  addToMenu?: boolean;
  menuLabel?: string;
  externalUrl?: string; // If this is an external redirect link instead of a custom page
  isActive?: boolean;
}

export interface DomainSettings {
  primaryDomain: string;
  subdomain: string;
  dnsStatus: 'active' | 'pending_dns' | 'not_configured';
  ipAddress: string;
  cnameRecord: string;
}

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'destinos-vip',
    title: 'Destinos VIP e Exclusivos',
    content: '### Viagens Sob Medida de Altíssimo Padrão\n\nA Arcadane Viagens orgulhosamente oferece serviços de assessoria especializada para destinos altamente exclusivos no mundo todo. Desde ilhas privadas nas Maldivas até chalés de neve nos Alpes Suíços.\n\nFale conosco para desenhar a sua próxima grande aventura com a sofisticação e os detalhes impecáveis que só a Arcadane pode entregar.',
    metaDescription: 'Descubra os destinos VIP e de luxo mais exclusivos do mundo com assessoria completa Arcadane Viagens.',
    keywords: 'luxo, vip, viagens exclusivas, maldivas, alpes',
    addToMenu: true,
    menuLabel: 'Destinos VIP'
  },
  {
    id: 'seguro-viagem',
    title: 'Seguro Viagem Premium',
    content: '### Segurança e Proteção Completa em Suas Viagens\n\nViajar com tranquilidade é o maior luxo de todos. Nossa curadoria inclui apólices de seguro viagem de alto padrão com coberturas robustas para despesas médicas, extravio de bagagem de luxo e cancelamentos imprevistos.\n\nGaranta a melhor cobertura internacional com nossa equipe de concierge dedicada.',
    metaDescription: 'Proteja a sua jornada de alto padrão com a nossa assistência e seguro de viagem premium.',
    keywords: 'seguro viagem, cobertura de luxo, assistência internacional, concierge',
    addToMenu: false,
    menuLabel: 'Seguro Viagem'
  }
];

export const DEFAULT_DOMAIN_SETTINGS: DomainSettings = {
  primaryDomain: 'www.arcadaneviagens.com.br',
  subdomain: 'vip.arcadaneviagens.com.br',
  dnsStatus: 'active',
  ipAddress: '185.224.137.42',
  cnameRecord: 'cname.hostinger.com'
};

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
  siteTitle: "Arcadane Viagens - Agência de viagem em Balneário Camboriú",
  metaDescription: "A Arcadane Viagens é a sua agência de viagens em Balneário Camboriú especializada em roteiros personalizados, viagens de luxo e curadoria exclusiva de experiências pelo mundo.",
  keywords: "agência de viagens balneário camboriú, viagens de luxo, roteiros de viagem personalizados, turismo de alto padrão, arcadane viagens, passagens executivas, hotéis de luxo, consultoria de viagem, balneário camboriú turismo, maria mateus mariana, roteiros exclusivos",
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

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primaryColor: '#3B5EA4',
  secondaryColor: '#AF4934',
  bgColorLight: '#FDFBF6',
  textColorDark: '#3A2F28',
  chocolateColor: '#6F5B4E',
  beigeColor: '#F3EEE3',
  borderColor: '#DCCFC1',
  
  fontSans: '"Montserrat", "Inter", sans-serif',
  fontDisplay: '"Montserrat", "Cormorant Garamond", Georgia, serif',
  fontSerif: '"Cormorant Garamond", Georgia, serif',
  
  buttonRadius: 'rounded-full',
  buttonStyle: 'solid',
  
  heroBannerType: 'video',
  heroBannerImageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1600',
  heroOverlayOpacity: 55,
};

const DEFAULT_HOME_SETTINGS: HomeSettings = {
  heroTitle: "A arte de viajar <span class=\"font-serif font-normal italic text-brand-secondary\">sob medida</span>",
  heroSubtitle: "Curadoria de destinos exclusivos, hotéis extraordinários e planejamento técnico de excelência.",
  heroVideoUrl: "https://www.youtube.com/watch?v=1VhezN-EFfg",
  aboutUsHeadline: "Nossa trajetória, nosso propósito",
  aboutUsSubheadline: "Sua jornada desenhada por especialistas",
  aboutUsText: "A Arcadane Viagens nasceu com o propósito de transformar o simples ato de viajar em uma experiência de significado. Unimos planejamento técnico e sensibilidade humana para criar roteiros sob medida, que refletem o estilo, o ritmo e os sonhos de cada cliente.\n\nMais do que uma agência de viagens convencional, somos uma consultoria de experiências completas. Cuidamos com amor de cada detalhe, desde a primeira conversa até o seu retorno, com total transparência, segurança e um atendimento que é verdadeiramente próximo de você.\n\nAcreditamos que viajar é uma das formas mais bonitas de viver e registrar memórias. É por isso que trabalhamos todos os dias para transformar destinos marcantes em histórias reais.",
  footerText: "Curadoria de Roteiros Exclusivos",
  footerAddress: "Atendimento Presencial & On-line, Balneário Camboriú - SC",
  footerEmail: "financeiro@arcadaneviagens.com",
  customTripTitle: "Viagens personalizadas:",
  customTripSubtitle: "Experiências exclusivas, desenhadas para você.",
  customTripButtonText: "Clique e fale com a Arcadane!",
  widgetType: "befly",
  widgetPosition: "middle",
  
  // Custom Dynamic Layout configurations
  preloaderType: "pulse",
  footerCopyright: "© 2026 Arcadane Viagens LTDA. Todos os direitos reservados. CNPJ 48.799.471/0001-38.",
  footerCol1Title: "Destinos",
  footerCol1Links: "África & Ilhas Exóticas|packages;América do Sul & Central|packages;Ásia Imperial & Moderna|packages;Caribe Paradisíaco|packages;Europa Clássica & Secreta|packages;Oceania dos Sonhos|packages;Estados Unidos & Parques|packages",
  footerCol2Title: "Descubra-se no Mundo",
  footerCol2Links: "Roteiro Exclusivo de Lua de Mel|custom_trip;Viagens Deslumbrantes de Trem|packages;Cruzeiros de Alto Luxo & Navegações|packages;Viagens com a Família|packages;Bem-Estar, Retiros & Conexão|custom_trip;Safáris Fotográficos na África|packages;Esqui, Neve & Chalés de Luxo|custom_trip",
  
  // Custom Menu & Sub-menu Configurations
  menuLabelHome: "Início",
  menuLabelServices: "Serviços",
  menuLabelPackages: "Pacotes",
  menuLabelAboutUs: "Quem Somos",
  menuLabelCustomTrip: "Viagem Personalizada",
  menuLabelBlog: "Blog",
  menuLabelContactUs: "Contato",
  
  // Submenus configuration strings (label|targetPageId or label|url)
  submenuPackagesLinks: "África & Ilhas|packages;América do Sul|packages;Ásia|packages;Caribe|packages;Europa|packages;Oceania|packages;EUA & Parques|packages",
  submenuCustomTripLinks: "Lua de Mel Exclusiva|custom_trip;Navegações de Luxo|packages;Viagens de Trem|packages;Estações de Esqui|custom_trip",

  // Show/Hide pages in menu defaults
  hideHomeInMenu: false,
  hideServicesInMenu: false,
  hidePackagesInMenu: false,
  hideAboutUsInMenu: false,
  hideCustomTripInMenu: false,
  hideBlogInMenu: false,
  hideContactUsInMenu: false,

  // Show/Hide pages on site entirely defaults
  hideHome: false,
  hideServices: false,
  hidePackages: false,
  hideAboutUs: false,
  hideCustomTrip: false,
  hideBlog: false,
  hideContactUs: false
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
    waMessage: "Olá Arcadane! Vi o roteiro exclusivo curado 'Belezas da China' (Queensberry) no site e gostaria de agendar uma consultoria exclusiva com vocês."
  },
  {
    id: "islandia-magia-luzes",
    title: "Elas Viajam Islândia: A Magia das Luzes do Norte",
    subTitle: "Grupo Exclusivo para Mulheres na Terra do Gelo e Fogo",
    operator: "Orinter Especial",
    duration: "10 Dias",
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
    waMessage: "Olá Arcadane! Estou muito interessada no grupo exclusivo 'Elas Viajam Islândia: Luzes do Norte' (Orinter) e gostaria de solicitar uma consultoria para mim."
  },
  {
    id: "ciamaritima-krooze-cruise",
    title: "Cruzeiro Seabourn Quest All inclusive",
    subTitle: "Navegação Boutique de Alto Padrão pelos Mares Mais Deslumbrantes",
    operator: "Seabourn",
    duration: "8 Dias",
    tag: "Cruzeiro de Luxo & All Inclusive",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800",
    description: "Embarque em uma jornada inesquecível de puro charme e sofisticação. Navegue com todo o conforto de um cruzeiro boutique de altíssimo padrão, desfrutando de vistas deslumbrantes, gastronomia internacional cinco estrelas e serviços impecáveis de bordo.",
    highlights: [
      "Suítes luxuosas com varanda privativa e vista total para o mar",
      "Experiência gastronômica all-inclusive premium com chefs renomados",
      "Entretenimento exclusivo de classe mundial e atividades de lazer",
      "Atendimento próximo e personalizado em cada detalhe de sua viagem"
    ],
    link: "https://ciamaritima.krooze.com.br/quote/6a2c7dc44e2b065bf1eb981c",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    waMessage: "Olá Arcadane! Vi o Cruzeiro Seabourn Quest All inclusive no site e gostaria de agendar uma consultoria exclusiva com vocês para esse roteiro."
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
  THEME: 'arcadane_theme_settings',
  CUSTOM_PAGES: 'arcadane_cms_custom_pages',
  DOMAINS: 'arcadane_cms_domain_settings',
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
const fallbackThemeSettings = (fallbackData as any).arcadane_cms_theme_settings as ThemeSettings | null;

const FALLBACK_SERVICES = fallbackServices && fallbackServices.length > 0 ? fallbackServices : DEFAULT_SERVICES;
const FALLBACK_PACKAGES = fallbackPackages && fallbackPackages.length > 0 ? fallbackPackages : DEFAULT_PACKAGES;
const FALLBACK_PROMO_PACKAGES = fallbackPromoPackages && fallbackPromoPackages.length > 0 ? fallbackPromoPackages : DEFAULT_PROMO_PACKAGES;
const FALLBACK_BLOG_POSTS = fallbackBlogPosts && fallbackBlogPosts.length > 0 ? fallbackBlogPosts : DEFAULT_BLOG_POSTS;
const FALLBACK_TESTIMONIALS = fallbackTestimonials && fallbackTestimonials.length > 0 ? fallbackTestimonials : DEFAULT_TESTIMONIALS;
const FALLBACK_SEO_SETTINGS = fallbackSeoSettings ? { ...DEFAULT_SEO_SETTINGS, ...fallbackSeoSettings } : DEFAULT_SEO_SETTINGS;
const FALLBACK_HOME_SETTINGS = fallbackHomeSettings ? { ...DEFAULT_HOME_SETTINGS, ...fallbackHomeSettings } : DEFAULT_HOME_SETTINGS;
const FALLBACK_LUXURY_TRIPS = fallbackLuxuryTrips && fallbackLuxuryTrips.length > 0 ? fallbackLuxuryTrips : DEFAULT_LUXURY_TRIPS;
const FALLBACK_THEME_SETTINGS = fallbackThemeSettings ? { ...DEFAULT_THEME_SETTINGS, ...fallbackThemeSettings } : DEFAULT_THEME_SETTINGS;

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
  try {
    const parsed = JSON.parse(data);
    // If user has the old generic default title or description, update it to Balneário Camboriú
    if (
      !parsed.siteTitle || 
      parsed.siteTitle === "Arcadane Viagens | Roteiros Personalizados de Luxo" ||
      parsed.siteTitle.indexOf("Roteiros Personalizados de Luxo") !== -1
    ) {
      parsed.siteTitle = FALLBACK_SEO_SETTINGS.siteTitle;
      parsed.metaDescription = FALLBACK_SEO_SETTINGS.metaDescription;
      parsed.keywords = FALLBACK_SEO_SETTINGS.keywords;
      localStorage.setItem(KEYS.SEO, JSON.stringify(parsed));
    }
    return { ...FALLBACK_SEO_SETTINGS, ...parsed };
  } catch (e) {
    return FALLBACK_SEO_SETTINGS;
  }
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

export function getLastUpdatedTime(): string {
  if (typeof window === 'undefined') return '';
  let revision = localStorage.getItem('arcadane_cms_revision');
  if (!revision) {
    const now = new Date();
    revision = now.toISOString();
    localStorage.setItem('arcadane_cms_revision', revision);
  }
  try {
    const date = new Date(revision);
    if (isNaN(date.getTime())) return '';
    
    // Format to PT-BR: DD/MM/AAAA às HH:MM
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `Versão do site atualizada em: ${day}/${month}/${year} às ${hours}:${minutes}`;
  } catch (e) {
    return '';
  }
}

export function getThemeSettings(): ThemeSettings {
  if (typeof window === 'undefined') return FALLBACK_THEME_SETTINGS;
  const data = localStorage.getItem(KEYS.THEME);
  if (!data) {
    localStorage.setItem(KEYS.THEME, JSON.stringify(FALLBACK_THEME_SETTINGS));
    return FALLBACK_THEME_SETTINGS;
  }
  try {
    return { ...FALLBACK_THEME_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return FALLBACK_THEME_SETTINGS;
  }
}

export function saveThemeSettings(settings: ThemeSettings): void {
  localStorage.setItem(KEYS.THEME, JSON.stringify(settings));
  applyThemeSettings(settings);
  broadcastChange();
  autoSyncToServer();
}

export function getCustomPages(): CustomPage[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_PAGES;
  const data = localStorage.getItem(KEYS.CUSTOM_PAGES);
  if (!data) {
    localStorage.setItem(KEYS.CUSTOM_PAGES, JSON.stringify(DEFAULT_CUSTOM_PAGES));
    return DEFAULT_CUSTOM_PAGES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_CUSTOM_PAGES;
  }
}

export function saveCustomPages(pages: CustomPage[]): void {
  localStorage.setItem(KEYS.CUSTOM_PAGES, JSON.stringify(pages));
  broadcastChange();
  autoSyncToServer();
}

export function getDomainSettings(): DomainSettings {
  if (typeof window === 'undefined') return DEFAULT_DOMAIN_SETTINGS;
  const data = localStorage.getItem(KEYS.DOMAINS);
  if (!data) {
    localStorage.setItem(KEYS.DOMAINS, JSON.stringify(DEFAULT_DOMAIN_SETTINGS));
    return DEFAULT_DOMAIN_SETTINGS;
  }
  try {
    return { ...DEFAULT_DOMAIN_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_DOMAIN_SETTINGS;
  }
}

export function saveDomainSettings(settings: DomainSettings): void {
  localStorage.setItem(KEYS.DOMAINS, JSON.stringify(settings));
  broadcastChange();
  autoSyncToServer();
}

export function applyThemeSettings(settings?: ThemeSettings): void {
  if (typeof document === 'undefined') return;
  const theme = settings || getThemeSettings();

  const primary = theme.primaryColor || '#3B5EA4';
  const secondary = theme.secondaryColor || '#AF4934';
  const bgLight = theme.bgColorLight || '#FDFBF6';
  const textDark = theme.textColorDark || '#3A2F28';
  const chocolate = theme.chocolateColor || '#6F5B4E';
  const beige = theme.beigeColor || '#F3EEE3';
  const border = theme.borderColor || '#DCCFC1';

  const fontSans = theme.fontSans || '"Montserrat", "Inter", sans-serif';
  const fontDisplay = theme.fontDisplay || '"Montserrat", "Cormorant Garamond", Georgia, serif';
  const fontSerif = theme.fontSerif || '"Cormorant Garamond", Georgia, serif';

  const docEl = document.documentElement;
  docEl.style.setProperty('--color-brand-primary', primary);
  docEl.style.setProperty('--color-brand-secondary', secondary);
  docEl.style.setProperty('--color-brand-light', bgLight);
  docEl.style.setProperty('--color-brand-dark', textDark);
  docEl.style.setProperty('--color-brand-chocolate', chocolate);
  docEl.style.setProperty('--color-brand-beige', beige);
  docEl.style.setProperty('--color-brand-border', border);

  docEl.style.setProperty('--font-sans', fontSans);
  docEl.style.setProperty('--font-display', fontDisplay);
  docEl.style.setProperty('--font-serif', fontSerif);

  // Remove existing style block if present
  let styleEl = document.getElementById('arcadane-theme-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'arcadane-theme-overrides';
    document.head.appendChild(styleEl);
  }

  // Map radius
  const radiusMap: Record<string, string> = {
    'rounded-none': '0px',
    'rounded': '4px',
    'rounded-lg': '8px',
    'rounded-xl': '12px',
    'rounded-2xl': '16px',
    'rounded-full': '9999px',
  };
  const radiusVal = radiusMap[theme.buttonRadius] || '9999px';

  // Build button style css override
  let buttonStyleCss = '';
  if (theme.buttonStyle === 'outline') {
    buttonStyleCss = `
      button.bg-brand-primary, .btn-primary, [role="button"].bg-brand-primary {
        background-color: transparent !important;
        background: transparent !important;
        color: var(--color-brand-primary) !important;
        border: 2px solid var(--color-brand-primary) !important;
      }
      button.bg-brand-secondary, .btn-secondary, [role="button"].bg-brand-secondary {
        background-color: transparent !important;
        background: transparent !important;
        color: var(--color-brand-secondary) !important;
        border: 2px solid var(--color-brand-secondary) !important;
      }
    `;
  } else if (theme.buttonStyle === 'shadow-lux') {
    buttonStyleCss = `
      button, .btn, [role="button"], .wa-btn {
        box-shadow: 0 10px 25px -5px var(--color-brand-primary)33 !important;
      }
    `;
  } else if (theme.buttonStyle === 'glass') {
    buttonStyleCss = `
      button.bg-brand-primary, .btn-primary, [role="button"].bg-brand-primary {
        background-color: rgba(59, 94, 164, 0.1) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        color: var(--color-brand-primary) !important;
        border: 1px solid var(--color-brand-primary)50 !important;
      }
    `;
  }

  styleEl.textContent = `
    :root {
      --color-brand-primary: ${primary} !important;
      --color-brand-secondary: ${secondary} !important;
      --color-brand-light: ${bgLight} !important;
      --color-brand-dark: ${textDark} !important;
      --color-brand-chocolate: ${chocolate} !important;
      --color-brand-beige: ${beige} !important;
      --color-brand-border: ${border} !important;

      --font-sans: ${fontSans} !important;
      --font-display: ${fontDisplay} !important;
      --font-serif: ${fontSerif} !important;
    }

    body {
      background-color: var(--color-brand-light) !important;
      color: var(--color-brand-dark) !important;
    }

    /* Core button shape overrides */
    button, .btn, [role="button"], .wa-btn, select, input {
      border-radius: ${radiusVal} !important;
    }

    /* Custom Button style overrides */
    ${buttonStyleCss}
  `;
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
    // Automatically merge missing default trips (by ID) so updates are visible without a cache clear
    let updated = false;
    const mergedList = [...list];
    for (const defaultTrip of FALLBACK_LUXURY_TRIPS) {
      const idx = mergedList.findIndex(t => t.id === defaultTrip.id);
      if (idx === -1) {
        mergedList.push(defaultTrip);
        updated = true;
      } else if (mergedList[idx].title === "Cruzeiro de Luxo Cia Marítima") {
        mergedList[idx] = { ...mergedList[idx], ...defaultTrip };
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(KEYS.LUXURY_TRIPS, JSON.stringify(mergedList));
      return mergedList;
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

export function getCustomCodeInjection(position: 'head' | 'body_start' | 'body_end'): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(`arcadane_custom_${position}_code`) || '';
}

export function saveCustomCodeInjection(position: 'head' | 'body_start' | 'body_end', code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`arcadane_custom_${position}_code`, code);
  broadcastChange();
  autoSyncToServer();
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
    localStorage.setItem('arcadane_cms_revision', new Date().toISOString());
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  }
}

// Automatic synchronization from browser local storage to Firebase and Node workspace backup server
export async function autoSyncToServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isSyncingFromFirebase) return;

  try {
    const dataToSync: Record<string, any> = {
      services: JSON.parse(localStorage.getItem(KEYS.SERVICES) || 'null'),
      packages: JSON.parse(localStorage.getItem(KEYS.PACKAGES) || 'null'),
      promo_packages: JSON.parse(localStorage.getItem(KEYS.PROMO_PACKAGES) || 'null'),
      blog_posts: JSON.parse(localStorage.getItem(KEYS.BLOG_POSTS) || 'null'),
      testimonials: JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || 'null'),
      seo_settings: JSON.parse(localStorage.getItem(KEYS.SEO) || 'null'),
      home_settings: JSON.parse(localStorage.getItem(KEYS.HOME) || 'null'),
      luxury_trips: JSON.parse(localStorage.getItem(KEYS.LUXURY_TRIPS) || 'null'),
      founders_photo: localStorage.getItem('arcadane_founders_photo'),
      trajectory_photo: localStorage.getItem('arcadane_trajectory_photo'),
      custom_logo: localStorage.getItem('arcadane_custom_logo'),
      
      // Extended layout parameters for absolute multi-device synchronicity
      bento_destinations: JSON.parse(localStorage.getItem('arcadane_bento_destinations') || 'null'),
      video_url: localStorage.getItem('arcadane_video_url'),
      search_mode: localStorage.getItem('arcadane_search_mode'),
      typewriter_endings: JSON.parse(localStorage.getItem('arcadane_typewriter_endings') || 'null'),
      seal_top_text: localStorage.getItem('arcadane_seal_top_text'),
      seal_bottom_text: localStorage.getItem('arcadane_seal_bottom_text'),
      seal_number: localStorage.getItem('arcadane_seal_number'),
      seal_label1: localStorage.getItem('arcadane_seal_label1'),
      seal_label2: localStorage.getItem('arcadane_seal_label2'),
      quiz_banner_badge: localStorage.getItem('arcadane_quiz_banner_badge'),
      quiz_banner_title: localStorage.getItem('arcadane_quiz_banner_title'),
      quiz_banner_desc: localStorage.getItem('arcadane_quiz_banner_desc'),
      custom_head_code: localStorage.getItem('arcadane_custom_head_code'),
      custom_body_start_code: localStorage.getItem('arcadane_custom_body_start_code'),
      custom_body_end_code: localStorage.getItem('arcadane_custom_body_end_code'),
      theme_settings: JSON.parse(localStorage.getItem(KEYS.THEME) || 'null')
    };

    // Save each individual non-null key to Firebase Firestore so they are loaded immediately on Hostinger or other devices
    for (const [key, value] of Object.entries(dataToSync)) {
      if (value !== null && value !== undefined) {
        saveToFirebase(key, value);
      }
    }

    // Failsafe backup: also update backend workspace file
    const legacyData = {
      arcadane_cms_services: dataToSync.services,
      arcadane_cms_packages: dataToSync.packages,
      arcadane_cms_promo_packages: dataToSync.promo_packages,
      arcadane_cms_blog_posts: dataToSync.blog_posts,
      arcadane_cms_testimonials: dataToSync.testimonials,
      arcadane_cms_seo_settings: dataToSync.seo_settings,
      arcadane_cms_home_settings: dataToSync.home_settings,
      arcadane_cms_luxury_trips: dataToSync.luxury_trips,
      arcadane_founders_photo: dataToSync.founders_photo,
      arcadane_trajectory_photo: dataToSync.trajectory_photo,
      arcadane_custom_logo: dataToSync.custom_logo,
      arcadane_bento_destinations: dataToSync.bento_destinations,
      arcadane_video_url: dataToSync.video_url,
      arcadane_search_mode: dataToSync.search_mode,
      arcadane_typewriter_endings: dataToSync.typewriter_endings,
      arcadane_seal_top_text: dataToSync.seal_top_text,
      arcadane_seal_bottom_text: dataToSync.seal_bottom_text,
      arcadane_seal_number: dataToSync.seal_number,
      arcadane_seal_label1: dataToSync.seal_label1,
      arcadane_seal_label2: dataToSync.seal_label2,
      arcadane_quiz_banner_badge: dataToSync.quiz_banner_badge,
      arcadane_quiz_banner_title: dataToSync.quiz_banner_title,
      arcadane_quiz_banner_desc: dataToSync.quiz_banner_desc,
      arcadane_custom_head_code: dataToSync.custom_head_code,
      arcadane_custom_body_start_code: dataToSync.custom_body_start_code,
      arcadane_custom_body_end_code: dataToSync.custom_body_end_code,
      arcadane_theme_settings: dataToSync.theme_settings
    };

    await fetch('/api/save-cms-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(legacyData),
    });
  } catch (error) {
    console.warn('Silent CMS state background sync to server/Firebase failed:', error);
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
      
      if (fallbackThemeSettings) {
        localStorage.setItem(KEYS.THEME, JSON.stringify({ ...DEFAULT_THEME_SETTINGS, ...fallbackThemeSettings }));
      } else {
        localStorage.setItem(KEYS.THEME, JSON.stringify(DEFAULT_THEME_SETTINGS));
      }
      
      if (fallbackData.arcadane_founders_photo) {
        localStorage.setItem('arcadane_founders_photo', fallbackData.arcadane_founders_photo);
      }
      if (fallbackData.arcadane_trajectory_photo) {
        localStorage.setItem('arcadane_trajectory_photo', fallbackData.arcadane_trajectory_photo);
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

    const currentTheme = localStorage.getItem(KEYS.THEME);
    if (currentTheme) {
      applyThemeSettings(JSON.parse(currentTheme));
    } else {
      applyThemeSettings(fallbackThemeSettings ? { ...DEFAULT_THEME_SETTINGS, ...fallbackThemeSettings } : DEFAULT_THEME_SETTINGS);
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
        updateKey('arcadane_bento_destinations', serverData.arcadane_bento_destinations);
        updateKey('arcadane_video_url', serverData.arcadane_video_url);
        updateKey('arcadane_search_mode', serverData.arcadane_search_mode);
        updateKey('arcadane_typewriter_endings', serverData.arcadane_typewriter_endings);
        updateKey('arcadane_seal_top_text', serverData.arcadane_seal_top_text);
        updateKey('arcadane_seal_bottom_text', serverData.arcadane_seal_bottom_text);
        updateKey('arcadane_seal_number', serverData.arcadane_seal_number);
        updateKey('arcadane_seal_label1', serverData.arcadane_seal_label1);
        updateKey('arcadane_seal_label2', serverData.arcadane_seal_label2);
        updateKey('arcadane_quiz_banner_badge', serverData.arcadane_quiz_banner_badge);
        updateKey('arcadane_quiz_banner_title', serverData.arcadane_quiz_banner_title);
        updateKey('arcadane_quiz_banner_desc', serverData.arcadane_quiz_banner_desc);
        updateKey('arcadane_custom_head_code', serverData.arcadane_custom_head_code);
        updateKey('arcadane_custom_body_start_code', serverData.arcadane_custom_body_start_code);
        updateKey('arcadane_custom_body_end_code', serverData.arcadane_custom_body_end_code);
        updateKey(KEYS.THEME, serverData.arcadane_theme_settings);
        updateKey('arcadane_cms_revision', serverData.updatedAt);

        if (updated) {
          console.log('CMS state updated from server. Broadcasting change...');
          broadcastChange();
          // Apply new SEO and Theme settings
          const freshSeo = localStorage.getItem(KEYS.SEO);
          if (freshSeo) {
            try {
              applySeoSettings(JSON.parse(freshSeo));
            } catch (e) {}
          }
          const freshTheme = localStorage.getItem(KEYS.THEME);
          if (freshTheme) {
            try {
              applyThemeSettings(JSON.parse(freshTheme));
            } catch (e) {}
          }
        }
      }
    }
  } catch (err) {
    console.info('Server CMS state fetch not available or failed:', err);
  }

  // 3. Connect to Firebase Firestore for modern real-time instant synchronization!
  try {
    console.log('[Firebase] Setting up bidirectional Realtime Firestore Syncer...');
    setupFirebaseRealtimeListener((key, remoteData) => {
      if (typeof window === 'undefined') return;

      let localKey: string | null = null;
      if (key === 'services') localKey = KEYS.SERVICES;
      else if (key === 'packages') localKey = KEYS.PACKAGES;
      else if (key === 'promo_packages') localKey = KEYS.PROMO_PACKAGES;
      else if (key === 'blog_posts') localKey = KEYS.BLOG_POSTS;
      else if (key === 'testimonials') localKey = KEYS.TESTIMONIALS;
      else if (key === 'seo_settings') localKey = KEYS.SEO;
      else if (key === 'home_settings') localKey = KEYS.HOME;
      else if (key === 'luxury_trips') localKey = KEYS.LUXURY_TRIPS;
      else if (key === 'founders_photo') localKey = 'arcadane_founders_photo';
      else if (key === 'trajectory_photo') localKey = 'arcadane_trajectory_photo';
      else if (key === 'custom_logo') localKey = 'arcadane_custom_logo';
      else if (key === 'bento_destinations') localKey = 'arcadane_bento_destinations';
      else if (key === 'video_url') localKey = 'arcadane_video_url';
      else if (key === 'search_mode') localKey = 'arcadane_search_mode';
      else if (key === 'typewriter_endings') localKey = 'arcadane_typewriter_endings';
      else if (key === 'seal_top_text') localKey = 'arcadane_seal_top_text';
      else if (key === 'seal_bottom_text') localKey = 'arcadane_seal_bottom_text';
      else if (key === 'seal_number') localKey = 'arcadane_seal_number';
      else if (key === 'seal_label1') localKey = 'arcadane_seal_label1';
      else if (key === 'seal_label2') localKey = 'arcadane_seal_label2';
      else if (key === 'quiz_banner_badge') localKey = 'arcadane_quiz_banner_badge';
      else if (key === 'quiz_banner_title') localKey = 'arcadane_quiz_banner_title';
      else if (key === 'quiz_banner_desc') localKey = 'arcadane_quiz_banner_desc';
      else if (key === 'custom_head_code') localKey = 'arcadane_custom_head_code';
      else if (key === 'custom_body_start_code') localKey = 'arcadane_custom_body_start_code';
      else if (key === 'custom_body_end_code') localKey = 'arcadane_custom_body_end_code';
      else if (key === 'theme_settings') localKey = KEYS.THEME;

      if (localKey && remoteData !== undefined && remoteData !== null) {
        const currentVal = localStorage.getItem(localKey);
        const remoteValStr = typeof remoteData === 'string' ? remoteData : JSON.stringify(remoteData);

        if (currentVal !== remoteValStr) {
          console.log(`[Firebase] Remotely updated key "${key}" detected. Applying to browser...`);

          isSyncingFromFirebase = true;
          try {
            localStorage.setItem(localKey, remoteValStr);
            if (key === 'seo_settings') {
              applySeoSettings(remoteData);
            } else if (key === 'theme_settings') {
              applyThemeSettings(remoteData);
            }
            broadcastChange();
          } finally {
            setTimeout(() => {
              isSyncingFromFirebase = false;
            }, 50);
          }
        }
      }
    });
  } catch (fbErr) {
    console.warn('[Firebase] Snapshot subscriber initialization failed:', fbErr);
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

// Bidirectional Forced Sync function to reconcile browser storage with Firebase & Backup Server
export async function forceSyncCmsState(direction: 'pull' | 'push'): Promise<{ success: boolean; updatedKeys: string[]; error?: string }> {
  if (typeof window === 'undefined') {
    return { success: false, updatedKeys: [], error: 'Window context is required for synchronization' };
  }

  const KEYS_MAPPING: Record<string, string> = {
    services: KEYS.SERVICES,
    packages: KEYS.PACKAGES,
    promo_packages: KEYS.PROMO_PACKAGES,
    blog_posts: KEYS.BLOG_POSTS,
    testimonials: KEYS.TESTIMONIALS,
    seo_settings: KEYS.SEO,
    home_settings: KEYS.HOME,
    luxury_trips: KEYS.LUXURY_TRIPS,
    founders_photo: 'arcadane_founders_photo',
    trajectory_photo: 'arcadane_trajectory_photo',
    custom_logo: 'arcadane_custom_logo',
    bento_destinations: 'arcadane_bento_destinations',
    video_url: 'arcadane_video_url',
    search_mode: 'arcadane_search_mode',
    typewriter_endings: 'arcadane_typewriter_endings',
    seal_top_text: 'arcadane_seal_top_text',
    seal_bottom_text: 'arcadane_seal_bottom_text',
    seal_number: 'arcadane_seal_number',
    seal_label1: 'arcadane_seal_label1',
    seal_label2: 'arcadane_seal_label2',
    quiz_banner_badge: 'arcadane_quiz_banner_badge',
    quiz_banner_title: 'arcadane_quiz_banner_title',
    quiz_banner_desc: 'arcadane_quiz_banner_desc',
    custom_head_code: 'arcadane_custom_head_code',
    custom_body_start_code: 'arcadane_custom_body_start_code',
    custom_body_end_code: 'arcadane_custom_body_end_code',
    theme_settings: KEYS.THEME
  };

  const updatedKeys: string[] = [];

  try {
    if (direction === 'pull') {
      console.log('[Sync] Force pulling CMS state from server backup and Firebase...');
      
      // 1. Pull from backup server
      try {
        const response = await fetch('/api/get-cms-state');
        if (response.ok) {
          const serverData = await response.json();
          if (serverData && typeof serverData === 'object') {
            const updateKey = (localKey: string, serverVal: any) => {
              if (serverVal !== undefined && serverVal !== null) {
                const currentVal = localStorage.getItem(localKey);
                const serverValStr = typeof serverVal === 'string' ? serverVal : JSON.stringify(serverVal);
                if (currentVal !== serverValStr) {
                  localStorage.setItem(localKey, serverValStr);
                  if (!updatedKeys.includes(localKey)) updatedKeys.push(localKey);
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
            updateKey('arcadane_bento_destinations', serverData.arcadane_bento_destinations);
            updateKey('arcadane_video_url', serverData.arcadane_video_url);
            updateKey('arcadane_search_mode', serverData.arcadane_search_mode);
            updateKey('arcadane_typewriter_endings', serverData.arcadane_typewriter_endings);
            updateKey('arcadane_seal_top_text', serverData.arcadane_seal_top_text);
            updateKey('arcadane_seal_bottom_text', serverData.arcadane_seal_bottom_text);
            updateKey('arcadane_seal_number', serverData.arcadane_seal_number);
            updateKey('arcadane_seal_label1', serverData.arcadane_seal_label1);
            updateKey('arcadane_seal_label2', serverData.arcadane_seal_label2);
            updateKey('arcadane_quiz_banner_badge', serverData.arcadane_quiz_banner_badge);
            updateKey('arcadane_quiz_banner_title', serverData.arcadane_quiz_banner_title);
            updateKey('arcadane_quiz_banner_desc', serverData.arcadane_quiz_banner_desc);
            updateKey('arcadane_custom_head_code', serverData.arcadane_custom_head_code);
            updateKey('arcadane_custom_body_start_code', serverData.arcadane_custom_body_start_code);
            updateKey('arcadane_custom_body_end_code', serverData.arcadane_custom_body_end_code);
            updateKey(KEYS.THEME, serverData.arcadane_theme_settings);
            updateKey('arcadane_cms_revision', serverData.updatedAt);
          }
        }
      } catch (err) {
        console.warn('[Sync] Pull from Node server failed:', err);
      }

      // 2. Pull from Firebase Firestore
      isSyncingFromFirebase = true;
      try {
        await Promise.all(
          Object.entries(KEYS_MAPPING).map(async ([fbKey, localKey]) => {
            const data = await loadFromFirebase(fbKey);
            if (data !== undefined && data !== null) {
              const currentVal = localStorage.getItem(localKey);
              const remoteValStr = typeof data === 'string' ? data : JSON.stringify(data);
              if (currentVal !== remoteValStr) {
                localStorage.setItem(localKey, remoteValStr);
                if (!updatedKeys.includes(localKey)) updatedKeys.push(localKey);
                if (fbKey === 'seo_settings') {
                  applySeoSettings(data);
                } else if (fbKey === 'theme_settings') {
                  applyThemeSettings(data);
                }
              }
            }
          })
        );
      } finally {
        setTimeout(() => {
          isSyncingFromFirebase = false;
        }, 100);
      }

      if (updatedKeys.length > 0) {
        broadcastChange();
      }

      return { success: true, updatedKeys };

    } else {
      console.log('[Sync] Force pushing local CMS state to server backup and Firebase...');

      const dataToPush = {
        services: JSON.parse(localStorage.getItem(KEYS.SERVICES) || 'null'),
        packages: JSON.parse(localStorage.getItem(KEYS.PACKAGES) || 'null'),
        promo_packages: JSON.parse(localStorage.getItem(KEYS.PROMO_PACKAGES) || 'null'),
        blog_posts: JSON.parse(localStorage.getItem(KEYS.BLOG_POSTS) || 'null'),
        testimonials: JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || 'null'),
        seo_settings: JSON.parse(localStorage.getItem(KEYS.SEO) || 'null'),
        home_settings: JSON.parse(localStorage.getItem(KEYS.HOME) || 'null'),
        luxury_trips: JSON.parse(localStorage.getItem(KEYS.LUXURY_TRIPS) || 'null'),
        founders_photo: localStorage.getItem('arcadane_founders_photo'),
        trajectory_photo: localStorage.getItem('arcadane_trajectory_photo'),
        custom_logo: localStorage.getItem('arcadane_custom_logo'),
        bento_destinations: JSON.parse(localStorage.getItem('arcadane_bento_destinations') || 'null'),
        video_url: localStorage.getItem('arcadane_video_url'),
        search_mode: localStorage.getItem('arcadane_search_mode'),
        typewriter_endings: JSON.parse(localStorage.getItem('arcadane_typewriter_endings') || 'null'),
        seal_top_text: localStorage.getItem('arcadane_seal_top_text'),
        seal_bottom_text: localStorage.getItem('arcadane_seal_bottom_text'),
        seal_number: localStorage.getItem('arcadane_seal_number'),
        seal_label1: localStorage.getItem('arcadane_seal_label1'),
        seal_label2: localStorage.getItem('arcadane_seal_label2'),
        quiz_banner_badge: localStorage.getItem('arcadane_quiz_banner_badge'),
        quiz_banner_title: localStorage.getItem('arcadane_quiz_banner_title'),
        quiz_banner_desc: localStorage.getItem('arcadane_quiz_banner_desc'),
        theme_settings: JSON.parse(localStorage.getItem(KEYS.THEME) || 'null')
      };

      // Push to Firebase Firestore
      await Promise.all(
        Object.entries(dataToPush).map(async ([key, value]) => {
          if (value !== null && value !== undefined) {
            await saveToFirebase(key, value);
            updatedKeys.push(key);
          }
        })
      );

      // Push to fallback server JSON
      const legacyData = {
        arcadane_cms_services: dataToPush.services,
        arcadane_cms_packages: dataToPush.packages,
        arcadane_cms_promo_packages: dataToPush.promo_packages,
        arcadane_cms_blog_posts: dataToPush.blog_posts,
        arcadane_cms_testimonials: dataToPush.testimonials,
        arcadane_cms_seo_settings: dataToPush.seo_settings,
        arcadane_cms_home_settings: dataToPush.home_settings,
        arcadane_cms_luxury_trips: dataToPush.luxury_trips,
        arcadane_founders_photo: dataToPush.founders_photo,
        arcadane_trajectory_photo: dataToPush.trajectory_photo,
        arcadane_custom_logo: dataToPush.custom_logo,
        arcadane_bento_destinations: dataToPush.bento_destinations,
        arcadane_video_url: dataToPush.video_url,
        arcadane_search_mode: dataToPush.search_mode,
        arcadane_typewriter_endings: dataToPush.typewriter_endings,
        arcadane_seal_top_text: dataToPush.seal_top_text,
        arcadane_seal_bottom_text: dataToPush.seal_bottom_text,
        arcadane_seal_number: dataToPush.seal_number,
        arcadane_seal_label1: dataToPush.seal_label1,
        arcadane_seal_label2: dataToPush.seal_label2,
        arcadane_quiz_banner_badge: dataToPush.quiz_banner_badge,
        arcadane_quiz_banner_title: dataToPush.quiz_banner_title,
        arcadane_quiz_banner_desc: dataToPush.quiz_banner_desc,
        arcadane_theme_settings: dataToPush.theme_settings
      };

      await fetch('/api/save-cms-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(legacyData),
      });

      return { success: true, updatedKeys };
    }
  } catch (error: any) {
    console.error('[Sync] Forced synchronization failed:', error);
    return { success: false, updatedKeys, error: error.message || 'Unknown synchronization error' };
  }
}

