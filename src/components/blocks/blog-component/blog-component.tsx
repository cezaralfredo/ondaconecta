'use client'

import { useState } from 'react'

import { SearchIcon, ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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
}

const BlogGrid = ({ posts, onCategoryClick }: { posts: BlogPost[]; onCategoryClick: (category: string) => void }) => {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => (
        <a
          href={`/blog/${post.slug}`}
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
              <h3 className='line-clamp-2 text-lg font-medium md:text-xl'>{post.title}</h3>
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
      ))}
    </div>
  )
}

const Blog = ({ blogData = [] }: BlogProps) => {
  const [selectedTab, setSelectedTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter out featured posts to avoid duplication with hero section
  // Sort posts by ID in descending order (newest first)
  const nonFeaturedPosts = blogData.filter(post => !post.featured).sort((a, b) => b.id - a.id)

  // Categorias padronizadas oficiais do projeto Onda Conecta
  const categories = ['All', ...PROJECT_CATEGORIES]

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)

    if (tab === 'All') {
      window.location.href = '#categories'
    }
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
      <h3 className='text-foreground text-lg font-medium'>Novos artigos em breve em {categoryName}</h3>
      <p className='text-muted-foreground mt-1 max-w-md text-sm'>
        Nossa redação está apurando novidades, tendências e análises aprofundadas para esta editoria.
      </p>
      <Button
        variant='outline'
        size='sm'
        className='mt-4'
        onClick={() => handleTabChange('All')}
      >
        Ver todas as publicações
      </Button>
    </div>
  )

  return (
    <section className='py-8 sm:py-16 lg:py-24' id='categories'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8'>
        {/* Header */}
        <div className='space-y-4'>
          {selectedTab === 'All' && <p className='text-sm font-semibold tracking-wide text-primary uppercase'>Todas as Publicações</p>}
          {selectedTab !== 'All' && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='#categories' onClick={(e) => { e.preventDefault(); handleTabChange('All'); }}>Publicações</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTab}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Explore as Notícias por Categoria e Tendência
          </h2>

          <p className='text-muted-foreground text-lg md:text-xl'>
            Acompanhe análises, novidades e informações essenciais separadas por área de interesse.
          </p>
        </div>

        {/* Tabs and Search */}
        <Tabs defaultValue='All' value={selectedTab} onValueChange={handleTabChange} className='gap-8 lg:gap-16'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <ScrollArea className='bg-muted w-full rounded-lg sm:w-auto'>
              <TabsList className='h-auto gap-1 group-data-horizontal/tabs:h-auto'>
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    id={`category-${category}`}
                    className='hover:bg-primary/10 cursor-pointer rounded-lg px-4 text-base group-data-horizontal/tabs:after:h-0'
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            <div className='relative max-md:w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                <SearchIcon className='size-4' />
                <span className='sr-only'>Pesquisar</span>
              </div>
              <Input
                type='search'
                placeholder='Buscar notícias...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='peer h-10 px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
              />
            </div>
          </div>

          {/* All Posts Tab */}
          <TabsContent value='All'>
            {filterBySearch(nonFeaturedPosts).length > 0 ? (
              <BlogGrid posts={filterBySearch(nonFeaturedPosts)} onCategoryClick={handleTabChange} />
            ) : (
              <div className='py-12 text-center text-muted-foreground'>
                Nenhum artigo encontrado para "{searchQuery}".
              </div>
            )}
          </TabsContent>

          {/* Category-specific Tabs */}
          {PROJECT_CATEGORIES.map((category, index) => {
            const categoryPosts = filterBySearch(nonFeaturedPosts.filter(post => post.category === category))
            return (
              <TabsContent key={index} value={category}>
                {categoryPosts.length > 0 ? (
                  <BlogGrid posts={categoryPosts} onCategoryClick={handleTabChange} />
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
