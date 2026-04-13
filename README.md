# @easysqlco/tsconfig

Shared TypeScript base configs for EasySQL packages.

This package exists to keep compiler defaults stable across package repos,
while still letting each consumer own its local paths, includes, emit
strategy, and environment-specific overrides.

## Install

```bash
npm install --save-dev @easysqlco/tsconfig typescript
```

TypeScript `>= 5 < 6` is expected. EasySQL packages currently use TypeScript
5.6.x, and the React base relies on `moduleResolution: "bundler"`, which is a
TypeScript 5+ setting.

## Exported configs

| Export | Purpose | Typical consumer |
| --- | --- | --- |
| `@easysqlco/tsconfig/dev` | Root development config with `noEmit: true` | package-repo root `tsconfig.json` |
| `@easysqlco/tsconfig/react` | React library development/build base | `lib/tsconfig.json` |
| `@easysqlco/tsconfig/react/build` | Optional production override that disables declarations and maps | `lib/tsconfig.build.json` when that exact emit shape is desired |

## Layering contract

- `dev` is for repository-root TypeScript usage: IDEs, editor tooling, tests,
  and monorepo-local development.
- `react` is for published React library source under `lib/`.
- `react/build` is intentionally narrow. It only turns off declaration output,
  declaration maps, and source maps. It does not change strictness, module
  strategy, JSX, or consumer-owned paths.

Current EasySQL packages mostly extend `@easysqlco/tsconfig/react` directly in
`lib/tsconfig.json` and keep package-specific build behavior local. Use
`react/build` only when your production TypeScript step should explicitly stop
emitting declarations and maps.

## Recommended usage

### Repository root

```jsonc
{
  "extends": "@easysqlco/tsconfig/dev",
  "compilerOptions": {
    "noEmit": true
  }
}
```

### React library source

```jsonc
{
  "extends": "@easysqlco/tsconfig/react",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "files": ["src/index.ts"]
}
```

### Optional production override

```jsonc
{
  "extends": "@easysqlco/tsconfig/react/build",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "files": ["src/index.ts"]
}
```

If your package must publish `.d.ts` files, keep using
`@easysqlco/tsconfig/react` for the build step or locally override the
declaration-related flags.

## Tooling suite fit

EasySQL package repos commonly install this package together with:

- `@easysql/eslint-config`
- `@easysql/eslint-config-react`

The packages intentionally cover different layers:

- `@easysqlco/tsconfig` defines shared TypeScript compiler defaults.
- `@easysql/eslint-config` defines shared base linting/formatting defaults.
- `@easysql/eslint-config-react` adds React-specific lint rules.

Keep the import paths as published. The TypeScript package currently uses the
`@easysqlco` scope, while the ESLint packages remain under `@easysql`.

## Validation and publishing

Run the package validation before publishing:

```bash
npm run validate
npm pack --dry-run
```

The validation script checks that:

- each exported config path exists
- exported config files are included in the published package
- JSONC parsing succeeds
- local `extends` chains resolve

The publish workflow runs the same validation before `npm publish`.

## License

MIT
