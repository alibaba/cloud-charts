---
id: "g2-pattern-responsive"
title: "G2 响应式图表适配"
description: |
  在不同屏幕尺寸和容器大小下自适应图表宽高、字体、边距等配置。
  涵盖 autoFit 配置、ResizeObserver 动态调整以及移动端适配常见问题。

library: "g2"
version: "5.x"
category: "patterns"
tags:
  - "响应式"
  - "responsive"
  - "自适应"
  - "autoFit"
  - "resize"
  - "移动端"
  - "容器尺寸"

related:
  - "g2-core-chart-init"

use_cases:
  - "图表随浏览器窗口/容器大小变化自动调整"
  - "移动端和桌面端共用同一图表组件"
  - "嵌入弹框/侧边栏等动态尺寸容器"

difficulty: "intermediate"
completeness: "full"
---

## G2 自适应宽度（autoFit）

```javascript
import { Chart } from '@antv/g2';

// 方案 1：autoFit: true（宽度自动适配容器，高度固定）
const chart = new Chart({
  container: 'container',
  autoFit: true,     // 宽度 = 容器宽度，高度使用默认值
  height: 400,       // 高度固定
});

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## ResizeObserver 动态响应容器变化

```javascript
// 方案 2：监听容器尺寸变化，手动调整图表
const container = document.getElementById('container');
const chart = new Chart({
  container: 'container',
  width: container.clientWidth,
  height: container.clientHeight,
});

chart.options({ type: 'interval', data, encode: { x: 'month', y: 'value' } });
chart.render();

// 监听容器大小变化
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    chart.changeSize(width, height);
  }
});
resizeObserver.observe(container);

// 页面卸载时清理
window.addEventListener('unload', () => {
  resizeObserver.disconnect();
  chart.destroy();
});
```

## 窗口 resize 事件（简单方案）

```javascript
// 方案 3：监听 window resize（防抖处理）
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleResize = debounce(() => {
  const container = document.getElementById('container');
  chart.changeSize(container.clientWidth, container.clientHeight);
}, 300);

window.addEventListener('resize', handleResize);
```

## 响应式图表的字体/边距适配

```javascript
// 根据容器宽度动态调整字体大小和边距
function getResponsiveConfig(containerWidth) {
  const isMobile = containerWidth < 480;
  const isTablet = containerWidth < 768;

  return {
    fontSize: isMobile ? 10 : isTablet ? 11 : 12,
    tickCount: isMobile ? 4 : isTablet ? 6 : 10,
    labelRotate: isMobile ? Math.PI / 4 : 0,   // 移动端倾斜标签
    marginBottom: isMobile ? 40 : 20,
  };
}

const containerWidth = document.getElementById('container').clientWidth;
const config = getResponsiveConfig(containerWidth);

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  axis: {
    x: {
      labelFontSize: config.fontSize,
      labelTransform: config.labelRotate ? `rotate(${config.labelRotate}rad)` : undefined,
      tickCount: config.tickCount,
    },
    y: {
      labelFontSize: config.fontSize,
    },
  },
});
```

## React/Vue 组件中的响应式处理

```javascript
// React 示例（使用 useEffect 和 ref）
import { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

function ResponsiveChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = new Chart({
      container,
      autoFit: true,
      height: 400,
    });

    chart.options({ type: 'line', data, encode: { x: 'date', y: 'value' } });
    chart.render();
    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      chartRef.current?.forceFit();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.changeData(data);
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: 400 }} />;
}
```

## 移动端常见适配

```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  // 移动端：转为水平条形图（类别标签更易读）
  coordinate: isMobile ? [{ type: 'transpose' }] : undefined,
  // 移动端：减少刻度数量
  axis: {
    x: { tickCount: isMobile ? 4 : 8 },
    y: {
      labelFontSize: isMobile ? 10 : 12,
      title: isMobile ? null : '数值',   // 移动端隐藏轴标题节省空间
    },
  },
  // 移动端：隐藏图例（空间有限）
  legend: isMobile ? false : { position: 'top' },
});
```

## 常见错误与修正

### 错误 1：容器 display:none 时初始化图表

```javascript
// ❌ 问题：容器隐藏时 clientWidth = 0，图表尺寸为 0
const chart = new Chart({ container: 'hidden-tab', autoFit: true });

// ✅ 解决：等容器可见时再初始化，或显示后调用 changeSize
container.style.display = 'block';
chart.changeSize(container.clientWidth, container.clientHeight);
```

### 错误 2：多次触发 resize 不防抖导致性能问题

```javascript
// ❌ 每次 resize 都立即重绘（可能每秒触发 60 次）
window.addEventListener('resize', () => {
  chart.changeSize(window.innerWidth * 0.8, 400);
});

// ✅ 防抖处理
window.addEventListener('resize', debounce(() => {
  chart.changeSize(window.innerWidth * 0.8, 400);
}, 300));
```
