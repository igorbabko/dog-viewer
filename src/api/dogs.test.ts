import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchRandomDogs } from './dogs'

const url = 'https://images.dog.ceo/breeds/pug/n02110958_1.jpg'

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body }
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('fetchRandomDogs', () => {
  it('fetches and maps dogs', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: [url], status: 'success' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchRandomDogs(1)).resolves.toEqual([{ url, breed: 'Pug' }])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dog.ceo/api/breeds/image/random/1',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('drops non-string entries from the response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: [url, 42], status: 'success' }),
      }),
    )
    await expect(fetchRandomDogs()).resolves.toHaveLength(1)
  })

  it('throws on an HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, false, 500)))
    await expect(fetchRandomDogs()).rejects.toThrow(
      'The Dog API responded with 500.',
    )
  })

  it('throws on an API error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ message: 'error', status: 'error' }),
      ),
    )
    await expect(fetchRandomDogs()).rejects.toThrow(
      'The Dog API returned an unexpected response.',
    )
  })

  it('throws on a malformed response body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ message: 42, status: 'success' })),
    )
    await expect(fetchRandomDogs()).rejects.toThrow(
      'The Dog API returned an unexpected response.',
    )
  })

  it.each([0, 51, 1.5])('rejects an invalid count (%s)', async (count) => {
    await expect(fetchRandomDogs(count)).rejects.toThrow(
      'count must be an integer between 1 and 50.',
    )
  })

  it('aborts a hanging request after the timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(init.signal?.reason),
            )
          }),
      ),
    )

    const promise = fetchRandomDogs(1)
    const assertion = expect(promise).rejects.toMatchObject({
      name: 'TimeoutError',
    })
    await vi.advanceTimersByTimeAsync(10_000)
    await assertion
  })
})
