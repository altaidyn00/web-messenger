<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ChatList from '@/components/chat/ChatList.vue'
import Loader from '@/components/ui/Loader.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useChatsStore } from '@/stores'

const route = useRoute()
const { isMobile } = useBreakpoint()
const store = useChatsStore()
const chatsReady = ref(store.chats.length > 0)

onMounted(async () => {
  if (!chatsReady.value) {
    await store.loadChats()
  }
  chatsReady.value = true
})

const showList = computed(() => !isMobile.value || !route.params.id)
const showContent = computed(() => !isMobile.value || !!route.params.id)
</script>

<template>
  <div class="dialogs-layout">
    <template v-if="chatsReady">
      <aside v-show="showList" class="dialogs-layout__list">
        <ChatList />
      </aside>
      <main v-show="showContent" class="dialogs-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="dialogs-content" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </template>
    <div v-else class="dialogs-layout__loading">
      <Loader />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialogs-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.dialogs-layout__list {
  flex: 0 0 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
}

.dialogs-layout__content {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dialogs-layout__loading {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.dialogs-content-enter-active,
.dialogs-content-leave-active {
  transition: opacity 0.2s ease;
}
.dialogs-content-enter-from,
.dialogs-content-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .dialogs-layout__list,
  .dialogs-layout__content {
    flex: 1 1 auto;
  }
}
</style>
