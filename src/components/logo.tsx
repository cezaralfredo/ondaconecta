import type { ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  alt?: string
}

/**
 * Componente oficial de logotipo da Onda Conecta.
 * Alterna automaticamente entre o logotipo colorido padrão (modo claro)
 * e a versão em negativo/branca (modo escuro) conforme a classe .dark ativa.
 */
const Logo = ({ className, alt = 'Onda Conecta', ...props }: LogoProps) => {
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      {/* Versão padrão (modo claro) */}
      <img
        src='/images/logo-onda-conecta.webp'
        alt={alt}
        width={605}
        height={228}
        className='h-8 sm:h-9 w-auto object-contain dark:hidden'
        loading='eager'
        decoding='async'
        {...props}
      />
      {/* Versão negativo (modo escuro) */}
      <img
        src='/images/logo-onda-conecta-negativo.webp'
        alt={alt}
        width={605}
        height={227}
        className='hidden h-8 sm:h-9 w-auto object-contain dark:block'
        loading='eager'
        decoding='async'
        {...props}
      />
    </div>
  )
}

export default Logo
