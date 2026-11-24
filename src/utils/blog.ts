// Utility functions for blog posts
import type { CollectionEntry } from 'astro:content'
import { normalizeCategory } from '@/consts'

/**
 * Calculate read time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(text: string | undefined): number {
  if (!text) return 1
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)

  return readTime
}

/**
 * Get related posts based on category
 */
export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string,
  currentCategory: string,
  limit: number = 6,
  currentLang?: string
): CollectionEntry<'blog'>[] {
  // Filtra primeiro pelo mesmo idioma para não misturar traduções e ordena pelos mais recentes
  const langFilteredPosts = (currentLang
    ? posts.filter(post => (post.data.lang || 'pt') === currentLang)
    : posts
  ).sort((a, b) => (b.data.id || 0) - (a.data.id || 0))

  const normalizedCurrent = normalizeCategory(currentCategory)

  // First try to get posts from same category
  const sameCategoryPosts = langFilteredPosts.filter(
    post => normalizeCategory(post.data.category) === normalizedCurrent && post.id !== currentSlug
  )

  // If we have enough posts from same category, use them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit)
  }

  // If not enough posts from same category, fill with other posts of the same language
  const otherPosts = langFilteredPosts.filter(
    post => normalizeCategory(post.data.category) !== normalizedCurrent && post.id !== currentSlug
  )

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}

/**
 * Get navigation links for previous and next posts
 */
export function getPostNavigation(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string,
  currentLang?: string
): { previous: CollectionEntry<'blog'> | null; next: CollectionEntry<'blog'> | null } {
  // Filtra pelo mesmo idioma para a navegação ser coerente
  const langFilteredPosts = currentLang
    ? posts.filter(post => (post.data.lang || 'pt') === currentLang)
    : posts

  // Sort posts by id (newest first)
  const sortedPosts = [...langFilteredPosts].sort((a, b) => a.data.id - b.data.id)
  const currentIndex = sortedPosts.findIndex(post => post.id === currentSlug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  const previous = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const next = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return { previous, next }
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const monthMap: Record<string, number> = {
  // Português
  janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
  // Espanhol
  enero: 0, febrero: 1, marzo: 2, mayo: 4, junio: 5, julio: 6,
  septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
  // Inglês
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
}

/**
 * Converte strings de datas em múltiplos idiomas (PT/EN/ES) em um objeto Date válido
 */
export function parsePubDate(dateStr: string | Date | undefined): Date {
  if (!dateStr) return new Date()
  if (dateStr instanceof Date) return dateStr
  const directDate = new Date(dateStr)
  if (!isNaN(directDate.getTime())) return directDate

  // Formatos: "11 de Setembro de 2026", "10 de Marzo de 2026"
  const ptEsMatch = String(dateStr).match(/(\d{1,2})\s+de\s+([a-zA-ZçÇ]+)\s+de\s+(\d{4})/i)
  if (ptEsMatch) {
    const day = parseInt(ptEsMatch[1], 10)
    const monthName = ptEsMatch[2].toLowerCase()
    const year = parseInt(ptEsMatch[3], 10)
    const month = monthMap[monthName] ?? 0
    return new Date(year, month, day, 12, 0, 0)
  }

  // Formatos: "September 11, 2026"
  const enMatch = String(dateStr).match(/([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/i)
  if (enMatch) {
    const monthName = enMatch[1].toLowerCase()
    const day = parseInt(enMatch[2], 10)
    const year = parseInt(enMatch[3], 10)
    const month = monthMap[monthName] ?? 0
    return new Date(year, month, day, 12, 0, 0)
  }

  return new Date()
}

/**
 * Resolve autoria nominal real E-E-A-T quando o frontmatter usa rótulo genérico da redação
 */
export function resolveEditorialAuthor(rawAuthor: string | undefined, category: string | undefined): { name: string; jobTitle: string } {
  const normalized = (rawAuthor || '').trim()
  const isGeneric =
    !normalized ||
    /^(Reda[çc][ãa]o|Redaci[oó]n|Onda Conecta Editorial Team)/i.test(normalized)

  if (!isGeneric) {
    return { name: normalized, jobTitle: 'Editor & Especialista' }
  }

  const canonicalCat = normalizeCategory(category)
  const techCategories = new Set(['Inovação & IA', 'Sustentabilidade', 'Saúde & Bem-estar', 'Estética & Beleza'])
  if (techCategories.has(canonicalCat)) {
    return { name: 'Bernardo Neto', jobTitle: 'Tech Lead & Editor Técnico' }
  }
  return { name: 'Cezar Alfredo', jobTitle: 'Estrategista Digital & Editor-Chefe' }
}

/**
 * Seleciona os posts exibidos na Home (últimos N gerais + até K por categoria) para evitar HTML inchado e preservar Core Web Vitals
 */
export function selectHomeBlogPosts<T extends { id: number; category: string }>(
  posts: T[],
  maxPerCategory = 4,
  minLatest = 18
): T[] {
  const sorted = [...posts].sort((a, b) => b.id - a.id)
  const selectedIds = new Set<number>()
  const categoryCounts = new Map<string, number>()

  for (const post of sorted.slice(0, minLatest)) {
    selectedIds.add(post.id)
    categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1)
  }

  for (const post of sorted) {
    const count = categoryCounts.get(post.category) || 0
    if (count < maxPerCategory) {
      selectedIds.add(post.id)
      categoryCounts.set(post.category, count + 1)
    }
  }

  return sorted.filter(post => selectedIds.has(post.id))
}

/**
 * Extrai perguntas e respostas da seção FAQ do Markdown/MDX para dados estruturados GEO / FAQPage
 */
export function extractFaqFromContent(content: string | undefined): Array<{ question: string; answer: string }> {
  if (!content) return []

  const faqs: Array<{ question: string; answer: string }> = []
  // Isola estritamente a seção FAQ e encerra antes de separadores horizontais, bloco de Fontes ou próximo H2
  const faqSectionMatch = content.match(
    /##\s+(?:Perguntas Frequentes|Frequently Asked Questions|Preguntas Frecuentes)\b[\s\S]*?(?=\n---|\n###\s*(?:🔗|Fontes|Sources|Fuentes)|\n##\s+|$)/i
  )

  if (!faqSectionMatch) return []

  const textToScan = faqSectionMatch[0]
  const regex = /###\s+([^\n?]+\?)\s*\n+([\s\S]*?)(?=\n###|\n##|\n---|$)/g

  let match
  while ((match = regex.exec(textToScan)) !== null) {
    const question = match[1].replace(/^[#\s]+/, '').trim()
    if (/^(?:🔗|Fontes|Sources|Fuentes)/i.test(question)) continue

    const answer = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links markdown
      .replace(/[*_`]/g, '') // remove formatações simples
      .replace(/\s+/g, ' ')
      .trim()

    if (question && answer && answer.length > 10) {
      faqs.push({ question, answer })
    }
  }

  return faqs
}
