import { nextTick, onUnmounted, ref, watch, type Ref } from 'vue'
import { SCROLL_THRESHOLD_PX } from '@/constants'

export const useScrollToBottom = (
  anchorRef: Ref<HTMLElement | null>,
  scrollContainerRef?: Ref<HTMLElement | null>
) => {
  const showScrollToBottomButton = ref(false)

  const scrollToBottom = () => {
    nextTick(() => {
      anchorRef.value?.scrollIntoView({ behavior: 'smooth' })
      showScrollToBottomButton.value = false
    })
  }

  const checkNearBottom = () => {
    const el = scrollContainerRef?.value
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    showScrollToBottomButton.value = distanceFromBottom > SCROLL_THRESHOLD_PX
  }

  let rafId: number | null = null
  const onScroll = () => {
    if (rafId != null) return
    rafId = requestAnimationFrame(() => {
      checkNearBottom()
      rafId = null
    })
  }

  let cleanup: (() => void) | null = null
  watch(
    () => scrollContainerRef?.value,
    (el) => {
      cleanup?.()
      cleanup = null
      if (el) {
        el.addEventListener('scroll', onScroll, { passive: true })
        checkNearBottom()
        cleanup = () => {
          el.removeEventListener('scroll', onScroll)
        }
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    cleanup?.()
    if (rafId != null) cancelAnimationFrame(rafId)
  })

  return { scrollToBottom, showScrollToBottomButton, checkNearBottom }
}
