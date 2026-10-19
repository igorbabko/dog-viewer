# ADR-0002: Dog API and breed labels

- Status: accepted

## Context

The Dog API returns image URLs shaped like
`https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg`. The breed
information is only in the URL path. The path segment is not consistently
`<sub-breed>-<breed>`: `hound-afghan` is "Afghan Hound", but
`german-shepherd` is "German Shepherd", not "Shepherd German".

## Decision

Parse the breed from the URL path in `src/domain/dog.ts`. Keep a display-name
map for irregular segments (`german-shepherd`, `australian-shepherd`,
`ridgeback-rhodesian`, `stbernard`, ...) and fall back to a sub-breed-first
heuristic for the rest. Do not call a second API just for labels.

## Consequences

- No extra network round-trip per image.
- Irregular names are explicit and tested; new irregulars are a one-line map
  entry plus a test row.
- If the API changes its URL shape, only `parseBreed` changes.
