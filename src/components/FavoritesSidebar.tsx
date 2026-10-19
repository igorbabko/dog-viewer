import type { DogImage } from '../api/dogs'

interface Props {
  favorites: DogImage[]
  onSelect: (dog: DogImage) => void
  onRemove: (url: string) => void
}

export function FavoritesSidebar({ favorites, onSelect, onRemove }: Props) {
  return (
    <aside aria-label="Favorites" className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Favorites ({favorites.length})</h2>
      {favorites.length === 0 ? (
        <p className="text-sm text-gray-500" data-testid="favorites-empty">
          No favorites yet. Click “Favorite” on the main image.
        </p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((dog) => (
            <li
              key={dog.url}
              className="flex items-center gap-2 rounded-lg border p-2 hover:bg-gray-50"
            >
              <button
                type="button"
                onClick={() => onSelect(dog)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                aria-label={`Show favorited ${dog.breed}`}
              >
                <img
                  src={dog.url}
                  alt={`${dog.breed} favorite thumbnail`}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
                <span className="truncate text-sm font-medium capitalize">{dog.breed}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(dog.url)}
                aria-label={`Remove ${dog.breed} from favorites`}
                className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
