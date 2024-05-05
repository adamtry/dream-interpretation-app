import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    VitePWA({ registerType: "autoUpdate" }),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
});
