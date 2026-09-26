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
  },
  {
    name: 'Comportamento',
    enName: 'Behavior & Culture',
    esName: 'Comportamiento y Cultura',
    globalQuery: 'when:48h (social trends OR digital culture trends OR modern human behavior psychology)',
    brQuery: 'when:48h (comportamento digital OR cultura pop OR hábitos contemporâneos OR novas gerações) site:uol.com.br OR site:g1.globo.com OR site:folha.uol.com.br OR site:estadao.com.br'
  }
]

// Grade Semanal de Publicações Automatizadas (2x ao dia)
// Dias: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
// Períodos: 'morning' (08:00 BRT) e 'evening' (18:00 BRT)
const EDITORIAL_SCHEDULE = {
  1: { morning: 'Mercado & Negócios', evening: 'Saúde & Bem-estar' },
  2: { morning: 'Inovação & IA', evening: 'Tendências' },
  3: { morning: 'Finanças Pessoais', evening: 'Estética & Beleza' },
  4: { morning: 'Inovação & IA', evening: 'Sustentabilidade' },
  5: { morning: 'Mercado & Negócios', evening: 'Estilo de Vida & Viagens' },
  6: { morning: 'Inovação & IA', evening: 'Comportamento' },
  0: { morning: 'Tendências', evening: 'Estilo de Vida & Viagens' }
}

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
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'))
      return Array.isArray(data) ? data : []
    } catch (e) {
      return []
    }
  }
  return []
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-200), null, 2))
}

// Verificação inteligente de duplicidade contra o histórico estruturado
function isItemDuplicate(item, history) {
  const norm = str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').trim()
  const itemTitle = norm(item.title)
  const itemWords = itemTitle.split(/\s+/).filter(w => w.length > 3)
  const itemLink = (item.link || '').trim().toLowerCase()

  return history.some(entry => {
    if (typeof entry === 'string') {
      const entryNorm = norm(entry)
      return entryNorm === itemTitle || (itemLink && entry.toLowerCase().includes(itemLink))
    }

    const entryTitle = norm(entry.title)
    if (entryTitle && (entryTitle === itemTitle || entryTitle.includes(itemTitle) || itemTitle.includes(entryTitle))) {
      return true
    }

    if (itemWords.length >= 4 && entryTitle) {
      const matches = itemWords.filter(w => entryTitle.includes(w))
      if (matches.length / itemWords.length >= 0.7) return true
    }

    if (itemLink && Array.isArray(entry.sources) && entry.sources.some(s => s && s.toLowerCase().includes(itemLink))) {
      return true
    }

    return false
  })
}

// Calcular tempo estimado de leitura (200 palavras por minuto)
function calculateReadTime(text) {
  const words = (text || '').replace(/[#*`_\[\]()>-]/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
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
A notícia deve analisar o acontecimento e explicar:
- O que está acontecendo no cenário mundial ou nacional.
- Por que isso é uma grande tendência ou influência.
- Como isso impacta diretamente empresas, profissionais e o mercado no Brasil.
- Citar nominalmente a fonte de apuração com hiperlink Markdown apontando para "${newsItem.link}".
- Incluir no final do corpo uma seção explícita "### 🔗 Fontes & Referências Consultadas:" com o link da notícia original [${newsItem.title}](${newsItem.link}).

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

// Salvar artigo MDX com escape seguro de YAML
function writeMdx(filename, frontmatter, body) {
  const content = `---
id: ${frontmatter.id}
slug: ${JSON.stringify(frontmatter.slug)}
lang: ${JSON.stringify(frontmatter.lang)}
${frontmatter.translationOf ? `translationOf: ${JSON.stringify(frontmatter.translationOf)}\n` : ''}title: ${JSON.stringify(frontmatter.title)}
description: ${JSON.stringify(frontmatter.description)}
imageUrl: ${JSON.stringify(frontmatter.imageUrl)}
imageAlt: ${JSON.stringify(frontmatter.imageAlt)}
pubDate: ${JSON.stringify(frontmatter.pubDate)}
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: ${JSON.stringify(frontmatter.category)}
readTime: ${frontmatter.readTime}
featured: ${frontmatter.featured || false}
---

${body}
`
  fs.writeFileSync(path.join(BLOG_DIR, filename), content.trim() + '\n')
}

// Obter categoria estrategicamente programada para o dia e horário atual (Horário de Brasília)
function getScheduledCategory(overrideArg) {
  if (overrideArg) {
    const found = CATEGORIES.find(c => c.name.toLowerCase().includes(overrideArg.toLowerCase()))
    if (found) return found
  }

  // Obter hora e dia da semana atuais no fuso horário de Brasília (America/Sao_Paulo)
  const now = new Date()
  const brTimeStr = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  const brDate = new Date(brTimeStr)
  const dayOfWeek = brDate.getDay() // 0=Domingo, 1=Segunda, ..., 6=Sábado
  const hour = brDate.getHours()

  // Se for antes das 14h BRT, executa a edição da manhã (08h); após as 14h, a edição da tarde (18h)
  const period = hour < 14 ? 'morning' : 'evening'
  const daySchedule = EDITORIAL_SCHEDULE[dayOfWeek] || EDITORIAL_SCHEDULE[1]
  const targetCategoryName = daySchedule[period] || 'Tendências'

  console.log(`📅 Agenda Editorial Ativa: Dia ${dayOfWeek} (${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dayOfWeek]}), Período: ${period === 'morning' ? 'Manhã (08h BRT)' : 'Tarde (18h BRT)'} -> Categoria: "${targetCategoryName}"`)

  return CATEGORIES.find(c => c.name.toLowerCase() === targetCategoryName.toLowerCase()) || CATEGORIES[0]
}

// Execução Principal
async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ ERRO: A variável de ambiente GEMINI_API_KEY não foi configurada!')
    process.exit(1)
  }

  // Determina a categoria com base na agenda editorial estratégica ou no argumento de teste
  const category = getScheduledCategory(process.argv[2])

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
  const candidate = newsItems.find(item => !isItemDuplicate(item, history))

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

  const finalCategory = category.name === 'Tecnologia' ? 'Inovação & IA' : category.name
  const ptReadTime = calculateReadTime(generated.pt.body)
  const enReadTime = calculateReadTime(generated.en.body)
  const esReadTime = calculateReadTime(generated.es.body)

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
    category: finalCategory,
    readTime: ptReadTime,
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
    readTime: enReadTime,
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
    readTime: esReadTime,
    featured: false
  }, generated.es.body)

  // Registrar no histórico padronizado (compatível com a esteira do Onda Conecta)
  const newEntry = {
    id: baseId,
    slug: generated.slug,
    category: finalCategory,
    focus: prioritizeBrazil ? 'Nacional (50/50)' : 'Global com impacto no Brasil (50/50)',
    publishedAt: new Date().toISOString(),
    sources: [candidate.source, candidate.link].filter(Boolean),
    title: candidate.title
  }
  history.push(newEntry)
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
