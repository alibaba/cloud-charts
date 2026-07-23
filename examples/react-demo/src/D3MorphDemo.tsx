import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { interpolate, interpolateAll } from 'flubber';

/* =========================================================================
 * D3 + Flubber 实验：用 path morphing 实现"图片生成式过渡"
 *
 * 目标：和 G2 的方案对比，看"任意 SVG 形状之间的平滑变形"能不能给到
 *      "AI 一句话改图，视觉上像图片溶解一样过渡"的感觉。
 *
 * 关键技术：
 *   1. 所有 mark 都用 <path> 渲染（柱子用矩形 path、扇形用 arc path、线用 line path）
 *   2. flubber.interpolate(d0, d1) 返回一个 t→path 的插值函数，能在两个任意 SVG path 之间补间
 *   3. d3.transition() 驱动插值，每帧把插值结果 set 到 path 的 d 属性上
 *
 * 演示步骤：
 *   bar(5) → grouped bar(5×2) → line+bar → donut → 散点 → 回到 bar
 *
 * 注意：完全跳出 G2 的 axis/legend/scale 体系，所有元素都自己画。
 * ======================================================================= */

// ============ 数据 ============
const BJ = [['Jan', 32], ['Feb', 45], ['Mar', 58], ['Apr', 70], ['May', 82]] as Array<[string, number]>;
const SH = [['Jan', 28], ['Feb', 40], ['Mar', 52], ['Apr', 65], ['May', 78]] as Array<[string, number]>;

const WIDTH = 720;
const HEIGHT = 420;
const PADDING = { top: 24, right: 24, bottom: 40, left: 48 };
const INNER_W = WIDTH - PADDING.left - PADDING.right;
const INNER_H = HEIGHT - PADDING.top - PADDING.bottom;

// ============ Path 生成器 ============

/** 单根柱子的 SVG path（圆角矩形） */
function rectPath(x: number, y: number, w: number, h: number, r = 2): string {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x},${y + rr}
    a${rr},${rr} 0 0 1 ${rr},${-rr}
    h${w - 2 * rr}
    a${rr},${rr} 0 0 1 ${rr},${rr}
    v${h - rr}
    h${-w}
    v${-(h - rr)} Z`;
}

/** 扇形 path */
function arcPath(cx: number, cy: number, r: number, r0: number, a0: number, a1: number): string {
  const arc = d3.arc().innerRadius(r0).outerRadius(r).startAngle(a0).endAngle(a1);
  // d3.arc 返回的 path 已带 M…Z；它默认绕原点，平移要在外层 transform
  return arc({} as never) ?? '';
}

/** 折线 path */
function linePath(points: Array<[number, number]>): string {
  const gen = d3.line<[number, number]>().x((d) => d[0]).y((d) => d[1]).curve(d3.curveMonotoneX);
  return gen(points) ?? '';
}

/** 散点：每个点画一个小圆，转成 path */
function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 Z`;
}

// ============ Scene 定义：每个 scene 给出"N 个 path + 颜色" ============

interface Mark {
  id: string;
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  transform?: string;
}

interface Scene {
  name: string;
  description: string;
  marks: Mark[];
}

function sceneBar(): Scene {
  const xScale = d3.scaleBand().domain(BJ.map((d) => d[0])).range([0, INNER_W]).padding(0.3);
  const yScale = d3.scaleLinear().domain([0, 100]).range([INNER_H, 0]);
  const marks: Mark[] = BJ.map(([x, y], i) => ({
    id: `bj-${i}`,
    d: rectPath(xScale(x)!, yScale(y), xScale.bandwidth(), INNER_H - yScale(y), 3),
    fill: '#1677ff',
    transform: `translate(${PADDING.left},${PADDING.top})`,
  }));
  return { name: 'Bar · 单系列柱图', description: '北京 1–5 月销售', marks };
}

function sceneGroupedBar(): Scene {
  const xScale = d3.scaleBand().domain(BJ.map((d) => d[0])).range([0, INNER_W]).padding(0.3);
  const sub = d3.scaleBand().domain(['BJ', 'SH']).range([0, xScale.bandwidth()]).padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 100]).range([INNER_H, 0]);
  const marks: Mark[] = [];
  BJ.forEach(([x, y], i) => {
    marks.push({
      id: `bj-${i}`,
      d: rectPath(xScale(x)! + sub('BJ')!, yScale(y), sub.bandwidth(), INNER_H - yScale(y), 3),
      fill: '#1677ff',
      transform: `translate(${PADDING.left},${PADDING.top})`,
    });
  });
  SH.forEach(([x, y], i) => {
    marks.push({
      id: `sh-${i}`,
      d: rectPath(xScale(x)! + sub('SH')!, yScale(y), sub.bandwidth(), INNER_H - yScale(y), 3),
      fill: '#ff7a45',
      transform: `translate(${PADDING.left},${PADDING.top})`,
    });
  });
  return { name: 'Grouped Bar · 双系列', description: '北京 vs 上海', marks };
}

function sceneLineBar(): Scene {
  // 同 grouped bar，但上海的"柱"溶解成"折线"
  const base = sceneGroupedBar();
  // 把上海部分从 marks 里替换：折线 path
  const xScale = d3.scaleBand().domain(BJ.map((d) => d[0])).range([0, INNER_W]).padding(0.3);
  const sub = d3.scaleBand().domain(['BJ', 'SH']).range([0, xScale.bandwidth()]).padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 100]).range([INNER_H, 0]);
  const lineP: Array<[number, number]> = SH.map(([x, y]) => [
    xScale(x)! + sub('SH')! + sub.bandwidth() / 2,
    yScale(y),
  ]);
  // 把折线"分段"成 5 个独立短 segment，配合 flubber 一个 sh-i ↔ 一个 segment-i
  const segs: Mark[] = lineP.map((p, i) => {
    const next = lineP[i + 1] ?? p;
    return {
      id: `sh-${i}`, // 注意 id 跟 grouped 的 sh-i 一致，flubber 能逐 mark 补间
      d: `M${p[0]},${p[1]} L${next[0]},${next[1]}`,
      fill: 'none',
      stroke: '#ff7a45',
      strokeWidth: 3,
      transform: `translate(${PADDING.left},${PADDING.top})`,
    };
  });
  const bjBars = base.marks.filter((m) => m.id.startsWith('bj-'));
  return { name: 'Bar + Line · 复合', description: '上海溶解为折线', marks: [...bjBars, ...segs] };
}

function sceneDonut(): Scene {
  // 把 5 个柱子溶解为 5 个扇形（北京），上海也溶解为外环
  const total = d3.sum(BJ, (d) => d[1] as number);
  const cx = PADDING.left + INNER_W / 2;
  const cy = PADDING.top + INNER_H / 2;
  const r = Math.min(INNER_W, INNER_H) / 2 - 10;
  const r0 = r * 0.55;
  let a0 = 0;
  const marks: Mark[] = BJ.map(([_, v], i) => {
    const a1 = a0 + ((v as number) / total) * Math.PI * 2;
    const m: Mark = {
      id: `bj-${i}`,
      d: arcPath(0, 0, r, r0, a0, a1),
      fill: d3.interpolateBlues(0.4 + i * 0.12),
      transform: `translate(${cx},${cy})`,
    };
    a0 = a1;
    return m;
  });
  // 上海作为外环 segments，对应 sh-i
  let b0 = 0;
  const totalSH = d3.sum(SH, (d) => d[1] as number);
  SH.forEach(([_, v], i) => {
    const b1 = b0 + ((v as number) / totalSH) * Math.PI * 2;
    marks.push({
      id: `sh-${i}`,
      d: arcPath(0, 0, r + 18, r + 6, b0, b1),
      fill: d3.interpolateOranges(0.4 + i * 0.12),
      transform: `translate(${cx},${cy})`,
    });
    b0 = b1;
  });
  return { name: 'Donut · 占比', description: '柱→扇形 形状插值', marks };
}

function sceneScatter(): Scene {
  const xScale = d3.scaleBand().domain(BJ.map((d) => d[0])).range([0, INNER_W]).padding(0.3);
  const yScale = d3.scaleLinear().domain([0, 100]).range([INNER_H, 0]);
  const marks: Mark[] = [];
  BJ.forEach(([x, y], i) => {
    marks.push({
      id: `bj-${i}`,
      d: circlePath(xScale(x)! + xScale.bandwidth() / 2, yScale(y), 12),
      fill: '#1677ff',
      fillOpacity: 0.7,
      transform: `translate(${PADDING.left},${PADDING.top})`,
    });
  });
  SH.forEach(([x, y], i) => {
    marks.push({
      id: `sh-${i}`,
      d: circlePath(xScale(x)! + xScale.bandwidth() / 2, yScale(y), 12),
      fill: '#ff7a45',
      fillOpacity: 0.7,
      transform: `translate(${PADDING.left},${PADDING.top})`,
    });
  });
  return { name: 'Scatter · 散点', description: '柱→圆 形状插值', marks };
}

const SCENES: Scene[] = [
  sceneBar(),
  sceneGroupedBar(),
  sceneLineBar(),
  sceneDonut(),
  sceneScatter(),
  sceneBar(),
];

// ============ 渲染器：在场景切换时用 flubber 做 path morph ============

const DURATION = 900;

function MorphSVG({ scene }: { scene: Scene }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevMarksRef = useRef<Map<string, Mark>>(new Map());

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select('g.marks');

    const nextMap = new Map(scene.marks.map((m) => [m.id, m]));
    const prevMap = prevMarksRef.current;

    // 1) JOIN by id
    const all = new Set<string>([...prevMap.keys(), ...nextMap.keys()]);

    all.forEach((id) => {
      const prev = prevMap.get(id);
      const next = nextMap.get(id);
      const sel = g.select<SVGPathElement>(`path[data-id="${CSS.escape(id)}"]`);

      if (prev && next) {
        // 形状插值
        const node = sel.node();
        if (!node) return;
        try {
          const interp = interpolate(prev.d, next.d, { maxSegmentLength: 8 });
          sel
            .attr('transform', next.transform ?? null)
            .transition()
            .duration(DURATION)
            .ease(d3.easeCubicInOut)
            .attrTween('d', () => (t) => interp(t))
            .attr('fill', next.fill)
            .attr('stroke', next.stroke ?? 'none')
            .attr('stroke-width', next.strokeWidth ?? 0)
            .attr('fill-opacity', next.fillOpacity ?? 1);
        } catch {
          sel.attr('d', next.d).attr('fill', next.fill);
        }
      } else if (next && !prev) {
        // enter
        g.append('path')
          .attr('data-id', id)
          .attr('d', next.d)
          .attr('fill', next.fill)
          .attr('stroke', next.stroke ?? 'none')
          .attr('stroke-width', next.strokeWidth ?? 0)
          .attr('fill-opacity', 0)
          .attr('transform', next.transform ?? null)
          .transition()
          .duration(DURATION)
          .ease(d3.easeCubicInOut)
          .attr('fill-opacity', next.fillOpacity ?? 1);
      } else if (prev && !next) {
        // exit
        sel.transition().duration(DURATION).attr('fill-opacity', 0).remove();
      }
    });

    prevMarksRef.current = nextMap;
  }, [scene]);

  return (
    <svg ref={svgRef} width={WIDTH} height={HEIGHT} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <g className="marks" />
    </svg>
  );
}

// ============ 主页面 ============

export function D3MorphDemo() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % SCENES.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [auto]);

  const scene = SCENES[idx];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>D3 + Flubber · Path Morphing 实验</h1>
      <p style={{ color: '#666' }}>
        所有元素（柱 / 线 / 扇形 / 圆）都用 <code>&lt;path&gt;</code> 渲染。
        场景切换时通过 <code>flubber.interpolate(prevPath, nextPath)</code> 做形状插值，
        d3.transition 驱动每帧把插值 path 写回 <code>d</code> 属性。
        — 这就是"图片生成式过渡"的本质。
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {SCENES.map((s, i) => (
          <button
            key={i}
            onClick={() => { setAuto(false); setIdx(i); }}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 16,
              background: i === idx ? '#1677ff' : '#fff',
              color: i === idx ? '#fff' : '#333',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {i + 1}. {s.name}
          </button>
        ))}
        <button
          onClick={() => setAuto((a) => !a)}
          style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 16,
            background: auto ? '#fde68a' : '#fff',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {auto ? '⏸ 停止自动播放' : '▶ 自动播放'}
        </button>
      </div>

      <p style={{ color: '#666', fontSize: 13, margin: '0 0 8px' }}>
        当前：<strong>{scene.name}</strong> — {scene.description}
      </p>

      <MorphSVG scene={scene} />

      <section style={{ marginTop: 24, color: '#444', fontSize: 13, lineHeight: 1.7 }}>
        <strong>对比 G2 方案的取舍：</strong>
        <ul>
          <li><strong>赢</strong>：bar→pie / bar→scatter 这种"几何形状不同"的切换有平滑补间，视觉像图片溶解。</li>
          <li><strong>输</strong>：所有 axis / legend / tooltip / scale 都要自己写；离开 G2 的成熟生态。</li>
          <li><strong>真正的工程取舍</strong>：可以只在"图表类型切换"那一帧用 flubber 做过渡补间，其它时间还是用 G2 渲染。但这种混合方案复杂度极高。</li>
          <li><strong>实际建议</strong>：流式渲染走 G2（成熟、有 morphing），图表类型切换接受"硬切 + AI loading 过场"，不为单一过渡放弃整个生态。</li>
        </ul>
      </section>
    </div>
  );
}
