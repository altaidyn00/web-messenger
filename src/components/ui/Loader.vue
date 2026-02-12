<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'large' | 'medium' | 'small'
    color?: 'primary' | 'secondary' | 'white'
    absolute?: boolean
  }>(),
  {
    color: 'primary',
    size: 'large',
  }
)
</script>

<template>
  <div :class="['loader', { absolute }]">
    <div :class="['loader-wrapper', `size-${size}`, `color-${color}`]">
      <svg viewBox="0 0 43 43">
        <circle
          class="loader-circle"
          fill="none"
          stroke-linecap="round"
          transform-origin="center"
          stroke="none"
          cx="21.5"
          cy="21.5"
          r="16"
          stroke-width="3"
          stroke-dasharray="160"
          stroke-dashoffset="160"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$colors: (
  'primary': var(--primary),
  'secondary': var(--secondary),
  'white': var(--bubble-in),
);

$sizes: (
  'large': 32px,
  'medium': 20px,
  'small': 16px,
);

.loader {
  display: grid;
  place-items: center;

  &.absolute {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .loader-circle {
    animation: fill-rotate 1s linear infinite;
  }

  .loader-wrapper {
    @each $color-key, $color-value in $colors {
      &.color-#{$color-key} {
        .loader-circle {
          stroke: $color-value;
        }
      }
    }

    @each $size-key, $size-value in $sizes {
      &.size-#{$size-key} {
        width: $size-value;
        height: $size-value;
        svg {
          width: $size-value;
          height: $size-value;
        }
      }
    }
  }
}

@keyframes fill-rotate {
  0% {
    stroke-dashoffset: 160px;
  }
  50% {
    stroke-dashoffset: 110px;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 160px;
    transform: rotate(360deg);
  }
}
</style>
