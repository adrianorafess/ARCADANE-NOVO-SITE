import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Calendar,
  MessageCircle,
  Check,
  Award,
  ChevronRight,
  Heart,
  Globe
} from 'lucide-react';
import { getSeoSettings } from '../utils/cmsStore';

interface Question {
  id: number;
  text: string;
  subtitle: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    label: string;
    description: string;
    icon: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Qual cenário faz seu coração bater mais forte ao planejar?",
    subtitle: "Escolha a atmosfera que melhor define seu refúgio ideal.",
    options: [
      {
        key: 'A',
        label: "Montanhas frias & Vinhos Finos",
        description: "Lareira crepitante, cobertores macios, picos nevados e degustações exclusivas.",
        icon: "🏔️"
      },
      {
        key: 'B',
        label: "Praias Paradisíacas Privadas",
        description: "Areia branca e fina, águas cristalinas mornas, sol dourado e calmaria marítima.",
        icon: "🏝️"
      },
      {
        key: 'C',
        label: "Cidades Culturais & Bairros Antigos",
        description: "Museus icônicos, livrarias clássicas, arquitetura rica e cafeterias centenárias.",
        icon: "🏛️"
      },
      {
        key: 'D',
        label: "Florestas, Desertos ou Vida Selvagem",
        description: "Contato cru com a natureza selvagem, aventuras genuínas e paisagens intocadas.",
        icon: "🌋"
      }
    ]
  },
  {
    id: 2,
    text: "Como seria sua hospedagem dos sonhos para esta jornada?",
    subtitle: "Onde você gostaria de descansar após um dia extraordinário?",
    options: [
      {
        key: 'A',
        label: "Chalet de Luxo ou Refúgio Alpino",
        description: "Design em madeira nobre, banheira externa aquecida com vista para os vales.",
        icon: "🏡"
      },
      {
        key: 'B',
        label: "Overwater Bungalow ou Resort Pé-na-Areia",
        description: "Acesso direto à lagoa turquesa, serviço de mordomia e massagem ao ar livre.",
        icon: "🏨"
      },
      {
        key: 'C',
        label: "Palácio Histórico ou Hotel Boutique Conceito",
        description: "Mobiliário artístico clássico, em um prédio revitalizado no centro histórico.",
        icon: "🏰"
      },
      {
        key: 'D',
        label: "Ecolodge Flutuante ou Glamping Estelar",
        description: "Janelas panorâmicas para a floresta ou teto transparente para ver as estrelas.",
        icon: "🏕️"
      }
    ]
  },
  {
    id: 3,
    text: "Qual experiência gastronômica coroa suas viagens?",
    subtitle: "A culinária é uma das formas mais puras de cultura.",
    options: [
      {
        key: 'A',
        label: "Menu Degustação Michelin com Harmonização",
        description: "Pratos que são verdadeiras obras de arte contemporâneas e safras raras.",
        icon: "🍷"
      },
      {
        key: 'B',
        label: "Frutos do Mar Grelhados de Frente para o Mar",
        description: "Ingredientes colhidos no mesmo dia, pé na areia e drinques tropicais artesanais.",
        icon: "🦞"
      },
      {
        key: 'C',
        label: "Bistrôs Tradicionais Intimistas & Mercados Locais",
        description: "Encontrar receitas familiares transmitidas por gerações em pratos autênticos.",
        icon: "🥪"
      },
      {
        key: 'D',
        label: "Churrasco Rústico de Fogo ou Culinária Selvagem",
        description: "Técnicas de fogo aberto, café preparado na brasa e cozinhas rústicas regionais.",
        icon: "🔥"
      }
    ]
  },
  {
    id: 4,
    text: "Qual atividade não pode faltar no seu roteiro diário?",
    subtitle: "O ritmo ideal de exploração para sincronizar o corpo e a mente.",
    options: [
      {
        key: 'A',
        label: "Slowing Down & Tratamentos de Spa",
        description: "Contemplar a neblina matinal, ler um bom livro e desfrutar de banhos termais.",
        icon: "🧘"
      },
      {
        key: 'B',
        label: "Drinque de Ouro no Pôr do Sol em um Iate",
        description: "Navegar pela costa, mergulhar em enseadas desertas e celebrar com champagne.",
        icon: "⛵"
      },
      {
        key: 'C',
        label: "Caminhadas Fotográficas guiadas por Historiadores",
        description: "Visitar ruínas secretas, galerias de arte independente e concertos teatrais.",
        icon: "📸"
      },
      {
        key: 'D',
        label: "Trilhas Intensas e Atividades na Natureza",
        description: "Rafting, subida ao cume, expedições utilitárias 4x4 e superação de limites.",
        icon: "🥾"
      }
    ]
  },
  {
    id: 5,
    text: "Ao retornar para casa, qual sentimento você mais busca trazer?",
    subtitle: "A verdadeira bagagem é o que transforma o nosso modo de viver.",
    options: [
      {
        key: 'A',
        label: "Paz Profunda & Serenidade Renovada",
        description: "Sentir que o tempo desacelerou e a mente encontrou um porto seguro e calmo.",
        icon: "✨"
      },
      {
        key: 'B',
        label: "Leveza Solar & Corpo Revigorado",
        description: "A energia vibrante do mar, pele dourada de sol e riso solto perto de águas calmas.",
        icon: "🌊"
      },
      {
        key: 'C',
        label: "Bagagem Intelectual & Inspiração Criativa",
        description: "A mente fervilhando com novas perspectivas sobre história, artes e visões do mundo.",
        icon: "🎨"
      },
      {
        key: 'D',
        label: "Histórias Épicas & Conexão com o Invisível",
        description: "A euforia de desbravar territórios selvagens e viver momentos de adrenalina pura.",
        icon: "🦅"
      }
    ]
  }
];

interface QuizResult {
  title: string;
  profile: string;
  destinations: string;
  imageWord: string;
  description: string;
  characteristics: string[];
}

const RESULTS: Record<'A' | 'B' | 'C' | 'D', QuizResult> = {
  A: {
    title: "O Viajante Contemplativo & Silencioso",
    profile: "Viajante Contemplativo (Frio, Slow Luxury & Conforto)",
    destinations: "Patagônia Chilena, Alpes Suíços, Campos do Jordão, Gramado ou Islândia.",
    imageWord: "alps_mountain",
    description: "Para você, viajar é sinônimo de recolhimento acústico, conexão refinada, gastronomia sofisticada e conforto aconchegante. O cenário de montanhas cobertas de névoa ou neve, acompanhado de uma lareira crepitante e uma carta de vinhos primorosa, é o seu refúgio sagrado.",
    characteristics: [
      "Aprecia o silêncio e o tempo sem pressa (Slow Travel).",
      "Valoriza hotéis design com privacidade extrema.",
      "Vê a gastronomia e enologia como rituais indispensáveis.",
      "Prefere destinos frios com atividades contemplativas de bem-estar."
    ]
  },
  B: {
    title: "O Explorador do Éden Solar & Sofisticado",
    profile: "Explorador Solar (Praia de Alto Padrão, Mar & Relaxamento)",
    destinations: "Maldivas, Costa Amalfitana (Itália), Fernando de Noronha, Angra dos Reis ou Polinésia Francesa.",
    imageWord: "tropical_island",
    description: "Sua alma é solar e vibra em alta frequência perto d'água. Você busca areias claras, águas de azul hipnótico e o frescor da brisa marítima combinado com hotelaria de altíssimo nível. Para você, o luxo supremo é relaxar ao som das ondas com atendimento impecável.",
    characteristics: [
      "Revigora-se em contato com o mar e o calor solar.",
      "Não abre mão de atendimento premium de resort e iates privados.",
      "Adora almoços descontraídos com peixes e espumantes gelados.",
      "Busca destinos paradisíacos para esquecer da rotina de forma elegante."
    ]
  },
  C: {
    title: "O Cosmopolita Cultural & Curioso",
    profile: "Cosmopolita Cultural (Arte, História & Charme Urbano)",
    destinations: "Toscana (Itália), Paris (França), Kyoto (Japão), Buenos Aires ou Londres.",
    imageWord: "classic_rome",
    description: "Você enxerga o mundo através de um caleidoscópio de artes, história e interações humanas ricas. Perder-se em ruelas de paralelepídeo, decifrar arquiteturas seculares, garimpar museus intimistas e escolher bistrôs autênticos no final da tarde é o que dá sentido à sua viagem.",
    characteristics: [
      "Focado em bagagem cultural, história e preservação patrimonial.",
      "Ama o design urbano, galerias independentes e livrarias de rua.",
      "Preza pela autenticidade do dia a dia local de cada cidade.",
      "Prefere caminhar quilômetros descobrindo curiosidades secretas."
    ]
  },
  D: {
    title: "O Desbravador de Fronteiras Selvagens",
    profile: "Desbravador de Fronteiras (Aventura, Natureza & Adrenalina)",
    destinations: "Safári no Quênia, Deserto do Atacama, Chapada Diamantina, Amazônia (Ecolodges) ou Queenstown (Nova Zelândia).",
    imageWord: "safari_jeep",
    description: "Você é movido pela adrenalina e pelo desejo indomável de exploração pura. Quer ver o céu estrelado em desertos remotos, cruzar florestas densas e ficar cara a cara com a vida selvagem. Para você, voltar para casa sem uma história épica de superação é como não ter viajado.",
    characteristics: [
      "Conexão crua e intensa com ecossistemas preservados.",
      "Aprecia aventura, trilhas, safáris e esportes ao ar livre.",
      "Valoriza o conforto de um ecolodge integrado ou glamping de luxo após o desgaste físico.",
      "Deseja estar acompanhado por experientes guias nativos e desbravar o desconhecido."
    ]
  }
};

export default function TravelQuizView() {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 is initial intro, 1-5 questions, 6 is results
  const [answers, setAnswers] = useState<('A' | 'B' | 'C' | 'D')[]>([]);
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);
  const [selectedInCurrent, setSelectedInCurrent] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const startQuiz = () => {
    setAnswers([]);
    setSelectedInCurrent(null);
    setCurrentStep(1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (selectedInCurrent) {
      const updatedAnswers = [...answers, selectedInCurrent];
      setAnswers(updatedAnswers);
      setSelectedInCurrent(null);
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const restartQuiz = () => {
    setAnswers([]);
    setSelectedInCurrent(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute results
  const getDominantProfile = (): 'A' | 'B' | 'C' | 'D' => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(key => {
      counts[key]++;
    });
    
    // Default priority or highest count
    let dominant: 'A' | 'B' | 'C' | 'D' = 'A';
    let max = -1;
    
    (['A', 'B', 'C', 'D'] as const).forEach(key => {
      if (counts[key] > max) {
        max = counts[key];
        dominant = key;
      }
    });

    return dominant;
  };

  const dominantKey = currentStep > QUESTIONS.length ? getDominantProfile() : 'A';
  const resultData = RESULTS[dominantKey];

  // Personalized WhatsApp text URL encoding representation
  const whatsappText = `Olá Mateus! Acabei de realizar o teste "Descubra seu estilo de viajante" no site da Arcadane e meu perfil deu: *${resultData?.title?.toUpperCase()}*. Estilo: ${resultData?.profile}. Destinos sugeridos para mim: ${resultData?.destinations} Gostaria de bater um papo para planejar minha próxima viagem de luxo sob medida!`;
  const quizWhatsAppMateus = seo.contactWhatsAppMateus || '554791492704';
  const whatsappUrl = `https://wa.me/${quizWhatsAppMateus}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="bg-brand-light min-h-screen py-10 sm:py-16 text-stone-850 font-sans" id="traveler-quiz-wrapper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Intro view */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              className="text-center space-y-8 bg-brand-beige border border-brand-border/40 p-8 sm:p-14 rounded-3xl shadow-xl relative overflow-hidden"
            >
              {/* background vector subtle glow */}
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AF4934]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3B5EA4]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-[#AF4934]/10 text-[#AF4934] px-4 py-2 rounded-full border border-[#DCCFC1] shadow-xs">
                  <Globe className="w-4 h-4 text-[#AF4934] animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Análise Interativa Arcadane
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <h1 className="font-serif italic text-3.5xl sm:text-5.5xl text-brand-dark tracking-tight leading-tight">
                  Descubra seu estilo de viajante e seu destino ideal
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
                  Viajar não é sobre acumular carimbos no passaporte, mas sobre alinhar a atmosfera dos lugares mais extraordinários da Terra com o compasso da sua própria alma. Responda estas <strong>v perguntas essenciais curadas por nossos curadores</strong> e encontre sua próxima coordenada solar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={startQuiz}
                  className="bg-brand-primary hover:bg-[#314f8c] text-white font-bold px-8 py-4 rounded-xl font-display text-sm inline-flex items-center gap-2.5 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md shadow-[#3B5EA4]/20"
                >
                  Planejar Meu Perfil
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
                <span className="text-[11px] font-mono text-stone-500 uppercase flex items-center gap-1.5 pt-2 sm:pt-0">
                  <Sparkles className="w-3.5 h-3.5 text-brand-secondary" /> Leva menos de 2 minutos
                </span>
              </div>

              {/* Decorative bento layout miniatures inside the intro card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 border-t border-brand-border/40">
                <div className="bg-white/55 backdrop-blur-xs p-4 rounded-2xl border border-white/40 text-left">
                  <span className="text-2xl">🏔️</span>
                  <h4 className="font-serif font-bold text-xs mt-2 text-brand-dark">Montanha</h4>
                  <span className="text-[9px] text-stone-500 font-sans">Privacidade e Vinho</span>
                </div>
                <div className="bg-white/55 backdrop-blur-xs p-4 rounded-2xl border border-white/40 text-left">
                  <span className="text-2xl">🏝️</span>
                  <h4 className="font-serif font-bold text-xs mt-2 text-brand-dark">Mar éden</h4>
                  <span className="text-[9px] text-stone-500 font-sans">Solar e Águas</span>
                </div>
                <div className="bg-white/55 backdrop-blur-xs p-4 rounded-2xl border border-white/40 text-left">
                  <span className="text-2xl">🏛️</span>
                  <h4 className="font-serif font-bold text-xs mt-2 text-brand-dark">Histórico</h4>
                  <span className="text-[9px] text-stone-500 font-sans">Arte e Bistrôs</span>
                </div>
                <div className="bg-white/55 backdrop-blur-xs p-4 rounded-2xl border border-white/40 text-left">
                  <span className="text-2xl">🦅</span>
                  <h4 className="font-serif font-bold text-xs mt-2 text-brand-dark">Aventura</h4>
                  <span className="text-[9px] text-stone-500 font-sans">Natureza crua</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Questions view */}
          {currentStep > 0 && currentStep <= QUESTIONS.length && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="space-y-8 text-left"
            >
              {/* Header block for questions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/45 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#AF4934] font-bold">
                    PASSO {currentStep} DE {QUESTIONS.length}
                  </span>
                  <div className="h-1 bg-stone-200 w-36 rounded-full overflow-hidden mt-1.5 relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-brand-primary rounded-full transition-all duration-300" 
                      style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={restartQuiz}
                  className="text-stone-400 hover:text-brand-primary transition-colors text-xs font-mono uppercase font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar Teste
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-brand-beige text-brand-primary text-[10px] font-bold font-mono rounded-md uppercase border border-[#DCCFC1]">
                  Pergunta {currentStep}
                </span>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-dark tracking-tight leading-tight">
                  {QUESTIONS[currentStep - 1].text}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  {QUESTIONS[currentStep - 1].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTIONS[currentStep - 1].options.map((opt) => {
                  const isSelected = selectedInCurrent === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedInCurrent(opt.key)}
                      className={`group p-5 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative flex gap-4 items-start ${
                        isSelected 
                          ? 'bg-[#f0e8dc] border-brand-primary shadow-md' 
                          : 'bg-white border-brand-border/40 hover:border-brand-primary/40 hover:bg-brand-beige/20 hover:shadow-xs'
                      }`}
                    >
                      {/* Avatar/Icon badge */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                        isSelected ? 'bg-brand-primary text-white' : 'bg-brand-beige text-stone-700'
                      }`}>
                        {opt.icon}
                      </div>

                      <div className="space-y-1.5 pr-2">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-brand-dark group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      {/* Selected radio check */}
                      <div className="absolute top-4 right-4 focus-within:ring-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-brand-primary bg-brand-primary' : 'border-stone-200 bg-transparent'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer dynamic navigation button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={!selectedInCurrent}
                  className={`px-8 py-3.5 rounded-xl font-bold font-display text-sm inline-flex items-center gap-2 transition-all cursor-pointer ${
                    selectedInCurrent 
                      ? 'bg-brand-primary hover:bg-[#314f8c] text-white shadow-md hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200'
                  }`}
                >
                  <span>{currentStep === QUESTIONS.length ? 'Finalizar e Ver Resultado' : 'Próxima Pergunta'}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Results view */}
          {currentStep > QUESTIONS.length && resultData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -25 }}
              className="space-y-8"
            >
              {/* Result certificate/boarding pass frame */}
              <div className="bg-brand-dark border border-stone-800/85 rounded-3xl relative overflow-hidden shadow-2xl text-white">
                
                {/* subtle luxury golden gradient background */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AF4934]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3B5EA4]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Perforation circle notch layout effect */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-brand-light border-r border-[#3A2F28] hidden lg:block z-20" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-brand-light border-l border-[#3A2F28] hidden lg:block z-20" />

                <div className="grid grid-cols-1 lg:grid-cols-10">
                  
                  {/* Main certificate portion */}
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6 relative text-left">
                    {/* Upper decorative row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850/85 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#AF4934]/10 p-2 rounded-xl border border-[#AF4934]/30">
                          <Award className="w-5 h-5 text-[#AF4934]" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#AF4934] block font-bold">Arcadane Traveler Profiler</span>
                          <span className="font-display font-medium text-xs text-stone-300">ANÁLISE DE ESTILO DE LUXO PERSONALIZADA</span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] tracking-widest text-[#AF4934] uppercase border border-[#AF4934]/40 px-2 py-0.5 rounded-md font-extrabold bg-[#AF4934]/5 self-start sm:self-center">
                        STATUS: ANALISADO
                      </span>
                    </div>

                    {/* Profile Title description */}
                    <div className="my-2 space-y-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 block">ESTILO DIAGNOSTICADO</span>
                      <h2 className="font-serif italic text-3.5xl sm:text-4.5xl text-[#AF4934] leading-none tracking-tight">
                        {resultData.title}
                      </h2>
                      <p className="text-sm text-stone-300 leading-relaxed font-sans opacity-95">
                        {resultData.description}
                      </p>
                    </div>

                    {/* Characteristics block */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-mono text-[9px] tracking-widest text-stone-500 uppercase font-black">SUAS CARACTERÍSTICAS PRINCIPAIS:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {resultData.characteristics.map((char, index) => (
                          <li key={index} className="flex gap-2.5 items-start text-xs text-stone-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 mt-1.5" />
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Locations */}
                    <div className="pt-4 border-t border-stone-850/60 flex items-start sm:items-center gap-3">
                      <div className="bg-brand-primary/20 p-2 rounded-lg border border-brand-primary/30 shrink-0">
                        <MapPin className="w-4 h-4 text-[#AF4934]" />
                      </div>
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-stone-550 block leading-tight">Coordenadas & Destinos Sugeridos</span>
                        <span className="font-display font-bold text-[#DCCFC1] text-xs sm:text-sm mt-0.5 block leading-tight">
                          {resultData.destinations}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical dotted segment separator for desktop */}
                  <div className="hidden lg:flex lg:col-span-1 items-center justify-center relative">
                    <div className="h-[80%] border-l border-dashed border-stone-800" />
                  </div>

                  {/* Custom Stub Column */}
                  <div className="lg:col-span-2 bg-stone-900/25 p-6 sm:p-10 lg:p-6 flex flex-col justify-between items-stretch gap-8 relative border-t lg:border-t-0 border-stone-850">
                    <div className="text-left space-y-2">
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#AF4934] font-bold block">RECADANE CLIENT ID</span>
                      <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                        Seu perfil foi processado e salvo. Envie no WhatsApp para resgatar condições e tarifas sob medida para o seu estilo de viajante.
                      </p>
                    </div>

                    {/* Fake barcode block */}
                    <div className="space-y-1 opacity-70">
                      <div className="flex gap-[1.5px] items-stretch h-8 justify-center">
                        <div className="w-[1px] bg-[#AF4934]" />
                        <div className="w-[2.5px] bg-[#AF4934]" />
                        <div className="w-[1.5px] bg-stone-800" />
                        <div className="w-[3px] bg-[#AF4934]" />
                        <div className="w-[1px] bg-[#AF4934]" />
                        <div className="w-[4px] bg-[#AF4934]" />
                        <div className="w-[1px] bg-stone-800" />
                        <div className="w-[2px] bg-[#AF4934]" />
                        <div className="w-[1px] bg-[#AF4934]" />
                        <div className="w-[3.5px] bg-[#AF4934]" />
                        <div className="w-[1.5px] bg-stone-800" />
                        <div className="w-[2px] bg-[#AF4934]" />
                      </div>
                      <span className="font-mono text-[7px] text-stone-500 tracking-[0.25em] block text-center uppercase font-bold">
                        STYLE-CLASS-{dominantKey}
                      </span>
                    </div>

                    {/* Action Block */}
                    <div className="space-y-3.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#3B5EA4] hover:bg-[#2e4981] text-white font-bold py-3.5 px-4 rounded-xl text-center text-xs tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                      >
                        <MessageCircle className="w-4 h-4 text-white shrink-0 fill-white" />
                        <span>Falar com o Mateus</span>
                      </a>
                      
                      <div className="flex items-center gap-2 justify-center leading-none">
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="font-sans text-[9px] text-stone-400 font-medium">
                          Consultor Mateus Online
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Reset view options */}
              <div className="text-center pt-2">
                <button
                  onClick={restartQuiz}
                  className="font-mono text-xs uppercase tracking-widest text-[#AF4934] hover:text-stone-950 transition-colors inline-flex items-center gap-1.5 py-2 px-6 rounded-full border border-[#AF4934]/25 hover:border-[#AF4934]/80 cursor-pointer font-bold bg-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Responder Novamente com Novas Opções
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
