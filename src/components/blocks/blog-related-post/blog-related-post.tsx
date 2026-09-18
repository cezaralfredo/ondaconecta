'use client'

import { ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface RelatedPostsProps {
  relatedPosts: BlogPost[]
  lang?: string
}

const BlogRelatedPost = ({ relatedPosts, lang = 'pt' }: RelatedPostsProps) => {
  const labels: Record<string, { badge: string; title: string; subtitle: string }> = {
    pt: {
      badge: 'Leituras Recomendadas',
      title: 'Notícias Relacionadas',
      subtitle: 'Aprofunde-se no tema com essas leituras selecionadas.'
    },
    en: {
      badge: 'Recommended Reading',
      title: 'Related Articles',
      subtitle: 'Dive deeper into the topic with these curated analyses.'
    },
    es: {
      badge: 'Lecturas Recomendadas',
      title: 'Noticias Relacionadas',
      subtitle: 'Profundice en el tema con estas lecturas recomendadas.'
    }
  }

  const currentLabels = labels[lang] || labels.pt

  return (
    <section className='border-t border-border/30 py-8 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='space-y-3'>
          <Badge
            variant='outline'
            className='border-primary/20 bg-primary/5 text-primary h-auto text-xs font-medium'
          >
            {currentLabels.badge}
          </Badge>

          <h2 className='text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
            {currentLabels.title}
          </h2>

          <p className='text-muted-foreground text-base md:text-lg'>
            {currentLabels.subtitle}
          </p>
        </div>

        {/* Posts Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {relatedPosts.map(post => {
            const cleanSlug = post.slug.replace(/-(en|es)$/, '')
            const postHref =
              lang === 'en'
                ? `/en/blog/${cleanSlug}`
                : lang === 'es'
                ? `/es/blog/${cleanSlug}`
                : `/blog/${cleanSlug}`

            return (
              <a
                href={postHref}
                key={post.id}
                className='group h-full cursor-pointer shadow-none transition-all duration-300'
              >
              <Card className='shadow-none transition-shadow hover:shadow-md'>
                <CardContent className='space-y-3.5'>
                  <div className='mb-4 overflow-hidden rounded-lg sm:mb-6'>
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      className='h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      loading='lazy'
                    />
                  </div>
                  <div className='flex items-center justify-between gap-1.5'>
                    <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                      <CalendarDaysIcon className='size-4' />
                      <p>{post.pubDate}</p>
                    </div>
                    <Badge className='bg-primary/10 text-primary h-auto border-0 text-xs font-medium'>
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className='text-foreground group-hover:text-primary line-clamp-2 text-base font-bold transition-colors md:text-lg'>
                    {post.title}
                  </h3>
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {post.description}
                  </p>
                  <div className='flex items-center justify-between pt-1'>
                    <span className='text-muted-foreground text-xs font-medium'>
                      {post.author}
                    </span>
                    <Button
                      size='icon'
                      className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground group-hover:border-primary hover:border-primary border-border h-8 w-8 border bg-clip-border'
                    >
                      <ArrowRightIcon className='size-3.5 -rotate-45' />
                      <span className='sr-only'>Read more: {post.title}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </a>
          )
        })}
        </div>
      </div>
    </section>
  )
}

export default BlogRelatedPost
