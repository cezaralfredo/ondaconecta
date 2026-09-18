'use client'

import { useState, useEffect } from 'react'
import { GlobeIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', prefix: '' },
  { code: 'en', label: 'English', flag: '🇺🇸', prefix: '/en' },
  { code: 'es', label: 'Español', flag: '🇪🇸', prefix: '/es' }
]

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('pt')

  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/en')) {
      setCurrentLang('en')
    } else if (path.startsWith('/es')) {
      setCurrentLang('es')
    } else {
      setCurrentLang('pt')
    }
  }, [])

  const switchLanguage = (targetCode: string) => {
    const currentPath = window.location.pathname
    // Remove qualquer prefixo existente (/en ou /es)
    let cleanPath = currentPath.replace(/^\/(en|es)(\/|$)/, '/')

    // Se estiver em um post de blog, normaliza removendo sufixos legados (-en ou -es)
    cleanPath = cleanPath.replace(/(\/blog\/[^\/]+)-(en|es)(\/|$)/, '$1$3')

    let newUrl = cleanPath
    if (targetCode === 'en') {
      newUrl = `/en${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`
    } else if (targetCode === 'es') {
      newUrl = `/es${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`
    }

    // Normaliza barras duplicadas
    newUrl = newUrl.replace(/\/{2,}/g, '/')

    window.location.href = newUrl
  }

  const activeLang = languages.find(l => l.code === currentLang) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='h-9 gap-1.5 px-2.5 text-xs font-medium'>
          <GlobeIcon className='size-3.5 text-muted-foreground' />
          <span>{activeLang.flag}</span>
          <span className='uppercase'>{activeLang.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[130px]'>
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`flex cursor-pointer items-center justify-between gap-2 text-xs ${
              currentLang === lang.code ? 'font-semibold text-primary' : ''
            }`}
          >
            <span className='flex items-center gap-2'>
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
