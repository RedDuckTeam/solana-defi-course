<script setup lang="ts">
// A real Ed25519 keypair, generated in the browser and never sent anywhere.
// Sign a message, verify it, then edit the message and watch verification fail.
import bs58 from 'bs58'
import nacl from 'tweetnacl'
import { computed, ref } from 'vue'

const kp = ref<nacl.SignKeyPair | null>(null)
const msg = ref('Pay Bola 5 USDC')
const signedMsg = ref('')
const sig = ref<Uint8Array | null>(null)
const showSecret = ref(false)

const address = computed(() => kp.value ? bs58.encode(kp.value.publicKey) : '')
const secret = computed(() => kp.value ? bs58.encode(kp.value.secretKey) : '')
const sigText = computed(() => sig.value ? bs58.encode(sig.value) : '')
const valid = computed(() => {
  if (!kp.value || !sig.value) return null
  return nacl.sign.detached.verify(new TextEncoder().encode(msg.value), sig.value, kp.value.publicKey)
})
const short = (s: string, n = 10) => s.length > n * 2 ? `${s.slice(0, n)}…${s.slice(-n)}` : s

function generate() { kp.value = nacl.sign.keyPair(); sig.value = null; showSecret.value = false }
function sign() {
  if (!kp.value) return
  sig.value = nacl.sign.detached(new TextEncoder().encode(msg.value), kp.value.secretKey)
  signedMsg.value = msg.value
}
</script>

<template>
  <div class="kp widget">
    <div class="col">
      <button @click="generate">{{ kp ? 'New keypair' : 'Generate a keypair' }}</button>
      <div class="field">
        <label>Public key = your address <span class="gain">share freely</span></label>
        <code class="val pub">{{ address || 'not yet' }}</code>
      </div>
      <div class="field">
        <label>Secret key <span class="loss">never share</span></label>
        <code class="val sec" :class="{ blur: !showSecret }" @click="showSecret = !showSecret">{{ kp ? short(secret, 16) : 'not yet' }}</code>
      </div>
    </div>
    <div class="col">
      <div class="field">
        <label>Message</label>
        <input v-model="msg" type="text" aria-label="Message to sign" />
      </div>
      <button :disabled="!kp" @click="sign">Sign with secret key</button>
      <div class="field">
        <label>Signature</label>
        <code class="val">{{ sigText ? short(sigText, 14) : 'not yet' }}</code>
      </div>
      <Transition name="v" mode="out-in">
        <div v-if="valid !== null" :key="String(valid)" class="verdict" :class="valid ? 'ok' : 'bad'">
          <b>{{ valid ? 'Valid' : 'Invalid' }}</b>
          <span>{{ valid ? 'Anyone can check this with only the public key.' : `Signed "${signedMsg}". The message changed, so the signature no longer matches.` }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.kp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem; }
.col { display: grid; gap: 0.6rem; align-content: start; }
.col > button { justify-self: start; }
.field { display: grid; gap: 0.2rem; }
.field label { display: flex; justify-content: space-between; }
.field label span { font-weight: 700; font-size: var(--fs-2xs); }
.val { display: block; font-family: var(--mono); font-size: var(--fs-xs) !important; background: var(--paper) !important; color: var(--ink) !important; padding: 0.45em 0.6em !important; border-radius: var(--r-sm); word-break: break-all; min-height: 2.2em; }
.val.pub { color: var(--chain) !important; }
.sec { cursor: pointer; transition: filter 0.3s; border: 1.5px dashed var(--loss); }
.sec.blur { filter: blur(5px); }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.verdict { border-radius: var(--r-sm); padding: 0.5rem 0.7rem; display: grid; gap: 0.1rem; }
.verdict b { font-size: var(--fs-md); }
.verdict span { font-size: var(--fs-xs); }
.ok { background: var(--gain-soft); color: var(--gain); }
.bad { background: var(--loss-soft); color: var(--loss); }
.v-enter-active, .v-leave-active { transition: all 0.25s; }
.v-enter-from { opacity: 0; transform: scale(0.95); } .v-leave-to { opacity: 0; }
</style>
