import { ref } from 'vue'

export const useSidebar = () => {
  const isSidebarOpened = ref(false)

  const openSidebar = () => {
    isSidebarOpened.value = true
  }

  const closeSidebar = () => {
    isSidebarOpened.value = false
  }

  return { isSidebarOpened, openSidebar, closeSidebar }
}
