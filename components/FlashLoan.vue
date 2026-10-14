<script setup lang="ts">
// A flash loan lives inside one transaction. step 1 borrow, 2 use, 3 repay + fee: success.
// step 4 shows the other ending: not repaid, so the whole transaction is undone.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
</script>

<template>
  <div class="fl">
    <div class="box">
      <span class="tag">One transaction, all or nothing</span>
      <div class="ix" :class="{ on: step >= 1 }"><b>1</b><span>Borrow <strong>1,000,000 USDC</strong><small>no collateral</small></span></div>
      <div class="ix" :class="{ on: step >= 2 }"><b>2</b><span>Use it<small>repay someone's debt in a liquidation, or buy low here, sell high there</small></span></div>
      <div class="ix" :class="[{ on: step >= 3 }, step >= 4 ? 'fail' : 'ok']">
        <b>3</b>
        <span v-if="step < 4">Repay <strong>1,000,000 + fee</strong><small>profit stays with you</small></span>
        <span v-else>Can't repay<small>the program refuses to finish</small></span>
      </div>
    </div>
    <div class="result" :class="[{ on: step >= 3 }, step >= 4 ? 'fail' : 'ok']">
      <template v-if="step < 4"><b>Lands</b><span>The pool got its money back plus a fee.</span></template>
      <template v-else><b>Reverted</b><span>As if steps 1 and 2 never happened. Only the network fee is spent.</span></template>
    </div>
  </div>
</template>

<style scoped>
.fl { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 1.6rem; align-items: center; }
.box { position: relative; border: 2px dashed var(--ink); border-radius: var(--r-md); padding: 1.2rem 1rem 0.8rem; display: grid; gap: 0.6rem; }
.tag { position: absolute; top: -0.75rem; left: 1rem; background: var(--paper); padding: 0 0.4rem; font-size: var(--fs-sm); font-weight: 750; }
.ix { display: grid; grid-template-columns: 40px minmax(0, 1fr); align-items: center; gap: 0.7rem; opacity: 0.12; transform: translateX(-10px); transition: all 0.45s; }
.ix.on { opacity: 1; transform: none; }
.ix b { width: 40px; height: 40px; border-radius: 50%; background: var(--chain); color: #fff; display: grid; place-items: center; font-size: var(--fs-md); }
.ix span { font-size: var(--fs-md); }
.ix small { display: block; font-size: var(--fs-sm); color: var(--ink-2); }
.ix.on.fail b { background: var(--loss); }
.ix.on.fail span { color: var(--loss); }
.result { border-radius: var(--r-md); padding: 1rem; opacity: 0; transition: all 0.5s; }
.result.on { opacity: 1; }
.result.ok { background: var(--gain-soft); border: 2px solid var(--gain); }
.result.fail { background: var(--loss-soft); border: 2px solid var(--loss); animation: shake 0.4s; }
.result b { display: block; font-size: var(--fs-2xl); font-stretch: 118%; }
.result.ok b { color: var(--gain); } .result.fail b { color: var(--loss); }
.result span { font-size: var(--fs-sm); }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
</style>
