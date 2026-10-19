import type { DogImage } from '../domain/dog'

interface Props {
  dogs: DogImage[]
  selectedUrl: string | null
  onSelect: (dog: DogImage) => void
}

export function GalleryGrid({ dogs, selectedUrl, onSelect }: Props) {
  if (dogs.length === 0) return null

  const heading = dogs.length === 1 ? '1 random dog' : `${dogs.length} random dogs`

  return (
    <section aria-label="Random dogs gallery">
      <h2 className="mb-2 text-lg font-semibold">{heading}</h2>
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
              className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:shadow-md focus-visible:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
                selected ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              <img
                src={dog.url}
                alt={`${dog.breed} dog thumbnail`}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
              />
              <span className="block truncate px-2 py-1 text-xs font-medium capitalize text-gray-700">
                {dog.breed}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
