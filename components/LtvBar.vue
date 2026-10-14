<script setup lang="ts">
// The four numbers of a lending position on one bar. Example market, not a real one:
// max LTV 70%, liquidation threshold 80%. Position: 10 SOL at $150, 900 USDC borrowed.
// step 1 collateral, 2 debt and LTV, 3 max LTV, 4 liquidation threshold, 5 health factor.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
</script>

<template>
  <div class="lb">
    <div class="bar" :class="{ on: step >= 1 }">
      <div class="coll"><span>Collateral: 10 SOL × $150 = <b>$1,500</b></span></div>
      <div class="debt" :style="{ width: step >= 2 ? '60%' : '0%' }"><span v-if="step >= 2">Debt $900</span></div>
      <div class="mark max" :class="{ on: step >= 3 }" style="left: 70%"><i /><span>Max LTV 70%<small>can't borrow past here</small></span></div>
      <div class="mark liq" :class="{ on: step >= 4 }" style="left: 80%"><i /><span>Liquidation 80%<small>bots step in here</small></span></div>
    </div>
    <div class="nums">
      <div :class="{ on: step >= 2 }"><small>LTV</small><b>900 ÷ 1,500 = <span class="chain">60%</span></b></div>
      <div :class="{ on: step >= 5 }"><small>Health factor</small><b>1,500 × 0.80 ÷ 900 = <span class="gain">1.33</span></b><em>Below 1.00 = liquidation</em></div>
    </div>
  </div>
</template>

<style scoped>
.lb { padding-top: 0.5rem; }
.bar { position: relative; height: 70px; border: 2px solid var(--ink); border-radius: var(--r-sm); background: #fff; opacity: 0.1; transition: opacity 0.5s; margin-bottom: 76px; }
.bar.on { opacity: 1; }
.coll { position: absolute; inset: 0; background: repeating-linear-gradient(135deg, var(--chain-soft) 0 10px, #fff 10px 20px); display: flex; align-items: flex-start; justify-content: flex-start; padding: 0.1rem 0.6rem; }
.coll span { font-size: var(--fs-sm); color: var(--ink-2); background: #fff; padding: 0 0.3rem; }
.debt { position: absolute; left: 0; top: 26px; bottom: 0; background: var(--ink); transition: width 1s cubic-bezier(.3,.7,.3,1); display: flex; align-items: center; padding-left: 0.6rem; overflow: hidden; }
.debt span { color: #fff; font-weight: 750; font-size: var(--fs-base); white-space: nowrap; }
.mark { position: absolute; top: -8px; bottom: -72px; opacity: 0; transition: opacity 0.5s; }
.mark.on { opacity: 1; }
.mark i { position: absolute; top: 0; bottom: 0; left: 0; border-left: 3px solid; }
.mark span { position: absolute; bottom: 0; left: 0; white-space: nowrap; font-size: var(--fs-sm); font-weight: 750; }
.max span { transform: translateX(calc(-100% - 8px)); text-align: right; }
.liq span { transform: translateX(8px); text-align: left; }
.mark small { display: block; font-size: var(--fs-2xs); font-weight: 500; color: var(--muted); }
.max i { border-color: var(--warn); } .max span { color: var(--warn); }
.liq i { border-color: var(--loss); } .liq span { color: var(--loss); }
.nums { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
.nums > div { opacity: 0; transition: opacity 0.5s; border-top: 2px solid var(--ink); padding-top: 0.4rem; }
.nums > div.on { opacity: 1; }
.nums small { display: block; font-size: var(--fs-sm); color: var(--muted); }
.nums b { font-size: var(--fs-lg); font-stretch: 108%; }
.nums em { display: block; font-style: normal; font-size: var(--fs-sm); color: var(--loss); font-weight: 650; }
.chain { color: var(--chain); } .gain { color: var(--gain); }
</style>
