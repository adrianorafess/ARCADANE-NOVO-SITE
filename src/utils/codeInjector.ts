/**
 * Utility to dynamically inject custom HTML, CSS, and JS scripts into the document.
 * This is crucial for Google Tag Manager, custom search boxes, chat widgets, and style customizers.
 */

export function injectCustomCode(
  position: 'head' | 'body_start' | 'body_end',
  htmlCode: string | null
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const attrName = `data-custom-inject-${position}`;
  
  // 1. Clean up any previous elements injected in this position
  const existingElements = document.querySelectorAll(`[${attrName}]`);
  existingElements.forEach((el) => el.remove());

  if (!htmlCode || htmlCode.trim() === '') return;

  // 2. Parse the HTML content using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlCode}</div>`, 'text/html');
  const container = doc.body.firstChild as HTMLElement;

  if (!container) return;

  // 3. Determine target parent in the real document
  let targetParent: HTMLElement | null = null;
  if (position === 'head') {
    targetParent = document.head;
  } else if (position === 'body_start') {
    targetParent = document.body;
  } else {
    targetParent = document.body;
  }

  // If body_start, we want to insert them at the very beginning of the body
  const insertBeforeEl = position === 'body_start' ? document.body.firstChild : null;

  // 4. Inject each node, handling script execution correctly
  const childNodes = Array.from(container.childNodes);
  childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      
      // We must reconstruct <script> elements so they execute properly
      if (el.tagName.toLowerCase() === 'script') {
        const scriptEl = document.createElement('script');
        scriptEl.setAttribute(attrName, 'true');
        
        // Copy all attributes
        Array.from(el.attributes).forEach((attr) => {
          scriptEl.setAttribute(attr.name, attr.value);
        });
        
        // Copy inner script code
        scriptEl.textContent = el.textContent;
        
        if (position === 'body_start' && insertBeforeEl) {
          document.body.insertBefore(scriptEl, insertBeforeEl);
        } else {
          targetParent?.appendChild(scriptEl);
        }
      } else {
        // For link, style, div, etc., we can clone them and set our tracking attribute
        const clonedEl = el.cloneNode(true) as HTMLElement;
        clonedEl.setAttribute(attrName, 'true');
        
        if (position === 'body_start' && insertBeforeEl) {
          document.body.insertBefore(clonedEl, insertBeforeEl);
        } else {
          targetParent?.appendChild(clonedEl);
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '') {
      // Create a wrapper span for raw text to apply attribute tracking
      const textWrapper = document.createElement('span');
      textWrapper.setAttribute(attrName, 'true');
      textWrapper.textContent = node.textContent;
      
      if (position === 'body_start' && insertBeforeEl) {
        document.body.insertBefore(textWrapper, insertBeforeEl);
      } else {
        targetParent?.appendChild(textWrapper);
      }
    }
  });
}

/**
 * Convenience function to apply all custom injections saved in localStorage
 */
export const DEFAULT_HEAD_CODE = `<link rel="stylesheet" href="https://static.onertravel.com/widget/search/production/styles.css">
<style>
/* ==========================================================================
   ESTILO LUXUOSO E PERSONALIZADO PARA O BUSCADOR BEFLY / ONER TRAVEL
   ========================================================================== */

#wrapper {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(24, 22, 21, 0.08);
  padding: 20px;
  border: 1px solid rgba(59, 94, 164, 0.08);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  max-width: 100%;
}

#wrapper:hover {
  box-shadow: 0 20px 48px rgba(24, 22, 21, 0.12);
  border-color: rgba(175, 73, 52, 0.15);
}

/* Configuração de Variáveis do Elemento customizado */
befly-widget {
  --primary-color: var(--color-brand-primary, #3B5EA4) !important;
  --brand-color: var(--color-brand-primary, #3B5EA4) !important;
  --accent-color: var(--color-brand-secondary, #AF4934) !important;
  --onertravel-primary: var(--color-brand-primary, #3B5EA4) !important;
  --widget-primary: var(--color-brand-primary, #3B5EA4) !important;
  --color-primary: var(--color-brand-primary, #3B5EA4) !important;
  --border-radius: 10px !important;
  
  display: block;
  font-family: 'Inter', system-ui, sans-serif !important;
}

/* Estilo para Abas (Tabs) do Widget */
befly-widget .tabs, 
befly-widget .tab-list,
befly-widget [role="tablist"] {
  border-bottom: 2px solid #f5f3f0 !important;
  gap: 16px !important;
  margin-bottom: 20px !important;
}

befly-widget .tab,
befly-widget [role="tab"] {
  font-family: 'Outfit', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: #78716c !important;
  border-bottom: 2px solid transparent !important;
  padding: 8px 16px !important;
  transition: all 0.2s ease !important;
}

befly-widget .tab:hover,
befly-widget [role="tab"]:hover {
  color: var(--color-brand-primary, #3B5EA4) !important;
}

befly-widget .tab[aria-selected="true"],
befly-widget .tab.active,
befly-widget [role="tab"][aria-selected="true"] {
  color: var(--color-brand-primary, #3B5EA4) !important;
  border-bottom-color: var(--color-brand-primary, #3B5EA4) !important;
}

/* Estilo para Inputs e Seletores */
befly-widget input,
befly-widget select,
befly-widget .input-field,
befly-widget .form-control {
  background-color: #fcfbfa !important;
  border: 1px solid #e7e5e4 !important;
  border-radius: 10px !important;
  color: #1c1917 !important;
  font-size: 13px !important;
  padding: 10px 14px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

befly-widget input:focus,
befly-widget select:focus,
befly-widget .input-field:focus {
  border-color: var(--color-brand-primary, #3B5EA4) !important;
  box-shadow: 0 0 0 3px rgba(59, 94, 164, 0.15) !important;
  outline: none !important;
}

/* Customização dos Botões de Pesquisa */
befly-widget button,
befly-widget .btn,
befly-widget .btn-primary,
befly-widget .search-btn,
befly-widget [type="submit"],
befly-widget .submit-btn,
befly-widget .search-button {
  background-color: var(--color-brand-primary, #3B5EA4) !important;
  background: var(--color-brand-primary, #3B5EA4) !important;
  color: #ffffff !important;
  font-family: 'Outfit', sans-serif !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  border-radius: 10px !important;
  padding: 12px 24px !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 14px rgba(59, 94, 164, 0.15) !important;
  cursor: pointer !important;
}

befly-widget button:hover,
befly-widget .btn:hover,
befly-widget .btn-primary:hover,
befly-widget .search-btn:hover,
befly-widget [type="submit"]:hover {
  background-color: var(--color-brand-secondary, #AF4934) !important;
  background: var(--color-brand-secondary, #AF4934) !important;
  box-shadow: 0 6px 20px rgba(175, 73, 52, 0.25) !important;
  transform: translateY(-1px) !important;
}

/* Responsividade Aprimorada */
@media (max-width: 640px) {
  #wrapper {
    padding: 12px;
    border-radius: 12px;
  }
  befly-widget .tab,
  befly-widget [role="tab"] {
    font-size: 11px !important;
    padding: 6px 10px !important;
  }
}
</style>`;

export const DEFAULT_BODY_START_CODE = `<!-- Insira aqui códigos adicionais para o início do corpo (logo após o <body>). Ex: NoScript de Tag Manager, Pixel, etc. -->`;

export const DEFAULT_BODY_END_CODE = `<!-- Scripts e pixels adicionais, ex: Google Analytics ou Chat de Atendimento -->`;

export function applyAllCustomInjections(): void {
  if (typeof window === 'undefined') return;
  
  try {
    let headCode = localStorage.getItem('arcadane_custom_head_code');
    let bodyStartCode = localStorage.getItem('arcadane_custom_body_start_code');
    let bodyEndCode = localStorage.getItem('arcadane_custom_body_end_code');
    
    // Auto-migrate if the user has the duplicate widget in the body_start (top of page)
    if (bodyStartCode && bodyStartCode.includes('befly-widget')) {
      localStorage.setItem('arcadane_custom_body_start_code', DEFAULT_BODY_START_CODE);
      bodyStartCode = DEFAULT_BODY_START_CODE;
    }
    
    // Default fallback to OnerTravel / Befly codes
    if (headCode === null) {
      headCode = DEFAULT_HEAD_CODE;
    }
    if (bodyStartCode === null) {
      bodyStartCode = DEFAULT_BODY_START_CODE;
    }
    if (bodyEndCode === null) {
      bodyEndCode = DEFAULT_BODY_END_CODE;
    }
    
    injectCustomCode('head', headCode);
    injectCustomCode('body_start', bodyStartCode);
    injectCustomCode('body_end', bodyEndCode);
  } catch (error) {
    console.error('Error applying custom injections:', error);
  }
}
