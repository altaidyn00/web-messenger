<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import { IconSend } from '@/assets/icons'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useChatsStore } from '@/stores'

const store = useChatsStore()
const { isMobile } = useBreakpoint()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const canSend = computed(() => !!text.value.trim() && !store.isSending)

const send = async () => {
  const t = text.value.trim()
  if (!t || store.isSending) return
  text.value = ''
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  })
  await store.sendMessage(t)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter' || e.shiftKey) return
  if (isMobile.value) return
  e.preventDefault()
  send()
}

const onInput = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}
</script>

<template>
  <div class="message-input">
    <textarea
      ref="textareaRef"
      v-model="text"
      class="message-input__field"
      placeholder="Введите сообщение..."
      rows="1"
      @keydown="onKeydown"
      @input="onInput"
    />
    <Button
      variant="primary"
      size="icon"
      class="message-input__send"
      :disabled="!canSend"
      aria-label="Send"
      @click="send"
    >
      <Loader v-if="store.isSending" size="medium" color="white" />
      <IconSend v-else />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.message-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-panel);
}

.message-input__field {
  flex: 1 1 auto;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-primary);
  font: inherit;
  font-size: 15px;
  resize: none;
  max-height: 120px;
  transition: border-color 0.15s;

  &::placeholder {
    color: var(--text-muted);
  }
  &:focus {
    outline: none;
    border-color: var(--accent);
  }
}

.message-input__send {
  flex-shrink: 0;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.message-input__send :deep(.loader-circle) {
  stroke: white;
}
</style>
