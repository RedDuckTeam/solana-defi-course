// Prints every deck's slides as "number  title" (for session plans and the teacher guide).
import { load } from '@slidev/parser/fs'
import { resolve } from 'node:path'
const decks = process.argv.slice(2).length ? process.argv.slice(2) : ['slides.md', 'week-1.md', 'week-2.md', 'week-3.md', 'week-4.md', 'week-5.md', 'week-6.md']
for (const d of decks) {
  const data = await load(resolve('.'), resolve(d))
  console.log(`\n## ${d} (${data.slides.length} slides)`)
  data.slides.forEach((s, i) => {
    const fm = s.source?.frontmatter || {}
    const t = s.title || fm.heading || (s.source?.content.match(/q="([^"]+)"/)?.[1] ? 'Quiz: ' + s.source.content.match(/q="([^"]+)"/)[1] : '') || (fm.layout ? `[${fm.layout}]` : '(untitled)')
    console.log(`${String(i + 1).padStart(2)}  ${fm.layout === 'section' ? '§ ' : ''}${t.replace(/\s+/g, ' ').slice(0, 90)}`)
  })
}
