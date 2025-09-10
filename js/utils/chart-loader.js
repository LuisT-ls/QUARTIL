/**
 * Chart.js Loader Otimizado
 * Carrega o Chart.js de forma otimizada para reduzir reflows
 */

class ChartLoader {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
    this.pendingCharts = [];
  }

  async loadChartJS() {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Verificar se Chart.js já está carregado
      if (window.Chart) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Carregar Chart.js de forma otimizada
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        // Processar gráficos pendentes
        this.processPendingCharts();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Falha ao carregar Chart.js'));
      };
      
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Método para criar gráfico de forma otimizada
  async createChart(canvas, config) {
    if (!this.isLoaded) {
      // Adicionar à lista de pendentes
      this.pendingCharts.push({ canvas, config });
      await this.loadChartJS();
    }

    // Usar requestAnimationFrame para evitar reflow forçado
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        try {
          const chart = new Chart(canvas, config);
          resolve(chart);
        } catch (error) {
          console.warn('Erro ao criar gráfico:', error);
          resolve(null);
        }
      });
    });
  }

  // Processar gráficos pendentes
  processPendingCharts() {
    if (this.pendingCharts.length > 0) {
      requestAnimationFrame(() => {
        this.pendingCharts.forEach(({ canvas, config }) => {
          try {
            new Chart(canvas, config);
          } catch (error) {
            console.warn('Erro ao criar gráfico pendente:', error);
          }
        });
        this.pendingCharts = [];
      });
    }
  }

  // Método para destruir gráfico de forma otimizada
  destroyChart(chart) {
    if (chart && typeof chart.destroy === 'function') {
      requestAnimationFrame(() => {
        chart.destroy();
      });
    }
  }

  // Método para atualizar gráfico de forma otimizada
  updateChart(chart) {
    if (chart && typeof chart.update === 'function') {
      requestAnimationFrame(() => {
        chart.update('none'); // 'none' evita animações desnecessárias
      });
    }
  }
}

// Instância global do Chart Loader
const chartLoader = new ChartLoader();

// Exportar para uso em outros módulos
export default chartLoader;
