import { toDogImage, type DogImage } from '../domain/dog'

const API_BASE = 'https://dog.ceo/api'
const MAX_DOGS = 50
const REQUEST_TIMEOUT_MS = 10_000

interface DogApiResponse {
  message: string | string[]
  status: string
}

function isDogApiResponse(value: unknown): value is DogApiResponse {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as { message?: unknown; status?: unknown }
  return (
    typeof candidate.status === 'string' &&
    (typeof candidate.message === 'string' || Array.isArray(candidate.message))
  )
}

async function fetchJson(url: string, userSignal?: AbortSignal): Promise<DogApiResponse> {
  const controller = new AbortController()
  const abort = () => controller.abort(userSignal?.reason)

  if (userSignal?.aborted) abort()
  else userSignal?.addEventListener('abort', abort, { once: true })

  const timeout = setTimeout(() => {
    controller.abort(new DOMException('The request timed out.', 'TimeoutError'))
  }, REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`The Dog API responded with ${res.status}.`)
    const data: unknown = await res.json()
    if (!isDogApiResponse(data) || data.status !== 'success') {
      throw new Error('The Dog API returned an unexpected response.')
    }
    return data
  } finally {
    clearTimeout(timeout)
    userSignal?.removeEventListener('abort', abort)
  }
}

export async function fetchRandomDogs(
  count = 10,
  options: { signal?: AbortSignal } = {},
): Promise<DogImage[]> {
  if (!Number.isInteger(count) || count < 1 || count > MAX_DOGS) {
    throw new Error(`count must be an integer between 1 and ${MAX_DOGS}.`)
  }

  const data = await fetchJson(
    `${API_BASE}/breeds/image/random/${count}`,
    options.signal,
  )

  if (!Array.isArray(data.message)) {
    throw new Error('The Dog API returned an unexpected response.')
  }

  return data.message
    .filter((url): url is string => typeof url === 'string')
    .map(toDogImage)
}
