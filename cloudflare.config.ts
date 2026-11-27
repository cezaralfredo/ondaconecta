import { defineConfig } from 'cf/config'

export default defineConfig({
  accountId: '43cc48c6912f96cf45bf4177dcbe31ce',
  worker: {
    name: 'ondaconecta',
    compatibilityDate: '2026-11-27',
    workersDev: false,
    previewUrls: true,
    assets: {
      htmlHandling: 'drop-trailing-slash',
      notFoundHandling: '404-page'
    },
    domains: ['ondaconecta.com.br']
  }
})
