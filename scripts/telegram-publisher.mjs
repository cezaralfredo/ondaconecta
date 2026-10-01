/**
 * Onda Conecta — Script de Publicação Automática no Telegram
 * Envia novidades e artigos recém-publicados para o canal oficial @ondaconecta
 * utilizando a API oficial de Bots do Telegram.
 * 
 * Uso:
 *   node scripts/telegram-publisher.mjs --latest
 *   node scripts/telegram-publisher.mjs prisao-de-silicio-nvidia-contencao-agentes-ia
 */

import fs from 'fs'
import path from 'path'

function loadEnv() {
  const envPath = path.resolve('.env')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}
loadEnv()

const SITE_URL = 'https://ondaconecta.com.br'
const BLOG_DIR = path.resolve('src/content/blog')

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@ondaconecta'

/**
 * Publica um artigo diretamente no canal do Telegram
 * @param {Object} article
 * @param {string} article.title
 * @param {string} article.description
 * @param {string} article.slug
 * @param {string} article.category
 * @param {number} article.readTime
 * @param {string} [article.imageUrl]
 * @param {string} [article.lang]
 */
export async function postArticleToTelegram(article) {
  if (!BOT_TOKEN) {
    console.log('\nℹ️ [Telegram Publisher] TELEGRAM_BOT_TOKEN não configurado no ambiente (.env).')
    console.log('📌 Passos simples para ativar os disparos no canal @ondaconecta:')
    console.log('  1. Abra o Telegram e procure por @BotFather (https://t.me/BotFather)')
    console.log('  2. Envie o comando /newbot, escolha um nome e usuário (ex: OndaConectaNewsBot)')
    console.log('  3. Copie o token HTTP API gerado e insira no seu .env: TELEGRAM_BOT_TOKEN="seu_token"')
    console.log('  4. No canal @ondaconecta, adicione o bot como Administrador com permissão de postar.')
    return { success: false, reason: 'missing_token' }
  }

  const langPrefix = article.lang === 'en' ? '/en' : article.lang === 'es' ? '/es' : ''
  const postUrl = `${SITE_URL}${langPrefix}/blog/${article.slug}/`

  const fullImageUrl = article.imageUrl
    ? (article.imageUrl.startsWith('http') ? article.imageUrl : `${SITE_URL}${article.imageUrl}`)
    : `${SITE_URL}/images/og-image.png`

  const categoryTag = (article.category || 'Tendências')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')

  // Mensagem formatada em HTML compatível com a API do Telegram
  const caption = `🔥 <b>${escapeHtml(article.title)}</b>\n\n${escapeHtml(article.description)}\n\n🏷️ <b>Categoria:</b> #${categoryTag}\n⏱️ <b>Leitura:</b> ${article.readTime || 5} min\n\n👉 <a href="${postUrl}"><b>Acesse a matéria completa no Onda Conecta</b></a>`

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: '🌐 Ler Notícia no Site',
          url: postUrl
        },
        {
          text: '📢 Compartilhar',
          url: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(article.title)}`
        }
      ]
    ]
  }

  console.log(`\n🚀 Enviando post para o canal ${CHAT_ID}...`)
  console.log(`📰 Título: "${article.title}"`)
  console.log(`🔗 Link: ${postUrl}`)

  try {
    const endpoint = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        photo: fullImageUrl,
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      })
    })

    const data = await res.json()

    if (data.ok) {
      console.log(`✅ SUCESSO: Notícia publicada no canal ${CHAT_ID} com ID de mensagem ${data.result.message_id}!`)
      return { success: true, messageId: data.result.message_id }
    } else {
      console.error(`❌ ERRO da API do Telegram:`, data.description || data)
      return { success: false, error: data }
    }
  } catch (err) {
    console.error(`❌ Erro de conexão com a API do Telegram:`, err.message)
    return { success: false, error: err.message }
  }
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseMdxFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/)
  if (!frontmatterMatch) return null

  const yaml = frontmatterMatch[1]
  const getField = (field) => {
    const m = yaml.match(new RegExp(`^${field}:\\s*["']?(.*?)["']?$`, 'm'))
    return m ? m[1].trim() : ''
  }

  return {
    id: parseInt(getField('id'), 10) || 0,
    slug: getField('slug'),
    title: getField('title'),
    description: getField('description'),
    category: getField('category'),
    readTime: parseInt(getField('readTime'), 10) || 5,
    imageUrl: getField('imageUrl'),
    lang: getField('lang') || 'pt'
  }
}

async function main() {
  const arg = process.argv[2] || '--latest'

  let targetFile = ''

  if (arg === '--latest') {
    const files = fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.mdx') && !f.endsWith('-en.mdx') && !f.endsWith('-es.mdx'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(BLOG_DIR, a))
        const statB = fs.statSync(path.join(BLOG_DIR, b))
        return statB.mtimeMs - statA.mtimeMs
      })

    if (files.length === 0) {
      console.log('Nenhum artigo encontrado em src/content/blog/')
      return
    }
    targetFile = path.join(BLOG_DIR, files[0])
  } else {
    const slugName = arg.replace(/\.mdx$/, '')
    targetFile = path.join(BLOG_DIR, `${slugName}.mdx`)
  }

  if (!fs.existsSync(targetFile)) {
    console.error(`❌ Arquivo não encontrado: ${targetFile}`)
    return
  }

  const article = parseMdxFile(targetFile)
  if (!article) {
    console.error(`❌ Falha ao extrair frontmatter de: ${targetFile}`)
    return
  }

  await postArticleToTelegram(article)
}

if (process.argv[1] && process.argv[1].endsWith('telegram-publisher.mjs')) {
  main().catch(err => {
    console.error('Falha geral no Telegram Publisher:', err)
  })
}
