import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog')
const PUBLIC_DIR = path.join(ROOT, 'public')
const DIST_DIR = path.join(ROOT, 'dist')
const HISTORY_PATH = path.join(ROOT, 'scripts', 'published-history.json')
const QUEUE_PATH = path.join(ROOT, 'scripts', 'editorial-queue.json')
const HTACCESS_PATH = path.join(PUBLIC_DIR, '.htaccess')

const VALID_CATEGORIES = new Set([
  'Inovação & IA',
  'Mercado & Negócios',
  'Finanças Pessoais',
  'Saúde & Bem-estar',
  'Estética & Beleza',
  'Estilo de Vida & Viagens',
  'Tendências',
  'Sustentabilidade',
  'Comportamento'
])

const LEGACY_LOCALIZED_CATEGORIES = new Set([
  'Innovation & AI', 'Innovación e IA',
  'Market & Business', 'Business & Markets', 'Mercado y Negocios', 'Mercados y Negocios',
  'Personal Finance', 'Finanzas Personales',
  'Health & Wellness', 'Salud y Bienestar',
  'Beauty & Aesthetics', 'Estética y Belleza', 'Estética & Belleza', 'Belleza y Estética',
  'Lifestyle & Travel', 'Estilo de Vida y Viajes',
  'Trends', 'Tendencias',
  'Sustainability', 'Sostenibilidad',
  'Behavior & Culture', 'Comportamiento', 'Comportamiento y Cultura'
])

const NOMINAL_AUTHORS = new Set(['Bernardo Neto', 'Cezar Alfredo'])

const STOP_WORDS = new Set([
  'para', 'como', 'mais', 'menos', 'com', 'sem', 'sobre', 'entre', 'pelo', 'pela',
  'pelos', 'pelas', 'dos', 'das', 'nos', 'nas', 'por', 'que', 'uma', 'uns', 'umas',
  'brasil', 'brasileiros', 'brasileiras', 'brasileiro', 'brasileira', '2026', '2027',
  'novo', 'nova', 'novos', 'novas', 'guia', 'mercado', 'empresas', 'dados', 'era'
])

const args = new Set(process.argv.slice(2))
const CHECK_DIST = args.has('--dist')
const NEW_ARTICLE_ID_THRESHOLD = 600
const MAX_HOME_HTML_BYTES = 350 * 1024

const errors = []
const warnings = []

function normalizeTokens(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(tok => tok.length >= 3 && !STOP_WORDS.has(tok))
}

function jaccardSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA)
  const setB = new Set(tokensB)
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const t of setA) {
    if (setB.has(t)) intersection++
  }
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return null
  const yamlBlock = match[1]
  const body = match[2]
  const data = {}
  for (const line of yamlBlock.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    let val = kv[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    data[kv[1]] = val
  }
  return { data, body }
}

function auditMdxAndHistory() {
  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'))
  const consolidatedSlugs = new Set(history.filter(h => h.consolidatedInto).map(h => h.slug))
  const htaccess = fs.readFileSync(HTACCESS_PATH, 'utf8')

  // 1. Validate .htaccess rules
  if (!htaccess.includes('RewriteCond %{THE_REQUEST}')) {
    errors.push('.htaccess missing external trailing-slash 301 rule (RewriteCond %{THE_REQUEST})')
  }
  for (const oldSlug of consolidatedSlugs) {
    if (!htaccess.includes(oldSlug)) {
      errors.push(`.htaccess missing 301 consolidation rule for deprecated slug: ${oldSlug}`)
    }
  }

  // 2. Scan all MDX files
  const mdxFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
  const slugSet = new Set(mdxFiles.map(f => f.replace(/\.mdx$/, '')))
  const seenIds = new Map()
  const parsedPosts = []

  for (const file of mdxFiles) {
    const fileSlug = file.replace(/\.mdx$/, '')
    const fullPath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(fullPath, 'utf8')
    const parsed = parseFrontmatter(raw)

    if (!parsed) {
      errors.push(`[${file}] Invalid or missing YAML frontmatter`)
      continue
    }

    const { data, body } = parsed
    const numericId = Number(data.id)
    if (!Number.isInteger(numericId) || numericId <= 0) {
      errors.push(`[${file}] Invalid frontmatter id: ${data.id}`)
    } else if (seenIds.has(numericId)) {
      if (numericId > NEW_ARTICLE_ID_THRESHOLD) {
        errors.push(`[${file}] Duplicate id ${numericId} (also in ${seenIds.get(numericId)})`)
      } else {
        warnings.push(`[${file}] Legacy duplicate id ${numericId} (also in ${seenIds.get(numericId)})`)
      }
    } else {
      seenIds.set(numericId, file)
    }

    if (!data.title || !data.description || !data.category || !data.imageUrl) {
      errors.push(`[${file}] Missing required frontmatter fields (title/description/category/imageUrl)`)
    }

    if (data.category) {
      const isCanonical = VALID_CATEGORIES.has(data.category)
      const isLegacyLocalized = numericId <= NEW_ARTICLE_ID_THRESHOLD && LEGACY_LOCALIZED_CATEGORIES.has(data.category)
      if (!isCanonical && !isLegacyLocalized) {
        errors.push(`[${file}] Invalid category "${data.category}"`)
      }
    }

    if (data.imageUrl && !data.imageUrl.startsWith('http')) {
      const imgPath = path.join(PUBLIC_DIR, data.imageUrl.replace(/^\//, ''))
      if (!fs.existsSync(imgPath)) {
        errors.push(`[${file}] Cover image not found on disk: ${data.imageUrl}`)
      }
    }

    // Check ReadAlso & internal /blog/ links
    for (const m of body.matchAll(/<ReadAlso\s+slug="([^"]+)"/g)) {
      const target = m[1]
      if (!slugSet.has(target)) {
        errors.push(`[${file}] Broken <ReadAlso slug="${target}" />`)
      }
    }

    for (const m of body.matchAll(/\]\(\/blog\/([^)#\s]+)\)/g)) {
      const target = m[1]
      if (!slugSet.has(target)) {
        errors.push(`[${file}] Broken internal link (/blog/${target})`)
      }
      if (consolidatedSlugs.has(target.replace(/-(en|es)$/, ''))) {
        errors.push(`[${file}] Internal link points to 301-consolidated slug: /blog/${target}`)
      }
    }

    // Strict quality gates for all new articles (id > 600)
    if (numericId > NEW_ARTICLE_ID_THRESHOLD) {
      const wordCount = body.trim().split(/\s+/).filter(Boolean).length
      if (wordCount < 800) {
        errors.push(`[${file}] Thin content (${wordCount} words < 800 minimum)`)
      }
      if (!NOMINAL_AUTHORS.has(data.author)) {
        errors.push(`[${file}] Author must be a named editor (${[...NOMINAL_AUTHORS].join(' or ')}), got "${data.author}"`)
      }
      if (!/(Em Poucas Linhas|Key Takeaways|En Pocas L[ií]neas)/i.test(body)) {
        errors.push(`[${file}] Missing Key Takeaways summary block`)
      }
      if (!/##\s+(?:Perguntas Frequentes|Frequently Asked Questions|Preguntas Frecuentes)/i.test(body)) {
        errors.push(`[${file}] Missing FAQ section`)
      }
    }

    if ((data.lang || 'pt') === 'pt') {
      parsedPosts.push({ file, slug: fileSlug, id: numericId, title: data.title || '' })
    }
  }

  // 3. Anti-cannibalization check on pending items in editorial-queue.json
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'))
  const historyCorpus = history.map(h => ({
    slug: h.slug,
    tokens: normalizeTokens(`${h.slug} ${h.title || ''}`)
  }))

  for (const [cat, items] of Object.entries(queue.categories || {})) {
    for (const item of items) {
      if (item.status !== 'pending') continue
      const candidateTokens = normalizeTokens(`${item.suggestedSlug || ''} ${item.topic || ''}`)
      for (const prev of historyCorpus) {
        if (item.suggestedSlug === prev.slug) {
          errors.push(`[Queue ${item.id}] Duplicate slug already in history: ${prev.slug}`)
          continue
        }
        const sim = jaccardSimilarity(candidateTokens, prev.tokens)
        if (sim >= 0.55) {
          errors.push(
            `[Queue ${item.id} (${cat})] High semantic overlap (${(sim * 100).toFixed(0)}%) with existing article "${prev.slug}"`
          )
        }
      }
    }
  }

  // 4. Anti-cannibalization check for newly added PT articles (id > 600)
  for (const post of parsedPosts.filter(p => p.id > NEW_ARTICLE_ID_THRESHOLD)) {
    const postTokens = normalizeTokens(`${post.slug} ${post.title}`)
    for (const prev of historyCorpus) {
      if (prev.slug === post.slug) continue
      const sim = jaccardSimilarity(postTokens, prev.tokens)
      if (sim >= 0.6) {
        errors.push(
          `[${post.file}] High semantic overlap (${(sim * 100).toFixed(0)}%) with historical article "${prev.slug}"`
        )
      }
    }
  }

  console.log(`Source audit complete: ${mdxFiles.length} MDX files scanned.`)
}

function walkHtmlFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkHtmlFiles(full))
    } else if (entry.name.endsWith('.html')) {
      results.push(full)
    }
  }
  return results
}

function auditDistBuild() {
  if (!fs.existsSync(DIST_DIR)) {
    errors.push('dist/ directory not found; run npm run build before --dist audit')
    return
  }

  // 1. Check homepage HTML weight (< 350 KB)
  for (const rel of ['index.html', path.join('en', 'index.html'), path.join('es', 'index.html')]) {
    const p = path.join(DIST_DIR, rel)
    if (!fs.existsSync(p)) {
      errors.push(`Missing built homepage: dist/${rel}`)
      continue
    }
    const size = fs.statSync(p).size
    if (size > MAX_HOME_HTML_BYTES) {
      errors.push(`Homepage bloat regression: dist/${rel} is ${(size / 1024).toFixed(1)} KB (limit 350 KB)`)
    }
  }

  // 2. Check all HTML files for duplicate brand title & dirty FAQPage schema
  const htmlFiles = walkHtmlFiles(DIST_DIR)
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8')
    const rel = path.relative(DIST_DIR, file)
    if (html.includes('| Onda Conecta | Onda Conecta')) {
      errors.push(`[dist/${rel}] Duplicated brand suffix in <title>`)
    }
    if (html.includes('FAQPage')) {
      const ldMatches = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
      for (const m of ldMatches) {
        if (!m[1].includes('FAQPage')) continue
        if (/Fontes & Referências|Sources & References|Fuentes & Referencias/i.test(m[1])) {
          errors.push(`[dist/${rel}] Corrupted FAQPage JSON-LD contains Fontes/Sources heading`)
        }
      }
    }
  }

  // 3. Check sitemap-0.xml
  const sitemapPath = path.join(DIST_DIR, 'sitemap-0.xml')
  if (!fs.existsSync(sitemapPath)) {
    errors.push('Missing dist/sitemap-0.xml')
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8')
    const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'))
    for (const item of history.filter(h => h.consolidatedInto)) {
      if (sitemap.includes(`/blog/${item.slug}<`)) {
        errors.push(`Consolidated 301 slug leaked into sitemap-0.xml: ${item.slug}`)
      }
    }
    if (/\/blog\/[a-z0-9-]+-(en|es)</.test(sitemap)) {
      errors.push('Duplicate suffixed /blog/*-en or *-es URL found in sitemap-0.xml')
    }
  }

  console.log(`Dist audit complete: ${htmlFiles.length} HTML files verified.`)
}

auditMdxAndHistory()
if (CHECK_DIST) {
  auditDistBuild()
}

if (warnings.length > 0) {
  console.warn('\nWarnings:')
  for (const w of warnings) console.warn(`  - ${w}`)
}

if (errors.length > 0) {
  console.error(`\nSEO Audit FAILED with ${errors.length} error(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('\nSEO Audit PASSED with 0 errors.')
