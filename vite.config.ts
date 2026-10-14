import { defineConfig } from 'vite'

// Let mentees reach `npm run teach -- N --online` through a Cloudflare quick tunnel.
// Dev server only; the built site is static and unaffected.
export default defineConfig({
  server: { allowedHosts: ['.trycloudflare.com'] },
})
