import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // CKEditor is only reached via a lazy import (EditorComponent), so Vite's
    // dev-server dependency scanner never discovers it during startup. Left
    // alone, the first "Edit" click mid-session triggers Vite's "new
    // dependency found" full-page reload + a very slow cold re-optimization
    // of CKEditor's huge dependency graph. Listing it here forces the
    // pre-bundle to happen once at server startup instead.
    include: ['ckeditor5', '@ckeditor/ckeditor5-react'],
  },
  build: {
    // CKEditor is lazy-loaded on its own and is a legitimately large feature
    // chunk (~1.3MB minified with all plugins) even after being isolated
    // from the main bundle; raise the limit just enough to stop warning
    // about that one deferred, edit-mode-only chunk.
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
})
