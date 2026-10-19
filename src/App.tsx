import { useCallback } from 'react'
import type { DogImage } from './domain/dog'
import { FavoritesSidebar } from './components/FavoritesSidebar'
import { GalleryGrid } from './components/GalleryGrid'
import { MainImage } from './components/MainImage'
import { useDogs } from './hooks/useDogs'
import { useFavorites } from './hooks/useFavorites'

export default function App() {
  const { dogs, mainDog, loading, error, hasData, reload, selectMain } =
    useDogs()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const toggleFavorite = useCallback(
    (dog: DogImage) => {
      if (isFavorite(dog.url)) removeFavorite(dog.url)
      else addFavorite(dog)
    },
    [addFavorite, isFavorite, removeFavorite],
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold">
            <span aria-hidden="true">🐶</span> Dog Viewer
          </h1>
          <button
            type="button"
            onClick={reload}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Shuffle dogs
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        <div className="min-w-0 flex-1 space-y-6" aria-busy={loading}>
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="font-medium text-red-700">
                Couldn&apos;t load dogs: {error}
              </p>
              <button
                type="button"
                onClick={reload}
                className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {(mainDog || loading) && (
            <MainImage
              dog={mainDog}
              loading={loading && !mainDog}
              busy={loading && Boolean(mainDog)}
              isFavorite={mainDog ? isFavorite(mainDog.url) : false}
              onToggleFavorite={toggleFavorite}
            />
          )}

          {dogs.length > 0 && (
            <GalleryGrid
              dogs={dogs}
              selectedUrl={mainDog?.url ?? null}
              onSelect={selectMain}
            />
          )}

          {!loading && !error && !hasData && (
            <p className="rounded-xl border bg-white p-4 text-sm text-gray-500">
              No dogs to show yet.
            </p>
          )}
        </div>

        <div className="w-full md:w-80 md:shrink-0">
          <FavoritesSidebar
            favorites={favorites}
            onSelect={selectMain}
            onRemove={removeFavorite}
          />
        </div>
      </main>
    </div>
  )
}
