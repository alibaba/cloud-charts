import { numberDecimal } from '../format/numberFormat';
import { unitConversion } from '../format/unitConversion';
import { getStatusColorName } from '../common/color';
import type { ValueFormatConfig } from '../format/index';

export interface GaugeColorStop {
  threshold: number | 'max';
  status: string;
}

export interface CreateGaugeOptions extends ValueFormatConfig {
  className?: string;
  current: number;
  label?: string;
  min?: number;
  max?: number;
  colors?: string | GaugeColorStop[];
  outRing?: boolean;
  fontColorFit?: boolean;
  strokeWidth?: number;
  angle?: { start?: number; end?: number };
  gaugeScale?: boolean | { scaleNum?: number; scale?: boolean };
  renderText?: string;
}

export interface GaugeHandle {
  el: HTMLElement;
  update(opts: Partial<CreateGaugeOptions>): void;
  destroy(): void;
}

const PREFIX = 'cloud-charts-wgauge';

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const [sx, sy] = polarToCartesian(cx, cy, r, startAngle);
  const [ex, ey] = polarToCartesian(cx, cy, r, endAngle);
  const sweep = endAngle - startAngle;
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
}

function getColorForCurrent(
  current: number, min: number, max: number,
  colors: GaugeColorStop[],
): string {
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;
  for (const stop of colors) {
    const t = stop.threshold === 'max' ? 100 : (stop.threshold as number);
    if (percent <= t) return getStatusColorName(stop.status);
  }
  return getStatusColorName(colors[colors.length - 1]?.status || 'normal');
}

function render(el: HTMLElement, opts: CreateGaugeOptions) {
  const min = opts.min ?? 0;
  const max = opts.max ?? 100;
  const current = Math.max(min, Math.min(max, opts.current));
  const percent = max === min ? 0 : (current - min) / (max - min);

  const startAngle = opts.angle?.start ?? -180;
  const endAngle = opts.angle?.end ?? 0;
  const totalAngle = endAngle - startAngle;

  const defaultColors: GaugeColorStop[] = [
    { threshold: 60, status: 'error' },
    { threshold: 80, status: 'warning' },
    { threshold: 100, status: 'success' },
  ];
  const colors = typeof opts.colors === 'string'
    ? [{ threshold: 100 as number | 'max', status: opts.colors }]
    : (opts.colors ?? defaultColors);

  const colorName = getColorForCurrent(current, min, max, colors);

  const containerWidth = 200;
  const strokeWidth = opts.strokeWidth ?? Math.max(12, containerWidth * 0.06);
  const outRing = opts.outRing !== false;
  const decorGap = outRing ? strokeWidth : 0;
  const decorStroke = 4;

  const radius = containerWidth / 2 - strokeWidth / 2 - (outRing ? decorGap + decorStroke : 0) - 10;
  const cx = containerWidth / 2;
  const cy = containerWidth / 2;

  const bgPath = arcPath(cx, cy, radius, startAngle, endAngle);
  const dataAngle = startAngle + percent * totalAngle;
  const dataPath = percent > 0 ? arcPath(cx, cy, radius, startAngle, dataAngle) : '';

  let decorPath = '';
  if (outRing) {
    const decorRadius = radius + decorGap + decorStroke / 2;
    decorPath = arcPath(cx, cy, decorRadius, startAngle, endAngle);
  }

  let scaleHtml = '';
  if (opts.gaugeScale) {
    const scaleNum = typeof opts.gaugeScale === 'object' ? (opts.gaugeScale.scaleNum ?? 4) : 4;
    const tickLen = 6;
    const ticks: string[] = [];
    for (let i = 0; i <= scaleNum; i++) {
      const angle = startAngle + (totalAngle * i) / scaleNum;
      const [ix, iy] = polarToCartesian(cx, cy, radius - tickLen, angle);
      const [ox, oy] = polarToCartesian(cx, cy, radius, angle);
      ticks.push(`<line x1="${ix}" y1="${iy}" x2="${ox}" y2="${oy}" stroke="var(--cloud-charts-gauge-tick, #ccc)" stroke-width="1"/>`);
      const val = numberDecimal(min + ((max - min) * i) / scaleNum, 0);
      const [tx, ty] = polarToCartesian(cx, cy, radius - tickLen - 12, angle);
      ticks.push(`<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="var(--cloud-charts-gauge-text, #999)">${val}</text>`);
    }
    scaleHtml = ticks.join('');
  }

  let displayValue: string | number = current;
  let displayUnit = opts.unit || '';
  if (opts.valueType === 'percent_1') displayValue = current * 100;
  if (opts.needUnitTransform && (opts.unit || opts.valueType)) {
    const conv = unitConversion(
      Number(displayValue), opts.unit, opts.decimal,
      opts.unitTransformTo, opts.valueType,
      opts.customCarryUnits, opts.customCarryThreshold, opts.addonTextAfter,
    );
    displayValue = conv.value as number;
    displayUnit = conv.unit;
  } else {
    displayValue = numberDecimal(displayValue, opts.decimal ?? 1) as number;
  }
  if (opts.renderText != null) displayValue = opts.renderText;

  const colorStyle = `color: var(--cloud-charts-wgauge-${colorName}-color, currentColor)`;

  el.innerHTML = `
    <div class="${PREFIX}-wrapper" style="position:relative;width:100%;padding-bottom:${Math.abs(totalAngle) > 180 ? '100%' : '50%'}">
      <svg viewBox="0 0 ${containerWidth} ${containerWidth}" style="position:absolute;top:0;left:0;width:100%;height:100%">
        ${decorPath ? `<path d="${decorPath}" fill="none" stroke="var(--cloud-charts-gauge-decor, #e8e8e8)" stroke-width="${decorStroke}" stroke-linecap="round"/>` : ''}
        <path d="${bgPath}" fill="none" stroke="var(--cloud-charts-gauge-bg, #e8e8e8)" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        ${dataPath ? `<path d="${dataPath}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" style="transition:d 0.6s,stroke 0.3s"/>` : ''}
        ${scaleHtml}
      </svg>
      <div class="${PREFIX}-text" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <div class="${PREFIX}-value"><span class="${PREFIX}-num">${displayValue}</span><span class="${PREFIX}-unit">${displayUnit}</span></div>
        ${opts.label ? `<div class="${PREFIX}-label">${opts.label}</div>` : ''}
      </div>
    </div>
  `;
}

export function createGaugeElement(opts: CreateGaugeOptions): GaugeHandle {
  const el = document.createElement('div');
  el.className = `cloud-charts ${PREFIX} ${opts.className || ''}`.trim();

  let current = { ...opts };
  render(el, current);

  return {
    el,
    update(next) {
      current = { ...current, ...next };
      render(el, current);
    },
    destroy() {
      el.innerHTML = '';
    },
  };
}
