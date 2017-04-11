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

var RankList = function (_React$Component) {
  _inherits(RankList, _React$Component);

  function RankList(props) {
    _classCallCheck(this, RankList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      title: _this.props.title,
      data: _this.props.data || [],
      cols: _this.props.cols
    };
    return _this;
  }

  RankList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data || []
      });
    }
    if (this.props.title !== nextProps.title) {
      this.setState({
        title: nextProps.title
      });
    }
    if (this.props.cols !== nextProps.cols) {
      this.setState({
        cols: nextProps.cols
      });
    }
  };

  RankList.prototype.render = function render() {
    var _this2 = this;

    var lis = [];
    var indexMaxNum = void 0;
    this.state.data.forEach(function (item, index) {
      var row = [];
      var per = '',
          indexNum = 0;
      _this2.state.cols.forEach(function (col, i) {
        var num = item[col.key];
        var text = num.toLocaleString();
        var content = null;
        var cls = '';
        if (col.percent) {
          text = (num * 100).toFixed(1) + '%';
          //if(col.isIndex) per = text;
        }
        if (col.suffix) text += col.suffix;
        if (col.cls) cls = 'rank-list-li-' + col.cls;
        if (col.link) {
          var link = col.linkKey ? item[col.linkKey] : text;
          content = _react2['default'].createElement(
            'a',
            { className: cls, href: col.link + link, target: '_blank' },
            text
          );
        } else {
          content = _react2['default'].createElement(
            'span',
            { className: cls },
            text
          );
        }
        var styleCol = col.width ? { width: col.width + 'px', flexGrow: 0 } : {};

        row.push(_react2['default'].createElement(
          'div',
          { className: 'rank-list-li-col', style: styleCol, key: 'col-' + index + '-' + i },
          content
        ));

        if (col.isIndex) {
          indexNum = num >= 0 ? num : 0;
          if (index === 0) indexMaxNum = num;
        }
      });

      if (per === '') {
        var max = indexMaxNum || item[_this2.state.cols[0].key];
        per = 100 * indexNum / max + '%';
      }

      lis.push(_react2['default'].createElement(
        'div',
        { className: 'rank-list-li', key: 'li-' + index },
        row,
        _react2['default'].createElement('div', { className: 'rank-list-li-bar', style: { width: per } })
      ));
    });

    return _react2['default'].createElement(
      'div',
      { className: 'rank-list' },
      _react2['default'].createElement(
        'h5',
        null,
        this.state.title
      ),
      _react2['default'].createElement(
        'div',
        { className: 'rank-list-ol' },
        lis
      )
    );
  };

  return RankList;
}(_react2['default'].Component);

exports['default'] = RankList;
module.exports = exports['default'];