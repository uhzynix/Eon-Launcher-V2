import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "../Public",
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
});
