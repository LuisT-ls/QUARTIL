/**
 * Reflow Optimizer
 * Utilitários para reduzir reflows forçados e melhorar performance
 */

class ReflowOptimizer {
  constructor() {
    this.pendingUpdates = new Map();
    this.rafId = null;
  }

  // Debounce para operações que causam reflow
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle para operações que causam reflow
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Batch DOM updates para reduzir reflows
  batchDOMUpdates(updates) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        updates.forEach(update => {
          if (typeof update === 'function') {
            update();
          }
        });
        resolve();
      });
    });
  }

  // Medir performance de operações
  measurePerformance(name, operation) {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    console.log(`${name} executado em ${end - start}ms`);
    return result;
  }

  // Otimizar carregamento de scripts
  loadScriptOptimized(src, options = {}) {
    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = options.async !== false;
      script.defer = options.defer || false;
      
      script.onload = () => {
        // Usar requestAnimationFrame para evitar reflow
        requestAnimationFrame(() => {
          resolve();
        });
      };
      
      script.onerror = () => {
        reject(new Error(`Falha ao carregar script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }

  // Otimizar carregamento de CSS
  loadCSSOptimized(href, options = {}) {
    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = options.media || 'all';
      
      link.onload = () => {
        // Usar requestAnimationFrame para evitar reflow
        requestAnimationFrame(() => {
          resolve();
        });
      };
      
      link.onerror = () => {
        reject(new Error(`Falha ao carregar CSS: ${href}`));
      };
      
      document.head.appendChild(link);
    });
  }

  // Otimizar manipulação de classes CSS
  addClassOptimized(element, className) {
    if (element && !element.classList.contains(className)) {
      requestAnimationFrame(() => {
        element.classList.add(className);
      });
    }
  }

  removeClassOptimized(element, className) {
    if (element && element.classList.contains(className)) {
      requestAnimationFrame(() => {
        element.classList.remove(className);
      });
    }
  }

  // Otimizar manipulação de estilos
  setStyleOptimized(element, styles) {
    if (element) {
      requestAnimationFrame(() => {
        Object.assign(element.style, styles);
      });
    }
  }

  // Otimizar queries DOM
  querySelectorOptimized(selector, context = document) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const element = context.querySelector(selector);
        resolve(element);
      });
    });
  }

  // Otimizar queries DOM múltiplas
  querySelectorAllOptimized(selector, context = document) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const elements = context.querySelectorAll(selector);
        resolve(Array.from(elements));
      });
    });
  }
}

// Instância global do Reflow Optimizer
const reflowOptimizer = new ReflowOptimizer();

// Exportar para uso em outros módulos
export default reflowOptimizer;
