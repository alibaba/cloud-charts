'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CapacityIndex = function (_React$Component) {
  _inherits(CapacityIndex, _React$Component);

  function CapacityIndex(props) {
    _classCallCheck(this, CapacityIndex);

    var _this = _possibleConstructorReturn(this, (CapacityIndex.__proto__ || Object.getPrototypeOf(CapacityIndex)).call(this, props));

    _this.state = {
      title: _this.props.title,
      ratio: _this.props.data.ratio || 0,
      quantity: _this.props.data.quantity || 0,
      capacity: _this.props.data.capacity || 0
    };
    return _this;
  }

  _createClass(CapacityIndex, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.data !== nextProps.data) {
        this.setState({
          ratio: nextProps.data.ratio || 0,
          quantity: nextProps.data.quantity || 0,
          capacity: nextProps.data.capacity || 0
        });
      }
      if (this.props.title !== nextProps.title) {
        this.setState({
          title: nextProps.title
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var circumference = 2 * 47 * Math.PI;
      var strokeDasharray = this.state.ratio * circumference + ' ' + circumference;

      var clsSvg = (0, _classnames2.default)({
        'capacity-index-svg': true,
        'capacity-index-warn': this.state.ratio >= 0.8
      });

      return _react2.default.createElement(
        'div',
        { className: 'capacity-index' },
        _react2.default.createElement(
          'h5',
          null,
          this.state.title
        ),
        _react2.default.createElement(
          'div',
          { className: 'capacity-index-ratio' },
          _react2.default.createElement(
            'div',
            { className: 'capacity-index-ratio-svg' },
            _react2.default.createElement(
              'svg',
              { width: '100%', height: '100%', viewBox: '0 0 106 106', xmlns: 'http://www.w3.org/2000/svg', version: '1.1', className: clsSvg },
              _react2.default.createElement('circle', { r: '47', cx: '53', cy: '53', className: 'capacity-index-svg-bg' }),
              _react2.default.createElement('circle', { r: '47', cx: '53', cy: '53', className: 'capacity-index-svg-ring', strokeDasharray: strokeDasharray, transform: 'rotate(-90, 53 53)' })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'state-index-count-num' },
            _react2.default.createElement(
              'span',
              null,
              (this.state.ratio * 100).toFixed(0) + '%'
            ),
            _react2.default.createElement(
              'p',
              null,
              '\u5B58\u50A8\u4F7F\u7528\u7387'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'capacity-index-sub' },
          _react2.default.createElement(
            'div',
            { className: 'capacity-index-sub-item' },
            _react2.default.createElement(
              'b',
              null,
              '\u673A\u5668\u6570'
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.quantity.toLocaleString()
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'capacity-index-sub-item' },
            _react2.default.createElement(
              'b',
              null,
              '\u5B58\u50A8\u5BB9\u91CF'
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.capacity.toLocaleString() + 'T'
            )
          )
        )
      );
    }
  }]);

  return CapacityIndex;
}(_react2.default.Component);

CapacityIndex.displayName = 'CapacityIndex';
exports.default = CapacityIndex;
module.exports = exports['default'];