/*
 * @description 使用率 环占比 
 * @param titles object 环文案、占比对象文案、橙色阈值、红色阈值
 * @param titlesData object 占比对象值
 * @param details array 详情：包含文案、数据、阈值
 * 默认值见defaultProps
 * */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var UsageRateRing = function (_React$Component) {
  _inherits(UsageRateRing, _React$Component);

  function UsageRateRing() {
    _classCallCheck(this, UsageRateRing);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  UsageRateRing.prototype.render = function render() {
    var titles = this.props.titles;
    var titlesData = this.props.titlesData;
    var details = this.props.details;

    var thresholds = details.map(function (item) {
      var thresholdsClassName = (0, _classnames2['default'])("usage-rate-ring-details-detail-data", {
        'over-threshold': item.data > item.threshold ? true : false
      });
      return thresholdsClassName;
    });
    var circumference = 2 * 38 * Math.PI;
    var ratio = titlesData.dividend !== undefined && titlesData.dividend !== null && titlesData.dividend !== 0 ? Number((titlesData.divisor / titlesData.dividend).toFixed(2)) : 0;
    var strokeDasharray = ratio * circumference + ' ' + circumference;

    var svgThreshold = (0, _classnames2['default'])({
      'usage-rate-ring-orange': ratio >= (titles.orangeThreshold ? titles.orangeThreshold : 1),
      'usage-rate-ring-red': ratio >= (titles.redThreshold ? titles.redThreshold : 1)
    });

    return _react2['default'].createElement(
      'div',
      { className: 'usage-rate-ring' },
      _react2['default'].createElement(
        'div',
        { className: 'usage-rate-ring-title' },
        _react2['default'].createElement(
          'div',
          { className: 'usage-rate-ring-ratio-svg' },
          _react2['default'].createElement(
            'svg',
            { width: '100%', height: '100%', viewBox: '0 0 80 80', xmlns: 'http://www.w3.org/2000/svg', version: '1.1', className: 'usage-rate-ring-svg ' + svgThreshold },
            _react2['default'].createElement('circle', { r: '38', cx: '40', cy: '40', className: 'usage-rate-ring-svg-bg' }),
            _react2['default'].createElement('circle', { r: '38', cx: '40', cy: '40', className: 'usage-rate-ring-svg-ring', strokeDasharray: strokeDasharray, transform: 'rotate(-90, 40 40)' })
          ),
          _react2['default'].createElement(
            'div',
            { className: 'usage-rate-ring-count-num' },
            _react2['default'].createElement(
              'span',
              null,
              ratio * 100 + '%'
            ),
            _react2['default'].createElement(
              'p',
              null,
              titles.ring
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'usage-rate-ring-divi ' + svgThreshold },
          _react2['default'].createElement(
            'div',
            { className: 'usage-rate-ring-divi-data' },
            _react2['default'].createElement(
              'span',
              { className: 'usage-rate-ring-divisor' },
              titlesData.divisor
            ),
            _react2['default'].createElement(
              'span',
              null,
              '\uFF0F'
            ),
            _react2['default'].createElement(
              'span',
              { className: 'usage-rate-ring-dividend' },
              titlesData.dividend
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'usage-rate-ring-divi-text' },
            _react2['default'].createElement(
              'span',
              { className: 'usage-rate-ring-divisor' },
              titles.divisor
            ),
            _react2['default'].createElement(
              'span',
              null,
              '\uFF0F'
            ),
            _react2['default'].createElement(
              'span',
              { className: 'usage-rate-ring-dividend' },
              titles.dividend
            )
          )
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'usage-rate-ring-details' },
        details.map(function (detail, index) {
          return _react2['default'].createElement(
            'div',
            { className: 'usage-rate-ring-details-detail', key: index },
            _react2['default'].createElement(
              'div',
              { className: thresholds[index] },
              detail.data
            ),
            _react2['default'].createElement(
              'div',
              { className: 'usage-rate-ring-details-detail-text' },
              detail.title
            )
          );
        })
      )
    );
  };

  return UsageRateRing;
}(_react2['default'].Component);

UsageRateRing.propTypes = {
  titles: _react2['default'].PropTypes.shape({
    //环文案
    ring: _react2['default'].PropTypes.string,
    //除数，分子
    divisor: _react2['default'].PropTypes.string,
    //被除数，分母
    dividend: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.number,
    redThreshold: _react2['default'].PropTypes.number
  }),
  titlesData: _react2['default'].PropTypes.shape({
    divisor: _react2['default'].PropTypes.number,
    dividend: _react2['default'].PropTypes.number
  }),
  details: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
    title: _react2['default'].PropTypes.string,
    data: _react2['default'].PropTypes.number,
    threshold: _react2['default'].PropTypes.number
  }))
};
UsageRateRing.defaultProps = {
  //默认值
  titles: {
    ring: "使用率",
    divisor: "已使用容量",
    dividend: "总容量",
    //橙色阈值
    orangeThreshold: 0.6,
    //红色阈值
    redThreshold: 0.8
  },
  // Healthy\Unhealthy
  titlesData: {
    divisor: 75,
    dividend: 100
  },
  details: [{
    title: "Pools",
    data: 0
  }, {
    title: "rbd",
    data: 0
  }, {
    title: "总PG数",
    data: 0
  }, {
    title: "PG分布标准差",
    data: 1.23,
    threshold: 1
  }]
};
exports['default'] = UsageRateRing;
module.exports = exports['default'];