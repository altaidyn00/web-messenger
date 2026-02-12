<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  online: boolean
  showLabel?: boolean
  overlay?: boolean
}>()

const title = computed(() => props.online ? 'Онлайн' : 'Офлайн')
</script>

<template>
  <span
    class="status-indicator"
    :class="[
      online ? 'status-indicator--online' : 'status-indicator--offline',
      { 'status-indicator--overlay': overlay }
    ]"
  >
    <span
      class="status-indicator__dot"
      :title
      aria-hidden="true"
    />
    <span v-if="showLabel" class="status-indicator__label">
      {{ title }}
    </span>
  </span>
</template>

<style lang="scss" scoped>
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-indicator__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator--overlay .status-indicator__dot {
  width: 12px;
  height: 12px;
  border: 2px solid var(--bg-panel);
}

.status-indicator--online .status-indicator__dot {
  background: var(--status-online);
}

.status-indicator--offline .status-indicator__dot {
  background: var(--status-offline);
}

.status-indicator__label {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
