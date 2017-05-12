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

var PieChartTitleMini = (_temp = _class = function (_React$Component) {
  _inherits(PieChartTitleMini, _React$Component);

  function PieChartTitleMini() {
    _classCallCheck(this, PieChartTitleMini);

    return _possibleConstructorReturn(this, (PieChartTitleMini.__proto__ || Object.getPrototypeOf(PieChartTitleMini)).apply(this, arguments));
  }

  _createClass(PieChartTitleMini, [{
    key: 'renderCell',
    value: function renderCell(value) {
      if (this.props.cell) {
        return this.props.cell(value);
      } else {
        return value === undefined ? '-' : value;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var title = this.props.title;
      var details = this.props.details;
      var dataSource = this.props.dataSource;
      //计算标题状态
      var titleStatus = '';
      var ratio = 0;
      var circumference = 2 * 38 * Math.PI;
      if (title.compare !== undefined && title.divisorKey !== undefined && title.dividendKey !== undefined && dataSource[title.divisorKey] !== undefined && dataSource[title.dividendKey] !== undefined && dataSource[title.dividendKey] !== 0) {
        var divisor = dataSource[title.divisorKey];
        var dividend = dataSource[title.dividendKey];
        ratio = divisor / dividend;
        titleStatus = (0, _classnames2.default)({
          "orange-threshold": title.orangeThreshold !== undefined && (0, _common.compareComputed)(title.compare, ratio, title.orangeThreshold) ? true : false,
          "red-threshold": title.redThreshold !== undefined && (0, _common.compareComputed)(title.compare, ratio, title.redThreshold) ? true : false
        });
      }
      var strokeDasharray = ratio * circumference + ' ' + circumference;

      var thresholds = details.map(function (item) {
        var thresholdsClassName = (0, _classnames2.default)("usage-rate-ring-details-detail-data healthy", {
          'orange-threshold': item.orangeThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.orangeThreshold) ? true : false,
          "red-threshold": item.redThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.redThreshold) ? true : false
        });
        return thresholdsClassName;
      });

      return _react2.default.createElement(
        'div',
        { className: 'usage-rate-ring' },
        _react2.default.createElement(
          'div',
          { className: 'usage-rate-ring-title' },
          _react2.default.createElement(
            'div',
            { className: 'usage-rate-ring-ratio-svg' },
            _react2.default.createElement(
              'svg',
              { width: '100%', height: '100%', viewBox: '0 0 80 80', xmlns: 'http://www.w3.org/2000/svg', version: '1.1', className: 'usage-rate-ring-svg ' + titleStatus },
              _react2.default.createElement('circle', { r: '38', cx: '40', cy: '40', className: 'usage-rate-ring-svg-bg' }),
              _react2.default.createElement('circle', { r: '38', cx: '40', cy: '40', className: 'usage-rate-ring-svg-ring', strokeDasharray: strokeDasharray, transform: 'rotate(-90, 40 40)' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'usage-rate-ring-count-num' },
              _react2.default.createElement(
                'span',
                null,
                Math.round(1000 * ratio) / 10 + '%'
              ),
              _react2.default.createElement(
                'p',
                null,
                title.ring
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'usage-rate-ring-divi ' + titleStatus },
            _react2.default.createElement(
              'div',
              { className: 'usage-rate-ring-divi-data' },
              _react2.default.createElement(
                'span',
                { className: 'usage-rate-ring-divisor' },
                this.renderCell(dataSource[title.divisorKey])
              ),
              _react2.default.createElement(
                'span',
                null,
                '\uFF0F'
              ),
              _react2.default.createElement(
                'span',
                { className: 'usage-rate-ring-dividend' },
                this.renderCell(dataSource[title.dividendKey])
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'usage-rate-ring-divi-text' },
              _react2.default.createElement(
                'span',
                { className: 'usage-rate-ring-divisor' },
                title.divisor
              ),
              _react2.default.createElement(
                'span',
                null,
                '\uFF0F'
              ),
              _react2.default.createElement(
                'span',
                { className: 'usage-rate-ring-dividend' },
                title.dividend
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'usage-rate-ring-details' },
          details.map(function (detail, index) {
            return _react2.default.createElement(
              'div',
              { className: 'usage-rate-ring-details-detail', key: index },
              _react2.default.createElement(
                'div',
                { className: thresholds[index] },
                dataSource[detail.key] === undefined ? '-' : dataSource[detail.key]
              ),
              _react2.default.createElement(
                'div',
                { className: 'usage-rate-ring-details-detail-text' },
                detail.label
              )
            );
          })
        )
      );
    }
  }]);

  return PieChartTitleMini;
}(_react2.default.Component), _class.propTypes = {
  title: _react2.default.PropTypes.shape({
    //环文案
    ring: _react2.default.PropTypes.string,
    //除数，分子 
    divisor: _react2.default.PropTypes.string,
    //被除数，分母
    dividend: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    divisorKey: _react2.default.PropTypes.string.isRequired,
    dividendKey: _react2.default.PropTypes.string.isRequired
  }),
  details: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  })),
  dataSource: _react2.default.PropTypes.object,
  cell: _react2.default.PropTypes.func
}, _class.defaultProps = {
  //默认值
  title: {
    ring: "使用率",
    divisor: "已使用容量",
    dividend: "总容量",
    orangeThreshold: 0.6,
    redThreshold: 0.8,
    compare: ">",
    divisorKey: "divisor",
    dividendKey: "dividend"
  },
  details: [{
    "label": "Text",
    "key": "a"
  }, {
    "label": "Text",
    "key": "b"
  }, {
    "label": "Text",
    "key": "c"
  }, {
    "label": "Text",
    "key": "d"
  }],
  dataSource: {}
}, _temp);
PieChartTitleMini.displayName = 'PieChartTitleMini';
exports.default = PieChartTitleMini;
module.exports = exports['default'];