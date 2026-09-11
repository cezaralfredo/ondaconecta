import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  let posts = []

  try {
    posts = await getCollection('blog')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Collection is empty or doesn't exist
    console.log('No blog posts found, generating empty RSS feed')
  }

  const publishedPosts = posts.filter(post => !post.data.featured)

  const monthMap = {
    janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3, maio: 4, junho: 5,
    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
    enero: 0, febrero: 1, marzo: 2, mayo: 4, junio: 5, julio: 6,
    agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  }

  const parsePubDate = dateStr => {
    if (!dateStr) return new Date()
    const directDate = new Date(dateStr)
    if (!isNaN(directDate.getTime())) return directDate

    // Handle formats like "11 de Setembro de 2026" or "10 de Marzo de 2026"
    const match = String(dateStr).match(/(\d{1,2})\s+de\s+([a-zA-ZçÇ]+)\s+de\s+(\d{4})/i)
    if (match) {
      const day = parseInt(match[1], 10)
      const monthName = match[2].toLowerCase()
      const year = parseInt(match[3], 10)
      const month = monthMap[monthName] ?? 0
      return new Date(year, month, day)
    }

    return new Date()
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: publishedPosts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: parsePubDate(post.data.pubDate),
      link: `/blog/${post.id}/`,
      author: post.data.author,
      categories: post.data.tags || []
    })),
    customData: `<language>pt-br</language>`,
    stylesheet: '/rss-styles.xsl'
  })
}
