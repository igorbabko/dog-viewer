# Backlog

Follow-ups that are real but out of scope for the one-hour exercise. Each item
is written so it can become a GitHub issue with acceptance criteria.

## Correctness / robustness

- Add a retry with capped exponential backoff for transient API failures.
- Add an error boundary around the main content so a render error does not
  blank the whole app.

## Performance

- Serve resized thumbnails through an image proxy (or `srcset`) instead of
  downloading full-size originals.
- Cache the breed list if the app starts filtering by breed.
- Add a Lighthouse budget check to CI once a preview URL exists.

## Accessibility

- Run axe (for example `vitest-axe`) on the rendered App and fail on
  violations.
- Add a skip link if the page grows a second landmark region.
- Add an automated contrast check to the design-token set.

## Testing

- Add Playwright smoke tests for the two spec parts against a preview build.
- Add a visual regression snapshot for the main layout.

## Product

- Breed filter/search.
- Pagination or "load more" for the gallery.
- Shareable deep links for a selected dog.
- Dark mode via `prefers-color-scheme`.
