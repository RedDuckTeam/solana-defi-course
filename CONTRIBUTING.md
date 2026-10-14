# How these decks are built

Read this before adding a slide or a component. The rules keep six decks looking like one course.

## Files

- `slides.md` is the course map (week 0). `week-1.md` to `week-6.md` are one deck per class.
- `components/` holds every Vue component. All decks share it. Name components after what they show (`AmmCurve.vue`, `HealthFactor.vue`), never after the week.
- `layouts/week.vue` is the cover of each week. `layouts/section.vue` divides a week into parts.
- `styles/index.css` holds the tokens. Nothing else defines a colour or a font size.

## The slide rule: short on the slide, deep in the notes

- A slide carries one idea. Aim for 25 words or fewer of visible text, plus a diagram or a widget.
- Everything the teacher needs to say goes into the speaker notes: an HTML comment at the end of the slide (`<!-- ... -->`). Notes can be long. Put the numbers, the "why", the likely student questions and the answers there.
- Every week runs in this order: `week` cover, a one-slide "today" map, the teaching sections (30 minutes of class, no more), one or two `<Quiz>` checks, the task (`<Tracks>`), the blog prompt, then a "Teacher prep" appendix after a `section` divider. The appendix holds the "You, before class" work and the "verify before class" list, so the teacher can skip it live.

## Colour means something

| Token | Use it for |
|---|---|
| `--ink` / `.ink` | traditional finance: banks, brokers, paper ledgers |
| `--chain` / `.chain` | on-chain: programs, accounts, transactions, Solana |
| `--loss` / `.loss` | risk, loss, attacks, liquidation |
| `--gain` / `.gain` | profit, healthy, correct |
| `--warn` / `.warn` | "verify this before class" |

## Type

Only the `--fs-*` tokens (or the `.fs-*` classes). No raw `px`, `rem` or `em` font sizes anywhere, and no UnoCSS `text-xl` style size classes. `npm run check:type` fails CI if you add one.

## Motion

- Diagrams animate on the presenter's click, not on a timer. Drive a component from clicks by giving the slide `clicks: N` in its frontmatter and passing `:step="$clicks"` to the component. The component draws state `step` (0 to N).
- Use `v-click`, `v-clicks`, `v-after`, `v-mark` and `v-motion` for text and simple shapes.
- Interactive widgets (sliders, buttons, inputs) live in a `.widget` frame and must work without the presenter clicking through.
- Respect `prefers-reduced-motion` (the base CSS already does).

## Writing

- Plain words. Short sentences. Name things the way a student would.
- No em dashes. Use a comma, a colon or a full stop.
- Every number that changes (TVL, supply, prices) carries a date.
- Facts about incidents, programs and addresses come from the course handbook or an official source, cited in the notes.

## Safety in class

- Devnet only, test tokens only. The only real-money activity is the optional $5 supply in week 4, and the slides say so.
- Never ask anyone to share a seed phrase or private key, even as an example.
