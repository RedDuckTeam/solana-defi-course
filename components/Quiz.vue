<script setup lang="ts">
// Class check. Click an option: right turns green, wrong turns red, then the reason shows.
import { ref } from 'vue'

const props = defineProps<{ q: string, options: string[], answer: number, why?: string }>()
const picked = ref<number | null>(null)
const state = (i: number) => {
  if (picked.value === null) return ''
  if (i === props.answer) return 'right'
  return i === picked.value ? 'wrong' : 'dim'
}
</script>

<template>
  <div class="quiz widget">
    <p class="q">{{ q }}</p>
    <div class="opts">
      <button v-for="(o, i) in options" :key="i" :class="state(i)" @click="picked = i">
        <span class="letter">{{ 'ABCD'[i] }}</span>{{ o }}
      </button>
    </div>
    <Transition name="why">
      <p v-if="picked !== null && why" class="why" :class="picked === answer ? 'gain' : 'loss'">
        {{ picked === answer ? 'Correct.' : 'Not quite.' }} {{ why }}
      </p>
    </Transition>
    <button v-if="picked !== null" class="reset" @click="picked = null">Reset</button>
  </div>
</template>

<style scoped>
.q { font-size: var(--fs-md); font-weight: 700; margin: 0 0 0.7rem; }
.opts { display: grid; gap: 0.45rem; }
.opts button {
  display: flex; gap: 0.7rem; align-items: center; text-align: left;
  font-size: var(--fs-base); font-weight: 500; padding: 0.5em 0.8em; transition: all 0.25s;
}
.letter { font-weight: 800; color: var(--chain); min-width: 1em; }
.opts button.right { background: var(--gain-soft); border-color: var(--gain); color: var(--ink); }
.opts button.wrong { background: var(--loss-soft); border-color: var(--loss); color: var(--ink); animation: shake 0.35s; }
.opts button.dim { opacity: 0.45; }
.why { font-size: var(--fs-sm); margin: 0.7rem 0 0; color: var(--ink-2); }
.why.gain::first-word, .why.loss::first-word { font-weight: 700; }
.reset { margin-top: 0.5rem; font-size: var(--fs-xs) !important; }
.why-enter-active { transition: all 0.3s; } .why-enter-from { opacity: 0; transform: translateY(6px); }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
