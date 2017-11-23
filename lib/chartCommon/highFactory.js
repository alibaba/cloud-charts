'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const ChartsMap = {
//   'line': Line,
//   'bar': Bar,
//   'pie': Pie,
//   'miniLine': MiniLine
// };

var events = ['MouseOver', 'Selection', 'Click'];

var requestAnimationFrame = window && window.requestAnimationFrame || function () {};

/*
* highFactory 函数
*
* 将非React版的图表类转化为React版
* */
function highFactory(name, Chart) {
  var _class, _temp;

  var AiscChart = (_temp = _class = function (_React$Component) {
    _inherits(AiscChart, _React$Component);

    function AiscChart() {
      _classCallCheck(this, AiscChart);

      return _possibleConstructorReturn(this, (AiscChart.__proto__ || Object.getPrototypeOf(AiscChart)).apply(this, arguments));
    }

    _createClass(AiscChart, [{
      key: 'componentWillMount',
      value: function componentWillMount() {}
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.setSize();

        // this.chart = new ChartsMap[this.props.type](
        this.chart = new Chart(this.refs.chart, this.props.config || {});
        this.chart.setData(this.props.data);

        //触发事件以属性设置方式传入触发
        if (this.props.action) {
          for (var i in this.props.action) {
            this.chart.fire(i, this.props.action[i]);
          }
        }

        //监听事件
        events.forEach(function (ev) {
          _this2.chart.on(ev.toLocaleLowerCase(), function (e) {
            e = e || {}, e.target = _this2.chart;
            _this2.props['on' + ev] && _this2.props['on' + ev](e);
          });
        });

        //自适应大小
        this._size = this.getSize();
        var autoResize = function autoResize() {
          if (_this2.refs.chart) {
            //如果组件已经销毁，则不再执行
            var size = _this2.getSize();
            if (!(size[0] === _this2._size[0] && size[1] === _this2._size[1])) {
              _this2.setSize();
              _this2.chart.render();
              _this2._size = _this2.getSize();
            }
            requestAnimationFrame(autoResize.bind(_this2));
          }
        };
        requestAnimationFrame(autoResize.bind(this));
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {}
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var newData = nextProps.data,
            newWidth = nextProps.width,
            newHeight = nextProps.height,
            newConfig = nextProps.config,
            newOriginalOptions = nextProps.originalOptions;
        var _props = this.props,
            oldData = _props.data,
            oldWidth = _props.width,
            oldHeight = _props.height,
            oldConfig = _props.config,
            oldOriginalOptions = _props.originalOptions;


        if (newData !== oldData || newData.length !== oldData.length || newData.data && oldData.data && newData.data !== oldData.data) {
          this.chart.setData(newData);
        }
        if (newConfig !== oldConfig) {
          this.chart.setOption(newConfig);
        }
        if (newOriginalOptions !== oldOriginalOptions) {
          this.chart.chart && this.chart.chart.update(newOriginalOptions);
        }
        if (newWidth !== oldWidth || newHeight !== oldHeight) {
          this.setSize(newWidth, newHeight);
        }
        //action判断
        for (var i in nextProps.action) {
          if (this.props.action[i] !== nextProps.action[i]) {
            var e = nextProps.action[i];
            if (e.target !== this.chart) {
              this.chart.fire(i, e);
            }
          }
        }
        return false;
      }
    }, {
      key: 'componentWillUpdate',
      value: function componentWillUpdate(nextProps) {}
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.chart.destroy && this.chart.destroy();
      }
    }, {
      key: 'getChart',
      value: function getChart() {
        return this.chart;
      }
    }, {
      key: 'setSize',
      value: function setSize(width, height) {
        var propsWidth = width || this.props.width;
        var propsHeight = height || this.props.height;
        var w = void 0,
            h = void 0;
        var node = this.refs.chart;
        //设置宽度
        if (propsWidth) {
          w = propsWidth + 'px';
        } else {
          if (node.parentNode) w = node.parentNode.clientWidth + 'px';else w = '';
        }
        this.refs.chart.style.width = w;
        //设置高度
        if (propsHeight) {
          h = propsHeight + 'px';
        } else {
          if (node.parentNode) h = node.parentNode.clientHeight + 'px';else h = '';
        }
        this.refs.chart.style.height = h;
      }
    }, {
      key: 'getSize',
      value: function getSize() {
        var node = this.refs.chart,
            w = node.offsetWidth,
            h = node.offsetHeight;
        //如果是自动获取宽高的情况，则监听父级宽高
        if (!this.props.width && node.parentNode) w = node.parentNode.clientWidth;
        if (!this.props.height && node.parentNode) h = node.parentNode.clientHeight;
        return [w, h];
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement('div', { ref: 'chart' });
      }
    }]);

    return AiscChart;
  }(_react2.default.Component), _class.propTypes = {
    // type: PropTypes.oneOf(Object.keys(ChartsMap)).isRequired,
    config: _propTypes2.default.object,
    data: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,
    originalOptions: _propTypes2.default.object
  }, _class.displayName = 'AiscWidgets' + name, _temp);

  //暴露原版类

  AiscChart.displayName = 'AiscChart';
  AiscChart.Chart = Chart;

  return AiscChart;
}

exports.default = highFactory;
module.exports = exports['default'];