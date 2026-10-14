<script setup lang="ts">
// Three tokens all called "USDC". The name means nothing; the mint address is the identity.
// Click the one that is Circle's devnet USDC.
import { ref } from 'vue'

const CIRCLE = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const tokens = [
  { mint: 'BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k', who: "Orca's devUSDC for its devnet examples. Real test token, different mint. Can't be swapped 1:1 with Circle's." },
  { mint: CIRCLE, who: "Circle's devnet USDC, from faucet.circle.com. This is the one we use in week 2." },
  { mint: 'USDCvG8kT3pQf2X5mHnB7rJ1sLw9eYcZ4aKdM6tPq2x', who: 'Made up for this slide. Anyone can create a token, name it USDC and copy the logo.' },
]
const picked = ref<number | null>(null)
</script>

<template>
  <div class="mi">
    <div class="cards">
      <button
        v-for="(t, i) in tokens" :key="t.mint" class="card"
        :class="{ right: picked !== null && t.mint === CIRCLE, wrong: picked === i && t.mint !== CIRCLE, dim: picked !== null && picked !== i && t.mint !== CIRCLE }"
        @click="picked = i"
      >
        <span class="logo">$</span>
        <b>USDC</b>
        <span class="sub">USD Coin</span>
        <code>{{ t.mint }}</code>
        <Transition name="r"><span v-if="picked !== null" class="who">{{ t.who }}</span></Transition>
      </button>
    </div>
    <p class="hint">{{ picked === null ? 'Same name, same logo. Which one is Circle\'s devnet USDC?' : 'Check the mint address against the issuer\'s own docs. Every time.' }}</p>
  </div>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; }
.card {
  font-family: var(--font); background: #fff; border: 2px solid var(--ink); border-radius: var(--r-md); padding: 0.8rem; cursor: pointer;
  display: grid; justify-items: center; gap: 0.2rem; text-align: center; transition: all 0.3s; min-height: 210px; align-content: start;
}
.card:hover { transform: translateY(-3px); }
.logo { width: 44px; height: 44px; border-radius: 50%; background: #2775ca; color: #fff; display: grid; place-items: center; font-weight: 900; font-size: var(--fs-lg); }
.card b { font-size: var(--fs-lg); color: var(--ink); }
.sub { font-size: var(--fs-xs); color: var(--muted); }
.card code { font-size: var(--fs-2xs) !important; word-break: break-all; margin-top: 0.3rem; }
.who { font-size: var(--fs-xs); color: var(--ink-2); margin-top: 0.4rem; }
.right { border-color: var(--gain); background: var(--gain-soft); }
.wrong { border-color: var(--loss); background: var(--loss-soft); animation: shake 0.35s; }
.dim { opacity: 0.55; }
.hint { font-size: var(--fs-base); font-weight: 650; margin-top: 0.8rem; text-align: center; }
.r-enter-active { transition: all 0.35s; } .r-enter-from { opacity: 0; transform: translateY(6px); }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
</style>
