import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/site-icons.js"),
      output: {
        entryFileNames: "site-icons.js",
        format: "iife",
      },
    },
  },
});
