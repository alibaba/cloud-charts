// @ts-nocheck
import merge from 'lodash/merge';
import tween, { Tween } from './_tween';
import { ChartData } from './_utils';

let uniqueId = 0;
function generateUniqueId() {
  return `shoot-${uniqueId++}`;
}

const PI = 2 * Math.PI;

const { sin, cos, atan, sqrt } = Math;

const pow2 = function (x: number) {
  return Math.pow(x, 2);
};

function random() {
  return Math.random() * 5 + 2.5;
}

interface PositionPoint {
  x: number;
  y: number;
}

export type getPositionFun = (d: Record<string, any>) => PositionPoint;

interface ShootConfig {
  width: number;
  height: number;
  autoUpdate?: boolean;
  maxFps?: number;
  interval?: number;
  dTime?: number;
  shootDurable?: boolean;
  shootTime?: {
    fromTime?: number;
    fromStop?: number;
    fromFade?: number;
    toBegin?: number;
    toTime?: number;
    toStop?: number;
    toFade?: number;
  };
  fromRadius?: number;
  toRadius?: number;
  fromBorder?: number;
  toBorder?: number;
  shootPointColor?: {
    fromPoint?: string;
    fromShadow?: string;
    toPoint?: string;
    toShadow?: string;
  };
  lineWidth?: number;
  lineColor?: {
    from?: string;
    to?: string;
  };
  bullet?: {
    r?: number;
    length?: number;
    color?: string;
    shadowColor?: string;
  };
  keys?: {
    from?: string;
    to?: string;
    fromValue?: string;
    toValue?: string;
    curvature?: string;
  };
}

class Shoot {
  sCtx: CanvasRenderingContext2D;
  tween: Tween;

  private canvas: HTMLCanvasElement;

  getPosition: getPositionFun;

  protected config: ShootConfig;

  constructor(canvas: HTMLCanvasElement, getPosition: getPositionFun, config: ShootConfig) {
    this.getPosition = getPosition;
    this.config = merge({
      autoUpdate: true,
      maxFps: 60,
      interval: 10000,
      dTime: 4000,
      shootTime: {
        fromTime: 0,
        fromStop: 0.4,
        fromFade: 0.1,
        toBegin: 0.3,
        toTime: 0.1,
        toStop: 0,
        toFade: 0.1,
      },
      fromRadius: 3,
      toRadius: 3,
      fromBorder: 1,
      toBorder: 1,
      shootPointColor: {
        fromPoint: '46, 133, 255',
        fromShadow: '46, 133, 255',
        toPoint: '46, 133, 255',
        toShadow: '46, 133, 255',
      },
      lineWidth: 2,
      lineColor: {
        from: '46, 133, 255',
        to: '46, 133, 255',
      },
      bullet: {
        r: 2.5,
        length: 20,
        color: 'rgb(46, 133, 255)',
        shadowColor: 'rgb(46, 133, 255)',
      },
      keys: {
        from: 'from',
        to: 'to',
        fromValue: 'fromValue',
        toValue: 'toValue',
        curvature: 'curvature',
      },
    }, config);

    canvas.width = this.config.width;
    canvas.height = this.config.height;

    this.canvas = canvas;

    this.sCtx = this.canvas.getContext('2d');
    this.sCtx.lineWidth = this.config.lineWidth;
  }

  clear(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.config;
    ctx.clearRect(0, 0, width, height);
  }

  changeSize(w: number, h: number) {
    this.config.width = w;
    this.config.height = h;

    this.canvas.width = w;
    this.canvas.height = h;
  }

  draw(data: ChartData) {
    if (!data || data.length === 0) {
      return;
    }
    const self = this;
    const { dTime } = self.config;
    const { interval } = self.config;
    const { autoUpdate } = self.config;
    const { maxFps } = self.config;
    const times = (interval / dTime) >> 0;
    const { keys } = self.config;
    const { sCtx } = self;
    const shoots: any[] = [];
    const shootMap: { [key: string]: PositionPoint[] } = {};
    const time = self.config.shootTime;
    const l = data.length;
    const getPosition = self.getPosition;
    let fCo: PositionPoint;
    let tCo: PositionPoint;
    let s: any;

    self.clear(sCtx);

    for (let i = 0; i < l; i++) {
      const d = data[i];
      fCo = { ...d[keys.from] };
      tCo = { ...d[keys.to] };

      if (getPosition) {
        const fP = getPosition(fCo);
        fCo.x = fP.x;
        fCo.y = fP.y;

        const tP = getPosition(tCo);
        tCo.x = tP.x;
        tCo.y = tP.y;
      }

      if (fCo && tCo) {
        const color = {};
        if (d._color) {
          Object.assign(color, d._color);
        }

        s = self.emit(fCo, tCo, d, color, time);

        s.index = (times - 1) * Math.random();

        if (!shootMap[s.index]) {
          shootMap[s.index] = [];
        }

        shootMap[s.index].forEach((city) => {
          if (city === tCo) {
            s.shooting = true;
          }
        });

        if (!s.shooting) {
          shootMap[s.index].push(tCo);
        }

        shoots.push(s);
      }
    }

    this.tween = tween(generateUniqueId(), {
      duration: interval,
      autoUpdate,
      maxFps,
    }, (t) => {
      self.clear(self.sCtx);
      shoots.forEach((shootFunction) => {
        shootFunction(t * times - shootFunction.index);
      });
    });
  }

  emit(fCo: PositionPoint, tCo: PositionPoint, data: { [x: string]: number; }, color: any, time: { fromTime?: number; fromStop?: number; fromFade?: number; toBegin?: number; toTime?: number; toStop?: number; toFade?: number; }) {
    const self = this;
    const { keys } = self.config;
    const { fromTime } = time;
    const { fromStop } = time;
    const { fromFade } = time;

    const { toBegin } = time;
    const { toTime } = time;
    const { toStop } = time;
    const { toFade } = time;

    const fromFadeBegin = fromTime + fromStop;
    const toFadeBegin = toBegin + toTime + toStop;
    const fr = self.config.fromRadius;
    const tr = self.config.toRadius;
    const h = data[keys.curvature] || random();
    const { shootDurable } = self.config;
    let s: any;

    s = function (t: number) {
      if (fCo) {
        if (t < fromTime) {
          self.from(fCo, fr, color)(t / fromTime);
        } else if (t > fromTime && t < fromFadeBegin) {
          self.from(fCo, fr, color)(1);
        } else if (t > fromFadeBegin) {
          self.from(fCo, fr, color, true)((t - fromFadeBegin) / fromFade);
        }
      }

      if (tCo) {
        if (t >= fromTime && t < toBegin) {
          self.track(fCo, tCo, false, color, h)((t - fromTime) / (toBegin - fromTime));
        } else if (t > toBegin && t < toFadeBegin) {
          if (shootDurable) {
            let time = -(t - fromTime) / (toBegin - fromTime);
            time -= Math.floor(time);
            time = 1 - time;
            self.track(fCo, tCo, true, color, h)(time);
          } else {
            self.track(fCo, tCo, true, color, h)(0);
          }
        } else if (t > toFadeBegin && t < toFadeBegin + toFade) {
          self.track(fCo, tCo, true, color, h)((t - toFadeBegin) / toFade);
        }

        if (!s.shooting) {
          if (t >= toBegin && t < (toBegin + toTime)) {
            if (!s.to) {
              s.to = true;
            }
            self.to(tCo, tr, color)((t - toBegin) / toTime);
          } else if (t > (toBegin + toTime) && t < toFadeBegin) {
            self.to(tCo, tr, color)(1);
          } else if (t >= toFadeBegin) {
            self.to(tCo, tr, color, true, 3)((t - toFadeBegin) / toFade);
          }
        }
      }
    };

    return s;
  }

  from(co: PositionPoint, r: number, color: { fColor?: any; }, zoom?: boolean) {
    const self = this;
    const c = `rgba(${color.fColor || this.config.shootPointColor.fromPoint},`;
    const b = self.config.fromBorder;
    const { sCtx } = self;

    return function (t: number) {
      if (t > 1 || t < 0) {
        return;
      }

      if (zoom) {
        t = 1 - t;
      }

      sCtx.save();

      sCtx.beginPath();
      sCtx.strokeStyle = `${c + t})`;
      sCtx.lineWidth = b * t;
      sCtx.fillStyle = `${c}0.3)`;

      sCtx.shadowColor = `rgba(${color.fColor || self.config.shootPointColor.fromShadow},1)`;
      sCtx.shadowBlur = 5;
      sCtx.shadowOffsetX = 0;
      sCtx.shadowOffsetY = 0;

      sCtx.arc(co.x, co.y, r * t, 0, PI);

      sCtx.fill();
      sCtx.stroke();

      sCtx.beginPath();
      sCtx.fillStyle = `${c}1)`;
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  }

  to(co: PositionPoint, r: number, color: { tColor?: any; }, zoom?: boolean, n?: number, anticlockwise?: undefined) {
    const self = this;
    const c = `rgba(${color.tColor || this.config.shootPointColor.toPoint},`;
    const b = self.config.toBorder;
    const { sCtx } = self;

    return function (t: number) {
      let rad = 0;

      if (t > 1 || t < 0) {
        return;
      }

      sCtx.save();

      if (n) {
        rad = n * PI * t;

        if (anticlockwise) {
          rad = -rad;
        }
      }

      if (zoom) {
        t = 1 - t;
      }

      sCtx.beginPath();
      sCtx.fillStyle = `${c}0.3)`;
      sCtx.arc(co.x, co.y, r * t, 0, PI);
      sCtx.fill();

      sCtx.beginPath();
      sCtx.strokeStyle = `${c + t})`;
      sCtx.lineWidth = b * t;
      sCtx.shadowColor = `rgba(${color.tColor || self.config.shootPointColor.toShadow},1)`;
      sCtx.shadowBlur = 10;
      sCtx.shadowOffsetX = 0;
      sCtx.shadowOffsetY = 0;

      sCtx.arc(co.x, co.y, r * t, rad, PI / 6 + rad);
      sCtx.moveTo(co.x + r * cos(PI / 3 + rad) * t, co.y + r * sin(PI / 3 + rad) * t);
      sCtx.arc(co.x, co.y, r * t, PI / 3 + rad, PI / 2 + rad);
      sCtx.moveTo(co.x + r * cos(PI * 2 / 3 + rad) * t, co.y + r * sin(PI * 2 / 3 + rad) * t);
      sCtx.arc(co.x, co.y, r * t, PI * 2 / 3 + rad, PI * 5 / 6 + rad);

      sCtx.stroke();

      sCtx.beginPath();
      sCtx.fillStyle = `${c}1)`;
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  }

  track(fCo: PositionPoint, tCo: PositionPoint, fade: boolean, color: { fColor?: any; tColor?: any; bullet?: any; }, h: number, overview?: boolean) {
    const self = this;
    const { sCtx: ctx } = self;
    const fColor = `rgba(${color.fColor || self.config.lineColor.from},`;
    const tColor = `rgba(${color.tColor || self.config.lineColor.to},`;

    const x1 = fCo.x;
    const y1 = fCo.y;
    const x2 = tCo.x;
    const y2 = tCo.y;

    const dx = (x1 + x2) / 2;
    const dy = (y1 + y2) / 2;
    const j = (x1 - x2) / (y2 - y1);
    const k = dy - j * dx;
    const d = sqrt(pow2(x1 - x2) + pow2(y1 - y2)) / h;
    const rad = atan(j);
    const cx = d * cos(rad);
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const bulletR = this.config.bullet.r;
    const bulletLen = this.config.bullet.length;
    const { shootDurable } = self.config;

    let x3 = (x1 + x2) / 2 + cx;
    let y3 = j * x3 + k;

    if (isNaN(j) || j > 10) {
      x3 = dx;
      y3 = dy - h - dx / 20;
    } else if (Math.abs(j) < 0.1) {
      x3 = y1 < y2 ? dx + h + dy / 20 : dx - h - dy / 20;
      y3 = dy;
    } else if (Math.abs(j) >= 1) {
      y3 = dy - cx;
      x3 = (y3 - k) / j;
    } else if (j > 0) {
      x3 = (x1 + x2) / 2 - cx;
      y3 = j * x3 + k;
    }

    return function (t: number) {
      let x0;
      let y0;
      let kx;
      let ky;
      let rx;
      let ry;
      let r;
      let gradientOpacity = 0.7;

      if (t > 1 || t < 0) {
        return;
      }

      if (!overview) {
        if (fade) {
          gradientOpacity = (1 - t) < 0.01 ? 0.01 : (1 - t);
        } else {
          gradientOpacity = t < 0.01 ? 0.01 : t;
        }

        if (shootDurable) {
          gradientOpacity = 1;
        }
      }

      x0 = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * x3 + t * t * x2;
      y0 = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * y3 + t * t * y2;

      kx = -2 * x1 * (1 - t) + 2 * x3 * (1 - 2 * t) + 2 * x2 * t;
      ky = -2 * y1 * (1 - t) + 2 * y3 * (1 - 2 * t) + 2 * y2 * t;

      rx = (x1 + x0) / 2;
      ry = (y1 + y0) / 2;

      r = sqrt(pow2(x1 - x0) + pow2(y1 - y0)) / 2;

      ctx.save();

      gradient.addColorStop(0, `${fColor + gradientOpacity})`);
      gradient.addColorStop(1, `${tColor + gradientOpacity})`);

      if (!fade && !overview) {
        ctx.arc(rx, ry, r, 0, PI);
        ctx.clip();
      }

      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = gradient;

      ctx.lineWidth = self.config.lineWidth;

      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(x3, y3, x2, y2);

      ctx.stroke();

      ctx.restore();

      let a = atan(ky / kx);

      if (ky > 0 && kx < 0) {
        a += PI / 2;
      } else if (ky < 0 && kx < 0) {
        a -= PI / 2;
      }

      if (shootDurable) {
        self.drawBullet(x0, y0, a, color.bullet, bulletR, bulletLen);
      } else if (!fade && !overview) {
        self.drawBullet(x0, y0, a, color.bullet, bulletR, bulletLen);
      }
    };
  }

  drawBullet(x: number, y: number, a: number, color: string, r: number, len: number) {
    const self = this;
    const { sCtx } = self;

    sCtx.save();

    sCtx.translate(x, y);
    sCtx.rotate(a);
    sCtx.translate(-x, -y);

    sCtx.beginPath();

    sCtx.globalCompositeOperation = 'lighter';

    sCtx.shadowColor = color || this.config.bullet.shadowColor;
    sCtx.shadowBlur = 20;
    sCtx.shadowOffsetX = 0;
    sCtx.shadowOffsetY = 0;

    sCtx.fillStyle = color || this.config.bullet.color;
    sCtx.arc(x, y, r, -PI / 4, PI / 4);

    sCtx.lineTo(x - len, y);

    sCtx.closePath();

    sCtx.fill();

    sCtx.restore();
  }

  update(time: number) {
    if (this.tween && this.tween.update) {
      this.tween.update(time);
    }
  }

  destroy() {
    this.clear(this.sCtx);
    this.tween && this.tween.destroy();
  }
}

export default Shoot;
