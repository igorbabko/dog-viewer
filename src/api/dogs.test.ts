import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fetchRandomDog, fetchRandomDogs, parseBreed, toDogImage } from './dogs'

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('parseBreed', () => {
  it('parses simple breed', () => {
    expect(parseBreed('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg')).toBe(
      'Afghan Hound',
    )
  })
  it('parses breed without sub-breed', () => {
    expect(parseBreed('https://images.dog.ceo/breeds/pug/n02110958_123.jpg')).toBe('Pug')
  })
  it('returns Unknown breed for bad url', () => {
    expect(parseBreed('https://example.com/dog.jpg')).toBe('Unknown breed')
  })
})

describe('toDogImage', () => {
  it('builds DogImage', () => {
    const url = 'https://images.dog.ceo/breeds/pug/n02110958_1.jpg'
    expect(toDogImage(url)).toEqual({ url, breed: 'Pug' })
  })
})

describe('fetchRandomDog(s)', () => {
  it('fetches one dog', async () => {
    const url = 'https://images.dog.ceo/breeds/pug/n02110958_1.jpg'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: url, status: 'success' }),
    }))
    await expect(fetchRandomDog()).resolves.toEqual({ url, breed: 'Pug' })
  })

  it('fetches 10 dogs', async () => {
    const msgs = ['https://images.dog.ceo/breeds/pug/n02110958_1.jpg']
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: msgs, status: 'success' }),
    }))
    const dogs = await fetchRandomDogs(1)
    expect(dogs).toHaveLength(1)
    expect(dogs[0].breed).toBe('Pug')
  })

  it('throws on http error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(fetchRandomDog()).rejects.toThrow('Request failed: 500')
  })

  it('throws on api error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'x', status: 'error' }),
    }))
    await expect(fetchRandomDog()).rejects.toThrow()
  })
})
