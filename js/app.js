// app.js
import { calcularRol } from './modules/rol.js'
import {
  calcularMedia,
  calcularMediana,
  calcularModa
} from './modules/medidasPosicao.js'
import {
  calcularDesvioPadrao,
  calcularVariancia,
  calcularCoeficienteVariacao
} from './modules/medidasDispersao.js'
import {
  calcularQ1,
  calcularQ2,
  calcularQ3,
  calcularIQR
} from './modules/quartis.js'
import { calcularTabelaFrequencia } from './modules/tabelaFrequencia.js'
import { renderizarHistograma, renderizarBoxplot } from './modules/graficos.js'

const darkModeToggle = document.querySelector('.dark-mode-toggle')
const darkModeIcon = document.getElementById('darkModeIcon')

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode')
  if (document.body.classList.contains('dark-mode')) {
    darkModeIcon.classList.remove('fa-moon')
    darkModeIcon.classList.add('fa-sun')
  } else {
    darkModeIcon.classList.remove('fa-sun')
    darkModeIcon.classList.add('fa-moon')
  }
})

// Popup de Exportação
const exportPopup = document.getElementById('exportPopup')
const exportRolButton = document.getElementById('exportarRol')
const closePopup = document.querySelector('.close-popup')

exportRolButton.addEventListener('click', () => {
  exportPopup.style.display = 'flex'
})

closePopup.addEventListener('click', () => {
  exportPopup.style.display = 'none'
})

// Fechar popup ao clicar fora dele
window.addEventListener('click', event => {
  if (event.target === exportPopup) {
    exportPopup.style.display = 'none'
  }
})

// Função para converter entrada de texto em array de números
function parseInput(input) {
  return input
    .split(',')
    .map(Number)
    .filter(num => !isNaN(num))
}

// Rol
document.getElementById('calcularRol').addEventListener('click', () => {
  const input = document.getElementById('rolInput').value
  const numeros = parseInput(input)
  const rol = calcularRol(numeros)
  document.getElementById('rolResult').textContent = `Rol: ${rol.join(', ')}`
})

// Medidas de Posição
document.getElementById('calcularRol').addEventListener('click', () => {
  const input = document.getElementById('rolInput').value
  const numeros = parseInput(input)
  document.getElementById('mediaResult').textContent = `Média: ${calcularMedia(
    numeros
  ).toFixed(2)}`
  document.getElementById(
    'medianaResult'
  ).textContent = `Mediana: ${calcularMediana(numeros).toFixed(2)}`
  document.getElementById('modaResult').textContent = `Moda: ${calcularModa(
    numeros
  )}`
})

// Medidas de Dispersão
document.getElementById('calcularRol').addEventListener('click', () => {
  const input = document.getElementById('rolInput').value
  const numeros = parseInput(input)
  document.getElementById(
    'desvioPadraoResult'
  ).textContent = `Desvio Padrão: ${calcularDesvioPadrao(numeros).toFixed(2)}`
  document.getElementById(
    'varianciaResult'
  ).textContent = `Variância: ${calcularVariancia(numeros).toFixed(2)}`
  document.getElementById(
    'cvResult'
  ).textContent = `Coeficiente de Variação: ${calcularCoeficienteVariacao(
    numeros
  ).toFixed(2)}%`
})

// Quartis
document.getElementById('calcularRol').addEventListener('click', () => {
  const input = document.getElementById('rolInput').value
  const numeros = parseInput(input)
  document.getElementById('q1Result').textContent = `Q1: ${calcularQ1(
    numeros
  ).toFixed(2)}`
  document.getElementById('q2Result').textContent = `Q2: ${calcularQ2(
    numeros
  ).toFixed(2)}`
  document.getElementById('q3Result').textContent = `Q3: ${calcularQ3(
    numeros
  ).toFixed(2)}`
})

// Tabela de Frequência
document
  .getElementById('calcularTabelaFrequencia')
  .addEventListener('click', () => {
    const input = document.getElementById('tabelaFrequenciaInput').value
    const numeros = parseInput(input)
    const tabela = calcularTabelaFrequencia(numeros)
    const tabelaHTML = tabela
      .map(item => `<tr><td>${item.valor}</td><td>${item.frequencia}</td></tr>`)
      .join('')
    document.getElementById(
      'tabelaFrequenciaResult'
    ).innerHTML = `<table class="table"><thead><tr><th>Valor</th><th>Frequência</th></tr></thead><tbody>${tabelaHTML}</tbody></table>`
  })

// Gráficos
document.getElementById('calcularRol').addEventListener('click', () => {
  const input = document.getElementById('rolInput').value
  const numeros = parseInput(input)
  const ctxHistograma = document
    .getElementById('histogramaChart')
    .getContext('2d')
  const ctxBoxplot = document.getElementById('boxplotChart').getContext('2d')
  renderizarHistograma(ctxHistograma, {
    labels: numeros.map((_, i) => `Classe ${i + 1}`),
    valores: numeros
  })
  renderizarBoxplot(ctxBoxplot, numeros)
})
