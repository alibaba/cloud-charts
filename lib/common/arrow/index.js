'use strict';

var _class, _temp;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import React from 'react';
import classNames from 'classnames';
import './index.scss';

var prefix = 'aisc-warrow';

var Wcircle = (_temp = _class = function (_React$Component) {
  _inherits(Wcircle, _React$Component);

  function Wcircle() {
    _classCallCheck(this, Wcircle);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Wcircle.prototype.render = function render() {
    var type = this.props.type;

    var mainClasses = classNames(prefix, prefix + '-' + type);

    return React.createElement('i', { className: mainClasses });
  };

  return Wcircle;
}(React.Component), _class.defaultProps = {
  type: 'up'
}, _temp);
Wcircle.displayName = 'Wcircle';
export { Wcircle as default };