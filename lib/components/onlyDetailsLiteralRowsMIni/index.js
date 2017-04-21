'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

var _common = require('../utils/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var OnlyDetailsLiteralRowsMini = function (_React$Component) {
  _inherits(OnlyDetailsLiteralRowsMini, _React$Component);

  function OnlyDetailsLiteralRowsMini() {
    _classCallCheck(this, OnlyDetailsLiteralRowsMini);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  OnlyDetailsLiteralRowsMini.prototype.render = function render() {
    var details = this.props.details;
    var dataSource = this.props.dataSource;

    return _react2['default'].createElement(
      'div',
      { className: 'only-details-literal-rows-mini' },
      _react2['default'].createElement(
        'div',
        { className: 'only-details-literal-rows-mini-details' },
        details.map(function (detail, i) {
          var thresholdsClassName = (0, _classnames2['default'])("only-details-literal-rows-mini-details-detail-data healthy", {
            'orange-threshold': detail.orangeThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.orangeThreshold) ? true : false,
            "red-threshold": detail.redThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.redThreshold) ? true : false
          });

          return _react2['default'].createElement(
            'div',
            { className: 'only-details-literal-rows-mini-details-detail', key: detail.key },
            _react2['default'].createElement(
              'div',
              { className: thresholdsClassName },
              dataSource[detail.key] === undefined ? '-' : dataSource[detail.key],
              _react2['default'].createElement(
                'span',
                { className: 'only-details-literal-rows-mini-details-detail-unit' },
                detail.unit || ''
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'only-details-literal-rows-mini-details-detail-text' },
              detail.label
            )
          );
        })
      )
    );
  };

  return OnlyDetailsLiteralRowsMini;
}(_react2['default'].Component);

OnlyDetailsLiteralRowsMini.propTypes = {
  details: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
    label: _react2['default'].PropTypes.string,
    unit: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    redThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    compare: _react2['default'].PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2['default'].PropTypes.string.isRequired
  })),
  dataSource: _react2['default'].PropTypes.object
};
OnlyDetailsLiteralRowsMini.defaultProps = {
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
};
exports['default'] = OnlyDetailsLiteralRowsMini;
module.exports = exports['default'];