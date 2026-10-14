<script setup lang="ts">
// The six weeks written as ledger entries. Each row builds on the previous one;
// `step` reveals rows one by one, and each row links to that week's deck.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const weeks = [
  { n: 1, t: 'Intro to DeFi', d: 'Finance as open programs. The Solana map.', out: 'Trace a Jupiter route' },
  { n: 2, t: 'Wallets & devnet', d: 'Keys, accounts, tokens, transactions.', out: 'Send devnet USDC, read it on Orb' },
  { n: 3, t: 'Liquidity & AMMs', d: 'x · y = k, impermanent loss, yield.', out: 'Provide liquidity on devnet' },
  { n: 4, t: 'Lending & stables', d: 'Collateral, health factor, liquidation, oracles.', out: 'Liquidation spreadsheet' },
  { n: 5, t: 'Risk & security', d: 'Hacks grouped by root cause.', out: 'Post-mortem + token audit' },
  { n: 6, t: 'Capstone & careers', d: 'Build, present, get paid for it.', out: 'Demo day' },
]
</script>

<template>
  <div class="ledger">
    <div class="head"><span>Wk</span><span>Topic</span><span>What you learn</span><span>You ship</span></div>
    <a
      v-for="w in weeks" :key="w.n" class="row" :class="{ shown: step >= w.n }"
      :href="`../week-${w.n}/`"
    >
      <span class="n">{{ w.n }}</span>
      <span class="t">{{ w.t }}</span>
      <span class="d">{{ w.d }}</span>
      <span class="o">{{ w.out }}</span>
    </a>
  </div>
</template>

<style scoped>
.ledger { border-top: 2px solid var(--ink); }
.head, .row { display: grid; grid-template-columns: 48px minmax(0, 1.1fr) minmax(0, 1.6fr) minmax(0, 1.3fr); gap: 1rem; align-items: baseline; }
.head { font-size: var(--fs-xs); color: var(--muted); padding: 0.35rem 0; border-bottom: 1px solid var(--ink); }
.row {
  border-bottom: 1px solid var(--rule) !important; padding: 0.45rem 0; color: var(--ink) !important; text-decoration: none;
  opacity: 0; transform: translateX(-14px); transition: all 0.45s cubic-bezier(.2,.8,.2,1);
}
.row.shown { opacity: 1; transform: none; }
.row:hover { background: var(--chain-soft); }
.n { font-size: var(--fs-xl); font-weight: 900; font-stretch: 62%; color: var(--chain); line-height: 1; }
.t { font-size: var(--fs-md); font-weight: 750; font-stretch: 112%; }
.d { font-size: var(--fs-sm); color: var(--ink-2); }
.o { font-size: var(--fs-sm); color: var(--gain); font-weight: 650; }
</style>
