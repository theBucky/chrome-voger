# Repository agent guide

## Workflow

- Read code and docs relevant to the change; expand only to resolve dependencies or uncertainty.
- Complete the requested outcome, not just a first implementation: check the result and fix failures caused by the change. Match verification to the affected behavior; repeat checks only after changes, failures, or unresolved concerns.
- Continue within the agreed scope without step-by-step approval. Pause for missing access, consequential decisions the request does not settle, or destructive actions not already authorized.

## Engineering

- Prefer the simplest end-to-end solution for current requirements. Extract shared logic only for real reuse or a shared invariant.
- Preserve runtime behavior during formatting, lint, typing, and test-structure changes.

## Boundaries

- Treat `refs/` as read-only reference material; do not edit or import from that directory.
- Remove obsolete paths directly; do not add backward-compatibility layers, fallbacks, or migrations.
- Keep public pull requests, commits, generated files, and documentation free of private names, internal context, customer-derived data, and AI attribution.
