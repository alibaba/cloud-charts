# 安装组件 — o-insight CLI

用 `@alicloud/cloud-charts-cli`（shadcn 风格）把图表组件装入项目。发布名带 scope：
`npx @alicloud/cloud-charts-cli@alpha ...`；全局/项目内安装后可用短命令 `o-insight` / `oi`。

## 两种方式

### A. 源码复制（默认，可改可控）
```bash
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie --react
```
- 组件源码 + 共享运行时 + core model 复制进项目（默认 `src/components/charts`、`src/lib/o-insight`）。
- 对 `@alicloud/cloud-charts-core` 的 import 自动改写为项目别名（默认 `@/lib/o-insight`）。
- 需在 `tsconfig.json` / `vite.config.ts` 配置对应路径别名。
- 从项目别名导入：`import { Bar } from '@/components/charts';`

### B. npm 依赖（跟随上游）
```bash
npx @alicloud/cloud-charts-cli@alpha add wbar --react --as-dep
npm install
```
- 写入 `package.json` 依赖（`@alicloud/cloud-charts-react` + `@alicloud/cloud-charts-core`）；`@alicloud/cloud-charts-core` 由 core 作为运行时依赖带入，不要显式安装。
- 从包名导入：`import { Bar } from '@alicloud/cloud-charts-react';`、类型从 `@alicloud/cloud-charts-core`。

## 常用命令

```bash
npx @alicloud/cloud-charts-cli@alpha init -t react              # 生成 o-insight.json
npx @alicloud/cloud-charts-cli@alpha add --all --react          # 全量
npx @alicloud/cloud-charts-cli@alpha add wbar -o src/widgets    # 指定目录
npx @alicloud/cloud-charts-cli@alpha add wbar --react --dry-run # 预演
npx @alicloud/cloud-charts-cli@alpha list                       # 查看可装组件
```

## 组件 id ↔ 组件名
CLI 用小写 id（`wbar`/`wline`/`wpie`...），React 组件名首字母大写（`Bar`/`Line`/`Pie`...）。

## 框架支持
- react：全部 23 图表 + KPI 部件
- solid：全部 23 图表（data/config）+ `<Chart spec />`（alpha）
- vanilla：走单图包 `@alicloud/cloud-charts-bar` 等（Angular/Vue/原生）
- vue：暂未实现（`-t vue` 会报错，用 vanilla 单图包过渡）
