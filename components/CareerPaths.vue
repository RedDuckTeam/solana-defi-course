<script setup lang="ts">
// Roles plotted by how much finance and how much engineering they need.
// Click a role to see the day job, the skills, and the portfolio piece from this course that proves it.
import { computed, ref } from 'vue'

const roles = [
  { id: 'res', n: 'DeFi research analyst', x: 6, y: 90, day: 'Reads protocols, writes reports investors act on.', skills: 'Finance, writing, explorers, DefiLlama.', proof: 'Your week 5 due-diligence report.' },
  { id: 'tok', n: 'Tokenomics analyst', x: 16, y: 78, day: 'Models supply, emissions and incentives.', skills: 'Spreadsheets, game theory, token data.', proof: 'Week 3 yield model + week 4 lending sheet.' },
  { id: 'prod', n: 'DeFi product analyst', x: 30, y: 66, day: 'Turns user behaviour into product decisions.', skills: 'SQL, dashboards, user research.', proof: 'A Dune dashboard on one protocol.' },
  { id: 'data', n: 'Blockchain data analyst', x: 44, y: 54, day: 'Queries chain data, builds dashboards.', skills: 'SQL, Dune, Python, decoding transactions.', proof: 'Your no-code capstone, rebuilt in Dune.' },
  { id: 'sol', n: 'Solana developer', x: 56, y: 24, day: 'Builds apps and programs users touch.', skills: 'TypeScript, Rust, Anchor, @solana/kit.', proof: 'Your on-chain capstone on devnet.' },
  { id: 'sc', n: 'Smart-contract developer', x: 62, y: 40, day: 'Writes the financial logic on-chain.', skills: 'Rust, Anchor or Pinocchio, testing, maths.', proof: 'Constant-product AMM with LiteSVM tests.' },
  { id: 'sec', n: 'Security researcher', x: 70, y: 72, day: 'Finds the missing check before attackers do.', skills: 'Deep Rust, Solana internals, economics.', proof: 'Week 5 exploit test, then CTFs.' },
]
const sel = ref('data')
const cur = computed(() => roles.find(r => r.id === sel.value)!)
</script>

<template>
  <div class="cp">
    <div class="plot">
      <span class="ax y">more finance ↑</span>
      <span class="ax x">more engineering →</span>
      <button v-for="r in roles" :key="r.id" class="role" :class="{ sel: sel === r.id }"
        :style="{ left: `${r.x}%`, top: `${100 - r.y}%` }" @click="sel = r.id">
        <i />{{ r.n }}
      </button>
    </div>
    <Transition name="card" mode="out-in">
      <div :key="cur.id" class="card">
        <h3>{{ cur.n }}</h3>
        <p><span>Day to day</span>{{ cur.day }}</p>
        <p><span>Skills</span>{{ cur.skills }}</p>
        <p class="proof"><span>Prove it with</span>{{ cur.proof }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cp { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 1.4rem; }
.plot { position: relative; height: 330px; border-left: 2px solid var(--ink); border-bottom: 2px solid var(--ink); margin: 0 0 1.2rem 1.2rem; background: linear-gradient(135deg, var(--paper-2), transparent 60%); }
.ax { position: absolute; font-size: var(--fs-2xs); color: var(--muted); }
.ax.y { top: -1.2rem; left: -1rem; } .ax.x { bottom: -1.3rem; right: 0; }
.role {
  position: absolute; transform: translate(-0.55rem, -50%); display: flex; align-items: center; gap: 0.35rem; white-space: nowrap;
  font-family: var(--font); font-size: var(--fs-xs); font-weight: 650; background: none; border: 0; cursor: pointer; color: var(--ink); padding: 0.1rem 0.3rem; border-radius: var(--r-sm);
  transition: all 0.25s;
}
.role i { width: 12px; height: 12px; border-radius: 50%; background: var(--chain); flex: none; transition: transform 0.3s; }
.role.sel { background: var(--chain); color: #fff; }
.role.sel i { background: #fff; transform: scale(1.3); }
.role:hover i { transform: scale(1.4); }
.card { border-left: 5px solid var(--chain); padding-left: 0.9rem; }
.card h3 { margin: 0 0 0.4rem !important; font-size: var(--fs-lg) !important; }
.card p { margin: 0 0 0.5rem; font-size: var(--fs-sm); }
.card span { display: block; font-size: var(--fs-2xs); color: var(--muted); }
.proof { color: var(--gain); font-weight: 650; }
.card-enter-active, .card-leave-active { transition: all 0.22s; }
.card-enter-from { opacity: 0; transform: translateY(8px); } .card-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
