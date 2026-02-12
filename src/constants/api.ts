import { API_ENDPOINT } from '@/enums'

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com' // Вынести в .env

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/${API_ENDPOINT.users}`,
} as const
