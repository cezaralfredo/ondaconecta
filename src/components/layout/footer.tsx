import { Separator } from '@/components/ui/separator'

import Logo from '@/components/logo'

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8 lg:px-8'>
        <a href='/'>
          <div className='flex items-center gap-3'>
            <Logo className='gap-3' />
          </div>
        </a>
        <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap sm:gap-5'>
          <a
            href='/ferramentas'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Ferramentas Úteis
          </a>
          <a
            href='https://wa.me/5585996277707'
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Contato
          </a>
          <a
            href='/termos-de-uso'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Termos de Uso
          </a>
          <a
            href='/privacidade'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Privacidade
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6 lg:px-8'>
        <p className='flex items-center gap-1 text-center font-medium text-balance max-sm:flex-col'>
          <span>
            {`©${new Date().getFullYear()}`}{' '}
            <a className='hover:underline font-semibold' href='/'>
              Onda Conecta
            </a>{' '}
            &{' '}
            <a
              className='hover:underline font-semibold'
              href='https://anauedesign.com.br'
              target='_blank'
              rel='noopener noreferrer'
            >
              Anauê Design, Marketing e IA
            </a>
            .
          </span>
          <span> Nosso compromisso é levar o que há de incrível até você!</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
