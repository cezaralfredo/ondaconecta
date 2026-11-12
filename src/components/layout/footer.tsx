import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import Logo from '@/components/logo'

interface FooterProps {
  lang?: 'pt' | 'en' | 'es'
}

const Footer = ({ lang: initialLang }: FooterProps) => {
  const [lang, setLang] = useState<'pt' | 'en' | 'es'>(initialLang || 'pt')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname
      if (p.startsWith('/en')) setLang('en')
      else if (p.startsWith('/es')) setLang('es')
      else setLang('pt')
    }
  }, [])

  const homeHref = lang === 'en' ? '/en' : lang === 'es' ? '/es' : '/'
  const toolsHref = lang === 'en' ? '/en/tools' : lang === 'es' ? '/es/herramientas' : '/ferramentas'
  const categoriesHref = lang === 'en' ? '/en/categories' : lang === 'es' ? '/es/categorias' : '/categorias'

  const labels = {
    pt: {
      tools: 'Ferramentas Úteis',
      categories: 'Categorias',
      about: 'Quem Somos',
      contact: 'Contato',
      terms: 'Termos de Uso',
      privacy: 'Privacidade',
      commitment: 'Nosso compromisso é levar o que há de incrível até você!'
    },
    en: {
      tools: 'Useful Tools',
      categories: 'Categories',
      about: 'About Us',
      contact: 'Contact',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      commitment: 'Our commitment is to bring what is truly remarkable to you!'
    },
    es: {
      tools: 'Herramientas Útiles',
      categories: 'Categorías',
      about: 'Quiénes Somos',
      contact: 'Contacto',
      terms: 'Términos de Uso',
      privacy: 'Privacidad',
      commitment: '¡Nuestro compromiso es llevar lo increíble hasta ti!'
    }
  }[lang]

  return (
    <footer>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8 lg:px-8'>
        <a href={homeHref} className='flex items-center'>
          <Logo />
        </a>
        <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap sm:gap-5 text-sm'>
          <a
            href={categoriesHref}
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100 font-medium'
          >
            {labels.categories}
          </a>
          <a
            href={toolsHref}
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            {labels.tools}
          </a>
          <a
            href='/quem-somos'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            {labels.about}
          </a>
          <a
            href='/contato'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            {labels.contact}
          </a>
          <a
            href='/termos-de-uso'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            {labels.terms}
          </a>
          <a
            href='/privacidade'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            {labels.privacy}
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6 lg:px-8'>
        <p className='flex items-center gap-1 text-center font-medium text-balance max-sm:flex-col text-xs sm:text-sm text-muted-foreground'>
          <span>
            {`©${new Date().getFullYear()}`}{' '}
            <a className='hover:underline font-semibold text-foreground' href={homeHref}>
              Onda Conecta
            </a>{' '}
            &{' '}
            <a
              className='hover:underline font-semibold text-foreground'
              href='https://anauedesign.com.br'
              target='_blank'
              rel='noopener noreferrer'
            >
              Anauê Design, Marketing e IA
            </a>
            .
          </span>
          <span> {labels.commitment}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
