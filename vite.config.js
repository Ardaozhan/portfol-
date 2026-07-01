import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // '@/' maps to '/src/' — prevents deep relative imports like '../../../utils/cn'
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Treat GLSL shader files as raw text strings
  assetsInclude: ["**/*.glsl"],

  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split rarely-changing animation/scroll libs into their own vendor
        // chunk so browsers can cache them separately from app code.
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) return "vendor_motion";
          if (id.includes("node_modules/gsap")) return "vendor_gsap";
          if (id.includes("node_modules/@studio-freight/lenis"))
            return "vendor_lenis";
        },
      },
    },
  },
});
