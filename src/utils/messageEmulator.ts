import type { Message } from '@/types'
import {
  AUTO_REPLY_DELAY_MS_MIN,
  AUTO_REPLY_DELAY_MS_MAX,
  SIMULATE_OTHER_CHAT_DELAY_MS_MIN,
  SIMULATE_OTHER_CHAT_DELAY_MS_MAX,
  AUTO_REPLY_TEXT,
  INCOMING_IN_OTHER_CHAT_TEXT,
  SAMPLE_INCOMING,
  SAMPLE_OUTGOING,
} from '@/constants'
import { randomInRange } from '@/utils/random'

const randomItem = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const randomMinutesAgo = (maxMinutes: number) => {
  return Date.now() - Math.floor(Math.random() * maxMinutes) * 60 * 1000
}

export const generateMessageHistory = (contactId: number) => {
  const count = 20 + Math.floor(Math.random() * 11)
  const messages: Message[] = []
  for (let i = 0; i < count; i++) {
    const isOutgoing = Math.random() > 0.5
    const time = randomMinutesAgo(60 * 24 * 7)
    messages.push({
      id: `gen-${contactId}-${i}-${time}`,
      text: isOutgoing ? randomItem(SAMPLE_OUTGOING) : randomItem(SAMPLE_INCOMING),
      isOutgoing,
      time: new Date(time).toISOString(),
      contactId,
    })
  }
  messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  return messages
}

export const scheduleAutoReply = (
  contactId: number,
  onReply: (msg: Message) => void
) => {
  const delayMs = randomInRange(AUTO_REPLY_DELAY_MS_MIN, AUTO_REPLY_DELAY_MS_MAX)
  const timeoutId = setTimeout(() => {
    onReply({
      id: `reply-${contactId}-${Date.now()}`,
      text: AUTO_REPLY_TEXT,
      isOutgoing: false,
      time: new Date().toISOString(),
      contactId,
    })
  }, delayMs)
  return () => clearTimeout(timeoutId)
}

export const simulateIncomingInOtherChat = (
  _currentChatId: number,
  chatIds: number[],
  onMessage: (msg: Message) => void
) => {
  if (chatIds.length === 0) return () => {}
  let cancelled = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const scheduleNext = () => {
    if (cancelled) return
    const delay = randomInRange(SIMULATE_OTHER_CHAT_DELAY_MS_MIN, SIMULATE_OTHER_CHAT_DELAY_MS_MAX)
    const targetId = chatIds[Math.floor(Math.random() * chatIds.length)]
    timeoutId = setTimeout(() => {
      onMessage({
        id: `sim-${targetId}-${Date.now()}`,
        text: INCOMING_IN_OTHER_CHAT_TEXT,
        isOutgoing: false,
        time: new Date().toISOString(),
        contactId: targetId,
      })
      scheduleNext()
    }, delay)
  }
  scheduleNext()
  return () => {
    cancelled = true
    if (timeoutId != null) clearTimeout(timeoutId)
  }
}
