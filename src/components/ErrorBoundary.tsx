import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';
import { resetCmsToDefault } from '../utils/cmsStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Arcadane Error Boundary caught a rendering crash]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    if (window.confirm('Deseja realmente restaurar as configurações padrão do sistema? Isso limpará o cache local e corrigirá possíveis inconsistências.')) {
      resetCmsToDefault();
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    // If we're inside a nested view, we can reload to return to the home screen
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#12100E] text-[#fdfcf9] px-6 py-12 rounded-3xl border border-stone-800 my-8 max-w-4xl mx-auto shadow-2xl animate-fade-in" id="error-boundary-panel">
          <div className="w-16 h-16 bg-[#AF4934]/10 border border-[#AF4934]/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <AlertTriangle className="w-8 h-8 text-[#AF4934]" />
          </div>
          
          <h2 className="text-2xl font-display font-medium mb-3 text-[#fdfcf9] tracking-tight">
            Ops! Algo deu errado ao carregar este painel
          </h2>
          
          <p className="text-stone-400 text-sm max-w-md text-center mb-8 leading-relaxed">
            Detectamos uma inconsistência temporária na renderização ou nos dados do cache local do seu navegador. Não se preocupe, seus dados estão seguros!
          </p>

          {this.state.error && (
            <div className="w-full max-w-lg bg-[#181615] border border-stone-800 rounded-xl p-4 mb-8 font-mono text-xs text-left overflow-auto max-h-40 text-stone-500">
              <span className="text-[#AF4934] font-bold">Erro:</span> {this.state.error.message}
              {this.state.error.stack && (
                <div className="mt-2 text-[10px] text-stone-600 border-t border-stone-900 pt-2 whitespace-pre">
                  {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-6 py-3 bg-[#AF4934] hover:bg-[#c5523a] text-white rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg active:translate-y-0"
              id="error-btn-retry"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
            
            <button
              onClick={this.handleResetAndReload}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              id="error-btn-reset"
            >
              <Trash2 className="w-4 h-4 text-stone-400" />
              Restaurar Padrão (Failsafe)
            </button>

            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-stone-900 border border-transparent hover:border-stone-800 text-stone-400 hover:text-stone-300 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300"
              id="error-btn-home"
            >
              <Home className="w-4 h-4" />
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
