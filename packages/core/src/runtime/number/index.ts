import { beautifyNumber } from '../format/numberFormat';
import { getStatusColorName } from '../common/color';

export type NumberTrend = 'raise' | 'drop' | '';
export type NumberStatus = 'error' | 'warning' | 'normal' | 'success' | 'none' | string;

export interface CreateNumberOptions {
  className?: string;
  status?: NumberStatus;
  numberTrend?: NumberTrend;
  rightRatioTrend?: NumberTrend;
  rightTitle?: string;
  rightRatio?: string;
  rightRatioStatus?: NumberStatus;
  unit?: string;
  bottomTitle?: string;
  value?: string | number;
}

export interface NumberHandle {
  el: HTMLElement;
  update(opts: Partial<CreateNumberOptions>): void;
  destroy(): void;
}

const PREFIX = 'cloud-charts-wnumber';

function arrowSvg(type: 'raise' | 'drop'): string {
  if (type === 'raise') {
    return '<svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,1 9,9 1,9" fill="currentColor"/></svg>';
  }
  return '<svg width="10" height="10" viewBox="0 0 10 10"><polygon points="1,1 9,1 5,9" fill="currentColor"/></svg>';
}

function render(el: HTMLElement, opts: CreateNumberOptions) {
  const status = opts.status || '';
  const colorName = getStatusColorName(status);
  const trendClass = opts.numberTrend ? ` ${PREFIX}-${opts.numberTrend}` : '';
  const statusClass = colorName ? ` ${PREFIX}-${colorName}` : '';

  const valueStr = opts.value != null ? String(beautifyNumber(opts.value)) : '';
  const trendIcon = opts.numberTrend ? `<span class="${PREFIX}-trend">${arrowSvg(opts.numberTrend)}</span>` : '';
  const unitHtml = opts.unit ? `<span class="${PREFIX}-unit">${opts.unit}</span>` : '';

  let rightHtml = '';
  if (opts.rightTitle || opts.rightRatio) {
    const rStatus = opts.rightRatioStatus ? ` ${PREFIX}-${getStatusColorName(opts.rightRatioStatus)}` : '';
    const rTrend = opts.rightRatioTrend ? `<span class="${PREFIX}-trend">${arrowSvg(opts.rightRatioTrend)}</span>` : '';
    rightHtml = `<span class="${PREFIX}-right${rStatus}">`;
    if (opts.rightTitle) rightHtml += `<span class="${PREFIX}-right-title">${opts.rightTitle}</span>`;
    if (opts.rightRatio) rightHtml += `${rTrend}<span class="${PREFIX}-right-ratio">${opts.rightRatio}</span>`;
    rightHtml += '</span>';
  }

  const bottomHtml = opts.bottomTitle
    ? `<div class="${PREFIX}-bottom"><span class="${PREFIX}-bottom-title">${opts.bottomTitle}</span></div>`
    : '';

  el.innerHTML = `
    <div class="${PREFIX}-main${trendClass}${statusClass}">
      ${trendIcon}
      <span class="${PREFIX}-number">${valueStr}</span>
      ${unitHtml}
      ${rightHtml}
    </div>
    ${bottomHtml}
  `;
}

export function createNumberElement(opts: CreateNumberOptions): NumberHandle {
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
