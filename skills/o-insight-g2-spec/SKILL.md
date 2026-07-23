---
name: cloud-charts-g2-spec
description: Use the cloud-charts (@alicloud/cloud-charts-core) library with raw G2 v5 spec — render a hand-written G2 spec through the library's renderer/native controller, or feed raw G2 records into the wrapped components via config.dataType='g2' and merge raw G2 sub-specs via config.customConfig. Use when the user wants full G2 v5 control (custom marks/encode/scale/transform/coordinate), already has a G2 spec to reuse, needs an escape hatch the flat config does not expose, or asks to combine our theme/state with native G2. Keywords: G2 spec, G2 v5, createChart, renderG2Spec, defaultG2Renderer, dataType g2, customConfig, ChartSpec, 原始 spec, 原生 G2, 逃生舱.
---

# cloud-charts × 原生 G2 v5 Spec

本 skill 负责在 **cloud-charts 重构库**里使用 **G2 v5 原始 spec**。库是对 G2 的组件化封装，
但**没有锁死** G2 底层——它暴露了三条从「组件化」通往「写原生 G2 spec」的通路。当封装的
`data + config` 表达不了需求（自定义 mark、encode、transform、coordinate、多视图 composition 等）
时，用本 skill 直接写 G2 spec，同时**尽量保留库的主题/状态能力**。

> 何时用哪个 skill：
> - 只想把组件写对（data/config、Provider）→ `cloud-charts-react`（React）/ `cloud-charts-vanilla`（原生/单图）。
> - 还没决定画什么图 → 先 `cloud-charts-viz`。
> - **需要 G2 原生 spec 的表达力** → 本 skill。

---

## 1. 核心约束 / Core Constraints (MUST follow)

1. **`ChartSpec` 就是 G2 v5 spec 的别名**。从 `@alicloud/cloud-charts-core` 导入类型 `ChartSpec`，
   它等价于 `new Chart().options(...)` 接收的对象。写它就是写标准 G2 v5：
   `{ type, data, encode, scale, transform, coordinate, axis, legend, tooltip, children, ... }`。
   **禁止**臆造非 G2 字段——不确定的字段以 G2 v5 官方 spec 为准。
2. **三条通路，按需选择**（详见第 2 节）：
   - **通路 A｜纯原生**：`createChart({ container, spec, renderer })` 或 `renderG2Spec(renderer, container, spec)`。
     100% G2 spec，**不经过**库的 normalize/rules/theme 管线。
   - **通路 B｜组件 + `dataType:'g2'`**：仍用 `<Bar>`/`renderWbarModel` 等封装，但
     `config.dataType='g2'` 让库**旁路数据归一化**，把你的**原始 G2 记录**原样喂给 G2；
     其余管线（主题/图例/状态）仍生效。
   - **通路 C｜`customConfig` 逃生舱**：封装组件上，用 `config.customConfig` 把**原生 G2 子 spec**
     深合并进 axis / legend / tooltip 等子结构。局部逃生，不整体接管。
3. **`renderer` 必须显式提供**。native API 不内建 G2，需传 `G2SpecRenderer`。
   直接用库导出的 `defaultG2Renderer`（内部 `new Chart({container, autoFit:true})`）；
   要改 G2 主题/关 autoFit/自定义 padding 时，自己实现 `G2SpecRenderer` 传入。
4. **通路 A 不套主题**。`createChart`/`renderG2Spec` 是「裸」G2 渲染，**不会**应用 cloud-charts
   的 `normal/dark/yunxiao` 主题，也没有 loading/empty/error 覆盖层。需要主题+状态时用**通路 B**。
5. **容器由调用方管理**。native API 接收 `HTMLElement`（不是 selector 字符串），
   且**不负责**尺寸——容器需有确定宽高，否则 `autoFit` 无从计算。
6. **生命周期要闭环**。`createChart` 返回 controller，必须在卸载时 `destroy()`；
   数据流更新优先 `changeData(nextData)`（只换 data，不重建 axis/legend），
   结构变更用 `update(nextSpec)`。**禁止**丢弃 controller 造成实例泄漏。
7. **`dataType:'g2'` 会改变 data 语义，但不改 TS 类型**。开启后 `data` 应是**G2 平铺记录**
   （`Array<Record<string, primitive>>`），而**不是**库的「系列+元组」结构。TS 上形参类型仍是
   `BarSeries[]` 等，**不会报错**——这是已知的类型宽松点，务必按运行期语义传 G2 记录。
8. **`customConfig` 是深合并进子 spec，不是根 spec**。它被 `deepMerge` 到 axis/legend/tooltip
   等**局部**结构里，**不能**用来替换整张图的 `type`/`encode`/`data`。要改根结构请用通路 A/B。

<!-- CONSTRAINTS:END -->

---

## 2. 三条通路 / Three Paths

### 通路 A — 纯原生 spec（最大控制，无库主题）

\`\`\`ts
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec, G2ChartLike } from '@alicloud/cloud-charts-core';

const spec: ChartSpec = {
  type: 'interval',
  data: [ { month: '1月', value: 120 }, { month: '2月', value: 200 } ],
  encode: { x: 'month', y: 'value' },
  axis: { y: { title: '销量' } },
};

const container = document.getElementById('chart')!; // 需有确定宽高
const controller = createChart<G2ChartLike>({ container, spec, renderer: defaultG2Renderer });
controller.render();

// 更新 / 卸载
controller.changeData([ { month: '1月', value: 90 } ]); // 仅换数据
controller.update({ ...spec, type: 'line' });            // 换结构
controller.destroy();
\`\`\`

一次性渲染（不需要后续更新）可用便捷函数：

\`\`\`ts
import { renderG2Spec, defaultG2Renderer } from '@alicloud/cloud-charts-core';
const chart = renderG2Spec(defaultG2Renderer, container, spec); // 内部已 render()
\`\`\`

自定义渲染器（改 G2 主题 / 关闭 autoFit）：

\`\`\`ts
import { Chart } from '@antv/g2';
import type { G2SpecRenderer, ChartSpec } from '@alicloud/cloud-charts-core';

const myRenderer: G2SpecRenderer<Chart> = {
  createChart: (container) => new Chart({ container, autoFit: false, width: 600, height: 360, theme: 'classicDark' }),
  applySpec: (chart, spec: ChartSpec) => chart.options(spec),
  destroyChart: (chart) => chart.destroy(),
};
createChart({ container, spec, renderer: myRenderer }).render();
\`\`\`

### 通路 B — 封装组件 + \`dataType:'g2'\`（保留库主题/状态）

当你想**保留 cloud-charts 的主题、图例、loading/empty/error**，但**数据已是 G2 平铺记录**、
不想被库的「系列+元组」归一化时：

\`\`\`tsx
// React：data 传 G2 平铺记录，config.dataType='g2' 旁路 normalize
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';

const g2Records = [
  { type: '线上', month: '1月', value: 120 },
  { type: '线上', month: '2月', value: 200 },
  { type: '线下', month: '1月', value: 80 },
];

<ChartProvider theme="dark">
  <Bar
    data={g2Records as any}          // 运行期为 G2 记录；TS 形参仍是 BarSeries[]（已知宽松点）
    config={{
      dataType: 'g2',
      // 指定 encode/颜色维度时，配合 customConfig 注入原生 G2 子 spec
      customConfig: { encode: { x: 'month', y: 'value', color: 'type' } },
    }}
    height={320}
  />
</ChartProvider>
\`\`\`

> vanilla 同理：`renderWbarModel({ container, data: g2Records, config: { dataType:'g2', customConfig:{...} } })`。

### 通路 C — \`customConfig\` 局部逃生舱

只想改某个子结构（轴/图例/提示）为原生 G2 写法，其余保持封装：

\`\`\`tsx
<Line
  data={series}
  config={{
    customConfig: {
      // 深合并进对应子 spec（axis / legend / tooltip），不接管根 spec
      axis: { y: { labelFormatter: (v: number) => \`\${v}%\`, tickCount: 5 } },
    },
  }}
/>
\`\`\`

---

## 3. 通路选择 / Which path?

| 需求 | 通路 | 理由 |
|------|------|------|
| 自定义 mark / 多视图 composition / 完整 G2 表达力 | A（\`createChart\`+spec） | 100% G2，不受封装约束 |
| 已有现成 G2 spec 想直接复用 | A | 原样 \`chart.options(spec)\` |
| 数据已是 G2 记录，但想要库主题+状态 | B（\`dataType:'g2'\`） | 旁路归一化，保留管线 |
| 只想改轴/图例/提示的个别 G2 细节 | C（\`customConfig\`） | 局部深合并，最小侵入 |
| 常规柱/线/饼，数据是系列+元组 | 都不用 → \`cloud-charts-react\`/\`cloud-charts-vanilla\` | 封装已够用 |

---

## 4. 常见错误 / Common Mistakes

\`\`\`ts
// ❌ 把 selector 字符串当容器
createChart({ container: '#chart', spec, renderer: defaultG2Renderer });
// ✅ 传 HTMLElement
createChart({ container: document.getElementById('chart')!, spec, renderer: defaultG2Renderer });

// ❌ 忘了传 renderer（native API 不内建 G2）
createChart({ container, spec });
// ✅ 显式提供
createChart({ container, spec, renderer: defaultG2Renderer });

// ❌ 期望通路 A 有 cloud-charts 主题 / loading 态
renderG2Spec(defaultG2Renderer, container, spec); // 裸 G2，无主题无状态
// ✅ 要主题+状态就走通路 B（组件 + dataType:'g2'）

// ❌ dataType:'g2' 时还传「系列+元组」结构
<Bar data={[{ name:'A', data:[['1月',120]] }]} config={{ dataType:'g2' }} />
// ✅ dataType:'g2' 时传 G2 平铺记录
<Bar data={[{ month:'1月', value:120 }] as any} config={{ dataType:'g2', customConfig:{ encode:{x:'month',y:'value'} } }} />

// ❌ 用 customConfig 想替换整张图的 type/data（它只深合并进子 spec）
config={{ customConfig: { type: 'line', data: [...] } }}
// ✅ 换根结构请用通路 A/B

// ❌ 丢弃 controller → G2 实例泄漏
createChart({ container, spec, renderer }).render();
// ✅ 保存引用，卸载时 destroy()
const c = createChart({ container, spec, renderer }); c.render(); /* … */ c.destroy();
\`\`\`

---

## 5. 参考 / References

- \`references/native-api.md\` — \`createChart\`/\`renderChart\`/\`renderG2Spec\`/\`defaultG2Renderer\`
  完整签名、\`NativeChartInstance\` 方法（render/update/changeData/resize/destroy）、
  自定义 \`G2SpecRenderer\` 写法与 React \`useEffect\` 生命周期封装。
- \`references/escape-hatches.md\` — \`dataType:'g2'\`（旁路 normalize 的确切语义、data 形状变化）
  与 \`customConfig\`（深合并进哪些子 spec、能改什么/不能改什么）逐项说明与示例。
- 精确字段以源码为准：\`packages/core/src/native/index.ts\`（native controller）、
  \`packages/core/src/renderers/defaultG2Renderer.ts\`（默认渲染器）、
  \`packages/core/src/adapters/g2/index.ts\`（\`renderG2Spec\`/\`G2SpecRenderer\`）、
  \`packages/core/src/model/createChartModel.ts:47-52\`（\`dataType:'g2'\` 旁路点）。
