export const API_ENDPOINT = {
  users: 'users',
} as const

export type ApiEndpointKey = keyof typeof API_ENDPOINT
