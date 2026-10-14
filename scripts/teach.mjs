// Live class mode: you drive from speaker view, every mentee's screen follows.
//
//   npm run teach -- 3            week 3, mentees on the same Wi-Fi
//   npm run teach -- 3 --online   week 3, plus a public link for online mentees
//   npm run teach -- map          the course map
//
// Prints two links: one to share with mentees (view only, follows you) and one
// for you (speaker view, password protected). A new password is made every run.
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { networkInterfaces } from 'node:os'

const args = process.argv.slice(2)
const which = args.find(a => !a.startsWith('--')) || '1'
const online = args.includes('--online')
const deck = which === 'map' ? 'slides.md' : `week-${which}.md`
if (!existsSync(deck)) {
  console.error(`No deck called ${deck}. Use a week number from 1 to 6, or "map".`)
  process.exit(1)
}
const port = 3030 + (which === 'map' ? 0 : Number(which))
const password = randomBytes(4).toString('hex')
const lan = Object.values(networkInterfaces()).flat().find(i => i && i.family === 'IPv4' && !i.internal)?.address

console.log(`
  Teaching ${deck}

  You (speaker view, keep this private):
    http://localhost:${port}/#/presenter/1?password=${password}

  Mentees on your Wi-Fi (they follow you):
    http://${lan || '<your-ip>'}:${port}/#/1
${online ? '\n  Mentees online: a public link appears below in a few seconds.\n  Close this window to take it down.\n' : '\n  Online mentees? Stop this and run:  npm run teach -- ' + which + ' --online\n'}`)

const cli = ['slidev', deck, '--remote', password, '--port', String(port)]
const child = spawn('npx', cli, { stdio: 'inherit' })
child.on('exit', code => process.exit(code ?? 0))

if (online) {
  // A Cloudflare quick tunnel: free, no account, the link dies when you stop.
  // Needs the cloudflared binary (macOS: brew install cloudflared).
  const tunnel = spawn('cloudflared', ['tunnel', '--no-autoupdate', '--url', `http://localhost:${port}`])
  tunnel.on('error', () => {
    console.error('\n  cloudflared is not installed. On a Mac: brew install cloudflared\n')
  })
  let shown = false
  const watch = (buf) => {
    const url = String(buf).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0]
    if (url && !shown) {
      shown = true
      console.log(`\n  >>> Mentees online (send this):  ${url}/#/1\n`)
    }
  }
  tunnel.stdout.on('data', watch)
  tunnel.stderr.on('data', watch)
  const stop = () => { tunnel.kill(); child.kill() }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  child.on('exit', () => tunnel.kill())
}
