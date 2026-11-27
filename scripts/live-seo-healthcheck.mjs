const BASE = 'https://ondaconecta.com.br'
const errors = []

async function fetchStatus(url, redirect = 'manual') {
  const res = await fetch(url, { redirect })
  return { status: res.status, location: res.headers.get('location') || '', body: redirect === 'follow' ? await res.text() : '' }
}

async function main() {
  // 1. Core 200 endpoints & homepage size check (< 350 KB)
  for (const route of ['/', '/en', '/es']) {
    const res = await fetchStatus(`${BASE}${route}`, 'follow')
    if (res.status !== 200) {
      errors.push(`Expected 200 on ${route}, got ${res.status}`)
      continue
    }
    const kb = Buffer.byteLength(res.body, 'utf8') / 1024
    if (kb > 350) {
      errors.push(`Homepage ${route} too large: ${kb.toFixed(1)} KB (max 350 KB)`)
    }
    if (res.body.includes('| Onda Conecta | Onda Conecta')) {
      errors.push(`Duplicated <title> brand suffix on ${route}`)
    }
    console.log(`OK ${route} -> ${res.status} (${kb.toFixed(1)} KB)`)
  }

  for (const asset of ['/robots.txt', '/sitemap-index.xml', '/ads.txt']) {
    const res = await fetchStatus(`${BASE}${asset}`, 'follow')
    if (res.status !== 200) {
      errors.push(`Expected 200 on ${asset}, got ${res.status}`)
    } else {
      console.log(`OK ${asset} -> 200`)
    }
  }

  // 1b. Canonical PT-BR pages must return 200 directly (never 301 to /es or /en) and render in pt-BR
  for (const ptRoute of ['/categorias', '/ferramentas', '/quem-somos', '/contato', '/servicos-ia']) {
    const manualRes = await fetchStatus(`${BASE}${ptRoute}`, 'manual')
    if (manualRes.status !== 200) {
      errors.push(`Expected direct 200 on PT-BR route ${ptRoute}, got ${manualRes.status} (location: "${manualRes.location}")`)
      continue
    }
    const followRes = await fetchStatus(`${BASE}${ptRoute}`, 'follow')
    if (!followRes.body.includes('lang="pt-BR"')) {
      errors.push(`PT-BR route ${ptRoute} is not rendering with lang="pt-BR"`)
    }
    console.log(`OK PT-BR ${ptRoute} -> 200 (lang="pt-BR")`)
  }

  const sitemapRes = await fetchStatus(`${BASE}/sitemap-0.xml`, 'follow')
  if (sitemapRes.status !== 200 || !sitemapRes.body.includes('<loc>https://ondaconecta.com.br/categorias</loc>')) {
    errors.push('Live sitemap-0.xml is missing <loc>https://ondaconecta.com.br/categorias</loc>')
  } else {
    console.log('OK sitemap-0.xml includes https://ondaconecta.com.br/categorias')
  }

  // 2. Canonical 301 redirects (www, trailing slash, consolidated sample)
  const redirectChecks = [
    ['https://www.ondaconecta.com.br/', 'https://ondaconecta.com.br/'],
    [`${BASE}/en/`, `${BASE}/en`],
    [`${BASE}/quem-somos/`, `${BASE}/quem-somos`],
    [`${BASE}/blog/slow-travel-turismo-experiencia-2026/`, `${BASE}/blog/slow-travel-turismo-experiencia-2026`],
    [`${BASE}/blog/modelos-pequenos-ia-slm-edge-ai-empresas`, `${BASE}/blog/small-language-models-slm-npu-ia-offline-empresas-brasil`]
  ]

  for (const [fromUrl, expectedLoc] of redirectChecks) {
    const res = await fetchStatus(fromUrl, 'manual')
    const resolvedLoc = res.location ? new URL(res.location, fromUrl).toString() : ''
    if (res.status !== 301 || resolvedLoc !== expectedLoc) {
      errors.push(`Redirect mismatch on ${fromUrl}: got ${res.status} -> "${res.location}", expected 301 -> "${expectedLoc}"`)
    } else {
      console.log(`OK 301 ${fromUrl} -> ${resolvedLoc}`)
    }
  }

  // 3. Clean FAQPage JSON-LD check on sample article
  const sample = await fetchStatus(`${BASE}/blog/resistencia-antimicrobiana-superbacterias-vigilancia-fiocruz-anvisa-brasil`, 'follow')
  if (sample.status !== 200) {
    errors.push(`Sample article returned ${sample.status}`)
  } else if (/Fontes & Referências Consultadas:.*FAQPage|FAQPage[\s\S]*Fontes & Referências Consultadas:/i.test(sample.body)) {
    errors.push('Live FAQPage JSON-LD still contains Fontes heading')
  } else {
    console.log('OK Live FAQPage JSON-LD clean')
  }

  if (errors.length > 0) {
    console.error(`\nLive SEO Healthcheck FAILED (${errors.length}):`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }

  console.log('\nLive SEO Healthcheck PASSED.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
