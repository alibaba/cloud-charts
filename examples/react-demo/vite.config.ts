import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@alicloud/cloud-charts-core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@alicloud/cloud-charts-react': resolve(__dirname, '../../packages/frameworks/react/src/index.ts'),
      '@alicloud/cloud-charts-line/g2LegacyInteractions': resolve(__dirname, '../../packages/charts/wline/src/g2LegacyInteractions.ts'),
      '@antv/g2': resolve(__dirname, 'node_modules/@antv/g2'),
    },
    dedupe: ['@antv/g2', 'react', 'react-dom'],
  },
  server: { port: 5180 },
});
