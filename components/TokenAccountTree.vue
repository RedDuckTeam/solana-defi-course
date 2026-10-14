<script setup lang="ts">
// Wallet → token account (ATA) → mint, built step by step.
// 1 your wallet, 2 the USDC mint, 3 your USDC token account, 4 a second token, 5 sending to a friend.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
</script>

<template>
  <svg viewBox="0 0 900 360" class="tat" role="img" aria-label="A wallet owns one token account per token; each token account points at its mint">
    <defs>
      <marker id="ta-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)" /></marker>
      <marker id="ta-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--gain)" /></marker>
    </defs>

    <!-- you -->
    <g class="p" :class="{ on: s >= 1 }">
      <rect x="20" y="130" width="170" height="90" rx="10" class="wal" />
      <text x="105" y="162" class="t w">Your wallet</text>
      <text x="105" y="184" class="m w">7xKp…Qm2a</text>
      <text x="105" y="205" class="m w">holds SOL only</text>
    </g>

    <!-- mints -->
    <g class="p" :class="{ on: s >= 2 }">
      <rect x="680" y="40" width="200" height="96" rx="10" class="mint" />
      <text x="780" y="68" class="t">USDC mint</text>
      <text x="780" y="89" class="m">decimals 6 · supply</text>
      <text x="780" y="108" class="m">mint authority: Circle</text>
      <text x="780" y="126" class="m mono">EPjF…Dt1v</text>
    </g>
    <g class="p" :class="{ on: s >= 4 }">
      <rect x="680" y="214" width="200" height="80" rx="10" class="mint" />
      <text x="780" y="243" class="t">JitoSOL mint</text>
      <text x="780" y="264" class="m">decimals 9</text>
      <text x="780" y="282" class="m mono">J1to…GCPn</text>
    </g>

    <!-- token accounts -->
    <g class="p" :class="{ on: s >= 3 }">
      <path d="M190,160 C250,160 260,88 330,88" class="ln" marker-end="url(#ta-a)" />
      <text x="232" y="108" class="lb">owns</text>
      <rect x="335" y="50" width="250" height="78" rx="10" class="ata" />
      <text x="460" y="78" class="t">Your USDC account</text>
      <text x="460" y="99" class="m">amount: 25.00 USDC</text>
      <text x="460" y="117" class="m">address = f(wallet, mint)</text>
      <path d="M585,89 L675,89" class="ln" marker-end="url(#ta-a)" />
      <text x="630" y="80" class="lb">of</text>
    </g>
    <g class="p" :class="{ on: s >= 4 }">
      <path d="M190,195 C250,195 260,254 330,254" class="ln" marker-end="url(#ta-a)" />
      <rect x="335" y="215" width="250" height="78" rx="10" class="ata" />
      <text x="460" y="243" class="t">Your JitoSOL account</text>
      <text x="460" y="264" class="m">amount: 1.2 JitoSOL</text>
      <path d="M585,254 L675,254" class="ln" marker-end="url(#ta-a)" />
    </g>

    <!-- send to a friend -->
    <g class="p" :class="{ on: s >= 5 }">
      <rect x="335" y="305" width="250" height="48" rx="10" class="ata friend" />
      <text x="460" y="334" class="t">Bola's USDC account</text>
      <path d="M335,100 C270,140 270,300 333,326" class="ln send" marker-end="url(#ta-g)" />
      <text x="248" y="300" class="lb g">transfer 5 USDC</text>
    </g>
  </svg>
</template>

<style scoped>
.tat { width: 100%; height: auto; font-family: var(--font); }
.p { opacity: 0; transform: translateY(10px); transition: all 0.5s cubic-bezier(.2,.8,.2,1); }
.p.on { opacity: 1; transform: none; }
.wal { fill: var(--ink); }
.mint { fill: #fff; stroke: var(--ink); stroke-width: 2; stroke-dasharray: 5 4; }
.ata { fill: var(--chain-soft); stroke: var(--chain); stroke-width: 2; }
.ata.friend { fill: var(--gain-soft); stroke: var(--gain); }
.t { text-anchor: middle; font-size: var(--fs-base); font-weight: 800; fill: var(--ink); }
.t.w, .m.w { fill: #fff; }
.m { text-anchor: middle; font-size: var(--fs-xs); fill: var(--ink-2); }
.mono { font-family: var(--mono); }
.ln { fill: none; stroke: var(--ink-2); stroke-width: 2; }
.ln.send { stroke: var(--gain); stroke-width: 2.5; stroke-dasharray: 7 6; animation: dash 0.9s linear infinite; }
.lb { text-anchor: middle; font-size: var(--fs-xs); fill: var(--muted); }
.lb.g { fill: var(--gain); font-weight: 700; }
@keyframes dash { to { stroke-dashoffset: -26; } }
</style>
