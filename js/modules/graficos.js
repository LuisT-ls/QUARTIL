// graficos.js
import Chart from 'chart.js/auto'

// graficos.js
export function renderizarHistograma(ctx, dados) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dados.labels,
      datasets: [
        {
          label: 'Frequência',
          data: dados.valores,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

export function renderizarBoxplot(ctx, dados) {
  new Chart(ctx, {
    type: 'boxplot',
    data: {
      labels: ['Boxplot'],
      datasets: [
        {
          label: 'Distribuição',
          data: [dados],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}
