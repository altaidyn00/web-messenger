<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatsStore } from '@/stores'
import { useBreakpoint } from '@/composables/useBreakpoint'

const { setCurrentChatId } = useChatsStore()
const { isMobile } = useBreakpoint()

onMounted(() => {
  setCurrentChatId(null)
})
</script>

<template>
  <div class="dialogs-placeholder">
    <p v-if="!isMobile" class="dialogs-placeholder__text">Выберите чат</p>
  </div>
</template>

<style lang="scss" scoped>
.dialogs-placeholder {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  background: var(--bg-main);
}

.dialogs-placeholder__text {
  margin: 0;
  color: var(--text-muted);
  font-size: 15px;
}
</style>
