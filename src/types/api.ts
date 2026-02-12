import type { Chat } from './index'

export interface ApiGeo {
  lat: string
  lng: string
}

export interface ApiAddress {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: ApiGeo
}

export interface ApiCompany {
  name: string
  catchPhrase: string
  bs: string
}

export interface ApiUser {
  id: number
  name: string
  username: string
  email: string
  address: ApiAddress
  phone: string
  website: string
  company: ApiCompany
}

export type FetchChatsResponse = Chat[]
