<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { TransitionGroup } from 'vue'
import { useRouter } from 'vue-router'
import ChatListItem from './ChatListItem.vue'
import { getDialogsChatPath } from '@/enums'
import { useChatsStore } from '@/stores'
import type { Chat } from '@/types'
import { formatMessagePreview, formatMessageTime } from '@/utils/format'

const router = useRouter()
const chatStore = useChatsStore()
const { sortedChats, currentChatId, lastMessageByChat } = storeToRefs(chatStore)

const selectChat = (chat: Chat) => {
  chatStore.openChat(chat.id)
  router.push(getDialogsChatPath(chat.id))
}
</script>

<template>
  <div class="chat-list">
    <header class="chat-list__header">
      <h1 class="chat-list__title">Чаты</h1>
    </header>
    <TransitionGroup
      tag="ul"
      name="chat-list"
      class="chat-list__items"
      role="list"
    >
      <ChatListItem
        v-for="chat in sortedChats"
        :key="chat.id"
        :chat="chat"
        :is-active="currentChatId === chat.id"
        :is-online="chatStore.isOnline(chat.id)"
        :unread-count="chatStore.getUnreadCount(chat.id)"
        :preview-text="formatMessagePreview(lastMessageByChat[chat.id])"
        :preview-time="formatMessageTime(lastMessageByChat[chat.id])"
        @select="selectChat"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-panel);
}

.chat-list__header {
  flex: 0 0 auto;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.chat-list__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.chat-list__items {
  flex: 1 1 auto;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

:deep(.chat-list-enter-active),
:deep(.chat-list-leave-active) {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

:deep(.chat-list-enter-from) {
  opacity: 0;
  transform: translateY(-8px);
}

:deep(.chat-list-enter-to) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.chat-list-leave-from) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.chat-list-leave-to) {
  opacity: 0;
  transform: translateY(-4px);
}

:deep(.chat-list-move) {
  transition: transform 0.35s ease;
}
</style>
