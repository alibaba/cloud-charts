import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bar, Line, Pie, LineBar, AiLoadingIcon } from '@alicloud/cloud-charts-react';
import type { LineBarSeries } from '@alicloud/cloud-charts-core';
import { D3MorphDemo } from './D3MorphDemo';

/* =========================================================================
 * <AIChart /> ：单一入口，吃"平铺画图指令"流，自动选底层组件。
 *
 * 用户输入是自然语言（"我想看销售数据"），AI 不预先告诉前端要画什么图，
 * 而是流式输出一连串"绘图指令"。前端按指令累积 spec，逐步成形。
 *
 * 指令集（DrawOp）：
 *   - setChartType: 决定底层用哪个组件（bar / line / pie / lineBar）
 *   - setAxis     : 配置 x/y 轴（title / domain / ticks）
 *   - addSeries   : 声明一个系列（name + geomType=bar|line）
 *   - addDataPoint: 往某系列追加一个点（series, x, y）
 *   - enable      : 打开 grid / label / legend / tooltip
 *   - upgradeTo   : 升级图表类型（如 bar → lineBar，用于追加 line）
 *
 * 关键：所有 bar/line/混合 都映射到 <LineBar /> 底层，保证组件实例不换、动画连贯。
 * Pie / 其它类型则切换组件（必要时）。
 * ======================================================================= */

// ============== 指令协议 ==============
type DrawOp =
  | { op: 'setChartType'; value: 'bar' | 'line' | 'pie' | 'lineBar' }
  | { op: 'upgradeTo'; value: 'lineBar' }
  | { op: 'setAxis'; axis: 'x' | 'y'; config: Record<string, unknown> }
  | { op: 'addSeries'; name: string; geomType?: 'bar' | 'line' }
  | { op: 'addDataPoint'; series: string; x: string | number; y: number }
  | { op: 'enable'; feature: 'grid' | 'label' | 'legend' | 'tooltip'; value?: unknown };

// ============== AIChart 状态 ==============
interface AIChartState {
  chartType?: 'bar' | 'line' | 'pie' | 'lineBar';
  axes: { x?: Record<string, unknown>; y?: Record<string, unknown> };
  series: Array<{ name: string; geomType: 'bar' | 'line'; data: Array<[string | number, number]> }>;
  features: { grid?: boolean; label?: boolean; legend?: unknown; tooltip?: unknown };
}

function reduceOp(state: AIChartState, op: DrawOp): AIChartState {
  switch (op.op) {
    case 'setChartType':
      return { ...state, chartType: op.value };
    case 'upgradeTo':
      return { ...state, chartType: op.value };
    case 'setAxis':
      return { ...state, axes: { ...state.axes, [op.axis]: { ...(state.axes[op.axis] ?? {}), ...op.config } } };
    case 'addSeries': {
      if (state.series.find((s) => s.name === op.name)) return state;
      return { ...state, series: [...state.series, { name: op.name, geomType: op.geomType ?? 'bar', data: [] }] };
    }
    case 'addDataPoint': {
      const series = state.series.map((s) => (s.name === op.series ? { ...s, data: [...s.data, [op.x, op.y] as [string | number, number]] } : s));
      return { ...state, series };
    }
    case 'enable':
      return { ...state, features: { ...state.features, [op.feature]: op.value ?? true } };
    default:
      return state;
  }
}

// ============== AIChart 组件：根据 chartType 选底层 ==============
interface AIChartProps {
  state: AIChartState;
  height?: number | string;
}

function AIChart({ state, height = 360 }: AIChartProps) {
  // 没决定图表类型 → 显示 AI loading
  if (!state.chartType) {
    return (
      <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
        <AiLoadingIcon text="AI 正在生成图表…" />
      </div>
    );
  }

  // 拼装通用 config
  const config: Record<string, unknown> = {
    xAxis: state.axes.x ?? {},
    yAxis: state.axes.y ?? {},
    grid: state.features.grid ?? false,
    label: state.features.label ?? false,
    legend: state.features.legend ?? false,
    tooltip: state.features.tooltip ?? false,
  };

  // bar / line / lineBar 全部映射到 <LineBar />（同一个底层实例 → 动画连贯）
  if (state.chartType === 'bar' || state.chartType === 'line' || state.chartType === 'lineBar') {
    const realData: LineBarSeries[] = state.series.map((s) => ({
      name: s.name,
      geomType: s.geomType,
      data: s.data,
    }));
    // 还没声明任何 series 时，塞一个 invisible 占位系列保证 LineBar 能根据 axis 配置画出空坐标系骨架
    const lineBarData: LineBarSeries[] =
      realData.length === 0
        ? [{ name: '__skeleton__', geomType: state.chartType === 'line' ? 'line' : 'bar', visible: false, data: [['', 0]] }]
        : realData;
    return (
      <div style={{ width: '100%', height }}>
        <LineBar data={lineBarData} config={config} height="100%" width="100%" />
      </div>
    );
  }

  // pie：换组件
  if (state.chartType === 'pie') {
    const pieData = state.series.map((s) => ({ name: s.name, data: s.data.map(([x, y]) => [String(x), y] as [string, number]) }));
    return <Pie data={pieData} config={config} height={height} width="100%" />;
  }

  return null;
}

// ============== 演示用：把指令封装成对话 ==============
type StreamEvent =
  | { type: 'UserMessage'; text: string }
  | { type: 'AiThinking'; text?: string }
  | { type: 'AiOp'; op: DrawOp; explain?: string }
  | { type: 'AiSay'; text: string }
  | { type: 'AiDone' };

function buildPointsOps(seriesName: string, points: Array<[string, number]>): StreamEvent[] {
  return points.map((p) => ({ type: 'AiOp', op: { op: 'addDataPoint', series: seriesName, x: p[0], y: p[1] } } as StreamEvent));
}

// ============== 演示脚本 ==============
const BJ: Array<[string, number]> = [['Jan', 32], ['Feb', 45], ['Mar', 58], ['Apr', 70], ['May', 82]];
const SH: Array<[string, number]> = [['Jan', 28], ['Feb', 40], ['Mar', 52], ['Apr', 65], ['May', 78]];
const AVG: Array<[string, number]> = [['Jan', 30], ['Feb', 42], ['Mar', 55], ['Apr', 67], ['May', 80]];

const STREAM: StreamEvent[] = [
  // ============= Round 1：含糊的需求 =============
  { type: 'UserMessage', text: '我想看一下销售数据' },
  { type: 'AiThinking', text: 'AI 正在理解需求并选择可视化形式…' },
  { type: 'AiSay', text: '好的，我会用柱状图展示北京 1–5 月的销售。下面是绘图过程：' },

  { type: 'AiOp', op: { op: 'setChartType', value: 'bar' }, explain: '决定用柱状图' },
  { type: 'AiOp', op: { op: 'setAxis', axis: 'x', config: { title: 'Month' } }, explain: '画 X 轴' },
  { type: 'AiOp', op: { op: 'setAxis', axis: 'y', config: { min: 0, max: 100, nice: false, title: 'Sales (万)' } }, explain: '画 Y 轴，刻度 0–100' },
  { type: 'AiOp', op: { op: 'enable', feature: 'grid' }, explain: '画网格' },
  { type: 'AiOp', op: { op: 'addSeries', name: 'Beijing', geomType: 'bar' }, explain: '声明 Beijing 系列' },
  ...buildPointsOps('Beijing', BJ).map((e) => ({ ...e, explain: '逐点画柱' } as StreamEvent)),
  { type: 'AiOp', op: { op: 'enable', feature: 'label' } },
  { type: 'AiOp', op: { op: 'enable', feature: 'legend', value: { visible: true, position: 'top' } } },
  { type: 'AiOp', op: { op: 'enable', feature: 'tooltip', value: {} } },
  { type: 'AiSay', text: '北京 5 个月累计 287 万元，呈稳定上升趋势。' },
  { type: 'AiDone' },

  // ============= Round 2：追加上海 =============
  { type: 'UserMessage', text: '加上上海做对比' },
  { type: 'AiThinking', text: '正在追加上海系列…' },
  { type: 'AiOp', op: { op: 'addSeries', name: 'Shanghai', geomType: 'bar' }, explain: '新增 Shanghai 柱系列' },
  ...buildPointsOps('Shanghai', SH).map((e) => ({ ...e, explain: '逐点画上海柱' } as StreamEvent)),
  { type: 'AiSay', text: '上海 5 个月累计 263 万元，略低于北京。' },
  { type: 'AiDone' },

  // ============= Round 3：升级为柱+线 =============
  { type: 'UserMessage', text: '再叠一条月均值的趋势线' },
  { type: 'AiThinking', text: '升级图表为"柱 + 线"组合…' },
  { type: 'AiOp', op: { op: 'upgradeTo', value: 'lineBar' }, explain: 'chartType: bar → lineBar（底层 <LineBar /> 实例不变）' },
  { type: 'AiOp', op: { op: 'addSeries', name: 'Average', geomType: 'line' }, explain: '新增 Average 线系列' },
  ...buildPointsOps('Average', AVG).map((e) => ({ ...e, explain: '逐点画均线' } as StreamEvent)),
  { type: 'AiSay', text: '均值线展示了双城整体趋势：从 30 万稳定增长到 80 万。' },
  { type: 'AiDone' },
];

// ============== 流式播放 ==============
const TICK = 350;
function useStream(events: StreamEvent[], running: boolean) {
  const [cursor, setCursor] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (!running) {
      if (timer.current !== null) { window.clearInterval(timer.current); timer.current = null; }
      return;
    }
    timer.current = window.setInterval(() => {
      setCursor((c) => (c >= events.length ? c : c + 1));
    }, TICK);
    return () => {
      if (timer.current !== null) { window.clearInterval(timer.current); timer.current = null; }
    };
  }, [running, events.length]);
  return {
    cursor, received: events.slice(0, cursor),
    reset: () => setCursor(0),
    step: () => setCursor((c) => (c >= events.length ? c : c + 1)),
    done: cursor >= events.length,
  };
}

// ============== 演示页面 ==============
function ChatBubble({ role, children }: { role: 'user' | 'ai'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', margin: '6px 0' }}>
      <div
        style={{
          maxWidth: '88%', padding: '8px 12px', borderRadius: 12,
          background: isUser ? '#1677ff' : '#f4f4f5',
          color: isUser ? '#fff' : '#333',
          fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function OpLog({ op, explain }: { op: DrawOp; explain?: string }) {
  const summary = (() => {
    switch (op.op) {
      case 'setChartType': return `setChartType("${op.value}")`;
      case 'upgradeTo':    return `upgradeTo("${op.value}")`;
      case 'setAxis':      return `setAxis(${op.axis}, ${JSON.stringify(op.config)})`;
      case 'addSeries':    return `addSeries("${op.name}", "${op.geomType ?? 'bar'}")`;
      case 'addDataPoint': return `addDataPoint("${op.series}", ${JSON.stringify(op.x)}, ${op.y})`;
      case 'enable':       return `enable("${op.feature}"${op.value !== undefined && op.value !== true ? `, ${JSON.stringify(op.value)}` : ''})`;
    }
  })();
  return (
    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#475569', padding: '1px 0' }}>
      <span style={{ color: '#94a3b8' }}>›</span>{' '}
      <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, color: '#0f172a' }}>{summary}</code>
      {explain ? <span style={{ color: '#64748b', marginLeft: 6 }}>// {explain}</span> : null}
    </div>
  );
}

function App() {
  const [running, setRunning] = useState(true);
  const { cursor, received, reset, step, done } = useStream(STREAM, running);

  const state = useMemo<AIChartState>(() => {
    return received.reduce<AIChartState>((acc, ev) => {
      if (ev.type === 'AiOp') return reduceOp(acc, ev.op);
      return acc;
    }, { axes: {}, series: [], features: {} });
  }, [received]);

  const isThinking = useMemo(() => {
    for (let i = received.length - 1; i >= 0; i--) {
      const ev = received[i];
      if (ev.type === 'AiDone') return false;
      if (ev.type === 'AiThinking') return true;
      if (ev.type === 'UserMessage') return false;
      if (ev.type === 'AiOp' || ev.type === 'AiSay') return false;
    }
    return false;
  }, [received]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>&lt;AIChart /&gt; · 自然语言驱动的流式可视化</h1>
      <p style={{ color: '#666', marginBottom: 8 }}>
        用户输入是含糊的自然语言（<strong>"我想看销售数据"</strong>），不指定图表类型。
        AI 流式输出"平铺画图指令"（DrawOp），<code>&lt;AIChart /&gt;</code> 按指令累积 spec，逐步成形。
      </p>
      <p style={{ color: '#888', fontSize: 12, marginTop: 0, marginBottom: 16 }}>
        指令集：<code>setChartType</code> · <code>setAxis</code> · <code>addSeries</code> · <code>addDataPoint</code> · <code>enable</code> · <code>upgradeTo</code>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
        {/* 对话流 */}
        <div style={{ minWidth: 0, border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff', maxHeight: 620, overflow: 'auto' }}>
          <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>对话 + 绘图指令</div>
          {received.map((ev, i) => {
            if (ev.type === 'UserMessage') return <ChatBubble key={i} role="user">{ev.text}</ChatBubble>;
            if (ev.type === 'AiThinking') return <ChatBubble key={i} role="ai"><em style={{ opacity: 0.7 }}>{ev.text ?? 'AI is thinking…'}</em></ChatBubble>;
            if (ev.type === 'AiSay') return <ChatBubble key={i} role="ai">{ev.text}</ChatBubble>;
            if (ev.type === 'AiOp') return <OpLog key={i} op={ev.op} explain={ev.explain} />;
            if (ev.type === 'AiDone') return <div key={i} style={{ fontSize: 11, color: '#16a34a', padding: '4px 0 8px' }}>✓ 绘制完毕</div>;
            return null;
          })}
          {received.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>等待用户输入…</div>}
        </div>

        {/* AIChart */}
        <div style={{ minWidth: 0, border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
          <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
            &lt;AIChart /&gt;
            {state.chartType && <span style={{ marginLeft: 8, fontSize: 12, color: '#16a34a', fontWeight: 400 }}>chartType: {state.chartType}</span>}
          </div>
          <AIChart state={state} height={420} />

          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setRunning(!running)} disabled={done}>{running ? '暂停' : '继续'}</button>
            <button onClick={() => { setRunning(false); step(); }}>单步 →</button>
            <button onClick={() => { reset(); setRunning(true); }}>重新播放</button>
            <span style={{ color: '#666', fontSize: 12, marginLeft: 'auto' }}>事件 {cursor} / {STREAM.length}</span>
          </div>

          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: 'pointer', color: '#666', fontSize: 12 }}>查看 AIChart 内部累积 state</summary>
            <pre style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 11, maxHeight: 260, overflow: 'auto', marginTop: 6 }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </details>
        </div>
      </div>

      <section style={{ marginTop: 24, color: '#444', fontSize: 13, lineHeight: 1.7 }}>
        <strong>核心设计：</strong>
        <ul>
          <li><code>&lt;AIChart /&gt;</code> 是统一入口，无需提前指定图表类型，<code>setChartType</code> 也是流式指令的一条。</li>
          <li>指令是<strong>平铺</strong>的（DrawOp 数组，不是嵌套 JSON），LLM 流式 token 任意切片都能解析。</li>
          <li>bar / line / lineBar 三种语义共用 <code>&lt;LineBar /&gt;</code> 底层 → <code>upgradeTo</code> 不换实例，柱图叠加线时视觉连贯。</li>
          <li><code>addDataPoint</code> 逐点推送 → 用户能"看到" AI 画柱的过程（结合 G2 morphing 动画）。</li>
          <li>空态使用 <code>&lt;AiLoadingIcon /&gt;</code>（对应旧版 stateType="ai"，已独立挪到 packages）。</li>
        </ul>
      </section>
    </div>
  );
}

function Root() {
  const [tab, setTab] = useState<'aichart' | 'morph'>('aichart');
  return (
    <div>
      <nav style={{ background: '#0f172a', color: '#fff', padding: '10px 24px', display: 'flex', gap: 16, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <strong style={{ marginRight: 16 }}>cloud-charts Demos</strong>
        {[
          { key: 'aichart' as const, label: 'AIChart · 流式渲染（G2）' },
          { key: 'morph' as const, label: 'D3 + Flubber · Path Morphing 实验' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 14px',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              background: tab === t.key ? '#1677ff' : 'transparent',
              color: tab === t.key ? '#fff' : '#cbd5e1',
              fontSize: 13,
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'aichart' ? <App /> : <D3MorphDemo />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
