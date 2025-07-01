import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Use root path for development
  plugins: [react()],
  assetsInclude: ['**/*.md', '**/*.json', '**/*.jpeg', '**/*.jpg', '**/*.png']
});