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
    if (res.status !== 301 || res.location !== expectedLoc) {
      errors.push(`Redirect mismatch on ${fromUrl}: got ${res.status} -> "${res.location}", expected 301 -> "${expectedLoc}"`)
    } else {
      console.log(`OK 301 ${fromUrl} -> ${res.location}`)
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
