import type { ReactNode } from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'

export type NavigationItem = {
  title: string
  href: string
}

export type NavigationSection = {
  title: string
  icon?: ReactNode
} & (
  | {
      items: NavigationItem[]
      href?: never
    }
  | {
      items?: never
      href: string
    }
)

type MenuNavigationProps = {
  navigationData: NavigationSection[]
  activeSection?: string
  className?: string
}

const MenuNavigation = ({ navigationData, activeSection, className }: MenuNavigationProps) => {
  return (
    <NavigationMenu viewport={false} className={className}>
      <NavigationMenuList className='flex-wrap justify-start gap-3'>
        {navigationData.map(navItem => {
          if (navItem.href) {
            // Match by pathname directly or clean section
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            const isExactPath = currentPath === navItem.href
            const isHomeActive = (navItem.href === '/' || navItem.href === '/en' || navItem.href === '/es') && (currentPath === '/' || currentPath === '/en' || currentPath === '/es')
            const isActive = isExactPath || (isHomeActive && activeSection === 'home')

            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'hover:text-primary dark:hover:bg-accent/50 hover:bg-accent bg-transparent px-3 py-1.5 text-base! focus:bg-transparent',
                    isActive ? 'text-primary bg-accent/50 font-medium' : 'text-muted-foreground'
                  )}
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          }

          // Section with dropdown
          return (
            <NavigationMenuItem key={navItem.title}>
              <NavigationMenuTrigger className='dark:data-[state=open]:hover:bg-accent/50 text-muted-foreground hover:text-primary dark:hover:bg-accent/50 bg-transparent px-3 py-1.5 text-base [&>svg]:size-4'>
                {navItem.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className='absolute left-0 top-0 w-auto rounded-2xl p-2 shadow-xl border bg-popover text-popover-foreground'>
                <ul className='grid w-[460px] grid-cols-2 gap-1.5 p-2'>
                  {navItem.items?.map(item => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        href={item.href}
                        className='block select-none rounded-lg p-2.5 text-sm font-medium leading-none text-muted-foreground no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground'
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default MenuNavigation
