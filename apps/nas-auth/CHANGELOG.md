# nas-auth

## 3.3.0

### Minor Changes

- fec00d9: Add support for passkeys registration and login.

### Patch Changes

- 38a7641: Fix cancel login fails because it is called twice
- 4499354: Upgrade typescript version to v6
- Updated dependencies [2fe7d6a]
- Updated dependencies [bf31a2c]
- Updated dependencies [2a92e63]
- Updated dependencies [2af7686]
- Updated dependencies [4499354]
- Updated dependencies [315e1c7]
  - @melchor629/nice-ssr@0.5.1
  - @melchor629/ui@0.0.2
  - @melchor629/fastify-infra@0.2.1
  - @melchor629/infra@0.1.3

## 3.2.0

### Minor Changes

- ffce9bb: Use shared UI package for components and design.

### Patch Changes

- 01edc22: Update dependencies
- b9c2fd2: Update to vite 8
- 26dd0ce: chore: update deps
- f409831: Apply rate limits to login endpoints and whole app.
- Updated dependencies [7543734]
- Updated dependencies [01edc22]
- Updated dependencies [b9c2fd2]
- Updated dependencies [1d8844c]
- Updated dependencies [26dd0ce]
- Updated dependencies [ffce9bb]
- Updated dependencies [c09b71c]
  - @melchor629/infra@0.1.2
  - @melchor629/nice-ssr@0.5.0
  - @melchor629/ui@0.0.1
  - @melchor629/fastify-infra@0.2.0

## 3.1.1

### Patch Changes

- 8ac7dd9: Update dependencies.
- Updated dependencies [1485ef9]
- Updated dependencies [8ac7dd9]
  - @melchor629/nice-ssr@0.4.1
  - @melchor629/fastify-infra@0.1.4
  - @melchor629/infra@0.1.1

## 3.1.0

### Minor Changes

- ec05ce5: Use react instead of preact

### Patch Changes

- Updated dependencies [fa12e04]
  - @melchor629/nice-ssr@0.4.0

## 3.0.8

### Patch Changes

- df24223: Fix update login data miss type.
- 3598aaa: fix login data types
- Updated dependencies [49b1778]
  - @melchor629/fastify-infra@0.1.3

## 3.0.7

### Patch Changes

- 9e954db: fix wrong app name in logger
- Updated dependencies [c19ed8d]
  - @melchor629/nice-ssr@0.3.2

## 3.0.6

### Patch Changes

- fix missing code in docker

## 3.0.5

### Patch Changes

- 1ccf40f: Reduce docker image sizes by optimizing layers and package installation.
- 11ae436: Add telemetry to projects.
- Updated dependencies [5182e2d]
- Updated dependencies [6dc543c]
- Updated dependencies [396caf7]
- Updated dependencies [11ae436]
  - @melchor629/infra@0.1.0
  - @melchor629/fastify-infra@0.1.2
  - @melchor629/nice-ssr@0.3.1

## 3.0.4

### Patch Changes

- 2569c8c: Rename NAS_PERSISTENCE to NAS_PERSISTANCE in code
- 2569c8c: Fix redis operations in redis adapter

## 3.0.3

### Patch Changes

- ca51307: Fix missing deps on prod build.

## 3.0.2

### Patch Changes

- a35deb1: Another try on auto deploy apps.

## 3.0.1

### Patch Changes

- Update tag trigger for the artifacts.

## 3.0.0

### Major Changes

- 3f0e08b: Add nas-auth and support for redis cache.

### Patch Changes

- 08fc818: Fix imports and remove unneded code
- Updated dependencies [ec7f414]
- Updated dependencies [3f0e08b]
- Updated dependencies [a0bc86c]
- Updated dependencies [c4960af]
  - @melchor629/fastify-infra@0.1.1
  - @melchor629/nice-ssr@0.3.0
