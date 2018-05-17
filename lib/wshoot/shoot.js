'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _tween = require('../utils/tween');

var _tween2 = _interopRequireDefault(_tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uniqueId = 0;
function generateUniqueId() {
  return 'shoot-' + uniqueId++;
}

var PI = 2 * Math.PI;

function Shoot(canvas, map, config) {
  this.uuid = generateUniqueId();
  this.map = map;
  this.config = (0, _merge2.default)({
    autoUpdate: true,
    maxFps: 60,
    interval: 10000, // 单次飞线总时间
    dTime: 4000, // 单条飞线预计的时间
    // batch: false,
    shootTime: { // 飞行过程中的各个时间 值域[0, 1]
      fromTime: 0, // 出发时间（瞬时）
      fromStop: 0.4, // 出发点保留时间（持续）
      fromFade: 0.1, // 出发点消失所用时间（持续）
      toBegin: 0.3, // 到达目标点的时间（瞬时）
      toTime: 0.1, // 到达点显示所用时间（持续）
      toStop: 0, // 到达点停留持续时间（持续）
      toFade: 0.1 // 到达点消失所用时间（持续）
    },
    fromRadius: 3, // 出发点半径
    toRadius: 3, // 到达点半径
    fromBorder: 1, // 出发点边框宽度
    toBorder: 1, // 到达点边框宽度
    shootPointColor: {
      fromPoint: '46, 133, 255', // 出发点颜色
      fromShadow: '46, 133, 255', // 出发点阴影颜色
      toPoint: '46, 133, 255', // 到达点颜色
      toShadow: '46, 133, 255' // 到达点阴影颜色
    },
    lineWidth: 2, // 飞线宽度
    lineColor: {
      from: '46, 133, 255', // 线出发颜色
      to: '46, 133, 255' // 线到达颜色
    },
    bullet: {
      r: 2.5, // 弹头半径
      length: 20, // 弹头长度
      color: 'rgb(46, 133, 255)',
      shadowColor: 'rgb(46, 133, 255)'
    },
    keys: {
      from: 'from',
      to: 'to',
      fromValue: 'fromValue',
      toValue: 'toValue',
      curvature: 'curvature' // 曲率半径，值越大越平坦
    }
  }, config);

  canvas.width = this.config.width;
  canvas.height = this.config.height;

  // 射击canvas层
  this.canvas = canvas;

  this.sCtx = this.canvas.getContext('2d');
  this.sCtx.lineWidth = this.config.lineWidth;
}

function random() {
  return Math.random() * 5 + 2.5;
}

Shoot.prototype = {
  // 清除画布
  clear: function clear(ctx) {
    var _config = this.config,
        width = _config.width,
        height = _config.height;


    ctx.clearRect(0, 0, width, height);
  },
  draw: function draw(data) {
    if (!data) {
      return;
    }
    var self = this,
        dTime = self.config.dTime,

    // 由于要保证interval时间内完成全部动画
    interval = self.config.interval,
        autoUpdate = self.config.autoUpdate,
        maxFps = self.config.maxFps,
        times = interval / dTime >> 0,
        keys = self.config.keys,
        sCtx = self.sCtx,
        shoots = [],
        shootMap = {},
        time = self.config.shootTime,
        l = data.length;

    var fCo = void 0,
        tCo = void 0,
        s = void 0;

    // 先清除画布
    self.clear(sCtx);

    var _loop = function _loop(i) {
      var d = data[i],
          fromCityName = d[keys.from],
          toCityName = d[keys.to];

      if ((typeof fromCityName === 'undefined' ? 'undefined' : _typeof(fromCityName)) === 'object') {
        fCo = fromCityName;
        // } else {
        //   // 获取出发城市在画布上的坐标
        //   fCo = self.map.getCoord(fromCityName);
      }

      if ((typeof toCityName === 'undefined' ? 'undefined' : _typeof(toCityName)) === 'object') {
        tCo = toCityName;
        // } else {
        //   // 获取到达城市在画布上的坐标
        //   tCo = self.map.getCoord(toCityName);
      }

      if (fCo && tCo) {
        var color = {};
        // 如果数据带有颜色配置
        if (d._color) {
          _extends(color, d._color);
        }

        s = self.emit(fCo, tCo, d, color, time);

        s.index = (times - 1) * Math.random();

        // 判断是否是多点同时射击一个点
        if (!shootMap[s.index]) {
          shootMap[s.index] = [];
        }

        shootMap[s.index].forEach(function (city) {
          if (city === toCityName) {
            // 正在被攻击
            s.shooting = true;
          }
        });

        if (!s.shooting) {
          shootMap[s.index].push(toCityName);
        }

        shoots.push(s);
      }
    };

    for (var i = 0; i < l; i++) {
      _loop(i);
    }

    this.tween = (0, _tween2.default)(this.uuid, {
      duration: interval,
      autoUpdate: autoUpdate,
      maxFps: maxFps
    }, function (t) {
      self.clear(sCtx);
      shoots.forEach(function (shootFunction) {
        shootFunction(t * times - shootFunction.index);
      });
    });
  },
  emit: function emit(fCo, tCo, data, color, time) {
    var self = this,
        keys = self.config.keys,
        sCtx = self.sCtx,

    // 发射出现时间段
    fromTime = time.fromTime,

    // 发射停留时间段
    fromStop = time.fromStop,

    // 发射消失时间段
    fromFade = time.fromFade,


    // 击中开始时间点
    toBegin = time.toBegin,

    // 击中出现时间段
    toTime = time.toTime,

    // 击中停留时间段
    toStop = time.toStop,

    // 击中消失时间段
    toFade = time.toFade,


    // 发射消失时间点
    fromFadeBegin = fromTime + fromStop,

    // 命中消失时间点
    toFadeBegin = toBegin + toTime + toStop,

    // 发射半径
    fr = self.config.fromRadius,
        tr = self.config.toRadius,
        h = data[keys.curvature] || random(),
        shootDurable = self.config.shootDurable;

    var _s = void 0;

    _s = function s(t) {
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
          self.track(sCtx, fCo, tCo, false, color, h)((t - fromTime) / (toBegin - fromTime));
        } else if (t > toBegin && t < toFadeBegin) {
          // 到达后停留
          // TODO add by kaihong.tkh
          if (shootDurable) {
            var _time = -(t - fromTime) / (toBegin - fromTime);
            _time -= Math.floor(_time);
            _time = 1 - _time;
            self.track(sCtx, fCo, tCo, true, color, h)(_time);
          } else {
            self.track(sCtx, fCo, tCo, true, color, h)(0);
          }
        } else if (t > toFadeBegin && t < toFadeBegin + toFade) {
          // 停留后消失时间
          self.track(sCtx, fCo, tCo, true, color, h)((t - toFadeBegin) / toFade);
        }

        // 如果不是正在被射击
        if (!_s.shooting) {
          // 到达:
          // 1. 放大
          if (t >= toBegin && t < toBegin + toTime) {
            if (!_s.to) {
              _s.to = true;
            }
            self.to(tCo, tr, color)((t - toBegin) / toTime);
            // 2. 停留
          } else if (t > toBegin + toTime && t < toFadeBegin) {
            self.to(tCo, tr, color)(1);
            // 3. 消失
          } else if (t >= toFadeBegin) {
            self.to(tCo, tr, color, true, 3)((t - toFadeBegin) / toFade);
          }
        }
      }
    };

    return _s;
  },
  from: function from(co, r, color, zoom) {
    var self = this,
        c = 'rgba(' + (color.fColor || this.config.shootPointColor.fromPoint) + ',',
        b = self.config.fromBorder,
        sCtx = self.sCtx;

    return function (t) {
      if (t > 1 || t < 0) {
        return;
      }

      if (zoom) {
        t = 1 - t;
      }

      sCtx.save();

      // 画背景圆
      sCtx.beginPath();
      sCtx.strokeStyle = c + t + ')';
      sCtx.lineWidth = b * t;
      sCtx.fillStyle = c + '0.3)';

      // shadow
      sCtx.shadowColor = 'rgba(' + (color.fColor || self.config.shootPointColor.fromShadow) + ',1)';
      sCtx.shadowBlur = 5;
      sCtx.shadowOffsetX = 0;
      sCtx.shadowOffsetY = 0;

      sCtx.arc(co.x, co.y, r * t, 0, PI);

      sCtx.fill();
      sCtx.stroke();

      // 画中心圆
      sCtx.beginPath();
      sCtx.fillStyle = c + '1)';
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  },
  to: function to(co, r, color, zoom, n, anticlockwise) {
    var self = this,
        c = 'rgba(' + (color.tColor || this.config.shootPointColor.toPoint) + ',',
        b = self.config.toBorder,
        sCtx = self.sCtx,
        sin = Math.sin,
        cos = Math.cos;

    return function (t) {
      var rad = 0;

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
      sCtx.fillStyle = c + '0.3)';
      sCtx.arc(co.x, co.y, r * t, 0, PI);
      sCtx.fill();

      // 画离散弧线
      sCtx.beginPath();
      sCtx.strokeStyle = c + t + ')';
      sCtx.lineWidth = b * t;
      // shadow
      sCtx.shadowColor = 'rgba(' + (color.tColor || self.config.shootPointColor.toShadow) + ',1)';
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
      sCtx.fillStyle = c + '1)';
      sCtx.arc(co.x, co.y, 2 * t, 0, PI);
      sCtx.fill();

      sCtx.restore();
    };
  },
  track: function track(ctx, fCo, tCo, fade, color, h, overview) {
    var self = this,
        cos = Math.cos,
        atan = Math.atan,
        pow2 = function pow2(x) {
      return Math.pow(x, 2);
    },
        sqrt = Math.sqrt,
        fColor = 'rgba(' + (color.fColor || self.config.lineColor.from) + ',',
        tColor = 'rgba(' + (color.tColor || self.config.lineColor.to) + ',',


    // (x1, y1) 出发点，(x2, y2) 到达点
    x1 = fCo.x,
        y1 = fCo.y,
        x2 = tCo.x,
        y2 = tCo.y,


    // 求法线方程
    // y = j * x + k
    dx = (x1 + x2) / 2,
        dy = (y1 + y2) / 2,
        j = (x1 - x2) / (y2 - y1),
        k = dy - j * dx,

    // d用来控制弧线的弧度
    d = sqrt(pow2(x1 - x2) + pow2(y1 - y2)) / h,
        rad = atan(j),
        cx = d * cos(rad),

    // 渐变
    gradient = ctx.createLinearGradient(x1, y1, x2, y2),
        bulletR = this.config.bullet.r,
        bulletLen = this.config.bullet.length,
        shootDurable = self.config.shootDurable;

    // 控制点坐标
    var x3 = (x1 + x2) / 2 + cx,
        y3 = j * x3 + k;

    if (isNaN(j)) {
      // 水平方向
      x3 = dx;
      y3 = dy + h;
    } else if (j === 0) {
      // 竖直方向
      x3 = dx + h;
      y3 = dy;
    } else if (Math.abs(j) >= 1) {
      // 之后的两个条件判断请画象限图理解。。。估计明天我也忘记为什么要这么写了
      y3 = dy - cx;
      x3 = (y3 - k) / j;
    } else if (j > 0) {
      x3 = (x1 + x2) / 2 - cx;
      y3 = j * x3 + k;
    }

    return function (t) {
      // 移动点坐标
      var x0 = void 0,
          y0 = void 0,

      // 贝塞尔曲线切线斜率
      kx = void 0,
          ky = void 0,

      // 蒙板起始坐标
      rx = void 0,
          ry = void 0,

      // 蒙板半径
      r = void 0,
          gradientOpacity = 0.7;

      if (t > 1 || t < 0) {
        return;
      }

      // TODO：最好加上一个透明度变化的动画
      if (!overview) {
        if (fade) {
          // 避免出现科学计数法，rgba中的透明值不能设为科学计数法
          gradientOpacity = 1 - t < 0.01 ? 0.01 : 1 - t;
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

      gradient.addColorStop(0, fColor + gradientOpacity + ')');
      gradient.addColorStop(1, tColor + gradientOpacity + ')');

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

      var a = atan(ky / kx);

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
  },
  drawBullet: function drawBullet(x, y, a, color, r, len) {
    var self = this,
        sCtx = self.sCtx;

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
  },
  update: function update(time) {
    if (this.tween && this.tween.update) {
      this.tween.update(time);
    }
  },
  destroy: function destroy() {
    this.clear(this.sCtx);
  }
};

exports.default = Shoot;
module.exports = exports['default'];