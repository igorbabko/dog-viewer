import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites'

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('adds, dedupes, removes, persists', () => {
    const { result } = renderHook(() => useFavorites())
    const dog = { url: 'u1', breed: 'Pug' }

    act(() => result.current.addFavorite(dog))
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite('u1')).toBe(true)

    act(() => result.current.addFavorite(dog))
    expect(result.current.favorites).toHaveLength(1)

    expect(JSON.parse(localStorage.getItem('dog-viewer:favorites')!)).toHaveLength(1)

    act(() => result.current.removeFavorite('u1'))
    expect(result.current.favorites).toHaveLength(0)
  })

  it('loads initial from storage', () => {
    localStorage.setItem(
      'dog-viewer:favorites',
      JSON.stringify([{ url: 'u2', breed: 'Beagle' }]),
    )
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toHaveLength(1)
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem('dog-viewer:favorites', 'not-json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })
})
