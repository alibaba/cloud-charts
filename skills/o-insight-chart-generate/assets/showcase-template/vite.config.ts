import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// EDIT these two paths so they point at the cloud-charts monorepo source.
// If this app lives at <monorepo>/examples/visualize-<topic>/, the defaults below work.
const MONOREPO = resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@alicloud/cloud-charts-core': resolve(MONOREPO, 'packages/core/src/index.ts'),
      '@alicloud/cloud-charts-react': resolve(MONOREPO, 'packages/frameworks/react/src/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: { port: 5183 },
});
