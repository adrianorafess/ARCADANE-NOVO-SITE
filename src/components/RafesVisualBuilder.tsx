import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Settings, Paintbrush, Sliders, Shield, RefreshCw, Save, 
  Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Link, Upload, 
  Eye, Check, X, FileText, Phone, Sparkles, MessageCircle, ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getSeoSettings, saveSeoSettings, getHomeSettings, saveHomeSettings, 
  getPromoPackages, savePromoPackages, getPackages, savePackages,
  getTestimonials, saveTestimonials, getBlogPosts, saveBlogPosts,
  resetCmsToDefault, broadcastChange, SeoSettings, HomeSettings, PromoPackage
} from '../utils/cmsStore';
import { compressImage } from '../utils/imageCompressor';
import { PackageItem, PageId } from '../types';

// Preset luxury color schemes
const COLOR_PRESETS = [
  { name: 'Azul e Terracota (Original)', primary: '#3B5EA4', secondary: '#AF4934' },
  { name: 'Verde Imperial & Ouro', primary: '#1B4D3E', secondary: '#C5A059' },
  { name: 'Preto Absoluto & Bronze', primary: '#111111', secondary: '#C58F59' },
  { name: 'Oceano Profundo & Champanhe', primary: '#1E3A8A', secondary: '#E2D1B3' },
  { name: 'Malbec & Safira', primary: '#58111A', secondary: '#3B5EA4' },
];

export default function RafesVisualBuilder({ activePage }: { activePage: PageId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'seo' | 'home' | 'promo' | 'std-packages' | 'contact'>('style');
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('arcadane_admin_logged_in') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleLoginChange = (e: any) => {
      setIsAdminLoggedIn(e.detail.loggedIn);
    };
    window.addEventListener('arcadane_admin_login_changed', handleLoginChange);
    return () => {
      window.removeEventListener('arcadane_admin_login_changed', handleLoginChange);
    };
  }, []);

  const [rafesModeEnabled, setRafesModeEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arcadane_rafes_edit_mode') === 'true';
    }
    return false;
  });

  // Load various store values
  const [seo, setSeo] = useState<SeoSettings>(() => getSeoSettings());
  const [home, setHome] = useState<HomeSettings>(() => getHomeSettings());
  const [promos, setPromos] = useState<PromoPackage[]>(() => getPromoPackages());
  const [stdPackages, setStdPackages] = useState<PackageItem[]>(() => getPackages());

  // Logo upload state
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arcadane_custom_logo');
    }
    return null;
  });

  // Inline Quick Editor popup state
  const [inlineEditData, setInlineEditData] = useState<{
    elementId: string;
    title: string;
    currentValue: string;
    isMultiline: boolean;
    onSaveCallback: (newValue: string) => void;
  } | null>(null);

  const [promptValue, setPromptValue] = useState('');

  // Handle outside click or key notifications
  useEffect(() => {
    const handleOpenInline = (e: any) => {
      const { elementId, title, currentValue, isMultiline, onSaveCallback } = e.detail;
      setInlineEditData({ elementId, title, currentValue, isMultiline, onSaveCallback });
      setPromptValue(currentValue);
    };

    window.addEventListener('open_rafes_inline_editor', handleOpenInline);
    return () => {
      window.removeEventListener('open_rafes_inline_editor', handleOpenInline);
    };
  }, []);

  // Sync state modifications from other views (e.g. inline changes)
  useEffect(() => {
    const syncFromCms = () => {
      setSeo(getSeoSettings());
      setHome(getHomeSettings());
      setPromos(getPromoPackages());
      setStdPackages(getPackages());
      setCustomLogo(localStorage.getItem('arcadane_custom_logo'));
    };

    window.addEventListener('arcadane_cms_data_changed', syncFromCms);
    return () => {
      window.removeEventListener('arcadane_cms_data_changed', syncFromCms);
    };
  }, []);

  // Update master Rafes edit mode state helper
  const handleToggleRafesMode = () => {
    const nextMode = !rafesModeEnabled;
    setRafesModeEnabled(nextMode);
    localStorage.setItem('arcadane_rafes_edit_mode', String(nextMode));
    // Broadcast change so sections outline themselves
    window.dispatchEvent(new CustomEvent('rafes_mode_toggled', { detail: { active: nextMode } }));
    broadcastChange();
  };

  if (activePage !== PageId.Admin || !isAdminLoggedIn) {
    return null;
  }

  // Immediate saves
  const handleSaveSeo = (updated: SeoSettings) => {
    setSeo(updated);
    saveSeoSettings(updated);
  };

  const handleSaveHome = (updated: HomeSettings) => {
    setHome(updated);
    saveHomeSettings(updated);
  };

  const handleSavePromos = (updated: PromoPackage[]) => {
    setPromos(updated);
    savePromoPackages(updated);
  };

  const handleSaveStdPackages = (updated: PackageItem[]) => {
    setStdPackages(updated);
    savePackages(updated);
  };

  // Preset applyer
  const handleApplyPreset = (preset: { primary: string, secondary: string }) => {
    const updated = { ...seo, primaryColor: preset.primary, secondaryColor: preset.secondary };
    handleSaveSeo(updated);
  };

  // Logo file and Favicon picker handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 500, 250, 0.82);
        localStorage.setItem('arcadane_custom_logo', compressedBase64);
        setCustomLogo(compressedBase64);
        window.dispatchEvent(new Event('arcadane_logo_changed'));
        broadcastChange();
      } catch (err) {
        alert('Erro ao carregar o logo. Tente um arquivo menor.');
      }
    }
  };

  const handleRemoveCustomLogo = () => {
    if (window.confirm('Deseja restaurar o logotipo com o vetor clássico de Arcadane?')) {
      localStorage.removeItem('arcadane_custom_logo');
      setCustomLogo(null);
      window.dispatchEvent(new Event('arcadane_logo_changed'));
      broadcastChange();
    }
  };

  const handleResetAll = () => {
    if (window.confirm('⚠️ ATENÇÃO: Deseja realmente restaurar TODO o site em 100% para os valores originais de fábrica? Todas as suas alterações manuais serão perdidas.')) {
      resetCmsToDefault();
      localStorage.removeItem('arcadane_custom_logo');
      localStorage.removeItem('arcadane_rafes_edit_mode');
      localStorage.removeItem('arcadane_bento_destinations');
      window.location.reload();
    }
  };

  // Inline Save Click handler
  const handleCommitInlineEdit = () => {
    if (inlineEditData) {
      inlineEditData.onSaveCallback(promptValue.trim());
      setInlineEditData(null);
    }
  };

  // Packages list mutations (Up/Down, New, Delete)
  const movePromoItem = (index: number, direction: 'up' | 'down') => {
    const updated = [...promos];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleSavePromos(updated);
  };

  const deletePromoItem = (id: string) => {
    if (window.confirm('Deseja excluir permanentemente este pacote em promoção?')) {
      const filtered = promos.filter(p => p.id !== id);
      handleSavePromos(filtered);
    }
  };

  const addPromoItem = () => {
    const newId = `promo-${Date.now()}`;
    const newItem: PromoPackage = {
      id: newId,
      title: 'Novo Destino dos Sonhos',
      route: 'São Paulo ⇄ Orlando',
      origin: 'GRU',
      destination: 'MCO',
      tag: 'Alta Temporada',
      badge: 'Novidade',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=600',
      link: `https://wa.me/${getSeoSettings().contactWhatsAppMaria || '5547992008571'}`,
      description: 'Uma estadia inesquecível em um dos destinos mais marcantes e requisitados da atualidade, planejado sob medida pelos consultores da Arcadane.',
      highlights: ['Passagem aérea sob medida inclusa', 'Hospedagem selecionada de luxo', 'Ingressos e roteiros personalizados', 'Suporte Arcadane 24 horas'],
      waMessage: 'Olá Arcadane! Vi o novo pacote no site de vocês e gostaria de receber um orçamento sob medida das datas.',
      price: '2.490'
    };
    handleSavePromos([newItem, ...promos]);
  };

  // Standard packages mutations (Up/Down, New, Delete)
  const moveStdPackage = (index: number, direction: 'up' | 'down') => {
    const updated = [...stdPackages];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleSaveStdPackages(updated);
  };

  const deleteStdPackage = (id: string) => {
    if (window.confirm('Deseja excluir permanentemente este roteiro padrão da lista?')) {
      const filtered = stdPackages.filter(p => p.id !== id);
      handleSaveStdPackages(filtered);
    }
  };

  const addStdPackage = () => {
    const newId = `package-${Date.now()}`;
    const newItem: PackageItem = {
      id: newId,
      title: 'Roteiro Clássico Exclusivo',
      category: 'exotico',
      description: 'Uma incrível imersão cultural e histórica desenhada de forma cirúrgica para que você aproveite cada instante com exclusividade e elegância.',
      price: 'Sob Consulta',
      duration: '8 Dias',
      imageWord: 'bali',
      highlights: ['Consultoria de viagem VIP', 'Hospedagem em hotel boutique', 'Aéreo executivo ou de primeira classe', 'Concierge local exclusivo']
    };
    handleSaveStdPackages([newItem, ...stdPackages]);
  };

  // Text Form fields style classes
  const fieldLabelClass = "block text-[11px] font-mono tracking-wider font-semibold text-stone-300 uppercase mb-1";
  const fieldInputClass = "w-full bg-stone-900 border border-stone-800 focus:border-brand-secondary focus:outline-none transition-colors px-3 py-2 rounded-xl text-xs text-white placeholder-stone-600 font-sans";
  const selectClass = "w-full bg-stone-900 border border-stone-800 focus:border-brand-secondary focus:outline-none transition-colors px-3 py-2 rounded-xl text-xs text-white font-sans cursor-pointer";

  return (
    <>
      {/* Floating builder control button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-10000 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 px-5 rounded-full shadow-2xl border border-white/10 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 transition-all text-white font-display text-xs tracking-widest uppercase font-bold focus:outline-none ${
            rafesModeEnabled
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 pulse-glow shadow-amber-500/20'
              : 'bg-stone-900 hover:bg-black'
          }`}
          title="Abrir Painel Rafes de Edição Direta e Configurações"
        >
          {rafesModeEnabled ? (
            <Sparkles className="w-4.5 h-4.5 text-white animate-spin" />
          ) : (
            <Paintbrush className="w-4.5 h-4.5 text-brand-secondary" />
          )}
          <span>{rafesModeEnabled ? 'Editor Rafes Ativo' : 'Editar Site (Rafes)'}</span>
        </button>

        {/* Master quick button for Toggle Rafes outline mode */}
        <button
          onClick={handleToggleRafesMode}
          className={`h-11 px-4 rounded-full border border-white/10 flex items-center gap-1.5 cursor-pointer shadow-xl transition-all focus:outline-none text-[10px] uppercase font-mono tracking-wider font-extrabold ${
            rafesModeEnabled
              ? 'bg-amber-950/85 hover:bg-amber-950 text-amber-300'
              : 'bg-stone-800/80 hover:bg-stone-800 text-stone-400'
          }`}
          title="Ativar caixa de clique visual no site para digitar alteração"
        >
          {rafesModeEnabled ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" />
              <span>Dicas de Clique Ligado</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Dicas de Clique</span>
            </>
          )}
        </button>
      </div>

      {/* Slide-out Rafes Panel Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -420, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -420, opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[410px] max-w-full bg-stone-950 border-r border-stone-850 shadow-2xl z-100000 flex flex-col overflow-hidden text-stone-200"
          >
            {/* Header section with brand mark */}
            <div className="bg-stone-900 p-5.5 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-display font-black text-sm tracking-wider text-white uppercase leading-none">Painel de Edição</h3>
                  <span className="text-[10px] font-mono tracking-widest text-[#AF4934] uppercase font-bold mt-1 block">Rafes Ultimate Edition v4.0</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-750 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Indicator Alert */}
            <div className="bg-amber-950/45 border-b border-amber-900/40 px-5.5 py-3 text-xs text-amber-200 font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="leading-tight text-[11px]">
                <strong>Edição em Tempo Real (Rafes):</strong> Suas alterações são aplicadas e salvas na hora. Abra o site em outra aba para ver as mudanças!
              </p>
            </div>

            {/* Quick action: Rafes Mode Switch Inside Panel */}
            <div className="p-4 bg-stone-900/60 border-b border-stone-850 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Editar diretamente clicando no site:</span>
              <button
                type="button"
                onClick={handleToggleRafesMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rafesModeEnabled ? 'bg-amber-500' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    rafesModeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Navigation Tabs bar inside panel */}
            <div className="flex bg-stone-900/30 overflow-x-auto no-scrollbar border-b border-stone-850 text-stone-400 shrink-0">
              <button 
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'style' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                Estilo & Cores
              </button>
              <button 
                onClick={() => setActiveTab('seo')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'seo' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                SEO & Favicon
              </button>
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'home' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                Início
              </button>
              <button 
                onClick={() => setActiveTab('promo')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'promo' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                Saldos/Promo
              </button>
              <button 
                onClick={() => setActiveTab('std-packages')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'std-packages' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                Pacotes
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-3 px-3 text-[10px] uppercase font-mono tracking-wider font-extrabold border-b-2 transition-all cursor-pointer text-center shrink-0 ${
                  activeTab === 'contact' ? 'text-brand-secondary border-brand-secondary bg-stone-900/40 font-bold' : 'border-transparent hover:text-stone-200'
                }`}
              >
                WhatsApp
              </button>
            </div>

            {/* Scrollable inputs form panel */}
            <div className="flex-grow overflow-y-auto p-5.5 space-y-6 no-scrollbar text-left font-sans">
              
              {/* Tab: STYLE & BRAND COLORS */}
              {activeTab === 'style' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Cores da Identidade Visual</h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Mude as cores primárias e secundárias do site instantaneamente. Os botões, links, ícones e destaques se readequam na mesma hora!
                    </p>
                  </div>

                  {/* Preset Buttons Grid */}
                  <div className="space-y-3">
                    <label className={fieldLabelClass}>Selecione um Tema Luxuoso de 1-Clique</label>
                    <div className="grid grid-cols-1 gap-2">
                      {COLOR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-stone-800 hover:border-brand-primary bg-stone-900/50 hover:bg-stone-900 transition-all text-left text-xs cursor-pointer group focus:outline-none"
                        >
                          <span className="font-semibold text-stone-300 group-hover:text-white transition-colors">{preset.name}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: preset.primary }} />
                            <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: preset.secondary }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Color inputs */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-850">
                    <div className="space-y-1.5">
                      <label className={fieldLabelClass}>Cor Primária</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-stone-700 shrink-0">
                          <input 
                            type="color" 
                            value={seo.primaryColor || '#3B5EA4'} 
                            onChange={(e) => handleSaveSeo({ ...seo, primaryColor: e.target.value })}
                            className="absolute inset-0 w-full h-full scale-150 cursor-pointer p-0 border-0" 
                          />
                        </div>
                        <input 
                          type="text" 
                          value={seo.primaryColor || '#3B5EA4'} 
                          onChange={(e) => handleSaveSeo({ ...seo, primaryColor: e.target.value })}
                          className={fieldInputClass} 
                          placeholder="#3B5EA4"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={fieldLabelClass}>Cor Secundária</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-stone-700 shrink-0">
                          <input 
                            type="color" 
                            value={seo.secondaryColor || '#AF4934'} 
                            onChange={(e) => handleSaveSeo({ ...seo, secondaryColor: e.target.value })}
                            className="absolute inset-0 w-full h-full scale-150 cursor-pointer p-0 border-0" 
                          />
                        </div>
                        <input 
                          type="text" 
                          value={seo.secondaryColor || '#AF4934'} 
                          onChange={(e) => handleSaveSeo({ ...seo, secondaryColor: e.target.value })}
                          className={fieldInputClass} 
                          placeholder="#AF4934"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo Customizer */}
                  <div className="space-y-3 pt-5 border-t border-stone-850">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Identidade & Logotipo</h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Substitua o logotipo Arcadane por uma imagem personalizada no cabeçalho do site. Formatos suportados: PNG, JPEG ou SVG transparente.
                    </p>

                    {customLogo ? (
                      <div className="space-y-2">
                        <div className="p-4 rounded-xl bg-stone-900 flex items-center justify-center relative border border-stone-800">
                          <img src={customLogo} alt="Logo Customizado" className="max-h-16 w-auto object-contain" />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCustomLogo}
                          className="w-full text-center py-2 text-[10px] font-mono tracking-wider font-bold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/45 rounded-xl transition-all cursor-pointer border border-red-900/30"
                        >
                          Remover logo personalizado (Restaurar clássico)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          id="rafes-logo-uploader"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('rafes-logo-uploader')?.click()}
                          className="w-full py-4 bg-stone-900 text-stone-300 hover:text-white border border-stone-800 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-brand-secondary transition-all"
                        >
                          <Upload className="w-5 h-5 text-brand-secondary" />
                          <span className="text-xs font-semibold">Fazer upload de logotipo</span>
                          <span className="text-[10px] text-stone-500">Imagens horizontais recomendadas</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: SEO SETTINGS & FAVICON */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Metadados de SEO & Favicon</h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Estratégico para que os buscadores (Google, Bing) localizem seu site de turismo e mostrem no topo dos rankings!
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Favicon URL (Ícone da Aba do Navegador)</label>
                    <input 
                      type="text" 
                      value={seo.faviconUrl || ''} 
                      onChange={(e) => handleSaveSeo({ ...seo, faviconUrl: e.target.value })}
                      className={fieldInputClass} 
                      placeholder="Ex: https://meusite.com/favicon.ico"
                    />
                    <p className="text-[9px] text-stone-500 font-sans">
                      Dica: Insira um link direto de uma imagem pequena de `.png` ou `.ico` para atualizar a engrenagem do cabeçalho da guia do navegador.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Título da Página (Meta Title)</label>
                    <input 
                      type="text" 
                      value={seo.siteTitle} 
                      onChange={(e) => handleSaveSeo({ ...seo, siteTitle: e.target.value })}
                      className={fieldInputClass} 
                      placeholder="Principal título mostrado no Google e na aba"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Descrição da Página (Meta Description)</label>
                    <textarea 
                      rows={3}
                      value={seo.metaDescription} 
                      onChange={(e) => handleSaveSeo({ ...seo, metaDescription: e.target.value })}
                      className={fieldInputClass} 
                      placeholder="Resumo estratégico que atrai cliques dos usuários nas pesquisas do Google..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Palavras-chave (Separe por vírgula)</label>
                    <input 
                      type="text" 
                      value={seo.keywords} 
                      onChange={(e) => handleSaveSeo({ ...seo, keywords: e.target.value })}
                      className={fieldInputClass} 
                      placeholder="arcadane, viagens de luxo, chapecó, florianópolis"
                    />
                  </div>
                </div>
              )}

              {/* Tab: HOME CONTENT CORES */}
              {activeTab === 'home' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider font-sans">Seção Principal (Hero)</h4>
                    <p className="text-[10px] text-stone-500">Editores de títulos e slogans da tela de entrada do cliente.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Título do Slider Hero (Código HTML permitido)</label>
                    <textarea 
                      rows={3}
                      value={home.heroTitle} 
                      onChange={(e) => handleSaveHome({ ...home, heroTitle: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: A arte de viajar <span class='font-serif italic'>sob medida</span>"
                      required
                    />
                    <p className="text-[9px] text-stone-500">Dica: Use `&lt;span class="font-serif font-normal italic text-brand-secondary"&gt;termo&lt;/span&gt;` para estilizar com a fonte manuscrita luxuosa!</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Subtítulo do Hero</label>
                    <textarea 
                      rows={3}
                      value={home.heroSubtitle} 
                      onChange={(e) => handleSaveHome({ ...home, heroSubtitle: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Curadoria de destinos exclusivos..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Link do Vídeo de Fundo (MP4 ou YouTube)</label>
                    <input 
                      type="text" 
                      value={home.heroVideoUrl || ''} 
                      onChange={(e) => handleSaveHome({ ...home, heroVideoUrl: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Ex: https://www.youtube.com/watch?v=1VhezN-EFfg"
                    />
                    <p className="text-[9px] text-stone-500">Aceita links diretos .mp4 (mixkit, etc) ou vídeos normais do YouTube!</p>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-stone-850">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider font-sans">História da Consultoria (Quem Somos)</h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Slogan Linha de Cima</label>
                    <input 
                      type="text" 
                      value={home.aboutUsHeadline} 
                      onChange={(e) => handleSaveHome({ ...home, aboutUsHeadline: e.target.value })}
                      className={fieldInputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Título em Destaque</label>
                    <input 
                      type="text" 
                      value={home.aboutUsSubheadline} 
                      onChange={(e) => handleSaveHome({ ...home, aboutUsSubheadline: e.target.value })}
                      className={fieldInputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Texto da História (Pule duas linhas para parágrafos novos)</label>
                    <textarea 
                      rows={10}
                      value={home.aboutUsText} 
                      onChange={(e) => handleSaveHome({ ...home, aboutUsText: e.target.value })}
                      className={fieldInputClass}
                      placeholder="Escreva a trajetória aqui..."
                      required
                    />
                  </div>

                  <div className="space-y-1 pt-3 border-t border-stone-850">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider font-sans">Rodapé do Site</h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Texto de Direitos do Rodapé</label>
                    <input 
                      type="text" 
                      value={home.footerText} 
                      onChange={(e) => handleSaveHome({ ...home, footerText: e.target.value })}
                      className={fieldInputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>Endereço Comercial</label>
                    <input 
                      type="text" 
                      value={home.footerAddress} 
                      onChange={(e) => handleSaveHome({ ...home, footerAddress: e.target.value })}
                      className={fieldInputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>E-mail de Contato Comercial</label>
                    <input 
                      type="email" 
                      value={home.footerEmail || ''} 
                      onChange={(e) => handleSaveHome({ ...home, footerEmail: e.target.value })}
                      className={fieldInputClass}
                    />
                  </div>
                </div>
              )}

              {/* Tab: PROMO CARD LIST MANAGING */}
              {activeTab === 'promo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Promoções Ativas</h4>
                      <p className="text-[10px] text-stone-500">Mova, ordene, edite fotos ou exclua promocionais.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addPromoItem}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-650 text-white rounded-lg text-[10px] font-mono tracking-wider font-extrabold uppercase flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {promos.map((promo, idx) => (
                      <div 
                        key={promo.id}
                        className="bg-stone-900/60 border border-stone-850 p-3 rounded-xl flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={promo.image} 
                            alt={promo.title} 
                            className="w-12 h-12 rounded-lg object-cover bg-stone-700 shrink-0" 
                          />
                          <div className="min-w-0 text-left">
                            <span className="text-[9px] font-bold text-amber-500 font-mono tracking-widest uppercase block mb-0.5">{promo.badge}</span>
                            <h4 className="text-xs font-bold text-white truncate leading-snug">{promo.title}</h4>
                            <span className="text-[10px] text-stone-400 block truncate">{promo.route}</span>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Reordering */}
                          <button
                            onClick={() => movePromoItem(idx, 'up')}
                            disabled={idx === 0}
                            className="w-7 h-7 rounded-lg bg-stone-800 disabled:opacity-30 hover:bg-stone-750 flex items-center justify-center text-stone-300 focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => movePromoItem(idx, 'down')}
                            disabled={idx === promos.length - 1}
                            className="w-7 h-7 rounded-lg bg-stone-800 disabled:opacity-30 hover:bg-stone-750 flex items-center justify-center text-stone-300 focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Direct text modification trigger */}
                          <button
                            onClick={() => {
                              const title = window.prompt("Digite o novo título do pacote promocional:", promo.title);
                              if (title && title.trim() !== "") {
                                const price = window.prompt("Digite o novo valor promocional (ex: 2.190):", promo.price);
                                const link = window.prompt("Coloque o link direto infoTravel ou Checkout:", promo.link);
                                const routes = window.prompt("Qual é o trecho (ex: Ilhéus ⇄ Chapecó)?", promo.route);

                                const current = getPromoPackages();
                                const updated = current.map(p => {
                                  if (p.id === promo.id) {
                                    return { 
                                      ...p, 
                                      title: title.trim(),
                                      price: price ? price.trim() : p.price,
                                      link: link ? link.trim() : p.link,
                                      route: routes ? routes.trim() : p.route
                                    };
                                  }
                                  return p;
                                });
                                handleSavePromos(updated);
                              }
                            }}
                            className="w-7 h-7 rounded-lg bg-stone-800/80 hover:bg-stone-750 flex items-center justify-center text-amber-300 font-mono text-[10px]"
                            title="Configuração Rápida"
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={() => deletePromoItem(promo.id)}
                            className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-red-950 text-red-400 flex items-center justify-center focus:outline-none cursor-pointer"
                            title="Deletar este pacote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: STANDARD PACKAGES LIST */}
              {activeTab === 'std-packages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Roteiros Tradicionais</h4>
                      <p className="text-[10px] text-stone-500">Crie, reorganize ou edite os pacotes fixos.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addStdPackage}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-650 text-white rounded-lg text-[10px] font-mono tracking-wider font-extrabold uppercase flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Criar Roteiro</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {stdPackages.map((p, idx) => (
                      <div 
                        key={p.id}
                        className="bg-stone-900/60 border border-stone-850 p-3 rounded-xl flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2 min-w-0 text-left">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            p.category === 'exotico' ? 'bg-amber-500' : p.category === 'nacional' ? 'bg-emerald-500' : p.category === 'cruzeiro' ? 'bg-blue-500' : 'bg-chocolate-400'
                          }`} />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-snug">{p.title}</h4>
                            <span className="text-[9px] text-stone-400 block tracking-wider font-mono uppercase">{p.duration} • {p.category}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveStdPackage(idx, 'up')}
                            disabled={idx === 0}
                            className="w-7 h-7 rounded-lg bg-stone-800 disabled:opacity-30 hover:bg-stone-750 flex items-center justify-center text-stone-300 focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                            title="Mover acima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveStdPackage(idx, 'down')}
                            disabled={idx === stdPackages.length - 1}
                            className="w-7 h-7 rounded-lg bg-stone-800 disabled:opacity-30 hover:bg-stone-750 flex items-center justify-center text-stone-300 focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                            title="Mover abaixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Simple config prompt trigger */}
                          <button
                            onClick={() => {
                              const nTitle = window.prompt("Título do Roteiro:", p.title);
                              if (nTitle && nTitle.trim() !== "") {
                                const nDays = window.prompt("Duração (ex: 8 Dias):", p.duration);
                                const bgUrl = window.prompt("Link (URL) de uma linda imagem personalizada para o card:", (p as any).image || '');
                                const desc = window.prompt("Descrição resumida do card:", p.description);

                                const updated = stdPackages.map(item => {
                                  if (item.id === p.id) {
                                    return { 
                                      ...item, 
                                      title: nTitle.trim(),
                                      duration: nDays ? nDays.trim() : item.duration,
                                      image: bgUrl ? bgUrl.trim() : (item as any).image,
                                      description: desc ? desc.trim() : item.description
                                    };
                                  }
                                  return item;
                                });
                                handleSaveStdPackages(updated);
                              }
                            }}
                            className="w-7 h-7 rounded-lg bg-stone-800/80 hover:bg-stone-750 flex items-center justify-center text-amber-300 text-[10px]"
                            title="Alterar textos do card"
                          >
                            📝
                          </button>
                          <button
                            onClick={() => deleteStdPackage(p.id)}
                            className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-red-950 text-red-400 flex items-center justify-center focus:outline-none cursor-pointer"
                            title="Excluir roteiro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: WHATSAPP CHANNELS */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider font-sans">Canais do WhatsApp</h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Insira os números de WhatsApp correspondentes de cada sócio corretor. Os links e as escolhas de atendimento na caixa flutuante serão direcionados na mesma hora!
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>WhatsApp Mateus (Apenas Números + Código do País)</label>
                    <input 
                      type="text" 
                      value={seo.contactWhatsAppMateus} 
                      onChange={(e) => handleSaveSeo({ ...seo, contactWhatsAppMateus: e.target.value.replace(/\D/g, '') })}
                      className={fieldInputClass} 
                      placeholder="Ex: 554791492704"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>WhatsApp Maria (Apenas Números)</label>
                    <input 
                      type="text" 
                      value={seo.contactWhatsAppMaria} 
                      onChange={(e) => handleSaveSeo({ ...seo, contactWhatsAppMaria: e.target.value.replace(/\D/g, '') })}
                      className={fieldInputClass} 
                      placeholder="Ex: 5547992008571"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={fieldLabelClass}>WhatsApp Mariana (Apenas Números)</label>
                    <input 
                      type="text" 
                      value={seo.contactWhatsAppMariana} 
                      onChange={(e) => handleSaveSeo({ ...seo, contactWhatsAppMariana: e.target.value.replace(/\D/g, '') })}
                      className={fieldInputClass} 
                      placeholder="Ex: 5547992008571"
                      required
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Wix Panel Footer commands */}
            <div className="p-4 bg-stone-900 border-t border-stone-850 flex items-center justify-between shrink-0">
              <button
                onClick={handleResetAll}
                className="px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-750 transition-all focus:outline-none cursor-pointer flex items-center gap-1.5"
                title="Voltar tudo ao padrão de fábrica"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Tudo</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  alert('Suas alterações já foram aplicadas e persistidas com sucesso! Apenas navegue pelo site normalmente.');
                }}
                className="px-4.5 py-2.5 rounded-lg text-xs font-display font-semibold uppercase tracking-wider text-white bg-brand-primary hover:bg-opacity-90 shadow-md shadow-brand-primary/10 transition-all focus:outline-none cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Salvar & Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline element popup editor dialogue box */}
      <AnimatePresence>
        {inlineEditData && (
          <div className="fixed inset-0 z-1000000 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left text-stone-200"
            >
              <h3 className="font-display font-black text-amber-400 text-sm tracking-wider uppercase mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5" />
                <span>{inlineEditData.title}</span>
              </h3>
              
              <div className="space-y-4 font-sans">
                {inlineEditData.isMultiline ? (
                  <textarea
                    rows={6}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-brand-secondary focus:outline-none transition-colors px-3 py-2 rounded-xl text-sm text-white font-sans"
                  />
                ) : (
                  <input
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-brand-secondary focus:outline-none transition-colors px-3 py-2 rounded-xl text-sm text-white font-sans"
                  />
                )}

                <div className="flex items-center justify-end gap-2.5 pt-1.5">
                  <button
                    onClick={() => setInlineEditData(null)}
                    className="px-4.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCommitInlineEdit}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold uppercase tracking-wider text-stone-950 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Check className="w-4 h-4 font-extrabold" />
                    <span>Confirmar</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setInlineEditData(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Global reusable custom react hook that allows Rafes Click-To-Edit capability on any element
export function useRafesEditor() {
  const [rafesOpen, setRafesOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("arcadane_admin_logged_in") === "true";
      const isEditMode = localStorage.getItem("arcadane_rafes_edit_mode") === "true";
      return isLoggedIn && isEditMode;
    }
    return false;
  });

  useEffect(() => {
    const handleToggle = () => {
      const isLoggedIn = sessionStorage.getItem("arcadane_admin_logged_in") === "true";
      const isEditMode = localStorage.getItem("arcadane_rafes_edit_mode") === "true";
      setRafesOpen(isLoggedIn && isEditMode);
    };
    window.addEventListener("arcadane_cms_data_changed", handleToggle);
    window.addEventListener("rafes_mode_toggled", handleToggle);
    window.addEventListener("arcadane_admin_login_changed", handleToggle);
    return () => {
      window.removeEventListener("arcadane_cms_data_changed", handleToggle);
      window.removeEventListener("rafes_mode_toggled", handleToggle);
      window.removeEventListener("arcadane_admin_login_changed", handleToggle);
    };
  }, []);

  const editField = (
    elementId: string, 
    title: string, 
    currentValue: string, 
    isMultiline: boolean, 
    onSaveCallback: (newValue: string) => void
  ) => {
    if (!rafesOpen) return;
    window.dispatchEvent(new CustomEvent("open_rafes_inline_editor", {
      detail: { elementId, title, currentValue, isMultiline, onSaveCallback }
    }));
  };

  return { rafesOpen, editField };
}

// Keep a backward compatible delegate just in case
export function useWixEditor() {
  const { rafesOpen, editField } = useRafesEditor();
  return { wixOpen: rafesOpen, editField };
}
