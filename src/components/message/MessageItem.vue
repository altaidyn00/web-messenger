<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types'
import { formatTimeShort } from '@/utils/format'
import { parseInlineFormatting } from '@/utils/textFormat'

const props = defineProps<{ message: Message }>()

const timeStr = computed(() => formatTimeShort(props.message.time))

const segments = computed(() => parseInlineFormatting(props.message.text))
</script>

<template>
  <div
    class="message"
    :class="{
      'message--outgoing': message.isOutgoing,
      'message--incoming': !message.isOutgoing,
    }"
  >
    <div class="message__bubble">
      <p class="message__text">
        <template v-for="(seg, i) in segments" :key="i">
          <template v-if="seg.type === 'text'">{{ seg.value }}</template>
          <strong v-else-if="seg.type === 'bold'">{{ seg.value }}</strong>
          <em v-else-if="seg.type === 'italic'">{{ seg.value }}</em>
        </template>
      </p>
      <time class="message__time" :datetime="message.time">{{ timeStr }}</time>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  margin-bottom: 8px;
  animation: messageIn 0.2s ease-out;

  &--outgoing {
    justify-content: flex-end;
    .message__bubble {
      background: var(--bubble-out);
      color: var(--bubble-out-text);
    }
  }

  &--incoming {
    justify-content: flex-start;
    .message__bubble {
      background: var(--bubble-in);
      color: var(--bubble-in-text);
    }
  }
}

.message__bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  word-break: break-word;
}

.message__text {
  margin: 0 0 4px 0;
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-wrap;

  :deep(strong) {
    font-weight: 700;
  }
  :deep(em) {
    font-style: italic;
  }
}

.message__time {
  display: block;
  font-size: 11px;
  opacity: 0.85;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
