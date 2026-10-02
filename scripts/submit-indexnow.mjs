/**
 * Onda Conecta — Script de Notificação Automática IndexNow
 * Notifica instantaneamente os motores de busca (Microsoft Bing, Yandex, Seznam, Naver)
 * sobre novos artigos e atualizações de páginas no portal.
 * 
 * Uso manual: 
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs https://ondaconecta.com.br/blog/exemplo/
 */

import fs from 'fs'
import path from 'path'

const HOST = 'ondaconecta.com.br'
const KEY = '1a0c66547d41c2a29b2e9149c1e4a5f1'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

const BLOG_DIR = path.resolve('src/content/blog')

/**
 * Envia uma lista de URLs para o endpoint do IndexNow
 * @param {string[]} urls 
 */
export async function submitToIndexNow(urls) {
  if (!urls || urls.length === 0) {
    console.log('ℹ️ Nenhuma URL informada para envio ao IndexNow.')
    return { success: false, reason: 'empty_urls' }
  }

  // Filtrar e garantir que as URLs pertençam ao domínio oficial
  const cleanUrls = Array.from(new Set(
    urls
      .map(u => u.trim())
      .filter(u => u.startsWith(`https://${HOST}`) || u.startsWith(`http://${HOST}`))
  ))

  if (cleanUrls.length === 0) {
    console.warn(`⚠️ Nenhuma URL válida pertencente ao host https://${HOST} encontrada.`)
    return { success: false, reason: 'invalid_host' }
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: cleanUrls
  }

  console.log(`\n🚀 Enviando ${cleanUrls.length} URL(s) para o protocolo IndexNow (${INDEXNOW_ENDPOINT})...`)
  console.log(`📡 Chave de Validação: ${KEY}`)
  console.log(`📍 Localização da Chave: ${KEY_LOCATION}`)

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    const status = res.status
    let responseText = ''
    try {
      responseText = await res.text()
    } catch (_) {}

    if (status === 200) {
      console.log(`✅ SUCESSO (HTTP 200): URLs indexadas e processadas com êxito!`)
      return { success: true, status }
    } else if (status === 202) {
      console.log(`✅ SUCESSO (HTTP 202): URLs aceitas pelo IndexNow. Validação da chave em andamento.`)
      return { success: true, status }
    } else if (status === 400) {
      console.error(`❌ ERRO (HTTP 400): Formato inválido na requisição do IndexNow.`, responseText)
      return { success: false, status, responseText }
    } else if (status === 403) {
      console.error(`❌ ERRO (HTTP 403): Chave inválida ou arquivo .txt não encontrado em ${KEY_LOCATION}.`, responseText)
      return { success: false, status, responseText }
    } else if (status === 422) {
      console.error(`❌ ERRO (HTTP 422): URLs não correspondem ao host configurado.`, responseText)
      return { success: false, status, responseText }
    } else {
      console.log(`ℹ️ Resposta IndexNow: HTTP ${status}`, responseText || '(Sem corpo de resposta)')
      return { success: status < 400, status, responseText }
    }
  } catch (err) {
    console.error(`❌ Erro de conexão com o endpoint do IndexNow:`, err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Coleta as URLs dos artigos mais recentes e páginas principais
 */
export function getRecentSiteUrls(limit = 60) {
  const urls = [
    `https://${HOST}`,
    `https://${HOST}/en`,
    `https://${HOST}/es`,
    `https://${HOST}/quem-somos`,
    `https://${HOST}/ferramentas`,
    `https://${HOST}/contato`
  ]

  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(BLOG_DIR, a))
        const statB = fs.statSync(path.join(BLOG_DIR, b))
        return statB.mtimeMs - statA.mtimeMs
      })
      .slice(0, limit)

    for (const file of files) {
      const slug = file.replace(/\.(md|mdx)$/, '')
      if (slug.endsWith('-en')) {
        const cleanSlug = slug.replace(/-en$/, '')
        urls.push(`https://${HOST}/en/blog/${cleanSlug}`)
      } else if (slug.endsWith('-es')) {
        const cleanSlug = slug.replace(/-es$/, '')
        urls.push(`https://${HOST}/es/blog/${cleanSlug}`)
      } else {
        urls.push(`https://${HOST}/blog/${slug}`)
      }
    }
  }

  return urls
}

// Execução direta via CLI
async function main() {
  const cliArgs = process.argv.slice(2).filter(arg => arg.startsWith('http'))
  const urlsToSubmit = cliArgs.length > 0 ? cliArgs : getRecentSiteUrls(90)

  console.log(`📋 Total de URLs preparadas: ${urlsToSubmit.length}`)
  const result = await submitToIndexNow(urlsToSubmit)

  if (result.success) {
    console.log(`\n🎉 Notificação do IndexNow concluída com sucesso!`)
  } else {
    console.log(`\n⚠️ O envio finalizou com status:`, result)
  }
}

// Executar se for chamado diretamente
if (process.argv[1] && process.argv[1].endsWith('submit-indexnow.mjs')) {
  main().catch(err => {
    console.error('Falha geral:', err)
  })
}
