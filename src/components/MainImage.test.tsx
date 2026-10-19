import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MainImage } from './MainImage'

const dog = { url: 'https://example.com/pug.jpg', breed: 'Pug' }

describe('MainImage', () => {
  it('shows loading state', () => {
    render(<MainImage dog={null} loading isFavorite={false} onAddFavorite={() => {}} />)
    expect(screen.getByTestId('main-loading')).toBeInTheDocument()
  })

  it('renders image + breed + favorite button', () => {
    const onFav = vi.fn()
    render(<MainImage dog={dog} loading={false} isFavorite={false} onAddFavorite={onFav} />)
    expect(screen.getByTestId('main-image')).toHaveAttribute('src', dog.url)
    expect(screen.getByTestId('main-breed')).toHaveTextContent('Pug')
    fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }))
    expect(onFav).toHaveBeenCalledWith(dog)
  })

  it('disables button when favorited', () => {
    render(<MainImage dog={dog} loading={false} isFavorite onAddFavorite={() => {}} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
