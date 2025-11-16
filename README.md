# @easysqlco/tsconfig

Provides shared TypeScript configuration bases across EasySQL packages.

## Installation

```bash
npm install --save-dev @easysqlco/tsconfig
```

## Configurations

### `@easysqlco/tsconfig/react`

Base configuration for React packages with:
- Modern ESNext target and modules
- React JSX support (`react-jsx`)
- Source maps and declaration files enabled
- Bundler module resolution
- Strict type checking with JS-friendly options

### `@easysqlco/tsconfig/react/build`

Extends the React configuration with:
- Declaration and source map generation disabled
- Optimized for production builds

### Usage pattern per environment

For each environment-specific folder (for example, `react/`), the recommended pattern in consuming projects is:

- `tsconfig.json` — base config used by your IDE, tests, and local development. This typically extends `@easysqlco/tsconfig/<env>` (for example, `react`) and may keep source maps enabled.
- `tsconfig.build.json` — production build config used by your bundler/CI. This typically extends `@easysqlco/tsconfig/<env>/build` (for example, `react/build`) and turns off extras like source maps and declaration maps.

Example for a React package:

```jsonc
// tsconfig.json (dev/IDE/tests)
{
  "extends": "@easysqlco/tsconfig/react",
  "compilerOptions": {
    "outDir": "dist"
  },
}
```

```jsonc
// tsconfig.build.json (production build)
{
  "extends": "@easysqlco/tsconfig/react/build",
  "compilerOptions": {
    "outDir": "dist"
  },
}
```

Note: `noEmit` is intentionally not specified in these examples so it remains `false` in both configs, ensuring that TypeScript always emits build output when these configs are used. See the TypeScript docs for more details: https://www.typescriptlang.org/tsconfig/#noEmit

## Publishing

To publish a new version:

```bash
npm version patch|minor|major
npm publish
```

## License

MIT
