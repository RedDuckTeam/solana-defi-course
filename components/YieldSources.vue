<script setup lang="ts">
// "Who pays you?" One yield source per click: the payer on the left, a coin travelling to you.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const rows = [
  { src: 'LP fees', payer: 'Traders swapping', ex: 'Raydium, Orca, Meteora pools', tone: 'gain', lasts: 'Lasts while volume lasts' },
  { src: 'Staking', payer: 'Network issuance + MEV tips', ex: 'JitoSOL, JupSOL, mSOL', tone: 'gain', lasts: 'Lasts while the network runs' },
  { src: 'Lending interest', payer: 'Borrowers', ex: 'Kamino Lend, Jupiter Lend', tone: 'gain', lasts: 'Lasts while people borrow' },
  { src: 'Token emissions', payer: 'Newly printed tokens', ex: 'Farm rewards', tone: 'loss', lasts: 'Paid by dilution. Ends when the budget does' },
  { src: 'Vaults', payer: 'Same sources, automated', ex: 'Kamino vaults', tone: 'warn', lasts: 'Adds a strategy fee and a smart-contract layer' },
]
</script>

<template>
  <div class="ys">
    <div v-for="(r, i) in rows" :key="r.src" class="row" :class="[{ on: step >= i + 1 }, r.tone]">
      <div class="payer"><b>{{ r.payer }}</b><small>{{ r.ex }}</small></div>
      <div class="track"><span class="coin" /></div>
      <div class="you"><b>{{ r.src }}</b><small>{{ r.lasts }}</small></div>
    </div>
  </div>
</template>

<style scoped>
.ys { display: grid; gap: 0.45rem; }
.row {
  display: grid; grid-template-columns: 290px minmax(0, 1fr) 330px; align-items: center; gap: 0.8rem;
  opacity: 0.08; transition: opacity 0.5s;
}
.row.on { opacity: 1; }
.payer, .you { border: 1.5px solid var(--ink); border-radius: var(--r-md); background: #fff; padding: 0.3rem 0.7rem; }
.payer b, .you b { display: block; font-size: var(--fs-base); }
small { font-size: var(--fs-xs); color: var(--muted); }
.you { border-left-width: 6px; }
.gain .you { border-left-color: var(--gain); }
.loss .you { border-left-color: var(--loss); }
.loss .you small { color: var(--loss); }
.warn .you { border-left-color: var(--warn); }
.track { position: relative; height: 2px; background: var(--rule); }
.coin { position: absolute; top: -7px; left: 0; width: 16px; height: 16px; border-radius: 50%; background: var(--gain); }
.loss .coin { background: var(--loss); }
.warn .coin { background: var(--warn); }
.row.on .coin { animation: travel 1.8s ease-in-out infinite; }
@keyframes travel { from { left: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { left: calc(100% - 16px); opacity: 0; } }
</style>
