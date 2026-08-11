import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/fpl': {
        target: 'https://fantasy.premierleague.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fpl/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    }
  }
});
