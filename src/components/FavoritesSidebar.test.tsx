import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FavoritesSidebar } from './FavoritesSidebar'

const fav = { url: 'https://example.com/u1.jpg', breed: 'Pug' }

describe('FavoritesSidebar', () => {
  it('shows the empty state', () => {
    render(
      <FavoritesSidebar favorites={[]} onSelect={() => {}} onRemove={() => {}} />,
    )
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
    expect(screen.getByText('0 favorites')).toBeInTheDocument()
  })

  it('selects and removes items', () => {
    const onSelect = vi.fn()
    const onRemove = vi.fn()
    render(
      <FavoritesSidebar
        favorites={[fav]}
        onSelect={onSelect}
        onRemove={onRemove}
      />,
    )
    expect(screen.getByText('1 favorite')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /show favorited pug/i }))
    expect(onSelect).toHaveBeenCalledWith(fav)

    fireEvent.click(screen.getByRole('button', { name: /remove pug/i }))
    expect(onRemove).toHaveBeenCalledWith(fav.url)
  })
})
