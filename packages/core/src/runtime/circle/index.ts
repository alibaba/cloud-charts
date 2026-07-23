import { getStatusColorName } from '../common/color';

export type CircleType = 'circle' | 'gauge';

export interface CreateCircleOptions {
  className?: string;
  type?: CircleType;
  percent?: number;
  title?: string;
  unit?: string;
  value?: string | number;
  trend?: 'raise' | 'drop' | '';
  status?: string;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  linecap?: 'round' | 'butt';
  bottomTitle?: string;
  bottomUnit?: string;
  bottomNumber?: string | number;
  bottomTrend?: 'raise' | 'drop' | '';
}

export interface CircleHandle {
  el: HTMLElement;
  update(opts: Partial<CreateCircleOptions>): void;
  destroy(): void;
}

const PREFIX = 'cloud-charts-wcircle';

function arrowSvg(type: 'raise' | 'drop'): string {
  if (type === 'raise') {
    return '<svg width="8" height="8" viewBox="0 0 10 10"><polygon points="5,1 9,9 1,9" fill="currentColor"/></svg>';
  }
  return '<svg width="8" height="8" viewBox="0 0 10 10"><polygon points="1,1 9,1 5,9" fill="currentColor"/></svg>';
}

function render(el: HTMLElement, opts: CreateCircleOptions) {
  const type = opts.type || 'circle';
  const percent = Math.max(0, Math.min(1, opts.percent ?? 0));
  const radius = opts.radius ?? 70;
  const strokeWidth = opts.strokeWidth ?? 6;
  const linecap = opts.linecap ?? 'round';
  const status = opts.status || '';
  const colorName = getStatusColorName(status);
  const customColor = opts.color || '';

  const radiusInner = radius - strokeWidth / 2;
  const circleLength = 2 * Math.PI * radiusInner;
  const size = radius * 2;

  let openWidth = 0;
  let dashArray: string;
  let dashOffset: number;
  let bgDashArray: string;
  let bgDashOffset: number;

  if (type === 'gauge') {
    openWidth = Math.PI * 0.45 * radiusInner;
    const visibleLen = circleLength - openWidth;
    dashArray = `${percent * visibleLen}px ${circleLength}px`;
    dashOffset = -openWidth / 2;
    bgDashArray = `${visibleLen}px ${circleLength}px`;
    bgDashOffset = -openWidth / 2;
  } else {
    dashArray = `${percent * circleLength}px ${(1 - percent) * circleLength}px`;
    dashOffset = -circleLength / 4;
    bgDashArray = `${circleLength}px 0`;
    bgDashOffset = -circleLength / 4;
  }

  const path = `M ${radius},${radius} m 0,-${radiusInner} a ${radiusInner},${radiusInner} 0 1,1 0,${2 * radiusInner} a ${radiusInner},${radiusInner} 0 1,1 0,-${2 * radiusInner}`;

  const bgColor = opts.backgroundColor || 'var(--cloud-charts-circle-bg, #e8e8e8)';
  const fgStyle = customColor ? `stroke:${customColor}` : '';
  const statusClass = colorName ? ` ${PREFIX}-${colorName}` : '';

  const trendIcon = opts.trend ? arrowSvg(opts.trend) : '';
  const valueStr = opts.value != null ? String(opts.value) : '';
  const unitStr = opts.unit || '';
  const titleStr = opts.title ? `<p class="${PREFIX}-title">${opts.title}</p>` : '';

  let bottomHtml = '';
  if (type === 'gauge' && (opts.bottomNumber != null || opts.bottomTitle)) {
    const bTrend = opts.bottomTrend ? arrowSvg(opts.bottomTrend) : '';
    bottomHtml = `<div class="${PREFIX}-bottom">
      <span class="${PREFIX}-bottom-number">${bTrend}${opts.bottomNumber ?? ''}${opts.bottomUnit || ''}</span>
      ${opts.bottomTitle ? `<p class="${PREFIX}-bottom-title">${opts.bottomTitle}</p>` : ''}
    </div>`;
  }

  el.innerHTML = `
    <div class="${PREFIX}-main${statusClass}" ${customColor ? `style="color:${customColor}"` : ''}>
      <div class="${PREFIX}-ratio">
        <div class="${PREFIX}-ratio-svg" style="width:${size}px;height:${size}px">
          <svg viewBox="0 0 ${size} ${size}" class="${PREFIX}-svg ${PREFIX}-${linecap}">
            <path class="${PREFIX}-svg-bg" d="${path}" fill="none" stroke="${bgColor}" stroke-width="${strokeWidth}" stroke-dasharray="${bgDashArray}" stroke-dashoffset="${bgDashOffset}"/>
            <path class="${PREFIX}-svg-ring" d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="${linecap}" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}" style="transition:stroke-dasharray 0.8s,stroke 0.8s;${fgStyle}"/>
          </svg>
        </div>
        <div class="${PREFIX}-number-block">
          <div class="${PREFIX}-number-middle">
            <span class="${PREFIX}-number ${opts.trend ? PREFIX + '-' + opts.trend : ''}">${trendIcon}${valueStr}${unitStr ? `<em>${unitStr}</em>` : ''}</span>
            ${titleStr}
          </div>
        </div>
        ${bottomHtml}
      </div>
    </div>
  `;
}

export function createCircleElement(opts: CreateCircleOptions): CircleHandle {
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
