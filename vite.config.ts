import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// Never inject server secrets into the browser bundle.
export default defineConfig({plugins:[react(),tailwindcss()],server:{hmr:process.env.DISABLE_HMR !== 'true'}});
