import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDogs } from './useDogs'

function urls(set: number) {
  return Array.from({ length: 10 }, (_, index) => ({
    url: `https://images.dog.ceo/breeds/pug/set${set}-${index}.jpg`,
    breed: 'Pug',
  }))
}

function jsonResponse(message: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ message, status: 'success' }),
  }
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('useDogs', () => {
  it('loads dogs and selects the first as the main image', async () => {
    const dogs = urls(1)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(dogs.map((d) => d.url))))

    const { result } = renderHook(() => useDogs())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.dogs).toEqual(dogs)
    expect(result.current.mainDog).toEqual(dogs[0])
  })

  it('exposes an error when the response is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])))

    const { result } = renderHook(() => useDogs())

    await waitFor(() =>
      expect(result.current.error).toMatch(/No dogs found/),
    )
    expect(result.current.loading).toBe(false)
  })

  it('preserves existing data when a reload fails', async () => {
    const dogs = urls(1)
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(dogs.map((d) => d.url)))
        .mockRejectedValueOnce(new TypeError('Failed to fetch')),
    )

    const { result } = renderHook(() => useDogs())
    await waitFor(() => expect(result.current.dogs).toEqual(dogs))

    act(() => result.current.reload())

    await waitFor(() =>
      expect(result.current.error).toMatch(/Could not reach the Dog API/),
    )
    expect(result.current.dogs).toEqual(dogs)
    expect(result.current.mainDog).toEqual(dogs[0])
  })

  it('resets the main image on reload', async () => {
    const first = urls(1)
    const second = urls(2)
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(first.map((d) => d.url)))
        .mockResolvedValueOnce(jsonResponse(second.map((d) => d.url))),
    )

    const { result } = renderHook(() => useDogs())
    await waitFor(() => expect(result.current.dogs).toEqual(first))

    const target = first[1]
    if (!target) throw new Error('expected a second dog')
    act(() => result.current.selectMain(target))
    expect(result.current.mainDog).toEqual(target)

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.dogs).toEqual(second))
    expect(result.current.mainDog).toEqual(second[0])
  })

  it('keeps a main image selected while a load is in flight', async () => {
    let resolveFetch: ((value: unknown) => void) | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      ),
    )

    const { result } = renderHook(() => useDogs())
    const favorite = {
      url: 'https://images.dog.ceo/breeds/beagle/fav.jpg',
      breed: 'Beagle',
    }
    act(() => result.current.selectMain(favorite))

    const dogs = urls(1)
    await act(async () => {
      resolveFetch?.(jsonResponse(dogs.map((d) => d.url)))
    })

    await waitFor(() => expect(result.current.dogs).toEqual(dogs))
    expect(result.current.mainDog).toEqual(favorite)
  })

  it('ignores a stale response from an aborted request', async () => {
    let resolveStale: ((value: unknown) => void) | undefined
    const stale = new Promise((resolve) => {
      resolveStale = resolve
    })
    const second = urls(2)

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementationOnce(() => stale)
        .mockResolvedValueOnce(jsonResponse(second.map((d) => d.url))),
    )

    const { result } = renderHook(() => useDogs())
    act(() => result.current.reload())

    await waitFor(() => expect(result.current.dogs).toEqual(second))

    resolveStale?.(jsonResponse(urls(1).map((d) => d.url)))
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.dogs).toEqual(second)
  })

  it('reports a friendly message when the request times out', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('too slow', 'TimeoutError')),
    )

    const { result } = renderHook(() => useDogs())

    await waitFor(() =>
      expect(result.current.error).toBe(
        'The request timed out. Please try again.',
      ),
    )
  })

  it('surfaces an Error message from the transport', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('The Dog API responded with 500.')),
    )

    const { result } = renderHook(() => useDogs())

    await waitFor(() =>
      expect(result.current.error).toBe('The Dog API responded with 500.'),
    )
  })

  it('falls back to a generic message for an unknown failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('boom'))

    const { result } = renderHook(() => useDogs())

    await waitFor(() =>
      expect(result.current.error).toBe(
        'Failed to load dogs. Please try again.',
      ),
    )
  })

  it('ignores an aborted request that rejects', async () => {
    let rejectStale: ((reason?: unknown) => void) | undefined
    const stale = new Promise((_resolve, reject) => {
      rejectStale = reject
    })
    const second = urls(2)

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementationOnce(() => stale)
        .mockResolvedValueOnce(jsonResponse(second.map((d) => d.url))),
    )

    const { result } = renderHook(() => useDogs())
    act(() => result.current.reload())

    await waitFor(() => expect(result.current.dogs).toEqual(second))

    rejectStale?.(new DOMException('aborted', 'AbortError'))
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.error).toBeNull()
  })
})
