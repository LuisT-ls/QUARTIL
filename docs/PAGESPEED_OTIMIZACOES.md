# Otimizações PageSpeed Mobile

**Contexto:** Desempenho mobile caiu para 77. Análise baseada no PageSpeed Insights.

---

## Problemas identificados (imagens)

### 1. JavaScript não utilizado (~314 KiB)
- **vercel.app:** 255 KiB economizáveis (chunks principais)
- **Google Tag Manager:** 58,6 KiB economizáveis

### 2. Solicitações de renderização bloqueantes
- **Economia estimada:** 380 ms
- Dois chunks CSS bloqueando LCP/FCP:
  - `20bff4eb9a0a6872.css`: 4,3 KiB, 580 ms
  - `6c5332c0a3969ef6.css`: 10,7 KiB, 190 ms

### 3. Árvore de dependência da rede
- **Latência do caminho crítico:** 494 ms
- Documento HTML: 322 ms
- CSS chunks acumulam até 494 ms no caminho crítico

---

## Otimizações implementadas

### ✅ KaTeX carregado sob demanda
- **Antes:** KaTeX (~150 KiB) no bundle inicial
- **Depois:** `MathDisplayLazy` com `next/dynamic` — KaTeX só carrega quando o usuário expande "Ver cálculo passo a passo"

### ✅ jsPDF e xlsx carregados sob demanda
- **Antes:** jsPDF + xlsx no bundle inicial do ExportPopup
- **Depois:** `await import("jspdf")` e `await import("xlsx")` apenas quando o usuário clica em PDF ou XLSX

### ✅ Fontes Poppins otimizadas
- **Antes:** 5 pesos (300, 400, 500, 600, 700)
- **Depois:** 3 pesos (400, 500, 600) + `display: "swap"` para evitar FOIT

### Já existente
- **Chart.js:** importação dinâmica em `GraficosSection` — carrega só após o usuário calcular
- **Google Analytics:** `strategy="lazyOnload"`
- **lucide-react:** `optimizePackageImports` no next.config

---

## Recomendações adicionais (não implementadas)

1. **CSS crítico:** Inline do CSS acima da dobra ou uso de `media="print" onload="this.media='all'"` para CSS não crítico (requer customização do Next.js).

2. **Pré-conexão:** Mantida para `googletagmanager.com`; o relatório indica que não há outros candidatos relevantes.

3. **Analytics alternativo:** Considerar Plausible ou Fathom (mais leves) se o GA continuar impactando.

---

*Documento gerado em 13/02/2026*
