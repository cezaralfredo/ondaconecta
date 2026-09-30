import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { parsePubDate } from '../rss.xml.js'

export async function GET(context) {
  let posts = []

  try {
    posts = await getCollection('blog')
  } catch (error) {
    console.warn('Erro ao carregar coleção do blog para RSS (ES):', error)
  }

  // Filtrar apenas posts em espanhol
  const esPosts = posts.filter(post => post.data.lang === 'es')

  // Ordenar cronologicamente do mais recente para o mais antigo
  const sortedPosts = esPosts
    .map(post => ({
      ...post,
      parsedDate: parsePubDate(post.data.pubDate)
    }))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())

  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://ondaconecta.com.br'

  return rss({
    title: 'Onda Conecta | Tendencias, Innovación e Inteligencia de Mercado',
    description: 'Tendencias emergentes, inteligencia artificial, negocios globales e innovaciones del futuro.',
    site: `${siteUrl}/es`,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/'
    },
    customData: `
      <language>es-ES</language>
      <atom:link href="${siteUrl}/es/rss.xml" rel="self" type="application/rss+xml" />
    `.trim(),
    items: sortedPosts.map(post => {
      const postUrl = `${siteUrl}/es/blog/${post.id}/`
      const imageUrl = post.data.imageUrl
        ? (post.data.imageUrl.startsWith('http') ? post.data.imageUrl : `${siteUrl}${post.data.imageUrl}`)
        : null

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.parsedDate,
        link: postUrl,
        author: post.data.author || 'Redacción Onda Conecta',
        categories: post.data.category ? [post.data.category] : ['Tendencias'],
        customData: imageUrl
          ? `<media:content url="${imageUrl}" medium="image" />\n      <enclosure url="${imageUrl}" length="0" type="image/webp" />`
          : ''
      }
    })
  })
}
