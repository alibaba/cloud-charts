# Sankey — 桑基图（流向/转移）

展示节点间的流量流向，连线宽度=数值大小。数据是**图结构**，不是系列数组。

## API

```tsx
import { Sankey } from '@alicloud/cloud-charts-react';
import type { SankeyData, SankeyChartConfig } from '@alicloud/cloud-charts-core';
```

## data 形状（图：节点 + 连线）

```ts
interface SankeyNode { name: string; value?: number; }
interface SankeyEdge { source: string; target: string; value: number; }
interface SankeyData {
  nodes: SankeyNode[];
  links?: SankeyEdge[];    // 或用 edges（别名，二选一）
  edges?: SankeyEdge[];
}
```

## config 字段

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `nodeAlign` | 'left'\|'right'\|'center'\|'justify' | 'justify' | 节点对齐 |
| `nodeWidth` | number(0-1) | 0.005 | 节点宽度比 |
| `nodePadding` | number | 0.03 | 节点垂直间距 |
| `legend` | boolean\|object | false | |
| `tooltip` | boolean\|object | — | |

## 示例

```tsx
const data: SankeyData = {
  nodes: [{ name: '访问' }, { name: '注册' }, { name: '付费' }, { name: '流失' }],
  links: [
    { source: '访问', target: '注册', value: 500 },
    { source: '访问', target: '流失', value: 500 },
    { source: '注册', target: '付费', value: 200 },
    { source: '注册', target: '流失', value: 300 },
  ],
};
<Sankey data={data} height={400} />
```

## 陷阱
- `source`/`target` 必须是 `nodes` 里存在的 `name`，否则连线丢失。
- `links` 与 `edges` 二选一即可，都是同样的边数组。
