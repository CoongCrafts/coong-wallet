import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/__tests__/setupTests.ts',
  },
});
