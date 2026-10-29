import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` -> normal multi-file build for hosting / WordPress embedding.
// `npm run build:single` -> one self-contained index.html (used for the preview artifact).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    assetsInlineLimit: mode === 'single' ? 100_000_000 : 4096,
    chunkSizeWarningLimit: 2000,
    outDir: mode === 'single' ? 'dist-single' : 'dist',
  },
}));
