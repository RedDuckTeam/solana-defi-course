<script setup lang="ts">
// Two ways to run a market.
// step 1: order book appears. 2: a market buy eats the cheapest asks.
// step 3: the pool appears. 4: the same buy is priced by the formula, tanks shift.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const asks = [
  { p: 151.2, q: 40 }, { p: 150.8, q: 25 }, { p: 150.5, q: 60 }, { p: 150.2, q: 30 },
]
const bids = [
  { p: 149.9, q: 35 }, { p: 149.6, q: 50 }, { p: 149.2, q: 20 }, { p: 148.8, q: 45 },
]
const eaten = (i: number) => props.step >= 2 && i >= 2
const traded = computed(() => props.step >= 4)
</script>

<template>
  <div class="obamm">
    <section class="ob" :class="{ on: step >= 1 }">
      <h4 class="ink">Order book</h4>
      <p class="sub">Makers post prices. A matching engine pairs them.</p>
      <div class="book">
        <div v-for="(a, i) in asks" :key="'a' + i" class="lvl ask" :class="{ eaten: eaten(i) }">
          <span class="bar" :style="{ width: a.q * 1.4 + 'px' }" /><span class="p">{{ a.p.toFixed(1) }}</span><span class="q">{{ a.q }}</span>
        </div>
        <div class="spread">spread</div>
        <div v-for="(b, i) in bids" :key="'b' + i" class="lvl bid">
          <span class="bar" :style="{ width: b.q * 1.4 + 'px' }" /><span class="p">{{ b.p.toFixed(1) }}</span><span class="q">{{ b.q }}</span>
        </div>
      </div>
      <p class="note" :class="{ on: step >= 2 }">Buy 90: fills 30 at 150.2, 60 at 150.5</p>
    </section>

    <section class="amm" :class="{ on: step >= 3 }">
      <h4 class="chain">AMM pool</h4>
      <p class="sub">Liquidity providers fill two tanks. A formula sets the price.</p>
      <div class="tanks">
        <div class="tank">
          <div class="fill sol" :style="{ height: (traded ? 52 : 60) + '%' }" />
          <span>SOL</span>
        </div>
        <div class="formula">
          <span class="mono">x · y = k</span>
          <span class="arrows" :class="{ go: traded }">USDC in ⇢<br>⇠ SOL out</span>
        </div>
        <div class="tank">
          <div class="fill usdc" :style="{ height: (traded ? 69 : 60) + '%' }" />
          <span>USDC</span>
        </div>
      </div>
      <p class="note" :class="{ on: step >= 4 }">No counterparty waiting. The pool always quotes.</p>
    </section>
  </div>
</template>

<style scoped>
.obamm { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
section { opacity: 0.12; transition: opacity 0.5s; }
section.on { opacity: 1; }
h4 { font-size: var(--fs-lg); font-weight: 800; font-stretch: 118%; margin: 0; }
.sub { font-size: var(--fs-sm); color: var(--ink-2); margin: 0.2rem 0 0.6rem; }
.book { display: grid; gap: 3px; font-family: var(--mono); }
.lvl { display: grid; grid-template-columns: 90px 70px 40px; align-items: center; gap: 0.6rem; font-size: var(--fs-sm); transition: all 0.5s; }
.bar { height: 16px; justify-self: end; border-radius: 2px; transition: all 0.5s; }
.ask .bar { background: var(--loss-soft); border: 1px solid var(--loss); }
.ask .p { color: var(--loss); }
.bid .bar { background: var(--gain-soft); border: 1px solid var(--gain); }
.bid .p { color: var(--gain); }
.lvl.eaten { opacity: 0.25; text-decoration: line-through; }
.lvl.eaten .bar { width: 0 !important; }
.spread { font-size: var(--fs-2xs); color: var(--muted); padding-left: 100px; }
.note { font-size: var(--fs-sm); font-weight: 650; margin-top: 0.7rem; opacity: 0; transition: opacity 0.4s; }
.note.on { opacity: 1; }
.tanks { display: grid; grid-template-columns: 90px minmax(0, 1fr) 90px; gap: 0.8rem; align-items: end; height: 190px; }
.tank { position: relative; height: 100%; border: 2px solid var(--ink); border-top: 0; border-radius: 0 0 var(--r-md) var(--r-md); overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
.tank span { position: absolute; bottom: 6px; font-weight: 750; font-size: var(--fs-sm); color: #fff; }
.fill { position: absolute; bottom: 0; left: 0; right: 0; transition: height 0.9s cubic-bezier(.3,.7,.3,1); }
.fill.sol { background: var(--chain); }
.fill.usdc { background: var(--ink); }
.formula { display: grid; place-items: center; gap: 0.6rem; align-self: center; text-align: center; }
.formula .mono { font-size: var(--fs-lg); color: var(--chain); font-weight: 600; }
.arrows { font-size: var(--fs-sm); color: var(--muted); transition: color 0.4s; }
.arrows.go { color: var(--chain); font-weight: 700; }
</style>
