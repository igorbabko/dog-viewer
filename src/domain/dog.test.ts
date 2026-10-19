import { describe, expect, it } from 'vitest'
import {
  isDogImage,
  isStoredDogImage,
  parseBreed,
  toDogImage,
} from './dog'

describe('parseBreed', () => {
  it('parses a sub-breed first', () => {
    expect(
      parseBreed('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg'),
    ).toBe('Afghan Hound')
  })

  it('parses a breed without a sub-breed', () => {
    expect(parseBreed('https://images.dog.ceo/breeds/pug/n02110958_123.jpg')).toBe(
      'Pug',
    )
  })

  it.each([
    ['german-shepherd', 'German Shepherd'],
    ['australian-shepherd', 'Australian Shepherd'],
    ['australian-kelpie', 'Australian Kelpie'],
    ['ridgeback-rhodesian', 'Rhodesian Ridgeback'],
    ['pointer-germanlonghair', 'German Longhaired Pointer'],
    ['bullterrier-staffordshire', 'Staffordshire Bull Terrier'],
    ['retriever-flatcoated', 'Flat-Coated Retriever'],
    ['corgi-pembroke', 'Pembroke Welsh Corgi'],
    ['mountain-bernese', 'Bernese Mountain Dog'],
    ['stbernard', 'St. Bernard'],
    ['mexicanhairless', 'Mexican Hairless'],
    ['cotondetulear', 'Coton de Tulear'],
    ['lhasa', 'Lhasa Apso'],
  ])('maps irregular breed segment %s to %s', (segment, expected) => {
    expect(parseBreed(`https://images.dog.ceo/breeds/${segment}/photo.jpg`)).toBe(
      expected,
    )
  })

  it('returns Unknown breed for a URL without a breed segment', () => {
    expect(parseBreed('https://example.com/dog.jpg')).toBe('Unknown breed')
  })
})

describe('toDogImage', () => {
  it('builds a DogImage', () => {
    const url = 'https://images.dog.ceo/breeds/pug/n02110958_1.jpg'
    expect(toDogImage(url)).toEqual({ url, breed: 'Pug' })
  })
})

describe('isDogImage / isStoredDogImage', () => {
  it('accepts a well-formed DogImage', () => {
    const dog = { url: 'https://images.dog.ceo/breeds/pug/1.jpg', breed: 'Pug' }
    expect(isDogImage(dog)).toBe(true)
    expect(isStoredDogImage(dog)).toBe(true)
  })

  it('rejects non-objects and missing fields', () => {
    expect(isDogImage(null)).toBe(false)
    expect(isDogImage('dog')).toBe(false)
    expect(isDogImage({ url: 'u', breed: 1 })).toBe(false)
  })

  it('rejects stored images with a non-https URL', () => {
    const dog = { url: 'javascript:alert(1)', breed: 'Pug' }
    expect(isDogImage(dog)).toBe(true)
    expect(isStoredDogImage(dog)).toBe(false)
  })

  it('rejects a stored image with an unparseable URL', () => {
    expect(isStoredDogImage({ url: 'not a url', breed: 'Pug' })).toBe(false)
  })
})
