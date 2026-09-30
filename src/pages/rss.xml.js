import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

const monthMap = {
  // Português
  janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
  // Espanhol
  enero: 0, febrero: 1, marzo: 2, mayo: 4, junio: 5, julio: 6,
  agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
  // Inglês
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
}

export const parsePubDate = dateStr => {
  if (!dateStr) return new Date()
  const directDate = new Date(dateStr)
  if (!isNaN(directDate.getTime())) return directDate

  // Formatos: "11 de Setembro de 2026", "10 de Marzo de 2026"
  const ptEsMatch = String(dateStr).match(/(\d{1,2})\s+de\s+([a-zA-ZçÇ]+)\s+de\s+(\d{4})/i)
  if (ptEsMatch) {
    const day = parseInt(ptEsMatch[1], 10)
    const monthName = ptEsMatch[2].toLowerCase()
    const year = parseInt(ptEsMatch[3], 10)
    const month = monthMap[monthName] ?? 0
    return new Date(year, month, day)
  }

  // Formatos: "September 11, 2026"
  const enMatch = String(dateStr).match(/([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/i)
  if (enMatch) {
    const monthName = enMatch[1].toLowerCase()
    const day = parseInt(enMatch[2], 10)
    const year = parseInt(enMatch[3], 10)
    const month = monthMap[monthName] ?? 0
    return new Date(year, month, day)
  }

  return new Date()
}

export async function GET(context) {
  let posts = []

  try {
    posts = await getCollection('blog')
  } catch (error) {
    console.warn('Erro ao carregar coleção do blog para RSS:', error)
  }

  // Filtrar apenas posts em português para o feed padrão (/rss.xml)
  const ptPosts = posts.filter(post => (post.data.lang || 'pt') === 'pt')

  // Ordenar cronologicamente do mais recente para o mais antigo (exigência Google Notícias e RSS readers)
  const sortedPosts = ptPosts
    .map(post => ({
      ...post,
      parsedDate: parsePubDate(post.data.pubDate)
    }))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())

  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://ondaconecta.com.br'

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteUrl,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/'
    },
    customData: `
      <language>pt-BR</language>
      <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    `.trim(),
    items: sortedPosts.map(post => {
      const postUrl = `${siteUrl}/blog/${post.id}/`
      const imageUrl = post.data.imageUrl
        ? (post.data.imageUrl.startsWith('http') ? post.data.imageUrl : `${siteUrl}${post.data.imageUrl}`)
        : null

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.parsedDate,
        link: postUrl,
        author: post.data.author || 'Redação Onda Conecta',
        categories: post.data.category ? [post.data.category] : ['Tendências'],
        customData: imageUrl
          ? `<media:content url="${imageUrl}" medium="image" />\n      <enclosure url="${imageUrl}" length="0" type="image/webp" />`
          : ''
      }
    })
  })
}
