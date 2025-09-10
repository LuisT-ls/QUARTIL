/**
 * Otimizador de Performance
 * Gerencia o carregamento otimizado de recursos para melhorar o LCP e FCP
 */

class PerformanceOptimizer {
  constructor() {
    this.resourcesLoaded = new Set();
    this.criticalResources = [
      './js/app.js',
      './js/modules/rol.js',
      './js/modules/quartis.js',
      './js/modules/medidasPosicao.js',
      './js/modules/medidasDispersao.js'
    ];
    this.nonCriticalResources = [
      './js/modules/graficos.js',
      './js/modules/tabelaFrequencia.js',
      './js/modules/tabelaFrequenciaManual.js',
      './js/modules/glossary.js',
      './js/modules/accessibility.js',
      './js/utils/notifications.js',
      './js/utils/performance-utils.js'
    ];
    
    this.init();
  }

  init() {
    // Carrega recursos críticos imediatamente
    this.loadCriticalResources();
    
    // Carrega recursos não-críticos após o carregamento da página
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.loadNonCriticalResources();
      });
    } else {
      this.loadNonCriticalResources();
    }

    // Otimiza imagens
    this.optimizeImages();
    
    // Configura lazy loading para elementos não críticos
    this.setupLazyLoading();
  }

  async loadCriticalResources() {
    for (const resource of this.criticalResources) {
      try {
        await this.loadScript(resource);
        this.resourcesLoaded.add(resource);
      } catch (error) {
        console.warn(`Erro ao carregar recurso crítico ${resource}:`, error);
      }
    }
  }

  async loadNonCriticalResources() {
    // Aguarda um pequeno delay para não bloquear a renderização
    await new Promise(resolve => setTimeout(resolve, 100));
    
    for (const resource of this.nonCriticalResources) {
      try {
        await this.loadScript(resource);
        this.resourcesLoaded.add(resource);
      } catch (error) {
        console.warn(`Erro ao carregar recurso não-crítico ${resource}:`, error);
      }
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Verifica se o script já foi carregado
      if (this.resourcesLoaded.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.type = 'module';
      script.onload = () => {
        this.resourcesLoaded.add(src);
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Falha ao carregar ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }

  optimizeImages() {
    // Adiciona loading="lazy" para imagens não críticas
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      // Primeira imagem (logo) mantém loading="eager"
      if (index > 0) {
        img.loading = 'lazy';
      }
    });
  }

  setupLazyLoading() {
    // Configura Intersection Observer para lazy loading de elementos
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Carrega recursos específicos quando o elemento entra na viewport
            if (element.dataset.loadResource) {
              this.loadScript(element.dataset.loadResource);
            }
            
            observer.unobserve(element);
          }
        });
      });

      // Observa elementos com data-lazy
      document.querySelectorAll('[data-lazy]').forEach(el => {
        observer.observe(el);
      });
    }
  }

  // Método para verificar se todos os recursos críticos foram carregados
  areCriticalResourcesLoaded() {
    return this.criticalResources.every(resource => 
      this.resourcesLoaded.has(resource)
    );
  }

  // Método para obter estatísticas de carregamento
  getLoadingStats() {
    return {
      criticalLoaded: this.criticalResources.filter(r => this.resourcesLoaded.has(r)).length,
      criticalTotal: this.criticalResources.length,
      nonCriticalLoaded: this.nonCriticalResources.filter(r => this.resourcesLoaded.has(r)).length,
      nonCriticalTotal: this.nonCriticalResources.length,
      allLoaded: this.resourcesLoaded.size
    };
  }
}

// Inicializa o otimizador quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
  });
} else {
  window.performanceOptimizer = new PerformanceOptimizer();
}

// Exporta para uso em outros módulos
window.PerformanceOptimizer = PerformanceOptimizer;
