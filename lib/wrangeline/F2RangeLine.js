var _class, _temp, _initialiseProps;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import React from 'react';
import { setDomStyle, generateUniqueId } from '../common/f2Utils';
import Line from '../Wline/F2Line';
import { color } from '../themes/';

var bChartOptions = {
  padding: [0, 0, 0, 0],
  legend: { show: false },
  xAxis: { show: false },
  yAxis: { show: false },
  tooltip: { show: false },
  showPointFirst: false
};

var $S = {
  bContainer: {
    margin: 12,
    border: '1px solid ' + color.widgetsColorBlue,
    position: 'relative'
  },
  bMark: {
    height: '100%',
    position: 'absolute',
    top: 0,
    border: '1px solid ' + color.widgetsColorBlue,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    boxSizing: 'border-box',
    zIndex: 1
  },
  bTran: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: '50%',
    borderWidth: 7,
    borderColor: 'transparent',
    borderBottomColor: color.widgetsColorBlue,
    borderStyle: 'solid',
    marginTop: -14,
    marginLeft: -7
  },
  transMark1: {
    position: 'absolute',
    left: 0,
    top: -1,
    height: '100%',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 1
  },
  transMark2: {
    position: 'absolute',
    right: 0,
    top: -1,
    height: '100%',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 1
  }
};
var RangeLine = (_temp = _class = function (_React$PureComponent) {
  _inherits(RangeLine, _React$PureComponent);

  function RangeLine(props) {
    _classCallCheck(this, RangeLine);

    var _this = _possibleConstructorReturn(this, _React$PureComponent.call(this, props));

    _initialiseProps.call(_this);

    var _this$props = _this.props,
        data = _this$props.data,
        config = _this$props.config;
    var rangeStart = config.rangeStart;


    if (!rangeStart && data && data[0]) {
      rangeStart = data[0].data[0][0];
    }

    _this.id = generateUniqueId('rangeline');
    _this.bMarkX = 0;
    _this.bMarkLeft = 0;
    _this.bMarkEndX = 0;

    var rangeStartIndex = _this.getGetRangeStartIndex(rangeStart);

    _this.state = {
      rangeStartIndex: rangeStartIndex
    };
    return _this;
  }

  RangeLine.prototype.componentDidMount = function componentDidMount() {
    // 计算底部的mark宽度
    this.calculateBMarkSize();
    // 绑定底部容器的点击事件
    this.bindBContainerEvt();
    // 绑定底部容器区块的点击事件
    this.bindBMarkEvt();
  };

  RangeLine.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        data = _props.data,
        config = _props.config;
    var rangeStartIndex = this.state.rangeStartIndex;
    var rangeLength = config.rangeLength;


    var topChartData = [{
      name: data[0].name,
      data: data[0].data.slice(rangeStartIndex, rangeStartIndex + rangeLength)
    }];

    return React.createElement(
      'div',
      { id: this.id },
      React.createElement(Line, { data: topChartData }),
      React.createElement(
        'div',
        {
          style: $S.bContainer,
          className: this.id + '-bContainer',
          ref: function ref(o) {
            _this2.bContainer = o;
          }
        },
        React.createElement('div', { style: $S.transMark1, id: this.id + '-trans1' }),
        React.createElement(
          'div',
          { style: $S.bMark, className: this.id + '-bMark' },
          React.createElement('div', { style: $S.bTran })
        ),
        React.createElement('div', { style: $S.transMark2, id: this.id + '-trans2' }),
        React.createElement(Line, { data: data, config: bChartOptions, height: 30 })
      )
    );
  };

  return RangeLine;
}(React.PureComponent), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getGetRangeStartIndex = function (rangeStart) {
    var data = _this3.props.data;

    var findIndex = void 0;
    data[0].data.forEach(function (item, index) {
      if (item[0] === rangeStart) {
        findIndex = index;
      }
    });
    if (!findIndex) {
      return 0;
    } else {
      return findIndex;
    }
  };

  this.calculateBMarkSize = function () {
    var container = document.querySelector('#' + _this3.id);
    var _props2 = _this3.props,
        data = _props2.data,
        config = _props2.config;
    var rangeLength = config.rangeLength;

    var dataLength = data[0].data.length;
    var bContainer = container.querySelector('.' + _this3.id + '-bContainer');
    var bMark = container.querySelector('.' + _this3.id + '-bMark');
    var bContainerWidth = bContainer.getClientRects()[0].width;
    var bMarkWidth = bContainerWidth * rangeLength / dataLength;
    _this3.dataLength = dataLength;
    _this3.bContainer = bContainer;
    _this3.bContainerWidth = bContainerWidth;
    _this3.bContainerLeft = bContainer.getClientRects()[0].left;
    _this3.bMark = bMark;
    _this3.bMarkWidth = bMarkWidth;
    setDomStyle(bMark, {
      width: bMarkWidth + 'px'
    });
    _this3.setBMarkPos(0);
  };

  this.setBMarkPos = function (x) {
    if (x < 0) {
      x = 0;
    }
    // 设置mark元素的位置
    setDomStyle(_this3.bMark, {
      left: x + 'px'
    });
    // 同时设置两边的半透明区域的位置
    var transMark1 = document.querySelector('#' + _this3.id + '-trans1');
    var transMark2 = document.querySelector('#' + _this3.id + '-trans2');
    setDomStyle(transMark1, {
      width: x + 'px'
    });
    var bMark2Width = _this3.bContainerWidth - (x + _this3.bMarkWidth);

    setDomStyle(transMark2, {
      width: (bMark2Width > 1 ? bMark2Width - 1 : bMark2Width) + 'px'
    });
  };

  this.bindBContainerEvt = function () {
    var container = document.querySelector('#' + _this3.id);
    var bContainer = container.querySelector('.' + _this3.id + '-bContainer');

    bContainer.addEventListener('touchstart', function (e) {
      e.stopPropagation();
      var x = e.touches[0].clientX;
      if (x < 0) {
        x = 0;
      } else if (x + _this3.bMarkWidth > _this3.bContainerWidth) {
        x = _this3.bContainerWidth - _this3.bMarkWidth / 2;
      }
      _this3.setBMarkPos(x - _this3.bMarkWidth / 2);
      var rangeStartIndex = Math.round(x / _this3.bContainerWidth * _this3.dataLength);
      _this3.setState({
        rangeStartIndex: rangeStartIndex
      });
    });
  };

  this.bindBMarkEvt = function () {
    _this3.bMark.addEventListener('touchstart', function (e) {
      e.stopPropagation();
      _this3.bMarkX = e.touches[0].clientX;
      _this3.bMarkLeft = _this3.bMark.getClientRects()[0].left;
    });
    _this3.bMark.addEventListener('touchmove', function (e) {
      var touchX = e.touches[0].clientX;
      var dist = touchX - _this3.bMarkX;
      _this3.bMarkEndX = _this3.bMarkLeft + dist;

      if (_this3.bMarkEndX + _this3.bMarkWidth > _this3.bContainerWidth) {
        _this3.bMarkEndX = _this3.bContainerWidth - _this3.bMarkWidth;
      } else if (_this3.bMarkEndX <= 0) {
        _this3.bMarkEndX = 0;
      }

      _this3.setBMarkPos(_this3.bMarkEndX);
    });
    _this3.bMark.addEventListener('touchend', function () {
      var rangeStartIndex = Math.round(_this3.bMarkEndX / _this3.bContainerWidth * _this3.dataLength);
      _this3.setState({
        rangeStartIndex: rangeStartIndex
      });
    });
  };
}, _temp);
export { RangeLine as default };