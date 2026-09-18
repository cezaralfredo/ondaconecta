import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface HeroSectionProps {
  blogData?: BlogPost[]
  title?: string
  subtitle?: string
  badgeText?: string
}

const HeroSection = ({
  title = 'Tendências, atualidades, zoom e buzz!',
  subtitle = 'Seu filtro de leitura: artigos aprofundados, notícias verificadas e análises rigorosas sobre tecnologia, negócios, inovação e futuro.',
  badgeText = 'Radar de Tendências & Inteligência de Mercado'
}: HeroSectionProps) => {
  return (
    <section
      id='home'
      className='relative -mt-16 overflow-hidden border-b border-border/30 bg-background/50 pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24'
    >
      {/* Background em Evidência com Ondas e Nós de Conexão */}
      <div
        className='pointer-events-none absolute inset-0 z-0 select-none overflow-hidden'
        aria-hidden='true'
      >
        <img
          src='/images/hero-wave-bg.webp'
          alt=''
          className='h-full w-full object-cover object-center opacity-35 transition-opacity duration-700 dark:opacity-55'
        />
        {/* Camada sutil de gradiente para contraste e suavização superior/inferior */}
        <div className='absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/95' />
        {/* Glow central com a cor primária para destacar a tipografia */}
        <div className='absolute top-1/2 left-1/2 h-80 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25' />
      </div>

      {/* Conteúdo Centralizado da Hero */}
      <div className='relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-3xl flex-col items-center text-center'>
          {/* Badge Centralizado com Logo Ícone Oficial */}
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/85 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all hover:border-primary/45 hover:shadow-md'>
            <img
              src='/images/logo-icon.webp'
              alt='Ícone Onda Conecta'
              className='h-4 w-4 object-contain'
            />
            <span className='text-xs font-semibold text-primary sm:text-sm'>
              Onda Conecta
            </span>
            <span className='text-muted-foreground/40'>•</span>
            <span className='text-xs font-medium text-muted-foreground sm:text-sm'>
              {badgeText}
            </span>
          </div>

          {/* Título Principal Centralizado */}
          <h1 className='text-balance text-3xl font-extrabold leading-[1.18] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl'>
            {title}
          </h1>

          {/* Subtítulo Centralizado */}
          <p className='mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl'>
            {subtitle}
          </p>

          {/* Micro-pills das Verticais Editoriais */}
          <div className='mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1 font-medium text-primary backdrop-blur-sm'>
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500' />
              Radar em Tempo Real
            </span>
            <span className='rounded-md border border-border/40 bg-background/70 px-3 py-1 backdrop-blur-sm'>
              Inovação & IA
            </span>
            <span className='rounded-md border border-border/40 bg-background/70 px-3 py-1 backdrop-blur-sm'>
              Mercados & Negócios
            </span>
            <span className='rounded-md border border-border/40 bg-background/70 px-3 py-1 backdrop-blur-sm'>
              Saúde & Bem-estar
            </span>
            <span className='rounded-md border border-border/40 bg-background/70 px-3 py-1 backdrop-blur-sm'>
              Estilo de Vida & Viagens
            </span>
            <span className='rounded-md border border-border/40 bg-background/70 px-3 py-1 backdrop-blur-sm'>
              Sustentabilidade
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
