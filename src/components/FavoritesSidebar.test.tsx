import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FavoritesSidebar } from './FavoritesSidebar'

describe('FavoritesSidebar', () => {
  it('shows empty state', () => {
    render(<FavoritesSidebar favorites={[]} onSelect={() => {}} onRemove={() => {}} />)
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
  })

  it('selects and removes items', () => {
    const onSelect = vi.fn()
    const onRemove = vi.fn()
    const favs = [{ url: 'u1', breed: 'Pug' }]
    render(<FavoritesSidebar favorites={favs} onSelect={onSelect} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /show favorited pug/i }))
    expect(onSelect).toHaveBeenCalledWith(favs[0])
    fireEvent.click(screen.getByRole('button', { name: /remove pug/i }))
    expect(onRemove).toHaveBeenCalledWith('u1')
  })
})
