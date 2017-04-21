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

var OnlyLiteralMini = function (_React$Component) {
  _inherits(OnlyLiteralMini, _React$Component);

  function OnlyLiteralMini(props) {
    _classCallCheck(this, OnlyLiteralMini);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onClickHealthy = _this.onClickHealthy.bind(_this);
    return _this;
  }

  OnlyLiteralMini.prototype.onClickHealthy = function onClickHealthy() {
    this.props.onClickHealthy && this.props.onClickHealthy();
  };

  OnlyLiteralMini.prototype.render = function render() {
    var title = this.props.title;
    var subTitle = this.props.subTitle;
    var details = this.props.details;
    var dataSource = this.props.dataSource;
    //计算标题状态
    var titleStatus = void 0;
    if (title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined) {
      titleStatus = (0, _classnames2['default'])({
        "cursor-p": this.props.onClickHealthy !== undefined,
        "orange-threshold": title.orangeThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.orangeThreshold) ? true : false,
        "red-threshold": title.redThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.redThreshold) ? true : false
      });
    } else {
      titleStatus = (0, _classnames2['default'])({
        "cursor-p": this.props.onClickHealthy !== undefined
      });
    }

    //计算副标题状态
    var subTitleStatus = '';
    if (subTitle.compare !== undefined && subTitle.key !== undefined && dataSource[subTitle.key] !== undefined) {
      subTitleStatus = (0, _classnames2['default'])({
        "cursor-p": this.props.onClickHealthy !== undefined,
        "orange-threshold": subTitle.orangeThreshold !== undefined && (0, _common.compareComputed)(subTitle.compare, dataSource[subTitle.key], subTitle.orangeThreshold) ? true : false,
        "red-threshold": subTitle.redThreshold !== undefined && (0, _common.compareComputed)(subTitle.compare, dataSource[title.key], subTitle.redThreshold) ? true : false
      });
    }

    var thresholds = details.map(function (item) {
      var thresholdsClassName = (0, _classnames2['default'])("healthy-status-details-detail-data healthy", {
        'orange-threshold': item.orangeThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.orangeThreshold) ? true : false,
        "red-threshold": item.redThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.redThreshold) ? true : false
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
          title.label
        ),
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-title-data weight ml12 healthy ' + titleStatus, onClick: this.onClickHealthy },
          dataSource[title.key] || '-'
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'healthy-status-sub-title' },
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-sub-title-text' },
          subTitle.label
        ),
        _react2['default'].createElement(
          'span',
          { className: 'healthy-status-sub-title-data weight ml12 healthy ' + subTitleStatus },
          dataSource[subTitle.key] === undefined ? '-' : dataSource[subTitle.key]
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
              dataSource[detail.key] === undefined ? '-' : dataSource[detail.key]
            ),
            _react2['default'].createElement(
              'div',
              { className: 'healthy-status-details-detail-text' },
              detail.label
            )
          );
        })
      )
    );
  };

  return OnlyLiteralMini;
}(_react2['default'].Component);

OnlyLiteralMini.propTypes = {
  title: _react2['default'].PropTypes.shape({
    label: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    redThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    compare: _react2['default'].PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2['default'].PropTypes.string.isRequired
  }),
  subTitle: _react2['default'].PropTypes.shape({
    label: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    redThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    compare: _react2['default'].PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2['default'].PropTypes.string.isRequired
  }),
  details: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.shape({
    label: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    redThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    compare: _react2['default'].PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2['default'].PropTypes.string.isRequired
  })),
  dataSource: _react2['default'].PropTypes.object,
  onClickHealthy: _react2['default'].PropTypes.func
};
OnlyLiteralMini.defaultProps = {
  //默认值
  title: {
    "label": "Title",
    "key": "title"
  },
  subTitle: {
    "label": "subTitle",
    "key": "subTitle"
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
};
exports['default'] = OnlyLiteralMini;
module.exports = exports['default'];