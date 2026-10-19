export interface DogImage {
  url: string
  breed: string
}

const API_BASE = 'https://dog.ceo/api'

/** Parse breed from a Dog API image URL, e.g. .../breeds/hound-afghan/n020...jpg -> "Afghan Hound". */
export function parseBreed(imageUrl: string): string {
  try {
    const match = imageUrl.match(/\/breeds\/([^/]+)\//)
    if (!match) return 'Unknown breed'
    const raw = match[1] // e.g. "hound-afghan"
    const parts = raw.split('-')
    // Dog API format is <breed>-<subbreed>; display sub-breed first.
    const words = parts.length > 1 ? [...parts.slice(1), parts[0]] : parts
    return words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  } catch {
    return 'Unknown breed'
  }
}

export function toDogImage(url: string): DogImage {
  return { url, breed: parseBreed(url) }
}

async function fetchJson(url: string): Promise<{ message: string | string[]; status: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  const data = await res.json()
  if (data.status !== 'success') throw new Error('Dog API returned an error')
  return data
}

export async function fetchRandomDog(): Promise<DogImage> {
  const data = await fetchJson(`${API_BASE}/breeds/image/random`)
  return toDogImage(data.message as string)
}

export async function fetchRandomDogs(count = 10): Promise<DogImage[]> {
  const data = await fetchJson(`${API_BASE}/breeds/image/random/${count}`)
  return (data.message as string[]).map(toDogImage)
}
