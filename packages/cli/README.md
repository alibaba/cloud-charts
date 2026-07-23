# @alicloud/cloud-charts-cli — `cloud-charts`

cloud-charts（cloud-charts）图表组件安装器，shadcn 风格。支持把组件**源码复制**到你的项目，或作为 **npm 依赖**安装。可选择框架、组件、安装目录。

## 快速开始

发布名为 `@alicloud/cloud-charts-cli`（npm 要求带 scope）。两种调用方式：

- **直接用 npx**：`npx @alicloud/cloud-charts-cli@alpha <command>`
- **安装后用短命令**：全局或项目内安装后，可用 `cloud-charts`（或 `oi`）命令
  ```bash
  npm i -g @alicloud/cloud-charts-cli@alpha   # 或 npm i -D @alicloud/cloud-charts-cli@alpha
  cloud-charts init -t react
  ```

```bash
# 初始化配置（生成 cloud-charts.json）
npx @alicloud/cloud-charts-cli@alpha init -t react

# 安装单个组件
npx @alicloud/cloud-charts-cli@alpha add wbar --react

# 安装多个
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie

# 安装全部
npx @alicloud/cloud-charts-cli@alpha add --all --react

# 仅添加 npm 依赖（不复制源码）
npx @alicloud/cloud-charts-cli@alpha add wbar --react --as-dep

# 指定安装目录 + 预演
npx @alicloud/cloud-charts-cli@alpha add wbar -o src/widgets --dry-run

# 查看可安装组件
npx @alicloud/cloud-charts-cli@alpha list
```

## AI 技能（Skills）

本包同时随包携带一套 AI 编码技能（Skill），指导 agent 用重构后的 cloud-charts 库或 G2 原生 spec 写图表代码。可一键安装到本地 agent 的技能目录（默认 `~/.qoder/skills`）。

```bash
# 查看可安装技能
npx @alicloud/cloud-charts-cli@alpha skills list

# 安装单个技能（默认到 ~/.qoder/skills）
npx @alicloud/cloud-charts-cli@alpha skills add cloud-charts-chart

# 安装全部技能到指定目录
npx @alicloud/cloud-charts-cli@alpha skills add --all --dir ~/.qoder/skills

# 覆盖已存在 / 预演
npx @alicloud/cloud-charts-cli@alpha skills add cloud-charts-react --overwrite
npx @alicloud/cloud-charts-cli@alpha skills add --all --dry-run
```

安装后重启 / 重新加载你的 agent（如 Qoder CLI）即可识别新技能。可安装的技能：

| 技能 | 说明 |
|---|---|
| `cloud-charts-chart` | 统一入口：按上下文分流到 G2 原生 spec 或组件 data/config 写法 |
| `cloud-charts-react` | React 组件 `<Bar>` 等 23 图表 |
| `cloud-charts-vanilla` | 框架无关的 `renderWxxxModel` 单图包写法 |
| `cloud-charts-g2-spec` | 用 `@alicloud/cloud-charts-core` 渲染手写 G2 v5 spec |
| `cloud-charts-viz` | 从想法/数据到可视化的高层引导 |
| `antv-g2-chart` | 上游 G2 v5 原生技能（MIT，随包携带） |

## 命令

| 命令 | 说明 |
|---|---|
| `init` | 生成 `cloud-charts.json` 配置 |
| `add [components...]` | 安装组件（源码复制 或 npm 依赖） |
| `list` | 列出组件及框架支持情况 |
| `diff <component>` | 比较本地与最新源码 |
| `skills <sub>` | 管理 AI 技能：`list` / `add [names...]` |

## 选项

- `-t, --framework <fw>` / `--react` / `--solid` / `--vanilla` — 目标框架
- `--source <next\|legacy>` — 源码来源：新架构 `@alicloud/cloud-charts-*` 或旧兼容层 `@alicloud/cloud-charts`
- `--all` — 该框架下全部组件
- `-o, --outDir <path>` — 覆盖安装目录
- `--as-dep` — 仅 npm 依赖，不复制源码
- `--overwrite` — 覆盖已存在文件
- `--dry-run` — 预演

## 框架支持

- **react** — 全部 23 图表 + 10 UI 组件（新架构）
- **solid** — 全部 23 图表（data/config）+ `<Chart spec />`（alpha）
- **vanilla** — 全部 23 图表（Angular / Vue / 原生，走单图 `@alicloud/cloud-charts-*` 包）
- **vue** — 计划中，尚未实现

## 配置 `cloud-charts.json`

```jsonc
{
  "framework": "react",
  "source": "next",          // next(新架构) | legacy(兼容层)
  "mode": "copy",            // copy(源码复制) | dep(npm 依赖)
  "paths": {
    "components": "src/components/charts",
    "core": "src/lib/cloud-charts"
  },
  "aliases": {
    "components": "@/components/charts",
    "core": "@/lib/cloud-charts"
  }
}
```

源码复制模式会把对 `@alicloud/cloud-charts-core` 的 import 改写为 `aliases.core`（如 `@/lib/cloud-charts`）。请在 `tsconfig.json` / `vite.config.ts` 中配置对应路径别名。

## npm 依赖模式

`--as-dep` 会显式写入 cloud-charts 的两层依赖，但不会写入底层 G2：

- React：`@alicloud/cloud-charts-react` + `@alicloud/cloud-charts-core`
- Solid：`@alicloud/cloud-charts-solid` + `@alicloud/cloud-charts-core`
- Vanilla：单图包（如 `@alicloud/cloud-charts-bar`）+ `@alicloud/cloud-charts-core`

`@antv/g2` 由 `@alicloud/cloud-charts-core` 作为内部运行时依赖带入，业务项目无需显式安装。

## 源码来源

发布包内已随包携带组件源码快照（`vendor/`，由 `prepublishOnly` 自动生成），因此**从已发布的包安装后无需 monorepo 即可使用**。

仅在本地开发、想让 CLI 读取实时 monorepo 源码时，用环境变量覆盖：

```bash
O_INSIGHT_SOURCE=/path/to/cloud-charts npx @alicloud/cloud-charts-cli@alpha add wbar --react
```

技能同理随包携带（`vendor/skills/`）。本地开发想读取实时 `skills/` 目录时：

```bash
O_INSIGHT_SKILLS_SOURCE=/path/to/cloud-charts/skills npx @alicloud/cloud-charts-cli@alpha skills list
```
