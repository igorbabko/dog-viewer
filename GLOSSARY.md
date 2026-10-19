# Glossary

Domain language for Dog Viewer. Use these terms in code, tests, issues, and
ADRs.

- **Dog** — one dog image plus its breed label. Represented by `DogImage`
  (`{ url, breed }`).
- **Breed** — the human-readable breed name derived from the Dog API image URL
  (`parseBreed`). The API encodes the breed path segment; irregular names are
  normalised through a display-name map.
- **Main image** — the single dog currently displayed at the top of the app.
  Changing it does not change the gallery.
- **Gallery** — the set of 10 random dogs shown as thumbnails below the main
  image.
- **Favorite** — a dog the user has saved. Favorites are deduped by URL,
  persisted in `localStorage`, and shown in the favorites sidebar.
- **Shuffle** — request a fresh gallery and a fresh main image.
- **Stale response** — a request that resolves after a newer request has
  started. Stale responses are ignored.
