<script setup lang="ts">
// Why Solana: transactions declare the accounts they write up front, so the runtime
// (Sealevel) runs the ones that don't overlap at the same time. Transactions that write
// the same account (a busy pool) still have to wait their turn.
import { computed, onBeforeUnmount, ref } from 'vue'

const txs = [
  { id: 1, who: 'Ada pays Bola', w: ['Ada', 'Bola'] },
  { id: 2, who: 'Chi swaps SOL/USDC', w: ['Chi', 'Pool'] },
  { id: 3, who: 'Dayo mints a token', w: ['Dayo', 'Mint'] },
  { id: 4, who: 'Ese swaps SOL/USDC', w: ['Ese', 'Pool'] },
  { id: 5, who: 'Femi stakes', w: ['Femi', 'Stake'] },
  { id: 6, who: 'Gbenga pays Halima', w: ['Gbenga', 'Halima'] },
  { id: 7, who: 'Ife swaps SOL/USDC', w: ['Ife', 'Pool'] },
  { id: 8, who: 'Jide lends on Kamino', w: ['Jide', 'Reserve'] },
]
const LANES = 4

// Greedy scheduler: each tick, take transactions in order whose written accounts
// don't clash with anything already scheduled this tick or with an earlier waiting tx.
const parallel = (() => {
  const out: { id: number, tick: number, lane: number }[] = []
  let pending = [...txs]
  let tick = 0
  while (pending.length) {
    tick++
    const used = new Set<string>()
    const blocked = new Set<string>()
    const next: typeof txs = []
    let lane = 0
    for (const t of pending) {
      const clash = t.w.some(a => used.has(a) || blocked.has(a))
      if (!clash && lane < LANES) { out.push({ id: t.id, tick, lane: lane++ }); t.w.forEach(a => used.add(a)) }
      else { next.push(t); t.w.forEach(a => blocked.add(a)) }
    }
    pending = next
  }
  return out
})()
const parTicks = Math.max(...parallel.map(p => p.tick))

const t = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
function run() {
  clearInterval(timer); t.value = 0
  timer = setInterval(() => { t.value++; if (t.value >= txs.length) clearInterval(timer) }, 650)
}
onBeforeUnmount(() => clearInterval(timer))
const hot = (id: number) => txs.find(x => x.id === id)!.w.includes('Pool')
const label = (id: number) => txs.find(x => x.id === id)!.who
const parDone = computed(() => Math.min(t.value, parTicks))
</script>

<template>
  <div class="pl widget">
    <div class="panes">
      <div class="pane">
        <div class="ph"><b>One at a time</b><span class="readout">{{ Math.min(t, txs.length) }} / {{ txs.length }} steps</span></div>
        <div class="track seq">
          <div v-for="(x, i) in txs" :key="x.id" class="blk" :class="{ on: t > i, hot: hot(x.id) }" :style="{ left: `${i * 12.5}%`, top: '0' }">{{ x.id }}</div>
        </div>
      </div>
      <div class="pane">
        <div class="ph"><b class="chain">Solana: in parallel</b><span class="readout chain">{{ parDone }} / {{ parTicks }} steps</span></div>
        <div class="track par">
          <div v-for="p in parallel" :key="p.id" class="blk" :class="{ on: t >= p.tick, hot: hot(p.id) }" :style="{ left: `${(p.tick - 1) * 12.5}%`, top: `${p.lane * 25}%` }">{{ p.id }}</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <button @click="run">{{ t ? 'Run again' : 'Run 8 transactions' }}</button>
      <ol class="legend">
        <li v-for="x in txs" :key="x.id" :class="{ hot: hot(x.id) }"><b>{{ x.id }}</b> {{ label(x.id) }}</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.panes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.ph { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem; font-size: var(--fs-sm); }
.track { position: relative; height: 128px; background: var(--paper); border-radius: var(--r-sm);
  background-image: repeating-linear-gradient(90deg, transparent 0 calc(12.5% - 1px), var(--rule) calc(12.5% - 1px) 12.5%); }
.track.seq { height: 32px; }
.blk {
  position: absolute; width: calc(12.5% - 4px); height: calc(25% - 4px); margin: 2px; display: grid; place-items: center;
  font-weight: 800; font-size: var(--fs-sm); color: #fff; background: var(--chain); border-radius: 3px;
  opacity: 0; transform: translateX(-30px); transition: all 0.4s cubic-bezier(.2,.8,.2,1);
}
.seq .blk { height: 28px; background: var(--ink); }
.blk.hot { background: var(--warn); }
.blk.on { opacity: 1; transform: none; }
.foot { display: flex; gap: 1rem; align-items: flex-start; margin-top: 0.7rem; }
.foot button { white-space: nowrap; }
.legend { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.1rem 0.8rem; margin: 0; padding: 0; list-style: none; }
.legend li { font-size: var(--fs-2xs); color: var(--ink-2); margin: 0; }
.legend li b { color: var(--chain); }
.legend li.hot b { color: var(--warn); }
</style>
