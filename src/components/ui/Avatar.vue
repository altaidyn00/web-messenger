<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)

const initial = computed(() => {
  if (!props.name?.trim()) return '?'
  const parts = props.name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }
  const first = parts[0]
  return (first.length > 1 ? first.slice(0, 2) : first).toUpperCase()
})
</script>

<template>
  <span
    class="avatar"
    :class="[`avatar--${size}`]"
    :aria-label="name"
  >
    {{ initial }}
  </span>
</template>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--avatar-bg);
  color: var(--text-primary);
  font-weight: 600;

  &--sm {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  &--md {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
}
</style>
