export interface CountUpOptions {
  startVal?: number;
  decimalPlaces?: number;
  duration?: number;
  useGrouping?: boolean;
  useEasing?: boolean;
  smartEasingThreshold?: number;
  smartEasingAmount?: number;
  separator?: string;
  decimal?: string;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  numerals?: string[];
  placeholder?: string;
}

export interface CountElement {
  el: HTMLElement;
  start(): void;
  update(newEnd: number): void;
  destroy(): void;
}

export interface CreateCountOptions extends CountUpOptions {
  end?: number;
  clipNum?: number;
  clipPeriod?: number;
  slipScale?: number[];
  className?: string;
}

function easeOutExpo(t: number, b: number, c: number, d: number): number {
  return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
}

class CountUpEngine {
  private el: HTMLElement;
  private options: Required<Pick<CountUpOptions, 'startVal' | 'decimalPlaces' | 'duration' | 'useGrouping' | 'useEasing' | 'smartEasingThreshold' | 'smartEasingAmount' | 'separator' | 'decimal' | 'prefix' | 'suffix' | 'placeholder'>> & CountUpOptions;
  private rAF: number | null = null;
  private startTime: number | null = null;
  private remaining: number;
  private finalEndVal: number | null = null;
  private useEasing: boolean;
  private countDown = false;
  private frameVal: number;
  private paused = true;
  private duration: number;
  private startVal: number;
  endVal: number;

  constructor(el: HTMLElement, endVal: number, opts?: CountUpOptions) {
    this.el = el;
    this.options = {
      startVal: 0, decimalPlaces: 0, duration: 2, useEasing: true, useGrouping: true,
      smartEasingThreshold: 999, smartEasingAmount: 333,
      separator: ',', decimal: '.', prefix: '', suffix: '', placeholder: '-',
      ...opts,
    };
    this.startVal = Number(this.options.startVal) || 0;
    this.frameVal = this.startVal;
    this.endVal = Number(endVal) || 0;
    this.options.decimalPlaces = Math.max(0, this.options.decimalPlaces);
    this.duration = this.options.duration * 1000;
    this.remaining = this.duration;
    this.useEasing = this.options.useEasing;
    if (this.options.separator === '') this.options.useGrouping = false;
    this.printValue(this.startVal);
  }

  start() {
    if (this.duration > 0) {
      this.determineDirection();
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    } else {
      this.printValue(this.endVal);
    }
  }

  update(newEndVal: number) {
    if (this.rAF) cancelAnimationFrame(this.rAF);
    this.startTime = null;
    this.endVal = Number(newEndVal) || 0;
    if (this.endVal === this.frameVal) return;
    this.startVal = this.frameVal;
    this.finalEndVal = null;
    this.duration = this.options.duration * 1000;
    this.remaining = this.duration;
    this.determineDirection();
    this.rAF = requestAnimationFrame(this.count);
  }

  pauseResume() {
    if (!this.paused) {
      if (this.rAF) cancelAnimationFrame(this.rAF);
    } else {
      this.startTime = null;
      this.duration = this.remaining;
      this.startVal = this.frameVal;
      this.determineDirection();
      this.rAF = requestAnimationFrame(this.count);
    }
    this.paused = !this.paused;
  }

  destroy() {
    if (this.rAF) cancelAnimationFrame(this.rAF);
    this.paused = true;
  }

  private determineDirection() {
    const end = this.finalEndVal ?? this.endVal;
    this.countDown = this.startVal > end;
    const animateAmount = end - this.startVal;
    if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
      this.finalEndVal = end;
      const up = this.countDown ? 1 : -1;
      this.endVal = end + up * this.options.smartEasingAmount;
      this.duration = this.duration / 2;
    } else {
      this.endVal = end;
      this.finalEndVal = null;
    }
    this.useEasing = this.finalEndVal ? false : this.options.useEasing;
  }

  private count = (timestamp: number) => {
    if (!this.startTime) this.startTime = timestamp;
    const progress = timestamp - this.startTime;
    this.remaining = this.duration - progress;

    const easeFn = this.options.easingFn || easeOutExpo;
    if (this.useEasing) {
      this.frameVal = this.countDown
        ? this.startVal - easeFn(progress, 0, this.startVal - this.endVal, this.duration)
        : easeFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
    } else {
      const ratio = progress / this.duration;
      this.frameVal = this.countDown
        ? this.startVal - (this.startVal - this.endVal) * ratio
        : this.startVal + (this.endVal - this.startVal) * ratio;
    }

    if (this.countDown) {
      this.frameVal = Math.max(this.frameVal, this.endVal);
    } else {
      this.frameVal = Math.min(this.frameVal, this.endVal);
    }
    this.frameVal = Number(this.frameVal.toFixed(this.options.decimalPlaces));
    this.printValue(this.frameVal);

    if (progress < this.duration) {
      this.rAF = requestAnimationFrame(this.count);
    } else if (this.finalEndVal !== null) {
      this.update(this.finalEndVal);
    }
  };

  private printValue(val: number) {
    const result = typeof val === 'number' && !isNaN(val)
      ? this.formatNumber(val)
      : (this.options.placeholder || '-');
    let html = '';
    for (let i = 0; i < result.length; i++) {
      const s = result.charAt(i);
      if (s === this.options.separator) {
        html += `<span class="count-up-separator">${s}</span>`;
      } else if (s === this.options.decimal) {
        html += `<span class="count-up-decimal">${s}</span>`;
      } else {
        html += `<span class="count-up-num-${s}">${s}</span>`;
      }
    }
    this.el.innerHTML = html;
  }

  private formatNumber(num: number): string {
    const neg = num < 0 ? '-' : '';
    let result = Math.abs(num).toFixed(this.options.decimalPlaces);
    const x = result.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? this.options.decimal + x[1] : '';
    if (this.options.useGrouping) {
      let x3 = '';
      for (let i = 0, len = x1.length; i < len; ++i) {
        if (i !== 0 && i % 3 === 0) x3 = this.options.separator + x3;
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    if (this.options.numerals?.length) {
      x1 = x1.replace(/[0-9]/g, (w) => this.options.numerals![+w]);
    }
    return neg + (this.options.prefix || '') + x1 + x2 + (this.options.suffix || '');
  }
}

function clipValue(start: number, end: number, clipNum: number, slipScale?: number[]): number[] {
  const result: number[] = [];
  const delta = end - start;
  const step = delta / clipNum;
  for (let i = 1; i < clipNum; i++) {
    result.push(slipScale?.[i] ? start + slipScale[i] * delta : start + step * i);
  }
  result.push(end);
  return result;
}

export function createCountElement(opts: CreateCountOptions): CountElement {
  const el = document.createElement('span');
  el.className = `cloud-charts cloud-charts-wcount ${opts.className || ''}`.trim();

  let engine: CountUpEngine | null = null;
  let clipTimer: ReturnType<typeof setInterval> | null = null;

  function init() {
    engine = new CountUpEngine(el, opts.end ?? 0, {
      startVal: opts.startVal ?? 0,
      decimalPlaces: opts.decimalPlaces ?? 0,
      duration: opts.duration ?? 1.5,
      useEasing: opts.useEasing ?? true,
      useGrouping: opts.useGrouping ?? true,
      separator: opts.separator ?? ',',
      decimal: opts.decimal ?? '.',
      placeholder: opts.placeholder ?? '-',
      easingFn: opts.easingFn,
      formattingFn: opts.formattingFn,
      prefix: opts.prefix,
      suffix: opts.suffix,
      numerals: opts.numerals,
    });
  }

  init();

  return {
    el,
    start() {
      engine?.start();
    },
    update(newEnd: number) {
      if (!engine) return;
      if (clipTimer) { clearInterval(clipTimer); clipTimer = null; }
      const clipNum = opts.clipNum ?? 1;
      if (clipNum > 1) {
        const clipArray = clipValue(engine.endVal, newEnd, clipNum, opts.slipScale);
        let loopIndex = 0;
        clipTimer = setInterval(() => {
          engine?.update(clipArray[loopIndex]);
          loopIndex++;
          if (loopIndex >= clipArray.length && clipTimer) {
            clearInterval(clipTimer);
            clipTimer = null;
          }
        }, (opts.clipPeriod ?? 5) * 1000);
      } else {
        engine.update(newEnd);
      }
    },
    destroy() {
      if (clipTimer) { clearInterval(clipTimer); clipTimer = null; }
      engine?.destroy();
      engine = null;
    },
  };
}
