import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@alicloud/cloud-charts-core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@alicloud/cloud-charts-line': resolve(__dirname, '../../packages/charts/wline/src/index.ts'),
    },
    dedupe: ['@antv/g2', '@antv/util', '@antv/g-lite', '@antv/component', '@antv/g', '@antv/matrix-util'],
  },
  optimizeDeps: {
    include: ['@antv/g2', '@antv/util', '@antv/g-lite', '@antv/component'],
  },
  server: {
    port: 5179,
    open: false,
  },
});
