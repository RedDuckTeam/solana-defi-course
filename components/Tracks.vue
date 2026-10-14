<script setup lang="ts">
// The two tracks side by side. Users work through wallets, explorers and spreadsheets.
// Builders do the same plus a code extension. Pass content through the named slots.
</script>

<template>
  <div class="tracks">
    <section class="users">
      <h3>Users</h3>
      <slot name="users" />
    </section>
    <section class="builders">
      <h3>Builders</h3>
      <slot name="builders" />
    </section>
  </div>
</template>

<style scoped>
.tracks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; }
section { border-top: 6px solid; padding-top: 0.6rem; }
.users { border-color: var(--ink); }
.builders { border-color: var(--chain); }
h3 { margin: 0 0 0.4rem !important; font-size: var(--fs-md) !important; }
.builders h3 { color: var(--chain) !important; }
section :deep(li), section :deep(p) { font-size: var(--fs-sm); }
</style>
