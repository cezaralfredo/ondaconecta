---
name: onda-publisher
description: Publica automaticamente novos artigos e notícias no blog da Onda Conecta, validando o frontmatter do Astro, calculando IDs sequenciais, tempo de leitura e gerando o commit e push no Git para deploy contínuo.
---

# Onda Conecta — Skill de Publicação Automática (onda-publisher)

Esta skill é responsável por receber um artigo redigido, formatá-lo segundo os padrões estritos do Astro e do ecossistema Onda Conecta, salvá-lo no local correto e disparar o deploy via Git.

---

## 1. Regras do Schema de Conteúdo (Astro Content Collection)

Todo artigo deve ser salvo em formato MDX em:
`src/content/blog/<slug>.mdx`

O frontmatter **deve** conter obrigatoriamente os seguintes campos validados pelo `src/content.config.ts`:

```yaml
---
id: <número sequencial incremental>
slug: '<slug-amigavel-separado-por-hifens>'
lang: 'pt' # ou 'en' ou 'es'
translationOf: '<slug-do-artigo-principal>' # para 'en' e 'es'
title: '<Título chamativo e otimizado para SEO>'
description: '<Metadescrição atraente de 120 a 160 caracteres>'
imageUrl: '<Caminho da imagem em /images/blog-post/... ou URL externa>'
imageAlt: '<Texto alternativo descritivo para acessibilidade e SEO>'
pubDate: '<Data por extenso ou legível, ex: 10 de Março de 2026>'
author: '<Cezar Alfredo ou Bernardo Neto>' # Autoria nominal E-E-A-T (evitar genérico "Redação Onda Conecta")
avatarUrl: '/images/avatars/1.webp'
category: '<Categoria Válida>'
readTime: <tempo estimado em minutos, ex: 5>
featured: false # ou true se for manchete principal
---
```

### Categorias Padronizadas (9 Categorias Oficiais Ativas):

- `Inovação & IA` (inclui inteligência artificial, automação e tendências tecnológicas)
- `Mercado & Negócios`
- `Finanças Pessoais`
- `Saúde & Bem-estar`
- `Estética & Beleza`
- `Estilo de Vida & Viagens`
- `Tendências`
- `Sustentabilidade`
- `Comportamento`

---

## 2. Regras de Blindagem Técnica e Engenharia

Para evitar quebras no build do Astro e inconsistências em produção, a skill aplica as seguintes regras obrigatórias:

### A. Sanitização e Escape Seguro de Strings no YAML:
- Campos como `title`, `description` e `imageAlt` frequentemente possuem aspas simples (`'`), aspas duplas (`"`) ou dois-pontos (`:`).
- **Regra:** Sempre use aspas duplas delimitando os valores textuais no frontmatter, escapando aspas internas com `\"`.
  ```yaml
  title: "IA em 2026: O que muda nos investimentos e no mercado de trabalho?"
  description: "Entenda o impacto prático dos agentes autônomos e como proteger seus rendimentos."
  ```

### B. Cálculo Dinâmico Real de Tempo de Leitura (`readTime`):
- O `readTime` nunca deve ser um valor arbitrário.
- **Fórmula:** Conte o total de palavras do corpo do artigo (excluindo o frontmatter) e divida pela média de leitura humana (200 palavras por minuto):
  $$\text{readTime} = \max(1, \text{Math.ceil}(\text{palavras} / 200))$$

### C. Formatação Nativa de Datas (`pubDate`):
Cada versão idiomática deve receber a data formatada de acordo com os padrões locais da sua região:
- **Português (`pt`):** Formato extenso brasileiro (ex: `"10 de Março de 2026"`).
- **Inglês (`en`):** Formato nativo norte-americano (ex: `"March 10, 2026"`).
- **Espanhol (`es`):** Formato nativo hispânico (ex: `"10 de Marzo de 2026"`).

### D. Gestão Equilibrada da Flag `featured`:
- O artigo original em português recebe `featured: true` apenas se for a principal matéria da categoria na semana (ou com `urgency_score >= 8`).
- As versões em inglês e espanhol acompanham o mesmo valor da flag da versão principal.

### E. Validação Prévia de Ranqueamento, Google Search Console e GEO (Compliance Audit Check):
Antes de gerar o build e comitar, a skill deve verificar os 6 pilares de conformidade com os motores de busca e IAs (automatizados via `node scripts/seo-audit.mjs`):
1. **Auditoria de Categoria Canônica nos 3 Idiomas:** Certificar-se de que o campo `category` no frontmatter YAML dos 3 arquivos (`.mdx`, `-en.mdx` e `-es.mdx`) usa **estritamente uma das 9 categorias canônicas em português** (`Inovação & IA`, `Mercado & Negócios`, `Finanças Pessoais`, `Saúde & Bem-estar`, `Estética & Beleza`, `Estilo de Vida & Viagens`, `Tendências`, `Sustentabilidade`, `Comportamento`). Nunca gravar nomes traduzidos no frontmatter (a interface traduz automaticamente os rótulos para EN e ES via `getCategoryLabel`).
2. **Checagem Anti-Thin Content & Autoria Nominal E-E-A-T:** Validar se cada artigo (PT, EN e ES) tem no mínimo **800 palavras** no corpo do texto e se o campo `author` está assinado nominalmente por `Bernardo Neto` ou `Cezar Alfredo` (nunca `"Redação Onda Conecta"`).
3. **Checagem de Links Internos Canônicos (`200 OK` Direto, Zero `301`):**
   - Links Markdown no corpo de artigos PT devem usar `/blog/<baseSlug>` (sem barra final).
   - Links Markdown no corpo de artigos EN devem usar `/en/blog/<baseSlug>` (nunca `/blog/<baseSlug>-en` nem `/en/blog/<baseSlug>-en`).
   - Links Markdown no corpo de artigos ES devem usar `/es/blog/<baseSlug>` (nunca `/blog/<baseSlug>-es` nem `/es/blog/<baseSlug>-es`).
   - Nenhum link interno ou `<ReadAlso>` pode apontar para slugs antigos consolidados via `301` em `scripts/published-history.json`.
4. **Checagem Estrutural GEO/AEO (Key Takeaways & FAQ Limpa):**
   - Confirmar a presença do bloco "Em Poucas Linhas" / "Key Takeaways" / "En Pocas Líneas" na introdução.
   - Confirmar a presença da seção `## Perguntas Frequentes` (ou `## Frequently Asked Questions` em EN, `## Preguntas Frecuentes` em ES) com perguntas terminadas em `?` (`### [Pergunta]?`) e separador `---` antes de `### 🔗 Fontes & Referências Consultadas:`, garantindo schema `FAQPage` 100% puro no Google Search Console.
5. **Validação de Imagem & Acessibilidade (Google Imagens & Discover):**
   - Confirmar se a capa existe fisicamente em `public/images/blog-post/<slug>.webp` (proporção 16:9, mín. 1200px) e se o frontmatter possui `imageAlt` descritivo em cada idioma.
6. **Segurança de Links Comerciais:** Se o artigo contiver links externos de afiliados ou parceiros de e-commerce, verificar se possuem obrigatoriamente `rel="nofollow sponsored noopener noreferrer"` e a nota de transparência editorial.

---

## 3. Passo a Passo de Execução da Publicação Multilíngue

Quando o usuário ou o orquestrador disparar a publicação:

1. **Obter o Próximo ID Sequencial:**
   - Liste os arquivos existentes em `src/content/blog/`.
   - Identifique o maior número de `id` nos frontmatters existentes.
   - Atribua `maior_id + 1` para o artigo em português, `maior_id + 2` para o inglês e `maior_id + 3` para o espanhol.

2. **Gerar e Salvar os Arquivos MDX:**
   - `src/content/blog/<slug>.mdx` (Português, `lang: 'pt'`)
   - `src/content/blog/<slug>-en.mdx` (Inglês, `lang: 'en'`, `translationOf: '<slug>'`)
   - `src/content/blog/<slug>-es.mdx` (Espanhol, `lang: 'es'`, `translationOf: '<slug>'`)

3. **Garantir a Capa Otimizada:**
   - Confirme a existência do arquivo de capa compartilhado em `public/images/blog-post/<slug>.webp`.

4. **Validação SEO & Build Local (Zero-Error Policy):**
   - Execute `npm run seo:audit` (obrigatório) para validar links internos, `<ReadAlso>`, anti-canibalização, autoria nominal, mínimo de 800 palavras e existência de capa `.webp`.
   - Quando `astro` estiver disponível localmente, execute também `npm run build && npm run seo:audit:dist`.
   - Se qualquer auditoria retornar código de saída diferente de 0, **interrompa o fluxo imediatamente**, corrija o problema e nunca commite conteúdo fora do padrão. O GitHub Actions executará novamente `seo:audit` e `seo:audit:dist` antes de liberar o deploy em produção.

5. **Deploy Contínuo via Git:**
   - Execute com segurança:
     ```bash
     git add src/content/blog/<slug>* public/images/ scripts/published-history.json
     git commit -m "feat(blog): publicar <slug> em pt/en/es"
     git push origin main
     ```
   - O pipeline de CI/CD (GitHub Actions) iniciará automaticamente o deploy em produção e notificará os motores de busca (Bing/Yandex) via **IndexNow**.
   - Opcionalmente, pode-se disparar a notificação imediata das novas URLs via terminal: `npm run indexnow`.

