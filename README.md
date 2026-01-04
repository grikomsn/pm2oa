# pm2oa

A lightweight CLI tool to convert Postman collections to OpenAPI specifications using [postman2openapi](https://github.com/kevinswiber/postman2openapi).

This package targets Node.js 18+ because it relies on the built-in `fetch` API (no polyfill included).

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
- **YAML**: Automatically detected when output file ends with `.yml` or `.yaml`

## Options

- `[input]` - Input file path or URL to Postman collection (optional, reads from stdin if not provided)
- `-o, --output <file>` - Output file path (defaults to stdout)
- `-h, --help` - Display help information
- `-V, --version` - Display version number
