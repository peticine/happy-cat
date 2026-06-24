import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/age-journey/main.jsx"),
      output: {
        entryFileNames: "age-journey.js",
        assetFileNames: "age-journey.[ext]",
      },
    },
  },
});
