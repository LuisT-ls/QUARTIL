/**
 * accessibility.js - Módulo para implementar melhorias de acessibilidade
 *
 * Este módulo adiciona:
 * 1. Atributos ARIA para melhorar a acessibilidade para leitores de tela
 * 2. Gerenciamento de foco e navegação por teclado
 * 3. Anúncios de atualizações dinâmicas para leitores de tela
 */

// Função para adicionar atributos ARIA aos elementos da interface
function addAriaAttributes() {
  // ARIA para seções principais
  document.querySelectorAll('section').forEach((section, index) => {
    const heading = section.querySelector('h2, h3')
    if (heading) {
      const headingId = `section-heading-${index}`
      heading.id = headingId
      section.setAttribute('aria-labelledby', headingId)
    }
    section.setAttribute('role', 'region')
  })

  // ARIA para campos de entrada
  document.querySelectorAll('input').forEach(input => {
    const label = input.previousElementSibling
    if (label && label.tagName === 'LABEL') {
      const labelId = `label-${input.id}`
      label.id = labelId
      input.setAttribute('aria-labelledby', labelId)
    }

    // Para inputs sem label explícito
    if (
      !input.hasAttribute('aria-label') &&
      !input.hasAttribute('aria-labelledby')
    ) {
      input.setAttribute('aria-label', input.placeholder || 'Campo de entrada')
    }
  })

  // ARIA para botões
  document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      // Extrair texto do botão (incluindo texto de ícones)
      const buttonText = button.textContent.trim()
      if (buttonText) {
        button.setAttribute('aria-label', buttonText)
      } else {
        // Para botões apenas com ícones
        const iconElement = button.querySelector('i.fas, i.fab')
        if (iconElement) {
          const iconClass = Array.from(iconElement.classList).find(cls =>
            cls.startsWith('fa-')
          )
          if (iconClass) {
            const iconName = iconClass.replace('fa-', '')
            button.setAttribute('aria-label', `Botão ${iconName}`)
          }
        }
      }
    }
  })

  // ARIA para gráficos
  const charts = document.querySelectorAll('#histogramaChart, #boxplotChart')
  charts.forEach(chart => {
    const chartTitle = chart.closest('div').querySelector('h3').textContent
    chart.setAttribute('role', 'img')
    chart.setAttribute('aria-label', `Gráfico: ${chartTitle}`)
  })

  // ARIA para popups
  document.querySelectorAll('.popup').forEach(popup => {
    popup.setAttribute('role', 'dialog')
    popup.setAttribute('aria-modal', 'true')
    const popupTitle = popup.querySelector('h3').textContent
    popup.setAttribute(
      'aria-labelledby',
      `popup-title-${popupTitle.replace(/\s+/g, '-').toLowerCase()}`
    )
    popup.querySelector('h3').id = `popup-title-${popupTitle
      .replace(/\s+/g, '-')
      .toLowerCase()}`
  })

  // ARIA para tabelas
  document.querySelectorAll('table').forEach((table, index) => {
    table.setAttribute('role', 'table')
    const caption = table.querySelector('caption')
    if (!caption) {
      const newCaption = document.createElement('caption')
      newCaption.textContent = `Tabela de dados ${index + 1}`
      newCaption.classList.add('sr-only') // Visível apenas para leitores de tela
      table.prepend(newCaption)
    }

    // Cabeçalhos de tabela
    const headerCells = table.querySelectorAll('th')
    headerCells.forEach(cell => {
      cell.setAttribute('scope', 'col')
    })
  })

  // Criar área para anúncios para leitores de tela
  if (!document.getElementById('aria-live-region')) {
    const liveRegion = document.createElement('div')
    liveRegion.id = 'aria-live-region'
    liveRegion.className = 'sr-only'
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('role', 'status')
    document.body.appendChild(liveRegion)
  }
}

// Função para melhorar a navegação por teclado
function enhanceKeyboardNavigation() {
  // Adicionar skiptomenu - link para pular para o conteúdo principal
  if (!document.getElementById('skip-to-content')) {
    const skipLink = document.createElement('a')
    skipLink.href = '#rolInput'
    skipLink.id = 'skip-to-content'
    skipLink.classList.add('skip-link')
    skipLink.textContent = 'Pular para o conteúdo principal'
    document.body.prepend(skipLink)

    // Adicionar CSS para o skiplink
    const skipLinkStyle = document.createElement('style')
    skipLinkStyle.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #007bff;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.2s;
      }
      .skip-link:focus {
        top: 0;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `
    document.head.appendChild(skipLinkStyle)
  }

  // Melhorar navegação em tabelas
  document.querySelectorAll('table').forEach(table => {
    const cells = table.querySelectorAll('td, th')
    cells.forEach((cell, index) => {
      cell.setAttribute('tabindex', '0')

      // Navegação com setas nas células da tabela
      cell.addEventListener('keydown', e => {
        const rowCells = Array.from(cell.parentElement.children)
        const rowIndex = Array.from(
          cell.parentElement.parentElement.children
        ).indexOf(cell.parentElement)
        const colIndex = rowCells.indexOf(cell)

        switch (e.key) {
          case 'ArrowRight':
            if (colIndex < rowCells.length - 1) rowCells[colIndex + 1].focus()
            break
          case 'ArrowLeft':
            if (colIndex > 0) rowCells[colIndex - 1].focus()
            break
          case 'ArrowDown':
            const nextRow = cell.parentElement.nextElementSibling
            if (nextRow) {
              const nextRowCells = Array.from(nextRow.children)
              if (nextRowCells[colIndex]) nextRowCells[colIndex].focus()
            }
            break
          case 'ArrowUp':
            const prevRow = cell.parentElement.previousElementSibling
            if (prevRow) {
              const prevRowCells = Array.from(prevRow.children)
              if (prevRowCells[colIndex]) prevRowCells[colIndex].focus()
            }
            break
        }
      })
    })
  })

  // Foco em popups
  document.querySelectorAll('.popup').forEach(popup => {
    const closeButton = popup.querySelector('.close-popup')
    const focusableElements = popup.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    // Capturar foco dentro do modal
    popup.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closePopup(popup)
      }

      if (e.key === 'Tab') {
        // Shift + Tab pressiona
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            e.preventDefault()
          }
          // Tab pressionado
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    })
  })
}

// Função para anunciar atualizações dinâmicas para leitores de tela
function announceToScreenReaders(message) {
  const liveRegion = document.getElementById('aria-live-region')
  if (liveRegion) {
    liveRegion.textContent = message
  }
}

// Sobrescrever funções de exibição de resultados para anunciar para leitores de tela
function enhanceResultAnnouncements() {
  // Buscar módulos que mostram resultados
  const originalFunctions = {}

  // Função para substituir as funções de exibição de resultados
  function wrapDisplayFunction(module, functionName) {
    if (window[module] && typeof window[module][functionName] === 'function') {
      originalFunctions[`${module}.${functionName}`] =
        window[module][functionName]

      window[module][functionName] = function (...args) {
        const result = originalFunctions[`${module}.${functionName}`].apply(
          this,
          args
        )

        // Anunciar resultado para leitores de tela
        if (result && typeof result === 'string') {
          announceToScreenReaders(`Resultado calculado: ${result}`)
        } else {
          announceToScreenReaders('Cálculo concluído')
        }

        return result
      }
    }
  }

  // Melhorar acessibilidade para botões de cálculo
  document.querySelectorAll('button[id^="calcular"]').forEach(button => {
    button.addEventListener('click', () => {
      announceToScreenReaders('Calculando...')
      // O anúncio do resultado será feito pela função de exibição envolvida
    })
  })
}

// Inicializar melhorias de acessibilidade
export function initializeAccessibility() {
  addAriaAttributes()
  enhanceKeyboardNavigation()
  enhanceResultAnnouncements()

  // Melhorar foco visual para navegação por teclado
  const focusStyle = document.createElement('style')
  focusStyle.textContent = `
    *:focus {
      outline: 3px solid #007bff !important;
      outline-offset: 2px !important;
    }
    .dark-mode *:focus {
      outline-color: #55aaff !important;
    }
    .watermark-link:focus {
      outline: none !important;
    }
      
  `
  document.head.appendChild(focusStyle)

  console.log('Melhorias de acessibilidade inicializadas')
}

// Preservar estilos visuais do watermark
function preserveWatermarkStyles() {
  // Garantir que o watermark não seja modificado pelos estilos de acessibilidade
  const watermarkLink = document.querySelector('.watermark-link')
  if (watermarkLink) {
    // Adicionar atributo ARIA mas preservar estilos visuais
    watermarkLink.setAttribute(
      'aria-label',
      'Desenvolvido por Luís Antonio Souza Teixeira'
    )

    // Remover outros atributos que possam interferir no design
    watermarkLink.classList.add('preserve-styles')
  }
}

export default { initializeAccessibility, announceToScreenReaders }
