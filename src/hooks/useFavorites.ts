import { useCallback, useEffect, useState } from 'react'
import type { DogImage } from '../api/dogs'

const STORAGE_KEY = 'dog-viewer:favorites'

function load(): DogImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (d): d is DogImage =>
        typeof d === 'object' && d !== null && typeof d.url === 'string' && typeof d.breed === 'string',
    )
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<DogImage[]>(() => load())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage unavailable — ignore
    }
  }, [favorites])

  const addFavorite = useCallback((dog: DogImage) => {
    setFavorites((prev) =>
      prev.some((f) => f.url === dog.url) ? prev : [...prev, dog],
    )
  }, [])

  const removeFavorite = useCallback((url: string) => {
    setFavorites((prev) => prev.filter((f) => f.url !== url))
  }, [])

  const isFavorite = useCallback(
    (url: string) => favorites.some((f) => f.url === url),
    [favorites],
  )

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
