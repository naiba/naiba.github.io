import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const domains = [
  'meatbag.co',
  'qio.ng',
  'yii.com',
  'nai.ba',
  'pppppppppp.com',
  'lajilao.com',
  '5.nu',
  'nb2.com',
  'gg0.com',
  'magua.net',
  'qundao.com',
  'oh1.com',
  'vibeeeee.com',
  'pi4.com',
  'infiniteprogress.org',
  'notthegoodguy.com',
]

function encodeDomainsPlugin(): Plugin {
  const virtualModuleId = 'virtual:domains'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'encode-domains',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const encoded = domains.map(d => Buffer.from(d).toString('base64'))
        return `export const domains = ${JSON.stringify(encoded)};`
      }
    },
  }
}

export default defineConfig({
  plugins: [encodeDomainsPlugin(), react()],
  base: '/',
})
