import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

// Keep the current API-connected UI and final mock design as separate entries.
// Never inject server secrets into browser bundles.
export default defineConfig({
  plugins:[react(),tailwindcss()],
  server:{hmr:process.env.DISABLE_HMR !== 'true'},
  build:{rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),design:fileURLToPath(new URL('./design.html',import.meta.url))}}}
});
