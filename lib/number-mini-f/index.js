'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumberMiniF = (_temp = _class = function (_React$Component) {
  _inherits(NumberMiniF, _React$Component);

  function NumberMiniF() {
    _classCallCheck(this, NumberMiniF);

    return _possibleConstructorReturn(this, (NumberMiniF.__proto__ || Object.getPrototypeOf(NumberMiniF)).apply(this, arguments));
  }

  _createClass(NumberMiniF, [{
    key: 'render',
    value: function render() {
      var details = this.props.details;
      var dataSource = this.props.dataSource;

      return _react2.default.createElement(
        'div',
        { className: 'only-details-literal-rows-mini' },
        _react2.default.createElement(
          'div',
          { className: 'only-details-literal-rows-mini-details' },
          details.map(function (detail, i) {
            var thresholdsClassName = (0, _classnames2.default)("only-details-literal-rows-mini-details-detail-data healthy", {
              'orange-threshold': detail.orangeThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.orangeThreshold) ? true : false,
              "red-threshold": detail.redThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.redThreshold) ? true : false
            });

            return _react2.default.createElement(
              'div',
              { className: 'only-details-literal-rows-mini-details-detail', key: detail.key },
              _react2.default.createElement(
                'div',
                { className: thresholdsClassName },
                dataSource[detail.key] === undefined ? '-' : dataSource[detail.key],
                _react2.default.createElement(
                  'span',
                  { className: 'only-details-literal-rows-mini-details-detail-unit' },
                  detail.unit || ''
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'only-details-literal-rows-mini-details-detail-text' },
                detail.label
              )
            );
          })
        )
      );
    }
  }]);

  return NumberMiniF;
}(_react2.default.Component), _class.propTypes = {
  details: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    unit: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  })),
  dataSource: _react2.default.PropTypes.object
}, _class.defaultProps = {
  details: [{
    "label": "Text",
    "unit": "unit",
    "key": "a"
  }, {
    "label": "Text",
    "unit": "unit",
    "key": "b"
  }],
  dataSource: {}
}, _temp);
NumberMiniF.displayName = 'NumberMiniF';
exports.default = NumberMiniF;
module.exports = exports['default'];