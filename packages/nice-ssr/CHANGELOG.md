# @melchor629/nice-ssr

## 0.5.1

### Patch Changes

- 2fe7d6a: Rewrite plugin config to properly use vite environments
- bf31a2c: Map Error from server to avoid exposing sensible data.
- 2a92e63: Improve error handling in CSR
- 4499354: Upgrade typescript version to v6
- 315e1c7: Fix 404 pages being matched to parent routes

## 0.5.0

### Minor Changes

- b9c2fd2: Update to vite 8

## 0.4.1

### Patch Changes

- 1485ef9: Use proxy to add empty string body for null bodies in response.

## 0.4.0

### Minor Changes

- fa12e04: Change rendering to react

## 0.3.2

### Patch Changes

- c19ed8d: Wrong route path priority when selecting route.

## 0.3.1

### Patch Changes

- 6dc543c: Fix possible vulnerable code.
- 396caf7: Add tracing to route rendering.

## 0.3.0

### Minor Changes

- c4960af: Support error (only server) and not found pages with multi layout and route grouping.

### Patch Changes

- a0bc86c: Fix route matcher when dynamic mark is in the middle.
