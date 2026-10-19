# 🐶 Dog Viewer

React + TypeScript + Vite + Tailwind CSS v4 app displaying random dog images from the [Dog API](https://dog.ceo/dog-api/documentation).

## Features

**Part 1 — General display**
- Random dog image on top, labeled by breed (breed parsed from image URL)
- 10 random dog thumbnails below; click a thumbnail to show it as the main image
- Smooth hover zoom on thumbnails (`group-hover:scale-105 transition-transform`)

**Part 2 — Favorites**
- "Favorite" button adds the main image to a favorites sidebar (right side, deduped)
- Favorites persist in `localStorage`
- Click a favorite to show it as the main image; ✕ button removes it

Plus: loading / error / retry states, Shuffle button, responsive layout, accessible labels.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest + React Testing Library (20 tests)
npm run coverage # coverage report (~99%)
npm run build    # production build -> dist/
npm run preview  # preview the build
```

Requires Node 18+ and internet access (Dog API).

## Structure

```
src/
  api/dogs.ts              # Dog API client + parseBreed + toDogImage
  hooks/useFavorites.ts    # favorites state + localStorage sync
  components/
    MainImage.tsx
    GalleryGrid.tsx
    FavoritesSidebar.tsx
  App.tsx                  # layout + data loading
```

## Publish to GitHub

```bash
git init && git add -A && git commit -m "Dog Viewer"
gh repo create dog-viewer --public --source=. --push
```
