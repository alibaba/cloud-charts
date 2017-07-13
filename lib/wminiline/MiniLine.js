'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _base = require('../chartCommon/base');

var _base2 = _interopRequireDefault(_base);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MiniLine = (_temp = _class = function (_Base) {
  _inherits(MiniLine, _Base);

  function MiniLine(selector, options) {
    _classCallCheck(this, MiniLine);

    var _this = _possibleConstructorReturn(this, (MiniLine.__proto__ || Object.getPrototypeOf(MiniLine)).call(this, selector, options));

    var defaultOptions = {
      spline: false,
      area: false,
      interactive: false,
      max: null,
      min: null,
      padding: [8, 6, 8, 6],
      color: '#389BFF',
      areaColor: 'rgba(56,155,255,0.2)'
    };
    _this.options = (0, _merge2.default)({}, defaultOptions, _this.options);
    _this.init();
    return _this;
  }

  _createClass(MiniLine, [{
    key: 'init',
    value: function init() {
      var dom = '<div class="p2c-box"></div>';
      this.element.classList.add('p2c');
      this.element.classList.add('p2c-miniline');
      this.element.innerHTML = dom;

      //触发一次渲染
      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dom = this.element.querySelector('.p2c-box');
      var domSize = [dom.clientWidth, dom.clientHeight];

      var padding = this.options.padding;

      var data = [];
      if (this.data[0] && this.data[0].data) data = this.data[0].data; //只取第一条线
      if (data.length > 1) {
        //对data进行处理，转换成有序且画布坐标系点
        var extreme = getExtreme(data);
        var max = this.options.max || extreme.max,
            min = this.options.min || extreme.min;
        var xInterval = (domSize[0] - padding[1] - padding[3]) / (data.length - 1),
            //x轴计算每一个点等间距
        yInterval = (domSize[1] - padding[0] - padding[2]) / (max - min); //y轴计算每一份数值多少距离
        var xo = padding[3],
            yo = padding[0]; //计算基准点
        if (max === min) {
          //特殊情况:所有值都一样
          yInterval = 1; //这个值最终会乘以0，所以随便设置，只要不是NaN
          yo = (domSize[1] - padding[0] - padding[2]) / 2 + padding[0]; //基准点垂直居中
        }
        var points = [];
        data.forEach(function (item, i) {
          var vx = item[0],
              vy = item[1];
          var x = i * xInterval + xo;
          var y = (max - vy) * yInterval + yo;
          points.push([x, y]);
        });
        //console.log(points);
        //进行渲染
        if (!this.draw) {
          this.draw = new _draw2.default(dom, domSize, {
            spline: this.options.spline,
            active: this.options.interactive,
            onMouseOver: function onMouseOver(e) {
              _this2.fire('mouseover', {
                point: {
                  x: _this2.data[0].data[e.index][0],
                  y: _this2.data[0].data[e.index][1]
                },
                position: {
                  x: e.point[0],
                  y: e.point[1]
                },
                target: _this2
              });
            }
          });
        }
        this.draw.setSize(domSize); //调整大小
        if (this.options.area) this.draw.area(points, { color: this.options.color, areaColor: this.options.areaColor });else this.draw.line(points, { color: this.options.color });
      }
    }
  }]);

  return MiniLine;
}(_base2.default), _class.displayName = 'Wminiline', _temp);


function getExtreme(points) {
  var max = null,
      min = null;
  points.forEach(function (item) {
    if (max === null || max < item[1]) max = item[1];
    if (min === null || min > item[1]) min = item[1];
  });
  return { max: max, min: min };
}

exports.default = MiniLine;
// module.exports = MiniLine; //为了UMD包只能这么暴露

module.exports = exports['default'];