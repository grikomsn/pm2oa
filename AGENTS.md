# AGENT GUIDANCE FOR PM2OA
1. This repository is a Node.js 18+ CLI wrapper for postman2openapi.
2. Scope: instructions here apply to the entire repo.
3. There are no nested AGENTS rules.
4. There are no Cursor rules (.cursor/rules/) to merge.
5. There are no Copilot instructions in .github/copilot-instructions.md.
6. Respect MIT license when sharing snippets externally.
7. Default package entrypoint: `index.js` (ESM).
8. CLI binary name: `pm2oa` mapped via `bin` in package.json.
9. Input sources supported: file path, HTTP(S) URL, stdin.
10. Output formats supported: JSON (default) and YAML (via flag or extension).
11. Upstream converter: `postman2openapi.transpile`.
12. Fetch must exist; code already guards for fetch presence.
13. JSON package metadata is loaded via fs+URL to support Node 18.
14. Prefer not to widen Node engine unless necessary.
15. Keep CLI exit codes non-zero on failure.
16. Avoid adding new runtime dependencies unless essential.
17. Dev dependency @types/js-yaml present; keep dev deps lean.
18. TypeScript is not used; tsconfig is for tooling only.
19. Do not introduce TypeScript sources without prior agreement.
20. Maintain ESM syntax; avoid CommonJS require.
21. Keep top-level await out unless absolutely required.
22. Prefer `import` sorting: Node built-ins, external, internal, then relative paths.
23. Use named imports when possible (e.g., `{ Command }`).
24. Avoid default imports from CommonJS modules unless documented safe.
25. Avoid wildcard imports except for libraries exposing namespaces (e.g., `* as yaml`).
26. Formatting: two-space indentation, trailing semicolons as in existing code.
27. Keep lines reasonably short (<100 chars) unless readability benefits otherwise.
28. Strings: double quotes for consistency with existing files.
29. Prefer template literals for interpolated strings and errors.
30. Use `const` by default; use `let` only when reassigned.
31. Avoid `var` entirely.
32. Booleans: prefer positive conditions; avoid double negation.
33. Error handling: wrap risky IO/fetch with try/catch and emit clear messages.
34. Return early on invalid input; keep error paths concise.
35. When throwing, throw `Error` with actionable message (no bare strings).
36. CLI should print user-facing errors to stderr.
37. Success messages to stdout for primary output; stderr for status hints only when writing to files.
38. Keep fetch errors including status code and text.
39. Validate JSON parse with helpful message; do not leak stack traces by default.
40. When adding flags, include validation and help description.
41. Keep Commander options succinct; avoid short aliases that clash with existing ones.
42. Commander version should match package version automatically.
43. Preserve current guard: fetch check exits with code 1.
44. Input handling: fail when stdin is empty and no arg provided.
45. Preserve whitespace trimming when checking empty input.
46. Keep conversion pure: `transpile` result untouched except formatting.
47. YAML output via `js-yaml` with indent 2 and lineWidth -1; keep stable.
48. JSON output should use `JSON.stringify` with 2 spaces.
49. Do not add inline comments inside code unless necessary.
50. Naming: descriptive, no one-letter unless for idiomatic iterators.
51. Functions should be small; extract helpers only if reused.
52. Avoid global mutable state; keep logic inside command action.
53. Prefer explicit option plumbing over implicit globals.
54. Avoid silent failures; every catch should log and exit non-zero.
55. When logging success messages, prefix with checkmark consistently.
56. Keep user prompts out; CLI should be non-interactive.
57. Internationalization not required; stick to English messages.
58. Security: do not eval or execute arbitrary user input.
59. File IO should use utf-8 encoding explicitly.
60. Avoid synchronous network calls; fetch is already async.
61. Tests should avoid network I/O; use fixtures.
62. Add new fixtures under `test/fixtures/` with clear names.
63. When adding tests, prefer Node core asserts (`node:assert`).
64. Use `execFileSync` for CLI smoke to avoid shell interpolation risks.
65. Capture stdout/stderr separately when validating errors.
66. Clean up temp files/dirs in tests using `rmSync(..., { recursive: true, force: true })`.
67. Keep tests deterministic; no reliance on time or randomness.
68. If adding more tests, expose single-test convenience via env/args when possible.
69. Current single test: `node test/smoke.mjs` (runs full smoke).
70. There is no granular per-test runner; create new isolated test files if needing targeted runs.
71. npm scripts defined: `npm run lint`, `npm test`.
72. `npm test` runs `node test/smoke.mjs`.
73. `npm run lint` runs `node --check index.js` (syntax check only).
74. To run CLI manually: `node index.js <input> [--format json|yaml] [-o path]`.
75. To run with stdin: `cat file.json | node index.js`.
76. To run with URL: `node index.js https://example.com/collection.json`.
77. To force YAML: add `--format yaml` or use `.yml/.yaml` output extension.
78. To force JSON: add `--format json` or `.json` output extension.
79. Exit codes: non-zero on errors; avoid swallowing.
80. When modifying package.json, keep `files` list minimal; ensure README/LICENSE included.
81. Keep repository metadata (homepage, repository URL) accurate.
82. Do not bump version unless release is intended.
83. Keep bin path valid relative to root.
84. When adding scripts, ensure they work on Linux (shell-agnostic if possible).
85. Avoid adding npm lifecycle hooks unless necessary.
86. Prefer minimal dev scripts; avoid heavy toolchains.
87. Lint philosophy: fast checks over heavy formatting tools (no prettier/eslint yet).
88. If adding formatting tools, document them here and in README.
89. Keep tsconfig JSON valid (no comments) and aligned with JS-only use.
90. Do not introduce JSX/React-specific settings unless code adds them.
91. Maintain strict mode assumptions implicit in ESM.
92. Avoid dynamic require or CommonJS interop flags.
93. Path handling: use `new URL` with import.meta.url for relative file reads in ESM.
94. Avoid `__dirname` polyfills unless necessary; prefer URL methods.
95. Keep CLI help text concise and consistent with README.
96. Update README when adding flags or behavior changes.
97. Document runtime constraints (fetch requirement, Node version) in README when changed.
98. Keep examples runnable and accurate.
99. When adding YAML support tweaks, keep backward compatibility with JSON default.
100. Do not change default output without consensus.
101. Error messages should be user-friendly, not stack dumps.
102. Logging should avoid noisy prefixes; use simple "Error:" format as current.
103. When parsing options, avoid destructuring undefined; commander provides defaults.
104. Prefer optional chaining judiciously; avoid deep optional chains for clarity.
105. Avoid promise creation anti-patterns; use async/await.
106. Do not block event loop unnecessarily; keep synchronous file writes only where needed.
107. For performance-sensitive code, profile before optimizing; current CLI is IO-bound.
108. Keep bundle size minimal; this is a CLI, not a library build.
109. Packaging: `npm pack` should include only necessary files listed in `files`.
110. Do not commit node_modules or npm lock updates unless required.
111. Lockfile present (package-lock.json); respect it when adding deps.
112. When adding dependencies, run `npm install <pkg>` to update lock.
113. Tests should be run after dependency changes.
114. If adding more tests, consider naming `*.mjs` and referencing via npm scripts.
115. For single test execution, run the specific test file with `node path/to/test.mjs`.
116. Avoid mocha/jest unless repo intentionally adds them; keep zero-config tests.
117. If new test frameworks are added, update this AGENTS file with commands and patterns.
118. Keep fixtures small and representative; no large binaries.
119. Do not add secrets or tokens to tests or fixtures.
120. HTTP mocks: prefer static fixtures over live calls.
121. Ensure file paths are quoted in commands when containing spaces.
122. Use `workdir` flag when running commands via tooling that forbids `cd &&` patterns.
123. Prefer `npm` over `pnpm`/`yarn` unless repo switches package manager.
124. Respect `type": "module"` when adding new files; use `.mjs` or `.js` with ESM.
125. Keep Commander configuration in one place; avoid scattered CLI setup.
126. If adding subcommands, maintain consistent naming and help structure.
127. For options with enumerated values, validate early and error clearly.
128. Avoid catch-all try/catch around whole program; scope to logical blocks.
129. When extending error formatting, keep `formatError` helper central.
130. Avoid re-parsing JSON unnecessarily; parse once and reuse.
131. Keep yaml dump options consistent; avoid hard-wrapping lines.
132. When writing files, overwrite intentionally; consider future `--force` flag if needed.
133. Ensure stdout remains pure OpenAPI payload when no output file is provided.
134. Do not emit progress bars or logs to stdout unless behind a flag.
135. Keep stderr concise to avoid corrupting stdout pipelines.
136. When updating README examples, ensure they match actual CLI behavior.
137. Prefer adding notes about failure modes (fetch errors, empty input) in docs.
138. If adding config files, document their scope here.
139. There are currently no environment variables required; document if introducing any.
140. Keep instructions in this AGENTS file in sync with repo changes.
141. When using automation agents, follow these rules before editing files.
142. Maintain human-friendly tone in new docs; concise and clear.
143. Do not auto-format markdown with heavy linters unless configured.
144. Keep line endings LF.
145. File names should be kebab-case or lower-case with dashes where needed.
146. Avoid creating new top-level directories without purpose.
147. If adding CI, ensure commands mirror npm scripts here.
148. Before publishing, run `npm test`, `npm run lint`, and optionally `npm pack`.
149. If adding new commands, update this file and README simultaneously.
150. When unsure, favor minimal change that preserves current behavior.
151. Publishing relies on `.github/workflows/publish.yml`, which runs `npm ci`, lint, tests, and `npm publish --access public --provenance` after a release or manual trigger.
152. Ensure the `NPM_TOKEN` repository secret is provisioned so the workflow can authenticate as `NODE_AUTH_TOKEN`, and keep the workflow docs in sync with README.
