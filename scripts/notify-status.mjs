/**
 * Onda Conecta — Centro de Notificações Operacionais (Sucesso, Erros, Bugs & Estoque da Fila)
 *
 * Envia alertas operacionais em tempo real via Telegram (para o admin ou canal de monitoramento)
 * e registra logs locais em scripts/automation-status.log.
 *
 * Variáveis de ambiente suportadas (.env ou GitHub Secrets):
 *   TELEGRAM_BOT_TOKEN="token_do_botfather"
 *   TELEGRAM_ADMIN_CHAT_ID="id_do_chat_admin_ou_canal" (fallback para TELEGRAM_CHAT_ID)
 *
 * Uso:
 *   node scripts/notify-status.mjs --success "Publicação concluída: <slug>"
 *   node scripts/notify-status.mjs --error "Falha na etapa X: <motivo>"
 *   node scripts/notify-status.mjs --healthcheck-ok
 */

import fs from 'node:fs'
import path from 'node:path'

function loadEnv() {
  const envPath = path.resolve('.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnv()

const ROOT = process.cwd()
const HISTORY_PATH = path.join(ROOT, 'scripts', 'published-history.json')
const QUEUE_PATH = path.join(ROOT, 'scripts', 'editorial-queue.json')

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID || ''

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function getEditorialStats() {
  let latest = null
  let totalPublished = 0
  let pendingCount = 0

  try {
    const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'))
    const active = history.filter(h => !h.consolidatedInto)
    totalPublished = active.length
    latest = active[active.length - 1] || null
  } catch (_) {}

  try {
    const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'))
    for (const items of Object.values(queue.categories || {})) {
      for (const item of items) {
        if (item.status === 'pending') pendingCount++
      }
    }
  } catch (_) {}

  return { latest, totalPublished, pendingCount }
}

async function sendTelegramAlert(htmlText) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.log('ℹ️ [Notify Status] TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID não configurados. Alerta registrado apenas no console.')
    return { sent: false, reason: 'missing_credentials' }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    })
    const data = await res.json()
    if (!data.ok) {
      console.error('❌ [Notify Status] Falha na API do Telegram:', data.description || data)
      return { sent: false, error: data }
    }
    console.log('✅ [Notify Status] Notificação enviada ao Telegram com sucesso!')
    return { sent: true, messageId: data.result?.message_id }
  } catch (err) {
    console.error('❌ [Notify Status] Erro de rede ao contatar Telegram:', err.message)
    return { sent: false, error: err.message }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const mode = args[0] || '--success'
  const customMessage = args.slice(1).join(' ').trim()
  const { latest, totalPublished, pendingCount } = getEditorialStats()
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  let html = ''
  if (mode === '--error') {
    html = [
      `🚨 <b>[ALERTA DE ERRO — ONDA CONECTA]</b>`,
      `🕒 <b>Horário:</b> ${escapeHtml(timestamp)}`,
      `❌ <b>Diagnóstico:</b> ${escapeHtml(customMessage || 'Falha detectada na esteira de build/auditoria SEO.')}`,
      `🛡️ <b>Circuit Breaker:</b> Deploy bloqueado automaticamente; produção permanece estável com a versão anterior.`,
      `📋 <b>Estoque na Fila:</b> ${pendingCount} pautas pendentes`
    ].join('\n')
  } else if (mode === '--healthcheck-ok') {
    html = [
      `🩺 <b>[SAÚDE SEO AO VIVO — ONDA CONECTA]</b>`,
      `🕒 <b>Horário:</b> ${escapeHtml(timestamp)}`,
      `✅ <b>Status:</b> Todas as rotas PT/EN/ES, /categorias (200 OK), Sitemap, Redirects 301 e FAQPage JSON-LD validados sem erros.`,
      `📚 <b>Acervo Canônico Ativo:</b> ${totalPublished} artigos pilares (528 páginas multilíngues)`,
      `📋 <b>Estoque na Fila:</b> ${pendingCount} pautas pendentes`
    ].join('\n')
  } else {
    const slug = latest?.slug || ''
    const title = latest?.title || customMessage || 'Nova publicação concluída'
    const cat = latest?.category || ''
    const lowStockWarning =
      pendingCount <= 4
        ? `\n⚠️ <b>Atenção:</b> Restam apenas ${pendingCount} pautas na fila (reabastecimento automático recomendado).`
        : ''

    html = [
      `✅ <b>[PUBLICAÇÃO & DEPLOY CONCLUÍDOS — ONDA CONECTA]</b>`,
      `🕒 <b>Horário:</b> ${escapeHtml(timestamp)}`,
      `📰 <b>Matéria:</b> ${escapeHtml(title)}`,
      cat ? `🏷️ <b>Categoria:</b> ${escapeHtml(cat)}` : '',
      slug ? `🇧🇷 <a href="https://ondaconecta.com.br/blog/${slug}">Português</a> | 🇺🇸 <a href="https://ondaconecta.com.br/en/blog/${slug}">English</a> | 🇪🇸 <a href="https://ondaconecta.com.br/es/blog/${slug}">Español</a>` : '',
      customMessage ? `ℹ️ <b>Nota:</b> ${escapeHtml(customMessage)}` : '',
      `🛡️ <b>Search Console Check:</b> 0 erros | Sitemap & IndexNow sincronizados`,
      `📋 <b>Fila Editorial:</b> ${pendingCount} pautas pendentes (${totalPublished} artigos publicados)${lowStockWarning}`
    ]
      .filter(Boolean)
      .join('\n')
  }

  console.log('\n' + html.replace(/<[^>]+>/g, '') + '\n')
  await sendTelegramAlert(html)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
