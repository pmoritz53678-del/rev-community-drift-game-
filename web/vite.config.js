import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true'
    ? '/rev-community-drift-game-/'
    : '/',
  build: { outDir: 'dist', sourcemap: false },
});