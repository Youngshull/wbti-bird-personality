import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "edgeone-static",
  // GitHub Pages 预览部署在子路径下，由工作流传入 PAGES_BASE。
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react()],
  publicDir: "../public",
  build: {
    outDir: "../edgeone-dist",
    emptyOutDir: true,
  },
});
