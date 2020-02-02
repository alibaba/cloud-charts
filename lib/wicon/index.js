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
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import './index.scss';

var prefix = 'aisc-wicon';

var Wicon = (_temp = _class = function (_React$Component) {
  _inherits(Wicon, _React$Component);

  function Wicon(props) {
    _classCallCheck(this, Wicon);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    chartLog('Wicon', 'init');
    return _this;
  }

  Wicon.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        type = _props.type,
        size = _props.size,
        className = _props.className,
        status = _props.status,
        reverse = _props.reverse,
        other = _objectWithoutProperties(_props, ['type', 'size', 'className', 'status', 'reverse']);

    var classes = classNames((_classNames = {
      'aisc-widgets': true
    }, _classNames[prefix + '-' + type] = !!type, _classNames['' + prefix] = true, _classNames[prefix + '-' + size] = !!size, _classNames[prefix + '-' + getStatusColorName(status)] = !!status, _classNames[prefix + '-reverse'] = !!reverse, _classNames[className] = !!className, _classNames));

    return React.createElement('i', _extends({ className: classes }, other));
  };

  return Wicon;
}(React.Component), _class.displayName = 'Wicon', _class.defaultProps = {
  size: 'big',
  type: 'monitor',
  status: 'none'
}, _temp);
Wicon.displayName = 'Wicon';
export { Wicon as default };


Wicon.propTypes = {
  type: PropTypes.string
};