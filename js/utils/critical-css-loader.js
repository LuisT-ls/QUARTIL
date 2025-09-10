/**
 * Carregador de CSS Crítico
 * Carrega o CSS crítico inline para melhorar o LCP
 */

class CriticalCSSLoader {
  constructor() {
    this.criticalCSSLoaded = false;
    this.init();
  }

  async init() {
    try {
      // Carrega o CSS crítico
      await this.loadCriticalCSS();
      
      // Carrega CSS não-crítico após o carregamento da página
      this.loadNonCriticalCSS();
      
      this.criticalCSSLoaded = true;
    } catch (error) {
      console.warn('Erro ao carregar CSS crítico:', error);
      // Fallback: carrega CSS normal
      this.loadFallbackCSS();
    }
  }

  async loadCriticalCSS() {
    try {
      // Tenta carregar a versão minificada primeiro
      let response = await fetch('./assets/css/critical.min.css');
      if (!response.ok) {
        // Fallback para versão não minificada
        response = await fetch('./assets/css/critical.css');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      }
      
      const criticalCSS = await response.text();
      
      // Injeta o CSS crítico no <style> tag
      const styleTag = document.querySelector('style');
      if (styleTag) {
        styleTag.textContent = criticalCSS;
      } else {
        // Cria um novo style tag se não existir
        const newStyleTag = document.createElement('style');
        newStyleTag.textContent = criticalCSS;
        document.head.insertBefore(newStyleTag, document.head.firstChild);
      }
    } catch (error) {
      console.warn('Erro ao carregar CSS crítico, usando fallback:', error);
      throw error;
    }
  }

  loadNonCriticalCSS() {
    // CSS não-crítico já está sendo carregado via preload
    // Este método pode ser usado para carregar CSS adicional se necessário
    console.log('CSS não-crítico carregado via preload');
  }

  loadFallbackCSS() {
    // Fallback: carrega CSS normal se o crítico falhar
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/css/main.css';
    document.head.appendChild(link);
  }

  // Método para verificar se o CSS crítico foi carregado
  isCriticalCSSLoaded() {
    return this.criticalCSSLoaded;
  }
}

// Inicializa o carregador quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CriticalCSSLoader();
  });
} else {
  new CriticalCSSLoader();
}

// Exporta para uso em outros módulos
window.CriticalCSSLoader = CriticalCSSLoader;
