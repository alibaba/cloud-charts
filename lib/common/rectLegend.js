'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */


exports.default = function (chart, config, componentConfig, isOneDataGroup) {
  var _this = this;

  // 设置图例
  if (config.legend !== false) {
    var _ref = config.legend || {},
        align = _ref.align,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        showData = _ref.showData,
        customConfig = _ref.customConfig,
        _ref$allowAllCanceled = _ref.allowAllCanceled,
        allowAllCanceled = _ref$allowAllCanceled === undefined ? false : _ref$allowAllCanceled,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? {} : _ref$style;

    var legendConfig = {
      // 这些是widgets特有的属性
      autoCollapse: true,
      // 以下为g2的属性
      useHtml: true,
      title: null,
      position: 'top',
      allowAllCanceled: allowAllCanceled,
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      onHover: _common.noop,
      itemTpl: function itemTpl(value, color, checked, index) {
        var item = getRawData(config, _this.rawData, value, isOneDataGroup);

        var newName = nameFormatter ? nameFormatter(value, _extends({}, item, {
          color: color,
          checked: checked
        }), index) : value;

        if (showData) {
          var dataValue = getDataValue(item.data);
          var newValue = valueFormatter ? valueFormatter(dataValue, _extends({}, item, {
            color: color,
            checked: checked
          }), index) : dataValue;

          return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + newName + '</span><span class="g2-legend-value">' + newValue + '</span></li>';
        }

        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + newName + '</span></li>';
      },
      'g2-legend': _extends({
        top: _index.size.s3
      }, align === 'right' ? { right: 0 } : { left: 0 })
    };

    if (componentConfig) {
      // 内部的componentConfig直接使用assign浅复制，方便覆盖。
      _extends(legendConfig, componentConfig);
    }

    if (customConfig) {
      (0, _merge2.default)(legendConfig, customConfig);
    }

    if (legendConfig['g2-legend'] && _typeof(legendConfig['g2-legend']) === 'object') {
      _extends(legendConfig['g2-legend'], style);
    }

    chart.legend(legendConfig);

    if (this.afterRenderCallbacks && legendConfig.autoCollapse) {
      var legendCollapseInfo = legendCollapse.call(this, legendConfig);
      this.afterRenderCallbacks.push(legendCollapseInfo.render);

      if (this.unmountCallbacks) {
        this.unmountCallbacks.push(legendCollapseInfo.unmount);
      }
    }
  } else {
    chart.legend(false);
  }
};

var _index = require('../theme/index');

var _common = require('./common');

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getRawData(config, rawData, name, isOneDataGroup) {
  if (!rawData) {
    return {};
  }

  if (isOneDataGroup) {
    var _originData = rawData[0] || {};
    var result = {};

    _originData.data.some(function (r) {
      if (Array.isArray(r) && r[0] === name || (typeof r === 'undefined' ? 'undefined' : _typeof(r)) === 'object' && r.x === name) {
        result = r;
        return true;
      }
      return false;
    });

    if (Array.isArray(result)) {
      result = {
        data: result
      };
    }

    return result;
  }

  var originData = {};
  if (config.dataType !== 'g2') {
    rawData.some(function (r) {
      if (r.name === name) {
        originData = r;
        return true;
      }
      return false;
    });
  }

  return originData;
}

function getDataValue(data) {
  if (!Array.isArray(data)) {
    return '-';
  }

  for (var i = 0; i < data.length; i++) {
    // 单组数据时，如饼图/漏斗图，data[i] 不是数组/对象
    if (_typeof(data[i]) !== 'object' && i === 1) {
      return data[i];
    }
    if (i === data.length - 1) {
      if (Array.isArray(data[i])) {
        return data[i][1];
      }
      if (_typeof(data[i]) === 'object') {
        return data[i].y;
      }
    }
  }
}

function legendCollapse(legendConfig) {
  var _legendConfig$collaps = legendConfig.collapseRow,
      collapseRow = _legendConfig$collaps === undefined ? 2 : _legendConfig$collaps;

  var collapseInstance = null;
  return {
    render: function render(chart, config) {
      if (config.legend !== false && this.chartDom) {
        var legendWrapperDom = this.chartDom.querySelector('.g2-legend');
        var legendListDom = this.chartDom.querySelector('.g2-legend-list');
        var legendListItemDom = this.chartDom.querySelector('.g2-legend-list-item');

        if (!legendWrapperDom || !legendListDom || !legendListItemDom) {
          return;
        }

        var itemStyle = window.getComputedStyle(legendListItemDom);
        var marginTop = (0, _common.pxToNumber)(itemStyle.getPropertyValue('margin-top'));
        var marginBottom = (0, _common.pxToNumber)(itemStyle.getPropertyValue('margin-bottom'));
        var itemHeight = legendListItemDom.offsetHeight + marginTop + marginBottom;
        var wrapperHeight = legendWrapperDom.offsetHeight;

        if (wrapperHeight > itemHeight * collapseRow) {
          if (!collapseInstance) {
            collapseInstance = new Collapse(legendWrapperDom, legendListDom, {
              wrapperHeight: wrapperHeight,
              itemHeight: itemHeight,
              collapseRow: collapseRow,
              collapseTop: marginTop,
              collapseBottom: marginBottom
            });
          }

          collapseInstance.start();
        } else if (collapseInstance) {
          collapseInstance.end();
        }
      }
    },
    unmount: function unmount() {
      if (collapseInstance) {
        collapseInstance.destroy();
      }
    }
  };
}

var Collapse = function () {
  function Collapse(dom, listDom, config) {
    _classCallCheck(this, Collapse);

    this.dom = dom;
    this.listDom = listDom;
    this.moveOffset = 0;
    this.config = config;
    this.handleClick = this.handleClick.bind(this);

    var _config = this.config,
        itemHeight = _config.itemHeight,
        collapseRow = _config.collapseRow,
        wrapperHeight = _config.wrapperHeight,
        collapseTop = _config.collapseTop,
        collapseBottom = _config.collapseBottom;


    var collapseDom = this.collapseDom = document.createElement('div');
    collapseDom.className = 'widgets-legend-collapse';
    collapseDom.style.paddingTop = collapseTop + 'px';
    collapseDom.style.paddingBottom = collapseBottom + 'px';

    var collapseUpDom = this.collapseUpDom = document.createElement('div');
    collapseUpDom.className = 'legend-collapse-btn collapse-up';
    var collapseDownDom = this.collapseDownDom = document.createElement('div');
    collapseDownDom.className = 'legend-collapse-btn collapse-down';
    collapseDom.appendChild(collapseUpDom);
    collapseDom.appendChild(collapseDownDom);

    collapseDom.addEventListener('click', this.handleClick);
    collapseDom.addEventListener('mousemove', noopEvent);
    collapseDom.addEventListener('mouseout', noopEvent);

    this.minOffset = -(wrapperHeight / itemHeight) + collapseRow;
    this.maxOffset = 0;
  }

  _createClass(Collapse, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.stopPropagation();

      if (!e.target.classList.contains('legend-collapse-btn') || e.target.classList.contains('disable')) {
        return;
      }

      // const { itemHeight, collapseRow, wrapperHeight } = this.config;
      var moveOffset = this.moveOffset;

      // 上一页
      if (e.target.classList.contains('collapse-up')) {
        moveOffset += 1;
        // moveOffset = Math.min(0, moveOffset + 1);
        // this.listDom.style.transform = `translate(0, ${moveOffset * itemHeight}px)`;
      }
      // 下一页
      if (e.target.classList.contains('collapse-down')) {
        moveOffset -= 1;
        // moveOffset = Math.max(-(wrapperHeight / itemHeight) + collapseRow, moveOffset - 1);
        // this.listDom.style.transform = `translate(0, ${moveOffset * itemHeight}px)`;
      }

      this.moveOffset = moveOffset;

      this.renderState();
    }
  }, {
    key: 'renderState',
    value: function renderState() {
      var itemHeight = this.config.itemHeight;


      this.collapseUpDom.classList.remove('disable');
      this.collapseDownDom.classList.remove('disable');

      // 不能向下
      if (this.moveOffset <= this.minOffset) {
        this.moveOffset = this.minOffset;
        this.collapseDownDom.classList.add('disable');
      }

      // 不能向上
      if (this.moveOffset >= this.maxOffset) {
        this.moveOffset = this.maxOffset;
        this.collapseUpDom.classList.add('disable');
      }

      this.listDom.style.transform = 'translate(0, ' + this.moveOffset * itemHeight + 'px)';
    }
  }, {
    key: 'start',
    value: function start() {
      var _config2 = this.config,
          itemHeight = _config2.itemHeight,
          collapseRow = _config2.collapseRow;


      this.dom.classList.add('has-collapse');

      // 展示时重新获取高度
      // 修复因样式变化导致滚动范围改变所引起的问题。
      this.config.wrapperHeight = this.dom.offsetHeight;
      this.minOffset = -(this.config.wrapperHeight / itemHeight) + collapseRow;

      this.dom.style.maxHeight = itemHeight * collapseRow + 'px';
      this.dom.appendChild(this.collapseDom);

      this.renderState();
    }
  }, {
    key: 'end',
    value: function end() {
      this.dom.classList.remove('has-collapse');
      this.dom.style.maxHeight = '';
      this.dom.removeChild(this.collapseDom);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.end();

      this.collapseDom.removeEventListener('click', this.handleClick);
      this.collapseDom.removeEventListener('mousemove', noopEvent);
      this.collapseDom.removeEventListener('mouseout', noopEvent);
    }
  }]);

  return Collapse;
}();

function noopEvent(e) {
  e.stopPropagation();
}
module.exports = exports['default'];