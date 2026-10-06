import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/*
 * WhatsApp e Facebook não resolvem caminho relativo em og:image/og:url — sem URL absoluta
 * o link compartilhado aparece sem imagem. Como o domínio só existe depois do deploy, ele
 * entra como variável de build (VITE_SITE_URL) e é injetado no index.html aqui.
 *
 * Sem a variável, os marcadores viram caminho relativo: a página continua válida, só perde
 * a prévia rica no compartilhamento.
 */
function injetarUrlDoSite(urlDoSite: string): Plugin {
  const base = urlDoSite.trim().replace(/\/+$/, '')
  return {
    name: 'meu-galinheiro:url-do-site',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', base)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo vazio: lê o .env local e também as variáveis que o host (Vercel/Netlify)
  // injeta no ambiente de build.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      injetarUrlDoSite(env.VITE_SITE_URL ?? ''),
    ],
  }
})
