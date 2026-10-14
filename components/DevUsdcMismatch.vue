<script setup lang="ts">
// Two tokens, both called "USDC" on devnet. Different mints, so they are different assets.
// step 1: Circle's devnet USDC. 2: Orca's devUSDC. 3: try to use one where the other is expected: rejected.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })

const short = (m: string) => `${m.slice(0, 6)}…${m.slice(-6)}`
const circle = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const orca = 'BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k'
</script>

<template>
  <div class="du">
    <div class="tok" :class="{ on: step >= 1 }">
      <span class="sym">USDC</span>
      <small>Issued by Circle's devnet faucet</small>
      <code>{{ short(circle) }}</code>
      <small class="where">What you got in week 2</small>
    </div>
    <div class="mid" :class="{ on: step >= 3 }">
      <span class="x">≠</span>
      <small>Same name, different mint. A program only checks the mint.</small>
    </div>
    <div class="tok orca" :class="{ on: step >= 2 }">
      <span class="sym">devUSDC</span>
      <small>Minted by Orca for its devnet pools</small>
      <code>{{ short(orca) }}</code>
      <small class="where">What the Orca devnet pool wants</small>
    </div>
  </div>
</template>

<style scoped>
.du { display: grid; grid-template-columns: minmax(0, 1fr) 210px minmax(0, 1fr); gap: 1.2rem; align-items: center; }
.tok { border: 2px solid var(--chain); border-radius: var(--r-md); padding: 1rem; background: #fff; display: grid; gap: 0.3rem; opacity: 0.1; transform: scale(0.95); transition: all 0.5s; }
.tok.on { opacity: 1; transform: none; }
.sym { font-size: var(--fs-2xl); font-weight: 900; font-stretch: 118%; color: var(--ink); }
small { font-size: var(--fs-sm); color: var(--ink-2); }
code { font-size: var(--fs-sm) !important; justify-self: start; }
.where { color: var(--muted); font-size: var(--fs-xs); }
.mid { text-align: center; opacity: 0; transition: all 0.5s; }
.mid.on { opacity: 1; }
.x { display: block; font-size: var(--fs-3xl); font-weight: 900; color: var(--loss); line-height: 1; }
.mid.on .x { animation: pop 0.5s; }
.mid small { color: var(--loss); font-weight: 650; }
@keyframes pop { from { transform: scale(0.3); } 70% { transform: scale(1.2); } to { transform: scale(1); } }
</style>
