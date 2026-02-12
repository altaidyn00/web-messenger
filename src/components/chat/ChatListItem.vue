<script setup lang="ts">
import type { Chat } from '@/types'
import Avatar from '@/components/ui/Avatar.vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'

defineProps<{
  chat: Chat
  isActive: boolean
  isOnline: boolean
  unreadCount: number
  previewText: string
  previewTime: string
}>()

const emit = defineEmits<{
  select: [chat: Chat]
}>()
</script>

<template>
  <li
    class="chat-list-item"
    :class="{ 'chat-list-item--active': isActive }"
    role="button"
    tabindex="0"
    @click="emit('select', chat)"
    @keydown.enter="emit('select', chat)"
  >
    <div class="chat-list-item__avatar-wrap">
      <Avatar :name="chat.name" size="md" />
      <span class="chat-list-item__status-wrap">
        <StatusIndicator :online="isOnline" overlay />
      </span>
    </div>
    <div class="chat-list-item__body">
      <div class="chat-list-item__row">
        <span class="chat-list-item__name">{{ chat.name }}</span>
        <span v-if="unreadCount" class="chat-list-item__unread">
          {{ unreadCount }}
        </span>
      </div>
      <div class="chat-list-item__preview">
        {{ previewText }}
      </div>
      <div v-if="previewTime" class="chat-list-item__time">
        {{ previewTime }}
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;

.chat-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;

  &:hover {
    background: var(--bg-hover);
  }

  &--active {
    background: var(--bg-active);
  }
}

.chat-list-item__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.chat-list-item__status-wrap {
  position: absolute;
  right: 0;
  bottom: 0;
}

.chat-list-item__body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-list-item__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-list-item__name {
  font-weight: 600;
  color: var(--text-primary);
  @include singleLineEllipsis;
}

.chat-list-item__unread {
  flex-shrink: 0;
  min-width: 20px;
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.chat-list-item__preview {
  font-size: 14px;
  color: var(--text-secondary);
  @include singleLineEllipsis;
}

.chat-list-item__time {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
