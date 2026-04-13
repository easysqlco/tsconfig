# AGENTS.md

## Package Purpose

`@easysqlco/tsconfig` publishes shared TypeScript base configs for EasySQL
package repos.

It is tooling infrastructure. Treat compiler behavior as stability-sensitive.

## Exported Configs

- `dev`:
  Root repo config for IDEs, local development, and test-oriented `noEmit`
  usage.
- `react`:
  Base config for published React library source, typically `lib/tsconfig.json`.
- `react.build`:
  Exported as `@easysqlco/tsconfig/react/build`. Optional production override
  that only disables declaration output and maps.

## Stability Contract

- Do not change strictness policy casually.
- Do not change module or module-resolution strategy without verified need and
  documentation.
- Do not add options that can alter consumer emit shape unless the change is
  deliberate, documented, and compatibility-reviewed.
- Assume current EasySQL consumer behavior is the baseline.

## Layering Rules

- `dev` owns repo-root development defaults only.
- `react` owns reusable React library compiler defaults.
- `react.build` owns production emit overrides only.
- Consumer packages own:
  - `rootDir`
  - `outDir`
  - `files` / `include` / `exclude`
  - package-specific `types`
  - any deliberate local emit override

## Option Placement

- Put a new option in `dev` only if it is appropriate for package-root
  development regardless of library build output.
- Put a new option in `react` only if it should apply to nearly every EasySQL
  React library.
- Put a new option in `react.build` only if it is a build-only override and
  does not belong in normal library development.
- If an option is consumer-specific, document it in the README instead of
  centralizing it here.

## Cross-Package Consistency

- Keep metadata and docs aligned with the EasySQL shared tooling suite:
  `@easysql/eslint-config` and `@easysql/eslint-config-react`.
- Preserve the published import paths exactly as consumers use them today.
- Keep TypeScript compatibility expectations explicit in `package.json` and
  `README.md`.

## CI Expectations

- `npm run validate` must stay lightweight and dependency-free.
- Validation must cover exported paths, published files, JSONC parsing, and
  local `extends` resolution.
- Publish automation must run validation before `npm publish`.

## Extension Guidelines

- Prefer adding documentation before adding new config variants.
- Add a new exported config only when an existing layer cannot represent the
  need cleanly.
- Keep new variants narrow and named by responsibility, not by one consumer.

## Anti-Patterns

- Do not use this package to enforce application-specific paths or file globs.
- Do not add framework, bundler, or test-runner settings without verified
  documentation and a real cross-package need.
- Do not turn `react.build` into a second full base config.
- Do not rename export paths or scopes casually.
