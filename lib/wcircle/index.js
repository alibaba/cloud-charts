'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Warrow from '../common/arrow';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import './index.scss';

var prefix = 'aisc-wcircle';

var Wcircle = (_temp = _class = function (_React$Component) {
  _inherits(Wcircle, _React$Component);

  function Wcircle(props) {
    _classCallCheck(this, Wcircle);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    chartLog('Wcircle', 'init');
    return _this;
  }

  Wcircle.prototype.renderBottom = function renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend) {
    var numberTrendIcon = void 0;
    var numberClasses = prefix + '-bottom-number';
    if (bottomTrend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = React.createElement(Warrow, { type: 'up' });
    } else if (bottomTrend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = React.createElement(Warrow, { type: 'down' });
    }

    if (!!bottomTitle || !!bottomUnit || !!bottomNumber || !!bottomTrend) {
      return React.createElement(
        'div',
        { className: prefix + '-bottom-block' },
        bottomTrend && React.createElement(
          'span',
          { className: prefix + '-leftIcon' },
          numberTrendIcon
        ),
        React.createElement(
          'span',
          { className: numberClasses },
          bottomNumber,
          bottomUnit && React.createElement(
            'span',
            { className: prefix + '-bottom-unit' },
            bottomUnit
          )
        ),
        React.createElement(
          'p',
          { className: prefix + '-title' },
          bottomTitle
        )
      );
    }
  };

  Wcircle.prototype.renderMain = function renderMain(_ref) {
    var title = _ref.title,
        unit = _ref.unit,
        children = _ref.children,
        trend = _ref.trend,
        type = _ref.type,
        percent = _ref.percent,
        radius = _ref.radius,
        strokeWidth = _ref.strokeWidth,
        status = _ref.status,
        customColor = _ref.color,
        backgroundColor = _ref.backgroundColor,
        bottomTitle = _ref.bottomTitle,
        bottomUnit = _ref.bottomUnit,
        bottomNumber = _ref.bottomNumber,
        bottomTrend = _ref.bottomTrend,
        linecap = _ref.linecap;

    var numberTrendIcon = void 0;
    var numberClasses = prefix + '-number';

    var style = {};
    if (customColor) {
      style.color = customColor;
    }

    if (trend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = React.createElement(Warrow, { type: 'up' });
    } else if (trend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = React.createElement(Warrow, { type: 'down' });
    }

    var radiusInner = radius - strokeWidth / 2;
    var pathString = 'M ' + radius + ',' + radius + ' m 0,' + radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,-' + 2 * radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,' + 2 * radiusInner;
    var circleLengh = Math.PI * 2 * radiusInner;

    var openWidth = void 0,
        pathDashoffset = void 0,
        strokeDashoffset = void 0,
        strokePathStyle = void 0;
    if (type === 'circle') {
      openWidth = 0;
      pathDashoffset = '0px';
      strokeDashoffset = '-' + circleLengh / 2 + 'px';
      strokePathStyle = {
        strokeDasharray: percent * (circleLengh - openWidth) + 'px ' + (1 - percent) * (circleLengh - openWidth) + 'px',
        strokeDashoffset: strokeDashoffset
      };
    } else if (type === 'gauge') {
      openWidth = Math.PI * 0.45 * radiusInner;
      pathDashoffset = '-' + openWidth / 2 + 'px';
      strokeDashoffset = '-' + openWidth / 2 + 'px';
      strokePathStyle = {
        strokeDasharray: percent * (circleLengh - openWidth) + 'px ' + circleLengh + 'px',
        strokeDashoffset: strokeDashoffset
      };
    }

    var pathStyle = {
      strokeDasharray: circleLengh - openWidth + 'px ' + circleLengh + 'px',
      strokeDashoffset: pathDashoffset
    };

    if (backgroundColor) {
      pathStyle.stroke = backgroundColor;
    }

    var svgStyle = {
      height: radius * 2,
      width: radius * 2
    };

    return React.createElement(
      'div',
      { className: prefix + '-main ' + getStatusColorName(status), style: style },
      React.createElement(
        'div',
        { className: prefix + '-ratio' },
        React.createElement(
          'div',
          { className: prefix + '-ratio-svg', style: svgStyle },
          React.createElement(
            'svg',
            { width: '100%', height: '100%', xmlns: 'http://www.w3.org/2000/svg', version: '1.1', className: linecap },
            React.createElement('path', {
              className: prefix + '-svg-bg',
              d: pathString,
              strokeWidth: strokeWidth,
              style: pathStyle
            }),
            React.createElement('path', {
              className: prefix + '-svg-ring',
              d: pathString,
              strokeWidth: strokeWidth,
              style: strokePathStyle
            })
          )
        ),
        React.createElement(
          'div',
          { className: prefix + '-number-block' },
          React.createElement(
            'div',
            { className: prefix + '-number-middle' },
            trend && React.createElement(
              'span',
              { className: prefix + '-leftIcon' },
              numberTrendIcon
            ),
            React.createElement(
              'span',
              { className: numberClasses },
              children,
              unit && React.createElement(
                'span',
                { className: prefix + '-unit' },
                unit
              )
            ),
            title && React.createElement(
              'p',
              { className: prefix + '-title' },
              title
            )
          )
        ),
        type === 'gauge' && this.renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend)
      )
    );
  };

  Wcircle.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        className = _props.className,
        style = _props.style,
        trend = _props.trend,
        type = _props.type,
        percent = _props.percent,
        title = _props.title,
        unit = _props.unit,
        children = _props.children,
        radius = _props.radius,
        strokeWidth = _props.strokeWidth,
        status = _props.status,
        color = _props.color,
        backgroundColor = _props.backgroundColor,
        linecap = _props.linecap,
        bottomTitle = _props.bottomTitle,
        bottomUnit = _props.bottomUnit,
        bottomNumber = _props.bottomNumber,
        bottomTrend = _props.bottomTrend,
        otherProps = _objectWithoutProperties(_props, ['className', 'style', 'trend', 'type', 'percent', 'title', 'unit', 'children', 'radius', 'strokeWidth', 'status', 'color', 'backgroundColor', 'linecap', 'bottomTitle', 'bottomUnit', 'bottomNumber', 'bottomTrend']);

    var mainClasses = classNames((_classNames = {
      'aisc-widgets': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));

    return React.createElement(
      'div',
      _extends({ className: mainClasses, style: style }, otherProps),
      this.renderMain({
        title: title,
        unit: unit,
        children: children,
        trend: trend,
        percent: percent,
        type: type,
        radius: radius,
        strokeWidth: strokeWidth,
        status: status,
        color: color,
        backgroundColor: backgroundColor,
        linecap: linecap,
        bottomTitle: bottomTitle,
        bottomUnit: bottomUnit,
        bottomNumber: bottomNumber,
        bottomTrend: bottomTrend
      })
    );
  };

  return Wcircle;
}(React.Component), _class.displayName = 'Wcircle', _class.defaultProps = {
  type: 'circle',
  title: '',
  percent: 0,
  unit: '',
  status: 'normal',
  radius: 70,
  strokeWidth: 6,
  linecap: 'round'
}, _temp);
Wcircle.displayName = 'Wcircle';
export { Wcircle as default };


Wcircle.propTypes = {
  type: PropTypes.oneOf(['gauge', 'circle']),
  title: PropTypes.node,
  percent: function percent(props, propName) {
    if (!(props[propName] >= 0 && props[propName] <= 1)) {
      return new Error('percent Validation failed!');
    }
  },
  unit: PropTypes.node,
  status: PropTypes.oneOf(['normal', 'warning', 'error', 'blue', 'orange', 'red']),
  // 半径
  radius: function radius(props, propName) {
    if (!(props[propName] >= 10 && props[propName] <= 100)) {
      return new Error('radius Validation failed!');
    }
  },
  // 粗细
  strokeWidth: function strokeWidth(props, propName) {
    if (!(props[propName] >= 2 && props[propName] <= 10)) {
      return new Error('strokeWidth Validation failed!');
    }
  },
  // 趋势
  trend: PropTypes.oneOf(['raise', 'drop']),
  bottomTitle: PropTypes.node,
  bottomUnit: PropTypes.node,
  bottomNumber: PropTypes.node,
  bottomTrend: PropTypes.oneOf(['raise', 'drop'])
};