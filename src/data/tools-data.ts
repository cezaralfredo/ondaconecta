export interface ToolItem {
  id: string
  name: string
  description: {
    pt: string
    en: string
    es: string
  }
  category: 'ia' | 'produtividade' | 'documentos' | 'design' | 'dev'
  badge?: string
  pricing: 'Gratuito' | 'Freemium' | 'Pago'
  url: string
  iconName?: string
  featured?: boolean
}

export const CURATED_TOOLS: ToolItem[] = [
  // IA & Automação
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: {
      pt: 'IA conversacional de ponta para raciocínio analítico complexo, análise de documentos longos e codificação avançada.',
      en: 'Next-generation conversational AI for complex analytical reasoning, long-context documents, and advanced coding.',
      es: 'IA conversacional de vanguardia para razonamiento analítico complejo, documentos extensos y codificación avanzada.'
    },
    category: 'ia',
    badge: 'Destaque IA',
    pricing: 'Freemium',
    url: 'https://claude.ai',
    featured: true
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    description: {
      pt: 'O assistente de inteligência artificial mais popular do mundo para redação, pesquisa, brainstormings e automação.',
      en: 'The world’s leading AI assistant for copywriting, research, ideation, and daily workflow automation.',
      es: 'El asistente de IA más popular del mundo para redacción, investigación, lluvia de ideas y automatización.'
    },
    category: 'ia',
    badge: 'Líder Global',
    pricing: 'Freemium',
    url: 'https://chatgpt.com',
    featured: true
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: {
      pt: 'Mecanismo de busca alimentado por IA que fornece respostas precisas com citação direta de fontes confiáveis.',
      en: 'AI-driven conversational search engine delivering concise, cited answers from real-time web sources.',
      es: 'Motor de búsqueda con IA que ofrece respuestas directas y fundamentadas citando fuentes en tiempo real.'
    },
    category: 'ia',
    pricing: 'Freemium',
    url: 'https://perplexity.ai'
  },
  {
    id: 'gamma',
    name: 'Gamma.app',
    description: {
      pt: 'Crie apresentações executivas, páginas web e documentos visuais em segundos a partir de um comando de texto.',
      en: 'Generate stunning executive decks, web pages, and documents in seconds using generative AI prompts.',
      es: 'Cree presentaciones corporativas, páginas web y documentos visuales en segundos a partir de texto.'
    },
    category: 'ia',
    pricing: 'Freemium',
    url: 'https://gamma.app'
  },

  // Produtividade & Gestão
  {
    id: 'notion',
    name: 'Notion & Notion AI',
    description: {
      pt: 'O espaço de trabalho tudo-em-um para anotações, wikis de equipe, bancos de dados e gerenciamento ágil de projetos.',
      en: 'The all-in-one workspace for notes, team wikis, connected databases, and project management.',
      es: 'El espacio de trabajo todo en uno para notas, bases de datos y gestión de proyectos colaborativos.'
    },
    category: 'produtividade',
    badge: 'Essencial',
    pricing: 'Freemium',
    url: 'https://notion.so',
    featured: true
  },
  {
    id: 'fireflies',
    name: 'Fireflies.ai',
    description: {
      pt: 'Assistente inteligente que transcreve, sintetiza e busca tarefas automaticamente em reuniões do Meet, Zoom e Teams.',
      en: 'Automated AI meeting assistant that transcribes, generates executive summaries, and extracts action items.',
      es: 'Asistente con IA que transcribe, resume y extrae tareas de reuniones en Meet, Zoom y Teams.'
    },
    category: 'produtividade',
    pricing: 'Freemium',
    url: 'https://fireflies.ai'
  },
  {
    id: 'miro',
    name: 'Miro',
    description: {
      pt: 'Quadro branco digital colaborativo para mapeamento mental, workshops, arquitetura de sistemas e dinâmicas.',
      en: 'Visual collaborative whiteboard platform for remote team ideation, diagramming, and sprint mapping.',
      es: 'Pizarra virtual interactiva para diagramas, lluvia de ideas y mapeo visual de proyectos en equipo.'
    },
    category: 'produtividade',
    pricing: 'Freemium',
    url: 'https://miro.com'
  },

  // Documentos, PDFs & Imagens
  {
    id: 'ilovepdf',
    name: 'iLovePDF',
    description: {
      pt: 'Plataforma líder para juntar, dividir, comprimir e converter documentos PDF para Word, Excel e Powerpoint.',
      en: 'The ultimate online PDF toolkit to merge, split, compress, and convert documents in one click.',
      es: 'La plataforma líder para unir, dividir, comprimir y convertir archivos PDF a Word, Excel y PowerPoint.'
    },
    category: 'documentos',
    pricing: 'Gratuito',
    url: 'https://ilovepdf.com',
    featured: true
  },
  {
    id: 'tinypng',
    name: 'TinyPNG / TinyJPG',
    description: {
      pt: 'Compressão inteligente de imagens WebP, PNG e JPEG reduzindo até 70% do peso sem perda visível de qualidade.',
      en: 'Smart WebP, PNG, and JPEG lossy compression to dramatically boost website speed and save storage.',
      es: 'Compresión inteligente de imágenes WebP, PNG y JPG reduciendo el peso sin perder calidad perceptible.'
    },
    category: 'documentos',
    pricing: 'Gratuito',
    url: 'https://tinypng.com'
  },
  {
    id: 'removebg',
    name: 'Remove.bg',
    description: {
      pt: 'Remoção automática e instantânea de fundos de fotos e retratos com recorte perfeito em segundos via IA.',
      en: 'Instant automated background remover for portraits and product photos with pixel-perfect AI cutouts.',
      es: 'Eliminador instantáneo de fondos en fotografías con recorte automático de alta precisión mediante IA.'
    },
    category: 'design',
    pricing: 'Freemium',
    url: 'https://remove.bg'
  },
  {
    id: 'canva',
    name: 'Canva',
    description: {
      pt: 'Design gráfico descomplicado com milhares de templates profissionais para redes sociais, criativos e impressos.',
      en: 'Empowering visual communication and graphic design with drag-and-drop templates and AI photo tools.',
      es: 'Diseño gráfico ágil con miles de plantillas para redes sociales, presentaciones y creativos visuales.'
    },
    category: 'design',
    badge: 'Popular',
    pricing: 'Freemium',
    url: 'https://canva.com'
  },

  // Desenvolvedores & Dados
  {
    id: 'cyberchef',
    name: 'CyberChef',
    description: {
      pt: 'O canivete suíço digital para decodificação, criptografia, formatação de dados e conversão de formatos brutos.',
      en: 'The cyber Swiss Army knife for decoding, hashing, data parsing, and cryptographic transformation.',
      es: 'La navaja suiza digital para decodificación, cifrado, formateo y transformación de datos en el navegador.'
    },
    category: 'dev',
    pricing: 'Gratuito',
    url: 'https://gchq.github.io/CyberChef'
  }
]
