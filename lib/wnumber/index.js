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
import chartLog from "../common/log";
import './index.scss';

var prefix = 'aisc-wnumber';

function getTrendIcon(trend) {
  if (trend === 'raise') {
    return React.createElement(Warrow, { type: 'up' });
  } else if (trend === 'drop') {
    return React.createElement(Warrow, { type: 'down' });
  }
}

var Wnumber = (_temp = _class = function (_React$Component) {
  _inherits(Wnumber, _React$Component);

  function Wnumber(props) {
    _classCallCheck(this, Wnumber);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    chartLog('Wnumber', 'init');
    return _this;
  }

  Wnumber.prototype.renderBottom = function renderBottom(bottomTitle) {
    if (!!bottomTitle) {
      return React.createElement(
        'div',
        { className: prefix + '-bottomTitle' },
        bottomTitle
      );
    }
  };

  Wnumber.prototype.renderMain = function renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, trend, children) {
    var numberTrendIcon = getTrendIcon(numberTrend);
    var numberClasses = prefix + '-number';

    var rightRatioTrendIcon = getTrendIcon(rightRatioTrend);
    var rightRatioTrendClasses = prefix + '-rightRatio ' + rightRatioTrend;

    return React.createElement(
      'div',
      { className: prefix + '-main ' + numberTrend + ' ' + status },
      numberTrend && React.createElement(
        'span',
        { className: prefix + '-leftIcon' },
        numberTrendIcon
      ),
      React.createElement(
        'span',
        { className: numberClasses },
        children
      ),
      unit && React.createElement(
        'span',
        { className: prefix + '-unit' },
        unit
      ),
      rightTitle && React.createElement(
        'span',
        { className: prefix + '-rightTitle' },
        rightTitle
      ),
      rightRatio && React.createElement(
        'span',
        { className: rightRatioTrendClasses },
        rightRatioTrend && React.createElement(
          'span',
          { className: prefix + '-rightRatioIcon' },
          rightRatioTrendIcon
        ),
        rightRatio
      ),
      trend && React.createElement(
        'span',
        { className: prefix + '-trend' },
        trend()
      )
    );
  };

  Wnumber.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        className = _props.className,
        style = _props.style,
        status = _props.status,
        unit = _props.unit,
        numberTrend = _props.numberTrend,
        rightRatioTrend = _props.rightRatioTrend,
        rightTitle = _props.rightTitle,
        rightRatio = _props.rightRatio,
        trend = _props.trend,
        children = _props.children,
        bottomTitle = _props.bottomTitle,
        otherProps = _objectWithoutProperties(_props, ['className', 'style', 'status', 'unit', 'numberTrend', 'rightRatioTrend', 'rightTitle', 'rightRatio', 'trend', 'children', 'bottomTitle']);

    var mainClasses = classNames((_classNames = {
      'aisc-widgets': true
    }, _classNames['' + prefix] = true, _classNames[className] = !!className, _classNames));

    return React.createElement(
      'div',
      _extends({ className: mainClasses, style: style }, otherProps),
      this.renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, trend, children),
      this.renderBottom(bottomTitle)
    );
  };

  return Wnumber;
}(React.Component), _class.displayName = 'Wnumber', _class.defaultProps = {
  numberTrend: '',
  rightRatioTrend: '',
  status: ''
}, _temp);
Wnumber.displayName = 'Wnumber';
export { Wnumber as default };


Wnumber.propTypes = {
  bottomTitle: PropTypes.node,
  unit: PropTypes.node,
  trend: PropTypes.func
};