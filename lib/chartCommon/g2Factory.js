'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('../chartCommon/colors');

var _colors2 = _interopRequireDefault(_colors);

var _g = require('g2');

var _g2 = _interopRequireDefault(_g);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//全局G2主题设置
var theme = _g2.default.Util.mix(true, {}, _g2.default.Theme, {
  // animate: false,
  colors: {
    'default': _colors2.default
  },
  shape: {
    line: {
      lineWidth: 2
    }
    // 具体的配置项详见 https://antv.alipay.com/g2/api/global.html
  } });
//设置屏幕dpi缩放（如果有效的话）
if (window && window.devicePixelRatio) {
  theme.pixelRatio = window.devicePixelRatio;
}
_g2.default.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// 图表唯一id
var uniqueId = 0;
function generateUniqueId() {
  return 'react-g2-' + uniqueId++;
}

var events = ['MouseOver', 'Selection', 'Click'];

var requestAnimationFrame = window && window.requestAnimationFrame || function () {};

/*
* g2Factory 函数
*
* 将非React版的图表类转化为React版
*
* convertData 控制是否转化数据
* */
function g2Factory(name, Chart) {
  var _class, _temp;

  var convertData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var ChartProcess = Chart;
  var AiscChart = (_temp = _class = function (_React$Component) {
    _inherits(AiscChart, _React$Component);

    function AiscChart(props, context) {
      _classCallCheck(this, AiscChart);

      var _this = _possibleConstructorReturn(this, (AiscChart.__proto__ || Object.getPrototypeOf(AiscChart)).call(this, props, context));

      _this.chart = null;
      _this.chartId = generateUniqueId();
      return _this;
    }

    // componentWillMount () {}

    _createClass(AiscChart, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.customChart) {
          ChartProcess = _extends({}, ChartProcess, this.props.customChart);
        }

        // this.setSize();
        var props = ChartProcess.beforeInit ? ChartProcess.beforeInit(this.props) : this.props;

        var width = props.width,
            _props$height = props.height,
            height = _props$height === undefined ? 400 : _props$height,
            initData = props.data,
            plotCfg = props.plotCfg,
            forceFit = props.forceFit,
            config = props.config,
            otherProps = _objectWithoutProperties(props, ['width', 'height', 'data', 'plotCfg', 'forceFit', 'config']);

        var chart = new _g2.default.Chart(_extends({
          id: this.chartId,
          width: width,
          height: height,
          plotCfg: plotCfg,
          forceFit: width === undefined || forceFit
        }, otherProps));
        var data = convertData ? config.dataType === 'g2' ? initData : highchartsDataToG2Data(initData) : initData;
        ChartProcess.init(chart, config, data);
        // this.chart.setData(this.props.data);

        //绑定事件
        var events = ['plotmove', 'plotenter', 'plotleave', 'plotclick', 'plotdblclick', 'rangeselectstart', 'rangeselectend', 'itemselected', 'itemunselected', 'itemselectedchange', 'tooltipchange', 'tooltipshow', 'tooltiphide'];

        Object.keys(config).forEach(function (item) {
          events.includes(item) && chart.on(item, config[item]);
        });

        this.chart = chart;

        // //触发事件以属性设置方式传入触发
        // if(this.props.action){
        //   for(let i in this.props.action){
        //     this.chart.fire(i,this.props.action[i]);
        //   }
        // }
        //
        // //监听事件
        // events.forEach((ev)=>{
        //   this.chart.on(ev.toLocaleLowerCase(), (e)=>{
        //     e = e || {}, e.target = this.chart;
        //     this.props['on' + ev] && this.props['on' + ev](e);
        //   });
        // });

        //自适应大小
        // this._size = this.getSize();
        // let autoResize = ()=>{
        //   if(this.refs.chart){//如果组件已经销毁，则不再执行
        //     let size = this.getSize();
        //     if(!(size[0] === this._size[0] && size[1] === this._size[1])){
        //       this.setSize();
        //       this.chart.render();
        //       this._size = this.getSize();
        //     }
        //     requestAnimationFrame(autoResize.bind(this));
        //   }
        // };
        // requestAnimationFrame(autoResize.bind(this));
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var newData = nextProps.data,
            newWidth = nextProps.width,
            newHeight = nextProps.height,
            newPlotCfg = nextProps.plotCfg,
            newConfig = nextProps.config;
        var _props = this.props,
            oldData = _props.data,
            oldWidth = _props.width,
            oldHeight = _props.height,
            oldPlotCfg = _props.plotCfg;


        if (newPlotCfg !== oldPlotCfg) {
          console.warn('plotCfg 不支持修改');
        }

        if (newData !== oldData || newData.length !== oldData.length) {
          var data = convertData ? newConfig.dataType === 'g2' ? newData : highchartsDataToG2Data(newData) : newData;
          if (ChartProcess.changeData) {
            ChartProcess.changeData(this.chart, newConfig, data);
          } else {
            this.chart.changeData(data);
          }
        }
        if (newWidth !== oldWidth || newHeight !== oldHeight) {
          if (ChartProcess.changeSize) {
            ChartProcess.changeSize(this.chart, newConfig, newWidth, newHeight);
          } else {
            this.chart.changeSize(newWidth, newHeight);
          }
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        // if(this.props.data !== nextProps.data){
        //   this.chart.setData(nextProps.data);
        // }
        // if(this.props.config !== nextProps.config){
        //   this.chart.setOption(nextProps.config);
        // }
        // if(this.props.orignalOptions !== nextProps.orignalOptions){
        //   this.chart.chart && this.chart.chart.update(orignalOptions);
        // }
        // if(this.props.width !== nextProps.width || this.props.height !== nextProps.height){
        //   this.setSize();
        // }
        // //action判断
        // for(let i in nextProps.action){
        //   if(this.props.action[i] !== nextProps.action[i]){
        //     let e = nextProps.action[i];
        //     if(e.target !== this.chart){
        //       this.chart.fire(i,e);
        //     }
        //   }
        // }
        return false;
      }

      // componentWillUpdate (nextProps) {}

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.chart.destroy && this.chart.destroy();
        this.chart = null;
        this.chartId = null;
      }

      // getChart() {
      //   return this.chart;
      // }

      // setSize() {
      //   let w = '', h = '';
      //   let node = this.refs.chart;
      //   //设置宽度
      //   if (this.props.width) {
      //     w = this.props.width + 'px';
      //   } else if(node.parentNode) {
      //      w = node.parentNode.clientWidth + 'px';
      //   }
      //   this.refs.chart.style.width = w;
      //   //设置高度
      //   if(this.props.height){
      //     h = this.props.height + 'px';
      //   }else{
      //     if(node.parentNode) h = node.parentNode.clientHeight + 'px';
      //     else h = '';
      //   }
      //   this.refs.chart.style.height = h;
      // }
      //
      // getSize() {
      //   let node = this.refs.chart,
      //     w = node.offsetWidth,
      //     h = node.offsetHeight;
      //   //如果是自动获取宽高的情况，则监听父级宽高
      //   if(!this.props.width && node.parentNode) w = node.parentNode.clientWidth;
      //   if(!this.props.height && node.parentNode) h = node.parentNode.clientHeight;
      //   return [w, h];
      // }

    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement('div', { ref: 'chart', id: this.chartId });
      }
    }]);

    return AiscChart;
  }(_react2.default.Component), _class.propTypes = {
    width: _propTypes2.default.number,
    height: _propTypes2.default.number,
    config: _propTypes2.default.object,
    data: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object), _propTypes2.default.object]).isRequired,
    plotCfg: _propTypes2.default.object,
    forceFit: _propTypes2.default.bool
  }, _class.defaultProps = {
    forceFit: false,
    plotCfg: {},
    config: {}
  }, _class.displayName = 'AiscWidgets' + name, _temp);

  //暴露原版类

  AiscChart.displayName = 'AiscChart';
  AiscChart.Chart = Chart;

  return AiscChart;
}

function highchartsDataToG2Data(data) {
  var newData = [];
  data.forEach(function (oneData) {
    var dataName = oneData.name;
    oneData.data.forEach(function (d) {
      var _d = _slicedToArray(d, 2),
          name = _d[0],
          value = _d[1];

      newData.push({
        name: name,
        value: value,
        type: dataName
      });
    });
  });
  return newData;

  // const newData = (() => {
  //   const timeMap = {};
  //   data.forEach((oneData) => {
  //     const dataName = oneData.name;
  //     oneData.data.forEach((d) => {
  //       const [time, value] = d;
  //       if (timeMap[time]) {
  //         timeMap[time][dataName] = value;
  //       } else {
  //         timeMap[time] = {
  //           [dataName]: value
  //         };
  //       }
  //     });
  //   });
  //
  //   return Object.keys(timeMap).map((time) => {
  //     timeMap[time].time = Number(time);
  //     return timeMap[time];
  //   });
  // })();
  //
  // let frame = new G2.Frame(newData);
  // frame = G2.Frame.combineColumns(frame, configs.keys, 'value', 'type', ['time']);
  //
  // return frame;
}

exports.default = g2Factory;
module.exports = exports['default'];