// Makes every printable file into downloads/ (committed, then served at /downloads/).
//   week-N-slides.pdf    every slide, fully built
//   week-N-speaker.pdf   slide thumbnail beside its full speaker notes, A4, for printing
//   week-N-cheatsheet.pdf  the one-page student handout (handouts/week-N.md)
// Also copies the spreadsheets from materials/.
// Run: npm run export   (needs the Playwright Chromium already used by the screenshot scripts)
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { load } from '@slidev/parser/fs'
import MarkdownIt from 'markdown-it'
import { chromium } from 'playwright-chromium'

const OUT = 'downloads'
const TMP = '.export-tmp'
const md = new MarkdownIt({ html: false, linkify: true, typographer: false, breaks: true })
const decks = [['slides.md', 'course-map'], ...[1, 2, 3, 4, 5, 6].map(n => [`week-${n}.md`, `week-${n}`])]
const only = process.argv.slice(2)

mkdirSync(OUT, { recursive: true })
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

const fontCss = readFileSync('styles/fonts.css', 'utf8').replace(/url\(\/fonts\//g, `url(file://${resolve('public/fonts')}/`)
const baseCss = `${fontCss}
  @page { size: A4; margin: 14mm 14mm 16mm; }
  body { font-family: Archivo, system-ui, sans-serif; color: #16223d; font-size: 10.5pt; line-height: 1.45; margin: 0; }
  h1 { font-size: 20pt; font-stretch: 118%; font-weight: 850; margin: 0 0 2mm; }
  h2 { font-size: 13pt; font-stretch: 112%; margin: 5mm 0 1.5mm; }
  h3 { font-size: 11pt; margin: 3mm 0 1mm; }
  p, li { margin: 0 0 1.5mm; }
  ul, ol { padding-left: 5mm; margin: 0 0 2mm; }
  code { font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; background: #e9e2ff; color: #6a3df0; padding: 0 1mm; border-radius: 1mm; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 1mm 0 3mm; }
  th { text-align: left; border-bottom: 1.5pt solid #16223d; padding: 1mm 1.5mm; }
  td { border-bottom: 0.5pt solid #c5d8bf; padding: 1mm 1.5mm; vertical-align: top; }
  .meta { color: #637087; font-size: 9pt; margin-bottom: 4mm; }
`

const browser = await chromium.launch()
const page = await browser.newPage()

async function printHtml(html, file) {
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true })
}

for (const [deck, name] of decks) {
  if (only.length && !only.some(o => name.includes(o))) continue
  console.log(`▶ ${name}`)
  // 1. slides PDF
  execSync(`npx slidev export ${deck} --output ${OUT}/${name}-slides.pdf --timeout 90000`, { stdio: 'ignore' })
  // 2. thumbnails for the speaker script
  const pngDir = join(TMP, name)
  execSync(`npx slidev export ${deck} --format png --output ${pngDir} --timeout 90000`, { stdio: 'ignore' })
  const pngs = readdirSync(pngDir).filter(f => f.endsWith('.png')).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
  const data = await load(resolve('.'), resolve(deck))
  const rows = data.slides.map((s, i) => {
    const fm = s.source?.frontmatter || {}
    const quiz = s.source?.content.match(/q="([^"]+)"/)?.[1]
    const title = (s.title || fm.heading || (quiz ? `Quiz: ${quiz}` : '') || (fm.layout === 'section' ? 'Section' : `Slide ${i + 1}`)).replace(/<[^>]+>/g, '')
    const note = (s.note || s.source?.note || '').trim()
    const img = pngs[i] ? `<img src="data:image/png;base64,${readFileSync(join(pngDir, pngs[i])).toString('base64')}">` : ''
    return `<section class="row"><div class="thumb">${img}<div class="no">${i + 1}</div></div><div class="note"><h3>${title}</h3>${note ? md.render(note) : '<p class="none">No notes. Let the slide speak.</p>'}</div></section>`
  }).join('')
  const label = name === 'course-map' ? 'Course map' : `Week ${name.split('-')[1]}`
  await printHtml(`<html><head><style>${baseCss}
    .row { display: grid; grid-template-columns: 62mm 1fr; gap: 5mm; padding: 3mm 0; border-bottom: 0.5pt solid #c5d8bf; break-inside: avoid; }
    .thumb { position: relative; } .thumb img { width: 62mm; border: 0.5pt solid #16223d; border-radius: 1.5mm; display: block; }
    .no { position: absolute; top: 1mm; left: 1mm; background: #16223d; color: #fff; font-size: 8pt; font-weight: 700; padding: 0.3mm 1.5mm; border-radius: 1mm; }
    .note h3 { margin-top: 0; } .note p, .note li { font-size: 9.5pt; } .none { color: #637087; font-style: italic; }
    </style></head><body><h1>DeFi on Solana · ${label}</h1><p class="meta">Speaker script: every slide with its notes. Facts checked 11 to 14 Oct 2026; re-check anything marked "verify".</p>${rows}</body></html>`,
  `${OUT}/${name}-speaker.pdf`)
  // 3. one-page cheat sheet
  const h = `handouts/${name}.md`
  if (existsSync(h)) {
    await printHtml(`<html><head><style>${baseCss}
      body { font-size: 10.5pt; } h1 { border-bottom: 3pt solid #6a3df0; padding-bottom: 2mm; }
      </style></head><body>${md.render(readFileSync(h, 'utf8'))}<p class="meta" style="margin-top:4mm">DeFi on Solana · open course · devnet only · not financial advice</p></body></html>`,
    `${OUT}/${name}-cheatsheet.pdf`)
  }
}
for (const f of existsSync('materials') ? readdirSync('materials') : []) copyFileSync(join('materials', f), join(OUT, f))
await browser.close()
rmSync(TMP, { recursive: true, force: true })
console.log(`Done. Files in ${OUT}/:`, readdirSync(OUT).length)
