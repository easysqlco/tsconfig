# @easysqlco/tsconfig

Provides shared TypeScript configuration bases across EasySQL packages.

## Installation

```bash
npm install --save-dev @easysqlco/tsconfig
```

## Usage

### React Package

For React packages/applications, extend the React configuration in your `tsconfig.json`:

```json
{
  "extends": "@easysqlco/tsconfig/react",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

For build-specific configuration (without source maps and declaration files), create a `tsconfig.build.json`:

```json
{
  "extends": "@easysqlco/tsconfig/react/build",
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
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

## Publishing

To publish a new version:

```bash
npm version patch|minor|major
npm publish
```

## License

MIT
