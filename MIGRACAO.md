# Guia de migração para Next.js

Checklist para migrar 100% para Next.js mantendo SEO e evitar perda de indexação no Google.

---

## ✅ Pré-migração (já feito)

- [x] Next.js com rotas `/` e `/aprender`
- [x] Meta tags, Open Graph e Twitter Cards otimizados
- [x] JSON-LD (WebApplication + LearningResource)
- [x] Sitemap e robots.txt dinâmicos
- [x] Redirects 301 configurados:
  - `/index.html` → `/`
  - `/offline.html` → `/`

---

## 🔧 Configuração Vercel

1. **Root Directory**: Em *Project Settings → General*, deixe **Root Directory** vazio (aplicação na raiz)

2. **Variáveis de ambiente**: Se usar `GOOGLE_SITE_VERIFICATION`, configure em *Settings → Environment Variables*

3. **Domain**: Confirme que `quartil.vercel.app` está apontando para este projeto

---

## 📋 Antes do deploy final

| Item | Verificação |
|------|-------------|
| **baseUrl** | `metadata.ts` usa `https://quartil.vercel.app` ✅ |
| **Canonical** | Home e `/aprender` com canonical corretos ✅ |
| **Imagem OG** | `imagem-preview.jpg` em `public/` ✅ |
| **Título** | Legacy: "Calculadora... \| Média, Mediana, Moda, Desvio Padrão" / Next: "Calculadora... \| Média, Mediana, Moda" — leve diferença, aceitável |
| **Descrição** | Dentro de 70–155 caracteres ✅ |

---

## 🚀 Após o deploy

1. **Google Search Console**
   - Submeta o novo sitemap: `https://quartil.vercel.app/sitemap.xml`
   - Use *Inspect URL* em páginas importantes para verificar indexação
   - Monitore cobertura e erros nas 1–2 primeiras semanas

2. **Testes manuais**
   - [ ] `https://quartil.vercel.app/` carrega a calculadora
   - [ ] `https://quartil.vercel.app/aprender` carrega o conteúdo educativo
   - [ ] `https://quartil.vercel.app/index.html` redireciona para `/`
   - [ ] `https://quartil.vercel.app/sitemap.xml` retorna o XML
   - [ ] `https://quartil.vercel.app/robots.txt` permite crawl

3. **Rich Results**
   - Use [ferramenta de teste](https://search.google.com/test/rich-results) com a URL principal

---

## ⚠️ Pontos de atenção

### URLs legadas
- **`/index.html`** e **`/offline.html`** → redirect 301 para `/` (evita 404 em links antigos)
- **`/manifest.json`** → Next.js entrega o manifest de `public/`, sem mudança de caminho

### Assets legados
- `/assets/*`, `/js/*` → não serão servidos após migração
- Impacto baixo: recursos internos do HTML legado; não costumam ser indexados
- Links externos para imagens como `/assets/img/logo/logo.png` podem 404 — aceitável em migração

### Título e descrição
- Pequenas diferenças em relação à versão legada são esperadas
- O Google tende a atualizar snippets em poucos dias; monitorar no GSC

---

## 📁 Após migração estável

Depois de 2–4 semanas com Next.js em produção e indexação normal:

1. **Limpar legado** (opcional)
   - Remover ou arquivar `index.html`, `js/`, `assets/`, `offline.html`, `sw.js`, `manifest.json` na raiz
   - Manter referência em README se quiser histórico do projeto

2. **Atualizar documentação**
   - README, contribuição, etc., refletindo apenas o Next.js

---

## Links úteis

- [Vercel – Root Directory](https://vercel.com/docs/concepts/projects/overview#root-directory)
- [Google Search Console](https://search.google.com/search-console)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
