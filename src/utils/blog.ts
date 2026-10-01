// Utility functions for blog posts
import type { CollectionEntry } from 'astro:content'

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
  // Filtra primeiro pelo mesmo idioma para não misturar traduções
  const langFilteredPosts = currentLang
    ? posts.filter(post => (post.data.lang || 'pt') === currentLang)
    : posts

  // First try to get posts from same category
  const sameCategoryPosts = langFilteredPosts.filter(
    post => post.data.category === currentCategory && post.id !== currentSlug
  )

  // If we have enough posts from same category, use them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit)
  }

  // If not enough posts from same category, fill with other posts of the same language
  const otherPosts = langFilteredPosts.filter(
    post => post.data.category !== currentCategory && post.id !== currentSlug
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
