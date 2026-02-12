<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/ui/Avatar.vue'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import MessageItem from '@/components/message/MessageItem.vue'
import MessageInput from '@/components/message/MessageInput.vue'
import ContactSidebar from './ContactSidebar.vue'
import { IconArrow, IconInfo } from '@/assets/icons'
import { useScrollToBottom } from '@/composables/useScrollToBottom'
import { useSidebar } from '@/composables/useSidebar'
import { useChatsStore } from '@/stores'
import type { MessageListEntry } from '@/types'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/enums'
import { formatMessageDateLabel, getDateKey } from '@/utils/format'

const router = useRouter()
const chatStore = useChatsStore()
const { currentChat, currentChatId, currentMessages, messagesLoading } = storeToRefs(chatStore)
const messagesEndRef = ref<HTMLDivElement | null>(null)
const messagesContainerRef = ref<HTMLDivElement | null>(null)

const { scrollToBottom, showScrollToBottomButton, checkNearBottom } = useScrollToBottom(
  messagesEndRef,
  messagesContainerRef
)
const { isSidebarOpened, openSidebar, closeSidebar } = useSidebar()

const isCurrentChatOnline = computed(() =>
  currentChat.value ? chatStore.isOnline(currentChat.value.id) : false
)

const messageListWithDates = computed<MessageListEntry[]>(() => {
  const list: MessageListEntry[] = []
  let lastDateKey = ''
  for (const msg of currentMessages.value) {
    const dateKey = getDateKey(msg.time)
    if (dateKey !== lastDateKey) {
      lastDateKey = dateKey
      list.push({ type: 'dateLabel', key: `date-${dateKey}`, label: formatMessageDateLabel(msg.time) })
    }
    list.push({ type: 'message', key: msg.id, message: msg })
  }
  return list
})

const openContactInfo = () => {
  if (currentChat.value) openSidebar()
}

const goBack = () => {
  router.push(ROUTE_PATHS[ROUTE_NAMES.Dialogs])
}

watch(
  () => currentMessages.value.length,
  (newLen, oldLen) => {
    if (oldLen !== undefined && newLen === oldLen) return
    scrollToBottom()
  },
  { flush: 'post' }
)
watch(
  () => currentChatId.value,
  () => scrollToBottom(),
  { immediate: true, flush: 'post' }
)
watch(
  () => messagesLoading.value,
  (loading) => {
    if (!loading) {
      scrollToBottom()
      checkNearBottom()
    }
  }
)
</script>

<template>
  <div class="chat-window">
    <template v-if="currentChat">
      <header class="chat-window__header">
        <Button @click="goBack"><IconArrow /></Button>
        <div class="chat-window__contact">
          <Avatar :name="currentChat.name" size="sm" />
          <div class="chat-window__info">
            <span class="chat-window__name">{{ currentChat.name }}</span>
            <StatusIndicator :online="isCurrentChatOnline" show-label />
          </div>
        </div>
        <Button @click="openContactInfo"><IconInfo /></Button>
      </header>
      <div class="chat-window__messages" ref="messagesContainerRef">
        <Loader absolute v-if="messagesLoading" />
        <Transition name="messages-fade" mode="out-in">
          <div v-if="!messagesLoading" class="chat-window__message-list">
            <template v-for="entry in messageListWithDates" :key="entry.key">
              <div v-if="entry.type === 'dateLabel'" class="chat-window__date-label">
                {{ entry.label }}
              </div>
              <MessageItem v-else :message="entry.message" />
            </template>
            <div ref="messagesEndRef" class="chat-window__scroll-anchor" />
          </div>
        </Transition>
      </div>
      <Transition name="scroll-btn">
        <Button
          v-show="showScrollToBottomButton"
          size="icon"
          class="chat-window__scroll-to-bottom"
          aria-label="Scroll to bottom"
          @click="scrollToBottom"
        >
          <IconArrow />
        </Button>
      </Transition>
      <MessageInput />
      <ContactSidebar
        :contact="currentChat"
        :is-open="isSidebarOpened"
        @close="closeSidebar"
      />
    </template>
    <div v-else class="chat-window__empty">
      <p>Выберите чат</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-main);
  position: relative;
}

.chat-window__header {
  display: grid;
  gap: 24px;
  padding: 12px 16px;
  background: var(--bg-panel);
  grid-template-columns: 40px 1fr 40px;
  border-bottom: 1px solid var(--border-color);
}

.chat-window__contact {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  text-align: left;
  border-radius: 8px;
  transition: background 0.15s;
}

.chat-window__info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-window__name {
  font-weight: 600;
  color: var(--text-primary);
  @include singleLineEllipsis;
}

.chat-window__messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-window__message-list {
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.chat-window__date-label {
  align-self: center;
  margin: 12px 0 8px;
  padding: 4px 12px;
  border-radius: 8px;
  background: var(--bg-hover);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
}

.chat-window__scroll-anchor {
  height: 0;
  flex-shrink: 0;
}

.chat-window__scroll-to-bottom {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-panel);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.15s, transform 0.15s;

  &:hover {
    background: var(--bg-hover);
  }

  svg {
    transform: rotate(-90deg);
  }
}

.chat-window__empty {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 15px;
}

.messages-fade-enter-active,
.messages-fade-leave-active {
  transition: opacity 0.25s ease;
}
.messages-fade-enter-from,
.messages-fade-leave-to {
  opacity: 0;
}

.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
