<script setup lang="ts">
// Bank vs chain, drawn as two lanes.
// step 1: the bank lane. step 2: the chain lane. step 3: the public ledger copies to many nodes.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const s = computed(() => props.step)
const nodes = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return { x: 760 + Math.cos(a) * 92, y: 262 + Math.sin(a) * 52 }
})
</script>

<template>
  <svg viewBox="0 0 900 340" class="lc" role="img" aria-label="A bank keeps a private ledger; a chain keeps a public ledger copied across many computers">
    <defs>
      <marker id="lc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
      </marker>
    </defs>

    <!-- bank lane -->
    <g :class="['lane', { on: s >= 1 }]" style="color: var(--ink)">
      <text x="0" y="30" class="lane-t">The bank</text>
      <circle cx="60" cy="95" r="30" class="actor" />
      <text x="60" y="100" class="c">You</text>
      <line x1="95" y1="95" x2="305" y2="95" class="flow" marker-end="url(#lc-arr)" />
      <text x="200" y="85" class="lbl">ask</text>
      <rect x="310" y="65" width="150" height="60" rx="6" class="box" />
      <text x="385" y="101" class="c b">Bank</text>
      <line x1="465" y1="95" x2="640" y2="95" class="flow" marker-end="url(#lc-arr)" />
      <text x="552" y="85" class="lbl">approves, records</text>
      <rect x="645" y="62" width="220" height="66" rx="6" class="box locked" />
      <text x="755" y="92" class="c b">Private ledger</text>
      <text x="755" y="112" class="c small">only the bank can read it</text>
      <path d="M755,130 C755,175 60,175 60,128" class="flow slow" marker-end="url(#lc-arr)" />
      <text x="400" y="168" class="lbl">statement, days later</text>
    </g>

    <!-- chain lane -->
    <g :class="['lane', { on: s >= 2 }]" style="color: var(--chain)">
      <text x="0" y="215" class="lane-t">The chain</text>
      <circle cx="60" cy="262" r="30" class="actor" />
      <text x="60" y="267" class="c">You</text>
      <line x1="95" y1="262" x2="305" y2="262" class="flow" marker-end="url(#lc-arr)" />
      <text x="200" y="252" class="lbl">sign</text>
      <rect x="310" y="232" width="150" height="60" rx="6" class="box" />
      <text x="385" y="260" class="c b">Program</text>
      <text x="385" y="279" class="c small">rules in code</text>
      <line x1="465" y1="262" x2="650" y2="262" class="flow" marker-end="url(#lc-arr)" />
      <text x="555" y="252" class="lbl">under a second</text>
    </g>
    <g :class="['lane', { on: s >= 2 }]" style="color: var(--chain)">
      <g v-for="(n, i) in nodes" :key="i" class="node" :class="{ copy: s >= 3 }" :style="{ transitionDelay: `${i * 50}ms` }">
        <line x1="760" y1="262" :x2="n.x" :y2="n.y" class="spoke" />
        <rect :x="n.x - 9" :y="n.y - 7" width="18" height="14" rx="2" class="mini" />
      </g>
      <rect x="712" y="244" width="96" height="36" rx="6" class="box pub" />
      <text x="760" y="267" class="c b small">Public ledger</text>
      <text v-if="s >= 3" x="760" y="335" class="c small fade">same copy on thousands of computers</text>
    </g>
  </svg>
</template>

<style scoped>
.lc { width: 100%; height: auto; font-family: var(--font); overflow: visible; }
.lane { opacity: 0; transform: translateX(-20px); transition: all 0.6s cubic-bezier(.2,.8,.2,1); }
.lane.on { opacity: 1; transform: none; }
.lane-t { font-size: var(--fs-md); font-weight: 800; font-stretch: 115%; fill: currentColor; }
.actor { fill: #fff; stroke: currentColor; stroke-width: 2; }
.box { fill: #fff; stroke: currentColor; stroke-width: 2; }
.box.locked { fill: var(--paper-2); stroke-dasharray: 6 4; }
.box.pub { fill: var(--chain); }
.pub + text { fill: #fff; }
.c { text-anchor: middle; font-size: var(--fs-sm); fill: var(--ink); }
.c.b { font-weight: 750; }
.c.small { font-size: var(--fs-2xs); fill: var(--ink-2); }
.lbl { text-anchor: middle; font-size: var(--fs-xs); fill: var(--ink-2); }
.flow { stroke: currentColor; stroke-width: 2; fill: none; stroke-dasharray: 8 6; animation: dash 1s linear infinite; }
.flow.slow { animation-duration: 4s; opacity: 0.6; }
.spoke { stroke: var(--chain); stroke-width: 1; opacity: 0.4; }
.mini { fill: #fff; stroke: var(--chain); stroke-width: 1.5; }
.node { opacity: 0; transform-origin: 760px 262px; transform: scale(0.3); transition: all 0.5s cubic-bezier(.3,1.4,.4,1); }
.node.copy { opacity: 1; transform: none; }
.fade { animation: fadein 0.8s both 0.6s; }
@keyframes dash { to { stroke-dashoffset: -28; } }
@keyframes fadein { from { opacity: 0; } }
</style>
