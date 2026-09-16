import { Badge } from '@/components/ui/badge'
import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface HeroSectionProps {
  blogData?: BlogPost[]
  title?: string
  subtitle?: string
}

const HeroSection = ({
  title = 'Tendências, atualidades, zoom e buzz!',
  subtitle = 'Seu filtro de leitura: artigos aprofundados, notícias verificadas e análises rigorosas.'
}: HeroSectionProps) => {
  return (
    <section id='home' className='bg-muted/40 -mt-16 pt-32 pb-12 sm:pt-36 sm:pb-14 lg:pt-40 lg:pb-16 border-b border-border/30'>
      <div className='mx-auto flex h-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8'>
        {/* Hero Header */}
        <div className='flex max-w-4xl flex-col items-center gap-4 self-center text-center'>
          <Badge variant='outline' className='h-auto text-xs sm:text-sm font-medium border-primary/20 bg-primary/5 text-primary'>
            Radar de Tendências & Inteligência de Mercado
          </Badge>
          <h1 className='text-3xl leading-[1.22] font-extrabold text-balance sm:text-4xl lg:text-5xl text-foreground'>
            {title}
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed'>
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
