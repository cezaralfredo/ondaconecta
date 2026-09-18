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
      className='relative -mt-16 overflow-hidden border-b border-border/30 bg-muted/20 pt-28 pb-12 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16'
    >
      {/* Background Sutil com Imagem de Ondas e Conexões Digitais */}
      <div
        className='pointer-events-none absolute inset-0 z-0 select-none overflow-hidden'
        aria-hidden='true'
      >
        <img
          src='/images/hero-wave-bg.webp'
          alt=''
          className='h-full w-full object-cover object-center opacity-[0.12] transition-opacity duration-700 dark:opacity-[0.22]'
        />
        {/* Máscara de gradiente suave para transição perfeita com o topo e a base */}
        <div className='absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background' />
        {/* Glow de ambientação com a cor primária da marca */}
        <div className='absolute top-1/3 left-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15' />
      </div>

      {/* Conteúdo da Hero */}
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12'>
          {/* Coluna de Texto Principal */}
          <div className='flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left'>
            {/* Badge com Logo Ícone Oficial */}
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3.5 py-1.5 shadow-xs backdrop-blur-md transition-all hover:border-primary/40'>
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

            {/* Título Principal */}
            <h1 className='text-balance text-3xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-4xl lg:text-5xl'>
              {title}
            </h1>

            {/* Subtítulo */}
            <p className='mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl'>
              {subtitle}
            </p>

            {/* Micro-pills contextuais de verticais editoriais */}
            <div className='mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start'>
              <span className='inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/60 px-2.5 py-1 font-medium'>
                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500' />
                Radar em Tempo Real
              </span>
              <span className='rounded-md border border-border/30 bg-muted/40 px-2.5 py-1'>
                Inovação & IA
              </span>
              <span className='rounded-md border border-border/30 bg-muted/40 px-2.5 py-1'>
                Mercados & Negócios
              </span>
              <span className='rounded-md border border-border/30 bg-muted/40 px-2.5 py-1'>
                Saúde & Bem-estar
              </span>
              <span className='rounded-md border border-border/30 bg-muted/40 px-2.5 py-1'>
                Estilo de Vida
              </span>
            </div>
          </div>

          {/* Coluna da Imagem Contextual (Escultura 3D da Onda Conecta) */}
          <div className='flex justify-center lg:col-span-5 lg:justify-end'>
            <div className='group relative w-full max-w-sm sm:max-w-md lg:max-w-none'>
              {/* Aura de iluminação sutil atrás da imagem */}
              <div
                className='pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-cyan-500/15 to-primary/20 opacity-60 blur-xl transition duration-700 group-hover:opacity-90'
                aria-hidden='true'
              />

              {/* Moldura Glassmorphic */}
              <div className='relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-2 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:border-primary/30 dark:border-white/10 dark:bg-card/30'>
                <img
                  src='/images/hero-wave-graphic.webp'
                  alt='Onda Conecta — Ondas de Inovação e Redes de Conexão'
                  className='h-auto max-h-[240px] w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:max-h-[280px]'
                  loading='eager'
                />
                <div className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60' />

                {/* Legenda sutil e elegante */}
                <div className='absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-lg border border-border/30 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground/90 backdrop-blur-md'>
                  <span className='flex items-center gap-1.5 font-medium text-foreground/90 text-[11px] sm:text-xs'>
                    <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                    Conexões que Moldam o Futuro
                  </span>
                  <span className='text-[10px] text-muted-foreground sm:text-[11px]'>
                    Onda Conecta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
