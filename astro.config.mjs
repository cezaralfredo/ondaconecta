// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import fs from 'node:fs'

// Carrega o histórico de publicações para sincronizar as datas exatas de última modificação (lastmod) no sitemap
/** @type {Record<string, string>} */
let slugToDate = {}
try {
  const historyData = JSON.parse(fs.readFileSync(new URL('./scripts/published-history.json', import.meta.url), 'utf8'))
  for (const item of historyData) {
    if (item.slug && item.publishedAt) {
      slugToDate[item.slug] = item.publishedAt
    }
  }
} catch (e) {
  console.warn('Could not load published-history for sitemap lastmod:', e)
}

export default defineConfig({
  site: process.env.SITE_URL || 'https://ondaconecta.com.br',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  redirects: {
    '/us': '/en',
    '/us/categories': '/en/categories',
    '/us/tools': '/en/tools',
    '/us/blog/[slug]': '/en/blog/[slug]',
    '/inteligencia-artificial': '/servicos-ia',
    '/solucoes-ia': '/servicos-ia',
    '/categories': '/en/categories'
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: page => {
        // Exclui áreas restritas e páginas de erro 404
        if (page.includes('/admin/') || page.includes('/private/') || page.includes('/404')) return false

        // Exclui URLs legadas de redirecionamento (nunca devem constar no sitemap segundo as diretrizes do Google Search Console)
        const redirectPages = [
          '/about',
          '/sobre',
          '/contact',
          '/contact-us',
          '/privacy',
          '/terms',
          '/categories',
          '/categorias',
          '/inteligencia-artificial',
          '/solucoes-ia'
        ]
        const cleanPath = new URL(page).pathname.replace(/\/$/, '')
        if (redirectPages.includes(cleanPath)) return false

        // Exemplo: se já existe /en/blog/meu-post, exclui /en/blog/meu-post-en/
        if (page.match(/\/blog\/[a-z0-9-]+-(en|es)\/?$/)) return false

        return true
      },
      customPages: [],
      serialize(item) {
        // Garante que a URL não termine com barra (exceto a raiz do domínio se aplicável)
        const parsed = new URL(item.url)
        if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
          parsed.pathname = parsed.pathname.slice(0, -1)
          item.url = parsed.toString()
        }

        const path = parsed.pathname

        // Homepage e páginas de idioma raiz - highest priority
        if (path === '' || path === '/' || path === '/en' || path === '/es') {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 1.0
          item.lastmod = new Date()
          item.links = [
            { lang: 'pt-BR', url: 'https://ondaconecta.com.br/' },
            { lang: 'en', url: 'https://ondaconecta.com.br/en' },
            { lang: 'es', url: 'https://ondaconecta.com.br/es' },
            { lang: 'x-default', url: 'https://ondaconecta.com.br/' }
          ]
        }
        // Blog listing pages - high priority
        else if (path === '/blog' || path === '/en/blog' || path === '/es/blog') {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 0.9
          item.lastmod = new Date()
          item.links = [
            { lang: 'pt-BR', url: 'https://ondaconecta.com.br/blog' },
            { lang: 'en', url: 'https://ondaconecta.com.br/en/blog' },
            { lang: 'es', url: 'https://ondaconecta.com.br/es/blog' },
            { lang: 'x-default', url: 'https://ondaconecta.com.br/blog' }
          ]
        }
        // Artigos individuais do blog - sincroniza data precisa de modificação e associações multilíngues
        else if (path.includes('/blog/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.8

          const m = path.match(/\/blog\/([a-z0-9-]+)/)
          if (m) {
            const baseSlug = m[1].replace(/-(en|es)$/, '')
            if (slugToDate[baseSlug]) {
              item.lastmod = new Date(slugToDate[baseSlug])
            } else {
              item.lastmod = new Date()
            }

            item.links = [
              { lang: 'pt-BR', url: `https://ondaconecta.com.br/blog/${baseSlug}` },
              { lang: 'en', url: `https://ondaconecta.com.br/en/blog/${baseSlug}` },
              { lang: 'es', url: `https://ondaconecta.com.br/es/blog/${baseSlug}` },
              { lang: 'x-default', url: `https://ondaconecta.com.br/blog/${baseSlug}` }
            ]
          }
        }
        // Categorias e ferramentas
        else if (path.includes('/categories') || path.includes('/categorias') || path.includes('/tools') || path.includes('/herramientas') || path.includes('/ferramentas')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.7
          item.lastmod = new Date('2026-11-10T08:00:00-03:00')
        }
        // Demais páginas institucionais canônicas (Quem Somos, Contato, etc.)
        else {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.6
          item.lastmod = new Date('2026-11-10T08:00:00-03:00')
        }

        return item
      }
    })
  ],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'esbuild'
    },
    ssr: {
      noExternal: ['@radix-ui/*']
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
})
