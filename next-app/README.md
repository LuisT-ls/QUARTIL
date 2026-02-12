# Quartil - Next.js

Versão em migração para Next.js 16 + Tailwind CSS da Calculadora de Quartil e Estatística.

## Estrutura

Este projeto está na pasta `next-app/` enquanto a versão em produção (HTML/CSS/JS estático) permanece na raiz do repositório.

## Desenvolvimento

```bash
cd next-app
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

Quando a migração estiver completa:

1. Configure o projeto na Vercel com **Root Directory** = `next-app`
2. Ou faça merge da branch e ajuste o deploy

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React (ícones)
