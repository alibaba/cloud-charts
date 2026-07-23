# AI Drawing Pattern

Use this pattern when the user wants the visualization process to be visible, such as “AI 一步步画出图表”, “边解释边生成图”, or “展示图表搭建过程”.

## Concept

Represent the chart-building process as a stream of small operations. Each operation updates chart state, and the UI renders the current real cloud-charts component after every step.

## Operation model

```ts
type DrawOp =
  | { type: 'setChart'; chart: 'Bar' | 'Line' | 'Pie' | 'LineBar' }
  | { type: 'setTitle'; title: string }
  | { type: 'addSeries'; name: string }
  | { type: 'addPoint'; series: string; x: string | number; y: number }
  | { type: 'enable'; feature: 'label' | 'legend' | 'tooltip' }
  | { type: 'setTheme'; theme: 'normal' | 'dark' | 'yunxiao' }
  | { type: 'upgrade'; chart: 'LineBar' | 'Pie' };
```

## Rendering loop

1. Start with an empty state.
2. Apply one `DrawOp` at a time.
3. Render the current component with accumulated data/config.
4. Show a short narration beside the chart.
5. End on a stable final chart.

## Example narration

```text
1. 先创建销售趋势图。
2. 添加 2026 年销售额序列。
3. 逐月填入数据点。
4. 打开 tooltip 和 label。
5. 增加城市对比柱状图作为解释层。
```

## Rules

- The final output should still be a real cloud-charts component.
- Do not fake the chart with screenshots or canvas unless the user explicitly asks for a static mock.
- Keep operations understandable to humans; the animation is part of the explanation.
