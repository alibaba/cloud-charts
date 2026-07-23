import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, '../../../examples/wline-vanilla-demo/node_modules/.package-lock.json'));

const typescript = (await import(require.resolve('@rollup/plugin-typescript'))).default;
const nodeResolve = (await import(require.resolve('@rollup/plugin-node-resolve'))).default;
const commonjs = (await import(require.resolve('@rollup/plugin-commonjs'))).default;
const babel = (await import(require.resolve('@rollup/plugin-babel'))).default;
const dtsModule = await import(require.resolve('rollup-plugin-dts'));
const dts = dtsModule.dts || dtsModule.default;

const external = [
  'solid-js',
  'solid-js/web',
  'solid-js/store',
  '@antv/g2',
  '@alicloud/cloud-charts-core',
];

const babelPresetSolid = require.resolve('babel-preset-solid');

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.mjs', format: 'es', sourcemap: true },
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
    ],
    external,
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx', '.js'] }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationDir: undefined,
      }),
      babel({
        extensions: ['.tsx'],
        babelHelpers: 'bundled',
        presets: [babelPresetSolid],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    external,
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
  },
];
