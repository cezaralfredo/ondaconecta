'use client'

import { useState, useRef, useEffect } from 'react'

import { SearchIcon, ArrowRightIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PROJECT_CATEGORIES } from '@/consts'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export type BlogPost = {
  id: number
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  pubDate: string
  author: string
  avatarUrl: string
  category: string
  readTime: number
  featured: boolean
}

interface BlogProps {
  blogData?: BlogPost[]
  lang?: string
}

const BlogGrid = ({
  posts,
  onCategoryClick,
  lang = 'pt'
}: {
  posts: BlogPost[]
  onCategoryClick: (category: string) => void
  lang?: string
}) => {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => {
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
            onClick={e => {
              const target = e.target as HTMLElement

              if (target.closest('.badge')) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
          <Card className='shadow-none'>
            <CardContent className='space-y-3.5'>
              <div className='mb-6 overflow-hidden rounded-lg sm:mb-12'>
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  loading='lazy'
                />
              </div>
              <div className='flex items-center justify-between gap-1.5'>
                <div className='text-muted-foreground flex items-center gap-1.5'>
                  <CalendarDaysIcon className='size-5' />
                  <p className='text-base'>{post.pubDate}</p>
                </div>
                <Badge
                  className='bg-primary/10 text-primary badge h-auto rounded-full border-0 text-sm'
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onCategoryClick(post.category)
                  }}
                >
                  {post.category}
                </Badge>
              </div>
              <h3 className='line-clamp-2 text-lg font-bold md:text-xl text-foreground group-hover:text-primary transition-colors'>{post.title}</h3>
              <p className='text-muted-foreground line-clamp-2 text-base'>{post.description}</p>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>{post.author}</span>
                <Button
                  size='icon'
                  className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground group-hover:border-primary hover:border-primary border-border border bg-clip-border'
                >
                  <ArrowRightIcon className='size-4 -rotate-45' />
                  <span className='sr-only'>Read more: {post.title}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </a>
      )
    })}
    </div>
  )
}

const blogI18n: Record<
  string,
  {
    allPublications: string
    publications: string
    title: string
    subtitle: string
    searchPlaceholder: string
    noArticlesFound: string
    comingSoon: string
    comingSoonDesc: string
    viewAll: string
    homeHref: string
  }
> = {
  pt: {
    allPublications: 'Todas as Publicações',
    publications: 'Publicações',
    title: 'Explore as Notícias por Categoria e Tendência',
    subtitle: 'Acompanhe análises, novidades e informações essenciais separadas por área de interesse.',
    searchPlaceholder: 'Buscar notícias...',
    noArticlesFound: 'Nenhum artigo encontrado para',
    comingSoon: 'Novos artigos em breve em',
    comingSoonDesc: 'Nossa redação está apurando novidades, tendências e análises aprofundadas para esta editoria.',
    viewAll: 'Ver todas as publicações',
    homeHref: '/#categories'
  },
  en: {
    allPublications: 'All Publications',
    publications: 'Articles',
    title: 'Explore News by Category & Trends',
    subtitle: 'Follow in-depth analysis, breaking news, and essential insights across key topics.',
    searchPlaceholder: 'Search articles...',
    noArticlesFound: 'No articles found for',
    comingSoon: 'New articles coming soon in',
    comingSoonDesc: 'Our editorial team is curating the latest news, market trends, and in-depth analyses.',
    viewAll: 'View all publications',
    homeHref: '/en#categories'
  },
  es: {
    allPublications: 'Todas las Publicaciones',
    publications: 'Publicaciones',
    title: 'Explora las Noticias por Categoría y Tendencia',
    subtitle: 'Sigue análisis en profundidad, noticias verificadas y tendencias clave por área de interés.',
    searchPlaceholder: 'Buscar noticias...',
    noArticlesFound: 'No se encontraron artículos para',
    comingSoon: 'Nuevos artículos próximamente en',
    comingSoonDesc: 'Nuestra redacción está investigando novedades, tendencias y análisis para esta sección.',
    viewAll: 'Ver todas las publicaciones',
    homeHref: '/es#categories'
  }
}

const Blog = ({ blogData = [], lang = 'pt' }: BlogProps) => {
  const [selectedTab, setSelectedTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const labels = blogI18n[lang] || blogI18n.pt

  // Exibe todas as publicações ordenadas pelas mais recentes primeiro (por ID decrescente)
  const displayPosts = [...blogData].sort((a, b) => b.id - a.id)

  // Categorias padronizadas oficiais do projeto Onda Conecta
  const categories = ['All', ...PROJECT_CATEGORIES]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleCategoryFromUrl = () => {
        const params = new URLSearchParams(window.location.search)
        const categoryParam = params.get('category')
        if (categoryParam && categories.includes(categoryParam)) {
          setSelectedTab(categoryParam)
        }
      }

      handleCategoryFromUrl()
      window.addEventListener('popstate', handleCategoryFromUrl)
      return () => window.removeEventListener('popstate', handleCategoryFromUrl)
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
  }

  // Filtragem de posts por termo de busca
  const filterBySearch = (posts: BlogPost[]) => {
    if (!searchQuery.trim()) return posts
    const query = searchQuery.toLowerCase()
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
    )
  }

  const renderEmptyCategory = (categoryName: string) => (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-4 text-center'>
      <div className='bg-primary/10 text-primary mb-3 flex size-12 items-center justify-center rounded-full'>
        <CalendarDaysIcon className='size-6' />
      </div>
      <h3 className='text-foreground text-lg font-medium'>{labels.comingSoon} {categoryName}</h3>
      <p className='text-muted-foreground mt-1 max-w-md text-sm'>
        {labels.comingSoonDesc}
      </p>
      <Button
        variant='outline'
        size='sm'
        className='mt-4'
        onClick={() => handleTabChange('All')}
      >
        {labels.viewAll}
      </Button>
    </div>
  )

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className='py-8 sm:py-16 lg:py-24' id='categories'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8'>
        {/* Header */}
        <div className='space-y-4'>
          {selectedTab === 'All' && <p className='text-sm font-semibold tracking-wide text-primary uppercase'>{labels.allPublications}</p>}
          {selectedTab !== 'All' && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={labels.homeHref} onClick={(e) => { e.preventDefault(); handleTabChange('All'); }}>{labels.publications}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTab}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            {labels.title}
          </h2>

          <p className='text-muted-foreground text-lg md:text-xl'>
            {labels.subtitle}
          </p>
        </div>

        {/* Tabs and Search */}
        <Tabs defaultValue='All' value={selectedTab} onValueChange={handleTabChange} className='gap-8 lg:gap-16 w-full'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full'>
            {/* Categories Scrollable Bar with Navigation */}
            <div className='relative flex items-center min-w-0 max-w-full flex-1 overflow-hidden'>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Rolar categorias para a esquerda'
                onClick={() => handleScrollCategories('left')}
                className='hidden md:flex shrink-0 h-9 w-8 text-muted-foreground hover:text-foreground hover:bg-muted mr-1 z-10'
              >
                <ChevronLeftIcon className='size-4' />
              </Button>

              <div
                ref={scrollContainerRef}
                className='w-full overflow-x-auto no-scrollbar scroll-smooth py-1'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <TabsList className='bg-muted inline-flex h-auto w-max max-w-none items-center gap-1.5 p-1 rounded-xl'>
                  {categories.map(category => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      id={`category-${category}`}
                      className='hover:bg-primary/10 cursor-pointer rounded-lg px-3.5 py-1.5 text-sm sm:text-base font-medium whitespace-nowrap transition-colors'
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <Button
                variant='ghost'
                size='icon'
                aria-label='Rolar categorias para a direita'
                onClick={() => handleScrollCategories('right')}
                className='hidden md:flex shrink-0 h-9 w-8 text-muted-foreground hover:text-foreground hover:bg-muted ml-1 z-10'
              >
                <ChevronRightIcon className='size-4' />
              </Button>
            </div>

            {/* Search Input */}
            <div className='relative w-full lg:w-72 shrink-0'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                <SearchIcon className='size-4' />
                <span className='sr-only'>{labels.searchPlaceholder}</span>
              </div>
              <Input
                type='search'
                placeholder={labels.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='peer h-10 w-full px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
              />
            </div>
          </div>

          {/* All Posts Tab */}
          <TabsContent value='All'>
            {filterBySearch(displayPosts).length > 0 ? (
              <BlogGrid posts={filterBySearch(displayPosts)} onCategoryClick={handleTabChange} lang={lang} />
            ) : (
              <div className='py-12 text-center text-muted-foreground'>
                {labels.noArticlesFound} "{searchQuery}".
              </div>
            )}
          </TabsContent>

          {/* Category-specific Tabs */}
          {PROJECT_CATEGORIES.map((category, index) => {
            const categoryPosts = filterBySearch(displayPosts.filter(post => post.category === category))
            return (
              <TabsContent key={index} value={category}>
                {categoryPosts.length > 0 ? (
                  <BlogGrid posts={categoryPosts} onCategoryClick={handleTabChange} lang={lang} />
                ) : (
                  renderEmptyCategory(category)
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

export default Blog
