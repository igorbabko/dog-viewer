# ADR-0003: Favorites in localStorage

- Status: accepted

## Context

Favorites must persist across reloads and there is no backend. Favorites may
also change in another browser tab.

## Decision

Persist favorites under the namespaced key `dog-viewer:favorites` as a JSON
array of `DogImage`. Validate every stored entry with `isStoredDogImage`, which
requires string `url`/`breed` fields and an `https:` URL. Dedupe by URL on load.
Listen for the `storage` event to mirror changes from other tabs.

## Consequences

- No server, no account, instant reads/writes.
- Tampered or legacy storage cannot inject non-https image sources.
- Schema changes will need a migration or versioned envelope; add one when the
  shape actually changes.
