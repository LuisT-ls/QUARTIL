// image-optimizer.js - Utilitários para otimização de imagens

// Função para detectar suporte a WebP
export function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// Função para lazy loading de imagens
export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          loadImage(img)
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    // Observar todas as imagens com data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })

    return imageObserver
  } else {
    // Fallback para navegadores sem IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(loadImage)
  }
}

// Função para carregar imagem com otimização
async function loadImage(img) {
  try {
    const supportsWebPFormat = await supportsWebP()
    const src = img.getAttribute('data-src')
    
    if (!src) return

    // Tentar carregar WebP primeiro se suportado
    if (supportsWebPFormat && src.includes('.')) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      
      // Verificar se a versão WebP existe
      const webpExists = await checkImageExists(webpSrc)
      if (webpExists) {
        img.src = webpSrc
        img.onload = () => {
          img.classList.add('loaded')
          img.removeAttribute('data-src')
        }
        return
      }
    }

    // Fallback para formato original
    img.src = src
    img.onload = () => {
      img.classList.add('loaded')
      img.removeAttribute('data-src')
    }
  } catch (error) {
    console.error('Erro ao carregar imagem:', error)
    // Fallback para src original
    const src = img.getAttribute('data-src')
    if (src) {
      img.src = src
      img.removeAttribute('data-src')
    }
  }
}

// Função para verificar se uma imagem existe
function checkImageExists(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

// Função para otimizar imagens existentes
export function optimizeExistingImages() {
  document.querySelectorAll('img').forEach(img => {
    // Adicionar lazy loading se não tiver
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }

    // Adicionar dimensões se não tiver
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      img.addEventListener('load', () => {
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', img.naturalWidth)
        }
        if (!img.hasAttribute('height')) {
          img.setAttribute('height', img.naturalHeight)
        }
      })
    }
  })
}

// Função para gerar imagens WebP
export async function generateWebPImages() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  document.querySelectorAll('img').forEach(async (img) => {
    if (img.src && !img.src.includes('data:') && !img.src.includes('.webp')) {
      try {
        // Carregar imagem original
        const originalImg = new Image()
        originalImg.crossOrigin = 'anonymous'
        
        originalImg.onload = () => {
          canvas.width = originalImg.width
          canvas.height = originalImg.height
          ctx.drawImage(originalImg, 0, 0)
          
          // Converter para WebP
          const webpDataUrl = canvas.toDataURL('image/webp', 0.8)
          
          // Criar elemento de imagem WebP
          const webpImg = new Image()
          webpImg.src = webpDataUrl
          webpImg.style.display = 'none'
          
          // Substituir imagem original se WebP for menor
          webpImg.onload = () => {
            if (webpDataUrl.length < img.src.length) {
              img.src = webpDataUrl
              img.classList.add('webp-optimized')
            }
          }
        }
        
        originalImg.src = img.src
      } catch (error) {
        console.error('Erro ao gerar WebP:', error)
      }
    }
  })
}

// Função para pré-carregar imagens críticas
export function preloadCriticalImages() {
  const criticalImages = [
    '/assets/img/logo/logo.svg',
    '/assets/img/logo/logo.png'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

// Função para otimizar imagens de fundo
export function optimizeBackgroundImages() {
  document.querySelectorAll('[style*="background-image"]').forEach(element => {
    const style = element.style.backgroundImage
    const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/)
    
    if (urlMatch) {
      const imageUrl = urlMatch[1]
      
      // Adicionar lazy loading para imagens de fundo
      element.setAttribute('data-bg', imageUrl)
      element.style.backgroundImage = 'none'
      
      // Carregar quando visível
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bgUrl = entry.target.getAttribute('data-bg')
              if (bgUrl) {
                entry.target.style.backgroundImage = `url(${bgUrl})`
                entry.target.removeAttribute('data-bg')
                observer.unobserve(entry.target)
              }
            }
          })
        })
        
        observer.observe(element)
      }
    }
  })
}

// Inicializar otimizações quando o DOM estiver carregado
export function initializeImageOptimizations() {
  // Otimizar imagens existentes
  optimizeExistingImages()
  
  // Configurar lazy loading
  setupLazyLoading()
  
  // Pré-carregar imagens críticas
  preloadCriticalImages()
  
  // Otimizar imagens de fundo
  optimizeBackgroundImages()
  
  console.log('Otimizações de imagem inicializadas')
}
