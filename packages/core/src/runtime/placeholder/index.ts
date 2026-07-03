import { getText, onLanguageChange, getLanguage } from '../i18n';
import { resolveTheme, onThemeChange, getThemeName } from '../theme';
import type { ChartLanguage, LocaleConfig } from '../types';

export type PlaceholderState = 'loading' | 'empty' | 'error' | 'noData' | 'normal';

export interface CreatePlaceholderOptions {
  state?: PlaceholderState;
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  noData?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
  language?: ChartLanguage;
  locale?: LocaleConfig;
  theme?: string;
  /** 自定义内容：HTMLElement / 字符串 / null。优先级高于内置 SVG + 文案。 */
  children?: HTMLElement | string | null;
}

export interface PlaceholderHandle {
  el: HTMLElement;
  update(next: CreatePlaceholderOptions): void;
  destroy(): void;
}

const PREFIX = 'cloud-charts-wplaceholder';
const FULL_CROSS = `widgets-${PREFIX.replace('-wplaceholder', '')}`;

function resolveState(opts: CreatePlaceholderOptions): Exclude<PlaceholderState, 'normal'> | 'normal' {
  if (opts.state && opts.state !== 'normal') return opts.state;
  if (opts.error) return 'error';
  if (opts.loading) return 'loading';
  if (opts.noData) return 'noData';
  if (opts.empty) return 'empty';
  return 'normal';
}

function toSizeValue(v: string | number | undefined): string | undefined {
  if (v == null || v === '') return undefined;
  if (typeof v === 'number') return `${v}px`;
  return /^\d+$/.test(v) ? `${v}px` : v;
}

function svgBars(): string {
  return (
    '<svg width="36" height="32" class="placeholder-box" xmlns="http://www.w3.org/2000/svg">' +
    '<rect class="placeholder-item item-1" width="8" height="20" x="0" y="12"></rect>' +
    '<rect class="placeholder-item item-2" width="8" height="32" x="14" y="0"></rect>' +
    '<rect class="placeholder-item item-3" width="8" height="26" x="28" y="6"></rect>' +
    '</svg>'
  );
}

function svgError(color: string): string {
  return (
    `<svg width="13.99" height="13.99" viewBox="0 0 13.990234375 13.990234375" xmlns="http://www.w3.org/2000/svg">` +
    `<g><path d="M13.2992,4.0833C12.1972,1.5882,9.71352,0.00200162,6.99922,0C5.33879,-0.00111527,3.72987,0.576434,2.44922,1.6333L12.3659,11.55C14.1045,9.4635,14.497,6.5439,13.2992,4.0833ZM11.55,12.3667L1.6333,2.44995C0.576382,3.73057,-0.00117366,5.33951,0,6.99995C0.00200179,9.71425,1.5883,12.198,4.0833,13.3C6.544,14.4978,9.4635,14.1053,11.55,12.3667Z" fill-rule="evenodd" fill="${color}"></path></g>` +
    `</svg>`
  );
}

function svgNoData(): string {
  return (
    '<svg width="43" height="36" viewBox="0 0 43 36" style="margin-left:5px" xmlns="http://www.w3.org/2000/svg">' +
    '<polygon class="placeholder-item" points="0 12 8 12 8 32 0 32"></polygon>' +
    '<path class="placeholder-item" d="M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z"></path>' +
    '<path class="placeholder-item" d="M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z"></path>' +
    '<path class="placeholder-item" d="M23.8056018,18.9269221 C22.6697689,20.4923786 22,22.4179728 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 C33.5820272,34 35.5076214,33.3302311 37.0730779,32.1943982 L23.8056018,18.9269221 Z M25.9269221,16.8056018 L39.1943982,30.0730779 C40.3302311,28.5076214 41,26.5820272 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C29.4179728,15 27.4923786,15.6697689 25.9269221,16.8056018 Z M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z" fill-rule="nonzero"></path>' +
    '</svg>'
  );
}

function svgEmpty(): string {
  return (
    '<svg width="14" height="14" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z" fill="#AAAAAA"></path>' +
    '</svg>'
  );
}

function loadingDom(text: string): string {
  return (
    `<div class="${PREFIX}-loading-right-tip">` +
    `<div class="${PREFIX}-loading-indicator">` +
    '<div></div><div></div><div></div><div></div>' +
    '</div>' +
    `<div class="${PREFIX}-loading-tip-content">${escapeText(text)}</div>` +
    '</div>'
  );
}

function escapeText(value: string): string {
  return String(value).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}

const STYLE_ID = 'cloud-charts-wplaceholder-style';
const STYLES = `
.${PREFIX}{position:relative;width:100%;height:100%;min-height:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;}
.${PREFIX}-children{font-size:12px;line-height:1;width:100%;}
.${PREFIX}-children-text{margin-top:8px;}
.${PREFIX}-loading-right-tip{display:flex;align-items:center;}
.${PREFIX}-loading-indicator{display:inline-block;margin-right:6px;width:40px;height:40px;position:relative;}
.${PREFIX}-loading-indicator div{box-sizing:border-box;display:block;position:absolute;width:28px;height:28px;margin:6px;border:2px solid var(--widgets-loading,#aaaaaa);border-radius:50%;animation:cc-wplaceholder-spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:var(--widgets-loading,#aaaaaa) transparent transparent transparent;}
.${PREFIX}-loading-indicator div:nth-child(1){animation-delay:-0.45s;}
.${PREFIX}-loading-indicator div:nth-child(2){animation-delay:-0.3s;}
.${PREFIX}-loading-indicator div:nth-child(3){animation-delay:-0.15s;}
.${PREFIX}-loading-tip-content{display:inline-block;}
.${PREFIX} .placeholder-item{fill:var(--widgets-color-gray,#aaaaaa);}
@keyframes cc-wplaceholder-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
`;

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function applyContainerStyle(el: HTMLElement, opts: CreatePlaceholderOptions, state: PlaceholderState): void {
  const w = toSizeValue(opts.width);
  const h = toSizeValue(opts.height ?? '100%');
  if (w) el.style.width = w; else el.style.removeProperty('width');
  if (h) el.style.height = h; else el.style.removeProperty('height');
  if (opts.style) {
    for (const [k, v] of Object.entries(opts.style as Record<string, string | number>)) {
      (el.style as unknown as Record<string, string>)[k] = String(v);
    }
  }
  const classes = [PREFIX, FULL_CROSS];
  if (state === 'loading') classes.push(`${PREFIX}-loading`);
  else if (state === 'error') classes.push(`${PREFIX}-error`);
  else if (state === 'noData') classes.push(`${PREFIX}-no-data`);
  else if (state === 'empty') classes.push(`${PREFIX}-empty`);
  if (opts.className) classes.push(opts.className);
  el.className = classes.join(' ');
}

function buildBody(opts: CreatePlaceholderOptions, state: PlaceholderState): { html: string | null; children?: HTMLElement } {
  const language = opts.language ?? getLanguage();
  const theme = resolveTheme(opts.theme ?? getThemeName());
  const errorColor = String(theme.token['widgets-error-svg-color'] ?? '#f2887e');

  const text =
    state === 'normal' ? '' : String(getText(state === 'noData' ? 'noData' : state, { language, locale: opts.locale }) ?? '');

  if (opts.children != null) {
    if (typeof opts.children === 'string') {
      return { html: `<div class="${PREFIX}-children"><div class="${PREFIX}-children-text">${escapeText(opts.children)}</div></div>` };
    }
    return { html: null, children: opts.children };
  }

  if (state === 'loading') {
    return { html: loadingDom(text) };
  }

  if (state === 'empty') {
    return {
      html:
        `<div class="${PREFIX}-children">` +
        `<div class="${PREFIX}-children-text" style="margin-top:0;display:flex;align-items:center;justify-content:center;">` +
        svgEmpty() +
        `<span style="margin-left:4px">${escapeText(text)}</span>` +
        '</div></div>',
    };
  }

  if (state === 'error') {
    return {
      html:
        `<div class="${PREFIX}-children">` +
        `<div class="${PREFIX}-children-text" style="margin-top:0;display:flex;align-items:center;justify-content:center;">` +
        svgError(errorColor) +
        `<span style="margin-left:4px">${escapeText(text)}</span>` +
        '</div></div>',
    };
  }

  if (state === 'noData') {
    return {
      html:
        `<div class="${PREFIX}-children">` +
        svgNoData() +
        (text ? `<div class="${PREFIX}-children-text">${escapeText(text)}</div>` : '') +
        '</div>',
    };
  }

  return { html: `<div class="${PREFIX}-children">${svgBars()}</div>` };
}

/**
 * 框架无关的全局占位元素。返回 { el, update, destroy }。
 * - 内部订阅 setLanguage / setTheme 事件，自动 re-render
 * - 调用者负责把 el 挂载到 DOM，并在不再使用时调用 destroy()
 */
export function createPlaceholderElement(opts: CreatePlaceholderOptions = {}): PlaceholderHandle {
  if (typeof document === 'undefined') {
    return {
      el: undefined as unknown as HTMLElement,
      update() {},
      destroy() {},
    };
  }
  ensureStyles();

  const el = document.createElement('div');
  let current: CreatePlaceholderOptions = opts;

  function render(): void {
    const state = resolveState(current);
    applyContainerStyle(el, current, state);
    const body = buildBody(current, state);
    el.innerHTML = '';
    if (body.html != null) {
      el.innerHTML = body.html;
    } else if (body.children) {
      el.appendChild(body.children);
    }
  }

  render();

  const offLang = onLanguageChange(() => render());
  const offTheme = onThemeChange(() => render());

  return {
    el,
    update(next: CreatePlaceholderOptions): void {
      current = next;
      render();
    },
    destroy(): void {
      offLang();
      offTheme();
      if (el.parentNode) el.parentNode.removeChild(el);
      el.innerHTML = '';
    },
  };
}
