<script setup lang="ts">
// How a Pyth pull oracle gets a price into a lending program, one hop per click.
// 1 publishers, 2 Pythnet aggregates, 3 Hermes serves a signed update, 4 your app fetches it,
// 5 one transaction carries the update and the borrow, 6 the program checks it and uses it,
// 7 decoding the raw number.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const hops = [
  { t: 'Publishers', s: 'Exchanges and market makers' },
  { t: 'Pythnet', s: 'Aggregates price + confidence' },
  { t: 'Hermes', s: 'Serves the latest signed update' },
  { t: 'Your app', s: 'Fetches it over HTTP' },
]
</script>

<template>
  <div class="pp">
    <div class="hops">
      <template v-for="(h, i) in hops" :key="h.t">
        <div class="hop" :class="{ on: step >= i + 1 }"><b>{{ h.t }}</b><small>{{ h.s }}</small></div>
        <div v-if="i < hops.length - 1" class="arr" :class="{ on: step >= i + 2 }"><span class="dot" /></div>
      </template>
    </div>
    <div class="tx" :class="{ on: step >= 5 }">
      <span class="tag">One transaction</span>
      <div class="ix a">1 · Post price update <small>signed by Pyth, verified on-chain</small></div>
      <div class="ix b">2 · Borrow 900 USDC <small>reads the price just posted</small></div>
    </div>
    <div class="check" :class="{ on: step >= 6 }">
      Program checks: <b>signature valid</b> · <b>feed is SOL/USD</b> · <b>not too old</b>, then prices your collateral.
    </div>
    <div class="decode" :class="{ on: step >= 7 }">
      <span class="mono">price: 15234000000, expo: −8</span>
      <span class="eq">→</span>
      <span class="mono">15234000000 × 10⁻⁸ = <b>$152.34</b></span>
    </div>
  </div>
</template>

<style scoped>
.pp { display: grid; gap: 0.9rem; }
.hops { display: grid; grid-template-columns: 1fr 50px 1fr 50px 1fr 50px 1fr; align-items: center; }
.hop { border: 2px solid var(--chain); border-radius: var(--r-md); padding: 0.5rem 0.7rem; background: #fff; opacity: 0.12; transition: opacity 0.5s; }
.hop.on { opacity: 1; }
.hop b { display: block; font-size: var(--fs-md); }
.hop small { font-size: var(--fs-xs); color: var(--ink-2); }
.arr { position: relative; height: 3px; background: var(--rule); margin: 0 4px; }
.arr.on { background: var(--chain); }
.arr .dot { position: absolute; top: -5px; width: 12px; height: 12px; border-radius: 50%; background: var(--chain); opacity: 0; }
.arr.on .dot { animation: hop 1.2s ease-in-out infinite; }
@keyframes hop { from { left: 0; opacity: 0; } 30% { opacity: 1; } to { left: calc(100% - 12px); opacity: 0; } }
.tx { position: relative; border: 2px dashed var(--ink); border-radius: var(--r-md); padding: 1rem 1rem 0.7rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; opacity: 0.12; transition: opacity 0.5s; }
.tx.on { opacity: 1; }
.tag { position: absolute; top: -0.75rem; left: 1rem; background: var(--paper); padding: 0 0.4rem; font-size: var(--fs-sm); font-weight: 750; }
.ix { border-radius: var(--r-sm); padding: 0.5rem 0.7rem; font-weight: 750; font-size: var(--fs-base); }
.ix small { display: block; font-weight: 500; font-size: var(--fs-xs); }
.ix.a { background: var(--chain-soft); color: var(--chain); }
.ix.b { background: var(--paper-2); color: var(--ink); }
.check, .decode { font-size: var(--fs-base); opacity: 0; transition: opacity 0.5s; }
.check.on, .decode.on { opacity: 1; }
.check b { color: var(--gain); }
.decode { display: flex; gap: 0.8rem; align-items: baseline; border-top: 2px solid var(--ink); padding-top: 0.5rem; }
.decode .mono { font-size: var(--fs-base); }
.decode b { font-size: var(--fs-lg); color: var(--chain); }
.eq { color: var(--chain); font-weight: 800; }
</style>
