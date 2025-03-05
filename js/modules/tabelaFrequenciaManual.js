// tabelaFrequenciaManual.js - Módulo para criar tabela de frequência manualmente
import { appState } from '../app.js'
import {
  calcularMedia,
  calcularMediana,
  calcularModa
} from './medidasPosicao.js'

// Função para inicializar o módulo de tabela de frequência manual
export function initializeTabelaFrequenciaManual() {
  const tabelaManualContainer = document.getElementById(
    'tabelaFrequenciaManualContainer'
  )
  const adicionarLinhaBtn = document.getElementById(
    'adicionarLinhaTabelaManual'
  )
  const calcularTabelaManualBtn = document.getElementById(
    'calcularTabelaManual'
  )
  const limparTabelaManualBtn = document.getElementById('limparTabelaManual')

  // Inicializar a tabela com uma linha
  inicializarTabelaManual()

  // Evento para adicionar nova linha à tabela
  adicionarLinhaBtn.addEventListener('click', adicionarLinhaTabela)

  // Evento para calcular a tabela completa a partir dos dados inseridos
  calcularTabelaManualBtn.addEventListener('click', calcularTabelaCompleta)

  // Evento para limpar a tabela manual
  limparTabelaManualBtn.addEventListener('click', limparTabelaManual)
}

// Função para inicializar a tabela manual com uma linha
function inicializarTabelaManual() {
  const tabelaManualContainer = document.getElementById(
    'tabelaFrequenciaManualContainer'
  )

  // Criar a estrutura da tabela
  let tabelaHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover" id="tabelaFrequenciaManual">
        <thead>
          <tr>
            <th>Classe</th>
            <th>Ponto Médio</th>
            <th>h</th>
            <th>fi</th>
            <th>fri</th>
            <th>fri (%)</th>
            <th>Fi</th>
            <th>Fri</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tabelaManualBody">
          <!-- Linhas serão adicionadas aqui -->
        </tbody>
      </table>
    </div>
  `

  tabelaManualContainer.innerHTML = tabelaHTML

  // Adicionar primeira linha
  adicionarLinhaTabela()
}

// Função para adicionar nova linha à tabela
function adicionarLinhaTabela() {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const novaLinha = document.createElement('tr')
  const linhaIndex = tabelaBody.children.length

  novaLinha.innerHTML = `
    <td>
      <div class="input-group">
        <input type="number" step="any" class="form-control limite-inferior" placeholder="Limite inferior" data-row="${linhaIndex}">
        <span class="input-group-text">⊢</span>
        <input type="number" step="any" class="form-control limite-superior" placeholder="Limite superior" data-row="${linhaIndex}">
      </div>
    </td>
    <td><input type="number" step="any" class="form-control ponto-medio" placeholder="Ponto médio" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control h-classe" placeholder="h" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control frequencia" placeholder="fi" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control freq-relativa" placeholder="fri" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control freq-relativa-perc" placeholder="fri (%)" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control freq-acumulada" placeholder="Fi" data-row="${linhaIndex}"></td>
    <td><input type="number" step="any" class="form-control freq-relativa-acum" placeholder="Fri" data-row="${linhaIndex}"></td>
    <td>
    <button class="btn btn-danger btn-sm remover-linha" data-row="${linhaIndex}" aria-label="Remover linha">
      <i class="fas fa-trash"></i>
    </button>
    </td>
  `

  tabelaBody.appendChild(novaLinha)

  // Adicionar eventos para cálculo automático do ponto médio
  const limiteInferior = novaLinha.querySelector('.limite-inferior')
  const limiteSuperior = novaLinha.querySelector('.limite-superior')
  const pontoMedio = novaLinha.querySelector('.ponto-medio')

  // Cálculo automático do ponto médio quando os limites são alterados
  limiteInferior.addEventListener('input', () => {
    if (limiteInferior.value && limiteSuperior.value) {
      const li = parseFloat(limiteInferior.value)
      const ls = parseFloat(limiteSuperior.value)
      pontoMedio.value = ((li + ls) / 2).toFixed(2)
    }
  })

  limiteSuperior.addEventListener('input', () => {
    if (limiteInferior.value && limiteSuperior.value) {
      const li = parseFloat(limiteInferior.value)
      const ls = parseFloat(limiteSuperior.value)
      pontoMedio.value = ((li + ls) / 2).toFixed(2)
    }
  })

  // Adicionar evento para cálculo da largura da classe (h) se for a primeira linha
  if (linhaIndex === 0) {
    const hClasse = novaLinha.querySelector('.h-classe')
    limiteSuperior.addEventListener('input', () => {
      if (limiteInferior.value && limiteSuperior.value) {
        const li = parseFloat(limiteInferior.value)
        const ls = parseFloat(limiteSuperior.value)
        hClasse.value = (ls - li).toFixed(2)
      }
    })
  }

  // Adicionar evento para calcular frequência relativa quando a frequência absoluta muda
  const frequencia = novaLinha.querySelector('.frequencia')
  const freqRelativa = novaLinha.querySelector('.freq-relativa')
  const freqRelativaPerc = novaLinha.querySelector('.freq-relativa-perc')

  frequencia.addEventListener('input', () => {
    if (frequencia.value) {
      // Calcular soma das frequências para uso no cálculo de frequência relativa
      const totalFrequencia = calcularTotalFrequencia()
      if (totalFrequencia > 0) {
        const fi = parseFloat(frequencia.value)
        const fri = fi / totalFrequencia
        freqRelativa.value = fri.toFixed(4)
        freqRelativaPerc.value = (fri * 100).toFixed(2)
      }
    }
  })

  // Adicionar evento para calcular frequência relativa percentual quando a frequência relativa muda
  freqRelativa.addEventListener('input', () => {
    if (freqRelativa.value) {
      const fri = parseFloat(freqRelativa.value)
      freqRelativaPerc.value = (fri * 100).toFixed(2)
    }
  })

  // Adicionar evento para calcular frequência relativa quando a frequência relativa percentual muda
  freqRelativaPerc.addEventListener('input', () => {
    if (freqRelativaPerc.value) {
      const friPerc = parseFloat(freqRelativaPerc.value)
      freqRelativa.value = (friPerc / 100).toFixed(4)
    }
  })

  // Adicionar evento para remover linha
  const removerBtn = novaLinha.querySelector('.remover-linha')
  removerBtn.addEventListener('click', () => {
    if (tabelaBody.children.length > 1) {
      tabelaBody.removeChild(novaLinha)
      // Reindexar as linhas restantes
      atualizarIndicesLinhas()
    } else {
      alert('A tabela deve ter pelo menos uma linha.')
    }
  })
}

// Função auxiliar para calcular a soma das frequências absolutas
function calcularTotalFrequencia() {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')
  let totalFrequencia = 0

  linhas.forEach(linha => {
    const frequencia = linha.querySelector('.frequencia').value
    if (frequencia && !isNaN(parseFloat(frequencia))) {
      totalFrequencia += parseFloat(frequencia)
    }
  })

  return totalFrequencia
}

// Função para atualizar os índices das linhas após remoção
function atualizarIndicesLinhas() {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')

  linhas.forEach((linha, index) => {
    const inputs = linha.querySelectorAll('input')
    const removeBtn = linha.querySelector('.remover-linha')

    inputs.forEach(input => {
      input.setAttribute('data-row', index)
    })

    removeBtn.setAttribute('data-row', index)
  })
}

// Função para calcular a tabela completa a partir dos dados inseridos
function calcularTabelaCompleta() {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')

  // Verificar se os dados mínimos estão preenchidos
  let dadosPreenchidos = false
  let temFrequenciaOuFA = false
  let totalFrequencia = 0

  linhas.forEach(linha => {
    const limiteInferior = linha.querySelector('.limite-inferior').value
    const limiteSuperior = linha.querySelector('.limite-superior').value
    const frequencia = linha.querySelector('.frequencia').value
    const freqAcumulada = linha.querySelector('.freq-acumulada').value

    // Se tiver pelo menos os limites, ou a frequência, ou a frequência acumulada
    if ((limiteInferior && limiteSuperior) || frequencia || freqAcumulada) {
      dadosPreenchidos = true
    }

    // Verificar se temos frequência ou frequência acumulada
    if (frequencia || freqAcumulada) {
      temFrequenciaOuFA = true
    }

    // Calcular total de frequência se disponível
    if (frequencia && !isNaN(parseFloat(frequencia))) {
      totalFrequencia += parseFloat(frequencia)
    }
  })

  if (!dadosPreenchidos) {
    alert(
      'Por favor, preencha pelo menos os limites das classes ou as frequências.'
    )
    return
  }

  // Se temos frequência acumulada mas não frequência absoluta, tentar derivar as frequências
  if (temFrequenciaOuFA && totalFrequencia === 0) {
    derivarFrequenciasDeAcumuladas(linhas)
    totalFrequencia = calcularTotalFrequencia() // Recalcular após derivação
  }

  // Completar dados ausentes onde possível
  completarDados(totalFrequencia)

  // Limpar o conteúdo atual
  const tabelaManualResult = document.getElementById(
    'tabelaFrequenciaManualResult'
  )
  tabelaManualResult.innerHTML = ''

  // ALTERAÇÃO AQUI: Primeiro criamos a visualização da tabela final
  criarVisualizacaoTabela(totalFrequencia)

  // ALTERAÇÃO AQUI: Depois mostramos as estatísticas se tivermos frequências
  if (totalFrequencia > 0) {
    mostrarEstatisticasTabela(totalFrequencia)
  }
}

// Função para derivar frequências absolutas a partir de frequências acumuladas
function derivarFrequenciasDeAcumuladas(linhas) {
  let freqAcumuladaAnterior = 0

  // Percorrer linhas para derivar frequências absolutas de frequências acumuladas
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i]
    const freqAcumuladaInput = linha.querySelector('.freq-acumulada')
    const frequenciaInput = linha.querySelector('.frequencia')

    if (freqAcumuladaInput.value && !frequenciaInput.value) {
      const freqAcumuladaAtual = parseFloat(freqAcumuladaInput.value)
      // Calcular frequência absoluta como a diferença entre a frequência acumulada atual e a anterior
      const frequenciaAbsoluta = freqAcumuladaAtual - freqAcumuladaAnterior
      frequenciaInput.value = frequenciaAbsoluta
      freqAcumuladaAnterior = freqAcumuladaAtual
    } else if (frequenciaInput.value && !freqAcumuladaInput.value) {
      // Se temos frequência absoluta mas não acumulada, calculamos a acumulada
      const freqAbsoluta = parseFloat(frequenciaInput.value)
      const freqAcumulada = freqAcumuladaAnterior + freqAbsoluta
      freqAcumuladaInput.value = freqAcumulada
      freqAcumuladaAnterior = freqAcumulada
    } else if (frequenciaInput.value && freqAcumuladaInput.value) {
      // Se ambos estão preenchidos, use o valor de frequência acumulada para o próximo cálculo
      freqAcumuladaAnterior = parseFloat(freqAcumuladaInput.value)
    }
  }
}

// Função para completar dados faltantes na tabela onde for possível
function completarDados(totalFrequencia) {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')

  // Primeira passagem: Calcular dados que dependem apenas dos valores de entrada
  linhas.forEach((linha, index) => {
    const limiteInferior = linha.querySelector('.limite-inferior')
    const limiteSuperior = linha.querySelector('.limite-superior')
    const pontoMedio = linha.querySelector('.ponto-medio')
    const hClasse = linha.querySelector('.h-classe')

    // Calcular ponto médio se estiver vazio mas tiver limites
    if (!pontoMedio.value && limiteInferior.value && limiteSuperior.value) {
      const li = parseFloat(limiteInferior.value)
      const ls = parseFloat(limiteSuperior.value)
      pontoMedio.value = ((li + ls) / 2).toFixed(2)
    }

    // Calcular h se estiver vazio mas tiver limites
    if (!hClasse.value && limiteInferior.value && limiteSuperior.value) {
      const li = parseFloat(limiteInferior.value)
      const ls = parseFloat(limiteSuperior.value)
      hClasse.value = (ls - li).toFixed(2)
    }

    // Tentar obter h da primeira linha para usar nas outras linhas
    if (index === 0 && hClasse.value) {
      const h = parseFloat(hClasse.value)

      // Se temos h e limite inferior, calcular o limite superior para todas as linhas
      linhas.forEach((outralinha, idx) => {
        const outroLimiteInferior = outralinha.querySelector('.limite-inferior')
        const outroLimiteSuperior = outralinha.querySelector('.limite-superior')
        const outroHClasse = outralinha.querySelector('.h-classe')

        if (outroLimiteInferior.value && !outroLimiteSuperior.value) {
          const li = parseFloat(outroLimiteInferior.value)
          outroLimiteSuperior.value = (li + h).toFixed(2)
        } else if (
          !outroLimiteInferior.value &&
          outroLimiteSuperior.value &&
          idx > 0
        ) {
          // Se temos o limite superior, podemos calcular o inferior baseado na linha anterior
          const lsAnterior = parseFloat(
            linhas[idx - 1].querySelector('.limite-superior').value
          )
          outroLimiteInferior.value = lsAnterior.toFixed(2)
        }

        if (!outroHClasse.value) {
          outroHClasse.value = h.toFixed(2)
        }
      })
    }
  })

  // Verificar se podemos preencher limites consecutivamente
  for (let i = 1; i < linhas.length; i++) {
    const linhaAnterior = linhas[i - 1]
    const linha = linhas[i]

    const limiteSuperiorAnterior =
      linhaAnterior.querySelector('.limite-superior')
    const limiteInferior = linha.querySelector('.limite-inferior')

    if (limiteSuperiorAnterior.value && !limiteInferior.value) {
      limiteInferior.value = limiteSuperiorAnterior.value
    }
  }

  // Segunda passagem: Calcular frequências relativas e acumuladas se tivermos o total de frequência
  if (totalFrequencia > 0) {
    let freqAcumulada = 0

    linhas.forEach(linha => {
      const frequencia = linha.querySelector('.frequencia')
      const freqRelativa = linha.querySelector('.freq-relativa')
      const freqRelativaPerc = linha.querySelector('.freq-relativa-perc')
      const freqAcum = linha.querySelector('.freq-acumulada')
      const freqRelAcum = linha.querySelector('.freq-relativa-acum')

      // Se tiver frequência absoluta mas não tiver frequência relativa
      if (frequencia.value && !freqRelativa.value) {
        const fi = parseFloat(frequencia.value)
        const fri = fi / totalFrequencia
        freqRelativa.value = fri.toFixed(4)
      }

      // Se tiver frequência relativa mas não tiver frequência relativa percentual
      if (freqRelativa.value && !freqRelativaPerc.value) {
        const fri = parseFloat(freqRelativa.value)
        freqRelativaPerc.value = (fri * 100).toFixed(2)
      }

      // Se tiver frequência absoluta, calcular frequência acumulada
      if (frequencia.value) {
        freqAcumulada += parseFloat(frequencia.value)
        if (!freqAcum.value) {
          freqAcum.value = freqAcumulada
        }
      }

      // Se tiver frequência acumulada mas não tiver frequência relativa acumulada
      if (freqAcum.value && !freqRelAcum.value) {
        const Fi = parseFloat(freqAcum.value)
        freqRelAcum.value = (Fi / totalFrequencia).toFixed(4)
      }

      // Se tiver frequência relativa acumulada mas não frequência acumulada e temos total
      if (freqRelAcum.value && !freqAcum.value && totalFrequencia > 0) {
        const Fri = parseFloat(freqRelAcum.value)
        freqAcum.value = Math.round(Fri * totalFrequencia)
      }
    })
  }
}

// Função para criar a visualização final da tabela
function criarVisualizacaoTabela(totalFrequencia) {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')
  const tabelaManualResult = document.getElementById(
    'tabelaFrequenciaManualResult'
  )

  // Obter largura da classe (h) do primeiro input se disponível
  let h = 0
  if (linhas.length > 0 && linhas[0].querySelector('.h-classe').value) {
    h = parseFloat(linhas[0].querySelector('.h-classe').value)
  }

  // Criar tabela de visualização
  let tabelaVisualizacaoHTML = `
    <div class="table-responsive">
      <h4>Tabela de Frequência Final:</h4>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Classe</th>
            <th>Ponto Médio</th>
            <th>h</th>
            <th>fi</th>
            <th>fri</th>
            <th>fri (%)</th>
            <th>Fi</th>
            <th>Fri</th>
          </tr>
        </thead>
        <tbody>
  `

  linhas.forEach(linha => {
    // Obter valores dos inputs ou usar '-' se não estiverem preenchidos
    const limiteInferior = linha.querySelector('.limite-inferior').value
      ? parseFloat(linha.querySelector('.limite-inferior').value).toFixed(2)
      : '-'

    const limiteSuperior = linha.querySelector('.limite-superior').value
      ? parseFloat(linha.querySelector('.limite-superior').value).toFixed(2)
      : '-'

    const pontoMedio = linha.querySelector('.ponto-medio').value
      ? parseFloat(linha.querySelector('.ponto-medio').value).toFixed(2)
      : '-'

    const frequencia = linha.querySelector('.frequencia').value
      ? parseInt(linha.querySelector('.frequencia').value)
      : '-'

    const freqRelativa = linha.querySelector('.freq-relativa').value
      ? parseFloat(linha.querySelector('.freq-relativa').value).toFixed(4)
      : '-'

    const freqRelativaPerc = linha.querySelector('.freq-relativa-perc').value
      ? parseFloat(linha.querySelector('.freq-relativa-perc').value).toFixed(
          2
        ) + '%'
      : '-'

    const freqAcumulada = linha.querySelector('.freq-acumulada').value
      ? parseInt(linha.querySelector('.freq-acumulada').value)
      : '-'

    const freqRelativaAcum = linha.querySelector('.freq-relativa-acum').value
      ? parseFloat(linha.querySelector('.freq-relativa-acum').value).toFixed(4)
      : '-'

    const hValor = h ? h.toFixed(2) : '-'

    tabelaVisualizacaoHTML += `
      <tr>
        <td>${
          limiteInferior === '-' || limiteSuperior === '-'
            ? '-'
            : `${limiteInferior} ⊢ ${limiteSuperior}`
        }</td>
        <td>${pontoMedio}</td>
        <td>${hValor}</td>
        <td>${frequencia}</td>
        <td>${freqRelativa}</td>
        <td>${freqRelativaPerc}</td>
        <td>${freqAcumulada}</td>
        <td>${freqRelativaAcum}</td>
      </tr>
    `
  })

  // Adicionar linha de total se tivermos frequências
  if (totalFrequencia > 0) {
    tabelaVisualizacaoHTML += `
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>-</th>
              <th>-</th>
              <th>${totalFrequencia}</th>
              <th>1.0000</th>
              <th>100.00%</th>
              <th>-</th>
              <th>-</th>
            </tr>
          </tfoot>
        </table>
      </div>
    `
  } else {
    tabelaVisualizacaoHTML += `
          </tbody>
        </table>
      </div>
    `
  }

  // Adicionar a tabela de visualização
  tabelaManualResult.innerHTML = tabelaVisualizacaoHTML
}

// Função para mostrar estatísticas da tabela
function mostrarEstatisticasTabela(totalFrequencia) {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const linhas = tabelaBody.querySelectorAll('tr')
  const tabelaManualResult = document.getElementById(
    'tabelaFrequenciaManualResult'
  )

  // Coletar dados para cálculos
  const dados = []
  let amplitudeTotal = 0
  let h = 0

  // Extrair limites para calcular amplitude total
  if (linhas.length > 0) {
    const primeiraLinha = linhas[0]
    const ultimaLinha = linhas[linhas.length - 1]

    if (
      primeiraLinha.querySelector('.limite-inferior').value &&
      ultimaLinha.querySelector('.limite-superior').value
    ) {
      const limiteInferiorPrimeiro = parseFloat(
        primeiraLinha.querySelector('.limite-inferior').value
      )
      const limiteSuperiorUltimo = parseFloat(
        ultimaLinha.querySelector('.limite-superior').value
      )

      amplitudeTotal = limiteSuperiorUltimo - limiteInferiorPrimeiro
    }

    // Obter h (largura da classe) do primeiro input se disponível
    if (primeiraLinha.querySelector('.h-classe').value) {
      h = parseFloat(primeiraLinha.querySelector('.h-classe').value)
    }
  }

  // Extrair valores expandidos baseados na frequência para calcular estatísticas
  let dadosValidos = false

  linhas.forEach(linha => {
    const pontoMedioInput = linha.querySelector('.ponto-medio')
    const frequenciaInput = linha.querySelector('.frequencia')

    if (pontoMedioInput.value && frequenciaInput.value) {
      const pontoMedio = parseFloat(pontoMedioInput.value)
      const frequencia = parseInt(frequenciaInput.value)

      // Adicionar o ponto médio 'frequencia' vezes ao array de dados
      for (let i = 0; i < frequencia; i++) {
        dados.push(pontoMedio)
      }

      dadosValidos = true
    }
  })

  // Se não tivermos dados suficientes para estatísticas, retornar
  if (!dadosValidos) {
    return
  }

  // Calcular estatísticas usando as funções existentes
  const media = calcularMedia(dados)
  const mediana = calcularMediana(dados)
  const moda = calcularModa(dados)

  // Criar e exibir as estatísticas
  let estatisticasHTML = `
    <div class="tabela-stats mt-4">
      <h4>Estatísticas da Tabela:</h4>
      <div class="stats-container">
        <!-- Legenda à esquerda -->
        <div class="stats-card">
          <h4>Legenda:</h4>
          <ul>
            <li><strong>h:</strong> Largura da classe (h = Amplitude Total / Número de Classes).</li>
            <li><strong>fi:</strong> Frequência absoluta (número de observações na classe).</li>
            <li><strong>fri:</strong> Frequência relativa (fi / Total de Observações).</li>
            <li><strong>fri (%):</strong> Frequência relativa em porcentagem (fri * 100).</li>
            <li><strong>Fi:</strong> Frequência acumulada (soma das frequências até a classe atual).</li>
            <li><strong>Fri:</strong> Frequência relativa acumulada (Fi / Total de Observações).</li>
          </ul>
        </div>
        <!-- Estatísticas à direita -->
        <div class="stats-card">
          <p><strong>Número de classes:</strong> ${linhas.length}</p>
          <p><strong>Amplitude total:</strong> ${amplitudeTotal.toFixed(2)}</p>
          <p><strong>Largura das classes (h):</strong> ${h.toFixed(2)}</p>
          <p><strong>Média:</strong> ${media.toFixed(2)}</p>
          <p><strong>Mediana:</strong> ${mediana.toFixed(2)}</p>
          <p><strong>Moda:</strong> ${
            Array.isArray(moda) ? moda.join(', ') : moda
          }</p>
        </div>
      </div>
    </div>
  `

  // Adicionar as estatísticas abaixo da tabela de visualização
  tabelaManualResult.innerHTML += estatisticasHTML
}

// Função para limpar a tabela manual
function limparTabelaManual() {
  const tabelaBody = document.getElementById('tabelaManualBody')
  const tabelaManualResult = document.getElementById(
    'tabelaFrequenciaManualResult'
  )

  // Limpar todas as linhas existentes
  tabelaBody.innerHTML = ''

  // Limpar resultados
  tabelaManualResult.innerHTML = ''

  // Adicionar uma nova linha vazia
  adicionarLinhaTabela()

  // Limpar o estado da aplicação (se necessário)
  appState.currentData = []
  appState.isCalculated = false
}
