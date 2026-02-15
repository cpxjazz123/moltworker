import fs from "fs";
import path from "path";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";

// Plugin to inject DecompressionStream polyfill into @sparkjsdev/spark worker code
// This is needed for iOS 15 Safari compatibility
function sparkPolyfillPlugin(): Plugin {
  // Read the polyfill code (UMD version works in worker context)
  let polyfillCode = "";

  return {
    configResolved() {
      // Load polyfill code once
      const polyfillPath = path.resolve(__dirname, "node_modules/compression-streams-polyfill/umd/index.js");

      polyfillCode = fs.readFileSync(polyfillPath, "utf-8");
      // Escape for string literal insertion (single quotes and backslashes)
      polyfillCode = polyfillCode.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
    },
    enforce: "pre",
    name: "spark-polyfill",
    transform(code, id) {
      // Only transform @sparkjsdev/spark module files
      if (id.includes("@sparkjsdev/spark")) {
        // Find the worker content string and inject polyfill at the beginning
        // The worker code starts with: const jsContent = '(function() {...
        if (code.includes("const jsContent = '")) {
          // Match pattern: const jsContent = '(function() {
          // The polyfill needs to be injected after the IIFE opening brace
          const modifiedCode = code.replace(
            /(const jsContent = '\(function\(\)\s*\{\\n\s*"use strict";)/g,
            `$1${polyfillCode};`,
          );

          if (modifiedCode !== code) {
            return { code: modifiedCode, map: null };
          }

          // Try alternate pattern for different formatting
          const altCode = code.replace(
            `const jsContent = '(function() {\\n  "use strict";`,
            `const jsContent = '(function() {\\n  ${polyfillCode};\\n  "use strict";`,
          );

          if (altCode !== code) {
            return { code: altCode, map: null };
          }
        }
      }

      return null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    // Exclude spark so our transform plugin can modify it
    exclude: ["@sparkjsdev/spark"],
  },
  plugins: [sparkPolyfillPlugin(), tanstackRouter(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["local.anify.ai"],
  },
});
