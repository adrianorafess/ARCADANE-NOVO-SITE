import { uploadImageToStorage } from '../utils/firebase';
import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Shield, Heart, ArrowUpRight, Award, User, Quote, MapPin, CheckCircle, Camera, Trash2, Upload, Link } from 'lucide-react';
import { motion } from 'motion/react';
import { compressImage } from '../utils/imageCompressor';
import { useRafesEditor } from './RafesVisualBuilder';
import { getFoundersPhoto } from '../utils/cmsStore';

export default function AboutView() {
  const { rafesOpen } = useRafesEditor();
  const [foundersPhoto, setFoundersPhoto] = useState<string | null>(() => {
    return getFoundersPhoto();
  });

  useEffect(() => {
    const handleCmsChange = () => {
      setFoundersPhoto(getFoundersPhoto());
    };
    window.addEventListener('arcadane_cms_data_changed', handleCmsChange);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', handleCmsChange);
    };
  }, []);

  const handleUpdateFoundersPhoto = (newUrl: string) => {
    if (newUrl) {
      localStorage.setItem('arcadane_founders_photo', newUrl);
    } else {
      localStorage.removeItem('arcadane_founders_photo');
    }
    setFoundersPhoto(newUrl || null);
    window.dispatchEvent(new Event('arcadane_cms_data_changed'));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  const exoticDestinations = [
    {
      title: 'Bali, Indonésia',
      desc: 'Encanta pela profunda espiritualidade, templos sagrados, florestas com cachoeiras, praias paradisíacas e uma conexão inigualável com a natureza.',
      tag: 'Cultura & Natureza',
      num: '01'
    },
    {
      title: 'Safári no Serengeti',
      desc: 'Vivencie a vida selvagem intocada na Tanzânia ou Quênia. Observar os animais livres no Serengeti é uma jornada de conexão profunda com a Terra.',
      tag: 'Aventura Selvagem',
      num: '02'
    },
    {
      title: 'Deserto do Atacama',
      desc: 'Localizado no Chile, impressiona pelo silêncio reconfortante absoluta, lagoas salinas de cores intensas e as paisagens mais lunares do planeta.',
      tag: 'Contemplação',
      num: '03'
    },
    {
      title: 'Ilhas Maldivas',
      desc: 'O ápice da tranquilidade de águas mornas que parecem pintadas à mão, bangalôs privativos sobre corais e areias perfeitamente reluzentes.',
      tag: 'Privacidade',
      num: '04'
    },
    {
      title: 'Marrakech, Marrocos',
      desc: 'Um mergulho cultural fascinante de tons avermelhados, rica arquitetura mourisca, aromas de especiarias e bazares pulsantes de história antiga.',
      tag: 'História & Arte',
      num: '05'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-28 pb-24 pt-4 text-brand-dark"
      id="about-view"
    >
      
      {/* 1. Hero Header Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6" id="about-hero">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-[#AF4934]/10 text-brand-primary border border-[#DCCFC1]/50 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Quem Somos • Arcadane Viagens
        </motion.div>
        
        <motion.h1 
          variants={itemVariants} 
          className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-brand-dark tracking-tight leading-none"
        >
          Nossa trajetória, <span className="text-brand-primary font-normal italic font-serif">nosso propósito</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed"
        >
          Uma curadoria de viagens desenhada de forma manual e exclusiva para pessoas que valorizam o tempo e os afetos.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex justify-center pt-2">
          <div className="w-24 h-[1px] bg-linear-to-r from-transparent via-[#AF4934] to-transparent" />
        </motion.div>
      </section>

      {/* 2. Brand Founders Spotlight Section (NEW MODERN ADDITION) */}
      <section className="max-w-6xl mx-auto px-4 space-y-12" id="about-founders-spotlight">
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-primary font-bold">Liderança Especializada</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">Sócios-Fundadores</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Por trás de cada roteiro de sofisticação e excelência técnica, há um trio parceiro cuidando de cada detalhe da sua história.
          </p>
        </motion.div>

        {/* Co-founders Layout with Massive Square Photo & Profiles Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto" id="founders-split-container">
          
          {/* Column 1: Giant Square Interactive Team Photo Frame */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 space-y-4"
          >
            <div className="group relative aspect-square rounded-3xl overflow-hidden border border-[#DCCFC1] shadow-xl bg-stone-900">
              {/* Display Photo */}
              <img 
                src={foundersPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                alt="Maria, Mateus e Mariana - Sócios-Fundadores Arcadane Viagens" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {/* Dark sophisticated overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/15 to-transparent transition-opacity duration-300" />
              
              {/* In-place founders photo editor bar */}
              {rafesOpen && (
                <div 
                  className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-brand-dark/85 hover:bg-brand-dark backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="file"
                    id="founders-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressedUrl = await uploadImageToStorage(file);
                          handleUpdateFoundersPhoto(compressedUrl);
                        } catch (error) {
                          console.error("Error compressing founders photo:", error);
                          alert("Falha ao processar a imagem. Tente outro arquivo.");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('founders-file-input')?.click()}
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
                        handleUpdateFoundersPhoto(url.trim());
                      }
                    }}
                    title="Colar link de imagem da internet"
                    className="flex items-center gap-1 text-[11px] font-display text-white hover:text-brand-secondary transition-colors cursor-pointer font-medium"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Link</span>
                  </button>
                  {foundersPhoto && (
                    <>
                      <span className="text-white/20 text-xs">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Deseja realmente voltar para a imagem original?")) {
                            handleUpdateFoundersPhoto("");
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
              
              {/* Overlay with labels */}
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#AF4934] font-mono font-bold block mb-1">
                  Diretoria Executiva
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Maria, Mateus & Mariana
                </h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed mt-1 font-light">
                  Estilo de viagem sob medida desenhado à mão livre.
                </p>
              </div>
            </div>

            {/* Support Actions beneath image block */}
            <div className="flex items-center justify-between px-2">
              <span className="text-[10.5px] text-stone-400 font-sans italic inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#AF4934]" />
                Excelência & Curadoria Arcadane
              </span>
            </div>
          </motion.div>

          {/* Column 2: Detailed Profiles of the Three Partners */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Maria Detail */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#fcfbf7] rounded-2xl border border-brand-border p-6 shadow-2xs hover:shadow-xs transition-shadow relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#AF4934]/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h4 className="font-display font-bold text-lg text-brand-dark">Maria</h4>
                    <span className="text-[9.5px] uppercase tracking-widest text-[#AF4934] font-mono font-bold">
                      Diretora de Experiências • Sócia-Fundadora
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-gray-500 leading-relaxed font-sans font-light">
                    Maria é whom traduz seus desejos mais sensíveis em hospedagens exclusivas, surpresas pontuais e acolhimento incomparável. Seu compromisso é assegurar que cada hotel recomendado, cada restaurante sugerido e cada detalhe da experiência transborde afeto e sofisticação legítima.
                  </p>
                  <div className="border-t border-brand-border/60 pt-3 flex items-center justify-between">
                    <span className="font-signature text-2.5xl text-brand-primary select-none rotate-[-1deg]">Maria</span>
                    <span className="text-[9.5px] text-gray-400 font-mono italic">"Curadoria detalhista e humana"</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mateus Detail */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#fcfbf7] rounded-2xl border border-brand-border p-6 shadow-2xs hover:shadow-xs transition-shadow relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#AF4934]/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h4 className="font-display font-bold text-lg text-brand-dark">Mateus</h4>
                    <span className="text-[9.5px] uppercase tracking-widest text-[#AF4934] font-mono font-bold">
                      Diretor de Operações • Sócio-Fundador
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-gray-500 leading-relaxed font-sans font-light">
                    Mateus coordena a mecânica técnica em altíssimo nível de excelência. Especialista em resolver conexões inteligentes, passagens executivas, traslados executivos privativos e suporte active 24 horas, acompanhando silenciosamente seus passos para garantir zero preocupação e máxima proteção.
                  </p>
                  <div className="border-t border-brand-border/60 pt-3 flex items-center justify-between">
                    <span className="font-signature text-2.5xl text-brand-primary select-none rotate-[-1deg]">Mateus</span>
                    <span className="text-[9.5px] text-gray-400 font-mono italic">"Técnico, seguro e vigilante"</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mariana Detail */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#fcfbf7] rounded-2xl border border-brand-border p-6 shadow-2xs hover:shadow-xs transition-shadow relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#AF4934]/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h4 className="font-display font-bold text-lg text-brand-dark">Mariana</h4>
                    <span className="text-[9.5px] uppercase tracking-widest text-[#AF4934] font-mono font-bold">
                      Diretora de Relacionamento • Sócia-Fundadora
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-gray-500 leading-relaxed font-sans font-light">
                    Mariana lidera o elo mais nobre com nossos clientes, garantindo a assessoria contínua de concierge. Ela assegura que todas as demandas, agendamentos gastronômicos sofisticados ou upgrades de quartos aconteçam nos bastidores de forma prática.
                  </p>
                  <div className="border-t border-brand-border/60 pt-3 flex items-center justify-between">
                    <span className="font-signature text-2.5xl text-brand-primary select-none rotate-[-1deg]">Mariana</span>
                    <span className="text-[9.5px] text-gray-400 font-mono italic">"Relacionamento de alto padrão"</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. Corporate Philosophy & Poetic Description Section */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-trajectory">
        
        {/* Poetic description */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <motion.div variants={itemVariants} className="space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-brand-primary font-bold">Nossa Manifestação</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark tracking-tight leading-tight">
              Consultoria especializada com <span className="font-serif italic font-normal text-brand-primary">propósito humano</span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5 font-sans text-sm sm:text-base text-gray-500 leading-relaxed text-left font-light">
            <p className="font-medium text-brand-dark text-base leading-relaxed bg-[#AF4934]/5 p-4.5 rounded-xl border-l-2 border-brand-primary">
              "A Arcadane Viagens não nasceu para ser apenas mais uma opção no mercado de turismo, mas sim com o firme propósito de transformar o simples ato de viajar em uma experiência cheia de significado."
            </p>
            <p>
              Unimos planejamento técnico de ponta e uma profunda sensibilidade humana para planejar roteiros sob medida, projetados milimetricamente de acordo com o ritmo, o estilo de vida e os sonhos de cada cliente.
            </p>
            <p>
              Cuidamos com carinho e responsabilidade profissional de cada aspecto, desde a primeira reunião de brainstorm até o seu desembarque de volta no Brasil. Nosso diferencial repousa sobre a escuta atenciosa e a execução em altíssimo nível de excelência.
            </p>
          </motion.div>
        </div>

        {/* Core Pillars box layout in Bento Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5" id="about-pillars">
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl border border-brand-border/60 hover:border-brand-primary/40 space-y-4 text-left shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#AF4934]/10 flex items-center justify-center text-brand-primary">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-dark text-sm sm:text-base">Curadoria Especial</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mt-2">
                Damos exclusividade total à escolha de atrações, roteiros e experiências marcantes.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl border border-brand-border/60 hover:border-brand-primary/40 space-y-4 text-left shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#AF4934]/10 flex items-center justify-center text-brand-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-dark text-sm sm:text-base">Segurança Prática</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mt-2">
                Trabalhamos apenas com operadoras credenciadas, transfer de confiança e seguro internacional.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl border border-brand-border/60 hover:border-brand-primary/40 space-y-4 text-left shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#AF4934]/10 flex items-center justify-center text-brand-primary">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-dark text-sm sm:text-base">Cuidado Humano</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mt-2">
                Nosso atendimento se estende até o pós-venda, acompanhando sua vivência com carinho diário.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl border border-brand-border/60 hover:border-brand-primary/40 space-y-4 text-left shadow-2xs hover:shadow-xs transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#AF4934]/10 flex items-center justify-center text-brand-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-dark text-sm sm:text-base">Detalhes Singulares</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mt-2">
                Acreditamos que mimos, diquinhas locais e caprichos logísticos fazem toda a diferença.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Exotic Destinations Deep-Dive reading layout based on website copy */}
      <section className="bg-white py-20 border-y border-brand-border/40" id="about-exotics">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-primary font-bold">Roteiros Incomuns</span>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
                Destinos exóticos
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans font-light">
                Viajar para destinos exóticos é, muitas vezes, sair do roteiro tradicional e se permitir viver algo verdadeiramente transformador, expandindo perspectivas.
              </p>
              <div className="h-[2px] w-12 bg-brand-primary/40" />
            </div>
            
            <div className="lg:col-span-8 space-y-8 text-left font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
              <p className="font-light">
                Viajar para destinos exóticos é mergulhar em culturas totalmente distintas, abrindo espaço para novas sensações. Não são viagens triviais focadas apenas em belos cartões-postais; são vivências que nos convidam a reformular opiniões e resgatar o encanto pelas maravilhas do mundo.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4" id="exotics-category-cards">
                {exoticDestinations.map((ex, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.01, borderColor: '#AF4934' }}
                    className="bg-brand-light p-6 rounded-2xl space-y-3.5 border border-brand-border text-left transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary text-[9px] font-bold font-mono uppercase tracking-wider">{ex.tag}</span>
                      <span className="text-xl font-mono font-extrabold text-[#AF4934]/30">{ex.num}</span>
                    </div>
                    <h4 className="font-display font-bold text-brand-dark text-base">{ex.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">{ex.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Meticulous Art Block */}
              <div className="bg-brand-dark text-white p-8 rounded-2xl border border-brand-primary/20 space-y-5 mt-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Quote className="w-4 h-4 text-[#AF4934]" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-[#AF4934] text-base sm:text-lg">A arte de um planejamento meticuloso</h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                      Decidir viajar para refúgios exóticos exige técnica e responsabilidade. Detalhes como a sazonalidade e épocas perfeitas das chuvas ou monções, as exigências de vistos, as vacinas internacionais obrigatórias e as rotas seguras de deslocamentos domésticos são cruciais.
                    </p>
                    <p className="text-xs sm:text-sm font-medium italic font-serif text-[#fdfcf9] border-t border-brand-border/20 pt-4 leading-relaxed">
                      "E é justamente nessa profundidade de curadoria que viagens memoráveis se destacam. Quando tudo está planejado com carinho técnico, você desliga das dores de cabeça da logística e passa a usufruir o que realmente importa: a eternidade do momento."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </motion.div>
  );
}
