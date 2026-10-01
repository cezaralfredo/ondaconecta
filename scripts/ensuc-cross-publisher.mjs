/**
 * Onda Conecta & ENSUC — Script de Publicação Cruzada (Cross-Posting)
 * 
 * Envia automaticamente artigos da categoria "Sustentabilidade" e "Mercado de Carbono"
 * para o blog da ENSUC (https://ensuc.com.br), gerando Link Building de alta autoridade
 * com backlinks diretos para o portal Onda Conecta (https://ondaconecta.com.br).
 * 
 * Uso:
 *   node scripts/ensuc-cross-publisher.mjs --latest
 *   node scripts/ensuc-cross-publisher.mjs fim-do-esg-de-planilha-carbono-balanco-auditado
 *   node scripts/ensuc-cross-publisher.mjs --all-sustainability
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ONDA_BLOG_DIR = path.resolve('src/content/blog')
const ONDA_PUBLIC_DIR = path.resolve('public')
const ENSUC_DIR = process.env.ENSUC_PROJECT_PATH || 'E:\\Projetos\\ENSUC'
const ENSUC_BLOG_DIR = path.join(ENSUC_DIR, 'src', 'content', 'blog')
const ENSUC_IMAGES_DIR = path.join(ENSUC_DIR, 'public', 'images', 'blog')

/**
 * Verifica se a categoria ou conteúdo pertence ao escopo de Sustentabilidade / Carbono
 * @param {string} category
 * @param {string} [title]
 * @returns {boolean}
 */
export function isSustainabilityCategory(category = '', title = '') {
  const norm = str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const text = norm(`${category} ${title}`)

  return (
    text.includes('sustentabilidade') ||
    text.includes('esg') ||
    text.includes('carbono') ||
    text.includes('clima') ||
    text.includes('sustainability') ||
    text.includes('sostenibilidad') ||
    text.includes('descarbonizacao') ||
    text.includes('credito de carbono')
  )
}

/**
 * Limpa o corpo em MDX para garantir compatibilidade com o Markdown padrão do Astro
 * @param {string} rawBody
 * @returns {string}
 */
function cleanBodyForMarkdown(rawBody = '') {
  return rawBody
    // Remove declarações de import JSX / Astro
    .replace(/^import\s+.*?from\s+['"].*?['"].*?$/gm, '')
    // Remove tags de componentes Astro/JSX fechadas
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '')
    // Remove tags de componentes Astro/JSX com filhos
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '')
    .trim()
}

/**
 * Extrai dados do frontmatter e conteúdo do MDX
 * @param {string} filePath
 */
function parseOndaArticle(filePath) {
  if (!fs.existsSync(filePath)) return null
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/)
  if (!match) return null

  const yaml = match[1]
  const body = match[2]

  const getField = (field) => {
    const m = yaml.match(new RegExp(`^${field}:\\s*(?:["'](.*?)["']|(.*?))$`, 'm'))
    if (!m) return ''
    return (m[1] !== undefined ? m[1] : m[2]).trim()
  }

  return {
    id: parseInt(getField('id'), 10) || 0,
    slug: getField('slug'),
    lang: getField('lang') || 'pt',
    translationOf: getField('translationOf'),
    title: getField('title'),
    description: getField('description'),
    category: getField('category') || 'Sustentabilidade',
    readTime: parseInt(getField('readTime'), 10) || 5,
    imageUrl: getField('imageUrl'),
    imageAlt: getField('imageAlt'),
    pubDate: getField('pubDate'),
    body: cleanBodyForMarkdown(body)
  }
}

/**
 * Copia a imagem de capa para o diretório de imagens do blog da ENSUC
 * @param {string} sourceImgUrl
 * @param {string} targetSlug
 * @returns {string} Caminho relativo para o frontmatter da ENSUC
 */
function syncArticleImage(sourceImgUrl, targetSlug) {
  if (!fs.existsSync(ENSUC_IMAGES_DIR)) {
    fs.mkdirSync(ENSUC_IMAGES_DIR, { recursive: true })
  }

  if (!sourceImgUrl) return '/og-image.png'

  const cleanSourcePath = sourceImgUrl.replace(/^\//, '').replace(/\//g, path.sep)
  const fullSourcePath = path.join(ONDA_PUBLIC_DIR, cleanSourcePath)

  if (fs.existsSync(fullSourcePath)) {
    const ext = path.extname(fullSourcePath) || '.webp'
    const targetFilename = `artigo-${targetSlug}${ext}`
    const targetPath = path.join(ENSUC_IMAGES_DIR, targetFilename)

    fs.copyFileSync(fullSourcePath, targetPath)
    return `/images/blog/${targetFilename}`
  }

  // Fallback caso a imagem seja uma URL absoluta ou externa
  if (sourceImgUrl.startsWith('http')) {
    return sourceImgUrl
  }

  return '/og-image.png'
}

/**
 * Publica um artigo (e suas versões EN/ES se existirem) no projeto ENSUC
 * @param {Object} articleData
 * @param {Object} [options]
 * @param {boolean} [options.skipGit]
 * @param {boolean} [options.force]
 */
export async function crossPostToEnsuc(articleData, options = {}) {
  const { skipGit = false, force = false } = options

  if (!fs.existsSync(ENSUC_DIR)) {
    console.warn(`⚠️ [ENSUC Cross-Publisher] Pasta do projeto ENSUC não encontrada em: ${ENSUC_DIR}`)
    return { success: false, reason: 'ensuc_directory_not_found' }
  }

  if (!force && !isSustainabilityCategory(articleData.category, articleData.title)) {
    console.log(`ℹ️ [ENSUC Cross-Publisher] Artigo "${articleData.title}" não é da categoria Sustentabilidade (Categoria atual: "${articleData.category}"). Cross-posting ignorado.`)
    return { success: false, reason: 'category_not_sustainability' }
  }

  console.log(`\n🌱 [ENSUC Cross-Publisher] Sincronizando artigo com o blog da ENSUC para Link Building...`)
  console.log(`📰 Título: "${articleData.title}"`)

  const baseSlug = (articleData.translationOf || articleData.slug).replace(/-(en|es)$/, '')
  const dateFormatted = new Date().toISOString().split('T')[0]

  // 1. Sincronizar imagem de capa
  const ensucImagePath = syncArticleImage(articleData.imageUrl, baseSlug)

  // 2. Localizar as 3 versões (PT, EN, ES)
  const variants = [
    { lang: 'pt', suffix: '', filename: `${baseSlug}.mdx` },
    { lang: 'en', suffix: '-en', filename: `${baseSlug}-en.mdx` },
    { lang: 'es', suffix: '-es', filename: `${baseSlug}-es.mdx` }
  ]

  let publishedCount = 0

  for (const variant of variants) {
    const srcFilePath = path.join(ONDA_BLOG_DIR, variant.filename)
    if (!fs.existsSync(srcFilePath)) continue

    const variantArticle = parseOndaArticle(srcFilePath)
    if (!variantArticle) continue

    const isEn = variant.lang === 'en'
    const isEs = variant.lang === 'es'

    // URL original do artigo no Onda Conecta para Link Building direto (Dofollow)
    const langPrefix = isEn ? '/en' : isEs ? '/es' : ''
    const ondaPostUrl = `https://ondaconecta.com.br${langPrefix}/blog/${variantArticle.slug}/`

    // Bloco exclusivo de Link Building e autoridade editorial
    const attributionBox = isEn
      ? `\n\n---\n\n> 🔗 **Editorial Source & Authority:** This article was originally researched and published by the intelligence and innovation portal [Onda Conecta](${ondaPostUrl}), under the title *"${variantArticle.title}"*. Explore in-depth market analyses and strategic trends at [ondaconecta.com.br](https://ondaconecta.com.br/).`
      : isEs
        ? `\n\n---\n\n> 🔗 **Fuente y Crédito Editorial:** Este artículo fue investigado y publicado originalmente en el portal de tendencias y mercado [Onda Conecta](${ondaPostUrl}), con el título *"${variantArticle.title}"*. Acceda a la cobertura completa y análisis estratégicos en [ondaconecta.com.br](https://ondaconecta.com.br/).`
        : `\n\n---\n\n> 🔗 **Fonte e Crédito Editorial:** Este artigo foi originalmente apurado e publicado no portal de inteligência e mercado [Onda Conecta](${ondaPostUrl}), sob o título *"${variantArticle.title}"*. Acesse a cobertura completa e análises de tendências em [ondaconecta.com.br](https://ondaconecta.com.br/).`

    const targetFilename = `artigo-${baseSlug}${variant.suffix}.md`
    const targetFilePath = path.join(ENSUC_BLOG_DIR, targetFilename)

    const readTimeText = isEn
      ? `${variantArticle.readTime || 5} min read`
      : isEs
        ? `${variantArticle.readTime || 5} min de lectura`
        : `${variantArticle.readTime || 5} min de leitura`

    const badgeText = isEn
      ? 'ESG & Sustainability'
      : isEs
        ? 'ESG y Sostenibilidad'
        : 'ESG & Sustentabilidade'

    const ensucFrontmatter = `---
title: ${JSON.stringify(variantArticle.title)}
description: ${JSON.stringify(variantArticle.description)}
datePublished: ${dateFormatted}
author: "Redação Onda Conecta"
image: ${JSON.stringify(ensucImagePath)}
badge: ${JSON.stringify(badgeText)}
category: "Sustentabilidade"
readTime: ${JSON.stringify(readTimeText)}
keywords: "créditos de carbono, mercado de carbono, ESG, sustentabilidade, descarbonização, Onda Conecta, SBCE"
---

${variantArticle.body}
${attributionBox}
`

    fs.writeFileSync(targetFilePath, ensucFrontmatter.trim() + '\n')
    publishedCount++
    console.log(`   ✅ ENSUC [${variant.lang.toUpperCase()}]: src/content/blog/${targetFilename}`)
  }

  // 3. Git commit e push no repositório da ENSUC para disparar o deploy contínuo no DirectAdmin
  if (!skipGit && publishedCount > 0) {
    try {
      console.log(`\n🚀 Enviando atualização para o repositório da ENSUC (GitHub Actions -> DirectAdmin FTP)...`)
      
      const status = execSync('git status --porcelain', { cwd: ENSUC_DIR, encoding: 'utf-8' })
      if (!status.trim()) {
        console.log('ℹ️ Nenhuma alteração pendente no repositório da ENSUC.')
        return { success: true, publishedCount, pushed: false }
      }

      execSync('git add src/content/blog/ public/images/blog/', { cwd: ENSUC_DIR, stdio: 'inherit' })
      execSync(`git commit -m "feat(blog): cross-post ${baseSlug} de Onda Conecta para link building"`, { cwd: ENSUC_DIR, stdio: 'inherit' })
      execSync('git push origin main', { cwd: ENSUC_DIR, stdio: 'inherit' })

      console.log('🎉 SUCESSO: Push concluído na ENSUC! O GitHub Actions iniciou o deploy para ensuc.com.br.')
      return { success: true, publishedCount, pushed: true }
    } catch (gitErr) {
      console.error('⚠️ Falha ao executar git commit/push na ENSUC:', gitErr.message)
      return { success: true, publishedCount, pushed: false, gitError: gitErr.message }
    }
  }

  return { success: true, publishedCount, pushed: false }
}

async function main() {
  const arg = process.argv[2] || '--latest'

  let targetSlug = ''

  if (arg === '--all-sustainability') {
    const files = fs.readdirSync(ONDA_BLOG_DIR)
      .filter(f => f.endsWith('.mdx') && !f.endsWith('-en.mdx') && !f.endsWith('-es.mdx'))
    
    console.log(`🔍 Varrendo ${files.length} artigos do Onda Conecta para encontrar pautas de Sustentabilidade...`)
    let count = 0
    for (const file of files) {
      const art = parseOndaArticle(path.join(ONDA_BLOG_DIR, file))
      if (art && isSustainabilityCategory(art.category, art.title)) {
        console.log(`\n👉 Encontrado: "${art.title}" (${art.slug})`)
        await crossPostToEnsuc(art, { skipGit: true, force: true })
        count++
      }
    }

    if (count > 0) {
      console.log(`\n📦 Enviando todos os ${count} artigos de sustentabilidade para o Git da ENSUC...`)
      execSync('git add src/content/blog/ public/images/blog/', { cwd: ENSUC_DIR, stdio: 'inherit' })
      execSync(`git commit -m "feat(blog): cross-post em lote de ${count} artigos de Sustentabilidade de Onda Conecta"`, { cwd: ENSUC_DIR, stdio: 'inherit' })
      execSync('git push origin main', { cwd: ENSUC_DIR, stdio: 'inherit' })
      console.log('🎉 Deploy de lote enviado para a ENSUC com sucesso!')
    } else {
      console.log('Nenhum artigo antigo de sustentabilidade pendente.')
    }
    return
  }

  if (arg === '--latest') {
    const files = fs.readdirSync(ONDA_BLOG_DIR)
      .filter(f => f.endsWith('.mdx') && !f.endsWith('-en.mdx') && !f.endsWith('-es.mdx'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(ONDA_BLOG_DIR, a))
        const statB = fs.statSync(path.join(ONDA_BLOG_DIR, b))
        return statB.mtimeMs - statA.mtimeMs
      })

    if (files.length === 0) {
      console.log('Nenhum artigo encontrado em src/content/blog/')
      return
    }
    targetSlug = files[0].replace(/\.mdx$/, '')
  } else {
    targetSlug = arg.replace(/\.mdx$/, '').replace(/^artigo-/, '')
  }

  const targetFile = path.join(ONDA_BLOG_DIR, `${targetSlug}.mdx`)
  const article = parseOndaArticle(targetFile)

  if (!article) {
    console.error(`❌ Artigo não encontrado: ${targetFile}`)
    return
  }

  await crossPostToEnsuc(article)
}

if (process.argv[1] && process.argv[1].endsWith('ensuc-cross-publisher.mjs')) {
  main().catch(err => {
    console.error('Falha geral no ENSUC Cross-Publisher:', err)
  })
}
