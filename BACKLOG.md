# Backlog de Produto, UX e Arquitetura

Backlog estratégico da aplicação Quartil, elaborado a partir da análise macro do produto, da jornada do usuário e da arquitetura atual.

## Objetivo

Evoluir a aplicação de uma calculadora estatística funcional para um espaço de análise mais confiável, orientado e reutilizável, sem perder a simplicidade de uso imediato.

## Contexto atual

- Aplicação Next.js 16, React 19, TypeScript e Tailwind CSS.
- Rotas principais: `/` e `/aprender`.
- Processamento client-side, sem backend, autenticação ou banco de dados.
- Estado principal mantido em `CalculatorContext`.
- Cálculos estatísticos organizados em `src/lib/stats`.
- Gráficos renderizados com Chart.js.
- Exportação disponível em PDF, TXT, CSV, JSON e XLSX.
- Entrada de dados por chips, colagem, teclado ou geração aleatória.

## Jornada atual do usuário

1. Usuário acessa a calculadora.
2. Insere ou cola números.
3. Clica em **Calcular**.
4. Visualiza rol ordenado, medidas de posição, dispersão, quartis, gráficos e tabelas.
5. Pode gerar dados aleatórios ou exportar os resultados.
6. Pode acessar o conteúdo educativo em `/aprender`.

Não existem áreas logadas, dashboards, fluxos de criação/edição persistentes ou relacionamentos de banco de dados.

## Diagnóstico de UX

### Pontos fortes

- Proposta de valor clara e objetiva.
- Entrada por colagem adequada para dados vindos do Excel.
- Uso sem cadastro.
- Integração entre cálculo prático e conteúdo educativo.
- Exportação em múltiplos formatos.
- Geração de dados aleatórios para experimentação.

### Fricções identificadas

1. **Jornada longa:** muitos blocos são exibidos em sequência, exigindo bastante scroll.
2. **Falta de resumo inicial:** os principais resultados não ficam imediatamente destacados após o cálculo.
3. **Estado fragmentado:** calculadora principal, tabela automática e tabela manual mantêm estados parcialmente independentes.
4. **Resultados potencialmente desatualizados:** alterações nos chips não deixam claro que os resultados anteriores precisam ser recalculados.
5. **Parsing ambíguo:** a vírgula pode ser separador de valores ou separador decimal brasileiro.
6. **Erros silenciosos:** valores inválidos são ignorados sem feedback suficientemente claro.
7. **Metodologia inconsistente:** o conteúdo educativo menciona `(n + 1) × p`, enquanto o código utiliza `p × (n − 1)` com interpolação.
8. **Excesso de informação para iniciantes:** medidas avançadas aparecem no mesmo fluxo das respostas principais.
9. **Escopo de exportação pouco evidente:** o botão sugere exportar o rol, mas gera um relatório estatístico.
10. **Acessibilidade incompleta:** os modais não possuem, de forma evidente, fluxo completo de foco e teclado.
11. **Offline não totalmente garantido:** existe modal offline, mas não há estratégia evidente de cache/service worker para assegurar todos os recursos.
12. **Pouca observabilidade de produto:** há Google Analytics, mas não há instrumentação clara do funil de uso.

# Matriz de priorização

## Critérios

- **Impacto:** benefício percebido, redução de erros, confiança e retenção.
- **Esforço:** complexidade técnica, refatoração e dependências arquiteturais.
- **Prioridade 1:** executar primeiro.
- **Prioridade 2:** roadmap principal.
- **Prioridade 3:** melhoria contínua.
- **Prioridade 4:** postergar ou descartar.

## 1. 🟢 Rápido de Implementar & Alto Impacto

### P1-01 — Criar uma fonte única para a análise ativa

**Impacto:** alto
**Esforço:** baixo
**Prioridade:** 1
**Status:** implementado; validado (lint, testes e build)

Unificar dados, resultados, tabelas, gráficos e o estado de “análise desatualizada”.

**Justificativa técnica:** atualmente o estado está distribuído entre `CalculatorContext`, `CalculatorSection`, tabela automática e tabela manual. A mudança exige principalmente refatoração do estado React, sem backend.

**Resultado esperado:** editar, calcular e limpar devem atualizar todos os módulos de forma previsível.

### P1-02 — Melhorar validação e parsing de números

**Impacto:** alto
**Esforço:** baixo
**Prioridade:** 1
**Status:** implementado; validado (lint, testes e build)

Corrigir decimais brasileiros, mostrar valores inválidos e informar quantos números foram reconhecidos.

**Justificativa técnica:** a lógica está concentrada em `NumberInputChips` e no contexto. É uma alteração client-side de baixa complexidade, mas elimina erros silenciosos.

**Resultado esperado:** o usuário entende exatamente o que foi aceito, rejeitado e calculado.

### P1-03 — Adicionar resumo de resultados e navegação contextual

**Impacto:** alto
**Esforço:** baixo
**Prioridade:** 1
**Status:** implementado; validado (lint, testes e build)

Exibir logo após o cálculo:

- Q1, mediana, Q3 e IQR;
- média e desvio padrão;
- quantidade de dados;
- quantidade de outliers;
- links para detalhes, gráficos, tabelas e exportação.

**Justificativa técnica:** as seções já possuem componentes e IDs. Basta criar um bloco de resumo e uma navegação interna.

**Resultado esperado:** o valor principal da aplicação fica evidente sem exigir scroll extenso.

### P1-04 — Tornar a metodologia estatística explícita

**Impacto:** alto
**Esforço:** baixo
**Prioridade:** 1
**Status:** implementado; validado (lint, testes e build)

Informar claramente a convenção de quartis usada e alinhar o conteúdo de `/aprender` com a implementação real.

**Justificativa técnica:** a regra já está isolada em `src/lib/stats/quartis.ts`; inicialmente basta corrigir textos, fórmulas e rótulos.

**Resultado esperado:** maior confiança acadêmica e menor risco de o usuário comparar resultados com outra calculadora sem entender a diferença.

## 2. 🟡 Mais Difícil/Demorado & Alto Impacto

### P2-01 — Importação de CSV/XLSX com pré-visualização

**Impacto:** alto
**Esforço:** médio/alto
**Prioridade:** 2
**Status:** implementado; validação local concluída

Permitir upload de arquivos, seleção de coluna numérica, pré-visualização, tratamento de células vazias ou inválidas e confirmação antes do cálculo.

**Justificativa técnica:** `xlsx` já está presente para exportação, mas será necessário criar fluxo de upload, parsing, validação e um modelo de dados mais estruturado.

**Resultado esperado:** reduzir a necessidade de copiar e colar grandes conjuntos manualmente.

### P2-02 — Histórico local e comparação de análises

**Impacto:** alto
**Esforço:** médio/alto
**Prioridade:** 2
**Status:** implementado; validação local concluída

Salvar análises no navegador, permitir nomear, duplicar, favoritar e comparar dois conjuntos.

**Justificativa técnica:** exige introduzir uma entidade persistente `Analysis`, usando `localStorage` ou IndexedDB, além de adaptar o contexto atual, que trabalha apenas com um array ativo.

**Resultado esperado:** o usuário consegue recuperar análises e comparar períodos, turmas ou amostras sem repetir o trabalho.

### P2-03 — Relatório explicável e link compartilhável

**Impacto:** alto
**Esforço:** alto
**Prioridade:** 2
**Status:** implementado; validação local concluída

Gerar relatório com dados, metodologia, tabelas, gráficos, fórmulas e explicações, além de permitir um link reproduzível.

**Justificativa técnica:** a aplicação já possui PDF, XLSX e Chart.js, mas será necessário centralizar os resultados e definir se os dados serão serializados na URL ou persistidos em servidor.

**Resultado esperado:** facilitar trabalhos acadêmicos, relatórios profissionais e revisão por terceiros.

### P2-04 — Configuração estatística avançada

**Impacto:** alto
**Esforço:** alto
**Prioridade:** 2
**Status:** implementado; validado (lint, testes e build)

Permitir escolher:

- convenção de quartis;
- variância populacional ou amostral;
- tratamento de dados inválidos;
- inclusão ou exclusão de outliers.

**Justificativa técnica:** as configurações precisam ser propagadas pelo contexto, funções estatísticas, gráficos, tabelas, textos explicativos e exportações.

**Resultado esperado:** atender melhor usuários acadêmicos e profissionais com diferentes convenções metodológicas.

**Implementação concluída:** painel de configurações na calculadora, quartis interpolados ou pela mediana das metades (Tukey), variância populacional ou amostral, bloqueio opcional de células inválidas na importação, exclusão confirmada de outliers das métricas e propagação da metodologia para gráficos, tabelas, histórico e relatórios compartilhados.

## 3. 🔵 Rápido de Implementar & Baixo/Médio Impacto

### P3-01 — Melhorar acessibilidade dos modais

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Adicionar fechamento com `Esc`, foco inicial, retorno de foco e estados de carregamento nos modais de exportação e geração aleatória.

**Justificativa técnica:** os modais já existem e usam overlay próprio. A melhoria se limita ao comportamento de teclado e ao gerenciamento de foco.

### P3-02 — Criar onboarding e dados de exemplo

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Adicionar botão “Testar com exemplo”, instruções curtas e exemplos de entrada.

**Justificativa técnica:** pode ser implementado com conteúdo estático e um conjunto de números predefinido, sem alterar a arquitetura.

### P3-03 — Adicionar feedback e reporte de erro

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Adicionar canal para sugerir melhorias ou reportar resultados inesperados.

**Justificativa técnica:** a primeira versão pode usar `mailto:` ou formulário externo, sem necessidade de backend.

### P3-04 — Adicionar transparência de privacidade e Analytics

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Informar o uso de métricas e explicar que os dados estatísticos permanecem no navegador.

**Justificativa técnica:** envolve alteração de textos, layout e configuração do Google Analytics, sem dependência do modelo de dados.

### P3-05 — Instrumentar eventos do funil

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Medir eventos como cálculo, uso de dados aleatórios, exportação, upload e acesso ao conteúdo educativo.

**Justificativa técnica:** o Google Analytics já está instalado; basta adicionar eventos nos handlers existentes.

### P3-06 — Criar alternativa acessível aos gráficos

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Manter tabelas e descrições textuais completas para usuários que não conseguem interpretar o canvas.

**Justificativa técnica:** os gráficos já calculam detalhes textuais; é principalmente uma melhoria de apresentação e semântica HTML.

### P3-07 — Tratar casos estatísticos extremos

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Evitar `NaN` ou `Infinity` quando a média for zero e explicar situações com poucos dados.

**Justificativa técnica:** requer pequenas proteções nas funções de dispersão e nos componentes que formatam os resultados.

### P3-08 — Revisar a mensagem de funcionamento offline

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado (lint, testes e build)

Ajustar a comunicação offline para não prometer recursos que não estejam realmente disponíveis sem conexão.

**Justificativa técnica:** o modal já existe; inicialmente basta alterar o texto e diferenciar “a página já carregada continua utilizável” de “a aplicação é totalmente offline”.

### P3-09 — Automatizar o smoke test E2E

**Impacto:** médio
**Esforço:** baixo/médio
**Prioridade:** 3
**Status:** implementado; validado localmente e em produção (5 cenários aprovados)

Cobrir automaticamente cálculo, configurações estatísticas, importação CSV, histórico, compartilhamento e navegação educativa.

**Justificativa técnica:** o Playwright foi integrado como uma suíte independente do Vitest, com servidor local automático e suporte a `BASE_URL` para validar a implantação publicada. Não exige alteração no modelo client-side nem backend.

### P3-10 — SEO técnico e conteúdo indexável

**Impacto:** alto
**Esforço:** médio
**Prioridade:** 3
**Status:** implementado; propriedade verificada e sitemap enviado ao Google Search Console

Corrigir diretivas de rastreamento, canonical da rota de relatório, hierarquia de headings, FAQ estruturado e criar páginas educativas específicas para buscas de quartis e tabela de frequência.

**Justificativa técnica:** a aplicação já usa App Router e metadata estática. A implementação ficou restrita a metadata, sitemap, robots, conteúdo server-rendered e dados estruturados, sem introduzir backend.

### P3-11 — Compactar a experiência da página educativa

**Impacto:** médio
**Esforço:** baixo
**Prioridade:** 3
**Status:** implementado; validado visualmente e com E2E

Transformar os blocos longos de `/aprender` em seções recolhíveis e manter a navegação de tópicos acessível durante o scroll.

**Justificativa técnica:** usa elementos HTML nativos (`details`/`summary`) e CSS sticky, sem dependência de estado React adicional ou alteração do conteúdo indexável.

## 4. 🔴 Mais Difícil & Baixo Impacto

### P4-01 — Autenticação, dashboard e sincronização em nuvem

**Impacto:** médio
**Esforço:** alto
**Prioridade:** 4

**Decisão:** postergar.

**Justificativa técnica:** não há evidência de necessidade de contas ou colaboração multiusuário. Isso exigiria backend, banco, autenticação, controle de privacidade e migração do modelo client-side.

### P4-02 — PWA completo com offline garantido

**Impacto:** médio
**Esforço:** alto
**Prioridade:** 4

**Decisão:** postergar até validar demanda.

**Justificativa técnica:** exigiria service worker, estratégia de cache, versionamento de assets, testes de atualização e tratamento de dependências dinâmicas como Chart.js, KaTeX e exportações.

### P4-03 — Colaboração em tempo real

**Impacto:** baixo
**Esforço:** muito alto
**Prioridade:** 4

**Decisão:** descartar neste momento.

**Justificativa técnica:** não existe fluxo colaborativo no produto atual. A funcionalidade exigiria infraestrutura em tempo real e mudaria significativamente o posicionamento da aplicação.

# Roadmap recomendado

## Fase 1 — Confiabilidade e clareza

Prioridade 1:

- P1-01 — Fonte única para a análise ativa.
- P1-02 — Validação e parsing.
- P1-03 — Resumo e navegação contextual.
- P1-04 — Metodologia explícita.

**Objetivo:** tornar o fluxo atual consistente antes de adicionar novas fontes de dados ou persistência.

## Fase 2 — Qualidade percebida

Prioridade 3:

- P3-01 — Acessibilidade dos modais.
- P3-02 — Onboarding e exemplos.
- P3-03 — Feedback.
- P3-04 — Privacidade e Analytics.
- P3-05 — Instrumentação.
- P3-06 — Acessibilidade dos gráficos.
- P3-07 — Casos extremos.
- P3-08 — Mensagem offline.
- P3-09 — Smoke test E2E.
- P3-10 — SEO técnico e conteúdo indexável.
- P3-11 — Compactar a experiência da página educativa.

**Objetivo:** melhorar a primeira experiência, reduzir dúvidas e criar visibilidade sobre o uso real.

## Fase 3 — Expansão do produto

Prioridade 2:

- P2-01 — Importação de arquivos.
- P2-02 — Histórico e comparação.
- P2-03 — Relatório compartilhável.
- P2-04 — Configuração estatística avançada.

**Objetivo:** transformar a calculadora em um espaço reutilizável de análise estatística.

## Fase 4 — Avaliação futura

Prioridade 4:

- P4-01 — Contas e nuvem.
- P4-02 — PWA completo.
- P4-03 — Colaboração em tempo real.

**Objetivo:** só investir após evidências de demanda, retenção e necessidade de uso multiusuário.

## Próxima etapa recomendada — Monitoramento orientado por evidências

Com as quatro entregas P2 concluídas e o smoke test automatizado, a próxima etapa não deve ser adicionar infraestrutura de contas imediatamente. O foco recomendado é um ciclo curto de validação em produção:

- executar `npm run test:e2e` localmente e `BASE_URL=https://quartil.vercel.app npm run test:e2e` contra a produção;
- observar os eventos de uso já instrumentados e identificar onde usuários abandonam a jornada;
- coletar feedback sobre convenções estatísticas e necessidade real de persistência na nuvem;
- decidir, com base nesses sinais, entre aprofundar exportações/feedback ou iniciar P4-01 (contas e nuvem).

# Resumo executivo

| Feature | Impacto | Esforço | Prioridade |
|---|---:|---:|---:|
| Fonte única para análise ativa | Alto | Baixo | 1 |
| Validação e parsing de números | Alto | Baixo | 1 |
| Resumo e navegação contextual | Alto | Baixo | 1 |
| Metodologia explícita de quartis | Alto | Baixo | 1 |
| Importação CSV/XLSX | Alto | Médio/alto | 2 |
| Histórico e comparação local | Alto | Médio/alto | 2 |
| Relatório explicável e compartilhável | Alto | Alto | 2 |
| Configuração estatística avançada | Alto | Alto | 2 |
| Acessibilidade dos modais | Médio | Baixo | 3 |
| Onboarding e dados de exemplo | Médio | Baixo | 3 |
| Feedback e reporte de erro | Médio | Baixo | 3 |
| Privacidade e transparência do Analytics | Médio | Baixo | 3 |
| Instrumentação de eventos | Médio | Baixo | 3 |
| Acessibilidade alternativa dos gráficos | Médio | Baixo | 3 |
| Tratamento de casos extremos | Médio | Baixo | 3 |
| Revisão da mensagem offline | Médio | Baixo | 3 |
| Smoke test E2E automatizado | Médio | Baixo/médio | 3 |
| SEO técnico e conteúdo indexável | Alto | Médio | 3 |
| Experiência compacta da página educativa | Médio | Baixo | 3 |
| Autenticação e dashboard em nuvem | Médio | Alto | 4 |
| PWA/offline completo | Médio | Alto | 4 |
| Colaboração em tempo real | Baixo | Muito alto | 4 |

## Princípio de priorização

O maior ganho imediato não está em adicionar mais cálculos, mas em tornar a análise atual previsível, explicável e reutilizável. A fonte única de dados, a validação e a transparência metodológica devem preceder importação, histórico e compartilhamento.
