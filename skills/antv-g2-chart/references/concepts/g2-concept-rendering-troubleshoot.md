---
id: "g2-concept-rendering-troubleshoot"
title: "G2 图表渲染排查清单"
description: |
  G2 v5 图表不显示或部分不显示时的排查指南，涵盖 chart.render() 缺失、
  多次 chart.options() 覆盖、encode 字段名不匹配、mark type 不存在、
  自定义 HTML 样式不生效等常见问题及修复方案。

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "渲染失败"
  - "图表不显示"
  - "排查"
  - "troubleshoot"
  - "debug"
  - "render"
  - "encode"
  - "field"

related:
  - "g2-core-chart-init"
  - "g2-core-view-composition"
  - "g2-comp-label-config"

use_cases:
  - "图表没有成功渲染"
  - "部分图表不显示"
  - "指标卡片/自定义 HTML 样式不生效"
  - "图表空白无内容"
  - "mark 静默不渲染"

difficulty: "beginner"
completeness: "full"
created: "2025-06-04"
updated: "2025-06-04"
author: "antv-team"
---

## 快速排查清单

图表不显示时，按以下顺序检查：

| # | 检查项 | 常见表现 |
|---|--------|---------|
| 1 | 缺少 `chart.render()` | 图表完全空白 |
| 2 | 多次调用 `chart.options()` | 只有最后一次的 mark 显示 |
| 3 | `encode` 字段名与 data 不匹配 | mark 静默不渲染 |
| 4 | 使用了不存在的 mark type | 运行时报错或空白 |
| 5 | `data` 不是数组 | mark 静默跳过 |
| 6 | `children` 嵌套 `view` | 子视图不渲染 |
| 7 | 填充色与背景色一致 | 图形存在但不可见 |
| 8 | innerHTML/render 样式不生效 | 自定义 HTML 显示异常 |

---

## 1. 缺少 `chart.render()`

代码末尾没有调用 `chart.render()`，图表不会显示。

```javascript
// ❌ 错误：缺少 render 调用
const chart = new Chart({ container: 'container' });
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
// 图表空白

// ✅ 正确：必须调用 render
const chart = new Chart({ container: 'container' });
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.render();
```

## 2. 多次调用 `chart.options()` 导致覆盖

`chart.options()` 是**全量替换**——多次调用只有最后一次生效。

```javascript
// ❌ 错误：第一次 options 被第二次完全覆盖，柱状图不渲染
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.options({ type: 'line', data, encode: { x: 'x', y: 'y' } });
chart.render(); // 只有折线图

// ✅ 正确：用 view + children 叠加多个 mark
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
chart.render();
```

## 3. `encode` 字段名与 data 不匹配

G2 通过 `data.map(d => d[fieldName])` 提取数据列。如果字段名不匹配，得到的是全 `undefined` 数组——**不会报错**，但 mark 不渲染或渲染为不可见状态。

```javascript
// ❌ 错误：data 中是 'Name'（大写），encode 写了 'name'（小写）
const data = [
  { Name: '张三', Score: 80 },
  { Name: '李四', Score: 95 },
];
chart.options({
  type: 'interval',
  data,
  encode: { x: 'name', y: 'score' },  // ❌ 大小写不匹配
});

// ✅ 正确：字段名完全一致
chart.options({
  type: 'interval',
  data,
  encode: { x: 'Name', y: 'Score' },
});
```

**排查方法**：打印 `data[0]` 的 key，与 encode 中引用的字段名逐一比对。

## 4. 使用了不存在的 mark type

G2 v5 的合法 mark 类型是固定列表，使用不存在的类型会报错或静默失败。

```javascript
// ❌ 错误：'bar' 在 G2 中不存在
chart.options({ type: 'bar', data, encode: { x: 'x', y: 'y' } });

// ✅ 正确：柱状图用 'interval'，横向柱状图用 coordinate transpose
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  coordinate: { transform: [{ type: 'transpose' }] },
});

// ❌ 错误：'radar' 在 G2 中不存在
chart.options({ type: 'radar', data, encode: { x: 'item', y: 'score' } });

// ✅ 正确：雷达图用 polar 坐标 + area/line
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score' }, style: { lineWidth: 2 } },
  ],
});
```

## 5. `data` 不是数组

G2 内部会检查 `Array.isArray(data)`，如果不是数组直接返回 `null`，mark 静默跳过。

```javascript
// ❌ 错误：data 是对象不是数组
chart.options({ type: 'interval', data: { x: 'a', y: 1 }, encode: { x: 'x', y: 'y' } });

// ✅ 正确：data 必须是数组
chart.options({ type: 'interval', data: [{ x: 'a', y: 1 }], encode: { x: 'x', y: 'y' } });
```

## 6. `children` 嵌套 `view`

`children` 内不能再有 `type: 'view'` + `children`（禁止嵌套）。

```javascript
// ❌ 错误：children 内嵌套 view
chart.options({
  type: 'view',
  children: [
    { type: 'view', children: [{ type: 'interval', ... }] },  // ❌
  ],
});

// ✅ 正确：子项直接是 mark，复杂布局用 spaceLayer
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
```

## 7. 填充色与背景色一致

图形存在但肉眼不可见——常见于白色背景 + 白色填充，或深色背景 + 深色图形。

```javascript
// ❌ 错误：白色背景 + 白色填充 → 图形不可见
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  style: { fill: '#fff' },
});

// ✅ 正确：使用有区分度的颜色，或依赖 G2 默认配色
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y', color: 'category' },
});
```

## 8. innerHTML/render 自定义 HTML 样式不生效

### 问题：指标卡片/自定义 HTML 元素样式看起来没效果

**原因 1**：外部 CSS class 被容器隔离，样式不生效。

```javascript
// ❌ 错误：依赖外部 class
innerHTML: (d) => `<div class="card">${d.value}</div>`,

// ✅ 正确：使用 inline style
innerHTML: (d) => `<div style="padding: 12px 16px; background: #f0f5ff; border-radius: 8px; font-size: 14px; font-weight: bold; color: #333;">${d.value}</div>`,
```

**原因 2**：`fill` 和 `color` 混淆。在 innerHTML/render 模式下：
- `fill` 控制背景色（有时默认黑色）
- `color` 控制文本颜色

```javascript
// ❌ 错误：背景黑色遮盖内容
labels: [{
  innerHTML: (d) => `<div style="padding: 4px;">${d.value}</div>`,
  style: { color: '#333' },  // 缺少 fill 设置，背景可能为黑
}]

// ✅ 正确：显式设置 fill 为透明或白色
labels: [{
  innerHTML: (d) => `<div style="padding: 4px;">${d.value}</div>`,
  style: { fill: 'rgba(0,0,0,0)', color: '#333' },
}]
```

**原因 3**：卡片未设置明确尺寸，被父容器压缩。

```javascript
// ✅ 确保卡片有明确的宽高和 padding
innerHTML: (d) => `
  <div style="
    width: 120px;
    padding: 12px 16px;
    background: #f0f5ff;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    text-align: center;
  ">
    <div style="font-size: 24px; font-weight: bold; color: #1890ff;">${d.value}</div>
    <div style="font-size: 12px; color: #666; margin-top: 4px;">${d.label}</div>
  </div>
`,
```

## 9. children 中子 mark 不显示

当 `type: 'view'` 的 data 在 view 级别声明，但子 mark 引用了 view data 中不存在的字段时，该子 mark 静默不渲染。

```javascript
// ❌ 错误：text mark 引用了 view data 中不存在的字段 'annotation'
chart.options({
  type: 'view',
  data: [{ x: '1月', y: 100 }, { x: '2月', y: 200 }],
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'text', encode: { x: 'x', y: 'y', text: 'annotation' } }, // ❌ 字段不存在
  ],
});

// ✅ 正确：子 mark 需要不同字段时，单独声明 data
chart.options({
  type: 'view',
  data: mainData,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    {
      type: 'text',
      data: annotationData,  // 单独的数据源
      encode: { x: 'x', y: 'y', text: 'annotation' },
    },
  ],
});
```
