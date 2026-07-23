import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, '../../examples/wline-vanilla-demo/node_modules/.package-lock.json'));

const typescript = (await import(require.resolve('@rollup/plugin-typescript'))).default;
const nodeResolve = (await import(require.resolve('@rollup/plugin-node-resolve'))).default;
const commonjs = (await import(require.resolve('@rollup/plugin-commonjs'))).default;
const dtsModule = await import(require.resolve('rollup-plugin-dts'));
const dts = dtsModule.dts || dtsModule.default;

/**
 * compat 包：旧 @alicloud/cloud-charts@3.x 兼容层。
 * 内部转发到 @alicloud/cloud-charts-react / @alicloud/cloud-charts-core，全部走 peerDependencies 走 external，
 * 不内联打包，让用户的依赖链跟新包对齐。
 */
const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@alicloud/cloud-charts-core',
  '@alicloud/cloud-charts-react',
];

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.mjs', format: 'es', sourcemap: true },
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
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
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    external,
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
  },
];
