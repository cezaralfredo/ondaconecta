'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface RelatedPostsProps {
  relatedPosts: BlogPost[]
  lang?: string
}

const BlogRelatedPost: React.FC<RelatedPostsProps> = ({ relatedPosts, lang = 'pt' }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const labels: Record<
    string,
    { badge: string; title: string; subtitle: string; minRead: string; prev: string; next: string }
  > = {
    pt: {
      badge: 'Carrossel Editorial',
      title: 'Notícias & Tendências Relacionadas',
      subtitle: 'Navegue pelas análises e acontecimentos mais relevantes selecionados para você.',
      minRead: 'min de leitura',
      prev: 'Ver matérias anteriores',
      next: 'Ver próximas matérias'
    },
    en: {
      badge: 'Editorial Carousel',
      title: 'Related Articles & Trends',
      subtitle: 'Browse through the most relevant analyses and global insights curated for you.',
      minRead: 'min read',
      prev: 'Previous articles',
      next: 'Next articles'
    },
    es: {
      badge: 'Carrusel Editorial',
      title: 'Noticias y Tendencias Relacionadas',
      subtitle: 'Explore los análisis y acontecimientos más relevantes seleccionados para usted.',
      minRead: 'min de lectura',
      prev: 'Artículos anteriores',
      next: 'Próximos artículos'
    }
  }

  const currentLabels = labels[lang] || labels.pt

  // Atualiza o estado dos botões de navegação conforme o scroll horizontal
  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current

    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calcula o slide mais visível
    const firstChild = carouselRef.current.firstElementChild as HTMLElement
    if (firstChild) {
      const cardWidth = firstChild.getBoundingClientRect().width + 24 // card + gap
      const index = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(Math.max(index, 0), relatedPosts.length - 1))
    }
  }, [relatedPosts.length])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const firstChild = container.firstElementChild as HTMLElement
    if (!firstChild) return

    const cardWidth = firstChild.getBoundingClientRect().width + 24 // largura + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const firstChild = container.firstElementChild as HTMLElement
    if (!firstChild) return

    const cardWidth = firstChild.getBoundingClientRect().width + 24
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }

  if (!relatedPosts || relatedPosts.length === 0) return null

  return (
    <section className='border-t border-border/40 bg-muted/10 py-12 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8'>
        {/* Cabeçalho com Título e Controles do Carrossel */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-2 max-w-2xl'>
            <Badge
              variant='outline'
              className='border-primary/30 bg-primary/10 text-primary h-auto text-xs font-semibold uppercase tracking-wider'
            >
              {currentLabels.badge}
            </Badge>

            <h2 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
              {currentLabels.title}
            </h2>

            <p className='text-muted-foreground text-sm sm:text-base'>
              {currentLabels.subtitle}
            </p>
          </div>

          {/* Botões de Navegação Anterior / Próximo */}
          <div className='flex items-center gap-2 self-end sm:self-auto'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => scrollByDirection('left')}
              disabled={!canScrollLeft}
              title={currentLabels.prev}
              aria-label={currentLabels.prev}
              className='size-10 rounded-full border-border/80 bg-background/80 shadow-sm backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:pointer-events-none'
            >
              <ChevronLeftIcon className='size-5' />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => scrollByDirection('right')}
              disabled={!canScrollRight}
              title={currentLabels.next}
              aria-label={currentLabels.next}
              className='size-10 rounded-full border-border/80 bg-background/80 shadow-sm backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:pointer-events-none'
            >
              <ChevronRightIcon className='size-5' />
            </Button>
          </div>
        </div>

        {/* Viewport do Carrossel com Scroll-Snap Fluido */}
        <div
          ref={carouselRef}
          className='flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {relatedPosts.map((post) => {
            const cleanSlug = post.slug.replace(/-(en|es)$/, '')
            const postHref =
              lang === 'en'
                ? `/en/blog/${cleanSlug}`
                : lang === 'es'
                ? `/es/blog/${cleanSlug}`
                : `/blog/${cleanSlug}`

            return (
              <article
                key={post.id}
                className='w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start'
              >
                <a
                  href={postHref}
                  className='group flex h-full flex-col'
                  title={post.title}
                >
                  <Card className='flex h-full flex-col overflow-hidden border-border/70 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1'>
                    {/* Imagem de Capa 16:9 com Zoom Suave */}
                    <div className='relative aspect-video w-full overflow-hidden bg-muted'>
                      <img
                        src={post.imageUrl || '/images/og-image.png'}
                        alt={post.imageAlt || post.title}
                        className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                        loading='lazy'
                      />
                      <div className='absolute top-3 left-3'>
                        <span className='inline-flex items-center rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md'>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <CardContent className='flex flex-1 flex-col justify-between p-5 space-y-4'>
                      <div className='space-y-2.5'>
                        {/* Metadados: Data e Tempo de Leitura */}
                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                          <div className='flex items-center gap-1.5'>
                            <CalendarDaysIcon className='size-3.5' />
                            <span>{post.pubDate}</span>
                          </div>
                          {post.readTime && (
                            <div className='flex items-center gap-1.5'>
                              <ClockIcon className='size-3.5' />
                              <span>{post.readTime} {currentLabels.minRead}</span>
                            </div>
                          )}
                        </div>

                        {/* Título com Destaque no Hover */}
                        <h3 className='line-clamp-2 text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary'>
                          {post.title}
                        </h3>

                        {/* Metadescrição */}
                        <p className='line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed'>
                          {post.description}
                        </p>
                      </div>

                      {/* Rodapé do Card */}
                      <div className='flex items-center justify-between border-t border-border/40 pt-3 text-xs'>
                        <span className='font-medium text-muted-foreground'>
                          {post.author || 'Redação Onda Conecta'}
                        </span>
                        <span className='inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform'>
                          Ler análise
                          <ArrowRightIcon className='size-3.5 -rotate-45' />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </article>
            )
          })}
        </div>

        {/* Indicadores Visuais de Paginação (Dots) */}
        {relatedPosts.length > 3 && (
          <div className='flex items-center justify-center gap-1.5 pt-2'>
            {relatedPosts.map((_, idx) => (
              <button
                key={idx}
                type='button'
                onClick={() => scrollToIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-border hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogRelatedPost
