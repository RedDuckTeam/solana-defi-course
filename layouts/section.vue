<script setup lang="ts">
// Section divider inside a week. `tone` picks the meaning colour of the rule.
withDefaults(defineProps<{ tone?: 'ink' | 'chain' | 'loss' | 'gain' }>(), { tone: 'chain' })
</script>

<template>
  <div class="slidev-layout section ledger-paper" :class="tone">
    <div class="inner">
      <div class="bar" v-motion :initial="{ scaleX: 0 }" :enter="{ scaleX: 1, transition: { duration: 500 } }" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section { display: flex; align-items: center; padding-left: 120px; }
.inner { max-width: 720px; }
.bar { height: 8px; width: 120px; transform-origin: left; margin-bottom: 1.2rem; background: currentColor; }
.ink { color: var(--ink); } .chain { color: var(--chain); } .loss { color: var(--loss); } .gain { color: var(--gain); }
.inner :deep(h1) { font-size: var(--fs-3xl); font-stretch: 125%; font-weight: 800; color: var(--ink); margin: 0 0 0.3em; }
.inner :deep(p) { font-size: var(--fs-md); color: var(--ink-2); }
</style>
