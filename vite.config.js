import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

const normalizeAppUrl = (value) => {
  if (!value) return ''

  const trimmed = value.trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appUrl = normalizeAppUrl(
    env.VITE_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || ''
  )

  return {
    logLevel: 'error',
    define: {
      __APP_URL__: JSON.stringify(appUrl),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  }
})
