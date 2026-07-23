import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, '../../../examples/wline-vanilla-demo/node_modules/.package-lock.json'));

const typescript = (await import(require.resolve('@rollup/plugin-typescript'))).default;
const nodeResolve = (await import(require.resolve('@rollup/plugin-node-resolve'))).default;
const commonjs = (await import(require.resolve('@rollup/plugin-commonjs'))).default;
const dtsModule = await import(require.resolve('rollup-plugin-dts'));
const dts = dtsModule.dts || dtsModule.default;

const external = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  '@antv/g2',
  '@alicloud/cloud-charts-core',
];

/**
 * 子路径 exports：
 *   - 主入口 src/index.ts → dist/index.{mjs,cjs,d.ts}（向后兼容）
 *   - 7 个图表 → dist/charts/{name}/index.{mjs,cjs,d.ts}
 *   - hooks: useChart / useTheme / useResize / useCustomTooltip
 *   - components/FreeTooltip + components/legends + provider
 *
 * 使用 multi-entry + 共享 chunks 目录，dist 内部互引用避免重复打包；
 * tree-shake 友好，sub-path import 仅引入自身 + 必须依赖。
 */
const chartEntries = ['bar', 'line', 'pie', 'scatter', 'funnel', 'radar', 'lineBar', 'box', 'heatmap', 'nightingale', 'histogram', 'lineScatter', 'linebox', 'sankey', 'candlestick', 'sunburst', 'treemap', 'hierarchy', 'rectangle', 'miniline', 'multiCircle', 'hexagonal', 'map'];

const entries = {
  index: 'src/index.ts',
  ...Object.fromEntries(chartEntries.map((name) => [`charts/${name}/index`, `src/charts/${name}/index.tsx`])),
  'hooks/useChart': 'src/hooks/useChart.ts',
  'hooks/useTheme': 'src/hooks/useTheme.ts',
  'hooks/useResize': 'src/hooks/useResize.ts',
  'hooks/useCustomTooltip': 'src/hooks/useCustomTooltip.tsx',
  'components/FreeTooltip/index': 'src/components/FreeTooltip/index.tsx',
  'components/AiLoadingIcon/index': 'src/components/AiLoadingIcon/index.tsx',
  'components/legends/index': 'src/components/legends/index.ts',
  'provider/index': 'src/provider/index.tsx',
};

export default [
  {
    input: entries,
    output: [
      {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        chunkFileNames: 'chunks/[name]-[hash].cjs',
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationDir: undefined,
      }),
    ],
  },
  // 为每个 entry 独立生成 d.ts 文件
  ...Object.entries(entries).map(([name, input]) => ({
    input,
    output: { file: `dist/${name}.d.ts`, format: 'es' },
    external,
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
  })),
];
