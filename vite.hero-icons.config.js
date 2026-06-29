import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/hero-sign-icons.js"),
      output: {
        entryFileNames: "hero-sign-icons.js",
        format: "iife",
      },
    },
  },
});
