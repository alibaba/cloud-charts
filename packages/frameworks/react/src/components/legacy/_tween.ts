// Inlined tween utility (from src/common/tween.ts)
// @ts-nocheck

interface TweenConfig {
  autoUpdate?: boolean;
  maxFps?: number;
  duration?: number;
}

export type TweenCallback = (v: number) => void;

export class Tween {
  interval: number;
  timer: any;
  _startTime: number;
  lastUpdate: number;
  _isPlay: boolean;

  private config: TweenConfig;
  private callback: TweenCallback;

  constructor(config: TweenConfig, callback: TweenCallback) {
    const { maxFps = 60 } = config;
    this.config = config;
    this.callback = callback;
    this.refresh = this.refresh.bind(this);
    this.lastUpdate = 0;
    this.interval = 1000 / maxFps;
    this.timer = null;

    this.start();
  }

  start() {
    this._isPlay = true;
    this._startTime = Date.now();
    this.lastUpdate = this._startTime;
    this.refresh();
  }

  stop() {
    this._isPlay = false;
  }

  refresh() {
    if (this._isPlay && this.config.autoUpdate) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        this.timer = window.requestAnimationFrame(this.refresh);
      } else {
        this.timer = setTimeout(this.refresh, 1000 / 60);
      }

      const now = Date.now();
      if ((this.config.maxFps || 60) < 60) {
        const delta = now - this.lastUpdate;
        if (delta > this.interval) {
          this.lastUpdate = now - (delta % this.interval);
          this.update(now);
        }
      } else {
        this.update(now);
      }
    }
  }

  update(time: number) {
    const now = time || Date.now();

    if (now < this._startTime) {
      return;
    }

    let elapsed = (now - this._startTime) / (this.config.duration || 1000);
    elapsed = elapsed > 1 ? 1 : elapsed;

    this.callback(elapsed);

    if (elapsed === 1) {
      this.stop();
    }
  }

  destroy() {
    this.stop();

    if (this.timer) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.cancelAnimationFrame(this.timer);
      } else {
        clearTimeout(this.timer);
      }
    }
  }
}

interface TweenMap {
  [name: string]: Tween;
}

const nameMap: TweenMap = {};

export default function tween(name: string | number, config: TweenConfig, callback: TweenCallback) {
  if (nameMap[name]) {
    nameMap[name].start();
  } else {
    nameMap[name] = new Tween(config, callback);
  }

  return nameMap[name];
}
