#!/usr/bin/env bun

import { Command } from "commander";
import { transpile } from "postman2openapi";
import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";

const program = new Command();

program
  .name("pm2oa")
  .description("Convert Postman collections to OpenAPI specifications")
  .version("1.0.0")
  .argument("[input]", "Input file path or URL to Postman collection")
  .option("-o, --output <file>", "Output file path (defaults to stdout)")
  .action(async (input, options) => {
    try {
      let collectionData: string;

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
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) {
          chunks.push(chunk);
        }
        collectionData = Buffer.concat(chunks).toString("utf-8");
      }

      // Parse the collection JSON
      const collection = JSON.parse(collectionData);

      // Convert to OpenAPI
      const openApiSpec = transpile(collection);

      // Determine output format based on file extension
      let output: string;
      if (options.output && (options.output.endsWith(".yml") || options.output.endsWith(".yaml"))) {
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
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

program.parse();