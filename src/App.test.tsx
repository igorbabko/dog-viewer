import { StrictMode } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

function urls(set: number) {
  return Array.from(
    { length: 10 },
    (_, index) => `https://images.dog.ceo/breeds/pug/set${set}-${index}.jpg`,
  )
}

function jsonResponse(message: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ message, status: 'success' }),
  }
}

function galleryButtons() {
  return within(
    screen.getByRole('region', { name: 'Random dogs gallery' }),
  ).getAllByRole('button')
}

beforeEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('loads the gallery, selects thumbnails and manages favorites', async () => {
    const set = urls(1)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(set)))
    render(<App />)

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', set[0]),
    )
    expect(screen.getByText('10 random dogs')).toBeInTheDocument()

    const buttons = galleryButtons()
    fireEvent.click(buttons[1]!)
    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', set[1]),
    )

    fireEvent.click(screen.getByRole('button', { name: /^favorite$/i }))
    expect(
      await screen.findByRole('button', { name: /show favorited pug/i }),
    ).toBeInTheDocument()

    fireEvent.click(buttons[0]!)
    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', set[0]),
    )

    fireEvent.click(screen.getByRole('button', { name: /show favorited pug/i }))
    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', set[1]),
    )

    fireEvent.click(screen.getByRole('button', { name: /remove pug from favorites/i }))
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
  })

  it('toggles a favorite off from the main image', async () => {
    const set = urls(1)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(set)))
    render(<App />)

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toBeInTheDocument(),
    )

    fireEvent.click(screen.getByRole('button', { name: /^favorite$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^favorited$/i }))

    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
  })

  it('shows an error and retries', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /couldn't load dogs/i,
    )

    const set = urls(1)
    fetchMock.mockResolvedValueOnce(jsonResponse(set))
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', set[0]),
    )
  })

  it('shuffles to a new main image', async () => {
    const first = urls(1)
    const second = urls(2)
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(first))
      .mockResolvedValueOnce(jsonResponse(second))
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', first[0]),
    )

    fireEvent.click(screen.getByRole('button', { name: /shuffle dogs/i }))

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', second[0]),
    )
  })

  it('keeps stale content visible when a shuffle fails', async () => {
    const first = urls(1)
    const second = urls(2)
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse(first))
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', first[0]),
    )

    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    fireEvent.click(screen.getByRole('button', { name: /shuffle dogs/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByTestId('main-image')).toHaveAttribute('src', first[0])

    fetchMock.mockResolvedValueOnce(jsonResponse(second))
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', second[0]),
    )
  })

  it('shows a favorite selected while the API is failing', async () => {
    const favorite = {
      url: 'https://images.dog.ceo/breeds/beagle/fav.jpg',
      breed: 'Beagle',
    }
    localStorage.setItem('dog-viewer:favorites', JSON.stringify([favorite]))
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )
    render(<App />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /show favorited beagle/i }),
    )

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute(
        'src',
        favorite.url,
      ),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('keeps the main image inside the gallery under StrictMode', async () => {
    const first = urls(1)
    const second = urls(2)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce(jsonResponse(first)).mockResolvedValue(jsonResponse(second)),
    )
    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', second[0]),
    )
    const pressed = galleryButtons().filter(
      (button) => button.getAttribute('aria-pressed') === 'true',
    )
    expect(pressed).toHaveLength(1)
    expect(within(pressed[0]!).getByRole('img')).toHaveAttribute('src', second[0])
  })
})
