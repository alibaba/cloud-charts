# CloudCharts

![](https://img.shields.io/npm/v/@alicloud/cloud-charts?color=%23ff8200)

![CloudCharts](https://img.alicdn.com/tfs/TB1FfqtTGL7gK0jSZFBXXXZZpXa-2764-1488.png)

面向中后台的开箱即用图表库，让前端图表更简单。

[WebSite](https://cloud-charts.netlify.app/) | [国内镜像](http://cloud-charts.gitee.io/)


- 简单上手，开箱即用。

- React ES6 语法。

- 配置化图表，无需学习 G2 复杂的语法和数据映射。

- 一键切换主题。

## 1.0 全新来袭

[详细信息](https://www.yuque.com/docs/share/6f29041d-dab8-44c7-8848-fa376ee4e9e8)

- 全面拥抱 TypeScript

- 交互能力增强

- 平滑升级保障

- 大量优化迭代

## 安装

```bash
$ npm install @alicloud/cloud-charts --save
```

## 使用

1、 引入图表需要的组件

2、 传入数据和配置项

```jsx
import { Wcontainer, Wbar } from '@alicloud/cloud-charts';

// 准备一份数据列
const data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },
  {
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
  }
];

// 图表配置项
const options = {
  legend:{
    align: 'right'
  }
};

// 轻松绘制
function Demo() {
  return (
    <Wcontainer className="demos">
      <Wbar height="400" config={options} data={data} />
    </Wcontainer>
  );
}
```

一张柱状图就绘制成功了。

## 参与贡献

如果您在使用的过程中碰到问题，可以先通过 [Issues](https://github.com/alibaba/cloud-charts/issues) 看看有没有类似的 bug 或者建议。

如需提交代码，请遵从我们的 [贡献指南](https://github.com/alibaba/cloud-charts/blob/master/CONTRIBUTING.md) 。

## v3 预览（refactor/v3-monorepo 分支）

> ⚠️ **实验性**：以下内容位于 `refactor/v3-monorepo` 分支，尚未合并到 master。请勿在生产环境使用。

`refactor/v3-monorepo` 分支将 cloud-charts 从单体结构重构为 monorepo，迁移了 aisc-widgets 已验证的 v3 架构：

- **底层引擎**：G2 v4 → **G2 v5.4.8**（Spec Mode，AI 友好）
- **包结构**：`packages/core` + `packages/charts/*` 按需加载，单图表薄壳仅 0.5KB
- **多框架支持**：Vanilla JS、Angular 可直接使用 `@alicloud/cloud-charts-line`（无需 React 运行时）
- **构建产物**：`dist/index.{cjs,mjs,d.ts}`，支持 TypeScript / ESM / CJS 全场景

### 新包预览

```bash
# 安装核心运行时
npm install @alicloud/cloud-charts-core @antv/g2 --save

# 安装单图表包（按需）
npm install @alicloud/cloud-charts-line --save
```

### Vanilla JS 使用示例

参考 [`examples/cloud-charts-wline-vanilla-demo/`](./examples/cloud-charts-wline-vanilla-demo)：

```ts
import { renderWlineModel, type LineSeries } from '@alicloud/cloud-charts-line';

const { model } = renderWlineModel({
  container: document.getElementById('chart')!,
  data: [
    { name: 'QPS', data: [[timestamp1, 32], [timestamp2, 45]] },
  ],
  config: { xAxis: { type: 'time', mask: 'auto' } },
  context: { language: 'zh-CN' },
});

console.log('runtime model:', model.spec);
```

### 启动 demo

```bash
cd examples/cloud-charts-wline-vanilla-demo
npm install
npm run dev
# 浏览器打开 http://localhost:5179
```

### v3 开发命令（仓库根）

```bash
# 类型检查（core + wline）
npm run typecheck:packages

# 构建所有 v3 包
npm run build:packages

# 跑 wline 单测
cd packages/charts/wline && npm run test
```

### 包边界

| 包 | 路径 | 角色 |
| --- | --- | --- |
| `@alicloud/cloud-charts-core` | `packages/core/` | 框架无关运行时（G2 5.4.8 + model + native + adapter） |
| `@alicloud/cloud-charts-line` | `packages/charts/wline/` | 折线图 Vanilla JS 薄壳 |
| `@alicloud/cloud-charts-{wbar,wpie}` | `packages/charts/{wbar,wpie}/` | 占位骨架，后续 Phase 1 横向扩展 |

详细架构与迁移背景参考内部 [升级总览](https://code.alibaba-inc.com/aisc/aisc-widgets/blob/master/docs/upgrade-overview.md)。
