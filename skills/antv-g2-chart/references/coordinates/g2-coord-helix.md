---
id: "g2-coord-helix"
title: "G2 螺旋坐标系（helix）"
description: |
  螺旋坐标系将时间/顺序数据沿螺旋线排布，适合展示具有周期性规律的长时间序列。
  数据按螺旋盘绕，相同周期位置的数据点上下对齐，便于发现周期模式。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "helix"
  - "螺旋"
  - "螺旋图"
  - "周期"
  - "时间序列"
  - "coordinate"

related:
  - "g2-mark-interval-basic"
  - "g2-scale-time"

use_cases:
  - "展示多年日均气温的周期规律"
  - "股票价格长时间序列的周期分析"
  - "周/月/年周期性规律可视化"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/helix"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 生成一年的日均温度数据
const data = Array.from({ length: 365 }, (_, i) => ({
  day: i,
  temp: 15 + 12 * Math.sin((i / 365) * Math.PI * 2) + (Math.random() - 0.5) * 5,
}));

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'day',    // 顺序（沿螺旋排布）
    y: 'temp',   // 数值（映射为半径变化）
    color: 'temp',
  },
  scale: {
    color: { type: 'sequential', palette: 'rdYlBu' },
  },
  coordinate: {
    type: 'helix',
    startAngle: 0,              // 起始角度，默认 0
    endAngle: Math.PI * 6,      // 结束角度，默认 6π（3圈）
    innerRadius: 0.1,
    outerRadius: 0.9,
  },
  style: { lineWidth: 0 },
  legend: false,
});

chart.render();
```

## 配置项

```javascript
coordinate: {
  type: 'helix',
  startAngle: 0,              // 起始角度（弧度），默认 0
  endAngle: Math.PI * 6,      // 结束角度，默认 6π（3圈）
  innerRadius: 0,             // 内孔半径，默认 0
  outerRadius: 1,             // 外径比例，默认 1
}
```

## 常见错误与修正

### 错误：数据量太少，螺旋圈数太多——空白区域很大
```javascript
// ❌ 数据只有 12 个月却设置 6π（3圈），每圈只有 4 个点
chart.options({
  data: monthlyData,  // 只有 12 条
  coordinate: { type: 'helix', endAngle: Math.PI * 6 },
});

// ✅ 根据数据量调整圈数：endAngle = 圈数 × 2π
chart.options({
  coordinate: {
    type: 'helix',
    endAngle: Math.PI * 2,  // 1 圈，适合月度数据
  },
});
```

### 错误：样式设置不当导致图形不可见或渲染异常
```javascript
// ❌ 使用了 lineWidth: 0 和 interval 类型但未设置足够宽度，可能导致视觉上“消失”
chart.options({
  type: 'interval',
  coordinate: { type: 'helix' },
  style: { lineWidth: 0 },
});

// ✅ 设置合适的 lineWidth 或调整图形类型如 point 更适合细粒度数据
chart.options({
  type: 'point', // 对于大量密集数据更合适
  style: { lineWidth: 2 },
});
```

### 错误：动画类型与图形元素不兼容导致无动画效果
```javascript
// ❌ growInY 动画可能不适用于所有 helix 场景下的 interval 元素
chart.options({
  animate: {
    enter: {
      type: 'growInY',
    }
  }
});

// ✅ 使用 fadeIn 等通用动画类型确保兼容性
chart.options({
  animate: {
    enter: {
      type: 'fadeIn',
      duration: 2000,
    }
  }
});
```
