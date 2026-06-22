import React from 'react';
import { ShieldCheck, Calendar, Lock, FileText, Scale, CheckCircle2, FileUp } from 'lucide-react';

export default function PrivacyPolicyView() {
  const sections = [
    {
      id: "compromisso",
      title: "1. Nosso Compromisso de Privacidade",
      icon: <ShieldCheck className="w-5 h-5 text-brand-secondary shrink-0" />,
      content: "Na Arcadane Viagens LTDA, a proteção da sua privacidade e de seus dados pessoais é pilar constituinte da nossa promessa de excelência. Projetamos experiências singulares e de altíssimo padrão, e tratamos suas informações com o mesmo esmero e exclusividade aplicados na curadoria de suas viagens. Esta Política detalha como coletamos, guardamos, protegemos e utilizamos suas informações cadastrais e preferências de experiências de viagem."
    },
    {
      id: "coleta",
      title: "2. Informações de Elite Coletadas",
      icon: <Lock className="w-5 h-5 text-brand-secondary shrink-0" />,
      content: "Para planejar estrategicamente suas conexões terrestres e aéreas, emitir milhas e reservar hotéis boutique, coletamos informações essenciais que garantem seu conforto e total conformidade:",
      bullets: [
        "Identificação Completa: Nome, data de nascimento, documentos oficiais (RG, CPF e Passaporte válido) necessários para emissão e check-ins.",
        "Dados de Contato: WhatsApp de uso prioritário, e-mail comercial e endereço residencial para emissão de faturamento ou correspondência física caso aplicável.",
        "Preferências de Luxo: Restrições alimentares, alergias, necessidades médicas ou de mobilidade, preferências de assento e leito, frequência de fidelidade com companhias e redes de hotelaria."
      ]
    },
    {
      id: "uso",
      title: "3. Como Utilizamos Suas Informações",
      icon: <FileText className="w-5 h-5 text-brand-secondary shrink-0" />,
      content: "Suas informações são processadas única e estritamente para as seguintes finalidades legítimas:",
      bullets: [
        "Curadoria e reservas junto a operadores de turismo de luxo (ex: redes Belmond, hotéis parceiros, companhias aéreas de elite e consolidadoras oficiais como BeFly).",
        "Atendimento personalizado via canais de WhatsApp oficiais de nossos consultores dedicados (Mateus, Maria e Mariana).",
        "Envio quinzenal de conteúdos de tendência, ofertas sigilosas e roteiros pré-arquitetados de alta temporada (quando explicitamente solicitado)."
      ]
    },
    {
      id: "seguranca",
      title: "4. Protocolos de Segurança da Informação",
      icon: <Scale className="w-5 h-5 text-brand-secondary shrink-0" />,
      content: "Adotamos as melhores práticas tecnológicas e legais inspiradas nas leis nacionais e internacionais de processamento de dados (LGPD - Lei Geral de Proteção de Dados, Lei nº 13.709/2018):",
      bullets: [
        "Tráfego encriptado com chaves SSL e ambientes web com integridade estrita.",
        "Acesso restrito: Apenas os consultores e analistas da Arcadane diretamente responsáveis pelas suas reservas possuem permissão restrita para manusear e-mails, passaportes ou bilhetes de embarque.",
        "Armazenamento Premium minimizado com exclusão programada pós-período fiscal obrigatório."
      ]
    },
    {
      id: "contato",
      title: "5. Direitos e Canal de Esclarecimentos",
      icon: <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0" />,
      content: "Você é o único detentor do controle de sua jornada e de seus dados. A qualquer tempo, sob demanda expressa, você poderá solicitar a correção de dados desatualizados, obter a confirmação da existência de tratamento ou exigir a revogação de consentimentos e eliminação completa de seus registros cadastrais de nossa infraestrutura.",
      additional: "Para exercer seus direitos ou para resolver quaisquer indagações, fale diretamente e imediatamente com nossa coordenação técnica através do mail oficial: financeiro@arcadaneviagens.com."
    }
  ];

  return (
    <div className="bg-brand-beige min-h-screen py-16 sm:py-24 text-stone-800 font-sans" id="privacy-policy-view">
      
      {/* Editorial Header Card with soft classic background styling */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 pb-12 border-b border-stone-300">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#AF4934] font-black block">
            CONFORMIDADE JURÍDICA E SEGURANÇA
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 tracking-tight leading-tight uppercase">
            POLÍTICA DE PRIVACIDADE
          </h1>
          <p className="text-[11px] text-stone-500 font-mono tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Atualizado em 16 de Junho de 2026
          </p>
        </div>
      </div>

      {/* Main Narrative Split / Modern Layout design */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="bg-white rounded-3xl border border-stone-250/80 shadow-xs p-6 sm:p-10 space-y-10 text-left">
          
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-primary leading-none">
              Aos Nossos Seletos Clientes & Viajantes,
            </h2>
            <p className="text-sm font-serif italic text-stone-600 leading-relaxed">
              &ldquo;A segurança de suas memórias começa no silêncio e no absoluto sigilo das suas informações pessoais e operacionais. Garantimos a maior blindagem e o cumprimento integral e rigoroso de todas as normas da LGPD nacional.&rdquo;
            </p>
          </div>

          <div className="space-y-8 pt-4 border-t border-stone-150">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4" id={`section-${section.id}`}>
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-stone-950 tracking-tight">
                    {section.title}
                  </h3>
                </div>
                
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  {section.content}
                </p>

                {section.bullets && (
                  <ul className="space-y-2.5 pl-1.5 pt-1">
                    {section.bullets.map((bullet, bIdx) => {
                      const splitParts = bullet.split(':');
                      const titlePart = splitParts[0];
                      const descPart = splitParts.slice(1).join(':');
                      return (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs text-stone-600 leading-relaxed font-light">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <div>
                            {descPart ? (
                              <>
                                <strong className="font-bold text-stone-900 font-sans tracking-wide">{titlePart}:</strong>
                                <span className="text-stone-600">{descPart}</span>
                              </>
                            ) : (
                              <span>{bullet}</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {section.additional && (
                  <p className="text-xs text-stone-500 font-mono italic pt-2 bg-stone-50 border border-stone-200/50 p-4.5 rounded-2xl">
                    {section.additional}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Legal Stamp Footer inside the body */}
          <div className="pt-10 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 gap-4 mt-8">
            <div className="space-y-0.5 font-sans">
              <p className="font-bold text-stone-900">Arcadane Viagens LTDA</p>
              <p className="font-mono text-[9px] text-stone-500">CNPJ 48.799.471/0001-38 — Balneário Camboriú, SC</p>
            </div>
            <span className="font-serif italic text-stone-400 select-none">
              Inspirando confiança, esculpindo caminhos.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
