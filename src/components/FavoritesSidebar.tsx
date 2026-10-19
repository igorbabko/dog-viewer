import type { DogImage } from '../domain/dog'

interface Props {
  favorites: DogImage[]
  onSelect: (dog: DogImage) => void
  onRemove: (url: string) => void
}

export function FavoritesSidebar({ favorites, onSelect, onRemove }: Props) {
  const countLabel =
    favorites.length === 1 ? '1 favorite' : `${favorites.length} favorites`

  return (
    <aside
      aria-label="Favorites"
      className="rounded-xl border bg-white p-4 shadow-sm"
    >
      <h2 className="mb-3 text-lg font-semibold">
        Favorites ({favorites.length})
      </h2>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {countLabel}
      </p>
      {favorites.length === 0 ? (
        <p className="text-sm text-gray-500" data-testid="favorites-empty">
          No favorites yet. Click “Favorite” on the main image.
        </p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((dog) => (
            <li
              key={dog.url}
              className="flex items-center gap-2 rounded-lg border p-2 hover:bg-gray-50 focus-within:bg-gray-50"
            >
              <button
                type="button"
                onClick={() => onSelect(dog)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                aria-label={`Show favorited ${dog.breed}`}
              >
                <img
                  src={dog.url}
                  alt={`${dog.breed} favorite thumbnail`}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
                <span className="truncate text-sm font-medium capitalize">
                  {dog.breed}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(dog.url)}
                aria-label={`Remove ${dog.breed} from favorites`}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
