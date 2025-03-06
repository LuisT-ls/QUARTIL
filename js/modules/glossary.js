/**
 * Módulo de Glossário de Estatística
 * Glossário interativo para todos os termos estatísticos com suas fórmulas
 */

export default class Glossario {
  constructor() {
    this.glossarioData = [
      {
        id: 'rol',
        titulo: 'Rol',
        categoria: 'conceitos-basicos',
        conteudo:
          'Sequência de dados estatísticos ordenados de forma crescente ou decrescente. É o primeiro passo na organização dos dados para análise estatística.',
        formula: null // Não possui fórmula específica
      },
      {
        id: 'medidas-posicao',
        titulo: 'Medidas de Posição',
        categoria: 'conceitos-basicos',
        conteudo:
          'São estatísticas que representam uma tendência central dos dados. As principais medidas de posição são a média, a mediana e a moda.',
        formula: null // Conceito geral, não possui fórmula específica
      },
      {
        id: 'media',
        titulo: 'Média',
        categoria: 'medidas-posicao',
        conteudo:
          'Soma de todos os valores do conjunto dividida pelo número total de elementos. É sensível a valores extremos (outliers).',
        formula: '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}'
      },
      {
        id: 'mediana',
        titulo: 'Mediana',
        categoria: 'medidas-posicao',
        conteudo:
          'Valor central de um conjunto de dados quando estes estão organizados em ordem crescente ou decrescente. Divide o conjunto em duas partes iguais e é menos sensível a valores extremos que a média.',
        formula:
          'Md = \\begin{cases} x_{\\frac{n+1}{2}}, & \\text{se } n \\text{ for ímpar} \\\\ \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2}, & \\text{se } n \\text{ for par} \\end{cases}'
      },
      {
        id: 'moda',
        titulo: 'Moda',
        categoria: 'medidas-posicao',
        conteudo:
          'Valor que aparece com maior frequência em um conjunto de dados. Um conjunto pode ser amodal (sem moda), unimodal (uma moda), bimodal (duas modas) ou multimodal (várias modas).',
        formula: 'Mo = \\text{valor(es) com maior frequência}'
      },
      {
        id: 'medidas-dispersao',
        titulo: 'Medidas de Dispersão',
        categoria: 'conceitos-basicos',
        conteudo:
          'Estatísticas que indicam o grau de variabilidade dos dados em relação às medidas de posição. Auxiliam na avaliação da homogeneidade do conjunto de dados.',
        formula: null // Conceito geral, não possui fórmula específica
      },
      {
        id: 'amplitude',
        titulo: 'Amplitude',
        categoria: 'medidas-dispersao',
        conteudo:
          'Diferença entre o maior e o menor valor de um conjunto de dados. É uma medida simples, mas muito sensível a valores extremos.',
        formula: 'A = x_{máx} - x_{mín}'
      },
      {
        id: 'variancia',
        titulo: 'Variância',
        categoria: 'medidas-dispersao',
        conteudo:
          'Média dos quadrados das diferenças entre cada valor e a média do conjunto. Indica o quão dispersos estão os valores em relação à média.',
        formula:
          's^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n} \\text{ (populacional)} \\quad s^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n-1} \\text{ (amostral)}'
      },
      {
        id: 'desvio-padrao',
        titulo: 'Desvio Padrão',
        categoria: 'medidas-dispersao',
        conteudo:
          'Raiz quadrada da variância. Expressa a dispersão dos dados na mesma unidade da variável original, facilitando a interpretação.',
        formula:
          's = \\sqrt{s^2} = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n}} \\text{ (populacional)} \\quad s = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n-1}} \\text{ (amostral)}'
      },
      {
        id: 'coeficiente-variacao',
        titulo: 'Coeficiente de Variação (CV)',
        categoria: 'medidas-dispersao',
        conteudo:
          'Razão entre o desvio padrão e a média, multiplicada por 100 (quando expressa em porcentagem). Permite comparar a variabilidade de diferentes conjuntos de dados, independentemente de suas unidades de medida.',
        formula: 'CV = \\frac{s}{\\bar{x}} \\times 100\\%'
      },
      {
        id: 'assimetria',
        titulo: 'Assimetria',
        categoria: 'medidas-dispersao',
        conteudo:
          'Medida que indica o grau de desvio ou afastamento da simetria de uma distribuição. Pode ser positiva (cauda à direita), negativa (cauda à esquerda) ou nula (distribuição simétrica).',
        formula: 'Assimetria\\text{ de Pearson} = \\frac{3(\\bar{x} - Md)}{s}'
      },
      {
        id: 'curtose',
        titulo: 'Curtose',
        categoria: 'medidas-dispersao',
        conteudo:
          'Medida que caracteriza o "achatamento" da curva da função de distribuição. Indica se a distribuição é mais "pontiaguda" ou mais "achatada" que a distribuição normal.',
        formula:
          'Kurt = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^4}{n \\cdot s^4} - 3'
      },
      {
        id: 'quartis',
        titulo: 'Quartis',
        categoria: 'conceitos-basicos',
        conteudo:
          'Valores que dividem um conjunto ordenado de dados em quatro partes iguais. Q1 (primeiro quartil), Q2 (segundo quartil ou mediana) e Q3 (terceiro quartil).',
        formula: null // Conceito geral explicado nos quartis individuais
      },
      {
        id: 'q1',
        titulo: 'Primeiro Quartil (Q1)',
        categoria: 'quartis',
        conteudo:
          'Valor abaixo do qual estão 25% dos dados quando organizados em ordem crescente. Também conhecido como quartil inferior.',
        formula:
          'Q1 = \\text{Mediana dos valores abaixo da mediana do conjunto completo}'
      },
      {
        id: 'q2',
        titulo: 'Segundo Quartil (Q2)',
        categoria: 'quartis',
        conteudo:
          'Equivalente à mediana. Valor abaixo do qual estão 50% dos dados quando organizados em ordem crescente.',
        formula: 'Q2 = Md'
      },
      {
        id: 'q3',
        titulo: 'Terceiro Quartil (Q3)',
        categoria: 'quartis',
        conteudo:
          'Valor abaixo do qual estão 75% dos dados quando organizados em ordem crescente. Também conhecido como quartil superior.',
        formula:
          'Q3 = \\text{Mediana dos valores acima da mediana do conjunto completo}'
      },
      {
        id: 'iqr',
        titulo: 'Amplitude Interquartil (IQR)',
        categoria: 'quartis',
        conteudo:
          'Diferença entre o terceiro quartil (Q3) e o primeiro quartil (Q1). Representa a dispersão central dos dados, sendo menos sensível a valores extremos.',
        formula: 'IQR = Q3 - Q1'
      },
      {
        id: 'media-juntas',
        titulo: 'Média das Juntas',
        categoria: 'quartis',
        conteudo:
          'Média aritmética do primeiro e terceiro quartis. Usada como uma medida de tendência central alternativa, menos sensível a valores extremos que a média.',
        formula: 'MJ = \\frac{Q1 + Q3}{2}'
      },
      {
        id: 'tabela-frequencia',
        titulo: 'Tabela de Frequência',
        categoria: 'conceitos-basicos',
        conteudo:
          'Organização tabular dos dados que apresenta a contagem (frequência) de ocorrência de cada valor ou classe de valores no conjunto de dados.',
        formula: null // Conceito geral, não possui fórmula específica
      },
      {
        id: 'frequencia-absoluta',
        titulo: 'Frequência Absoluta (fi)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Número de vezes que um determinado valor ou classe aparece no conjunto de dados.',
        formula: 'f_i = \\text{contagem de ocorrências do valor ou classe } i'
      },
      {
        id: 'frequencia-relativa',
        titulo: 'Frequência Relativa (fri)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Razão entre a frequência absoluta e o número total de elementos, geralmente expressa em porcentagem. Representa a proporção de ocorrência de cada valor ou classe.',
        formula: 'fr_i = \\frac{f_i}{n} \\times 100\\%'
      },
      {
        id: 'frequencia-acumulada',
        titulo: 'Frequência Acumulada (Fac)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Soma das frequências absolutas de todas as classes até a classe atual, inclusive. Indica quantos elementos possuem valor menor ou igual ao limite superior da classe.',
        formula: 'F_i = \\sum_{j=1}^{i} f_j'
      },
      {
        id: 'frequencia-relativa-acumulada',
        titulo: 'Frequência Relativa Acumulada (Fri)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Soma das frequências relativas de todas as classes até a classe atual, inclusive. Indica a proporção de elementos com valor menor ou igual ao limite superior da classe.',
        formula: 'Fr_i = \\sum_{j=1}^{i} fr_j = \\frac{F_i}{n} \\times 100\\%'
      },
      {
        id: 'classes',
        titulo: 'Classes',
        categoria: 'tabela-frequencia',
        conteudo:
          'Intervalos em que os dados são agrupados em uma tabela de frequência. O número adequado de classes depende do tamanho do conjunto de dados e da distribuição dos valores.',
        formula:
          'k \\approx \\sqrt{n} \\text{ ou } k \\approx 1 + 3,322 \\cdot \\log_{10}(n) \\text{ (Regra de Sturges)}'
      },
      {
        id: 'amplitude-classe',
        titulo: 'Amplitude de Classe',
        categoria: 'tabela-frequencia',
        conteudo:
          'Diferença entre o limite superior e o limite inferior de uma classe na tabela de frequências. Idealmente, todas as classes devem ter a mesma amplitude.',
        formula: 'h = \\frac{x_{máx} - x_{mín}}{k}'
      },
      {
        id: 'ponto-medio',
        titulo: 'Ponto Médio da Classe',
        categoria: 'tabela-frequencia',
        conteudo:
          'Valor que representa o centro de uma classe, calculado como a média aritmética entre os limites inferior e superior da classe.',
        formula:
          'PM = \\frac{\\text{limite inferior} + \\text{limite superior}}{2}'
      },
      {
        id: 'histograma',
        titulo: 'Histograma',
        categoria: 'graficos',
        conteudo:
          'Representação gráfica de uma tabela de frequências, onde a área de cada barra é proporcional à frequência da classe correspondente. Útil para visualizar a distribuição dos dados.',
        formula: null // Representação gráfica, não possui fórmula específica
      },
      {
        id: 'boxplot',
        titulo: 'Boxplot (Diagrama de Caixa)',
        categoria: 'graficos',
        conteudo:
          'Representação gráfica que resume os quartis, a mediana e os valores extremos de um conjunto de dados. Facilita a visualização da dispersão, simetria e identificação de outliers.',
        formula: null // Representação gráfica, não possui fórmula específica
      },
      {
        id: 'outliers',
        titulo: 'Outliers (Valores Atípicos)',
        categoria: 'conceitos-basicos',
        conteudo:
          'Valores que se diferenciam drasticamente de todos os outros, desviando-se significativamente do padrão geral do conjunto de dados. Geralmente são identificados usando o critério de 1,5 × IQR abaixo de Q1 ou acima de Q3.',
        formula:
          '\\text{Limite inferior: } Q1 - 1,5 \\times IQR \\quad \\text{Limite superior: } Q3 + 1,5 \\times IQR'
      },
      {
        id: 'distribuicao-normal',
        titulo: 'Distribuição Normal',
        categoria: 'distribuicoes',
        conteudo:
          'Distribuição de probabilidade contínua simétrica em forma de sino, caracterizada completamente por sua média e desvio padrão. Muitos fenômenos naturais seguem aproximadamente esta distribuição.',
        formula:
          'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}'
      },
      {
        id: 'intervalo-confianca',
        titulo: 'Intervalo de Confiança',
        categoria: 'inferencia',
        conteudo:
          'Intervalo estimado de um parâmetro estatístico, associado a um nível de confiança que indica a probabilidade de o intervalo conter o verdadeiro valor do parâmetro.',
        formula:
          'IC(\\mu) = \\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}} \\quad \\text{(para } \\sigma \\text{ conhecido)} \\quad IC(\\mu) = \\bar{x} \\pm t_{n-1, \\alpha/2} \\cdot \\frac{s}{\\sqrt{n}} \\quad \\text{(para } \\sigma \\text{ desconhecido)}'
      },
      {
        id: 'nivel-significancia',
        titulo: 'Nível de Significância',
        categoria: 'inferencia',
        conteudo:
          'Probabilidade de rejeitar a hipótese nula quando ela é verdadeira (erro tipo I). Geralmente representado por α e expressos em percentagem (por exemplo, 5% ou 1%).',
        formula:
          '\\alpha = P(\\text{rejeitar } H_0 | H_0 \\text{ é verdadeira})'
      },
      {
        id: 'correlacao',
        titulo: 'Coeficiente de Correlação de Pearson',
        categoria: 'medidas-associacao',
        conteudo:
          'Medida da força e direção da relação linear entre duas variáveis quantitativas. Varia de -1 (correlação negativa perfeita) a 1 (correlação positiva perfeita), com 0 indicando ausência de correlação linear.',
        formula:
          'r = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n} (x_i - \\bar{x})^2 \\sum_{i=1}^{n} (y_i - \\bar{y})^2}}'
      },
      {
        id: 'regressao-linear',
        titulo: 'Regressão Linear Simples',
        categoria: 'medidas-associacao',
        conteudo:
          'Método estatístico para modelar a relação entre uma variável dependente y e uma variável independente x, através de uma equação linear.',
        formula:
          'y = \\beta_0 + \\beta_1 x + \\varepsilon \\quad \\text{onde} \\quad \\beta_1 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^{n} (x_i - \\bar{x})^2} \\quad \\text{e} \\quad \\beta_0 = \\bar{y} - \\beta_1 \\bar{x}'
      },
      {
        id: 'coeficiente-determinacao',
        titulo: 'Coeficiente de Determinação (R²)',
        categoria: 'medidas-associacao',
        conteudo:
          'Proporção da variância na variável dependente que é previsível a partir da variável independente. Indica a qualidade do ajuste do modelo de regressão.',
        formula:
          'R^2 = \\frac{\\sum_{i=1}^{n} (\\hat{y}_i - \\bar{y})^2}{\\sum_{i=1}^{n} (y_i - \\bar{y})^2} = 1 - \\frac{\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^{n} (y_i - \\bar{y})^2}'
      }
    ]

    this.categorias = [
      { id: 'conceitos-basicos', nome: 'Conceitos Básicos' },
      { id: 'medidas-posicao', nome: 'Medidas de Posição' },
      { id: 'medidas-dispersao', nome: 'Medidas de Dispersão' },
      { id: 'quartis', nome: 'Quartis' },
      { id: 'tabela-frequencia', nome: 'Tabela de Frequência' },
      { id: 'graficos', nome: 'Gráficos' },
      { id: 'distribuicoes', nome: 'Distribuições' },
      { id: 'inferencia', nome: 'Inferência Estatística' },
      { id: 'medidas-associacao', nome: 'Medidas de Associação' }
    ]

    this.init()
  }

  init() {
    // Criar o contêiner do glossário
    this.criarComponenteGlossario()

    // Adicionar estilos específicos para fórmulas
    this.adicionarEstilosFormulas()

    // Adicionar à página
    this.adicionarGlossarioNaPagina()

    // Configurar eventos
    this.configurarEventos()
  }

  adicionarEstilosFormulas() {
    const estiloFormulas = document.createElement('style')
    estiloFormulas.textContent = `
      .katex-formula {
        padding: 8px;
        background-color: #f8f9fa;
        border-radius: 4px;
        overflow-x: auto;
        margin: 10px 0;
      }
      .katex { 
        font-size: 1.1em; 
      }
      .katex-display { 
        overflow-x: auto;
        overflow-y: hidden;
        padding: 5px 0;
      }
    `
    document.head.appendChild(estiloFormulas)
  }

  criarComponenteGlossario() {
    // Adicionar o CSS para fórmulas matemáticas (KaTeX ou MathJax)
    this.adicionarCSSMatematico()

    // Criar o HTML para o componente de glossário
    const glossarioHTML = `
      <div class="glossary-container">
        <div class="glossary-header">
          <h2 class="glossary-title"><i class="fas fa-book"></i> Glossário de Estatística</h2>
          <i class="fas fa-chevron-down glossary-toggle"></i>
        </div>
        <div class="glossary-content">
          <div class="glossary-search">
            <input type="text" class="glossary-search-input" placeholder="Buscar termo estatístico...">
          </div>
          <div class="glossary-categories">
            <button class="glossary-category active" data-category="todos">Todos</button>
            ${this.categorias
              .map(
                cat => `
              <button class="glossary-category" data-category="${cat.id}">${cat.nome}</button>
            `
              )
              .join('')}
          </div>
          <div class="glossary-items">
            ${this.renderizarItensGlossario(this.glossarioData)}
          </div>
        </div>
      </div>
    `

    this.glossarioElement = document.createElement('div')
    this.glossarioElement.innerHTML = glossarioHTML
  }

  adicionarCSSMatematico() {
    // Verificar se já existe o link para KaTeX
    if (!document.getElementById('katex-css')) {
      // Adicionar KaTeX CSS
      const katexCSS = document.createElement('link')
      katexCSS.id = 'katex-css'
      katexCSS.rel = 'stylesheet'
      katexCSS.href =
        'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css'
      document.head.appendChild(katexCSS)

      // Criar uma promessa que resolve quando KaTeX estiver carregado
      this.katexPromise = new Promise(resolve => {
        // Adicionar o script do KaTeX
        const katexScript = document.createElement('script')
        katexScript.src =
          'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js'
        katexScript.onload = () => {
          // Adicionar o script de auto-render após katex carregar
          const autoRenderScript = document.createElement('script')
          autoRenderScript.src =
            'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js'
          autoRenderScript.onload = () => {
            // Garantir que tanto KaTeX quanto auto-render estejam disponíveis
            resolve()
          }
          document.head.appendChild(autoRenderScript)
        }
        document.head.appendChild(katexScript)
      })
    } else {
      // Se KaTeX já foi carregado, cria uma promessa resolvida
      this.katexPromise = Promise.resolve()
    }
  }

  async inicializarRenderizacaoMatematica() {
    // Aguardar carregamento do KaTeX
    await this.katexPromise

    // Verificar se o renderMathInElement está disponível
    if (typeof renderMathInElement === 'function') {
      try {
        // Renderizar todas as fórmulas no glossário
        renderMathInElement(this.glossarioElement, {
          delimiters: [
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '$$', right: '$$', display: true }
          ],
          throwOnError: false,
          strict: false
        })
      } catch (error) {
        console.warn('Erro ao renderizar fórmulas (tentativa inicial):', error)
      }
    }
  }

  adicionarGlossarioNaPagina() {
    // Adicionar o glossário antes do footer
    const main = document.querySelector('main.container')
    const footer = document.querySelector('footer')

    if (main && footer) {
      main.appendChild(this.glossarioElement)
    }
  }

  configurarEventos() {
    // Alternar a exibição do conteúdo do glossário
    const headerElement =
      this.glossarioElement.querySelector('.glossary-header')
    const contentElement =
      this.glossarioElement.querySelector('.glossary-content')
    const toggleIcon = this.glossarioElement.querySelector('.glossary-toggle')

    headerElement.addEventListener('click', () => {
      contentElement.classList.toggle('expanded')
      toggleIcon.classList.toggle('expanded')
    })

    // Filtro de pesquisa
    const searchInput = this.glossarioElement.querySelector(
      '.glossary-search-input'
    )
    searchInput.addEventListener('input', () => {
      this.filtrarTermos(searchInput.value)
    })

    // Filtro por categoria
    const categoryButtons =
      this.glossarioElement.querySelectorAll('.glossary-category')
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe ativa de todos os botões
        categoryButtons.forEach(btn => btn.classList.remove('active'))

        // Adicionar classe ativa ao botão clicado
        button.classList.add('active')

        // Filtrar por categoria
        const categoria = button.dataset.category
        this.filtrarPorCategoria(categoria)
      })
    })

    // Renderizar as fórmulas depois que a página estiver completamente carregada
    window.addEventListener('load', () => {
      this.inicializarRenderizacaoMatematica()
    })

    // Tenta renderizar as fórmulas após um breve delay para garantir que tudo esteja carregado
    setTimeout(() => {
      this.inicializarRenderizacaoMatematica()
    }, 500)
  }

  renderizarItensGlossario(itens) {
    if (itens.length === 0) {
      return '<div class="glossary-no-results">Nenhum termo encontrado.</div>'
    }

    return itens
      .map(
        item => `
      <div class="glossary-item" data-id="${item.id}" data-category="${
          item.categoria
        }">
        <h3 class="glossary-item-title">${item.titulo}</h3>
        <p class="glossary-item-content">${item.conteudo}</p>
        ${
          item.formula
            ? `<div class="glossary-item-formula">
                <h4>Fórmula:</h4>
                <div class="formula-content katex-formula">$$${item.formula}$$</div>
               </div>`
            : ''
        }
        <span class="glossary-item-category">${this.getNomeCategoria(
          item.categoria
        )}</span>
      </div>
    `
      )
      .join('')
  }

  async recarregarFormulas() {
    // Aguardar o carregamento do KaTeX e então renderizar fórmulas
    await this.katexPromise
    this.renderizarFormulasMatematicas()
  }

  async renderizarFormulasMatematicas() {
    // Aguardar o carregamento do KaTeX
    await this.katexPromise

    // Verificar se o renderMathInElement está disponível
    if (typeof renderMathInElement === 'function') {
      try {
        const glossaryItems =
          this.glossarioElement.querySelector('.glossary-items')

        // Verificar se o elemento existe antes de tentar renderizar
        if (glossaryItems) {
          renderMathInElement(glossaryItems, {
            delimiters: [
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '$$', right: '$$', display: true }
            ],
            throwOnError: false,
            output: 'html',
            trust: true // Permite que o KaTeX execute comandos que poderiam ser inseguros
          })
        }
      } catch (error) {
        console.warn('Erro ao renderizar fórmulas (capturado):', error)
        // Se falhar, tentar novamente após um delay maior
        setTimeout(() => this.renderizarFormulasMatematicas(), 1000)
      }
    } else {
      // Se KaTeX não estiver disponível, tentar novamente após um delay
      console.warn('KaTeX ainda não disponível, tentando novamente...')
      setTimeout(() => this.renderizarFormulasMatematicas(), 500)
    }
  }

  getNomeCategoria(categoriaId) {
    const categoria = this.categorias.find(cat => cat.id === categoriaId)
    return categoria ? categoria.nome : categoriaId
  }

  async filtrarTermos(termo) {
    const termoBusca = termo.toLowerCase()
    const categoriaAtiva = this.glossarioElement.querySelector(
      '.glossary-category.active'
    ).dataset.category

    let itensFiltrados = this.glossarioData

    // Aplicar filtro de categoria se não for "todos"
    if (categoriaAtiva !== 'todos') {
      itensFiltrados = itensFiltrados.filter(
        item => item.categoria === categoriaAtiva
      )
    }

    // Aplicar filtro de busca
    if (termoBusca) {
      itensFiltrados = itensFiltrados.filter(
        item =>
          item.titulo.toLowerCase().includes(termoBusca) ||
          item.conteudo.toLowerCase().includes(termoBusca)
      )
    }

    // Atualizar a lista de itens
    const glossaryItems = this.glossarioElement.querySelector('.glossary-items')
    glossaryItems.innerHTML = this.renderizarItensGlossario(itensFiltrados)

    // Após atualizar o conteúdo, aguardar um momento e renderizar as fórmulas
    setTimeout(async () => {
      await this.recarregarFormulas()
    }, 100)
  }

  async filtrarPorCategoria(categoria) {
    const termoBusca = this.glossarioElement
      .querySelector('.glossary-search-input')
      .value.toLowerCase()

    let itensFiltrados = this.glossarioData

    // Aplicar filtro de categoria
    if (categoria !== 'todos') {
      itensFiltrados = itensFiltrados.filter(
        item => item.categoria === categoria
      )
    }

    // Aplicar filtro de busca
    if (termoBusca) {
      itensFiltrados = itensFiltrados.filter(
        item =>
          item.titulo.toLowerCase().includes(termoBusca) ||
          item.conteudo.toLowerCase().includes(termoBusca)
      )
    }

    // Atualizar a lista de itens
    const glossaryItems = this.glossarioElement.querySelector('.glossary-items')
    glossaryItems.innerHTML = this.renderizarItensGlossario(itensFiltrados)

    // Após atualizar o conteúdo, aguardar um momento e renderizar as fórmulas
    setTimeout(async () => {
      await this.recarregarFormulas()
    }, 100)
  }
}
