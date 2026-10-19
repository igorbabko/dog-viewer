import type { DogImage } from '../api/dogs'

interface Props {
  dogs: DogImage[]
  selectedUrl: string | null
  onSelect: (dog: DogImage) => void
}

export function GalleryGrid({ dogs, selectedUrl, onSelect }: Props) {
  return (
    <section aria-label="Random dogs gallery">
      <h2 className="mb-2 text-lg font-semibold">10 random dogs</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {dogs.map((dog) => {
          const selected = dog.url === selectedUrl
          return (
            <button
              key={dog.url}
              type="button"
              onClick={() => onSelect(dog)}
              aria-label={`Show ${dog.breed}`}
              aria-pressed={selected}
              className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:shadow-md ${
                selected ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              <img
                src={dog.url}
                alt={`${dog.breed} dog thumbnail`}
                loading="lazy"
                className="h-28 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
              />
              <p className="truncate px-2 py-1 text-xs font-medium capitalize text-gray-700">
                {dog.breed}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
