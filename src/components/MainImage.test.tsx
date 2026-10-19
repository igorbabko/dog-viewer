import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MainImage } from './MainImage'

const dog = { url: 'https://example.com/pug.jpg', breed: 'Pug' }

describe('MainImage', () => {
  it('announces the loading state', () => {
    render(
      <MainImage
        dog={null}
        loading
        busy={false}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />,
    )
    expect(screen.getByTestId('main-loading')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading dog')
  })

  it('renders the image, breed and favorite toggle', () => {
    const onToggle = vi.fn()
    render(
      <MainImage
        dog={dog}
        loading={false}
        busy={false}
        isFavorite={false}
        onToggleFavorite={onToggle}
      />,
    )
    expect(screen.getByTestId('main-image')).toHaveAttribute('src', dog.url)
    expect(screen.getByTestId('main-image')).toHaveAttribute('decoding', 'async')
    expect(screen.getByTestId('main-image')).toHaveClass('object-contain')
    expect(screen.getByTestId('main-breed')).toHaveTextContent('Pug')

    const button = screen.getByRole('button', { name: /favorite/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(button)
    expect(onToggle).toHaveBeenCalledWith(dog)
  })

  it('reflects the favorited state with aria-pressed', () => {
    render(
      <MainImage
        dog={dog}
        loading={false}
        busy={false}
        isFavorite
        onToggleFavorite={() => {}}
      />,
    )
    const button = screen.getByRole('button', { name: /favorited/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks the section busy while updating with stale data', () => {
    render(
      <MainImage
        dog={dog}
        loading={false}
        busy
        isFavorite={false}
        onToggleFavorite={() => {}}
      />,
    )
    expect(screen.getByRole('region', { name: 'Main dog image' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  })
})
