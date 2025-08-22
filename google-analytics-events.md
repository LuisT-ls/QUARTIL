# Google Analytics - Eventos Personalizados para Calculadora de Quartil

## Configuração de Eventos

### 1. Eventos de Cálculo

```javascript
// Evento quando usuário calcula quartis
gtag('event', 'calculate_quartiles', {
  event_category: 'calculator',
  event_label: 'quartiles_calculation',
  value: 1
})

// Evento quando usuário calcula estatísticas básicas
gtag('event', 'calculate_statistics', {
  event_category: 'calculator',
  event_label: 'basic_statistics',
  value: 1
})

// Evento quando usuário gera tabela de frequência
gtag('event', 'generate_frequency_table', {
  event_category: 'calculator',
  event_label: 'frequency_table',
  value: 1
})
```

### 2. Eventos de Exportação

```javascript
// Evento quando usuário exporta dados
gtag('event', 'export_data', {
  event_category: 'export',
  event_label: 'data_export',
  value: 1
})

// Evento específico para cada formato
gtag('event', 'export_format', {
  event_category: 'export',
  event_label: 'pdf_export', // ou 'csv_export', 'xlsx_export'
  value: 1
})
```

### 3. Eventos de Navegação

```javascript
// Evento quando usuário visualiza gráficos
gtag('event', 'view_charts', {
  event_category: 'navigation',
  event_label: 'charts_view',
  value: 1
})

// Evento quando usuário acessa seção educativa
gtag('event', 'view_educational_content', {
  event_category: 'content',
  event_label: 'quartiles_explanation',
  value: 1
})
```

## Implementação no JavaScript

### 1. Arquivo app.js

```javascript
// Adicione estas funções ao seu app.js

function trackCalculation(type, data) {
  gtag('event', 'calculate', {
    event_category: 'calculator',
    event_label: type,
    value: data.length || 1
  })
}

function trackExport(format) {
  gtag('event', 'export', {
    event_category: 'export',
    event_label: format,
    value: 1
  })
}

function trackPageView(section) {
  gtag('event', 'page_view', {
    event_category: 'navigation',
    event_label: section,
    value: 1
  })
}
```

### 2. Eventos de Conversão

```javascript
// Evento de conversão principal (uso da calculadora)
function trackConversion() {
  gtag('event', 'conversion', {
    send_to: 'G-SZW57KN2PE/conversion',
    value: 1.0,
    currency: 'BRL'
  })
}

// Evento de engajamento (tempo na página)
function trackEngagement(timeSpent) {
  gtag('event', 'engagement', {
    event_category: 'user_behavior',
    event_label: 'time_on_page',
    value: Math.round(timeSpent / 1000) // em segundos
  })
}
```

## Configurações de Conversão

### 1. Objetivos do Google Analytics

- **Conversão Primária**: Uso da calculadora (evento 'calculate')
- **Conversão Secundária**: Exportação de dados (evento 'export')
- **Engajamento**: Tempo na página > 2 minutos

### 2. Segmentação de Usuários

```javascript
// Segmento: Usuários que calculam quartis
gtag('config', 'G-SZW57KN2PE', {
  custom_map: {
    custom_dimension1: 'quartiles_users'
  }
})

// Segmento: Usuários que exportam dados
gtag('config', 'G-SZW57KN2PE', {
  custom_map: {
    custom_dimension2: 'export_users'
  }
})
```

## Métricas de Performance

### 1. Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 2. Métricas de Engajamento

- **Tempo na página**: > 2 minutos
- **Taxa de rejeição**: < 40%
- **Páginas por sessão**: > 1.5
- **Taxa de conversão**: > 5%

### 3. Métricas de SEO

- **Tráfego orgânico**: Crescimento mensal
- **Palavras-chave rankeadas**: Top 10 para termos principais
- **Backlinks**: Qualidade e quantidade
- **Autoridade de domínio**: Crescimento contínuo

## Relatórios Personalizados

### 1. Relatório de Quartis

- Uso da calculadora de quartis
- Tempo gasto na seção de quartis
- Taxa de conversão para quartis

### 2. Relatório de Estatística

- Uso da calculadora de estatística
- Seções mais acessadas
- Padrões de uso por dispositivo

### 3. Relatório de Performance

- Velocidade de carregamento
- Taxa de erro
- Experiência do usuário

## Otimizações Baseadas em Dados

### 1. A/B Testing

- Teste diferentes títulos de seções
- Teste posicionamento de botões
- Teste cores e layout

### 2. Otimização de Conversão

- Análise de funil de conversão
- Identificação de pontos de abandono
- Melhorias baseadas em comportamento

### 3. SEO Contínuo

- Monitoramento de ranking
- Análise de concorrentes
- Atualizações de conteúdo
