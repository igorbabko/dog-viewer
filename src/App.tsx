import { useCallback, useEffect, useState } from 'react'
import { fetchRandomDogs, type DogImage } from './api/dogs'
import { FavoritesSidebar } from './components/FavoritesSidebar'
import { GalleryGrid } from './components/GalleryGrid'
import { MainImage } from './components/MainImage'
import { useFavorites } from './hooks/useFavorites'

export default function App() {
  const [gallery, setGallery] = useState<DogImage[]>([])
  const [mainDog, setMainDog] = useState<DogImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const dogs = await fetchRandomDogs(10)
      setGallery(dogs)
      setMainDog((prev) => prev ?? dogs[0] ?? null)
      if (!dogs[0]) setError('No dogs found.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dogs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">🐶 Dog Viewer</h1>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
          >
            Shuffle dogs
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">Something went wrong: {error}</p>
              <button
                type="button"
                onClick={load}
                className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <MainImage
              dog={mainDog}
              loading={loading}
              isFavorite={mainDog ? isFavorite(mainDog.url) : false}
              onAddFavorite={addFavorite}
            />
          )}
          {!error && (
            <GalleryGrid
              dogs={gallery}
              selectedUrl={mainDog?.url ?? null}
              onSelect={setMainDog}
            />
          )}
        </div>
        <div className="w-full md:w-80 md:shrink-0">
          <FavoritesSidebar
            favorites={favorites}
            onSelect={setMainDog}
            onRemove={removeFavorite}
          />
        </div>
      </main>
    </div>
  )
}
