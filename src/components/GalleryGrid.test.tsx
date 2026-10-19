import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GalleryGrid } from './GalleryGrid'

const dogs = [
  { url: 'https://example.com/u1.jpg', breed: 'Pug' },
  { url: 'https://example.com/u2.jpg', breed: 'Beagle' },
]

describe('GalleryGrid', () => {
  it('renders a derived heading and selects on click', () => {
    const onSelect = vi.fn()
    render(<GalleryGrid dogs={dogs} selectedUrl={null} onSelect={onSelect} />)
    expect(screen.getByRole('heading', { name: '2 random dogs' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /show pug/i }))
    expect(onSelect).toHaveBeenCalledWith(dogs[0])
  })

  it('marks the selected thumbnail with aria-pressed', () => {
    render(
      <GalleryGrid
        dogs={dogs}
        selectedUrl="https://example.com/u1.jpg"
        onSelect={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: /show pug/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('renders nothing when there are no dogs', () => {
    const { container } = render(
      <GalleryGrid dogs={[]} selectedUrl={null} onSelect={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('uses a singular heading for a single dog', () => {
    render(
      <GalleryGrid dogs={[dogs[0]!]} selectedUrl={null} onSelect={() => {}} />,
    )
    expect(
      screen.getByRole('heading', { name: '1 random dog' }),
    ).toBeInTheDocument()
  })
})
