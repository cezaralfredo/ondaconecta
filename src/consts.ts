// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

export const SITE_TITLE = 'Onda Conecta | Tendências, Notícias e Inovação'
export const SITE_DESCRIPTION =
  'Onda Conecta: Seu portal de novidades, inteligência de mercado, tendências e inovações que moldam o futuro. Conteúdo ágil, estruturado e aprofundado.'

export const GITHUB_URL = 'https://github.com/cezaralfredo/ondaconecta'
export const SITE_URL = 'https://ondaconecta.com.br'

export const SITE_METADATA = {
  title: {
    default: 'Onda Conecta | Tendências, Notícias e Inovação'
  },
  description:
    'Onda Conecta: Seu portal de novidades, inteligência de mercado, tendências e inovações que moldam o futuro. Conteúdo ágil, estruturado e aprofundado.',
  keywords: [
    'notícias',
    'tendências',
    'inovação',
    'tecnologia',
    'inteligência artificial',
    'mercado',
    'sustentabilidade',
    'negócios',
    'futuro',
    'onda conecta'
  ],
  authors: [{ name: 'Redação Onda Conecta', url: SITE_URL }],
  creator: 'Onda Conecta',
  publisher: 'Onda Conecta',
  robots: {
    index: true,
    follow: true
  },
  language: 'pt-BR',
  locale: 'pt_BR',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }]
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Onda Conecta',
    title: 'Onda Conecta | Tendências, Notícias e Inovação',
    description:
      'Acompanhe as últimas novidades, grandes tendências e análises de mercado que estão transformando o cenário atual.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Onda Conecta - Portal de Notícias e Tendências',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ondaconecta',
    creator: '@ondaconecta',
    title: 'Onda Conecta | Tendências, Notícias e Inovação',
    description:
      'Acompanhe as últimas novidades, grandes tendências e análises de mercado que estão transformando o cenário atual.',
    images: ['/images/og-image.png']
  },
  verification: {
    google: '', // Insira seu código de verificação do Google Search Console aqui
    yandex: '',
    bing: ''
  }
}

// Redes sociais e canais oficiais
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  twitter: 'https://twitter.com/ondaconecta',
  instagram: 'https://instagram.com/ondaconecta',
  linkedin: 'https://linkedin.com/company/ondaconecta'
}

// Estrutura da organização para Rich Snippets do Google (Schema.org)
export const COMPANY_INFO = {
  name: 'Onda Conecta',
  legalName: 'Onda Conecta Notícias & Mídia',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2025',
  address: {
    streetAddress: 'Brasil',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    postalCode: '01000-000',
    addressCountry: 'BR'
  },
  contactPoint: {
    telephone: '+55-11-99999-9999',
    contactType: 'editorial',
    email: 'contato@ondaconecta.com.br'
  },
  sameAs: Object.values(SOCIAL_LINKS)
}
