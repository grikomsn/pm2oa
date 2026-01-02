#!/usr/bin/env node

import { Command } from "commander";
import { transpile } from "postman2openapi";
import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";

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
  .version("1.0.0")
  .argument("[input]", "Input file path or URL to Postman collection")
  .option("-o, --output <file>", "Output file path (defaults to stdout)")
  .action(async (input, options) => {
    try {
      let collectionData;

      // Handle different input sources
      if (input) {
        // Check if input is a URL
        if (input.startsWith("http://") || input.startsWith("https://")) {
          // Fetch from URL
          const response = await fetch(input);
          if (!response.ok) {
            throw new Error(`Failed to fetch from URL: ${response.statusText}`);
          }
          collectionData = await response.text();
        } else {
          // Read from file
          collectionData = readFileSync(input, "utf-8");
        }
      } else {
        // Read from stdin
        const chunks = [];
        for await (const chunk of process.stdin) {
          chunks.push(chunk);
        }
        collectionData = Buffer.concat(chunks).toString("utf-8");
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

      // Determine output format based on file extension
      let output;
      if (options.output) {
        const outputPath = options.output.toLowerCase();
        if (outputPath.endsWith(".yml") || outputPath.endsWith(".yaml")) {
          output = yaml.dump(openApiSpec, { indent: 2, lineWidth: -1 });
        } else {
          output = JSON.stringify(openApiSpec, null, 2);
        }
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
