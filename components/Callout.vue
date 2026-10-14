<script setup lang="ts">
// A short aside. tone: chain (on-chain fact), loss (danger), gain (tip), warn (verify before class), ink (finance link)
withDefaults(defineProps<{ tone?: 'chain' | 'loss' | 'gain' | 'warn' | 'ink', title?: string }>(), { tone: 'chain' })
</script>

<template>
  <aside class="callout" :class="tone">
    <strong v-if="title">{{ title }}</strong>
    <div><slot /></div>
  </aside>
</template>

<style scoped>
.callout { border-left: 5px solid; padding: 0.55rem 0.9rem; border-radius: 0 var(--r-sm) var(--r-sm) 0; font-size: var(--fs-sm); }
.callout strong { display: block; font-size: var(--fs-base); margin-bottom: 0.15rem; }
.callout :deep(p) { margin: 0; font-size: var(--fs-sm); }
.chain { border-color: var(--chain); background: var(--chain-soft); }
.loss { border-color: var(--loss); background: var(--loss-soft); }
.gain { border-color: var(--gain); background: var(--gain-soft); }
.warn { border-color: var(--warn); background: var(--warn-soft); }
.ink { border-color: var(--ink); background: var(--paper-2); }
</style>
