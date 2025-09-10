/**
 * KaTeX Loader Otimizado
 * Carrega o KaTeX com otimizações de performance
 */

class KaTeXLoader {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
  }

  async loadKaTeX() {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Carregar CSS otimizado primeiro
      this.loadOptimizedCSS().then(() => {
        // Carregar scripts do KaTeX
        this.loadScripts().then(() => {
          this.isLoaded = true;
          resolve();
        }).catch(reject);
      }).catch(reject);
    });

    return this.loadPromise;
  }

  loadOptimizedCSS() {
    return new Promise((resolve, reject) => {
      // Verificar se o CSS já foi carregado
      if (document.getElementById('katex-css')) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = './assets/css/modules/base/katex-optimized.css';
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Falha ao carregar CSS do KaTeX'));
      
      document.head.appendChild(link);
    });
  }

  loadScripts() {
    return new Promise((resolve, reject) => {
      // Carregar script principal do KaTeX
      const katexScript = document.createElement('script');
      katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      katexScript.crossOrigin = 'anonymous';
      
      katexScript.onload = () => {
        // Carregar auto-render após KaTeX principal
        const autoRenderScript = document.createElement('script');
        autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
        autoRenderScript.crossOrigin = 'anonymous';
        
        autoRenderScript.onload = () => resolve();
        autoRenderScript.onerror = () => reject(new Error('Falha ao carregar auto-render do KaTeX'));
        
        document.head.appendChild(autoRenderScript);
      };
      
      katexScript.onerror = () => reject(new Error('Falha ao carregar KaTeX'));
      document.head.appendChild(katexScript);
    });
  }

  // Método para renderizar fórmulas matemáticas
  renderMath(element, options = {}) {
    if (!this.isLoaded) {
      console.warn('KaTeX ainda não foi carregado');
      return;
    }

    if (window.katex && window.renderMathInElement) {
      window.renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        trust: true,
        ...options
      });
    }
  }

  // Método para renderizar uma fórmula individual
  renderFormula(formula, element, options = {}) {
    if (!this.isLoaded || !window.katex) {
      console.warn('KaTeX ainda não foi carregado');
      return;
    }

    try {
      const html = window.katex.renderToString(formula, {
        throwOnError: false,
        trust: true,
        ...options
      });
      element.innerHTML = html;
    } catch (error) {
      console.warn('Erro ao renderizar fórmula:', error);
      element.textContent = formula;
    }
  }
}

// Instância global do KaTeX Loader
const katexLoader = new KaTeXLoader();

// Exportar para uso em outros módulos
export default katexLoader;
