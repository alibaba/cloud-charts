---
name: cloud-charts-migration
description: Internal-to-open-source migration workflow for cloud-charts. Use when migrating packages from an internal npm registry (aisc-widgets / @alife/*) to public npm (@alicloud/*), sanitizing internal identifiers, aligning package.json metadata, and verifying zero regressions. Covers batch migration (B0-B6), G2 v4/v5 coexistence, rollup path resolution, storybook dual-config, and full-repo grep audit.
---

# cloud-charts 内网→开源迁移 SKILL

本 skill 记录从内网 `aisc-widgets`（`@alife/*`，gitlab + anpm）迁移到开源 `cloud-charts`（`@alicloud/*`，github + npmjs，MIT）的完整流程。
适用于后续新增包迁移、持续迭代、或同类内网→开源仓库迁移场景。

---

## 1. 迁移架构总览

```
内网 aisc-widgets                    开源 cloud-charts
(@alife/*, anpm, gitlab)    →       (@alicloud/*, npmjs, github, MIT)
├── packages/core              ──→  packages/core
├── packages/charts/* (23)     ──→  packages/charts/* (23)
├── packages/frameworks/react  ──→  packages/frameworks/react
├── packages/frameworks/solid  ──→  packages/frameworks/solid
├── packages/compat            ──→  packages/compat
├── packages/cli               ──→  packages/cli
├── skills/                    ──→  skills/
└── examples/*                 ──→  examples/*
```

### 包名映射

| 内网包名 | 开源包名 |
|---------|---------|
| `@alife/cloud-core` | `@alicloud/cloud-charts-core` |
| `@alife/cloud-{chart}` | `@alicloud/cloud-charts-{chart}` |
| `@alife/aisc-widgets` | `@alicloud/cloud-charts` |
| `@alife/aisc-widgets-compat` | `@alicloud/cloud-charts-compat` |
| `@alife/aisc-widgets-react` | `@alicloud/cloud-charts-react` |
| `@alife/aisc-widgets-solid` | `@alicloud/cloud-charts-solid` |
| `@alife/aisc-widgets-cli` | `@alicloud/cloud-charts-cli` |

---

## 2. 净化映射表

迁移时必须对同步过来的文件做以下文本替换（按优先级排序）：

| # | 匹配模式 | 替换为 | 说明 |
|---|---------|-------|------|
| 1 | `@alife/cloud-core` | `@alicloud/cloud-charts-core` | core 包名 |
| 2 | `@alife/cloud-{chart}` | `@alicloud/cloud-charts-{chart}` | 单图表包名 |
| 3 | `@alife/aisc-widgets` | `@alicloud/cloud-charts` | 整包名 |
| 4 | `@alife/aisc-widgets-compat` | `@alicloud/cloud-charts-compat` | compat 包名 |
| 5 | `@alife/aisc-widgets-react` | `@alicloud/cloud-charts-react` | React 包名 |
| 6 | `@alife/aisc-widgets-solid` | `@alicloud/cloud-charts-solid` | Solid 包名 |
| 7 | `@alife/aisc-widgets-cli` | `@alicloud/cloud-charts-cli` | CLI 包名 |
| 8 | `aisc-widgets` | `cloud-charts` | 仓库名/路径引用 |
| 9 | `aisc-` (CSS 前缀) | `cc-` | CSS class/keyframe 标识符 |
| 10 | `AISC` | `cloud-charts` | 品牌名（非 CSS） |
| 11 | `anpm` | `npm` | 包管理器引用 |
| 12 | `tnpm` | `npm` | 包管理器引用 |
| 13 | `registry.npm.alibaba-inc.com` | `registry.npmjs.org` | npm registry URL |
| 14 | `anpm.alibaba-inc.com` | `npmjs.org` | 内网域名 |
| 15 | `*.alibaba-inc.com` URL | `(内部链接已移除)` | 内网文档链接 |
| 16 | `O-Insight` / `o-insight` | `cloud-charts` | 内部项目代号 |
| 17 | `@aisc/charts-*` | `@alicloud/cloud-charts-*` | 老 Angular 引用格式 |

### 净化白名单（保留不改）

| 模式 | 原因 |
|------|------|
| `data-aisc-theme` | 老 SCSS 主题选择器白名单，运行时依赖 |
| `@alife/aisc-core`（CHANGELOG 历史记录） | 历史变更记录，不修改 |
| `@alife/cloud-{chart}`（CHANGELOG 历史记录） | 历史变更记录，不修改 |

---

## 3. 批次迁移流程

### B0: core 基线收敛

1. **同步源码**：`rsync -av --delete` 从内网 repo 同步 `packages/core/src/`
2. **净化**：按映射表批量 sed 替换
3. **版本对齐**：`package.json` version → `alpha.4`
4. **导出补全**：确认 `src/index.ts` 导出 compat 所需的 `builtInThemeTokens`
5. **验收**：typecheck + build + vitest + storybook:v3 + grep 净化 + 老 src/ 零改动

### B1-a/b/c: 23 个图表包迁移

每批 7-8 个包，统一流程：

1. **rsync 同步**：`packages/charts/{wxxx}/` 全量同步
2. **sed 净化**：按映射表替换包名、import 路径、CSS 前缀
3. **package.json 对齐**：version → alpha.4、license → MIT、publishConfig → npmjs.org
4. **rollup.config.mjs 路径**：确认 `createRequire(resolve(__dirname, '../../../examples/cloud-charts-wline-vanilla-demo/node_modules/.package-lock.json'))` 路径正确
5. **stories-v3 生成**：创建 `{chart}.stories.jsx`，使用 `CompareTwoCols` 双列对比模式
6. **.storybook-v3/main.js**：添加 alias `@alicloud/cloud-charts-{chart}$` → `packages/charts/{wxxx}/src/index.ts`
7. **验收**：typecheck + build + storybook:v3 构建 exit:0

### B2: React 整包 + react-demo

1. **rsync 同步**：`packages/frameworks/react/` 全量同步（60 文件）
2. **sed 净化**：`aisc-widgets` → `cloud-charts`、`aisc-` → `cc-`、`AISC` → `cloud-charts`
3. **typecheck 修复**：
   - `Wplaceholder` props 不接受 `state` → 改为 `empty`
   - 其他属性不匹配问题
4. **react-demo 同步**：examples 中的 react demo 同步 + 净化 + vite build

### B3: compat + 整包 2.0.0

1. **compat 同步**：28 文件 rsync + 净化
2. **typecheck 修复**：`builtInThemeTokens` 未从 core 主入口导出 → 在 `core/src/index.ts` 添加 re-export
3. **版本切换**：根 `package.json` version → `2.0.0`
4. **老 stories 回归**：老 storybook 构建 + 老 src/ typecheck 零错误

### B4: 发布准备

1. **审计**：检查所有 package.json 的 publishConfig、license、version 一致性
2. **批量修复**：node 脚本统一 24 个包（version → alpha.4、license → MIT、publishConfig → npmjs.org）
3. **全仓 grep**：确认 `@aisc/`、`aisc-widgets`、`anpm`、`@alife/`（非 CHANGELOG）零残留
4. **根 package.json**：version → 2.0.0、publishConfig → npmjs.org、license → MIT

### B5: Solid + CLI/skills + Angular demo

1. **Solid 同步**：37 文件 + package.json 对齐 + typecheck + build
2. **CLI 同步**：571 文件 + vendor 目录 `aisc-` → `cc-` 替换
3. **skills 同步**：261 文件净化
4. **Angular demo 同步**：2 个 demo + 选择器/组件名替换
5. **.gitignore 补全**：`.angular/`、`examples/*/dist/`、`packages/charts/*/dist/`、`skills/*-workspace/`

### B6: SKILL 沉淀

本文档即为 B6 产物。

---

## 4. 关键技术决策

### 4.1 G2 v4/v5 共存

- 老 `src/` 使用 `@antv/g2@^4.2.9`（链式 API）
- 新 `packages/core` 使用 `@antv/g2@~5.4.8`（Spec Mode）
- npm workspaces hoisting 后两者不冲突：根 `node_modules/@antv/g2` = v4，`packages/core/node_modules/@antv/g2` = v5
- storybook alias `@antv/g2$` → G2 v5 UMD bundle

### 4.2 rollup 工具链路径

所有子包的 `rollup.config.mjs` 通过 `createRequire` 从 `examples/cloud-charts-wline-vanilla-demo/node_modules/` 解析 rollup 插件。需要：
1. vanilla-demo 目录名必须包含 `wline-vanilla-demo`（或创建符号链接）
2. 缺失的 devDependencies 需安装到 vanilla-demo：`@rollup/plugin-babel`、`babel-preset-solid`、`solid-js`

### 4.3 整包内联策略

- 2.0.0 只发布 `@alicloud/cloud-charts`（整包）
- 子包版本 `alpha.4` 独立发布，供按需加载用户使用
- compat 包提供 `<Wline>` 等 React 组件的无感升级路径

### 4.4 stories-v3 对比模式

- `CompareTwoCols` 组件：左列 vanilla `renderWxxxModel`（v3 包），右列老 React `Wxxx` 组件（G2 v4）
- 用于验证新架构与老组件的渲染一致性
- `.storybook-v3/main.js` 为全部 23 个图表包 + core + react 添加 webpack alias

---

## 5. 验收清单

每个批次完成后执行以下验证：

| 检查项 | 命令 | 通过标准 |
|-------|------|---------|
| typecheck | `npx tsc --noEmit -p packages/core/tsconfig.json` | 0 errors |
| build | `npm run build -w packages/{path}` | exit:0，dist/ 产出 |
| storybook:v3 | `npm run storybook:v3 -- --smoke-test` | exit:0 |
| grep 净化 | `grep -rn '@aisc/\|aisc-widgets\|anpm' --exclude-dir={node_modules,dist,.angular,build,es,lib,.history}` | 0 matches（CHANGELOG 历史记录除外） |
| 老 src/ 回归 | `git status --short src/` | 零改动 |
| 老 typecheck | `npx tsc --noEmit` | 0 errors |

---

## 6. 常见问题与解决方案

### 6.1 node-sass 构建失败（Node 22/24 + arm64）

**现象**：`npm rebuild node-sass` 失败，gyp v8.4.1 不兼容 Node 22+

**解决**：node-sass 9.0.0 已废弃，无法在新 Node 上构建。老链路回归降级为 typecheck 验证（老 src/ 零改动 + 零类型错误即可）

### 6.2 Wplaceholder props 不匹配

**现象**：`Property 'state' does not exist on type 'WplaceholderProps'`

**根因**：`Wlistcontainer` 使用 `<Wplaceholder state="empty" />`，但 `Wplaceholder` 的 props 定义是 `empty?: boolean`

**解决**：改为 `<Wplaceholder empty />`

### 6.3 builtInThemeTokens 未导出

**现象**：compat 包 typecheck 报 `Module '"@alicloud/cloud-charts-core"' has no exported member 'builtInThemeTokens'`

**根因**：core 的 `runtime/theme/index.ts` 有 `builtInThemeTokens` 但主入口 `src/index.ts` 未 re-export

**解决**：在 `core/src/index.ts` 的 theme 导出行添加 `builtInThemeTokens`

### 6.4 Solid build 缺失依赖

**现象**：`Cannot find module '@rollup/plugin-babel'` / `babel-preset-solid`

**解决**：在 `examples/cloud-charts-wline-vanilla-demo` 安装缺失依赖：
```bash
npm install @rollup/plugin-babel babel-preset-solid solid-js --save-dev --ignore-scripts
```

### 6.5 rollup.config.mjs 路径不匹配

**现象**：rollup 配置引用 `wline-vanilla-demo` 但实际目录是 `cloud-charts-wline-vanilla-demo`

**解决**：创建符号链接 `ln -sf cloud-charts-wline-vanilla-demo wline-vanilla-demo`

### 6.6 Angular demo sed 失败

**现象**：`sed -i '' ...` 报 "Operation not permitted"

**根因**：沙箱权限限制

**解决**：改用 SearchReplace 工具（而非 sed 命令）修改文件

### 6.7 Wsunburst 命名导出 vs default export

**现象**：Wsunburst 在老 src/ 中是命名导出（非 default export）

**解决**：stories-v3 中使用 `{ Wsunburst }` 而非 `Wsunburst` 默认导入

---

## 7. 迁移后审计

### 7.1 package.json 审计

每个包必须包含：
- `name`: `@alicloud/cloud-charts-*`
- `version`: `alpha.4`（子包）或 `2.0.0`（整包）
- `license`: `MIT`
- `publishConfig`: `{ "registry": "https://registry.npmjs.org", "access": "public" }`
- `repository`: 指向 github.com/alibaba/cloud-charts

### 7.2 全仓 grep 审计

```bash
# 以下命令应返回 0 matches（CHANGELOG.md 历史记录除外）
grep -rn '@aisc/' --exclude-dir={node_modules,dist,.angular,build,es,lib,.history}
grep -rn 'aisc-widgets' --exclude-dir={node_modules,dist,.angular,build,es,lib,.history}
grep -rn 'anpm' --exclude-dir={node_modules,dist,.angular,build,es,lib,.history}
grep -rn 'alibaba-inc.com' --exclude-dir={node_modules,dist,.angular,build,es,lib,.history}
```

### 7.3 .gitignore 审计

确保以下目录被忽略：
- `packages/*/dist/`、`packages/charts/*/dist/`、`packages/frameworks/*/dist/`
- `examples/*/dist/`、`examples/*/package-lock.json`
- `.angular/`
- `skills/*-workspace/`

---

## 8. 参考文件

- 迁移计划原文：`Plans/rustling-kindling-melody.md`
- core 主入口：`packages/core/src/index.ts`
- storybook v3 配置：`.storybook-v3/main.js`
- stories-v3 模板：`stories-v3/bar.stories.jsx`
- 根 package.json：`package.json`（version 2.0.0）
