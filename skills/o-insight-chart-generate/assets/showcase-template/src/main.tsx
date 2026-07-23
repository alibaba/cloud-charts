import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChartProvider, Line, Bar, Pie } from '@alicloud/cloud-charts-react';
import type { LineSeries, BarSeries, PieSeries } from '@alicloud/cloud-charts-core';

/* =========================================================================
 * Visualize Showcase — gallery skeleton.
 *
 * HOW TO USE (for the agent filling this in):
 *  1. Import the chart components you need from '@alicloud/cloud-charts-react'
 *     (Line, Bar, Pie, LineBar, Nightingale, Histogram, Heatmap, Scatter,
 *      Funnel, Radar, Box, Sankey, Candlestick, Treemap, Sunburst, ...).
 *  2. Import matching series types from '@alicloud/cloud-charts-core'.
 *  3. Define realistic typed sample data below.
 *  4. Add one entry per chart to CARDS: { title, subtitle?, node, span? }.
 *  5. Keep everything inside <ChartProvider> and render with real chart components.
 *
 * Time-series tip: use numeric timestamps + config.xAxis={type:'time',mask:'auto'}.
 * Categorical x: config.xAxis={type:'cat'}.
 * ======================================================================= */

// ---- Sample data (REPLACE with the user's real/topic data) --------------
const HOURS = 24;
const BASE = new Date('2026-07-01T00:00:00').getTime();
const HOUR = 3600_000;
const wave = (amp: number, mid: number, phase: number): LineSeries['data'] =>
  Array.from({ length: HOURS }, (_, i) => [
    BASE + i * HOUR,
    Math.round(Math.sin((i + phase) / 3) * amp + mid),
  ] as [number, number]);

const LINE_DATA: LineSeries[] = [
  { name: '今日 QPS', data: wave(30, 120, 0) },
  { name: '昨日 QPS', data: wave(26, 110, 2) },
];

const BAR_DATA: BarSeries[] = [
  { name: '北京', data: [['Q1', 320], ['Q2', 402], ['Q3', 511], ['Q4', 634]] },
  { name: '上海', data: [['Q1', 280], ['Q2', 388], ['Q3', 470], ['Q4', 590]] },
];

const PIE_DATA: PieSeries[] = [
  { name: '来源', data: [['直接访问', 42], ['搜索引擎', 30], ['社交媒体', 18], ['其它', 10]] },
];

// ---- Gallery cards (edit this array) ------------------------------------
interface Card { title: string; subtitle?: string; node: React.ReactNode; span?: number }

const CARDS: Card[] = [
  {
    title: '趋势 · Line',
    subtitle: '24 小时 QPS，今日 vs 昨日',
    span: 2,
    node: (
      <Line
        data={LINE_DATA}
        config={{ symbol: true, legend: {}, tooltip: {}, xAxis: { type: 'time', mask: 'auto' } }}
        height="100%"
        width="100%"
      />
    ),
  },
  {
    title: '对比 · Bar',
    subtitle: '两城季度销售',
    node: <Bar data={BAR_DATA} config={{ legend: {}, tooltip: {} }} height="100%" width="100%" />,
  },
  {
    title: '构成 · Pie',
    subtitle: '流量来源占比',
    node: <Pie data={PIE_DATA} config={{ cycle: true, legend: {}, tooltip: {} }} height="100%" width="100%" />,
  },
];

// ---- Layout (no need to edit) -------------------------------------------
function CardBox({ card }: { card: Card }) {
  return (
    <div
      style={{
        gridColumn: card.span ? `span ${card.span}` : undefined,
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        background: '#fff',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <div style={{ fontWeight: 600, color: '#0f172a' }}>{card.title}</div>
      {card.subtitle && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{card.subtitle}</div>
      )}
      <div style={{ flex: 1, minHeight: 300 }}>{card.node}</div>
    </div>
  );
}

function App() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>今天想要可视化什么？</h1>
      <p style={{ color: '#64748b', marginTop: 0, marginBottom: 24 }}>
        由 <code>@alicloud/cloud-charts-react</code> 真实组件渲染 · 主题跟随 <code>ChartProvider</code>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
        {CARDS.map((c, i) => (
          <CardBox key={i} card={c} />
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <ChartProvider theme="normal" locale="zh-CN">
    <App />
  </ChartProvider>,
);
