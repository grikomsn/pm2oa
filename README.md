# pm2oa

A lightweight CLI tool to convert Postman collections to OpenAPI specifications using [postman2openapi](https://github.com/kevinswiber/postman2openapi).

This package targets Node.js 18+ because it relies on the built-in `fetch` API (no polyfill included). Ensure `fetch` is available when running in custom environments.

## Installation

```bash
npx pm2oa
```

## Usage

### Convert from URL

```bash
npx pm2oa https://some.postman.spec/
```

### Convert from URL to specific output file

```bash
npx pm2oa https://some.postman.spec/ -o output.yml
```

### Convert from local JSON file

```bash
npx pm2oa postman-spec.json
```

### Force YAML output regardless of extension

```bash
npx pm2oa postman-spec.json --format yaml
```

### Convert from stdin

```bash
cat postman-spec.json | npx pm2oa
```

or

```bash
npx pm2oa < postman-spec.json
```

## Output Formats

- **JSON** (default): Outputs OpenAPI specification as JSON
- **YAML**: Use `--format yaml` or an output path ending with `.yml` or `.yaml`

## Options

- `[input]` - Input file path or URL to Postman collection (optional; errors when stdin is empty)
- `-o, --output <file>` - Output file path (defaults to stdout)
- `-f, --format <format>` - Output format (`json` or `yaml`)
- `-h, --help` - Display help information
- `-V, --version` - Display version number

## Development

- `npm run lint` – Syntax check `index.js`
- `npm test` – Smoke test JSON and YAML outputs against a fixture

## Publishing

- Releases run the `.github/workflows/publish.yml` workflow (triggered on release publish and manually via `workflow_dispatch`).
- The workflow executes `npm ci`, then `npm run lint` / `npm test`, and finally `npm publish --access public --provenance` with the `NPM_TOKEN` repository secret supplied as `NODE_AUTH_TOKEN`.
- Keep versions bumped before invoking the workflow and verify tests/lint pass locally (`npm run lint`, `npm test`, optionally `npm pack`) so the pipeline can succeed without intervention.
