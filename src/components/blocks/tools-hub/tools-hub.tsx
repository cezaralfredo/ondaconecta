import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CURATED_TOOLS, type ToolItem } from '@/data/tools-data'
import {
  Calculator,
  QrCode,
  FileText,
  KeyRound,
  ExternalLink,
  Search,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Download,
  RotateCcw
} from 'lucide-react'

interface ToolsHubProps {
  lang?: 'pt' | 'en' | 'es'
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ lang = 'pt' }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'curated'>('interactive')
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<string>('investment')

  // Estado da Calculadora de Juros Compostos
  const [initialAmount, setInitialAmount] = useState<number>(5000)
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500)
  const [annualRate, setAnnualRate] = useState<number>(13.5) // taxa alinhada com Selic/CDI
  const [years, setYears] = useState<number>(5)

  // Estado do Gerador de QR Code
  const [qrText, setQrText] = useState<string>('https://ondaconecta.com.br')
  const [qrDarkColor, setQrDarkColor] = useState<string>('#0f172a')
  const [qrLightColor, setQrLightColor] = useState<string>('#ffffff')

  // Estado do Contador & Analisador de Texto
  const [textContent, setTextContent] = useState<string>(
    'A inovação não é sobre tecnologia, mas sobre como as pessoas transformam o presente em futuro.'
  )
  const [copiedText, setCopiedText] = useState<boolean>(false)

  // Estado do Gerador de Senhas
  const [passwordLength, setPasswordLength] = useState<number>(16)
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true)
  const [generatedPassword, setGeneratedPassword] = useState<string>('Onda#Conecta2026!Sec')
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false)

  // Filtros do Catálogo Curado
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Textos por idioma
  const t = {
    pt: {
      tag: 'Hub de Utilitários & Inteligência',
      title: 'Ferramentas Úteis',
      subtitle:
        'Aumente sua produtividade diária com utilitários interativos gratuitos que rodam direto no navegador e descubra as melhores soluções globais.',
      tabInteractive: 'Utilitários Rápidos no Browser',
      tabCurated: 'Diretório Curado de Softwares & IA',
      searchPlaceholder: 'Buscar ferramenta, utilitário ou IA...',
      allCategories: 'Todas',
      catIa: 'Inteligência Artificial',
      catProd: 'Produtividade',
      catDocs: 'Documentos & PDFs',
      catDesign: 'Design & Imagem',
      catDev: 'Desenvolvedor',
      openTool: 'Acessar Ferramenta',
      // Investment Calc
      calcTitle: 'Calculadora de Juros Compostos & Renda Fixa',
      calcDesc: 'Simule a evolução do seu patrimônio com aportes mensais e juros compostos.',
      initialCapital: 'Valor Inicial (R$)',
      monthlyAmount: 'Aporte Mensal (R$)',
      interestRate: 'Taxa Anual (% a.a. / Selic / CDI)',
      investmentPeriod: 'Prazo (Anos)',
      totalInvested: 'Total Investido',
      totalInterest: 'Juros Acumulados',
      finalTotal: 'Montante Final Estimado',
      // QR Code
      qrTitle: 'Gerador de QR Code Instantâneo',
      qrDesc: 'Crie QR Codes profissionais para links, mensagens ou redes sociais com download direto.',
      qrInputLabel: 'Link ou Conteúdo do QR Code',
      qrDownload: 'Baixar QR Code (PNG)',
      // Text Analyzer
      textTitle: 'Contador de Palavras & Analisador de SEO',
      textDesc: 'Analise tamanho de títulos, densidade de caracteres e tempo de leitura estimado.',
      charCount: 'Caracteres',
      wordCount: 'Palavras',
      readingTime: 'Tempo de Leitura',
      cleanSpaces: 'Limpar Espaços Duplos',
      toUpperCase: 'MAIÚSCULAS',
      toLowerCase: 'minúsculas',
      copied: 'Copiado!',
      copy: 'Copiar Texto',
      // Password Gen
      passTitle: 'Gerador de Senhas Criptográficas',
      passDesc: 'Crie senhas ultra-seguras geradas localmente sem envio para servidores.',
      passLength: 'Comprimento da Senha',
      genPassButton: 'Gerar Nova Senha',
      copyPassButton: 'Copiar Senha'
    },
    en: {
      tag: 'Utilities & Intelligence Hub',
      title: 'Useful Tools',
      subtitle:
        'Supercharge your daily workflow with free browser-based tools and explore the finest curated directory of AI and productivity software.',
      tabInteractive: 'Interactive Browser Tools',
      tabCurated: 'Curated Software & AI Directory',
      searchPlaceholder: 'Search tools, software, or AI...',
      allCategories: 'All',
      catIa: 'Artificial Intelligence',
      catProd: 'Productivity',
      catDocs: 'Documents & PDFs',
      catDesign: 'Design & Visuals',
      catDev: 'Developer',
      openTool: 'Visit Tool',
      calcTitle: 'Compound Interest & Wealth Calculator',
      calcDesc: 'Forecast capital accumulation through recurring deposits and compounding rates.',
      initialCapital: 'Initial Deposit ($)',
      monthlyAmount: 'Monthly Contribution ($)',
      interestRate: 'Annual Interest Rate (%)',
      investmentPeriod: 'Time Horizon (Years)',
      totalInvested: 'Total Capital Deposited',
      totalInterest: 'Compounded Interest',
      finalTotal: 'Estimated Future Wealth',
      qrTitle: 'Instant QR Code Generator',
      qrDesc: 'Generate clean, scannable QR Codes for URLs, text, or payment links.',
      qrInputLabel: 'Target URL or Content',
      qrDownload: 'Download QR Code (PNG)',
      textTitle: 'Word Counter & SEO Text Analyzer',
      textDesc: 'Inspect character limits, word density, and estimated reading duration.',
      charCount: 'Characters',
      wordCount: 'Words',
      readingTime: 'Reading Duration',
      cleanSpaces: 'Clean Extra Spaces',
      toUpperCase: 'UPPERCASE',
      toLowerCase: 'lowercase',
      copied: 'Copied!',
      copy: 'Copy Text',
      passTitle: 'Cryptographic Password Generator',
      passDesc: 'Create entropy-rich passwords processed purely client-side for maximum security.',
      passLength: 'Password Length',
      genPassButton: 'Generate Password',
      copyPassButton: 'Copy Password'
    },
    es: {
      tag: 'Centro de Utilidades e Inteligencia',
      title: 'Herramientas Útiles',
      subtitle:
        'Aumente su productividad diaria con utilidades interactivas que funcionan en su navegador y descubra el mejor catálogo de software e IA.',
      tabInteractive: 'Herramientas en el Navegador',
      tabCurated: 'Directorio Curado de IA y Software',
      searchPlaceholder: 'Buscar herramienta, software o IA...',
      allCategories: 'Todas',
      catIa: 'Inteligencia Artificial',
      catProd: 'Productividad',
      catDocs: 'Documentos y PDFs',
      catDesign: 'Diseño e Imagen',
      catDev: 'Desarrolladores',
      openTool: 'Visitar Herramienta',
      calcTitle: 'Calculadora de Interés Compuesto e Inversión',
      calcDesc: 'Proyecte el crecimiento de su capital con aportaciones periódicas y rentabilidad anual.',
      initialCapital: 'Capital Inicial',
      monthlyAmount: 'Aportación Mensual',
      interestRate: 'Tasa Anual (%)',
      investmentPeriod: 'Plazo (Años)',
      totalInvested: 'Total Aportado',
      totalInterest: 'Intereses Generados',
      finalTotal: 'Monto Final Estimado',
      qrTitle: 'Generador Instantáneo de Códigos QR',
      qrDesc: 'Genere códigos QR de alta definición para enlaces, contactos o páginas web.',
      qrInputLabel: 'Enlace o Contenido del QR',
      qrDownload: 'Descargar Código QR (PNG)',
      textTitle: 'Contador de Palabras y Análisis SEO',
      textDesc: 'Analice longitud de caracteres, densidad de texto y tiempo estimado de lectura.',
      charCount: 'Caracteres',
      wordCount: 'Palabras',
      readingTime: 'Tiempo de Lectura',
      cleanSpaces: 'Limpiar Espacios',
      toUpperCase: 'MAYÚSCULAS',
      toLowerCase: 'minúsculas',
      copied: '¡Copiado!',
      copy: 'Copiar Texto',
      passTitle: 'Generador de Contraseñas Criptográficas',
      passDesc: 'Genere credenciales seguras de alta entropía procesadas de manera 100% local.',
      passLength: 'Longitud de Contraseña',
      genPassButton: 'Generar Contraseña',
      copyPassButton: 'Copiar Contraseña'
    }
  }[lang]

  // Cálculos de Juros Compostos
  const investmentResults = useMemo(() => {
    const r = (annualRate || 0) / 100 / 12
    const totalMonths = (years || 1) * 12
    const P = initialAmount || 0
    const PMT = monthlyContribution || 0

    let futureValue = P * Math.pow(1 + r, totalMonths)
    if (r > 0) {
      futureValue += PMT * ((Math.pow(1 + r, totalMonths) - 1) / r)
    } else {
      futureValue += PMT * totalMonths
    }

    const totalInvested = P + PMT * totalMonths
    const totalInterest = Math.max(0, futureValue - totalInvested)

    return {
      totalInvested,
      totalInterest,
      finalTotal: futureValue
    }
  }, [initialAmount, monthlyContribution, annualRate, years])

  // Formatação de Moeda
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: lang === 'pt' ? 'BRL' : 'USD',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Métricas do Contador de Texto
  const textStats = useMemo(() => {
    const chars = textContent.length
    const trimmed = textContent.trim()
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length
    const readingMinutes = Math.ceil(words / 200) || 1
    return { chars, words, readingMinutes }
  }, [textContent])

  // Gerador de Senha
  const generateNewPassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) chars += '0123456789'
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let result = ''
    const array = new Uint32Array(passwordLength)
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array)
      for (let i = 0; i < passwordLength; i++) {
        result += chars[array[i] % chars.length]
      }
    } else {
      for (let i = 0; i < passwordLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    }
    setGeneratedPassword(result)
  }

  // Filtragem do Catálogo Curado
  const filteredCuratedTools = useMemo(() => {
    return CURATED_TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const desc = tool.description[lang] || tool.description.pt
      const matchesQuery =
        query === '' ||
        tool.name.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [selectedCategory, searchQuery, lang])

  // QR Code URL (via serviço de alta disponibilidade sem tracking)
  const qrCodeUrl = useMemo(() => {
    const encoded = encodeURIComponent(qrText || 'https://ondaconecta.com.br')
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}&color=${qrDarkColor.replace('#', '')}&bgcolor=${qrLightColor.replace('#', '')}&margin=10`
  }, [qrText, qrDarkColor, qrLightColor])

  return (
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12'>
      {/* Hero Header */}
      <div className='text-center max-w-3xl mx-auto space-y-4'>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider'>
          <Sparkles className='h-3.5 w-3.5' />
          {t.tag}
        </div>
        <h1 className='text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
          {t.title}
        </h1>
        <p className='text-base sm:text-lg text-muted-foreground leading-relaxed'>
          {t.subtitle}
        </p>
      </div>

      {/* Tabs Principais */}
      <div className='flex justify-center'>
        <div className='inline-flex p-1.5 rounded-xl bg-muted/80 border shadow-inner'>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'interactive'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calculator className='h-4 w-4' />
            {t.tabInteractive}
          </button>
          <button
            onClick={() => setActiveTab('curated')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'curated'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className='h-4 w-4' />
            {t.tabCurated}
          </button>
        </div>
      </div>

      {/* ABA 1: Utilitários Interativos */}
      {activeTab === 'interactive' && (
        <div className='space-y-8 animate-in fade-in duration-300'>
          {/* Seletor do Utilitário Ativo */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <button
              onClick={() => setActiveInteractiveTool('investment')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all ${
                activeInteractiveTool === 'investment'
                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <TrendingUp className='h-4 w-4' />
              {lang === 'pt' ? 'Juros Compostos' : lang === 'es' ? 'Interés Compuesto' : 'Compound Interest'}
            </button>

            <button
              onClick={() => setActiveInteractiveTool('qrcode')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all ${
                activeInteractiveTool === 'qrcode'
                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <QrCode className='h-4 w-4' />
              QR Code
            </button>

            <button
              onClick={() => setActiveInteractiveTool('text')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all ${
                activeInteractiveTool === 'text'
                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <FileText className='h-4 w-4' />
              {lang === 'pt' ? 'Contador & SEO' : lang === 'es' ? 'Contador y SEO' : 'Word Counter'}
            </button>

            <button
              onClick={() => setActiveInteractiveTool('password')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all ${
                activeInteractiveTool === 'password'
                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <KeyRound className='h-4 w-4' />
              {lang === 'pt' ? 'Gerador de Senha' : lang === 'es' ? 'Contraseñas' : 'Passwords'}
            </button>
          </div>

          {/* 1. CALCULADORA DE JUROS COMPOSTOS */}
          {activeInteractiveTool === 'investment' && (
            <Card className='border shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-primary' />
                  {t.calcTitle}
                </CardTitle>
                <CardDescription>{t.calcDesc}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='initialAmount'>{t.initialCapital}</Label>
                    <Input
                      id='initialAmount'
                      type='number'
                      min='0'
                      value={initialAmount}
                      onChange={e => setInitialAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='monthlyContribution'>{t.monthlyAmount}</Label>
                    <Input
                      id='monthlyContribution'
                      type='number'
                      min='0'
                      value={monthlyContribution}
                      onChange={e => setMonthlyContribution(Number(e.target.value))}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='annualRate'>{t.interestRate}</Label>
                    <Input
                      id='annualRate'
                      type='number'
                      step='0.1'
                      min='0'
                      value={annualRate}
                      onChange={e => setAnnualRate(Number(e.target.value))}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='years'>{t.investmentPeriod}</Label>
                    <Input
                      id='years'
                      type='number'
                      min='1'
                      max='40'
                      value={years}
                      onChange={e => setYears(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Bloco de Resultados */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t'>
                  <div className='p-4 rounded-xl bg-muted/50 space-y-1'>
                    <span className='text-xs font-medium text-muted-foreground'>{t.totalInvested}</span>
                    <p className='text-xl font-bold text-foreground'>
                      {formatCurrency(investmentResults.totalInvested)}
                    </p>
                  </div>
                  <div className='p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1'>
                    <span className='text-xs font-medium text-emerald-700 dark:text-emerald-400'>{t.totalInterest}</span>
                    <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>
                      +{formatCurrency(investmentResults.totalInterest)}
                    </p>
                  </div>
                  <div className='p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1'>
                    <span className='text-xs font-medium text-primary'>{t.finalTotal}</span>
                    <p className='text-2xl font-black text-primary'>
                      {formatCurrency(investmentResults.finalTotal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. GERADOR DE QR CODE */}
          {activeInteractiveTool === 'qrcode' && (
            <Card className='border shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <QrCode className='h-5 w-5 text-primary' />
                  {t.qrTitle}
                </CardTitle>
                <CardDescription>{t.qrDesc}</CardDescription>
              </CardHeader>
              <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
                <div className='md:col-span-2 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='qrText'>{t.qrInputLabel}</Label>
                    <Input
                      id='qrText'
                      type='text'
                      placeholder='https://seusite.com.br ou texto...'
                      value={qrText}
                      onChange={e => setQrText(e.target.value)}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <Label className='text-xs text-muted-foreground'>Cor dos Módulos</Label>
                      <input
                        type='color'
                        value={qrDarkColor}
                        onChange={e => setQrDarkColor(e.target.value)}
                        className='w-full h-10 rounded-lg cursor-pointer border bg-background'
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label className='text-xs text-muted-foreground'>Cor de Fundo</Label>
                      <input
                        type='color'
                        value={qrLightColor}
                        onChange={e => setQrLightColor(e.target.value)}
                        className='w-full h-10 rounded-lg cursor-pointer border bg-background'
                      />
                    </div>
                  </div>

                  <a
                    href={qrCodeUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    download='qrcode-ondaconecta.png'
                    className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all'
                  >
                    <Download className='h-4 w-4' />
                    {t.qrDownload}
                  </a>
                </div>

                <div className='flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border'>
                  <img
                    src={qrCodeUrl}
                    alt='QR Code gerado'
                    className='w-48 h-48 rounded-xl shadow-md bg-white p-2'
                  />
                  <span className='mt-3 text-xs text-muted-foreground text-center truncate max-w-[200px]'>
                    {qrText}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. CONTADOR DE PALAVRAS & ANALISADOR DE TEXTO */}
          {activeInteractiveTool === 'text' && (
            <Card className='border shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-primary' />
                  {t.textTitle}
                </CardTitle>
                <CardDescription>{t.textDesc}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='p-4 rounded-xl bg-muted/40 border text-center'>
                    <span className='text-xs text-muted-foreground font-medium'>{t.charCount}</span>
                    <p className='text-2xl font-bold text-foreground'>{textStats.chars}</p>
                  </div>
                  <div className='p-4 rounded-xl bg-muted/40 border text-center'>
                    <span className='text-xs text-muted-foreground font-medium'>{t.wordCount}</span>
                    <p className='text-2xl font-bold text-foreground'>{textStats.words}</p>
                  </div>
                  <div className='p-4 rounded-xl bg-muted/40 border text-center'>
                    <span className='text-xs text-muted-foreground font-medium'>{t.readingTime}</span>
                    <p className='text-2xl font-bold text-primary'>~{textStats.readingMinutes} min</p>
                  </div>
                </div>

                <Textarea
                  rows={6}
                  placeholder='Cole ou digite seu texto aqui para analisar...'
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className='font-sans leading-relaxed'
                />

                <div className='flex flex-wrap gap-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setTextContent(textContent.toUpperCase())}
                  >
                    {t.toUpperCase}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setTextContent(textContent.toLowerCase())}
                  >
                    {t.toLowerCase}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setTextContent(textContent.replace(/\s+/g, ' ').trim())}
                  >
                    {t.cleanSpaces}
                  </Button>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => {
                      navigator.clipboard.writeText(textContent)
                      setCopiedText(true)
                      setTimeout(() => setCopiedText(false), 2000)
                    }}
                    className='ml-auto'
                  >
                    {copiedText ? (
                      <>
                        <Check className='h-4 w-4 mr-1 text-emerald-500' />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className='h-4 w-4 mr-1' />
                        {t.copy}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. GERADOR DE SENHA */}
          {activeInteractiveTool === 'password' && (
            <Card className='border shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <KeyRound className='h-5 w-5 text-primary' />
                  {t.passTitle}
                </CardTitle>
                <CardDescription>{t.passDesc}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Visualizador da Senha */}
                <div className='flex items-center gap-3 p-4 rounded-xl bg-muted/60 border'>
                  <span className='font-mono text-lg font-semibold tracking-wider text-foreground break-all flex-1'>
                    {generatedPassword}
                  </span>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword)
                      setCopiedPassword(true)
                      setTimeout(() => setCopiedPassword(false), 2000)
                    }}
                  >
                    {copiedPassword ? (
                      <Check className='h-4 w-4 text-emerald-500' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <Label htmlFor='passLength'>{t.passLength}</Label>
                      <span className='font-mono font-bold text-primary'>{passwordLength}</span>
                    </div>
                    <input
                      id='passLength'
                      type='range'
                      min='8'
                      max='32'
                      value={passwordLength}
                      onChange={e => setPasswordLength(Number(e.target.value))}
                      className='w-full accent-primary cursor-pointer'
                    />
                  </div>

                  <div className='flex items-center gap-4 flex-wrap'>
                    <label className='flex items-center gap-2 text-sm cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={includeUppercase}
                        onChange={e => setIncludeUppercase(e.target.checked)}
                        className='rounded accent-primary'
                      />
                      A-Z
                    </label>
                    <label className='flex items-center gap-2 text-sm cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={includeNumbers}
                        onChange={e => setIncludeNumbers(e.target.checked)}
                        className='rounded accent-primary'
                      />
                      0-9
                    </label>
                    <label className='flex items-center gap-2 text-sm cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={includeSymbols}
                        onChange={e => setIncludeSymbols(e.target.checked)}
                        className='rounded accent-primary'
                      />
                      !@#$
                    </label>
                  </div>
                </div>

                <Button onClick={generateNewPassword} className='w-full sm:w-auto'>
                  <RotateCcw className='h-4 w-4 mr-2' />
                  {t.genPassButton}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ABA 2: Catálogo Curado de Softwares & IA */}
      {activeTab === 'curated' && (
        <div className='space-y-8 animate-in fade-in duration-300'>
          {/* Barra de Busca e Filtros */}
          <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
            <div className='relative w-full sm:w-80'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>

            <div className='flex flex-wrap gap-1.5 w-full sm:w-auto'>
              {[
                { id: 'all', label: t.allCategories },
                { id: 'ia', label: 'IA' },
                { id: 'produtividade', label: 'Produtividade' },
                { id: 'documentos', label: 'PDFs & Docs' },
                { id: 'design', label: 'Design' },
                { id: 'dev', label: 'Dev' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cards de Ferramentas */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredCuratedTools.map(tool => (
              <Card
                key={tool.id}
                className='flex flex-col justify-between border transition-all hover:border-primary/50 hover:shadow-md'
              >
                <CardHeader className='space-y-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                      {tool.category}
                    </span>
                    <div className='flex items-center gap-1.5'>
                      {tool.badge && (
                        <Badge variant='secondary' className='text-[10px] font-semibold'>
                          {tool.badge}
                        </Badge>
                      )}
                      <Badge variant='outline' className='text-[10px]'>
                        {tool.pricing}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className='text-lg font-bold text-foreground'>{tool.name}</CardTitle>
                  <CardDescription className='line-clamp-3 text-sm leading-relaxed'>
                    {tool.description[lang] || tool.description.pt}
                  </CardDescription>
                </CardHeader>

                <CardContent className='pt-0'>
                  <a
                    href={tool.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground'
                  >
                    <span>{t.openTool}</span>
                    <ExternalLink className='h-3.5 w-3.5' />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCuratedTools.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              Nenhuma ferramenta encontrada com o termo pesquisado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ToolsHub
