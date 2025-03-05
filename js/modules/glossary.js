/**
 * Módulo de Glossário de Estatística
 * Glossário interativo para todos os termos estatísticos
 */

export default class Glossario {
  constructor() {
    this.glossarioData = [
      {
        id: 'rol',
        titulo: 'Rol',
        categoria: 'conceitos-basicos',
        conteudo:
          'Sequência de dados estatísticos ordenados de forma crescente ou decrescente. É o primeiro passo na organização dos dados para análise estatística.'
      },
      {
        id: 'medidas-posicao',
        titulo: 'Medidas de Posição',
        categoria: 'conceitos-basicos',
        conteudo:
          'São estatísticas que representam uma tendência central dos dados. As principais medidas de posição são a média, a mediana e a moda.'
      },
      {
        id: 'media',
        titulo: 'Média',
        categoria: 'medidas-posicao',
        conteudo:
          'Soma de todos os valores do conjunto dividida pelo número total de elementos. É sensível a valores extremos (outliers).'
      },
      {
        id: 'mediana',
        titulo: 'Mediana',
        categoria: 'medidas-posicao',
        conteudo:
          'Valor central de um conjunto de dados quando estes estão organizados em ordem crescente ou decrescente. Divide o conjunto em duas partes iguais e é menos sensível a valores extremos que a média.'
      },
      {
        id: 'moda',
        titulo: 'Moda',
        categoria: 'medidas-posicao',
        conteudo:
          'Valor que aparece com maior frequência em um conjunto de dados. Um conjunto pode ser amodal (sem moda), unimodal (uma moda), bimodal (duas modas) ou multimodal (várias modas).'
      },
      {
        id: 'medidas-dispersao',
        titulo: 'Medidas de Dispersão',
        categoria: 'conceitos-basicos',
        conteudo:
          'Estatísticas que indicam o grau de variabilidade dos dados em relação às medidas de posição. Auxiliam na avaliação da homogeneidade do conjunto de dados.'
      },
      {
        id: 'amplitude',
        titulo: 'Amplitude',
        categoria: 'medidas-dispersao',
        conteudo:
          'Diferença entre o maior e o menor valor de um conjunto de dados. É uma medida simples, mas muito sensível a valores extremos.'
      },
      {
        id: 'variancia',
        titulo: 'Variância',
        categoria: 'medidas-dispersao',
        conteudo:
          'Média dos quadrados das diferenças entre cada valor e a média do conjunto. Indica o quão dispersos estão os valores em relação à média.'
      },
      {
        id: 'desvio-padrao',
        titulo: 'Desvio Padrão',
        categoria: 'medidas-dispersao',
        conteudo:
          'Raiz quadrada da variância. Expressa a dispersão dos dados na mesma unidade da variável original, facilitando a interpretação.'
      },
      {
        id: 'coeficiente-variacao',
        titulo: 'Coeficiente de Variação (CV)',
        categoria: 'medidas-dispersao',
        conteudo:
          'Razão entre o desvio padrão e a média, multiplicada por 100 (quando expressa em porcentagem). Permite comparar a variabilidade de diferentes conjuntos de dados, independentemente de suas unidades de medida.'
      },
      {
        id: 'assimetria',
        titulo: 'Assimetria',
        categoria: 'medidas-dispersao',
        conteudo:
          'Medida que indica o grau de desvio ou afastamento da simetria de uma distribuição. Pode ser positiva (cauda à direita), negativa (cauda à esquerda) ou nula (distribuição simétrica).'
      },
      {
        id: 'curtose',
        titulo: 'Curtose',
        categoria: 'medidas-dispersao',
        conteudo:
          'Medida que caracteriza o "achatamento" da curva da função de distribuição. Indica se a distribuição é mais "pontiaguda" ou mais "achatada" que a distribuição normal.'
      },
      {
        id: 'quartis',
        titulo: 'Quartis',
        categoria: 'conceitos-basicos',
        conteudo:
          'Valores que dividem um conjunto ordenado de dados em quatro partes iguais. Q1 (primeiro quartil), Q2 (segundo quartil ou mediana) e Q3 (terceiro quartil).'
      },
      {
        id: 'q1',
        titulo: 'Primeiro Quartil (Q1)',
        categoria: 'quartis',
        conteudo:
          'Valor abaixo do qual estão 25% dos dados quando organizados em ordem crescente. Também conhecido como quartil inferior.'
      },
      {
        id: 'q2',
        titulo: 'Segundo Quartil (Q2)',
        categoria: 'quartis',
        conteudo:
          'Equivalente à mediana. Valor abaixo do qual estão 50% dos dados quando organizados em ordem crescente.'
      },
      {
        id: 'q3',
        titulo: 'Terceiro Quartil (Q3)',
        categoria: 'quartis',
        conteudo:
          'Valor abaixo do qual estão 75% dos dados quando organizados em ordem crescente. Também conhecido como quartil superior.'
      },
      {
        id: 'iqr',
        titulo: 'Amplitude Interquartil (IQR)',
        categoria: 'quartis',
        conteudo:
          'Diferença entre o terceiro quartil (Q3) e o primeiro quartil (Q1). Representa a dispersão central dos dados, sendo menos sensível a valores extremos.'
      },
      {
        id: 'media-juntas',
        titulo: 'Média das Juntas',
        categoria: 'quartis',
        conteudo:
          'Média aritmética do primeiro e terceiro quartis. Usada como uma medida de tendência central alternativa, menos sensível a valores extremos que a média.'
      },
      {
        id: 'tabela-frequencia',
        titulo: 'Tabela de Frequência',
        categoria: 'conceitos-basicos',
        conteudo:
          'Organização tabular dos dados que apresenta a contagem (frequência) de ocorrência de cada valor ou classe de valores no conjunto de dados.'
      },
      {
        id: 'frequencia-absoluta',
        titulo: 'Frequência Absoluta (fi)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Número de vezes que um determinado valor ou classe aparece no conjunto de dados.'
      },
      {
        id: 'frequencia-relativa',
        titulo: 'Frequência Relativa (fri)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Razão entre a frequência absoluta e o número total de elementos, geralmente expressa em porcentagem. Representa a proporção de ocorrência de cada valor ou classe.'
      },
      {
        id: 'frequencia-acumulada',
        titulo: 'Frequência Acumulada (Fac)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Soma das frequências absolutas de todas as classes até a classe atual, inclusive. Indica quantos elementos possuem valor menor ou igual ao limite superior da classe.'
      },
      {
        id: 'frequencia-relativa-acumulada',
        titulo: 'Frequência Relativa Acumulada (Fri)',
        categoria: 'tabela-frequencia',
        conteudo:
          'Soma das frequências relativas de todas as classes até a classe atual, inclusive. Indica a proporção de elementos com valor menor ou igual ao limite superior da classe.'
      },
      {
        id: 'classes',
        titulo: 'Classes',
        categoria: 'tabela-frequencia',
        conteudo:
          'Intervalos em que os dados são agrupados em uma tabela de frequência. O número adequado de classes depende do tamanho do conjunto de dados e da distribuição dos valores.'
      },
      {
        id: 'amplitude-classe',
        titulo: 'Amplitude de Classe',
        categoria: 'tabela-frequencia',
        conteudo:
          'Diferença entre o limite superior e o limite inferior de uma classe na tabela de frequências. Idealmente, todas as classes devem ter a mesma amplitude.'
      },
      {
        id: 'ponto-medio',
        titulo: 'Ponto Médio da Classe',
        categoria: 'tabela-frequencia',
        conteudo:
          'Valor que representa o centro de uma classe, calculado como a média aritmética entre os limites inferior e superior da classe.'
      },
      {
        id: 'histograma',
        titulo: 'Histograma',
        categoria: 'graficos',
        conteudo:
          'Representação gráfica de uma tabela de frequências, onde a área de cada barra é proporcional à frequência da classe correspondente. Útil para visualizar a distribuição dos dados.'
      },
      {
        id: 'boxplot',
        titulo: 'Boxplot (Diagrama de Caixa)',
        categoria: 'graficos',
        conteudo:
          'Representação gráfica que resume os quartis, a mediana e os valores extremos de um conjunto de dados. Facilita a visualização da dispersão, simetria e identificação de outliers.'
      },
      {
        id: 'outliers',
        titulo: 'Outliers (Valores Atípicos)',
        categoria: 'conceitos-basicos',
        conteudo:
          'Valores que se diferenciam drasticamente de todos os outros, desviando-se significativamente do padrão geral do conjunto de dados. Geralmente são identificados usando o critério de 1,5 × IQR abaixo de Q1 ou acima de Q3.'
      },
      {
        id: 'distribuicao-normal',
        titulo: 'Distribuição Normal',
        categoria: 'distribuicoes',
        conteudo:
          'Distribuição de probabilidade contínua simétrica em forma de sino, caracterizada completamente por sua média e desvio padrão. Muitos fenômenos naturais seguem aproximadamente esta distribuição.'
      },
      {
        id: 'intervalo-confianca',
        titulo: 'Intervalo de Confiança',
        categoria: 'inferencia',
        conteudo:
          'Intervalo estimado de um parâmetro estatístico, associado a um nível de confiança que indica a probabilidade de o intervalo conter o verdadeiro valor do parâmetro.'
      },
      {
        id: 'nivel-significancia',
        titulo: 'Nível de Significância',
        categoria: 'inferencia',
        conteudo:
          'Probabilidade de rejeitar a hipótese nula quando ela é verdadeira (erro tipo I). Geralmente representado por α e expressos em percentagem (por exemplo, 5% ou 1%).'
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
      { id: 'inferencia', nome: 'Inferência Estatística' }
    ]

    this.init()
  }

  init() {
    // Criar o contêiner do glossário
    this.criarComponenteGlossario()

    // Adicionar à página
    this.adicionarGlossarioNaPagina()

    // Configurar eventos
    this.configurarEventos()
  }

  criarComponenteGlossario() {
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
        <span class="glossary-item-category">${this.getNomeCategoria(
          item.categoria
        )}</span>
      </div>
    `
      )
      .join('')
  }

  getNomeCategoria(categoriaId) {
    const categoria = this.categorias.find(cat => cat.id === categoriaId)
    return categoria ? categoria.nome : categoriaId
  }

  filtrarTermos(termo) {
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
  }

  filtrarPorCategoria(categoria) {
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
  }
}