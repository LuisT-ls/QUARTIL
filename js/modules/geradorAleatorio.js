// Importar os módulos necessários
import { processarRol } from './rol.js'

// Selecionar elementos do DOM
const gerarDadosBtn = document.getElementById('gerarDados')
const randomPopup = document.getElementById('randomPopup')
const closeRandomPopup = randomPopup.querySelector('.close-popup')
const confirmarGeracaoBtn = document.getElementById('confirmarGeracao')
const quantidadeNumerosInput = document.getElementById('quantidadeNumeros')
const valorMinimoInput = document.getElementById('valorMinimo')
const valorMaximoInput = document.getElementById('valorMaximo')
const numerosInteirosCheck = document.getElementById('numerosInteiros')
const rolInput = document.getElementById('rolInput')

// Função para gerar números aleatórios
function gerarNumerosAleatorios(quantidade, min, max, apenasInteiros) {
  const numeros = []

  for (let i = 0; i < quantidade; i++) {
    let numero
    if (apenasInteiros) {
      // Gerar número inteiro aleatório entre min e max (inclusive)
      numero = Math.floor(Math.random() * (max - min + 1)) + min
    } else {
      // Gerar número decimal aleatório entre min e max
      numero = Math.random() * (max - min) + min
      // Arredondar para 2 casas decimais
      numero = Math.round(numero * 100) / 100
    }
    numeros.push(numero)
  }

  return numeros
}

// Função para formatar os números gerados como uma string (separados por vírgula)
function formatarNumeros(numeros) {
  return numeros.join(', ')
}

// Evento para abrir o popup de geração aleatória
function abrirPopupAleatorio() {
  randomPopup.style.display = 'flex'
}

// Evento para fechar o popup
function fecharPopupAleatorio() {
  randomPopup.style.display = 'none'
}

// Evento para confirmar a geração dos números
function confirmarGeracao() {
  // Obter os valores dos inputs
  const quantidade = parseInt(quantidadeNumerosInput.value)
  const min = parseFloat(valorMinimoInput.value)
  const max = parseFloat(valorMaximoInput.value)
  const apenasInteiros = numerosInteirosCheck.checked

  // Validar os valores
  if (isNaN(quantidade) || isNaN(min) || isNaN(max)) {
    alert('Por favor, preencha todos os campos com valores numéricos.')
    return
  }

  if (quantidade < 5 || quantidade > 100) {
    alert('A quantidade de números deve estar entre 5 e 100.')
    return
  }

  if (min >= max) {
    alert('O valor mínimo deve ser menor que o valor máximo.')
    return
  }

  // Gerar os números aleatórios
  const numerosAleatorios = gerarNumerosAleatorios(
    quantidade,
    min,
    max,
    apenasInteiros
  )

  // Formatar os números
  const numerosFormatados = formatarNumeros(numerosAleatorios)

  // Preencher o input com os números gerados
  rolInput.value = numerosFormatados

  // Fechar o popup
  fecharPopupAleatorio()

  // Calcular automaticamente os resultados
  processarRol()
}

// Exportar a função de inicialização
export function inicializarGeradorAleatorio() {
  // Adicionar eventos aos elementos
  gerarDadosBtn.addEventListener('click', abrirPopupAleatorio)
  closeRandomPopup.addEventListener('click', fecharPopupAleatorio)
  confirmarGeracaoBtn.addEventListener('click', confirmarGeracao)

  // Fechar popup ao clicar fora dele
  window.addEventListener('click', event => {
    if (event.target === randomPopup) {
      fecharPopupAleatorio()
    }
  })
}
