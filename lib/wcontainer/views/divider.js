'use strict';

var _class, _temp;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import React from 'react';
import PropTypes from 'prop-types';

var prefix = 'aisc-wcontainer';

var Divider = (_temp = _class = function (_React$Component) {
  _inherits(Divider, _React$Component);

  function Divider(props) {
    _classCallCheck(this, Divider);

    return _possibleConstructorReturn(this, _React$Component.call(this, props));
  }

  Divider.prototype.render = function render() {
    return React.createElement('div', { className: prefix + '-divider' });
  };

  return Divider;
}(React.Component), _class.displayName = 'Divider', _temp);
Divider.displayName = 'Divider';
export { Divider as default };