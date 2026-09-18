'use client'

import { ArrowRightIcon, CalendarDaysIcon, SparklesIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface RecentPostsProps {
  blogData: BlogPost[]
  title?: string
  badgeText?: string
  lang?: 'pt' | 'en' | 'es' | string
}

const recentPostsI18n: Record<
  string,
  {
    title: string
    badgeText: string
    viewAll: string
    exploreAll: string
    readMore: string
    categoriesHref: string
  }
> = {
  pt: {
    title: 'Últimas Atualizações',
    badgeText: 'Edições Recentes',
    viewAll: 'Ver acervo completo',
    exploreAll: 'Explorar todas as matérias e categorias',
    readMore: 'Ler ➔',
    categoriesHref: '/#categories'
  },
  en: {
    title: 'Latest Updates',
    badgeText: 'Recent Editions',
    viewAll: 'View full archive',
    exploreAll: 'Explore all topics & categories',
    readMore: 'Read ➔',
    categoriesHref: '/en#categories'
  },
  es: {
    title: 'Últimas Actualizaciones',
    badgeText: 'Ediciones Recientes',
    viewAll: 'Ver archivo completo',
    exploreAll: 'Explorar todos los temas y categorías',
    readMore: 'Leer ➔',
    categoriesHref: '/es#categories'
  }
}

export const RecentPosts = ({
  blogData = [],
  title,
  badgeText,
  lang = 'pt'
}: RecentPostsProps) => {
  const i18n = recentPostsI18n[lang] || recentPostsI18n.pt
  const sectionTitle = title || i18n.title
  const sectionBadge = badgeText || i18n.badgeText

  // Pega estritamente os 4 últimos artigos postados
  const latestPosts = blogData.slice(0, 4)

  return (
    <section className='pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10'>
        {/* Cabeçalho da Seção */}
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6'>
          <div className='space-y-2'>
            <Badge
              variant='outline'
              className='gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5'
            >
              <SparklesIcon className='size-3.5' />
              {sectionBadge}
            </Badge>
            <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl'>
              {sectionTitle}
            </h2>
          </div>
          <Button asChild variant='ghost' className='gap-2 text-primary hover:text-primary/80 self-start sm:self-auto'>
            <a href={i18n.categoriesHref}>
              {i18n.viewAll}
              <ArrowRightIcon className='size-4' />
            </a>
          </Button>
        </div>

        {/* Grade com os 4 últimos artigos com títulos em destaque */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {latestPosts.map(post => {
            const cleanSlug = post.slug.replace(/-(en|es)$/, '')
            const postHref =
              lang === 'en'
                ? `/en/blog/${cleanSlug}`
                : lang === 'es'
                ? `/es/blog/${cleanSlug}`
                : `/blog/${cleanSlug}`

            return (
              <a
                key={post.id}
                href={postHref}
                className='group flex flex-col h-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg'
              >
                {/* Imagem de Capa */}
                <div className='relative aspect-[16/9] w-full overflow-hidden bg-muted'>
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='lazy'
                  />
                  <div className='absolute top-3 left-3'>
                    <span className='rounded-md bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-primary shadow-sm'>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Focado no Título em Destaque */}
                <CardContent className='flex flex-1 flex-col justify-between p-5 space-y-4'>
                  <div className='space-y-2.5'>
                    {/* Data */}
                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <CalendarDaysIcon className='size-3.5 shrink-0' />
                      <span>{post.pubDate}</span>
                    </div>

                    {/* Título em Destaque Negrito Bold com altura alinhada */}
                    <h3 className='text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-3 min-h-[4.25rem]'>
                      {post.title}
                    </h3>
                  </div>

                  {/* Linha de Fechamento com autor e seta */}
                  <div className='flex items-center justify-between pt-2 border-t text-xs font-medium text-muted-foreground'>
                    <span>{post.author}</span>
                    <span className='inline-flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform'>
                      {i18n.readMore}
                    </span>
                  </div>
                </CardContent>
              </a>
            )
          })}
        </div>

        {/* Botão de Destaque para Categorias */}
        <div className='pt-4 text-center'>
          <Button asChild size='lg' className='rounded-xl shadow-md gap-2 font-semibold'>
            <a href={i18n.categoriesHref}>
              {i18n.exploreAll}
              <ArrowRightIcon className='size-4' />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default RecentPosts
