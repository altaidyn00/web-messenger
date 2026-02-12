import type { Message, PersistedState } from '@/types'
import { STORAGE_KEY } from '@/constants'

export const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

export const saveMessages = (messagesByChat: Record<number, Message[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messagesByChat }))
  } catch (err: unknown) {
    console.error(err);
  }
}
