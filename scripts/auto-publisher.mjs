/**
 * Onda Conecta — Script de Publicação Autônoma de Notícias e Tendências
 * 
 * Executa:
 * 1. Coleta de notícias globais recentes via feeds RSS (Google News / Fontes Globais)
 * 2. Filtragem e prevenção de matérias duplicadas
 * 3. Geração editorial com IA (Gemini API) seguindo a skill onda-writer (PT, EN, ES)
 * 4. Validação e salvamento dos arquivos .mdx em src/content/blog/
 */

import fs from 'fs'
import path from 'path'

// Categorias monitoradas e suas consultas de busca globais
// Categorias monitoradas com fontes globais e nacionais de alta relevância
const CATEGORIES = [
  {
    name: 'Inovação & IA',
    enName: 'Innovation & AI',
    esName: 'Innovación e IA',
    globalQuery: 'when:48h (artificial intelligence breakthrough OR generative AI business OR autonomous AI agents OR LLM)',
    brQuery: 'when:48h (inteligência artificial OR IA generativa OR agentes autônomos OR automação) site:tecmundo.com.br OR site:canaltech.com.br OR site:olhardigital.com.br OR site:exame.com OR site:epocanegocios.globo.com'
  },
  {
    name: 'Mercado & Negócios',
    enName: 'Business & Markets',
    esName: 'Mercados y Negocios',
    globalQuery: 'when:48h (global markets economy OR venture capital OR startup funding OR tech acquisitions)',
    brQuery: 'when:48h (mercado financeiro OR startups OR venture capital OR aquisição) site:braziljournal.com OR site:neofeed.com.br OR site:startse.com OR site:infomoney.com.br OR site:pipelinevalor.globo.com'
  },
  {
    name: 'Finanças Pessoais',
    enName: 'Personal Finance',
    esName: 'Finanzas Personales',
    globalQuery: 'when:48h (personal finance strategies OR smart investing trends OR fintech crypto wealth)',
    brQuery: 'when:48h (finanças pessoais OR investimentos OR Selic OR dividendos OR planejamento financeiro) site:infomoney.com.br OR site:valorinveste.globo.com OR site:einvestidor.estadao.com.br OR site:inteligenciafinanceira.com.br'
  },
  {
    name: 'Saúde & Bem-estar',
    enName: 'Health & Wellness',
    esName: 'Salud y Bienestar',
    globalQuery: 'when:48h (longevity science OR mental health wellness OR preventative medicine biotech fitness)',
    brQuery: 'when:48h (longevidade OR saúde preventiva OR bem-estar OR medicina OR saúde mental) site:saude.abril.com.br OR site:uol.com.br/vivabem OR site:ge.globo.com/eu-atleta OR site:drauziovarella.uol.com.br'
  },
  {
    name: 'Estética & Beleza',
    enName: 'Beauty & Aesthetics',
    esName: 'Estética y Belleza',
    globalQuery: 'when:48h (skincare clinical breakthrough OR beauty aesthetics trends OR dermatology cosmetics)',
    brQuery: 'when:48h (skincare OR procedimentos estéticos OR beleza OR dermatologia OR cuidados com a pele) site:vogue.globo.com/beleza OR site:marieclaire.globo.com/beleza OR site:revistaglamour.globo.com/beleza'
  },
  {
    name: 'Estilo de Vida & Viagens',
    enName: 'Lifestyle & Travel',
    esName: 'Estilo de Vida y Viajes',
    globalQuery: 'when:48h (emerging travel destinations OR luxury lifestyle trends OR digital nomad remote work)',
    brQuery: 'when:48h (viagens OR destinos tendência OR turismo de experiência OR estilo de vida) site:viagemeturismo.abril.com.br OR site:guiaviajarmelhor.com.br OR site:melhoresdestinos.com.br OR site:revistapegn.globo.com'
  },
  {
    name: 'Tendências',
    enName: 'Trends',
    esName: 'Tendencias',
    globalQuery: 'when:48h (global consumer trends OR future of work OR modern culture trends)',
    brQuery: 'when:48h (tendência de consumo OR comportamento OR novas tecnologias) site:meioemensagem.com.br OR site:startse.com OR site:fastcompanybrasil.com'
  },
  {
    name: 'Tecnologia',
    enName: 'Technology',
    esName: 'Tecnología',
    globalQuery: 'when:48h (semiconductors OR quantum computing OR cybersecurity threat software)',
    brQuery: 'when:48h (tecnologia OR cibersegurança OR semicondutores OR software) site:canaltech.com.br OR site:tecmundo.com.br OR site:convergenciadigital.com.br'
  },
  {
    name: 'Sustentabilidade',
    enName: 'Sustainability',
    esName: 'Sostenibilidad',
    globalQuery: 'when:48h (carbon credit market OR climate tech renewable energy ESG)',
    brQuery: 'when:48h (mercado de carbono OR sustentabilidade OR energia solar OR ESG Brasil) site:reset.com.br OR site:exame.com/esg OR site:umsoplaneta.globo.com'
  }
]

const BLOG_DIR = path.resolve('src/content/blog')
const HISTORY_FILE = path.resolve('scripts/published-history.json')

// Função para buscar notícias recentes no Google News RSS (Global ou Brasil)
async function fetchLatestNews(query, isBrazil = false) {
  const params = isBrazil
    ? 'hl=pt-BR&gl=BR&ceid=BR:pt-419'
    : 'hl=en-US&gl=US&ceid=US:en'
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${params}`
  const res = await fetch(url)
  const xml = await res.text()

  const items = []
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || []

  for (const itemXml of itemMatches.slice(0, 6)) {
    const titleMatch = itemXml.match(/<title>(.*?)<\/title>/)
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/)
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)
    const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/)

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
        link: linkMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
        source: sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : (isBrazil ? 'Fonte Nacional' : 'Global Source')
      })
    }
  }

  return items
}

// Histórico para evitar matérias repetidas
function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'))
    } catch (e) {
      return []
    }
  }
  return []
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-200), null, 2))
}

// Obter próximo ID disponível nos arquivos existentes
function getNextId() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  let maxId = 0

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const match = content.match(/id:\s*(\d+)/)
    if (match) {
      const id = parseInt(match[1], 10)
      if (id > maxId) maxId = id
    }
  }

  return maxId + 1
}

// Redação via Gemini API
async function generateArticleWithGemini(newsItem, category, apiKey) {
  const prompt = `
Você é o editor-chefe do portal "Onda Conecta" (portal focado em tendências, novidades e inovação mundial com alto foco no público e mercado brasileiro).

Notícia base:
Título: "${newsItem.title}"
Fonte/Link: ${newsItem.link}
Categoria: ${category.name}

Gere um conteúdo jornalístico profundo, agradável, dinâmico e otimizado para TOP 1 NO GOOGLE.
A notícia deve analisar o acontecimento global e explicar:
- O que está acontecendo no cenário mundial.
- Por que isso é uma grande tendência ou influência.
- Como isso impacta diretamente empresas, profissionais e o mercado no Brasil.

Gere a resposta EXATAMENTE no seguinte formato JSON (sem markdown de formatação ao redor, apenas o JSON puro):

{
  "slug": "slug-amigavel-separado-por-hifens-sem-acentos",
  "pt": {
    "title": "Título magnético em português (max 65 caracteres)",
    "description": "Meta description persuasiva com verbo de ação e benefício (130-155 caracteres)",
    "category": "${category.name}",
    "body": "Corpo completo em Markdown (com H2, H3, bullets, citações e síntese da tendência ao final)"
  },
  "en": {
    "title": "Engaging title in English (max 65 chars)",
    "description": "Compelling meta description in English (130-155 chars)",
    "category": "${category.enName}",
    "body": "Complete body in English formatted in Markdown"
  },
  "es": {
    "title": "Título atractivo en español (max 65 caracteres)",
    "description": "Meta descripción persuasiva en español (130-155 caracteres)",
    "category": "${category.esName}",
    "body": "Cuerpo completo en español formateado en Markdown"
  }
}
`

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  })

  if (!res.ok) {
    throw new Error(`Erro na API do Gemini: ${res.status} - ${await res.text()}`)
  }

  const data = await res.json()
  const rawText = data.candidates[0].content.parts[0].text
  return JSON.parse(rawText)
}

// Salvar artigo MDX
function writeMdx(filename, frontmatter, body) {
  const content = `---
id: ${frontmatter.id}
slug: '${frontmatter.slug}'
lang: '${frontmatter.lang}'
${frontmatter.translationOf ? `translationOf: '${frontmatter.translationOf}'\n` : ''}title: '${frontmatter.title.replace(/'/g, "''")}'
description: '${frontmatter.description.replace(/'/g, "''")}'
imageUrl: '${frontmatter.imageUrl}'
imageAlt: '${frontmatter.imageAlt.replace(/'/g, "''")}'
pubDate: '${frontmatter.pubDate}'
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: '${frontmatter.category}'
readTime: ${frontmatter.readTime}
featured: ${frontmatter.featured || false}
---

${body}
`
  fs.writeFileSync(path.join(BLOG_DIR, filename), content.trim() + '\n')
}

// Execução Principal
async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ ERRO: A variável de ambiente GEMINI_API_KEY não foi configurada!')
    process.exit(1)
  }

  // Sorteia uma categoria ou aceita argumento via linha de comando
  const categoryArg = process.argv[2]
  const category = categoryArg
    ? CATEGORIES.find(c => c.name.toLowerCase().includes(categoryArg.toLowerCase())) || CATEGORIES[0]
    : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

  // Alterna aleatoriamente entre priorizar notícias nacionais ou globais (50%/50%)
  const prioritizeBrazil = Math.random() > 0.5
  console.log(`📡 Buscando notícias para a categoria: ${category.name} (${prioritizeBrazil ? 'Foco: Brasil / Nacional' : 'Foco: Global'}) ...`)
  
  // Coleta tanto notícias nacionais quanto internacionais
  const [brItems, globalItems] = await Promise.all([
    fetchLatestNews(category.brQuery, true),
    fetchLatestNews(category.globalQuery, false)
  ])

  // Une os itens conforme a prioridade da rodada
  const newsItems = prioritizeBrazil ? [...brItems, ...globalItems] : [...globalItems, ...brItems]

  const history = loadHistory()
  const candidate = newsItems.find(item => !history.includes(item.title) && !history.includes(item.link))

  if (!candidate) {
    console.log('ℹ️ Nenhuma notícia nova e não duplicada encontrada no momento.')
    return
  }

  console.log(`⚡ Notícia selecionada: "${candidate.title}"`)
  console.log('🤖 Gerando artigos otimizados em Português, Inglês e Espanhol com a IA...')

  const generated = await generateArticleWithGemini(candidate, category, apiKey)
  const baseId = getNextId()

  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const todayEn = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  const todayEs = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  // Usar uma imagem existente da biblioteca como fallback ou tema
  const fallbackImages = [
    '/images/blog-post/post-1.webp',
    '/images/blog-post/post-2.webp',
    '/images/blog-post/post-3.webp',
    '/images/blog-post/post-4.webp',
    '/images/blog-post/post-6.webp',
    '/images/blog-post/post-7.webp',
    '/images/blog-post/post-8.webp'
  ]
  const chosenImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]

  // 1. Salvar versão em Português
  writeMdx(`${generated.slug}.mdx`, {
    id: baseId,
    slug: generated.slug,
    lang: 'pt',
    title: generated.pt.title,
    description: generated.pt.description,
    imageUrl: chosenImage,
    imageAlt: generated.pt.title,
    pubDate: today,
    category: generated.pt.category,
    readTime: 6,
    featured: true
  }, generated.pt.body)

  // 2. Salvar versão em Inglês
  writeMdx(`${generated.slug}-en.mdx`, {
    id: baseId + 1,
    slug: `${generated.slug}-en`,
    lang: 'en',
    translationOf: generated.slug,
    title: generated.en.title,
    description: generated.en.description,
    imageUrl: chosenImage,
    imageAlt: generated.en.title,
    pubDate: todayEn,
    category: generated.en.category,
    readTime: 6,
    featured: false
  }, generated.en.body)

  // 3. Salvar versão em Espanhol
  writeMdx(`${generated.slug}-es.mdx`, {
    id: baseId + 2,
    slug: `${generated.slug}-es`,
    lang: 'es',
    translationOf: generated.slug,
    title: generated.es.title,
    description: generated.es.description,
    imageUrl: chosenImage,
    imageAlt: generated.es.title,
    pubDate: todayEs,
    category: generated.es.category,
    readTime: 6,
    featured: false
  }, generated.es.body)

  // Registrar no histórico
  history.push(candidate.title)
  history.push(candidate.link)
  saveHistory(history)

  console.log(`✅ Sucesso! 3 artigos publicados:`)
  console.log(`   - PT: src/content/blog/${generated.slug}.mdx`)
  console.log(`   - EN: src/content/blog/${generated.slug}-en.mdx`)
  console.log(`   - ES: src/content/blog/${generated.slug}-es.mdx`)
}

main().catch(err => {
  console.error('❌ Erro durante a execução:', err)
  process.exit(1)
})
