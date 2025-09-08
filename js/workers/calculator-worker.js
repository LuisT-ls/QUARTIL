// calculator-worker.js - Web Worker para cálculos estatísticos pesados
// Este worker processa cálculos complexos sem bloquear a UI

// Função para calcular média
function calcularMedia(array) {
  if (!array || array.length === 0) return 0
  return array.reduce((sum, value) => sum + value, 0) / array.length
}

// Função para calcular mediana
function calcularMediana(array) {
  if (!array || array.length === 0) return 0
  const ordenado = [...array].sort((a, b) => a - b)
  const meio = Math.floor(ordenado.length / 2)
  
  if (ordenado.length % 2 === 0) {
    return (ordenado[meio - 1] + ordenado[meio]) / 2
  } else {
    return ordenado[meio]
  }
}

// Função para calcular quartil
function calcularQuartil(array, percentil) {
  if (!array || array.length === 0) return 0
  const ordenado = [...array].sort((a, b) => a - b)
  const posicao = percentil * (ordenado.length - 1)
  const base = Math.floor(posicao)
  const resto = posicao - base

  if (ordenado[base + 1] !== undefined) {
    return ordenado[base] + resto * (ordenado[base + 1] - ordenado[base])
  } else {
    return ordenado[base]
  }
}

// Função para calcular variância
function calcularVariancia(array, media = null) {
  if (!array || array.length === 0) return 0
  if (media === null) media = calcularMedia(array)
  
  const somaDosQuadradosDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow(val - media, 2)
  }, 0)
  
  return somaDosQuadradosDasDiferencas / array.length
}

// Função para calcular desvio padrão
function calcularDesvioPadrao(array, media = null) {
  return Math.sqrt(calcularVariancia(array, media))
}

// Função para calcular moda
function calcularModa(array) {
  if (!array || array.length === 0) return 0
  
  const contagem = {}
  let maxFreq = 0
  let moda = []

  array.forEach(num => {
    contagem[num] = (contagem[num] || 0) + 1
    if (contagem[num] > maxFreq) {
      maxFreq = contagem[num]
      moda = [num]
    } else if (contagem[num] === maxFreq) {
      moda.push(num)
    }
  })

  if (moda.length === Object.keys(contagem).length) {
    return 'Não há moda'
  }

  return moda.length === 1 ? moda[0] : moda
}

// Função para calcular assimetria
function calcularAssimetria(array, media = null, desvioPadrao = null) {
  if (!array || array.length === 0) return 0
  if (media === null) media = calcularMedia(array)
  if (desvioPadrao === null) desvioPadrao = calcularDesvioPadrao(array, media)
  
  const n = array.length
  const somaCubosDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow((val - media) / desvioPadrao, 3)
  }, 0)
  
  return (n / ((n - 1) * (n - 2))) * somaCubosDasDiferencas
}

// Função para calcular curtose
function calcularCurtose(array, media = null, desvioPadrao = null) {
  if (!array || array.length === 0) return 0
  if (media === null) media = calcularMedia(array)
  if (desvioPadrao === null) desvioPadrao = calcularDesvioPadrao(array, media)
  
  const n = array.length
  const somaQuartasPotenciaDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow((val - media) / desvioPadrao, 4)
  }, 0)
  
  const curtose = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * somaQuartasPotenciaDasDiferencas
  return curtose - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
}

// Função para calcular outliers
function calcularOutliers(array) {
  if (!array || array.length === 0) return { inferior: [], superior: [] }
  
  const q1 = calcularQuartil(array, 0.25)
  const q3 = calcularQuartil(array, 0.75)
  const iqr = q3 - q1
  
  const limiteInferior = q1 - 1.5 * iqr
  const limiteSuperior = q3 + 1.5 * iqr
  
  const outliersInferiores = array.filter(val => val < limiteInferior)
  const outliersSuperiores = array.filter(val => val > limiteSuperior)
  
  return {
    inferior: outliersInferiores,
    superior: outliersSuperiores,
    limiteInferior,
    limiteSuperior
  }
}

// Função para gerar histograma
function gerarHistograma(data, numClasses = null) {
  if (!data || data.length === 0) return { classes: [], frequencias: [] }
  
  if (numClasses === null) {
    numClasses = Math.ceil(1 + 3.322 * Math.log10(data.length))
  }
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const amplitude = max - min
  const larguraClasse = amplitude / numClasses
  
  const classes = []
  const frequencias = []
  
  for (let i = 0; i < numClasses; i++) {
    const limiteInferior = min + i * larguraClasse
    const limiteSuperior = min + (i + 1) * larguraClasse
    
    classes.push({
      limiteInferior,
      limiteSuperior,
      label: `${limiteInferior.toFixed(1)} - ${limiteSuperior.toFixed(1)}`
    })
    
    frequencias.push(0)
  }
  
  // Contar frequência em cada classe
  data.forEach(valor => {
    for (let i = 0; i < classes.length; i++) {
      if (valor >= classes[i].limiteInferior && 
          (valor < classes[i].limiteSuperior || 
           (i === classes.length - 1 && valor <= classes[i].limiteSuperior))) {
        frequencias[i]++
        break
      }
    }
  })
  
  return { classes, frequencias }
}

// Função principal para processar cálculos
function processarCalculos(data, tipoCalculo) {
  const startTime = performance.now()
  
  try {
    let resultado = {}
    
    switch (tipoCalculo) {
      case 'estatisticas_completas':
        const media = calcularMedia(data)
        const mediana = calcularMediana(data)
        const moda = calcularModa(data)
        const variancia = calcularVariancia(data, media)
        const desvioPadrao = Math.sqrt(variancia)
        const cv = (desvioPadrao / media) * 100
        const q1 = calcularQuartil(data, 0.25)
        const q2 = mediana
        const q3 = calcularQuartil(data, 0.75)
        const iqr = q3 - q1
        const assimetria = calcularAssimetria(data, media, desvioPadrao)
        const curtose = calcularCurtose(data, media, desvioPadrao)
        const outliers = calcularOutliers(data)
        
        resultado = {
          media,
          mediana,
          moda,
          variancia,
          desvioPadrao,
          cv,
          q1,
          q2,
          q3,
          iqr,
          assimetria,
          curtose,
          outliers,
          min: Math.min(...data),
          max: Math.max(...data),
          amplitude: Math.max(...data) - Math.min(...data)
        }
        break
        
      case 'histograma':
        resultado = gerarHistograma(data)
        break
        
      case 'quartis':
        resultado = {
          q1: calcularQuartil(data, 0.25),
          q2: calcularMediana(data),
          q3: calcularQuartil(data, 0.75),
          iqr: calcularQuartil(data, 0.75) - calcularQuartil(data, 0.25),
          outliers: calcularOutliers(data)
        }
        break
        
      default:
        throw new Error(`Tipo de cálculo não suportado: ${tipoCalculo}`)
    }
    
    const endTime = performance.now()
    const tempoProcessamento = endTime - startTime
    
    return {
      sucesso: true,
      resultado,
      tempoProcessamento,
      timestamp: Date.now()
    }
    
  } catch (error) {
    return {
      sucesso: false,
      erro: error.message,
      timestamp: Date.now()
    }
  }
}

// Listener para mensagens do thread principal
self.addEventListener('message', function(e) {
  const { data, tipoCalculo, id } = e.data
  
  const resultado = processarCalculos(data, tipoCalculo)
  
  // Enviar resultado de volta para o thread principal
  self.postMessage({
    id,
    ...resultado
  })
})

// Informar que o worker está pronto
self.postMessage({ tipo: 'worker_ready' })
