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

var TableList = function (_React$Component) {
  _inherits(TableList, _React$Component);

  function TableList(props) {
    _classCallCheck(this, TableList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      data: _this.props.data || [],
      cols: _this.props.cols
    };
    return _this;
  }

  TableList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data || []
      });
    }
    if (this.props.cols !== nextProps.cols) {
      this.setState({
        cols: nextProps.cols
      });
    }
  };

  TableList.prototype.render = function render() {
    var _this2 = this;

    // let ths = [];
    // this.state.cols.forEach((col, i)=>{
    //   ths.push(<th key={'th-' + i}>{col.name}</th>);
    // });

    var ths = [],
        tds = [];
    ths.init = false;
    this.state.data.forEach(function (item, index) {
      var row = [];
      _this2.state.cols.forEach(function (col, i) {
        var num = item[col.key];
        var text = num.toLocaleString();
        var content = null;
        if (col.percent) text = (num * 100).toFixed(1) + '%'; //如果是百分比则不走寻常路
        if (col.suffix) text += col.suffix;
        if (col.link) {
          var link = col.linkKey ? item[col.linkKey] : text;
          content = _react2['default'].createElement(
            'a',
            { href: col.link + link, target: '_blank' },
            text
          );
        } else {
          var clsText = '';
          if (!isNaN(col.morethan) && num >= col.morethan) clsText = 'table-list-warn';
          if (!isNaN(col.lessthan) && num <= col.lessthan) clsText = 'table-list-warn';
          content = _react2['default'].createElement(
            'span',
            { className: clsText },
            text
          );
        }

        var clsTd = isNaN(num) ? 'table-list-txt' : 'table-list-num';
        var styleTd = col.width ? { width: col.width / 11.9 + '%' } : {};
        row.push(_react2['default'].createElement(
          'td',
          { className: clsTd, style: styleTd, key: 'td-' + index + '-' + i },
          content
        ));

        if (!ths.init) ths.push(_react2['default'].createElement(
          'th',
          { className: clsTd, style: styleTd, key: 'th-' + i },
          col.name
        ));
      });
      tds.push(_react2['default'].createElement(
        'tr',
        { key: 'tr-' + index },
        row
      ));
      ths.init = true;
    });

    return _react2['default'].createElement(
      'table',
      { className: 'table-list' },
      _react2['default'].createElement(
        'thead',
        null,
        _react2['default'].createElement(
          'tr',
          null,
          ths
        )
      ),
      _react2['default'].createElement(
        'tbody',
        null,
        tds
      )
    );
  };

  return TableList;
}(_react2['default'].Component);

exports['default'] = TableList;
module.exports = exports['default'];