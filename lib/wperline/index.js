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
import chartLog from "../common/log";
import './index.scss';

var prefix = 'aisc-wperline';

var Wperline = (_temp = _class = function (_React$Component) {
  _inherits(Wperline, _React$Component);

  function Wperline(props) {
    _classCallCheck(this, Wperline);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    chartLog('Wperline', 'init');
    return _this;
  }

  Wperline.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        style = _props.style,
        percent = _props.percent,
        status = _props.status,
        others = _objectWithoutProperties(_props, ['className', 'style', 'percent', 'status']);

    var barStyle = { width: percent + '%' };
    var textStyle = {};

    if (percent < 15) {
      textStyle.marginRight = 0;
      textStyle.marginLeft = '100%';
      textStyle.paddingLeft = 7;
    }

    var cls = classNames(prefix, prefix + '-status-' + status, className);

    return React.createElement(
      'div',
      _extends({ className: cls, style: style }, others),
      React.createElement(
        'div',
        { className: prefix + '-num', style: barStyle },
        React.createElement(
          'span',
          { style: textStyle },
          percent,
          '%'
        )
      )
    );
  };

  return Wperline;
}(React.Component), _class.displayName = 'Wperline', _class.defaultProps = {
  percent: 0,
  status: ''
}, _temp);
Wperline.displayName = 'Wperline';
export { Wperline as default };


Wperline.propTypes = {
  percent: PropTypes.number,
  status: PropTypes.string
};