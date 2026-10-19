import { useCallback, useEffect, useMemo, useState } from 'react'
import { isStoredDogImage, type DogImage } from '../domain/dog'

const STORAGE_KEY = 'dog-viewer:favorites'

function load(): DogImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const favorites: DogImage[] = []
    const seen = new Set<string>()
    for (const item of parsed) {
      if (!isStoredDogImage(item) || seen.has(item.url)) continue
      seen.add(item.url)
      favorites.push(item)
    }
    return favorites
  } catch {
    return []
  }
}

function sameFavorites(a: DogImage[], b: DogImage[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (dog, index) =>
        dog.url === b[index]?.url && dog.breed === b[index]?.breed,
    )
  )
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

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return
      const next = load()
      setFavorites((current) => (sameFavorites(current, next) ? current : next))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const favoriteUrls = useMemo(
    () => new Set(favorites.map((dog) => dog.url)),
    [favorites],
  )

  const addFavorite = useCallback((dog: DogImage) => {
    setFavorites((prev) =>
      prev.some((f) => f.url === dog.url) ? prev : [...prev, dog],
    )
  }, [])

  const removeFavorite = useCallback((url: string) => {
    setFavorites((prev) => prev.filter((f) => f.url !== url))
  }, [])

  const isFavorite = useCallback(
    (url: string) => favoriteUrls.has(url),
    [favoriteUrls],
  )

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
