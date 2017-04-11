/*
 * @description 健康状态 
 * @param titles object 标题、副标题  
 * @param titlesData object 标题、副标题对应值  标题值可点击
 * @param details array 详情：包含文案、数据
 * @param onClickHealthy func 点击标题值
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

var HealthyStatus = function (_React$Component) {
  _inherits(HealthyStatus, _React$Component);

  function HealthyStatus(props) {
    _classCallCheck(this, HealthyStatus);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onClickHealthy = _this.onClickHealthy.bind(_this);
    return _this;
  }

  HealthyStatus.prototype.onClickHealthy = function onClickHealthy() {
    this.props.onClickHealthy && this.props.onClickHealthy();
  };

  HealthyStatus.prototype.render = function render() {
    var titles = this.props.titles;
    var titlesData = this.props.titlesData;
    var details = this.props.details;

    var healthyStatus = (0, _classnames2['default'])("healthy-status-title-data", "weight", "ml12", {
      'healthy': titlesData.title === 'Healthy',
      'cursor-p': this.props.onClickHealthy !== undefined
    });
    var thresholds = details.map(function (item) {
      var thresholdsClassName = (0, _classnames2['default'])("healthy-status-details-detail-data", {
        'over-threshold': item.data > item.threshold ? true : false
      });
      return thresholdsClassName;
    });
    return _react2['default'].createElement(
      'div',
      { className: 'healthy-status' },
      _react2['default'].createElement(
        'div',
        { className: 'healthy-status-title' },
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-title-text' },
          titles.title
        ),
        _react2['default'].createElement(
          'span',
          { className: healthyStatus, onClick: this.onClickHealthy },
          titlesData.title
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'healthy-status-sub-title' },
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-sub-title-text' },
          titles.subTitle
        ),
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-sub-title-data weight ml12 healthy' },
          titlesData.subTitle
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'healthy-status-details' },
        details.map(function (detail, index) {
          return _react2['default'].createElement(
            'div',
            { className: 'healthy-status-details-detail', key: index },
            _react2['default'].createElement(
              'div',
              { className: thresholds[index] },
              detail.data
            ),
            _react2['default'].createElement(
              'div',
              { className: 'healthy-status-details-detail-text' },
              detail.title
            )
          );
        })
      )
    );
  };

  return HealthyStatus;
}(_react2['default'].Component);

HealthyStatus.propTypes = {
  titles: _react2['default'].PropTypes.shape({
    title: _react2['default'].PropTypes.string,
    subTitle: _react2['default'].PropTypes.string
  }),
  titlesData: _react2['default'].PropTypes.shape({
    title: _react2['default'].PropTypes.string,
    subTitle: _react2['default'].PropTypes.number
  }),
  details: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
    title: _react2['default'].PropTypes.string,
    data: _react2['default'].PropTypes.number,
    threshold: _react2['default'].PropTypes.number
  })),
  onClickHealthy: _react2['default'].PropTypes.func
};
HealthyStatus.defaultProps = {
  //默认值
  titles: {
    title: "Status",
    subTitle: "Monitors in Quorum"
  },
  // Healthy\Unhealthy
  titlesData: {
    title: "Healthy",
    subTitle: 0
  },
  details: [{
    title: "OSD in",
    data: 0
  }, {
    title: "OSD out",
    data: 0
  }, {
    title: "OSD up",
    data: 0
  }, {
    title: "OSD down",
    data: 110,
    threshold: 10
  }]
};
exports['default'] = HealthyStatus;
module.exports = exports['default'];