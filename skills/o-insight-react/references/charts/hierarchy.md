# Sunburst / Treemap / Hierarchy — 层级图（树形数据）

三者共享**单根树**数据结构，**不是系列数组**。区别在布局：
- `Sunburst` — 同心圆径向占比
- `Treemap` — 嵌套矩形占比（适合大量叶子）
- `Hierarchy` — 节点链接树（组织架构、分类树）；`polar:true` 转径向

## API

```tsx
import { Sunburst, Treemap, Hierarchy } from '@alicloud/cloud-charts-react';
import type { SunburstData, HierarchyData } from '@alicloud/cloud-charts-core';
```

## data 形状（三者一致，递归树）

```ts
interface TreeNode {
  name: string;
  value?: number;              // 叶子节点的值；父节点通常由子节点聚合
  children?: TreeNode[];
  [key: string]: unknown;
}
// SunburstData = TreeNode（单根，不是数组！）
// HierarchyData = TreeNode
```

## config 要点

| 组件 | 关键 config | 说明 |
|------|-------------|------|
| Sunburst | `cycle`、`innerRadius`、`legend`、`tooltip` | 径向 |
| Treemap | `legend`、`tooltip`、`label` | 矩形 |
| Hierarchy | `polar`(false)、`label`(true)、`legend`(false) | 节点链接；polar 转径向 |

## 示例

```tsx
const tree: SunburstData = {
  name: '公司',
  children: [
    { name: '研发', children: [{ name: '前端', value: 30 }, { name: '后端', value: 45 }] },
    { name: '市场', value: 25 },
  ],
};

<Sunburst data={tree} height={400} />
<Treemap data={tree} height={400} />
<Hierarchy data={tree} config={{ polar: false }} height={400} />
```

## 陷阱
- **不要传 `[{ name, data: [...] }]` 系列数组**——层级图是单个根对象。
- 叶子放 `value`，父节点一般不写 `value`（由子节点汇总）。
