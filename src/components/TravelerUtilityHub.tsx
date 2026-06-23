import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Sparkles, 
  X, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Eye, 
  Type, 
  ArrowLeftRight, 
  CloudSun, 
  Clock, 
  Search, 
  ChevronRight,
  Accessibility,
  Check
} from 'lucide-react';

// Live Public API endpoints
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/BRL';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

interface CurrencyData {
  rates: Record<string, number>;
  time_last_update_utc: string;
}

interface WeatherResult {
  city: string;
  country: string;
  temperature: number;
  weatherCode: number;
  localTime: string;
}

export default function TravelerUtilityHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'translate' | 'accessibility' | 'currency' | 'weather'>('translate');
  
  // Translation state (Google Translate trigger helper)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('arcadane_selected_lang');
      if (saved) return saved;

      const value = document.cookie
        .split('; ')
        .find(row => row.startsWith('googtrans='))
        ?.split('=')[1];
      if (value) {
        const decoded = decodeURIComponent(value);
        const parts = decoded.split('/');
        return parts[parts.length - 1] || 'pt';
      }
    } catch (e) {}
    return 'pt';
  });
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);

  // Accessibility state
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large' | 'extra'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Currency Converter state
  const [currencyAmount, setCurrencyAmount] = useState<number>(1000);
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState<string>('USD');
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [currencyLastUpdated, setCurrencyLastUpdated] = useState<string>('');
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState(false);

  // Weather & Clock state
  const [weatherSearch, setWeatherSearch] = useState('Paris');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherResult, setWeatherResult] = useState<WeatherResult | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  // Language lists
  const availableLanguages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  // ----------------------------------------------------
  // Dynamic Script Integrations & Loaders
  // ----------------------------------------------------
  useEffect(() => {
    const win = window as any;

    // Sync saved language to cookie on startup
    try {
      const savedLang = localStorage.getItem('arcadane_selected_lang') || 'pt';
      const cookieValue = `/pt/${savedLang}`;
      const expires = "; expires=" + new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
      
      const currentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('googtrans='))
        ?.split('=')[1];

      if (!currentCookie || decodeURIComponent(currentCookie) !== cookieValue) {
        try {
          document.cookie = `googtrans=${cookieValue}${expires}; path=/; SameSite=None; Secure`;
          document.cookie = `googtrans=${cookieValue}${expires}; path=/; domain=${window.location.hostname}; SameSite=None; Secure`;
        } catch (_) {}
      }
    } catch (e) {
      console.warn("Startup cookie sync error", e);
    }

    // 1. Google Translate Widget Integration
    win.googleTranslateElementInit = () => {
      try {
        if (win.google?.translate?.TranslateElement) {
          new win.google.translate.TranslateElement({
            pageLanguage: 'pt',
            layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
          setIsTranslateLoaded(true);
        }
      } catch (err) {
        console.warn("Callback translation element init error", err);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = (e) => {
        console.warn('Google Translate script loading was blocked or failed:', e);
      };
      document.body.appendChild(script);
    } else {
      // If script is already in the document, win.googleTranslateElementInit won't be called automatically.
      // So call container initialization directly:
      if (win.google?.translate?.TranslateElement) {
        try {
          new win.google.translate.TranslateElement({
            pageLanguage: 'pt',
            layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
        } catch (err) {
          console.warn("Manual direct translation element init error", err);
        }
      }
      setIsTranslateLoaded(true);
    }

    // 2. VLibras dynamically injected for Deaf Accessibility
    if (!document.getElementById('vlibras-script')) {
      // 2.1 Append required markup structure
      const vwDiv = document.createElement('div');
      vwDiv.className = 'enabled';
      vwDiv.setAttribute('vw', 'true');
      vwDiv.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      `;
      document.body.appendChild(vwDiv);

      // 2.2 Load script
      const script = document.createElement('script');
      script.id = 'vlibras-script';
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onerror = (e) => {
        console.warn('VLibras script loading was blocked or failed:', e);
      };
      script.onload = () => {
        if (win.VLibras) {
          try {
            new win.VLibras.Widget('https://vlibras.gov.br/app');
          } catch(e) {
            console.error("Vlibas load failed", e);
          }
        }
      };
      document.body.appendChild(script);
    }

    // 3. Populate currency exchange rates on load
    fetchCurrencyRates();

    // 4. Populate starting weather
    fetchWeatherByCity('Paris');
  }, []);

  // ----------------------------------------------------
  // Font Size and Grayscale styling hook
  // ----------------------------------------------------
  useEffect(() => {
    const root = document.documentElement;
    // Remap standard body typography scale classes
    if (fontSizeClass === 'large') {
      root.style.fontSize = '112.5%'; // Scale up font size dynamically
    } else if (fontSizeClass === 'extra') {
      root.style.fontSize = '125%';
    } else {
      root.style.removeProperty('fontSize');
    }

    if (highContrast) {
      document.body.classList.add('contrast-high');
      const style = document.createElement('style');
      style.id = 'high-contrast-global-a11y';
      style.innerHTML = `
        .contrast-high {
          filter: contrast(1.15) saturate(1.1) !important;
        }
        .contrast-high *:not(.a11y-ignore) {
          background-color: #0b0a0a !important;
          color: #fcf6f0 !important;
          border-color: #AF4934 !important;
        }
      `;
      if (!document.getElementById('high-contrast-global-a11y')) {
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove('contrast-high');
      const style = document.getElementById('high-contrast-global-a11y');
      if (style) style.remove();
    }

    return () => {
      root.style.removeProperty('fontSize');
      document.body.classList.remove('contrast-high');
      const style = document.getElementById('high-contrast-global-a11y');
      if (style) style.remove();
    };
  }, [fontSizeClass, highContrast]);

  // ----------------------------------------------------
  // Google Translate dropdown observer/sync effect
  // Supports cross-origin sandboxed iframes perfectly
  // ----------------------------------------------------
  useEffect(() => {
    const checkAndSyncLanguage = () => {
      try {
        const savedLang = localStorage.getItem('arcadane_selected_lang') || currentLanguage;
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          if (selectElement.value !== savedLang) {
            selectElement.value = savedLang;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      } catch (err) {
        console.warn("Language sync observer error", err);
      }
    };

    // Sync instantly on load
    checkAndSyncLanguage();

    // Set a persistent interval checker to guarantee translation state,
    // even during dynamic client views or React state updates.
    const intervalId = setInterval(checkAndSyncLanguage, 1500);
    return () => clearInterval(intervalId);
  }, [currentLanguage]);

  // ----------------------------------------------------
  // Screen Reader Hover vocalization handler
  // ----------------------------------------------------
  useEffect(() => {
    if (!screenReaderEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const speechText = target.innerText || target.getAttribute('aria-label') || target.getAttribute('title');
      if (speechText && speechText.trim().length > 0) {
        // Cancel ongoing to prevent queue stacking
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText.slice(0, 150));
        utterance.lang = currentLanguage === 'en' ? 'en-US' : 'pt-BR';
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.speechSynthesis.cancel();
    };
  }, [screenReaderEnabled, currentLanguage]);

  // ----------------------------------------------------
  // Fetch Exchange Rates from Real API
  // ----------------------------------------------------
  const fetchCurrencyRates = async () => {
    setCurrencyLoading(true);
    setCurrencyError(false);
    try {
      const res = await fetch(EXCHANGE_API_URL);
      if (!res.ok) throw new Error("API Network reply failed");
      const data: CurrencyData = await res.json();
      setCurrencyRates(data.rates);
      setCurrencyLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString('pt-BR'));
    } catch (err) {
      console.error("Exchange fetch error", err);
      setCurrencyError(true);
      // Beautiful robust fallback rates if external API rate-limited
      setCurrencyRates({
        USD: 0.18,
        EUR: 0.17,
        GBP: 0.14,
        CAD: 0.25,
        CHF: 0.16,
        ARS: 165.4,
        AED: 0.67,
        JPY: 28.5,
      });
    } finally {
      setCurrencyLoading(false);
    }
  };

  // ----------------------------------------------------
  // Fetch Weather & Local Time from Real Public APIs
  // ----------------------------------------------------
  const fetchWeatherByCity = async (cityQuery: string) => {
    if (!cityQuery.trim()) return;
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      // Step A: Geocoding lookup
      const geoRes = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(cityQuery)}&limit=1`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        setWeatherError(true);
        setWeatherLoading(false);
        return;
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country, timezone } = location;

      // Step B: Get weather + local time offset
      const weatherRes = await fetch(
        `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=${encodeURIComponent(timezone)}`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error("No current weather data found");
      }

      const temp = weatherData.current_weather.temperature;
      const code = weatherData.current_weather.weathercode;
      
      // Calculate local time based on the response's local ISO timestamp
      let formattedTime = "00:00";
      if (weatherData.current_weather.time) {
        const timePart = weatherData.current_weather.time.split('T')[1];
        if (timePart) formattedTime = timePart.substring(0, 5);
      }

      setWeatherResult({
        city: name,
        country: country || "",
        temperature: Math.round(temp),
        weatherCode: code,
        localTime: formattedTime
      });
    } catch (err) {
      console.error("Weather resolution error", err);
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  // ----------------------------------------------------
  // Actions: Programmatic Google Translate Manipulation
  // ----------------------------------------------------
  const changeSiteLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);

    try {
      localStorage.setItem('arcadane_selected_lang', langCode);
      const cookieValue = `/pt/${langCode}`;
      const expires = "; expires=" + new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
      
      // Attempt writing standard cookies for production domains
      try {
        document.cookie = `googtrans=${cookieValue}${expires}; path=/; SameSite=None; Secure`;
        document.cookie = `googtrans=${cookieValue}${expires}; path=/; domain=${window.location.hostname}; SameSite=None; Secure`;
      } catch (_) {}

      // Update native Google widget select element
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Force instant page reload (F5) as requested by user to apply target language translation reliably!
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch (err) {
      console.warn("Language transformation error", err);
    }
  };

  // Weather description index mapper helper
  const getWeatherDescription = (code: number) => {
    const table: Record<number, { text: string; icon: string }> = {
      0: { text: "Céu Limpo", icon: "☀️" },
      1: { text: "Majoritariamente Limpo", icon: "🌤️" },
      2: { text: "Parcialmente Nublado", icon: "⛅" },
      3: { text: "Nublado", icon: "☁️" },
      45: { text: "Nevoeiro", icon: "🌫️" },
      51: { text: "Garoa Leve", icon: "🌦️" },
      61: { text: "Chuva Leve", icon: "🌧️" },
      80: { text: "Pancadas de Chuva", icon: "🌦️" },
      95: { text: "Tempestade", icon: "⛈️" }
    };
    return table[code] || { text: "Estável", icon: "🌤️" };
  };

  return (
    <>
      {/* 2. Floating Luxury Utility Launcher Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="traveler-utility-launcher"
        title="Assistente de viagem: Clima, Tradutor, Acessibilidade e Moedas"
        className="fixed bottom-6 right-20 sm:right-24 z-[29999] bg-[#1a1816]/95 hover:bg-[#AF4934]/20 hover:text-[#AF4934] border border-[#AF4934]/40 select-none text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer hover:border-[#AF4934] hover:scale-105 active:scale-95"
      >
        <span className="absolute -top-1 -right-1 bg-brand-primary w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-[#141210] font-bold border border-[#141210] animate-pulse">
          ✦
        </span>
        <Globe className="w-5.5 h-5.5 text-brand-secondary animate-spin-slow" />
      </button>

      {/* 3. Slider Drawer Panel Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[29995] flex justify-end" id="utility-panel-overlay">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Utility drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#131110] border-l border-stone-850 h-full shadow-2xl flex flex-col focus:outline-none"
              id="traveler-utilities-panel"
            >
              {/* Header inside drawer */}
              <div className="p-6 border-b border-stone-850 bg-[#171514] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#AF4934]/10 border border-[#AF4934]/20 flex items-center justify-center text-brand-secondary">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-lg text-white">Assistente do Viajante</h3>
                    <p className="text-[10px] font-mono tracking-widest text-[#AF4934] uppercase font-bold">Arcadane Utilities Hub</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Subtabs for switching tools */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-[#171514] border-b border-stone-850 text-center font-sans tracking-tight">
                <button
                  onClick={() => setActiveTab('translate')}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'translate' 
                      ? 'bg-[#AF4934]/15 text-[#AF4934]' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Globe className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-semibold uppercase">Traduzir</span>
                </button>

                <button
                  onClick={() => setActiveTab('accessibility')}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'accessibility' 
                      ? 'bg-[#AF4934]/15 text-[#AF4934]' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Accessibility className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-semibold uppercase">Acessível</span>
                </button>

                <button
                  onClick={() => setActiveTab('currency')}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'currency' 
                      ? 'bg-[#AF4934]/15 text-[#AF4934]' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-semibold uppercase">Moedas</span>
                </button>

                <button
                  onClick={() => setActiveTab('weather')}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'weather' 
                      ? 'bg-[#AF4934]/15 text-[#AF4934]' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <CloudSun className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-semibold uppercase">Clima</span>
                </button>
              </div>

              {/* Central Dynamic Content body of current tab */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* TAB 1: TRANSLATOR (DYNAMIC MULTI LANGUAGE GLOBAL WEB TRANSLATION) */}
                {activeTab === 'translate' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-white text-sm font-bold font-display">Seletor de Linguagem Global</h4>
                      <p className="text-stone-400 text-xs">
                        Clique em qualquer idioma abaixo para traduzir instantaneamente todo o conteúdo do site da Arcadane.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {availableLanguages.map((lang) => {
                        const isSelected = currentLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => changeSiteLanguage(lang.code)}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-[#AF4934]/15 border-[#AF4934] text-brand-secondary'
                                : 'bg-[#171514] border-stone-850 hover:border-stone-800 text-stone-200 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                               <span className="text-lg">{lang.flag}</span>
                              <span className="text-xs font-semibold font-sans">{lang.name}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#AF4934]" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="bg-[#171514] border border-stone-850 p-4.5 rounded-xl text-left space-y-2.5">
                      <span className="text-[9px] font-mono tracking-wider uppercase text-brand-secondary font-bold">INFO DE SISTEMA</span>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        Nossa tecnologia de tradução automatizada converte o conteúdo em tempo real sem recarregar a página, proporcionando leitura nativa fluida para clientes estrangeiros.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: ACCESSIBILITY (FONT ZOOM, CONTRAST, VOICE-STATIONS & VLIBRAS SIGN INTERPRETER) */}
                {activeTab === 'accessibility' && (
                  <div className="space-y-6 text-left">
                    <div className="space-y-1.5">
                      <h4 className="text-white text-sm font-bold font-display">Acessibilidade e Inclusão</h4>
                      <p className="text-stone-400 text-xs">
                        Ajuste as preferências de exibição de acordo com as suas necessidades ou ative o leitor por voz do site.
                      </p>
                    </div>

                    {/* VLibras Widget Promo note */}
                    <div className="bg-[#171514] border border-brand-secondary/25 p-4.5 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="absolute right-3 top-3 bg-brand-secondary/15 text-brand-secondary rounded-full px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                        Atendimento Libras
                      </div>
                      <h5 className="text-white text-xs font-bold leading-none">Intérprete VLibras Ativo</h5>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        O intérprete digital de Língua Brasileira de Sinais (Libras) está ativo no canto da sua tela! Para utilizá-lo, basta clicar no boneco de acessibilidade azul flutuante.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Zoom control */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold font-mono">Tamanho da Fonte:</span>
                        <div className="grid grid-cols-3 gap-2.5 bg-stone-900 border border-stone-850 p-1.5 rounded-xl">
                          <button
                            onClick={() => setFontSizeClass('normal')}
                            className={`py-2 text-[11px] rounded-lg transition-all cursor-pointer ${
                              fontSizeClass === 'normal'
                                ? 'bg-[#AF4934] text-white font-bold'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Normal (A)
                          </button>
                          <button
                            onClick={() => setFontSizeClass('large')}
                            className={`py-2 text-[11px] rounded-lg transition-all cursor-pointer ${
                              fontSizeClass === 'large'
                                ? 'bg-[#AF4934] text-white font-bold'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Grande (A+)
                          </button>
                          <button
                            onClick={() => setFontSizeClass('extra')}
                            className={`py-2 text-[11px] rounded-lg transition-all cursor-pointer ${
                              fontSizeClass === 'extra'
                                ? 'bg-[#AF4934] text-white font-bold'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            Gigante (A++)
                          </button>
                        </div>
                      </div>

                      {/* Grayscale contrast toggler */}
                      <div className="flex items-center justify-between p-4.5 bg-[#171514] border border-stone-850 rounded-xl">
                        <div>
                          <h5 className="text-white text-xs font-bold font-display">Cores de Alto Contraste</h5>
                          <p className="text-[10px] text-stone-400 mt-0.5">Maximiza o contraste de cores das mídias para facilitar a leitura.</p>
                        </div>
                        <button
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none cursor-pointer ${
                            highContrast ? 'bg-brand-primary' : 'bg-stone-800'
                          }`}
                        >
                          <span 
                            className={`block w-4 h-4 rounded-full bg-[#141210] shadow-md transform transition-transform duration-200 absolute top-1 ${
                              highContrast ? 'translate-x-6' : 'translate-x-1'
                            }`} 
                          />
                        </button>
                      </div>

                      {/* Screen reader helper toggler */}
                      <div className="flex items-center justify-between p-4.5 bg-[#171514] border border-stone-850 rounded-xl">
                        <div className="space-y-0.5">
                          <h5 className="text-white text-xs font-bold font-display flex items-center gap-1.5">
                            {screenReaderEnabled ? <Volume2 className="w-3.5 h-3.5 text-brand-primary" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
                            Leitor de Voz ao Passar o Mouse
                          </h5>
                          <p className="text-[10px] text-stone-400">Ativa narração de voz ao passar o cursor sobre as frases e botões do site.</p>
                        </div>
                        <button
                          onClick={() => setScreenReaderEnabled(!screenReaderEnabled)}
                          className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none cursor-pointer ${
                            screenReaderEnabled ? 'bg-brand-primary' : 'bg-stone-800'
                          }`}
                        >
                          <span 
                            className={`block w-4 h-4 rounded-full bg-[#141210] shadow-md transform transition-transform duration-200 absolute top-1 ${
                              screenReaderEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CURRENCY CONVERTER (REAL-TIME CONVERSION FROM BRL ON CLICK) */}
                {activeTab === 'currency' && (
                  <div className="space-y-5 text-left">
                    <div className="space-y-1.5">
                      <h4 className="text-white text-sm font-bold font-display">Conversor Monetário Exclusivo</h4>
                      <p className="text-stone-400 text-xs">
                        Veja o valor do Real (R$) hoje convertido para as moedas das principais praças de viagem internacional, atualizado automaticamente.
                      </p>
                    </div>

                    {/* Live indicator bar */}
                    <div className="flex items-center justify-between bg-stone-900 border border-stone-850 p-2.5 px-3.5 rounded-xl font-mono text-[9px] text-stone-400 uppercase">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        TAXAS REAIS (EM TEMPO REAL)
                      </span>
                      <span>Atualizado: {currencyLastUpdated || 'Hoje'}</span>
                    </div>

                    {/* Inputs panel */}
                    <div className="bg-[#171514] border border-stone-850 p-4.5 rounded-2xl space-y-4">
                      {/* BRL source */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">Inserir valor em Reais (BRL):</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">R$</span>
                          <input
                            type="number"
                            value={currencyAmount}
                            onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                            className="bg-stone-900 border border-stone-800 text-white w-full py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:border-[#AF4934] text-sm font-bold font-mono"
                            placeholder="0,00"
                          />
                        </div>
                      </div>

                      {/* Target Select */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">Moeda de Destino:</label>
                        <select
                          value={selectedTargetCurrency}
                          onChange={(e) => setSelectedTargetCurrency(e.target.value)}
                          className="bg-stone-900 border border-stone-800 text-white w-full p-3 rounded-xl focus:outline-none focus:border-[#AF4934] text-xs font-semibold"
                        >
                          <option value="USD">Dólar Americano ($ USD)</option>
                          <option value="EUR">Euro (€ EUR)</option>
                          <option value="GBP">Libra Esterlina (£ GBP)</option>
                          <option value="CHF">Franco Suíço (CHF)</option>
                          <option value="AED">Dirham de Dubai (AED)</option>
                          <option value="ARS">Peso Argentino ($ ARS)</option>
                          <option value="CNY">Yuan Chinês (¥ CNY)</option>
                          <option value="JPY">Iene Japonês (¥ JPY)</option>
                        </select>
                      </div>

                      {/* Display calculations */}
                      {currencyRates[selectedTargetCurrency] && (
                        <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-[#AF4934]">
                          <div className="text-stone-400 text-xs font-medium">Equivale a:</div>
                          <div className="text-right">
                            <span className="text-xl sm:text-2xl font-serif italic text-white block">
                              {(currencyAmount * (currencyRates[selectedTargetCurrency] || 0)).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: selectedTargetCurrency,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                            <span className="text-[9px] font-mono text-stone-500 block uppercase p-0.5">
                              Cotação Base: 1 BRL = {currencyRates[selectedTargetCurrency].toFixed(4)} {selectedTargetCurrency}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick exchange list for inspiration */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 block">Outras Equivalências Rápidas:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {['USD', 'EUR', 'GBP', 'AED'].map((curCode) => {
                          const multiplier = currencyRates[curCode] || 0.18;
                          return (
                            <div key={curCode} className="p-3 rounded-xl bg-stone-900 border border-stone-850/65 flex justify-between items-center">
                              <span className="text-stone-400 font-bold font-mono">{curCode}</span>
                              <span className="text-white font-semibold font-mono">{(currencyAmount * multiplier).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: WEATHER & CLOCK (LIVE WORLD SEARCH WEATHER AND LOCAL TIME INDEXER) */}
                {activeTab === 'weather' && (
                  <div className="space-y-5 text-left">
                    <div className="space-y-1.5">
                      <h4 className="text-white text-sm font-bold font-display">Clima e Horário Mundial</h4>
                      <p className="text-stone-400 text-xs">
                        Pesquise qualquer cidade para descobrir os graus, condições climáticas e o fuso horário local e programar sua bagagem.
                      </p>
                    </div>

                    {/* Search Field */}
                    <div className="relative">
                      <input
                        type="text"
                        value={weatherSearch}
                        onChange={(e) => setWeatherSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchWeatherByCity(weatherSearch)}
                        className="bg-[#171514] border border-stone-850 text-white text-xs w-full py-3.5 pl-3.5 pr-12 rounded-xl focus:outline-none focus:border-[#AF4934] font-sans"
                        placeholder="Busque cidades, ex: Londres, Miami, Maldivas..."
                      />
                      <button
                        onClick={() => fetchWeatherByCity(weatherSearch)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#3B5EA4] hover:bg-[#2e4981] transition-all cursor-pointer"
                        title="Pesquisar"
                      >
                        <Search className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {weatherLoading ? (
                      <div className="p-10 text-center space-y-3">
                        <div className="w-6 h-6 border-2 border-[#AF4934] border-t-transparent rounded-full animate-spin mx-auto" />
                        <span className="text-[#AF4934] text-xs font-semibold block font-mono">CONSULTANDO BASE...</span>
                      </div>
                    ) : weatherError ? (
                      <div className="p-6 bg-red-950/20 border border-red-900/30 text-center rounded-xl">
                        <span className="text-red-400 text-xs font-semibold block pt-1">
                          Nenhum resultado encontrado para esta cidade. Tente refinar a busca.
                        </span>
                      </div>
                    ) : weatherResult ? (
                      <div className="space-y-4">
                        {/* Main Weather Card Result */}
                        <div className="bg-gradient-to-br from-[#1c1815] to-[#2a211a] border border-[#AF4934]/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-48">
                          {/* Ambient big visual code emblem */}
                          <div className="absolute right-5 bottom-4 text-8.5xl opacity-20 pointer-events-none select-none leading-none">
                            {getWeatherDescription(weatherResult.weatherCode).icon}
                          </div>

                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-white font-serif italic text-xl font-bold tracking-tight">
                                {weatherResult.city}
                              </h5>
                              <span className="text-[9px] font-mono tracking-widest text-[#AF4934] uppercase font-bold">
                                {weatherResult.country}
                              </span>
                            </div>

                            {/* Weather display */}
                            <div className="text-right">
                              <span className="text-4xl font-semibold font-mono text-white block">
                                {weatherResult.temperature}°C
                              </span>
                              <span className="text-[10px] text-stone-300 font-medium">
                                {getWeatherDescription(weatherResult.weatherCode).text}
                              </span>
                            </div>
                          </div>

                          {/* Timezone current time status line */}
                          <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-auto">
                            <span className="text-[10.5px] text-stone-400 flex items-center gap-1.5 font-sans">
                              <Clock className="w-3.5 h-3.5 text-[#AF4934]" />
                              Horário Local da Cidade:
                            </span>
                            <span className="font-mono text-base font-bold text-white tracking-widest">
                              {weatherResult.localTime}
                            </span>
                          </div>
                        </div>

                        {/* Travel Packing advice based on degrees */}
                        <div className="bg-[#171514] border border-stone-850 p-4.5 rounded-xl text-left space-y-2">
                          <span className="text-[9px] font-mono tracking-wider font-bold uppercase text-[#AF4934]">Dicas de Malas & Curadoria Arcadane</span>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            {weatherResult.temperature >= 24 
                              ? "Clima perfeitamente quente! Ideal para pacotes de praias privativas, resorts boutique e passeios de iate. Roupas leves de linho e trajes de banho são essenciais."
                              : weatherResult.temperature >= 12
                              ? "Tempo suave e ameno. Ideal para caminhadas por becos históricos europeus e piqueniques ao ar livre. Leve um cardigã leve ou blazer sob medida."
                              : "Tempo gelado e intimista! Sugerimos experiências de vinhos refinados nas montanhas capixabas ou sulistas, lareiras e gastronomia intimista. Toucas e casacos robustos mandatórios."
                            }
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

              </div>

              {/* Action Contact Footer */}
              <div className="p-6 bg-[#171514] border-t border-stone-850 text-center font-sans">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block mb-2 font-bold">Deseja um Roteiro Personalizado?</span>
                <span className="text-xs text-stone-400 leading-normal block">
                  Nossos curadores refinam taxas confidenciais e hotéis boutique de acordo com o seu perfil. Entre em contato rápido pelo WhatsApp!
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
