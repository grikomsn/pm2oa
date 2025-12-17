# pm2oa

A lightweight CLI tool to convert Postman collections to OpenAPI specifications using [postman2openapi](https://github.com/kevinswiber/postman2openapi).

## Installation

```bash
bunx pm2oa
```

## Usage

### Convert from URL

```bash
bunx pm2oa https://some.postman.spec/
```

### Convert from URL to specific output file

```bash
bunx pm2oa https://some.postman.spec/ -o output.yml
```

### Convert from local JSON file

```bash
bunx pm2oa postman-spec.json
```

### Convert from stdin

```bash
cat postman-spec.json | bunx pm2oa
```

or

```bash
bunx pm2oa < postman-spec.json
```

## Output Formats

- **JSON** (default): Outputs OpenAPI specification as JSON
- **YAML**: Automatically detected when output file ends with `.yml` or `.yaml`

## Options

- `[input]` - Input file path or URL to Postman collection (optional, reads from stdin if not provided)
- `-o, --output <file>` - Output file path (defaults to stdout)
- `-h, --help` - Display help information
- `-V, --version` - Display version number

