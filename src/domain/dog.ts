export interface DogImage {
  url: string
  breed: string
}

const BREED_DISPLAY_NAMES: Record<string, string> = {
  'african-wild': 'African Wild Dog',
  'australian-kelpie': 'Australian Kelpie',
  'australian-shepherd': 'Australian Shepherd',
  'bulldog-boston': 'Boston Terrier',
  'bullterrier-staffordshire': 'Staffordshire Bull Terrier',
  'cattledog-australian': 'Australian Cattle Dog',
  'corgi-cardigan': 'Cardigan Welsh Corgi',
  'corgi-pembroke': 'Pembroke Welsh Corgi',
  'cotondetulear': 'Coton de Tulear',
  'danishswedish-farmdog': 'Danish-Swedish Farmdog',
  'finnish-lapphund': 'Finnish Lapphund',
  'german-shepherd': 'German Shepherd',
  'hound-blood': 'Bloodhound',
  'hound-english': 'English Foxhound',
  'hound-walker': 'Treeing Walker Coonhound',
  'lhasa': 'Lhasa Apso',
  'mastiff-bull': 'Bullmastiff',
  'mexicanhairless': 'Mexican Hairless',
  'mountain-bernese': 'Bernese Mountain Dog',
  'mountain-swiss': 'Swiss Mountain Dog',
  'pariah-indian': 'Indian Pariah Dog',
  'pekinese': 'Pekingese',
  'pointer-german': 'German Shorthaired Pointer',
  'pointer-germanlonghair': 'German Longhaired Pointer',
  'retriever-chesapeake': 'Chesapeake Bay Retriever',
  'retriever-curly': 'Curly-Coated Retriever',
  'retriever-flatcoated': 'Flat-Coated Retriever',
  'ridgeback-rhodesian': 'Rhodesian Ridgeback',
  'shihtzu': 'Shih Tzu',
  'spaniel-irish': 'Irish Water Spaniel',
  'spaniel-welsh': 'Welsh Springer Spaniel',
  'springer-english': 'English Springer Spaniel',
  'stbernard': 'St. Bernard',
  'terrier-dandie': 'Dandie Dinmont Terrier',
  'terrier-kerryblue': 'Kerry Blue Terrier',
  'terrier-westhighland': 'West Highland White Terrier',
  'terrier-wheaten': 'Soft Coated Wheaten Terrier',
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function parseBreed(imageUrl: string): string {
  const match = imageUrl.match(/\/breeds\/([^/]+)\//)
  const segment = match?.[1]
  if (!segment) return 'Unknown breed'

  const displayName = BREED_DISPLAY_NAMES[segment]
  if (displayName) return displayName

  const parts = segment.split('-')
  const [first, ...rest] = parts
  if (!first) return 'Unknown breed'

  const words = rest.length > 0 ? [...rest, first] : [first]
  return words.map(capitalize).join(' ')
}

export function toDogImage(url: string): DogImage {
  return { url, breed: parseBreed(url) }
}

export function isDogImage(value: unknown): value is DogImage {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as { url?: unknown; breed?: unknown }
  return typeof candidate.url === 'string' && typeof candidate.breed === 'string'
}

export function isStoredDogImage(value: unknown): value is DogImage {
  return isDogImage(value) && isHttpsUrl(value.url)
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}
