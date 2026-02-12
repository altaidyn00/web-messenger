export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: { lat: string; lng: string }
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface Chat {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

export interface Message {
  id: string
  text: string
  isOutgoing: boolean
  time: string
  contactId: number
}

export type MessageListEntry =
  | { type: 'dateLabel'; key: string; label: string }
  | { type: 'message'; key: string; message: Message }

export interface PersistedState {
  messagesByChat: Record<number, Message[]>
}

export type ChatIdParam = string

export type { FormattedSegment } from './format'
