<script setup lang="ts">
// Three ways to hold a dollar peg, one per click. Each column: what backs one coin, how it fails.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const kinds = [
  {
    n: 'Fiat-backed', tone: 'ink', ex: 'USDC · USDT · PYUSD · USDG',
    stack: [{ l: 'Cash + T-bills at a company', h: 100 }],
    peg: 'Redeem 1 coin for $1 with the issuer',
    fail: 'Issuer, bank or reserve problem. Coins can be frozen.',
  },
  {
    n: 'Crypto-backed', tone: 'chain', ex: 'DAI, now Sky (history)',
    stack: [{ l: 'ETH and other crypto, locked', h: 150 }],
    peg: 'Over-collateralized vaults, liquidated if they slip',
    fail: 'Collateral crashes faster than liquidations run.',
  },
  {
    n: 'Algorithmic', tone: 'loss', ex: 'UST (Terra, collapsed May 2022)',
    stack: [{ l: 'A sister token’s market price', h: 60 }],
    peg: 'Burn $1 of the sister token to mint 1 coin',
    fail: 'Confidence breaks, both tokens spiral to zero.',
  },
]
</script>

<template>
  <div class="st">
    <div v-for="(k, i) in kinds" :key="k.n" class="col" :class="[k.tone, { on: step >= i + 1 }]">
      <div class="coin">$1</div>
      <div class="backing">
        <div class="fill" :style="{ height: step >= i + 1 ? Math.min(k.stack[0].h, 150) * 0.8 + 'px' : '0px' }">
          <span>{{ k.stack[0].l }}</span>
        </div>
        <i class="line" />
      </div>
      <h4>{{ k.n }}</h4>
      <p class="ex">{{ k.ex }}</p>
      <p><b>Peg:</b> {{ k.peg }}</p>
      <p class="fail"><b>Breaks when:</b> {{ k.fail }}</p>
    </div>
  </div>
</template>

<style scoped>
.st { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; }
.col { opacity: 0.1; transform: translateY(10px); transition: all 0.5s; }
.col.on { opacity: 1; transform: none; }
.coin { width: 52px; height: 52px; border-radius: 50%; border: 3px solid currentColor; display: grid; place-items: center; font-weight: 900; font-size: var(--fs-md); margin: 0 auto -4px; background: #fff; position: relative; z-index: 1; }
.backing { position: relative; height: 124px; border: 2px solid var(--ink); border-top: 0; display: flex; align-items: flex-end; }
.fill { width: 100%; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 0.4rem; transition: height 1s cubic-bezier(.3,.7,.3,1); overflow: hidden; }
.fill span { font-size: var(--fs-xs); font-weight: 700; color: #fff; }
.line { position: absolute; left: -6px; right: -6px; bottom: 80px; border-top: 2px dashed var(--ink); }
.ink .fill { background: var(--ink); } .chain .fill { background: var(--chain); } .loss .fill { background: var(--loss); }
.ink { color: var(--ink); } .chain { color: var(--chain); } .loss { color: var(--loss); }
h4 { font-size: var(--fs-lg); font-weight: 800; font-stretch: 112%; margin: 0.5rem 0 0; color: inherit; }
.ex { font-size: var(--fs-xs); font-weight: 700; margin: 0 0 0.3rem; }
p { font-size: var(--fs-sm); color: var(--ink-2); margin: 0.2rem 0; }
.fail { color: var(--loss); }
</style>
