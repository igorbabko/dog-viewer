# Spec: Dog Viewer

Source: the one-hour interview exercise (`task.pdf`). This spec turns the
exercise brief into verifiable acceptance criteria and records the deliberate
non-goals so later features have a baseline to extend.

## Goal

A single-page app that displays random dog images from the Dog API and lets the
user curate a persistent favorites list.

## Part 1 — General display

- **P1.1** On first load, the app shows one random dog image as the main image.
- **P1.2** The main image is labelled with its breed.
- **P1.3** Below the main image, the app shows 10 random dog thumbnails, each
  labelled with its breed.
- **P1.4** Selecting a thumbnail promotes it to the main image.
- **P1.5** Hovering a thumbnail increases it slightly with a smooth transition.
- **P1.6** Breed labels are human-readable (for example `german-shepherd` must
  render as "German Shepherd", not "Shepherd German").

## Part 2 — Favorites

- **P2.1** A favorites control adds the current main dog to a list on the right.
- **P2.2** Adding a dog that is already favorited is a no-op (deduped by URL).
- **P2.3** Favorites persist across reloads via `localStorage`.
- **P2.4** Selecting a favorite shows that image and breed as the main image.
- **P2.5** Each favorite has a control that removes it from the list.
- **P2.6** Favorites that change in another tab are reflected in this tab.

## Cross-cutting

- **X.1 Loading** A loading state is announced to assistive technology.
- **X.2 Errors** A failed request shows a recoverable error and keeps any
  previously loaded content visible.
- **X.3 Retry** The user can retry after a failure.
- **X.4 Shuffle** The user can request a fresh set; the main image always comes
  from the current set.
- **X.5 Keyboard** Every interactive element is reachable and operable by
  keyboard with visible focus.
- **X.6 Motion** Animations respect `prefers-reduced-motion`.
- **X.7 Performance** The main image is prioritised, thumbnails are lazy-loaded,
  and external origins are preconnected.
- **X.8 Reliability** Concurrent or rapid requests cannot leave the main image
  out of sync with the gallery (no stale responses).

## Non-goals

Authentication, a backend, search or filtering, routing, infinite scroll, and
server-side rendering. The app stays a client-only SPA.

## Extension notes

The brief notes that follow-up interviews may add features. Likely next steps
and where they land:

- Breed filter/search → `useDogs` gains query state; `api/dogs.ts` adds
  endpoints.
- Pagination / load more → `useDogs` state machine grows a page cursor.
- Voting or ratings → a new domain type plus a hook, alongside favorites.
- Shareable deep links → routing plus a URL-backed selection.
- Smaller thumbnails → an image proxy or `srcset`; see ADR-0002.

## Acceptance test map

| Criterion | Where it is covered |
| --- | --- |
| P1.1–P1.4, P1.6 | `src/App.test.tsx`, `src/domain/dog.test.ts` |
| P1.5 | CSS classes in `src/components/GalleryGrid.tsx` |
| P2.1–P2.5 | `src/App.test.tsx`, `src/hooks/useFavorites.test.ts` |
| P2.6 | `src/hooks/useFavorites.test.ts` |
| X.1–X.4, X.8 | `src/App.test.tsx`, `src/hooks/useDogs.test.ts` |
| X.5–X.7 | `src/components/*.test.tsx` plus manual Lighthouse/axe pass |
