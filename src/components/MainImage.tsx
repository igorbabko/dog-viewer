import type { DogImage } from '../api/dogs'

interface Props {
  dog: DogImage | null
  loading: boolean
  isFavorite: boolean
  onAddFavorite: (dog: DogImage) => void
}

export function MainImage({ dog, loading, isFavorite, onAddFavorite }: Props) {
  if (loading) {
    return (
      <div
        data-testid="main-loading"
        className="flex h-96 items-center justify-center rounded-xl bg-gray-100 animate-pulse"
      >
        <span className="text-gray-500">Loading…</span>
      </div>
    )
  }
  if (!dog) return null
  return (
    <section aria-label="Main dog image" className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <img
        src={dog.url}
        alt={`${dog.breed} dog`}
        className="h-96 w-full object-cover"
        data-testid="main-image"
      />
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="text-xl font-semibold capitalize" data-testid="main-breed">
          {dog.breed}
        </p>
        <button
          type="button"
          onClick={() => onAddFavorite(dog)}
          disabled={isFavorite}
          aria-label={isFavorite ? 'Already in favorites' : 'Add to favorites'}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFavorite ? 'Favorited ♥' : 'Favorite ♡'}
        </button>
      </div>
    </section>
  )
}
