export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const request = async <T>(url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.statusText}`, response.status, response)
  }
  return response.json() as Promise<T>
}
