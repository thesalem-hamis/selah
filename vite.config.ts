import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    ...tanstackStart(),
    react(),
    tailwindcss(),
    nitro({
      preset: "vercel",
      esbuild: {
        options: {
          target: "es2022",
        },
      },
      rollupConfig: {
        external: [],
      },
      moduleSideEffects: ["tslib"],
      noExternals: true,
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: ["competitions-surrey-powerseller-whats.trycloudflare.com"],
  },
});
