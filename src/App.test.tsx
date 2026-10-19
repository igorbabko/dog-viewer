import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const urls = Array.from({ length: 10 }, (_, i) => `https://images.dog.ceo/breeds/pug/n02110958_${i}.jpg`)

function mockSuccess() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: urls, status: 'success' }),
  }))
}

beforeEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('loads gallery, selects thumbnail, favorites and removes', async () => {
    mockSuccess()
    render(<App />)

    await waitFor(() => expect(screen.getByTestId('main-image')).toBeInTheDocument())
    expect(screen.getByText('10 random dogs')).toBeInTheDocument()

    // click second thumbnail -> main image changes
    const thumbs = screen.getAllByRole('button', { name: /show /i })
    fireEvent.click(thumbs[1])
    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', urls[1]),
    )

    // add to favorites
    fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }))
    expect(await screen.findByRole('button', { name: /show favorited pug/i })).toBeInTheDocument()

    // click favorite -> main image
    fireEvent.click(screen.getByRole('button', { name: /show favorited pug/i }))

    // remove favorite
    fireEvent.click(screen.getByRole('button', { name: /remove pug/i }))
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
  })

  it('shows error and retries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    render(<App />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    mockSuccess()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: urls, status: 'success' }),
    } as Response)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    await waitFor(() => expect(screen.getByTestId('main-image')).toBeInTheDocument())
  })
})
