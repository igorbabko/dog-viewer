# ADR-0004: Data loading and state model

- Status: accepted

## Context

The gallery and main image come from a random API. Rapid Shuffle clicks,
React StrictMode's double-invoked effects, and slow/failed requests can leave
the main image out of sync with the gallery. An API error must not blank out
content the user can still interact with.

## Decision

Own loading in a `useDogs` hook with a discriminated state
(`loading | success | error`) and a reducer. Every request:

- aborts the previous request through an `AbortController`,
- times out after 10 seconds,
- ignores its own result once aborted,
- resets the main image to the first dog of the new set, unless the user
  changed the selection while the request was in flight.

Errors are surfaced as a banner while existing data stays mounted. Selecting a
favorite clears the error and shows that dog.

## Consequences

- No stale responses can win.
- The "main image is not in the gallery" class of bug is structurally prevented.
- The state machine is the seam for pagination and filters later.
