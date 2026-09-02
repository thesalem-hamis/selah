import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ["tslib"],
  },
  optimizeDeps: {
    include: ["tslib"],
  },
  plugins: [
    ...tanstackStart(),
    react(),
    tailwindcss(),
    nitro({ preset: "vercel" }),
  ],
});
