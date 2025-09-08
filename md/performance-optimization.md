# Otimização de Performance para Calculadora de Quartil

## Core Web Vitals - Metas

### 1. LCP (Largest Contentful Paint)

- **Meta**: < 2.5 segundos
- **Atual**: Medir com PageSpeed Insights
- **Estratégias**:
  - Otimizar imagens
  - Lazy loading
  - Preload de recursos críticos

### 2. FID (First Input Delay)

- **Meta**: < 100 milissegundos
- **Estratégias**:
  - Minimizar JavaScript bloqueante
  - Code splitting
  - Otimizar event handlers

### 3. CLS (Cumulative Layout Shift)

- **Meta**: < 0.1
- **Estratégias**:
  - Definir dimensões de imagens
  - Reservar espaço para elementos
  - Evitar inserção dinâmica de conteúdo

## Otimizações de Imagens

### 1. Formato de Imagens

```html
<!-- Use WebP quando possível -->
<picture>
  <source srcset="logo.webp" type="image/webp" />
  <img src="logo.png" alt="Logo" width="200" height="100" />
</picture>
```

### 2. Lazy Loading

```html
<!-- Implementar lazy loading para imagens -->
<img src="chart.png" alt="Gráfico" loading="lazy" width="400" height="300" />
```

### 3. Otimização de Favicon

```html
<!-- Favicon otimizado -->
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
```

## Otimizações de CSS

### 1. Critical CSS

```html
<!-- CSS crítico inline -->
<style>
  /* Apenas estilos essenciais para above-the-fold */
  .header,
  .input-section {
    /* estilos críticos */
  }
</style>

<!-- CSS não crítico carregado assincronamente -->
<link
  rel="preload"
  href="main.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

### 2. Minificação

```bash
# Minificar CSS
npm install -g clean-css-cli
cleancss -o main.min.css main.css

# Minificar JavaScript
npm install -g uglify-js
uglifyjs app.js -o app.min.js
```

### 3. CSS Modules

```css
/* Carregar apenas CSS necessário por módulo */
@import 'modules/base/variables.css';
@import 'modules/components/buttons.css';
@import 'modules/features/quartis.css';
```

## Otimizações de JavaScript

### 1. Code Splitting

```javascript
// Carregar módulos sob demanda
const quartisModule = await import('./modules/quartis.js')
const graficosModule = await import('./modules/graficos.js')
```

### 2. Debouncing para Eventos

```javascript
// Debounce para cálculos
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedCalculate = debounce(calculateQuartis, 300)
```

### 3. Web Workers para Cálculos Pesados

```javascript
// Usar Web Worker para cálculos complexos
if (window.Worker) {
  const worker = new Worker('calculator-worker.js')
  worker.postMessage({ data: inputData, type: 'quartis' })
  worker.onmessage = function (e) {
    displayResults(e.data)
  }
}
```

## Otimizações de Carregamento

### 1. Preload de Recursos Críticos

```html
<!-- Preload de recursos essenciais -->
<link rel="preload" href="assets/css/main.css" as="style" />
<link rel="preload" href="js/app.js" as="script" />
<link rel="preload" href="assets/img/logo/logo.svg" as="image" />
```

### 2. Preconnect para Domínios Externos

```html
<!-- Preconnect para CDNs -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
```

### 3. Service Worker para Cache

```javascript
// sw.js - Service Worker para cache
const CACHE_NAME = 'quartil-calculator-v1'
const urlsToCache = [
  '/',
  '/assets/css/main.css',
  '/js/app.js',
  '/assets/img/logo/logo.svg'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})
```

## Otimizações de Banco de Dados

### 1. IndexedDB para Dados Locais

```javascript
// Armazenar dados de cálculos recentes
const db = indexedDB.open('QuartilCalculator', 1)

db.onupgradeneeded = function (event) {
  const db = event.target.result
  const objectStore = db.createObjectStore('calculations', { keyPath: 'id' })
  objectStore.createIndex('timestamp', 'timestamp', { unique: false })
}
```

### 2. Cache de Resultados

```javascript
// Cache de cálculos para melhorar performance
const calculationCache = new Map()

function getCachedResult(data, type) {
  const key = `${type}_${JSON.stringify(data)}`
  return calculationCache.get(key)
}

function cacheResult(data, type, result) {
  const key = `${type}_${JSON.stringify(data)}`
  calculationCache.set(key, result)
}
```

## Monitoramento de Performance

### 1. Web Vitals API

```javascript
// Monitorar Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getLCP(console.log)
```

### 2. Performance Observer

```javascript
// Monitorar métricas de performance
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.startTime}ms`)
  }
})

observer.observe({ entryTypes: ['measure', 'navigation'] })
```

### 3. Real User Monitoring

```javascript
// Enviar métricas para analytics
function sendToAnalytics(metric) {
  gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: metric.name,
    value: Math.round(metric.value),
    non_interaction: true
  })
}
```

## Estratégias de Otimização

### 1. Above-the-Fold

- Carregar apenas conteúdo visível inicialmente
- Lazy load para conteúdo abaixo da dobra
- Priorizar recursos críticos

### 2. Progressive Enhancement

- Funcionalidade básica sem JavaScript
- Melhorias progressivas com JS
- Fallbacks para navegadores antigos

### 3. Mobile-First

- Otimizar para dispositivos móveis
- Touch-friendly interface
- Responsive design

## Ferramentas de Análise

### 1. Google PageSpeed Insights

- Análise de performance
- Sugestões de otimização
- Core Web Vitals

### 2. Lighthouse

- Auditoria completa
- Performance score
- Acessibilidade e SEO

### 3. WebPageTest

- Testes de velocidade
- Análise de waterfall
- Comparação de locais

## Metas de Performance

### 1. Tempo de Carregamento

- **Desktop**: < 2 segundos
- **Mobile**: < 3 segundos
- **3G**: < 5 segundos

### 2. Tamanho da Página

- **Total**: < 2MB
- **CSS**: < 100KB
- **JavaScript**: < 200KB
- **Imagens**: < 1MB

### 3. Score de Performance

- **PageSpeed**: > 90
- **Lighthouse**: > 90
- **Core Web Vitals**: Todos verdes
