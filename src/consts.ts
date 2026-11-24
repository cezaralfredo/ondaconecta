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
      { url: '/favicon/favicon.webp', sizes: '512x512', type: 'image/webp' },
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
    google: '', // Verificado via DNS TXT
    yandex: '',
    bing: '',
    pinterest: 'bd54178a186a40896b54b626589fc5bc'
  },
  // Configuração Google AdSense Oficial
  adsense: {
    clientId: process.env.PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-4965740102250985'
  }
}

// Configuração oficial do Pinterest (Tag + Conversions API)
export const PINTEREST_CONFIG = {
  tagId: '2614098012141',
  adAccountId: '549770820233',
  userEmail: 'gerandoparceria@gmail.com',
  userEmailHash: '2bbc7d3c4aa09982f805eb0de75a0b9dee7dba10338297794dcde89767510358',
  domainVerification: 'bd54178a186a40896b54b626589fc5bc',
  capiEndpoint: '/api/pinterest-capi.php'
}

// Configuração oficial do OneSignal Web Push
export const ONESIGNAL_CONFIG = {
  appId: process.env.PUBLIC_ONESIGNAL_APP_ID || '5c88c7df-4148-4612-914a-aa98419e2e28'
}

// Configuração oficial do Protocolo IndexNow (Bing, Yandex, Seznam)
export const INDEXNOW_CONFIG = {
  host: 'ondaconecta.com.br',
  key: '1a0c66547d41c2a29b2e9149c1e4a5f1',
  keyLocation: 'https://ondaconecta.com.br/1a0c66547d41c2a29b2e9149c1e4a5f1.txt'
}

// Redes sociais e canais oficiais
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  twitter: 'https://twitter.com/ondaconecta',
  instagram: 'https://instagram.com/ondaconecta',
  linkedin: 'https://linkedin.com/company/ondaconecta',
  telegram: 'https://t.me/ondaconecta',
  pinterest: 'https://br.pinterest.com/ondaconecta/'
}

// Configuração oficial do Canal e Bot do Telegram
export const TELEGRAM_CONFIG = {
  channelUrl: 'https://t.me/ondaconecta',
  channelUsername: '@ondaconecta',
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '@ondaconecta'
}

// Estrutura da organização para Rich Snippets do Google (Schema.org)
export const COMPANY_INFO = {
  name: 'Onda Conecta',
  legalName: 'Onda Conecta Notícias & Mídia',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2025',
  address: {
    streetAddress: 'Rua Firmo Ananias Cardoso, 622',
    addressLocality: 'Sapiranga, Fortaleza',
    addressRegion: 'CE',
    postalCode: '60833-432',
    addressCountry: 'BR'
  },
  contactPoint: {
    telephone: '+55-85-99627-7707',
    contactType: 'editorial',
    email: 'contato@ondaconecta.com.br'
  },
  sameAs: Object.values(SOCIAL_LINKS)
}

// Categorias oficiais padronizadas do portal Onda Conecta
export const PROJECT_CATEGORIES = [
  'Inovação & IA',
  'Mercado & Negócios',
  'Finanças Pessoais',
  'Saúde & Bem-estar',
  'Estética & Beleza',
  'Estilo de Vida & Viagens',
  'Tendências',
  'Sustentabilidade',
  'Comportamento'
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

const CATEGORY_ALIAS_MAP: Record<string, ProjectCategory> = {
  'Inovação & IA': 'Inovação & IA',
  'Innovation & AI': 'Inovação & IA',
  'Innovación e IA': 'Inovação & IA',
  'Mercado & Negócios': 'Mercado & Negócios',
  'Market & Business': 'Mercado & Negócios',
  'Business & Markets': 'Mercado & Negócios',
  'Mercado y Negocios': 'Mercado & Negócios',
  'Mercados y Negocios': 'Mercado & Negócios',
  'Finanças Pessoais': 'Finanças Pessoais',
  'Personal Finance': 'Finanças Pessoais',
  'Finanzas Personales': 'Finanças Pessoais',
  'Saúde & Bem-estar': 'Saúde & Bem-estar',
  'Health & Wellness': 'Saúde & Bem-estar',
  'Salud y Bienestar': 'Saúde & Bem-estar',
  'Estética & Beleza': 'Estética & Beleza',
  'Beauty & Aesthetics': 'Estética & Beleza',
  'Estética y Belleza': 'Estética & Beleza',
  'Estética & Belleza': 'Estética & Beleza',
  'Belleza y Estética': 'Estética & Beleza',
  'Estilo de Vida & Viagens': 'Estilo de Vida & Viagens',
  'Lifestyle & Travel': 'Estilo de Vida & Viagens',
  'Estilo de Vida y Viajes': 'Estilo de Vida & Viagens',
  'Tendências': 'Tendências',
  'Trends': 'Tendências',
  'Tendencias': 'Tendências',
  'Sustentabilidade': 'Sustentabilidade',
  'Sustainability': 'Sustentabilidade',
  'Sostenibilidad': 'Sustentabilidade',
  'Comportamento': 'Comportamento',
  'Behavior & Culture': 'Comportamento',
  'Comportamiento': 'Comportamento',
  'Comportamiento y Cultura': 'Comportamento'
}

export const CATEGORY_LABELS: Record<'pt' | 'en' | 'es', Record<ProjectCategory, string>> = {
  pt: {
    'Inovação & IA': 'Inovação & IA',
    'Mercado & Negócios': 'Mercado & Negócios',
    'Finanças Pessoais': 'Finanças Pessoais',
    'Saúde & Bem-estar': 'Saúde & Bem-estar',
    'Estética & Beleza': 'Estética & Beleza',
    'Estilo de Vida & Viagens': 'Estilo de Vida & Viagens',
    'Tendências': 'Tendências',
    'Sustentabilidade': 'Sustentabilidade',
    'Comportamento': 'Comportamento'
  },
  en: {
    'Inovação & IA': 'Innovation & AI',
    'Mercado & Negócios': 'Market & Business',
    'Finanças Pessoais': 'Personal Finance',
    'Saúde & Bem-estar': 'Health & Wellness',
    'Estética & Beleza': 'Beauty & Aesthetics',
    'Estilo de Vida & Viagens': 'Lifestyle & Travel',
    'Tendências': 'Trends',
    'Sustentabilidade': 'Sustainability',
    'Comportamento': 'Behavior & Culture'
  },
  es: {
    'Inovação & IA': 'Innovación e IA',
    'Mercado & Negócios': 'Mercados y Negocios',
    'Finanças Pessoais': 'Finanzas Personales',
    'Saúde & Bem-estar': 'Salud y Bienestar',
    'Estética & Beleza': 'Estética y Belleza',
    'Estilo de Vida & Viagens': 'Estilo de Vida y Viajes',
    'Tendências': 'Tendencias',
    'Sustentabilidade': 'Sostenibilidad',
    'Comportamento': 'Comportamiento'
  }
}

export function normalizeCategory(rawCategory: string | undefined): ProjectCategory {
  if (!rawCategory) return 'Tendências'
  const trimmed = rawCategory.trim()
  return CATEGORY_ALIAS_MAP[trimmed] || 'Tendências'
}

export function getCategoryLabel(rawCategory: string | undefined, lang: string = 'pt'): string {
  const canonical = normalizeCategory(rawCategory)
  const localeKey = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt'
  return CATEGORY_LABELS[localeKey][canonical] || canonical
}


