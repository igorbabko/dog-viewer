import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from './useFavorites'

const KEY = 'dog-viewer:favorites'
const dog = { url: 'https://images.dog.ceo/breeds/pug/1.jpg', breed: 'Pug' }

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('adds, dedupes, removes and persists', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.addFavorite(dog))
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite(dog.url)).toBe(true)

    act(() => result.current.addFavorite(dog))
    expect(result.current.favorites).toHaveLength(1)

    expect(JSON.parse(localStorage.getItem(KEY)!)).toHaveLength(1)

    act(() => result.current.removeFavorite(dog.url))
    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite(dog.url)).toBe(false)
  })

  it('loads initial favorites from storage', () => {
    localStorage.setItem(KEY, JSON.stringify([dog]))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toHaveLength(1)
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem(KEY, 'not-json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('ignores invalid entries and duplicate URLs', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { url: 'javascript:alert(1)', breed: 'Pug' },
        { url: 42, breed: 'Beagle' },
        dog,
        dog,
      ]),
    )
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([dog])
  })

  it('syncs favorites from another tab', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      localStorage.setItem(KEY, JSON.stringify([dog]))
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: KEY,
          newValue: localStorage.getItem(KEY),
        }),
      )
    })
    expect(result.current.favorites).toEqual([dog])
  })

  it('does not update state when storage matches current favorites', () => {
    localStorage.setItem(KEY, JSON.stringify([dog]))
    const { result } = renderHook(() => useFavorites())

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: KEY,
          newValue: localStorage.getItem(KEY),
        }),
      )
    })

    expect(result.current.favorites).toEqual([dog])
  })

  it('keeps working when storage writes fail', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.addFavorite(dog))
    expect(result.current.favorites).toEqual([dog])
    spy.mockRestore()
  })
})
