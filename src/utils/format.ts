import type { Message } from '@/types'
import { LAST_MESSAGE_PREVIEW_MAX_LENGTH, LOCALE } from '@/constants'

const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }
const DATE_LABEL_OPTIONS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

const relativeDateFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })

export const getDateKey = (isoTime: string) => {
  const d = new Date(isoTime)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const formatMessagePreview = (message: Message | undefined) => {
  if (!message?.text) return 'Нет сообщений'
  const text = message.text
  return text.length > LAST_MESSAGE_PREVIEW_MAX_LENGTH
    ? `${text.slice(0, LAST_MESSAGE_PREVIEW_MAX_LENGTH)}…`
    : text
}

export const formatMessageTime = (message: Message | undefined) => {
  if (!message?.time) return ''
  const d = new Date(message.time)
  const now = new Date()
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString(LOCALE, TIME_OPTIONS)
    : d.toLocaleDateString(LOCALE, DATE_OPTIONS)
}

export const formatTimeShort = (isoTime: string) => {
  return new Date(isoTime).toLocaleTimeString(LOCALE, TIME_OPTIONS)
}

export const formatMessageDateLabel = (isoTime: string) => {
  const d = new Date(isoTime)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.floor((startOfMsg.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return relativeDateFormatter.format(0, 'day')
  if (diffDays === -1) return relativeDateFormatter.format(-1, 'day')
  return d.toLocaleDateString(LOCALE, DATE_LABEL_OPTIONS)
}
