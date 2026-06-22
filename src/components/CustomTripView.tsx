import React, { useState, useEffect } from 'react';
import { TripPlannerData } from '../types';
import { 
  Compass, ChevronRight, ChevronLeft, Map, Users, Heart, ClipboardList, 
  Sparkles, Check, Send, Plus, Minus, User, Mail, PhoneCall 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSeoSettings } from '../utils/cmsStore';

export default function CustomTripView() {
  const [step, setStep] = useState(1);
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);
  const [formData, setFormData] = useState<TripPlannerData>({
    destinationType: '',
    destinationDetails: '',
    travelMonth: '',
    durationDays: 7,
    travelersCount: 2,
    kidsCount: 0,
    travelStyle: '',
    travelerName: '',
    travelerEmail: '',
    travelerPhone: '',
    additionalRequests: ''
  });

  const [isSent, setIsSent] = useState(false);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Qualquer Mês'
  ];

  const travelStyles = [
    { id: 'luxury', label: 'Luxo Premium', desc: 'Hoteis 5 estrelas, bangalôs privativos e experiências exclusivas VIP.' },
    { id: 'comfort', label: 'Conforto & Charme', desc: 'Excelente custo-benefício, pousadas charmosas e roteiro sob controle.' },
    { id: 'family', label: 'Familiar', desc: 'Roteiros de entretenimento, facilidades para idosos ou crianças e lazer.' },
    { id: 'backpack', label: 'Mochileiro Autêntico', desc: 'Conexão puramente cultural, roteiro flexível, hostels ou pousadas simples.' },
    { id: 'adventure', label: 'Aventura & Ecoturismo', desc: 'Trilhas, cachoeiras, safáris, contato intenso selvagem e esportes.' }
  ];

  const updateField = (key: keyof TripPlannerData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Step 3
    if (!formData.travelerName || !formData.travelerPhone) {
      alert('Por favor, preencha seu nome e telefone principal para gerarmos seu roteiro.');
      return;
    }

    // Format WhatsApp serialization message
    const formattedStyle = travelStyles.find(s => s.id === formData.travelStyle)?.label || 'A Combinar';
    const destinationText = formData.destinationType === 'nacional' ? 'Nacional 🇧🇷' : 'Internacional ✈️';
    
    const message = `*Vim pelo link do site Arcadane*\n\n*ROTEIRO PERSONALIZADO — ARCADANE VIAGENS*\n` +
      `👤 *Cliente:* ${formData.travelerName}\n` +
      `📞 *WhatsApp:* ${formData.travelerPhone}\n` +
      `📧 *E-mail:* ${formData.travelerEmail || 'Não informado'}\n\n` +
      `📍 *Destino:* ${formData.destinationDetails || 'A Definir'} (${destinationText})\n` +
      `📅 *Mês de Viagem:* ${formData.travelMonth || 'A combinar'}\n` +
      `⏳ *Duração Estimada:* ${formData.durationDays} dias\n\n` +
      `👥 *Viajantes:* ${formData.travelersCount} adultos e ${formData.kidsCount} crianças\n` +
      `✨ *Estilo da Viagem:* ${formattedStyle}\n` +
      `📝 *Pedidos Especiais:* ${formData.additionalRequests || 'Nenhum'}`;

    const plannerWhatsAppMateus = seo.contactWhatsAppMateus || '554791492704';
    const waLink = `https://wa.me/${plannerWhatsAppMateus}?text=${encodeURIComponent(message)}`;
    
    // Simulate internal success & open WhatsApp in new window
    setIsSent(true);
    window.open(waLink, '_blank');
  };

  return (
    <div className="space-y-12 pb-20 pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" id="custom-planner-section">
      
      {/* Title block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Roteiro Personalizado</span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Desenhe sua Viagem Conosco
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
          Nossa consultoria especializada cuida de todos os detalhes técnicos. Conte-nos seus planos iniciais neste breve formulário e montaremos um rascunho de roteiro exclusivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="custom-planner-grid">
        
        {/* Left Side: Wizard Form container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs relative text-left">
          
          {/* Step Indicator Header bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8" id="planner-indicators">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
              <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Destino</span>
            </div>
            <div className="w-10 h-0.5 bg-gray-150" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
              <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Estilo & Viajantes</span>
            </div>
            <div className="w-10 h-0.5 bg-gray-150" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>3</span>
              <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Contatos</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: -15, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                
                {/* STEP 1: DESTINO & DATAS */}
                {step === 1 && (
                  <div className="space-y-6" id="planner-step-1">
                    <h3 className="font-display font-bold text-lg text-brand-dark flex items-center gap-2">
                      <Map className="text-brand-primary w-5 h-5" />
                      1. Onde e quando você quer viajar?
                    </h3>

                    {/* Destination class type */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Tipo do Destino</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => updateField('destinationType', 'nacional')}
                          className={`p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                            formData.destinationType === 'nacional'
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary'
                              : 'bg-white border-gray-100 hover:border-brand-primary/20 hover:text-brand-primary'
                          }`}
                        >
                          <span className="text-2xl">🇧🇷</span>
                          <span>Região Nacional</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('destinationType', 'internacional')}
                          className={`p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                            formData.destinationType === 'internacional'
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary'
                              : 'bg-white border-gray-100 hover:border-brand-primary/20 hover:text-brand-primary'
                          }`}
                        >
                          <span className="text-2xl">✈️</span>
                          <span>Internacional</span>
                        </button>
                      </div>
                    </div>

                    {/* Specific details of destination */}
                    <div className="space-y-2">
                      <label htmlFor="destination-details" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Quais países, cidades ou atrativos no radar?</label>
                      <input
                        type="text"
                        id="destination-details"
                        placeholder="Ex: Ubud em Bali, Orlando, Itapema, Serras"
                        value={formData.destinationDetails}
                        onChange={(e) => updateField('destinationDetails', e.target.value)}
                        className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                      />
                    </div>

                    {/* Duration slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Duração Estimada</label>
                        <span className="text-sm font-bold text-brand-primary font-mono">{formData.durationDays} dias</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        value={formData.durationDays}
                        onChange={(e) => updateField('durationDays', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-150 accent-brand-primary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Travel months picker */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Melhor época para embarque</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {months.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => updateField('travelMonth', m)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                              formData.travelMonth === m
                                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-brand-primary/20 hover:bg-brand-primary/5'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ESTILO DE VIAGEM & QUANTIDADE */}
                {step === 2 && (
                  <div className="space-y-6" id="planner-step-2">
                    <h3 className="font-display font-bold text-lg text-brand-dark flex items-center gap-2">
                      <Users className="text-brand-primary w-5 h-5" />
                      2. Estilo de Viagem e Viajantes
                    </h3>

                    {/* Travelers Count Adjuster row */}
                    <div className="grid grid-cols-2 gap-4 pb-4">
                      {/* Adults counter */}
                      <div className="bg-brand-light/60 p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">Adultos</span>
                        <div className="flex items-center gap-4 pt-1">
                          <button
                            type="button"
                            onClick={() => updateField('travelersCount', Math.max(1, formData.travelersCount - 1))}
                            className="w-8 h-8 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:border-brand-primary text-brand-dark hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-display font-extrabold text-brand-dark text-lg">{formData.travelersCount}</span>
                          <button
                            type="button"
                            onClick={() => updateField('travelersCount', formData.travelersCount + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:border-brand-primary text-brand-dark hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Kids Counter */}
                      <div className="bg-brand-light/60 p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">Crianças (0-12)</span>
                        <div className="flex items-center gap-4 pt-1">
                          <button
                            type="button"
                            onClick={() => updateField('kidsCount', Math.max(0, formData.kidsCount - 1))}
                            className="w-8 h-8 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:border-brand-primary text-brand-dark hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-display font-extrabold text-brand-dark text-lg">{formData.kidsCount}</span>
                          <button
                            type="button"
                            onClick={() => updateField('kidsCount', formData.kidsCount + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-150 flex items-center justify-center hover:border-brand-primary text-brand-dark hover:text-brand-primary transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Travel style selection grid */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Qual o estilo de roteiro preferido?</label>
                      <div className="grid grid-cols-1 gap-3">
                        {travelStyles.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => updateField('travelStyle', item.id)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex gap-4 items-center ${
                              formData.travelStyle === item.id
                                ? 'bg-brand-primary/5 border-brand-primary text-brand-primary'
                                : 'bg-white border-gray-100 hover:border-brand-primary/20'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${formData.travelStyle === item.id ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200'}`}>
                              {formData.travelStyle === item.id && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-sm text-brand-dark leading-none">{item.label}</h4>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONTACT FORM */}
                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-6" id="planner-step-3">
                    <h3 className="font-display font-bold text-lg text-brand-dark flex items-center gap-2">
                      <ClipboardList className="text-brand-primary w-5 h-5" />
                      3. Seus contatos para envio do roteiro
                    </h3>

                    {/* Inputs fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="traveler-name" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Seu Nome Completo *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            id="traveler-name"
                            required
                            placeholder="Anote seu nome"
                            value={formData.travelerName}
                            onChange={(e) => updateField('travelerName', e.target.value)}
                            className="w-full bg-brand-light border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                          />
                        </div>
                      </div>

                      {/* Phone / Whatsapp */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="traveler-phone" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">WhatsApp com DDD *</label>
                        <div className="relative">
                          <PhoneCall className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            id="traveler-phone"
                            required
                            placeholder="Ex: (47) 98891-8454"
                            value={formData.travelerPhone}
                            onChange={(e) => updateField('travelerPhone', e.target.value)}
                            className="w-full bg-brand-light border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="traveler-email" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">E-mail para cópia (Opcional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          id="traveler-email"
                          placeholder="Ex: adriano@email.com"
                          value={formData.travelerEmail}
                          onChange={(e) => updateField('travelerEmail', e.target.value)}
                          className="w-full bg-brand-light border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                        />
                      </div>
                    </div>

                    {/* Special requests comments */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="additional-requests" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Comentários ou Pedidos Especiais</label>
                      <textarea
                        id="additional-requests"
                        rows={4}
                        placeholder="Ex: Prefiro voo noturno direto, hotéis boutique com banheira, viajaremos para comemorar aniversário de casamento..."
                        value={formData.additionalRequests}
                        onChange={(e) => updateField('additionalRequests', e.target.value)}
                        className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                      />
                    </div>

                    {/* Direct Submit CTA */}
                    <button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold font-display shadow-lg shadow-brand-primary/20 mt-4 transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gerar & Enviar Roteiro via WhatsApp</span>
                    </button>
                  </form>
                )}

                {/* Indicator buttons next / prev */}
                <div className="flex gap-4 items-center justify-between pt-6 border-t border-gray-100" id="planner-navigation-buttons">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-1.5 font-bold font-display text-sm text-gray-500 hover:text-brand-dark cursor-pointer py-2 px-3 hover:bg-gray-55/4 rounded-xl transition-colors"
                    >
                      <ChevronLeft className="w-5.5 h-5.5" />
                      Anterior
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-brand-primary hover:bg-brand-secondary text-white font-bold font-display text-sm px-6 py-3 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      Próximo
                      <ChevronRight className="w-5.5 h-5.5" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

              </motion.div>
            ) : (
              /* IF ALREADY SENT - SUCCESS CARD */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
                id="planner-success-msg"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto border border-brand-primary/25 shadow-xs">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl text-brand-dark">Roteiro enviado com sucesso!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Fabuloso! Suas preferências de viagem foram consolidadas de forma moderna e enviadas ao nosso time consultivo via no WhatsApp.
                  </p>
                </div>
                <div className="bg-brand-light/65 p-5 rounded-2xl border border-gray-100 text-left max-w-sm mx-auto">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono">Não abriu o WhatsApp?</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    Não se preocupe! Você pode clicar no botão de contingência abaixo para forçar o redirecionamento.
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-brand-primary text-white font-bold font-display text-xs py-2.5 rounded-lg mt-4 inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Reenviar para WhatsApp
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsSent(false); setStep(1); }}
                  className="text-xs font-bold text-brand-primary border-b border-brand-primary hover:text-brand-secondary hover:border-brand-secondary transition-colors cursor-pointer py-1"
                >
                  Criar outro planejamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side: Dynamic Trip Summary live preview Card */}
        <div className="lg:col-span-5 sticky top-28" id="planner-preview-sidebar">
          <div className="glass-card bg-brand-dark text-white p-7.5 rounded-3xl border border-white/5 space-y-6 text-left relative overflow-hidden">
            {/* background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl" />
            
            <span className="text-[10px] uppercase tracking-widest text-brand-primary font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Resumo do Roteiro
            </span>

            <div className="space-y-4" id="preview-data-entries">
              
              {/* Destination row */}
              <div className="space-y-1 pb-4 border-b border-white/5">
                <span className="text-[10px] text-gray-400 font-mono uppercase">Destino Desejado</span>
                <p className="font-display font-extrabold text-base text-white tracking-tight">
                  {formData.destinationDetails || 'A Definir'}
                  <span className="text-xs font-semibold text-gray-400 block mt-1 font-sans">
                    {formData.destinationType ? (formData.destinationType === 'nacional' ? '🇧🇷 Nacional' : '✈️ Internacional') : 'Sem tipo selecionado'}
                  </span>
                </p>
              </div>

              {/* General dates/duration */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Mês de Embarque</span>
                  <p className="font-display font-bold text-sm text-white mt-1">
                    {formData.travelMonth || 'A combinar'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Duração</span>
                  <p className="font-display font-bold text-sm text-white mt-1">
                    {formData.durationDays} dias
                  </p>
                </div>
              </div>

              {/* Travelers count */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Viajantes</span>
                  <p className="font-display font-bold text-sm text-white mt-1">
                    {formData.travelersCount} Adulto(s)
                    {formData.kidsCount > 0 && <span className="text-xs text-gray-400 block mt-0.5">{formData.kidsCount} criança(s)</span>}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Estilo Roteiro</span>
                  <p className="font-display font-bold text-sm text-white mt-1">
                    {travelStyles.find(s => s.id === formData.travelStyle)?.label || 'A Combinar'}
                  </p>
                </div>
              </div>

              {/* Customer info preview */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-mono uppercase">Viajante Lider</span>
                <p className="font-display font-bold text-sm text-white">
                  {formData.travelerName || 'Não anotado'}
                  {formData.travelerPhone && <span className="text-xs text-gray-400 block font-sans mt-0.5">{formData.travelerPhone}</span>}
                </p>
              </div>

            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-gray-400 leading-relaxed font-sans">
              "Nosso time de consultoria cruzará as informações acima para montar opções de voos perfeitamente conectados, hotéis com acomodações selecionadas de alta avaliação, transfers seguros e assessoria 24h."
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
