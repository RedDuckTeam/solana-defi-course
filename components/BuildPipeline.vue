<script setup lang="ts">
// The on-chain capstone as a pipeline. One stage per click; the current stage is outlined,
// finished stages turn green. Tests come before deploys on purpose. Row two runs right to left.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const stages = [
  { t: 'Pick a program', d: 'AMM, escrow or mini lending market', tool: 'program-examples, Blueshift' },
  { t: 'Write it', d: 'Accounts first, then instructions', tool: 'Anchor 1.2.x' },
  { t: 'Test the happy path', d: 'Deposit, swap, withdraw work', tool: 'LiteSVM' },
  { t: 'Test the attack', d: 'Wrong signer, fake account: must fail', tool: 'LiteSVM, week 5' },
  { t: 'Fork mainnet', d: 'Only if it reads Pyth or Kamino', tool: 'Surfpool' },
  { t: 'Deploy', d: 'Devnet, with a funded deployer', tool: 'Anchor CLI' },
  { t: 'Demo', d: 'One real transaction, read aloud', tool: 'Orb ?cluster=devnet' },
]
</script>

<template>
  <ol class="pipe">
    <li v-for="(s, i) in stages" :key="s.t" :class="{ on: step >= i + 1, now: step === i + 1, done: step > i + 1 || step >= 99 }">
      <span class="n">{{ i + 1 }}</span>
      <b>{{ s.t }}</b>
      <span class="d">{{ s.d }}</span>
      <code>{{ s.tool }}</code>
    </li>
  </ol>
</template>

<style scoped>
.pipe { list-style: none; padding: 0 !important; margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.6rem 1.4rem; counter-reset: none; }
.pipe li {
  position: relative; margin: 0 !important; background: #fff; border: 1.5px solid var(--rule); border-radius: var(--r-md); padding: 0.6rem 0.75rem;
  opacity: 0.18; transform: translateY(8px); transition: all 0.45s cubic-bezier(.3,1.3,.5,1);
}
.pipe li.on { opacity: 1; transform: none; border-color: var(--ink); }
.pipe li.now { border-color: var(--chain); box-shadow: 0 0 0 3px var(--chain-soft); }
.pipe li.done { border-color: var(--gain); }
.pipe li:not(:last-child)::after {
  content: '→'; position: absolute; right: -1.15rem; top: 50%; transform: translateY(-50%); color: var(--muted); font-weight: 800; font-size: var(--fs-md);
}
.pipe li:nth-child(4)::after { content: '↓'; right: 45%; top: auto; bottom: -1.65rem; transform: none; }
.pipe li:nth-child(5) { grid-area: 2 / 4; } .pipe li:nth-child(6) { grid-area: 2 / 3; } .pipe li:nth-child(7) { grid-area: 2 / 2; }
.pipe li:nth-child(5)::after, .pipe li:nth-child(6)::after { content: '←'; right: auto; left: -1.15rem; }
.pipe li.done:not(:last-child)::after { color: var(--gain); }
.n { font-size: var(--fs-xl); font-weight: 900; font-stretch: 62%; color: var(--chain); line-height: 1; }
.done .n { color: var(--gain); }
b { display: block; font-size: var(--fs-base); font-stretch: 108%; margin-top: 0.1rem; }
.d { display: block; font-size: var(--fs-xs); color: var(--ink-2); margin: 0.15rem 0 0.35rem; }
code { font-size: var(--fs-2xs) !important; }
</style>
