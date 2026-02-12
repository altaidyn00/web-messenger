import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Chat, Message } from '@/types'
import { fetchChats } from '@/api/chats'
import {
  CHATS_FETCH_LIMIT,
  MESSAGES_LOAD_DELAY_MS,
  SEND_MESSAGE_DELAY_MS_MAX,
  SEND_MESSAGE_DELAY_MS_MIN,
  STATUS_UPDATE_INTERVAL_MS,
} from '@/constants'
import { delay } from '@/utils/async'
import { generateMessageHistory, scheduleAutoReply, simulateIncomingInOtherChat } from '@/utils/messageEmulator'
import { randomInRange } from '@/utils/random'
import { loadPersistedState, saveMessages } from '@/utils/storage'

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[]>([])
  const allChatsById = ref<Record<number, Chat>>({})
  const currentChatId = ref<number | null>(null)
  const messagesByChat = ref<Record<number, Message[]>>({})
  const onlineStatus = ref<Record<number, boolean>>({})
  const unreadByChat = ref<Record<number, number>>({})
  const messagesLoading = ref(false)
  const isSending = ref(false)

  let messagesLoadTimeoutId: ReturnType<typeof setTimeout> | null = null

  const currentChat = computed<Chat | undefined>(() =>
    chats.value.find((c) => c.id === currentChatId.value)
  )

  const sortedChats = computed<Chat[]>(() => {
    const list = [...chats.value]
    const lastByChat = lastMessageByChat.value
    const unread = unreadByChat.value
    return list.sort((a, b) => {
      const hasUnreadA = (unread[a.id] || 0) > 0
      const hasUnreadB = (unread[b.id] || 0) > 0
      if (hasUnreadA && !hasUnreadB) return -1
      if (!hasUnreadA && hasUnreadB) return 1
      const timeA = lastByChat[a.id]?.time ? new Date(lastByChat[a.id].time).getTime() : 0
      const timeB = lastByChat[b.id]?.time ? new Date(lastByChat[b.id].time).getTime() : 0
      return timeB - timeA
    })
  })

  const currentMessages = computed<Message[]>(() => {
    if (!currentChatId.value) return []
    return messagesByChat.value[currentChatId.value] || []
  })

  const lastMessageByChat = computed<Record<number, Message>>(() => {
    const result: Record<number, Message> = {}
    for (const [chatId, list] of Object.entries(messagesByChat.value)) {
      const id = Number(chatId)
      if (list.length) {
        result[id] = list[list.length - 1]
      }
    }
    return result
  })

  let cancelAutoReply: (() => void) | null = null
  let cancelSimulateOther: (() => void) | null = null
  let statusUpdateIntervalId: ReturnType<typeof setInterval> | null = null

  const setOnline = (contactId: number, value: boolean) => {
    onlineStatus.value[contactId] = value
    onlineStatus.value = { ...onlineStatus.value }
  }

  const ensureMessagesForChat = (contactId: number) => {
    if (messagesByChat.value[contactId]?.length) return
    const persisted = loadPersistedState()
    const saved = persisted?.messagesByChat?.[contactId]
    if (saved?.length) {
      messagesByChat.value = { ...messagesByChat.value, [contactId]: saved }
      persistAll()
      return
    }
    const generated = generateMessageHistory(contactId)
    messagesByChat.value = { ...messagesByChat.value, [contactId]: generated }
    persistAll()
  }

  const persistAll = () => {
    saveMessages(messagesByChat.value)
  }

  const ensureChatInList = (contactId: number) => {
    if (chats.value.some((c) => c.id === contactId)) return
    const chat = allChatsById.value[contactId]
    if (chat) {
      chats.value = [...chats.value, chat]
      if (onlineStatus.value[contactId] === undefined) {
        onlineStatus.value[contactId] = Math.random() > 0.3
        onlineStatus.value = { ...onlineStatus.value }
      }
    }
  }

  const addMessage = (contactId: number, message: Message) => {
    const list = messagesByChat.value[contactId] || []
    messagesByChat.value = {
      ...messagesByChat.value,
      [contactId]: [...list, message],
    }
    persistAll()
  }

  const sendMessage = async (text: string) => {
    if (!text?.trim() || !currentChatId.value) return
    const contactId = currentChatId.value
    const trimmed = text.trim()
    isSending.value = true
    await delay(Math.round(randomInRange(SEND_MESSAGE_DELAY_MS_MIN, SEND_MESSAGE_DELAY_MS_MAX)))
    if (currentChatId.value !== contactId) {
      isSending.value = false
      return
    }
    const msg: Message = {
      id: `out-${contactId}-${Date.now()}`,
      text: trimmed,
      isOutgoing: true,
      time: new Date().toISOString(),
      contactId,
    }
    addMessage(contactId, msg)
    isSending.value = false

    if (cancelAutoReply) cancelAutoReply()
    cancelAutoReply = scheduleAutoReply(contactId, (replyMsg) => {
      addMessage(replyMsg.contactId, replyMsg)
      const replyChatId = replyMsg.contactId
      if (replyChatId !== currentChatId.value) {
        const count = unreadByChat.value[replyChatId] || 0
        unreadByChat.value[replyChatId] = count + 1
        unreadByChat.value = { ...unreadByChat.value }
      }
    })
  }

  const setCurrentChatId = (id: number | null) => {
    currentChatId.value = id
    if (id === null && statusUpdateIntervalId != null) {
      clearInterval(statusUpdateIntervalId)
      statusUpdateIntervalId = null
    }
  }

  const openChat = (contactId: number) => {
    if (messagesLoadTimeoutId != null) {
      clearTimeout(messagesLoadTimeoutId)
      messagesLoadTimeoutId = null
    }
    ensureMessagesForChat(contactId)
    currentChatId.value = contactId
    messagesLoading.value = true
    messagesLoadTimeoutId = setTimeout(() => {
      messagesLoading.value = false
      messagesLoadTimeoutId = null
    }, MESSAGES_LOAD_DELAY_MS)
    clearUnread(contactId)
    if (Math.random() > 0.6) {
      setOnline(contactId, Math.random() > 0.5)
    }
    if (statusUpdateIntervalId != null) {
      clearInterval(statusUpdateIntervalId)
      statusUpdateIntervalId = null
    }
    statusUpdateIntervalId = setInterval(() => {
      if (currentChatId.value !== contactId) return
      setOnline(contactId, Math.random() > 0.5)
    }, STATUS_UPDATE_INTERVAL_MS)
    if (cancelSimulateOther) cancelSimulateOther()
    const allChatIds = Object.keys(allChatsById.value).map(Number)
    cancelSimulateOther = simulateIncomingInOtherChat(contactId, allChatIds, (msg) => {
      const id = msg.contactId
      ensureMessagesForChat(id)
      addMessage(id, msg)
      ensureChatInList(id)
      if (id !== currentChatId.value) {
        const count = unreadByChat.value[id] || 0
        unreadByChat.value[id] = count + 1
        unreadByChat.value = { ...unreadByChat.value }
      }
    })
  }

  const clearUnread = (contactId: number) => {
    unreadByChat.value[contactId] = 0
    unreadByChat.value = { ...unreadByChat.value }
  }

  const getUnreadCount = (contactId: number) => {
    return unreadByChat.value[contactId] || 0
  }

  const isOnline = (contactId: number) => {
    if (onlineStatus.value[contactId] !== undefined) {
      return onlineStatus.value[contactId]
    }
    return Math.random() > 0.3
  }

  const loadPersistedMessages = () => {
    const persisted = loadPersistedState()
    if (persisted?.messagesByChat && Object.keys(persisted.messagesByChat).length) {
      messagesByChat.value = { ...messagesByChat.value, ...persisted.messagesByChat }
    }
  }

  const loadChats = async () => {
    loadPersistedMessages()
    const list = await fetchChats()
    allChatsById.value = Object.fromEntries(list.map((c) => [c.id, c]))
    chats.value = list.slice(0, CHATS_FETCH_LIMIT)
    list.forEach((c) => {
      if (onlineStatus.value[c.id] === undefined) {
        onlineStatus.value[c.id] = Math.random() > 0.3
      }
    })
    onlineStatus.value = { ...onlineStatus.value }
  }

  return {
    chats,
    sortedChats,
    currentChatId,
    currentChat,
    currentMessages,
    lastMessageByChat,
    messagesByChat,
    onlineStatus,
    unreadByChat,
    messagesLoading,
    isSending,
    setOnline,
    setCurrentChatId,
    ensureMessagesForChat,
    addMessage,
    sendMessage,
    openChat,
    clearUnread,
    getUnreadCount,
    isOnline,
    loadChats,
    persistAll,
  }
})
