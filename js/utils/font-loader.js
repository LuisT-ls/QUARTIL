/**
 * Font Loading Optimizer
 * Otimiza o carregamento de fontes para melhor performance
 */

class FontLoader {
  constructor() {
    this.loadedFonts = new Set();
    this.fallbackTimeout = 3000; // 3 segundos para fallback
    this.init();
  }

  init() {
    // Verificar se as fontes estão carregadas
    this.checkFontsLoaded();
    
    // Adicionar fallback para fontes não carregadas
    this.setupFallbacks();
    
    // Otimizar renderização de texto
    this.optimizeTextRendering();
  }

  checkFontsLoaded() {
    // Verificar se as fontes principais estão carregadas
    const criticalFonts = [
      'Poppins',
      'Font Awesome 5 Free',
      'Font Awesome 5 Brands'
    ];

    criticalFonts.forEach(font => {
      if (document.fonts && document.fonts.check) {
        if (document.fonts.check(`16px "${font}"`)) {
          this.loadedFonts.add(font);
        }
      }
    });
  }

  setupFallbacks() {
    // Aplicar fallback após timeout
    setTimeout(() => {
      this.applyFontFallbacks();
    }, this.fallbackTimeout);

    // Aplicar fallback quando fontes carregarem
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.applyFontFallbacks();
      });
    }
  }

  applyFontFallbacks() {
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const fontFamily = computedStyle.fontFamily;
      
      // Se a fonte não carregou, aplicar fallback
      if (fontFamily && !this.isFontLoaded(fontFamily)) {
        element.classList.add('font-fallback');
      }
    });
  }

  isFontLoaded(fontFamily) {
    // Verificar se a fonte está na lista de carregadas
    return this.loadedFonts.has(fontFamily) || 
           fontFamily.includes('system') || 
           fontFamily.includes('sans-serif');
  }

  optimizeTextRendering() {
    // Aplicar otimizações de renderização de texto
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    
    textElements.forEach(element => {
      element.classList.add('text-optimized');
    });
  }

  // Método para carregar fontes dinamicamente
  loadFont(fontUrl, fontFamily) {
    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, `url(${fontUrl})`);
      
      font.load().then(() => {
        document.fonts.add(font);
        this.loadedFonts.add(fontFamily);
        resolve(font);
      }).catch(reject);
    });
  }

  // Método para pré-carregar fontes críticas
  preloadCriticalFonts() {
    const criticalFonts = [
      {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
        family: 'Poppins'
      },
      {
        url: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0-beta3/webfonts/fa-solid-900.woff2',
        family: 'Font Awesome 5 Free'
      }
    ];

    criticalFonts.forEach(font => {
      this.loadFont(font.url, font.family).catch(console.warn);
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new FontLoader();
});

// Exportar para uso em outros módulos
export default FontLoader;
