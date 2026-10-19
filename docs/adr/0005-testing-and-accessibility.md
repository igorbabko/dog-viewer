# ADR-0005: Testing and accessibility strategy

- Status: accepted

## Context

The exercise is reviewed by engineers, so the test suite and accessibility
choices are part of the deliverable.

## Decision

- Unit-test pure domain logic and the API transport with Vitest.
- Test hooks with `renderHook` and components with React Testing Library,
  querying by role/label first.
- Test the user-facing flows end to end in `src/App.test.tsx`, including a
  StrictMode render and a failed-shuffle case.
- Enforce coverage thresholds in `vite.config.ts`.
- Treat accessibility as testable behaviour: announced loading and count
  changes, `aria-pressed` on the favorite toggle, `aria-busy` on the main
  image, visible focus, and reduced-motion variants.
- Run lint, typecheck, tests, coverage, and build in CI.

## Consequences

- Regressions in behaviour, not just implementation, fail the build.
- Some visual properties (hover zoom, focus rings) rely on class assertions and
  a manual Lighthouse/axe pass rather than unit tests.
