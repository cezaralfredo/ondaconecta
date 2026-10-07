// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'

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
    '/categories': '/en/categories',
    '/categorias': '/es/categorias'
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: page => {
        // Exclui áreas restritas e URLs com sufixo duplicado em en/es para evitar canônicas concorrentes
        if (page.includes('/admin/') || page.includes('/private/')) return false
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

        // Homepage - highest priority
        if (item.url.endsWith('/') && item.url.split('/').filter(Boolean).length === 0) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 1.0
        }

        // Blog listing pages - high priority
        else if (item.url.includes('/blog') && !item.url.includes('/blog/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 0.9
        }

        // Individual blog posts - medium-high priority
        else if (item.url.includes('/blog/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.8
        }

        // Tag/category pages - medium priority
        else if (item.url.includes('/tags/') || item.url.includes('/categories/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.7
        }

        // Static pages - medium-low priority
        else if (item.url.includes('/login') || item.url.includes('/register')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'monthly'
          item.priority = 0.5
        }

        // All other pages
        else {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.6
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
