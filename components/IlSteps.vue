<script setup lang="ts">
// The impermanent loss table from the teacher prep, one price move per click.
// Each row: price move, what holding is worth, what the LP is worth, and the gap.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const rows = [1.25, 2, 4, 0.5].map((r) => {
  const hodl = 500 * r + 500
  const lp = 1000 * Math.sqrt(r)
  return { r, hodl, lp, il: ((2 * Math.sqrt(r)) / (1 + r) - 1) * 100 }
})
const usd = (n: number) => `$${n.toFixed(0)}`
</script>

<template>
  <div class="ils">
    <div class="head"><span>SOL moves</span><span>Hold</span><span>LP</span><span>Impermanent loss</span></div>
    <div v-for="(row, i) in rows" :key="row.r" class="row" :class="{ on: step >= i + 1 }">
      <span class="r">{{ row.r }}×</span>
      <span class="mono">{{ usd(row.hodl) }}</span>
      <span class="mono chain">{{ usd(row.lp) }}</span>
      <span class="ilc">
        <i :style="{ width: step >= i + 1 ? Math.abs(row.il) * 4 + '%' : '0%' }" />
        <b>{{ row.il.toFixed(2) }}%</b>
      </span>
    </div>
  </div>
</template>

<style scoped>
.ils { border-top: 2px solid var(--ink); }
.head, .row { display: grid; grid-template-columns: 110px 90px 90px minmax(0, 1fr); gap: 1rem; align-items: center; }
.head { font-size: var(--fs-xs); color: var(--muted); padding: 0.35rem 0; border-bottom: 1px solid var(--ink); }
.row { padding: 0.55rem 0; border-bottom: 1px solid var(--rule); opacity: 0; transform: translateX(-12px); transition: all 0.45s; font-size: var(--fs-md); }
.row.on { opacity: 1; transform: none; }
.r { font-weight: 900; font-stretch: 80%; font-size: var(--fs-xl); color: var(--ink); }
.ilc { display: flex; align-items: center; gap: 0.6rem; }
.ilc i { display: block; height: 18px; background: var(--loss); border-radius: 2px; transition: width 0.8s cubic-bezier(.3,.7,.3,1) 0.2s; }
.ilc b { color: var(--loss); font-size: var(--fs-md); }
</style>
