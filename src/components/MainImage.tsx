import type { DogImage } from '../domain/dog'

interface Props {
  dog: DogImage | null
  loading: boolean
  busy: boolean
  isFavorite: boolean
  onToggleFavorite: (dog: DogImage) => void
}

export function MainImage({
  dog,
  loading,
  busy,
  isFavorite,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <div
        role="status"
        data-testid="main-loading"
        className="flex h-96 items-center justify-center rounded-xl bg-gray-100"
      >
        <span className="sr-only">Loading dog…</span>
        <span
          aria-hidden="true"
          className="h-10 w-40 rounded bg-gray-200 motion-safe:animate-pulse"
        />
      </div>
    )
  }
  if (!dog) return null
  return (
    <section
      aria-label="Main dog image"
      aria-busy={busy}
      className="overflow-hidden rounded-xl border bg-white shadow-sm"
    >
      <img
        src={dog.url}
        alt={`${dog.breed} dog`}
        fetchPriority="high"
        decoding="async"
        className="h-96 w-full bg-gray-100 object-contain"
        data-testid="main-image"
      />
      <div className="flex items-center justify-between gap-4 p-4">
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-xl font-semibold capitalize"
          data-testid="main-breed"
        >
          {dog.breed}
        </p>
        <button
          type="button"
          onClick={() => onToggleFavorite(dog)}
          aria-pressed={isFavorite}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isFavorite ? (
            <>
              Favorited <span aria-hidden="true">♥</span>
            </>
          ) : (
            <>
              Favorite <span aria-hidden="true">♡</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}
