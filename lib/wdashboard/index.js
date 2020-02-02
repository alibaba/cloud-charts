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
import Dashboard from './dashboard';
import './index.scss';
import chartLog from "../common/log";

var prefix = 'aisc-wdashboard';

var Wdashboard = (_temp = _class = function (_React$Component) {
  _inherits(Wdashboard, _React$Component);

  function Wdashboard(props) {
    _classCallCheck(this, Wdashboard);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    chartLog('Wdashboard', 'init');
    return _this;
  }

  Wdashboard.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        data = _props.data,
        options = _objectWithoutProperties(_props, ['data']);

    if (!this.dom) {
      return;
    }
    this.dashboard = new Dashboard(this.dom, _extends({}, options));
    this.dashboard.setData(data);
  };

  Wdashboard.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props2 = this.props,
        newData = _props2.data,
        newOptions = _props2.config;
    var oldData = prevProps.data,
        oldOptions = prevProps.config;


    if (newOptions !== oldOptions) {
      this.dashboard.setOption(_extends({}, newOptions));
    } else if (newData !== oldData && this.dashboard) {
      this.dashboard.setData(newData);
    }
  };

  Wdashboard.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props3 = this.props,
        className = _props3.className,
        otherProps = _objectWithoutProperties(_props3, ['className']);

    var mainClasses = classNames((_classNames = {
      'aisc-widgets': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));

    return React.createElement(
      'div',
      { className: 'doa-dashoboard-out' },
      React.createElement('div', { ref: function ref(s) {
          return _this2.dom = s;
        }, className: mainClasses })
    );
  };

  return Wdashboard;
}(React.Component), _class.displayName = 'Wdashboard', _class.defaultProps = {
  range: [0, 100],
  pointCount: 5
}, _temp);
Wdashboard.displayName = 'Wdashboard';
export { Wdashboard as default };


Wdashboard.propTypes = {
  range: PropTypes.array, //取值范围
  pointCount: PropTypes.number // 刻度个数
};