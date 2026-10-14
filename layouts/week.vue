<script setup lang="ts">
// Week cover: the ledger page, a big week number in the margin column.
defineProps<{ week?: number | string, heading?: string, task?: string, blog?: string }>()
</script>

<template>
  <div class="slidev-layout week ledger-paper">
    <div class="num" v-motion :initial="{ x: -40, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { duration: 600 } }">
      {{ week }}
    </div>
    <div class="body">
      <p class="label">Week {{ week }} of 6</p>
      <h1 v-motion :initial="{ y: 24, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 150, duration: 600 } }">
        {{ heading }}
      </h1>
      <div class="meta" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 450 } }">
        <div v-if="task"><span>Task</span>{{ task }}</div>
        <div v-if="blog"><span>Blog post</span>{{ blog }}</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.week { display: grid; grid-template-columns: 200px minmax(0, 1fr); align-items: center; padding: 0 3rem 0 0; }
.num {
  font-size: var(--fs-mega); font-weight: 900; font-stretch: 62%; line-height: 0.8;
  color: var(--chain); text-align: center; padding-left: 70px;
}
.label { font-size: var(--fs-md); color: var(--muted); margin: 0; }
h1 { font-size: var(--fs-3xl) !important; font-stretch: 125% !important; margin: 0.15em 0 0.5em !important; max-width: 16ch; }
.meta { display: grid; gap: 0.5rem; max-width: 60ch; }
.meta div { display: grid; grid-template-columns: 7em minmax(0, 1fr); font-size: var(--fs-base); color: var(--ink-2); }
.meta span { font-weight: 700; color: var(--ink); }
</style>
