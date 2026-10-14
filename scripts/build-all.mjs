// Builds every deck into dist/<deck>/ and copies the course landing page to dist/.
// BASE is the site path, e.g. /solana-defi-course/ on GitHub Pages, / locally.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs'

const base = (process.env.BASE || '/').replace(/\/?$/, '/')
const decks = ['slides', ...readdirSync('.').filter(f => /^week-\d\.md$/.test(f)).map(f => f.replace('.md', '')).sort()]
rmSync('dist', { recursive: true, force: true })
for (const d of decks) {
  const out = d === 'slides' ? 'course' : d
  console.log(`\n▶ building ${d}.md -> dist/${out}/`)
  execSync(`npx slidev build ${d}.md --out dist/${out} --base ${base}${out}/`, { stdio: 'inherit' })
}
if (existsSync('site')) cpSync('site', 'dist', { recursive: true })
if (existsSync('downloads')) cpSync('downloads', 'dist/downloads', { recursive: true })
console.log('\nDone. Decks:', decks.join(', '))
