import type { ApiUser } from '@/types/api'
import { API_ENDPOINTS } from '@/constants'
import { request } from './client'

const toChat = (user: ApiUser) => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    address: {
      street: user.address.street,
      suite: user.address.suite,
      city: user.address.city,
      zipcode: user.address.zipcode,
      geo: { ...user.address.geo },
    },
    phone: user.phone,
    website: user.website,
    company: {
      name: user.company.name,
      catchPhrase: user.company.catchPhrase,
      bs: user.company.bs,
    },
  }
}

export const fetchChats = async (limit?: number) => {
  const users = await request<ApiUser[]>(API_ENDPOINTS.users)
  const list = users.map(toChat)
  return limit == null ? list : list.slice(0, limit)
}
