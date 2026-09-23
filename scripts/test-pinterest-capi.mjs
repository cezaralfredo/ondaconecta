/**
 * Test script for Pinterest Conversions API (v5)
 * Executa um teste em modo sandbox (?test=true) para validar credenciais e payload.
 * 
 * Uso: node scripts/test-pinterest-capi.mjs
 */

import crypto from 'crypto';

const AD_ACCOUNT_ID = '549770820233';
const DEFAULT_ENCODED = 'cGluYV9BSUEyUkZBV0FDWTRVQUFBR0FBTEdCT1hWVVE0NUlBQkFBQUFBQ1hHVlVXNjdWM0FMVDdSTkJUSFVFS003SVNTRENJWFNZWVc2QlhJSUtRREw1QjM0SU9FNjZRWkpCSUE=';
const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN || Buffer.from(DEFAULT_ENCODED, 'base64').toString('utf-8');
const API_URL = `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/events?test=true`;

async function testPinterestCapi() {
  console.log('🚀 Iniciando teste da Pinterest Conversions API (CAPI)...');
  console.log(`📡 Ad Account ID: ${AD_ACCOUNT_ID}`);

  const now = Math.floor(Date.now() / 1000);
  const emailHash = crypto.createHash('sha256').update('gerandoparceria@gmail.com'.trim().toLowerCase()).digest('hex');
  const eventId = 'test_evt_' + Date.now();

  const payload = {
    data: [
      {
        event_name: 'page_visit',
        action_source: 'web',
        event_time: now,
        event_id: eventId,
        event_source_url: 'https://ondaconecta.com.br/',
        user_data: {
          em: [emailHash],
          client_ip_address: '177.136.240.10',
          client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        custom_data: {
          test_execution: true,
          portal: 'Onda Conecta'
        }
      }
    ]
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log(`\nHTTP Status: ${res.status}`);
    console.log('Resposta do Pinterest:', JSON.stringify(data, null, 2));

    if (res.status === 200 && data.num_events_processed > 0) {
      console.log('\n✅ SUCESSO: A API de Conversões do Pinterest respondeu perfeitamente!');
    } else {
      console.log('\n⚠️ AVISO: A API retornou com avisos ou validações pendentes.');
    }
  } catch (err) {
    console.error('❌ Erro de conexão com a API do Pinterest:', err);
  }
}

testPinterestCapi();
