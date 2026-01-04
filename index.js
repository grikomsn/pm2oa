#!/usr/bin/env node

import { Command } from "commander";
import { transpile } from "postman2openapi";
import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8")
);

if (typeof globalThis.fetch !== "function") {
  console.error("pm2oa requires a runtime with fetch available (Node.js 18+ or a compatible polyfill).");
  process.exit(1);
}

const formatError = (error) =>
  error instanceof Error ? error.message : String(error);

const program = new Command();

program
  .name("pm2oa")
  .description("Convert Postman collections to OpenAPI specifications")
  .version(pkg.version)
  .argument("[input]", "Input file path or URL to Postman collection")
  .option("-o, --output <file>", "Output file path (defaults to stdout)")
  .option("-f, --format <format>", "Output format (json|yaml)")
  .action(async (input, options) => {
    try {
      let collectionData;

      const hasInputArgument = Boolean(input);

      // Handle different input sources
      if (hasInputArgument) {
        // Check if input is a URL
        if (input.startsWith("http://") || input.startsWith("https://")) {
          // Fetch from URL
          const response = await fetch(input);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch from URL: ${response.status} ${response.statusText}`
            );
          }
          collectionData = await response.text();
        } else {
          // Read from file
          collectionData = readFileSync(input, "utf-8");
        }
      } else {
        if (process.stdin.isTTY) {
          throw new Error(
            "No input provided. Provide a file/URL or pipe a Postman collection via stdin."
          );
        }

        // Read from stdin
        const chunks = [];
        try {
          for await (const chunk of process.stdin) {
            chunks.push(chunk);
          }
        } catch (stdinError) {
          throw new Error(
            `Failed to read from stdin: ${formatError(stdinError)}`
          );
        }

        if (chunks.length === 0) {
          throw new Error(
            "No input provided. Provide a file/URL or pipe a Postman collection via stdin."
          );
        }

        collectionData = Buffer.concat(chunks).toString("utf-8");
      }

      if (!collectionData || collectionData.toString().trim() === "") {
        throw new Error("Input is empty. Provide valid Postman collection JSON.");
      }

      // Parse the collection JSON
      let collection;
      try {
        collection = JSON.parse(collectionData);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON format in collection data: ${formatError(parseError)}`
        );
      }

      // Convert to OpenAPI
      const openApiSpec = transpile(collection);

      const formatFlag = options.format?.toLowerCase();
      if (formatFlag && formatFlag !== "json" && formatFlag !== "yaml") {
        throw new Error("Invalid format. Use \"json\" or \"yaml\".");
      }

      const outputPath = options.output ? options.output.toLowerCase() : "";
      const formatFromExtension = outputPath.endsWith(".yml") || outputPath.endsWith(".yaml")
        ? "yaml"
        : outputPath.endsWith(".json")
          ? "json"
          : undefined;

      const outputFormat = formatFlag ?? formatFromExtension ?? "json";

      let output;
      if (outputFormat === "yaml") {
        output = yaml.dump(openApiSpec, { indent: 2, lineWidth: -1 });
      } else {
        output = JSON.stringify(openApiSpec, null, 2);
      }

      // Output result
      if (options.output) {
        writeFileSync(options.output, output, "utf-8");
        console.error(`✓ OpenAPI specification written to ${options.output}`);
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error("Error:", formatError(error));
      process.exit(1);
    }
  });

program.parse();
