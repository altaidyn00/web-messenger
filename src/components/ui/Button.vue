<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'ghost' | 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    type?: 'button' | 'submit'
    disabled?: boolean  
    ariaLabel?: string
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    type: 'button',
    disabled: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :deep(svg) {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    fill: currentColor;
    stroke: currentColor;
  }
}

.btn--sm {
  padding: 6px 12px;
  font-size: 14px;
}

.btn--md {
  padding: 8px 16px;
  font-size: 16px;
}

.btn--icon {
  padding: 8px;
  font-size: 20px;
}

.btn--lg {
  padding: 10px 20px;
  font-size: 18px;
}

.btn--ghost {
  background: none;
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background: var(--bg-hover);
  }
}

.btn--primary {
  background: var(--accent);
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

.btn--secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover:not(:disabled) {
    background: var(--bg-hover);
  }
}
</style>
