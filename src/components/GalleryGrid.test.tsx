import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GalleryGrid } from './GalleryGrid'

const dogs = [
  { url: 'u1', breed: 'Pug' },
  { url: 'u2', breed: 'Beagle' },
]

describe('GalleryGrid', () => {
  it('renders thumbnails and selects on click', () => {
    const onSelect = vi.fn()
    render(<GalleryGrid dogs={dogs} selectedUrl={null} onSelect={onSelect} />)
    expect(screen.getByText('Pug')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /show pug/i }))
    expect(onSelect).toHaveBeenCalledWith(dogs[0])
  })

  it('marks selected with aria-pressed', () => {
    render(<GalleryGrid dogs={dogs} selectedUrl="u1" onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /show pug/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
