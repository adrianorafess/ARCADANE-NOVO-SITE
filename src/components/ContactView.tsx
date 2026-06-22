import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Compass, Instagram, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { getSeoSettings } from '../utils/cmsStore';

export default function ContactView() {
  const [seo, setSeo] = useState(() => getSeoSettings());

  useEffect(() => {
    const handleCms = () => setSeo(getSeoSettings());
    window.addEventListener('arcadane_cms_data_changed', handleCms);
    return () => window.removeEventListener('arcadane_cms_data_changed', handleCms);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Por favor, preencha o nome e o telefone (WhatsApp) para retorno.');
      return;
    }

    // Format message to trigger optional direct WhatsApp redirection or normal database submit success
    const textMsg = `*Vim pelo link do site da Arcadane*\n\n` +
      `*MENSAGEM DE CONTATO — ARCADANE SITE*\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📞 *WhatsApp:* ${formData.phone}\n` +
      `📧 *E-mail:* ${formData.email || 'Não informado'}\n` +
      `🏷️ *Assunto:* ${formData.subject || 'Dúvida Geral'}\n` +
      `💬 *Mensagem:* ${formData.message}`;

    const mateusPhone = seo.contactWhatsAppMateus || '554791492704';
    const waLink = `https://wa.me/${mateusPhone}?text=${encodeURIComponent(textMsg)}`;
    
    // Simulate submit & trigger WhatsApp trigger
    setIsSubmitted(true);
    window.open(waLink, '_blank');
  };

  return (
    <div className="space-y-16 pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="contact-section">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-primary font-bold">Canais de Contato</span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Fale Conosco
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
          Estamos prontos para atender você com o cuidado e a agilidade que a sua próxima viagem merece. Envie uma mensagem ou fale imediatamente no nosso WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left" id="contact-main-grid">
        
        {/* Left column: Contact Info Details & Maps visual representation */}
        <div className="lg:col-span-5 space-y-8" id="contact-details-box">
          <div className="bg-brand-dark text-white p-8 rounded-3xl border border-white/5 space-y-8 relative overflow-hidden">
            {/* decoration blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl" />

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-white">Informações da Agência</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Arcadane Viagens — Consultoria independente de roteiros personalizados com base em SC.
              </p>
            </div>

            <ul className="space-y-5.5 font-sans" id="contact-info-list">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-brand-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-bold uppercase tracking-wider block">Localização Sede</span>
                  <span className="text-sm text-gray-200 block mt-0.5 font-semibold">Balneário Camboriú, SC — Brasil</span>
                  <span className="text-[11px] text-gray-500 block font-mono mt-1">Orgulhosamente de Balneário Camboriú 🤍</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">WhatsApp Suporte</span>
                  <a href={`https://wa.me/${seo.contactWhatsAppMateus || '554791492704'}?text=${encodeURIComponent("Olá Mateus! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-200 block hover:text-brand-primary transition-colors font-semibold">
                    {seo.contactWhatsAppMateus ? `+${seo.contactWhatsAppMateus}` : "+55 (47) 9149-2704"} <span className="text-gray-500 text-xs font-normal ml-0.5">(Mateus)</span>
                  </a>
                  <a href={`https://wa.me/${seo.contactWhatsAppMaria || '5547992008571'}?text=${encodeURIComponent("Olá Maria e Mariana! Vim pelo link do site da Arcadane e gostaria de iniciar um atendimento.")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-200 block hover:text-brand-primary transition-colors font-semibold">
                    {seo.contactWhatsAppMaria ? `+${seo.contactWhatsAppMaria}` : "+55 (47) 99200-8571"} <span className="text-gray-500 text-xs font-normal ml-0.5">(Maria & Mariana)</span>
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-bold uppercase tracking-wider block">E-mail Corporativo</span>
                  <a href="mailto:financeiro@arcadaneviagens.com" className="text-sm text-gray-200 block mt-0.5 hover:text-brand-primary transition-colors font-semibold">
                    financeiro@arcadaneviagens.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-bold uppercase tracking-wider block">Horário de Atendimento</span>
                  <span className="text-xs text-gray-300 block mt-0.5 font-semibold">Segunda a Sexta: 09:00 às 18:30 <br />Sábados: Plantão das 09:00 às 13:00</span>
                </div>
              </li>
            </ul>

            <div className="border-t border-white/5 pt-6 flex items-center gap-4">
              <span className="text-xs text-gray-400 font-medium">Acompanhe:</span>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/arcadaneviagens/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-primary flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Aesthetic layout of Location presence in Balneario Camboriu */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-4.5 text-left shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-brand-dark tracking-tight leading-none text-base">Atendimento do Litoral Catarinense</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                Nossa assessoria atende presencialmente e online em toda a região de Itapema, Joinville, Camboriú, Itajaí, Blumenau e Florianópolis, enviando propostas personalizadas imediatas.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form with interactive responses */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs relative text-left">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-layout">
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-brand-dark text-xl tracking-tight leading-none">Envie uma mensagem</h3>
                <p className="text-xs text-gray-400 font-sans">Todos os campos marcados com * são obrigatórios para retorno.</p>
              </div>

              {/* Name and email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Seu Nome *</label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    placeholder="Como podemos lhe chamar?"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">E-mail Principal</label>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="Ex: adriano@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Whatsapp phone */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">WhatsApp com ddd *</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    required
                    placeholder="Ex: (47) 98891-8454"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                  />
                </div>

                {/* Subject dropdown or open input */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Assunto</label>
                  <input
                    type="text"
                    id="contact-subject"
                    placeholder="Ex: Cotação de passagem, Cruzeiro, Geral"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                  />
                </div>
              </div>

              {/* Message block */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold font-mono tracking-wider uppercase text-gray-500 block">Sua Mensagem *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Escreva detalhes do roteiro, datas procuradas, dúvidas fiscais de viagem ou suporte geral..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-brand-light border border-gray-150 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-primary font-sans text-brand-dark"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold font-display shadow-lg shadow-brand-primary/20 transition-all cursor-pointer hover:scale-101 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar para Equipe no WhatsApp</span>
              </button>

            </form>
          ) : (
            /* IF SUBMITTED - SUCCESS LAYOUT */
            <div className="text-center py-12 space-y-6" id="contact-success-msg">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto border border-brand-primary/25 shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-brand-dark">Sua mensagem foi gerada!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed font-sans">
                  Prontinho! Suas informações foram formatadas de forma organizada e direcionadas para o nosso WhatsApp consultivo de suporte ao cliente.
                </p>
              </div>

              <div className="bg-brand-light/65 p-4 py-5 rounded-2xl border border-gray-100 text-left max-w-sm mx-auto">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono">Não foi direcionado?</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-2 font-sans">
                  Se a redireção automática do navegador foi bloqueada pelo seu celular ou iframe, clique no botão físico de contingência abaixo.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-brand-primary text-white font-bold font-display text-xs py-3 rounded-xl mt-4 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ir para WhatsApp
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                className="text-xs font-bold text-brand-primary hover:text-brand-secondary cursor-pointer py-1 border-b border-brand-primary hover:border-brand-secondary transition-colors"
              >
                Enviar nova mensagem
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
