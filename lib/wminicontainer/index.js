'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _common = require('../common/common');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wminicontainer';

var Wminicontainer = (_temp = _class = function (_React$Component) {
  _inherits(Wminicontainer, _React$Component);

  function Wminicontainer(props) {
    _classCallCheck(this, Wminicontainer);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, (Wminicontainer.__proto__ || Object.getPrototypeOf(Wminicontainer)).call(this, props));

    (0, _log2.default)('Wminicontainer', 'init');
    return _this;
  }

  _createClass(Wminicontainer, [{
    key: 'render',
    value: function render() {
      var _classNames;

      var _props = this.props,
          _props$height = _props.height,
          height = _props$height === undefined ? 80 : _props$height,
          className = _props.className,
          status = _props.status,
          style = _props.style,
          otherProps = _objectWithoutProperties(_props, ['height', 'className', 'status', 'style']);

      var mainClasses = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, '' + prefix, true), _defineProperty(_classNames, prefix + '-' + (0, _common.getStatusColorName)(status), !!status), _defineProperty(_classNames, className, !!className), _classNames));

      return _react2.default.createElement(
        'div',
        _extends({ className: mainClasses, style: _extends({
            minHeight: height,
            height: height
          }, style)
        }, otherProps),
        this.props.children
      );
    }
  }]);

  return Wminicontainer;
}(_react2.default.Component), _class.displayName = 'Wminicontainer', _class.defaultProps = {
  status: ''
}, _temp);
Wminicontainer.displayName = 'Wminicontainer';
exports.default = Wminicontainer;


Wminicontainer.propTypes = {
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
};
module.exports = exports['default'];