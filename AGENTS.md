# AGENTS.md

Guidance for agents and humans working in this repo.

## Project

Dog Viewer is a single-page React + TypeScript app that shows random dog images
from the [Dog API](https://dog.ceo/dog-api/documentation) and lets users save
favorites to `localStorage`.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck and produce a production build in `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — oxlint, warnings treated as errors
- `npm run typecheck` — `tsc -b` across all projects
- `npm test` — run the Vitest suite once
- `npm run test:watch` — Vitest watch mode
- `npm run coverage` — Vitest with v8 coverage and thresholds

Requires Node 22+ (see `.nvmrc`).

## Architecture

```
src/
  domain/dog.ts            DogImage, parseBreed, runtime validation
  api/dogs.ts              Dog API transport (timeout, abort, shape validation)
  hooks/useDogs.ts         Gallery/main-image state machine + loading lifecycle
  hooks/useFavorites.ts    Favorites state, localStorage persistence, cross-tab sync
  components/
    MainImage.tsx          Main image, breed label, favorite toggle
    GalleryGrid.tsx        Thumbnail grid
    FavoritesSidebar.tsx   Favorites list
  App.tsx                  Composition only
```

- `src/domain` owns vocabulary and pure logic. It has no React or network code.
- `src/api` is transport-only: it returns domain values and owns timeout/abort.
- Hooks own stateful behaviour. Components are presentational and receive data
  and callbacks via props.
- `App.tsx` wires hooks to components; keep it free of business logic.

## Conventions

- TypeScript is `strict` (including `noUncheckedIndexedAccess`). No `any`.
- Prefer domain types over primitives (e.g. `DogImage` over parallel strings).
- Styling is Tailwind utilities. `src/index.css` only imports Tailwind.
- Tests use Vitest + React Testing Library. Query by role or label first; use
  `data-testid` only when no accessible query fits. Test observable behaviour.
- Accessibility is part of the definition of done: keyboard reachability,
  visible focus, announced dynamic updates, and `prefers-reduced-motion`.
- Performance: lazy-load below-the-fold images, give the LCP image priority,
  preconnect to external origins, and avoid memoisation until it is measured.

## Workflow

- Specs: `docs/specs/`. Glossary: `GLOSSARY.md`. Decisions: `docs/adr/`.
- Issue tracker: GitHub issues via `gh` — see `docs/agents/issue-tracker.md`.
- Definition of done: `npm run lint`, `npm run typecheck`, `npm test`,
  `npm run build` and `npm run coverage` all pass, docs are updated, and UI
  changes have been checked for accessibility and performance regressions.

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues, managed with the `gh` CLI. See
`docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage labels (`needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`). See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context: a root `GLOSSARY.md` and `docs/adr/`. See
`docs/agents/domain.md`.
