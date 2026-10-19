# ADR-0001: React + Vite + TypeScript + Tailwind

- Status: accepted

## Context

The exercise asks for an easily runnable, extensible frontend in a short
timebox, with follow-up features expected.

## Decision

Use Vite for dev/build, React for UI, TypeScript in `strict` mode for safety,
and Tailwind CSS v4 for styling. No global state library, router, or data
library: the app is one screen with one data source.

## Consequences

- Fast iteration and a small dependency surface.
- TypeScript catches whole classes of bugs; `noUncheckedIndexedAccess` keeps
  array access honest.
- If the app grows routing or caching needs, revisit with ADR-level decisions
  rather than pre-emptively adding libraries.
