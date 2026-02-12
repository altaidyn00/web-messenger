<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import { getDialogsChatPath, ROUTE_NAMES, ROUTE_PATHS } from '@/enums'
import { useChatsStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const store = useChatsStore()

const chatId = computed(() => Number(route.params.id))

const openChatFromRoute = () => {
  const id = chatId.value
  if (!id || !Number.isFinite(id)) return
  if (store.currentChatId === id) return
  if (store.chats.some((c) => c.id === id)) {
    store.openChat(id)
    return
  }
  const first = store.sortedChats[0]
  if (first) {
    router.replace(getDialogsChatPath(first.id))
  } else {
    router.replace(ROUTE_PATHS[ROUTE_NAMES.Dialogs])
  }
}

watch(
  [chatId, () => store.chats],
  openChatFromRoute,
  { immediate: true }
)
</script>

<template>
  <div class="dialogs-chat">
    <div class="dialogs-chat__content">
      <ChatWindow />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialogs-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-main);
}

.dialogs-chat__content {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
