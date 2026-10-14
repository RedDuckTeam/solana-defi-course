<script setup lang="ts">
// The life of a liquidity position, one stage per click.
// 1 deposit both tokens, 2 receive a receipt, 3 traders pay fees into the pool, 4 burn the receipt and withdraw.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const stages = [
  { t: 'Deposit', d: 'Both tokens, at the pool’s current ratio', icon: '⇣' },
  { t: 'Get a receipt', d: 'LP tokens (CPMM) or a position NFT (CLMM)', icon: '◈' },
  { t: 'Earn', d: 'Every swap leaves a fee in the pool', icon: '+' },
  { t: 'Withdraw', d: 'Burn the receipt, take your share of both tokens', icon: '⇡' },
]
</script>

<template>
  <div class="lpl">
    <div class="pool" :class="{ grow: step >= 3 }">
      <span class="lbl">Pool</span>
      <div class="lvl a" /><div class="lvl b" />
      <span v-if="step >= 3" class="fee">fees</span>
    </div>
    <ol>
      <li v-for="(s, i) in stages" :key="s.t" :class="{ on: step >= i + 1, cur: step === i + 1 }">
        <span class="ic">{{ s.icon }}</span>
        <div><b>{{ s.t }}</b><small>{{ s.d }}</small></div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.lpl { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 2rem; align-items: center; }
.pool { position: relative; height: 230px; border: 2px solid var(--ink); border-top: 0; border-radius: 0 0 var(--r-md) var(--r-md); overflow: hidden; display: flex; flex-direction: column-reverse; }
.lbl { position: absolute; top: 6px; left: 10px; font-size: var(--fs-xs); color: var(--muted); }
.lvl { height: 32%; transition: height 1s cubic-bezier(.3,.7,.3,1); }
.lvl.a { background: var(--chain); }
.lvl.b { background: var(--ink); }
.grow .lvl { height: 38%; }
.fee { position: absolute; top: 9%; left: 50%; transform: translateX(-50%); font-size: var(--fs-sm); font-weight: 750; color: var(--gain); animation: drip 1.6s infinite; }
@keyframes drip { from { opacity: 0; transform: translate(-50%, -12px); } 50% { opacity: 1; } to { opacity: 0; transform: translate(-50%, 18px); } }
ol { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
li { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 0.8rem; align-items: center; opacity: 0.12; transition: all 0.45s; }
li.on { opacity: 1; }
li.cur .ic { background: var(--chain); color: #fff; }
.ic { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--chain); display: grid; place-items: center; font-size: var(--fs-lg); color: var(--chain); font-weight: 800; transition: all 0.4s; }
li b { display: block; font-size: var(--fs-md); font-stretch: 112%; }
li small { font-size: var(--fs-sm); color: var(--ink-2); }
</style>
