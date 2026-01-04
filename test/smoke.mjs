import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";
import { transpile } from "postman2openapi";

const cliPath = fileURLToPath(new URL("../index.js", import.meta.url));
const fixturePath = fileURLToPath(new URL("./fixtures/basic-collection.json", import.meta.url));
const collection = JSON.parse(readFileSync(fixturePath, "utf-8"));
const expected = transpile(collection);

const runCli = (args) => {
  return execFileSync("node", [cliPath, ...args], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
};

const tempDir = mkdtempSync(join(tmpdir(), "pm2oa-"));

try {
  // JSON output via stdout
  const jsonOutput = runCli([fixturePath]);
  const parsedJson = JSON.parse(jsonOutput);
  assert.deepStrictEqual(parsedJson, expected);

  // YAML output via file + format flag
  const yamlOutputPath = join(tempDir, "openapi.yaml");
  runCli([fixturePath, "--format", "yaml", "-o", yamlOutputPath]);
  const yamlContent = readFileSync(yamlOutputPath, "utf-8");
  const parsedYaml = yaml.load(yamlContent);
  assert.deepStrictEqual(parsedYaml, expected);

  // Invalid format should fail
  let threw = false;
  try {
    runCli([fixturePath, "--format", "xml"]);
  } catch (error) {
    threw = true;
    const stderr = (error.stderr || error.message || "").toString();
    assert.ok(stderr.includes("Invalid format"));
  }
  assert.ok(threw, "Expected invalid format to throw");

  console.error("Smoke tests passed.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
