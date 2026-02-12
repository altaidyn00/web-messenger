import { onMounted, onUnmounted, ref } from 'vue'
import { BREAKPOINT_MOBILE } from '@/constants'

export const useBreakpoint = (
  maxWidthPx: number = BREAKPOINT_MOBILE
) => {
  const isBelow = ref(false)

  const update = () => {
    isBelow.value = typeof window !== 'undefined' && window.innerWidth < maxWidthPx
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isBelow, isMobile: isBelow }
}
