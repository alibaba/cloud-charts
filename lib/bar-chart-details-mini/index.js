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

var BarChartDetailsMini = (_temp = _class = function (_React$Component) {
  _inherits(BarChartDetailsMini, _React$Component);

  function BarChartDetailsMini() {
    _classCallCheck(this, BarChartDetailsMini);

    return _possibleConstructorReturn(this, (BarChartDetailsMini.__proto__ || Object.getPrototypeOf(BarChartDetailsMini)).apply(this, arguments));
  }

  _createClass(BarChartDetailsMini, [{
    key: 'render',
    value: function render() {
      var title = this.props.title;
      var details = this.props.details;
      var dataSource = this.props.dataSource;

      var titleStatus = '';
      if (title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined) {
        titleStatus = (0, _classnames2.default)({
          "orange-threshold": title.orangeThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.orangeThreshold) ? true : false,
          "red-threshold": title.redThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.redThreshold) ? true : false
        });
      }

      var thresholds = details.map(function (item) {
        var thresholdsClassName = (0, _classnames2.default)({
          'orange-threshold': item.orangeThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.orangeThreshold) ? true : false,
          "red-threshold": item.redThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.redThreshold) ? true : false
        });
        return thresholdsClassName;
      });

      var widths = details.map(function (item) {
        return { width: (dataSource[item.key] || 0) * 100 + '%' };
      });

      var titleData = dataSource[title.key] === undefined ? '-' : dataSource[title.key];
      return _react2.default.createElement(
        'div',
        { className: 'load-progress' },
        _react2.default.createElement(
          'div',
          { className: 'load-progress-title' },
          _react2.default.createElement(
            'span',
            { className: 'load-progress-title-text' },
            title.label
          ),
          _react2.default.createElement(
            'span',
            { className: 'load-progress-title-data ' + titleStatus },
            titleData.toLocaleString()
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'load-progress-details' },
          details.map(function (detail, index) {
            var data = Number(dataSource[detail.key]).toFixed(2) * 100;
            data = isNaN(data) ? '-' : data;
            return _react2.default.createElement(
              'div',
              { className: 'load-progress-details-detail', key: index },
              _react2.default.createElement(
                'div',
                { className: 'load-progress-details-detail-left' },
                _react2.default.createElement(
                  'div',
                  { className: 'load-progress-details-detail-text' },
                  detail.label
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'load-progress-details-detail-pro-bg' },
                  _react2.default.createElement('div', { className: 'load-progress-details-detail-pro ' + thresholds[index], style: widths[index] })
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'load-progress-details-detail-data ' + thresholds[index] },
                data + '%'
              )
            );
          })
        )
      );
    }
  }]);

  return BarChartDetailsMini;
}(_react2.default.Component), _class.propTypes = {
  title: _react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  }),
  details: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  })),
  dataSource: _react2.default.PropTypes.object
}, _class.defaultProps = {
  //默认值
  title: {
    "label": "Title",
    "key": "title"
  },
  details: [{
    "label": "Text",
    "key": 'a'
  }, {
    "label": "Text",
    "key": 'b'
  }],
  dataSource: {}
}, _temp);
BarChartDetailsMini.displayName = 'BarChartDetailsMini';
exports.default = BarChartDetailsMini;
module.exports = exports['default'];