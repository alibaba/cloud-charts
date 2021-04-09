import { merge } from '../common/common';
import tween, { Tween } from '../common/tween';
import { ChartData, Types } from '../common/types';

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

export type getPositionFun = (d: Types.LooseObject) => PositionPoint;

interface ShootConfig {
  width: number;
  height: number;
  autoUpdate?: boolean;
  maxFps?: number;
  interval?: number; // 单次飞线总时间
  dTime?: number; // 单条飞线预计的时间
  shootDurable?: boolean;
  // batch: false;
  shootTime?: {// 飞行过程中的各个时间 值域[0, 1]
    fromTime?: number; // 出发时间（瞬时）
    fromStop?: number; // 出发点保留时间（持续）
    fromFade?: number; // 出发点消失所用时间（持续）
    toBegin?: number; // 到达目标点的时间（瞬时）
    toTime?: number; // 到达点显示所用时间（持续）
    toStop?: number; // 到达点停留持续时间（持续）
    toFade?: number; // 到达点消失所用时间（持续）
  };
  fromRadius?: number; // 出发点半径
  toRadius?: number; // 到达点半径
  fromBorder?: number; // 出发点边框宽度
  toBorder?: number; // 到达点边框宽度
  shootPointColor?: {
    fromPoint?: string; // 出发点颜色
    fromShadow?: string; // 出发点阴影颜色
    toPoint?: string; // 到达点颜色
    toShadow?: string; // 到达点阴影颜色
  };
  lineWidth?: number; // 飞线宽度
  lineColor?: {
    from?: string; // 线出发颜色
    to?: string; // 线到达颜色
  };
  bullet?: {
    r?: number; // 弹头半径
    length?: number; // 弹头长度
    color?: string;
    shadowColor?: string;
  };
  keys?: {
    from?: string;
    to?: string;
    fromValue?: string;
    toValue?: string;
    curvature?: string; // 曲率半径，值越大越平坦
  };
}

class Shoot {
  sCtx: CanvasRenderingContext2D;
  tween: Tween;

  constructor(private canvas: HTMLCanvasElement, private getPosition: getPositionFun, protected config: ShootConfig) {
    // this.uuid = generateUniqueId();
    this.getPosition = getPosition;
    this.config = merge({
      autoUpdate: true,
      maxFps: 60,
      interval: 10000, // 单次飞线总时间
      dTime: 4000, // 单条飞线预计的时间
      // batch: false,
      shootTime: {// 飞行过程中的各个时间 值域[0, 1]
        fromTime: 0, // 出发时间（瞬时）
        fromStop: 0.4, // 出发点保留时间（持续）
        fromFade: 0.1, // 出发点消失所用时间（持续）
        toBegin: 0.3, // 到达目标点的时间（瞬时）
        toTime: 0.1, // 到达点显示所用时间（持续）
        toStop: 0, // 到达点停留持续时间（持续）
        toFade: 0.1, // 到达点消失所用时间（持续）
      },
      fromRadius: 3, // 出发点半径
      toRadius: 3, // 到达点半径
      fromBorder: 1, // 出发点边框宽度
      toBorder: 1, // 到达点边框宽度
      shootPointColor: {
        fromPoint: '46, 133, 255', // 出发点颜色
        fromShadow: '46, 133, 255', // 出发点阴影颜色
        toPoint: '46, 133, 255', // 到达点颜色
        toShadow: '46, 133, 255', // 到达点阴影颜色
      },
      lineWidth: 2, // 飞线宽度
      lineColor: {
        from: '46, 133, 255', // 线出发颜色
        to: '46, 133, 255', // 线到达颜色
      },
      bullet: {
        r: 2.5, // 弹头半径
        length: 20, // 弹头长度
        color: 'rgb(46, 133, 255)',
        shadowColor: 'rgb(46, 133, 255)',
      },
      keys: {
        from: 'from',
        to: 'to',
        fromValue: 'fromValue',
        toValue: 'toValue',
        curvature: 'curvature', // 曲率半径，值越大越平坦
      },
    }, config);

    canvas.width = this.config.width;
    canvas.height = this.config.height;

    // 射击canvas层
    this.canvas = canvas;

    this.sCtx = this.canvas.getContext('2d');
    this.sCtx.lineWidth = this.config.lineWidth;
  }

  // 清除画布
  clear(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.config;

    ctx.clearRect(0, 0, width, height);
  }

  changeSize(w: number, h: number) {
    this.config.width = w;
    this.config.height = h;

    this.canvas.width = w;
    this.canvas.height = h;

    // 更新uuid让动画更新
    // this.uuid = generateUniqueId();
  }

  draw(data: ChartData) {
    if (!data || data.length === 0) {
      return;
    }
    const self = this;
    const { dTime } = self.config;
    // 由于要保证interval时间内完成全部动画
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

    // 先清除画布
    self.clear(sCtx);

    for (let i = 0; i < l; i++) {
      const d = data[i];
      fCo = { ...d[keys.from] };
      tCo = { ...d[keys.to] };

      // 设置了 getPosition 函数，需要处理一遍
      if (getPosition) {
        const fP = getPosition(fCo);
        fCo.x = fP.x;
        fCo.y = fP.y;

        const tP = getPosition(tCo);
        tCo.x = tP.x;
        tCo.y = tP.y;
      }

      // const fromCityName = d[keys.from];
      // const toCityName = d[keys.to];
      //
      // if (typeof fromCityName === 'object') {
      //   fCo = fromCityName;
      // } else {
      //   // 获取出发城市在画布上的坐标
      //   fCo = self.map.getCoord(fromCityName);
      // }
      //
      // if (typeof toCityName === 'object') {
      //   tCo = toCityName;
      // } else {
      //   // 获取到达城市在画布上的坐标
      //   tCo = self.map.getCoord(toCityName);
      // }

      if (fCo && tCo) {
        const color = {};
        // 如果数据带有颜色配置
        if (d._color) {
          Object.assign(color, d._color);
        }

        s = self.emit(fCo, tCo, d, color, time);

        s.index = (times - 1) * Math.random();

        // 判断是否是多点同时射击一个点
        if (!shootMap[s.index]) {
          shootMap[s.index] = [];
        }

        shootMap[s.index].forEach((city) => {
          if (city === tCo) {
            // 正在被攻击
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

  emit(fCo: PositionPoint, tCo: PositionPoint, data: { [x: string]: number; }, color: {}, time: { fromTime?: number; fromStop?: number; fromFade?: number; toBegin?: number; toTime?: number; toStop?: number; toFade?: number; }) {
    const self = this;
    const { keys } = self.config;
    // 发射出现时间段
    const { fromTime } = time;
    // 发射停留时间段
    const { fromStop } = time;
    // 发射消失时间段
    const { fromFade } = time;

    // 击中开始时间点
    const { toBegin } = time;
    // 击中出现时间段
    const { toTime } = time;
    // 击中停留时间段
    const { toStop } = time;
    // 击中消失时间段
    const { toFade } = time;

    // 发射消失时间点
    const fromFadeBegin = fromTime + fromStop;
    // 命中消失时间点
    const toFadeBegin = toBegin + toTime + toStop;
    // 发射半径
    const fr = self.config.fromRadius;
    const tr = self.config.toRadius;
    const h = data[keys.curvature] || random();
    const { shootDurable } = self.config;
    let s: any;

    s = function (t: number) {
      if (fCo) {
        // 出发:
        // 1. 出现
        if (t < fromTime) {
          self.from(fCo, fr, color)(t / fromTime);
          // 2. 停留
        } else if (t > fromTime && t < fromFadeBegin) {
          self.from(fCo, fr, color)(1);
          // 3. 消失
        } else if (t > fromFadeBegin) {
          self.from(fCo, fr, color, true)((t - fromFadeBegin) / fromFade);
        }
      }

      if (tCo) {
        // 轨迹
        if (t >= fromTime && t < toBegin) {
          // 出发 - 到达瞬间
          self.track(fCo, tCo, false, color, h)((t - fromTime) / (toBegin - fromTime));
        } else if (t > toBegin && t < toFadeBegin) {
          // 到达后停留
          // TODO add by kaihong.tkh
          if (shootDurable) {
            let time = -(t - fromTime) / (toBegin - fromTime);
            time -= Math.floor(time);
            time = 1 - time;
            self.track(fCo, tCo, true, color, h)(time);
          } else {
            self.track(fCo, tCo, true, color, h)(0);
          }
        } else if (t > toFadeBegin && t < toFadeBegin + toFade) {
          // 停留后消失时间
          self.track(fCo, tCo, true, color, h)((t - toFadeBegin) / toFade);
        }


        // 如果不是正在被射击
        if (!s.shooting) {
          // 到达:
          // 1. 放大
          if (t >= toBegin && t < (toBegin + toTime)) {
            if (!s.to) {
              s.to = true;
            }
            self.to(tCo, tr, color)((t - toBegin) / toTime);
            // 2. 停留
          } else if (t > (toBegin + toTime) && t < toFadeBegin) {
            self.to(tCo, tr, color)(1);
            // 3. 消失
          } else if (t >= toFadeBegin) {
            self.to(tCo, tr, color, true, 3)((t - toFadeBegin) / toFade);
          }
        }
      }
    };

    return s;
  }

  // CHECK zoom 没有传入
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

      // 画背景圆
      sCtx.beginPath();
      sCtx.strokeStyle = `${c + t})`;
      sCtx.lineWidth = b * t;
      sCtx.fillStyle = `${c}0.3)`;

      // shadow
      sCtx.shadowColor = `rgba(${color.fColor || self.config.shootPointColor.fromShadow},1)`;
      sCtx.shadowBlur = 5;
      sCtx.shadowOffsetX = 0;
      sCtx.shadowOffsetY = 0;

      sCtx.arc(co.x, co.y, r * t, 0, PI);

      sCtx.fill();
      sCtx.stroke();

      // 画中心圆
      sCtx.beginPath();
      sCtx.fillStyle = `${c}1)`;
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  }

  // CHECK anticlockwise 没有传入
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

      // 每次转的角度
      if (n) {
        rad = n * PI * t;

        if (anticlockwise) {
          rad = -rad;
        }
      }

      if (zoom) {
        t = 1 - t;
      }

      // 画背景圆
      sCtx.beginPath();
      sCtx.fillStyle = `${c}0.3)`;
      sCtx.arc(co.x, co.y, r * t, 0, PI);
      sCtx.fill();

      // 画离散弧线
      sCtx.beginPath();
      sCtx.strokeStyle = `${c + t})`;
      sCtx.lineWidth = b * t;
      // shadow
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

      // 画中心圆
      sCtx.beginPath();
      sCtx.fillStyle = `${c}1)`;
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  }

  // CHECK overview 没有传入
  track(fCo: PositionPoint, tCo: PositionPoint, fade: boolean, color: { fColor?: any; tColor?: any; bullet?: any; }, h: number, overview?: boolean) {
    const self = this;
    const { sCtx: ctx } = self;
    const fColor = `rgba(${color.fColor || self.config.lineColor.from},`;
    const tColor = `rgba(${color.tColor || self.config.lineColor.to},`;

    // (x1, y1) 出发点，(x2, y2) 到达点
    const x1 = fCo.x;
    const y1 = fCo.y;
    const x2 = tCo.x;
    const y2 = tCo.y;

    // 求法线方程
    // y = j * x + k
    const dx = (x1 + x2) / 2;
    const dy = (y1 + y2) / 2;
    const j = (x1 - x2) / (y2 - y1);
    const k = dy - j * dx;
    // d用来控制弧线的弧度
    const d = sqrt(pow2(x1 - x2) + pow2(y1 - y2)) / h;
    const rad = atan(j);
    const cx = d * cos(rad);
    // 渐变
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const bulletR = this.config.bullet.r;
    const bulletLen = this.config.bullet.length;
    const { shootDurable } = self.config;

    // 控制点坐标
    let x3 = (x1 + x2) / 2 + cx;
    let y3 = j * x3 + k;

    if (isNaN(j) || j > 10 ) {
      // 水平方向
      x3 = dx;
      y3 = dy - h - dx / 20;
    } else if (Math.abs(j) < 0.1) {
      // 竖直方向
      x3 = y1 < y2 ? dx + h + dy / 20 : dx - h - dy / 20;
      y3 = dy;
    } else if (Math.abs(j) >= 1) { // 之后的两个条件判断请画象限图理解。。。估计明天我也忘记为什么要这么写了
      y3 = dy - cx;
      x3 = (y3 - k) / j;
    } else if (j > 0) {
      x3 = (x1 + x2) / 2 - cx;
      y3 = j * x3 + k;
    }

    return function (t: number) {
      // 移动点坐标
      let x0;
      let y0;
      // 贝塞尔曲线切线斜率
      let kx;
      let ky;
      // 蒙板起始坐标
      let rx;
      let ry;
      // 蒙板半径
      let r;
      let gradientOpacity = 0.7;

      if (t > 1 || t < 0) {
        return;
      }

      // TODO：最好加上一个透明度变化的动画
      if (!overview) {
        if (fade) {
          // 避免出现科学计数法，rgba中的透明值不能设为科学计数法
          gradientOpacity = (1 - t) < 0.01 ? 0.01 : (1 - t);
        } else {
          gradientOpacity = t < 0.01 ? 0.01 : t;
        }

        if (shootDurable) {
          gradientOpacity = 1; // add by kaihong.tkh 线不需要渐变
        }
      }

      // 贝塞尔曲线方程
      x0 = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * x3 + t * t * x2;
      y0 = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * y3 + t * t * y2;

      // 贝塞尔曲线切线方程
      kx = -2 * x1 * (1 - t) + 2 * x3 * (1 - 2 * t) + 2 * x2 * t;
      ky = -2 * y1 * (1 - t) + 2 * y3 * (1 - 2 * t) + 2 * y2 * t;

      rx = (x1 + x0) / 2;
      ry = (y1 + y0) / 2;

      r = sqrt(pow2(x1 - x0) + pow2(y1 - y0)) / 2;

      ctx.save();

      gradient.addColorStop(0, `${fColor + gradientOpacity})`);
      gradient.addColorStop(1, `${tColor + gradientOpacity})`);

      if (!fade && !overview) {
        // 创建圆形蒙板
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

      // 计算旋转角度
      if (ky > 0 && kx < 0) {
        a += PI / 2;
      } else if (ky < 0 && kx < 0) {
        a -= PI / 2;
      }

      // TODO add by kaihong.tkh
      if (shootDurable) {
        self.drawBullet(x0, y0, a, color.bullet, bulletR, bulletLen);
      } else if (!fade && !overview) {
        // ky/kx 为切线斜率
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

    // shadow
    sCtx.shadowColor = this.config.bullet.shadowColor;
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
