import React, { useState, useEffect } from 'react';
import { 
  Key, LogOut, Settings, Globe, Film, Sparkles, Briefcase, Compass, Award, 
  Heart, AlertCircle, CheckCircle, Save, Undo, Plus, Trash2, Edit3, 
  Eye, EyeOff, FileText, Image, Phone, MapPin, Mail, Sliders, Server, Trash, HelpCircle, Tag, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getServices, saveServices, getPackages, savePackages, 
  getBlogPosts, saveBlogPosts, getTestimonials, saveTestimonials, 
  getSeoSettings, saveSeoSettings, getHomeSettings, saveHomeSettings, 
  getPromoPackages, savePromoPackages, PromoPackage, DEFAULT_PROMO_PACKAGES,
  resetCmsToDefault, SeoSettings, HomeSettings, getFoundersPhoto 
} from '../utils/cmsStore';
import { ServiceItem, PackageItem, BlogPost, TestimonialItem } from '../types';
import { compressImage } from '../utils/imageCompressor';

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'seo' | 'home' | 'layout' | 'services' | 'packages' | 'promos' | 'blog' | 'testimonials' | 'reset'>('seo');

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
    showFeedback('Textos institucionais e vídeo da página inicial salvos!');
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
        {/* Dashboard layout splits */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vertical Control Navigation Track */}
          <div className="space-y-2 lg:col-span-1" id="admin-sidebar">
            <p className="text-[9px] uppercase font-mono tracking-widest text-stone-500 font-bold px-2.5 mb-2 block">Módulos de Edição</p>
            
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

            <div className="border-t border-stone-800 pt-3 mt-4">
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
            
            {/* Panel SEO */}
            {activeTab === 'seo' && (
              <form onSubmit={handleSaveSeo} className="space-y-6">
                <div>
                  <h3 className="font-display font-medium text-lg text-stone-100">SEO & Contatos Gerais</h3>
                  <p className="text-stone-400 text-xs mt-1">Configure o título da página no navegador, meta tags, palavras-chave e canais de WhatsApp.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 md:col-span-2">
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

                  <div className="space-y-1 md:col-span-2">
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

                  <div className="space-y-1">
                    <label className={labelClass}>Palavras-chave (Tag Keywords)</label>
                    <input 
                      type="text" 
                      value={seo.keywords} 
                      onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
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
                    <div className="space-y-1">
                      <label className={labelClass}>Contato Maria</label>
                      <input 
                        type="text" 
                        value={seo.contactWhatsAppMaria} 
                        onChange={(e) => setSeo({ ...seo, contactWhatsAppMaria: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Contato Mateus</label>
                      <input 
                        type="text" 
                        value={seo.contactWhatsAppMateus} 
                        onChange={(e) => setSeo({ ...seo, contactWhatsAppMateus: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="space-y-1">
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

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4">
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

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4">
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

                <div className="bg-[#181615]/50 border border-stone-800/80 p-5 rounded-2xl space-y-4">
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
                  <h3 className="font-display font-medium text-lg text-stone-100">Hero, Vídeo & Quem Somos</h3>
                  <p className="text-stone-400 text-xs mt-1">Troque o texto principal do site, o vídeo do plano de fundo e o texto descritivo do institucional.</p>
                </div>

                {/* Hero section texts */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className={labelClass}>Título Principal (Suporta HTML para itálico)</label>
                    <input 
                      type="text" 
                      value={home.heroTitle} 
                      onChange={(e) => setHome({ ...home, heroTitle: e.target.value })}
                      className={inputClass}
                      required
                    />
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">Use tags HTML como &lt;span class="font-serif italic text-brand-secondary"&gt;texto&lt;/span&gt; para dar ênfase dourada.</p>
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
                    <label className={labelClass}>Tipo de Buscador da Home (Booking Engine)</label>
                    <select
                      value={home.widgetType || 'whatsapp'}
                      onChange={(e) => setHome({ ...home, widgetType: e.target.value as 'befly' | 'whatsapp' })}
                      className={inputClass}
                    >
                      <option value="whatsapp">Buscador Inteligente Arcadane (WhatsApp - Recomendado para qualquer domínio! 🎉)</option>
                      <option value="befly">Buscador Oficial BeFly / OnerTravel (Requer domínio homologado pela OnerTravel)</option>
                    </select>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      Se o seu site em produção no Hostinger/GitHub apresentar erro "Não autorizado" no widget da BeFly, selecione "Buscador Inteligente Arcadane (WhatsApp)" para que um buscador interativo personalizado funcione imediatamente e envie as cotações diretamente para o seu WhatsApp!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Link do Vídeo MP4 (Fundo do Banner)</label>
                      <input 
                        type="url" 
                        value={home.heroVideoUrl} 
                        onChange={(e) => setHome({ ...home, heroVideoUrl: e.target.value })}
                        className={inputClass}
                        required
                      />
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">Utilize um link MP4 de alta velocidade (ex: links da mixkit ou direct-bucket).</p>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Título Superior da Trajetória (Destaque)</label>
                      <input 
                        type="text" 
                        value={home.aboutUsHeadline} 
                        onChange={(e) => setHome({ ...home, aboutUsHeadline: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* About section texts */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200">História Institucional (Quem Somos)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>Texto Principal do Quem Somos (Use saltos de linha)</label>
                      <textarea 
                        rows={6}
                        value={home.aboutUsText} 
                        onChange={(e) => setHome({ ...home, aboutUsText: e.target.value })}
                        className={`${inputClass} leading-relaxed`}
                        placeholder="Texto institucional completo..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Trip Section */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200">Viagem Personalizada (Banner CTA de Rodapé)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Título do Banner</label>
                      <input 
                        type="text" 
                        value={home.customTripTitle || ''} 
                        onChange={(e) => setHome({ ...home, customTripTitle: e.target.value })}
                        className={inputClass}
                        placeholder="Viagens\npersonalizadas:"
                      />
                      <p className="text-[9px] text-stone-500 font-mono">Use \n para quebra de linha</p>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Subtítulo do Banner</label>
                      <input 
                        type="text" 
                        value={home.customTripSubtitle || ''} 
                        onChange={(e) => setHome({ ...home, customTripSubtitle: e.target.value })}
                        className={inputClass}
                        placeholder="Experiências exclusivas, desenhadas para você."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Texto de Chamada do Botão</label>
                      <input 
                        type="text" 
                        value={home.customTripButtonText || ''} 
                        onChange={(e) => setHome({ ...home, customTripButtonText: e.target.value })}
                        className={inputClass}
                        placeholder="Clique e fale com a Arcadane!"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display text-sm tracking-wide text-stone-200">Informações Técnicas do Rodapé (Footer)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className={labelClass}>Slogan do Rodapé</label>
                      <input 
                        type="text" 
                        value={home.footerText || ''} 
                        onChange={(e) => setHome({ ...home, footerText: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Endereço do Rodapé</label>
                      <input 
                        type="text" 
                        value={home.footerAddress || ''} 
                        onChange={(e) => setHome({ ...home, footerAddress: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>E-mail de Contato Comercial</label>
                      <input 
                        type="email" 
                        value={home.footerEmail || ''} 
                        onChange={(e) => setHome({ ...home, footerEmail: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Team founders photo uploader */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display font-medium text-sm tracking-wide text-[#AF4934] uppercase font-mono text-xs font-bold">Foto Oficial dos Fundadores (Maria, Mateus & Mariana • Sobre Nós)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 max-w-[160px] aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-lg relative">
                      <img 
                        src={foundersPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                        alt="Preview Foto Oficial de Maria, Mateus & Mariana"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 py-1 bg-black/70 text-[9px] font-mono text-center text-[#AF4934] font-bold">FOTO ATUAL</div>
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <p className="text-xs text-stone-400 font-light leading-relaxed">
                        Envie uma nova fotografia dos três sócios-fundadores juntos. Esta foto será renderizada na página "Sobre Nós" como a imagem em destaque.
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <label 
                          htmlFor="admin-founders-photo"
                          className="px-4 py-2 border border-dashed border-stone-700 hover:border-[#AF4934]/60 bg-[#1c1917]/20 rounded-xl text-xs font-mono text-stone-300 font-bold hover:text-white cursor-pointer transition-colors inline-flex items-center gap-2"
                        >
                          <Image className="w-4 h-4 text-[#AF4934]" />
                          Carregar Nova Imagem...
                        </label>
                        <input 
                          type="file"
                          id="admin-founders-photo"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, (base64) => {
                                localStorage.setItem('arcadane_founders_photo', base64);
                                setFoundersPhoto(base64);
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                }
                                showFeedback('Foto oficial dos fundadores atualizada com sucesso!');
                              });
                            }
                          }}
                        />

                        {foundersPhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Deseja redefinir a imagem para a foto padrão de fábrica?')) {
                                localStorage.removeItem('arcadane_founders_photo');
                                setFoundersPhoto(null);
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                }
                                showFeedback('Foto redefinida para a imagem padrão.');
                              }
                            }}
                            className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/30 text-rose-450 border border-rose-500/30 rounded-xl text-xs font-mono font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            Restaurar Padrão
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 font-mono">Imagens pesadas serão compactadas automaticamente para garantir excelente performance de carregamento no site.</p>
                    </div>
                  </div>
                </div>

                {/* Home trajectory photo uploader */}
                <div className="border-t border-stone-850 pt-5 space-y-4">
                  <h4 className="font-display font-medium text-sm tracking-wide text-[#AF4934] uppercase font-mono text-xs font-bold">Foto da Trajetória (Página Inicial)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 max-w-[160px] aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-lg relative">
                      <img 
                        src={trajectoryPhoto || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"} 
                        alt="Preview Foto da Trajetória"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 py-1 bg-black/70 text-[9px] font-mono text-center text-[#AF4934] font-bold">FOTO ATUAL</div>
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <p className="text-xs text-stone-400 font-light leading-relaxed">
                        Envie uma imagem para ilustrar o bloco "Nossa trajetória, nosso propósito" na Página Inicial (da mesma forma que no exemplo do anexo). É recomendável uma imagem horizontal ou quadrada.
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <label 
                          htmlFor="admin-trajectory-photo"
                          className="px-4 py-2 border border-dashed border-stone-700 hover:border-[#AF4934]/60 bg-[#1c1917]/20 rounded-xl text-xs font-mono text-stone-300 font-bold hover:text-white cursor-pointer transition-colors inline-flex items-center gap-2"
                        >
                          <Image className="w-4 h-4 text-[#AF4934]" />
                          Carregar Nova Imagem da Trajetória...
                        </label>
                        <input 
                          type="file"
                          id="admin-trajectory-photo"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressAndSetImage(file, (base64) => {
                                localStorage.setItem('arcadane_trajectory_photo', base64);
                                setTrajectoryPhoto(base64);
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                }
                                showFeedback('Foto de destaque de trajetória salva com sucesso!');
                              });
                            }
                          }}
                        />

                        {trajectoryPhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Deseja redefinir a imagem para o padrão de fábrica?')) {
                                localStorage.removeItem('arcadane_trajectory_photo');
                                setTrajectoryPhoto(null);
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('arcadane_cms_data_changed'));
                                }
                                showFeedback('Foto da trajetória redefinida com sucesso.');
                              }
                            }}
                            className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/30 text-rose-450 border border-rose-500/30 rounded-xl text-xs font-mono font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            Restaurar Padrão
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 font-mono">Imagens pesadas serão compactadas automaticamente para garantir excelente performance de carregamento no site.</p>
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
                        <h3 className="font-display font-medium text-lg text-stone-100 font-bold">Pacotes Promocionais Ativos</h3>
                        <p className="text-stone-400 text-xs mt-1">Crie, edite ou exclua pacotes turísticos mostrados no catálogo.</p>
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
                            highlights: ['', '']
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
                        <label className={labelClass}>Palavra-chave da Imagem (Ícone)</label>
                        <input 
                          type="text" 
                          value={editingPackage.imageWord} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, imageWord: e.target.value })}
                          className={inputClass}
                          placeholder="Ex: bali, safari, gramado, cruzeiro"
                          required
                        />
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
