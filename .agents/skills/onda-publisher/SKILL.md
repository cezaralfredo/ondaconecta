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
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: '<Categoria Válida>'
readTime: <tempo estimado em minutos, ex: 5>
featured: false # ou true se for manchete principal
---
```

### Categorias Padronizadas:
- `Tendências`
- `Inovação & IA`
- `Mercado & Negócios`
- `Tecnologia`
- `Sustentabilidade`
- `Comportamento`

---

## 2. Passo a Passo de Execução da Publicação Multilíngue

Quando o usuário pedir para publicar um artigo novo:

1. **Obter o Próximo ID Sequencial:**
   - Liste os arquivos existentes em `src/content/blog/`.
   - Leia o maior valor de `id` nos frontmatters existentes e incremente +1 para o artigo em português, e use IDs sequenciais subsequentes para as versões em inglês e espanhol.

2. **Gerar os Slugs e Nomes de Arquivo:**
   - `src/content/blog/<slug>.mdx` (Português, `lang: 'pt'`)
   - `src/content/blog/<slug>-en.mdx` (Inglês, `lang: 'en'`, `translationOf: '<slug>'`)
   - `src/content/blog/<slug>-es.mdx` (Espanhol, `lang: 'es'`, `translationOf: '<slug>'`)

3. **Garantir a Imagem de Capa:**
   - Salve a arte compartilhada entre as versões em `public/images/blog-post/<slug>.webp`.

4. **Validação do Build Local:**
   - Execute no terminal: `npm run build` para garantir que as rotas e tipos Zod estão perfeitos.

5. **Deploy Automático via Git:**
   - Execute:
     ```bash
     git add src/content/blog/<slug>* public/images/
     git commit -m "feat(blog): publicar <slug> em pt/en/es"
     git push origin main
     ```
   - O GitHub Actions processará o build estático de todos os idiomas e enviará via FTP para a produção.
