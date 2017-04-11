/*
 * @description Load 带进度条的使用率挂件
 * @param titles object 标题以及对应值  
 * @param details array 详情：包含文案、数据、阈值
 * 阈值： 橙色阈值、红色阈值
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

var LoadProgress = function (_React$Component) {
  _inherits(LoadProgress, _React$Component);

  function LoadProgress() {
    _classCallCheck(this, LoadProgress);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  LoadProgress.prototype.render = function render() {
    var title = this.props.title;
    var details = this.props.details;

    var thresholds = details.map(function (item) {
      var thresholdsClassName = (0, _classnames2['default'])({
        'over-threshold-orange': item.data > item.orangeThreshold ? true : false,
        'over-threshold-red': item.data > item.redThreshold ? true : false
      });
      return thresholdsClassName;
    });

    var widths = details.map(function (item) {
      return { width: item.data * 100 + '%' };
    });

    var titleData = title.data.toLocaleString();
    return _react2['default'].createElement(
      'div',
      { className: 'load-progress' },
      _react2['default'].createElement(
        'div',
        { className: 'load-progress-title' },
        _react2['default'].createElement(
          'span',
          { className: 'load-progress-title-text' },
          title.text
        ),
        _react2['default'].createElement(
          'span',
          { className: 'load-progress-title-data' },
          titleData
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'load-progress-details' },
        details.map(function (detail, index) {
          return _react2['default'].createElement(
            'div',
            { className: 'load-progress-details-detail', key: index },
            _react2['default'].createElement(
              'div',
              { className: 'load-progress-details-detail-left' },
              _react2['default'].createElement(
                'div',
                { className: 'load-progress-details-detail-text' },
                detail.title
              ),
              _react2['default'].createElement(
                'div',
                { className: 'load-progress-details-detail-pro-bg' },
                _react2['default'].createElement('div', { className: 'load-progress-details-detail-pro ' + thresholds[index], style: widths[index] })
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'load-progress-details-detail-data ' + thresholds[index] },
              detail.data.toFixed(2) * 100 + '%'
            )
          );
        })
      )
    );
  };

  return LoadProgress;
}(_react2['default'].Component);

LoadProgress.propTypes = {
  title: _react2['default'].PropTypes.shape({
    text: _react2['default'].PropTypes.string,
    data: _react2['default'].PropTypes.number
  }),
  details: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
    title: _react2['default'].PropTypes.string,
    data: _react2['default'].PropTypes.number,
    orangeThreshold: _react2['default'].PropTypes.number,
    redThreshold: _react2['default'].PropTypes.number
  }))
};
LoadProgress.defaultProps = {
  //默认值
  title: {
    text: "Load",
    data: 1234567890
  },
  details: [{
    title: "CPU使用率",
    data: 1,
    orangeThreshold: 0.6,
    redThreshold: 0.8
  }, {
    title: "内存使用率",
    data: 0.75,
    orangeThreshold: 0.6,
    redThreshold: 0.8
  }]
};
exports['default'] = LoadProgress;
module.exports = exports['default'];