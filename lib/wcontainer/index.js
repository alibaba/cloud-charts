'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _aisc = require('@alife/aisc');

var _divider = require('./views/divider');

var _divider2 = _interopRequireDefault(_divider);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Row = _aisc.Grid.Row,
    Col = _aisc.Grid.Col;

var prefix = 'aisc-wcontainer';

var Wcontainer = (_temp = _class = function (_React$Component) {
  _inherits(Wcontainer, _React$Component);

  function Wcontainer(props) {
    _classCallCheck(this, Wcontainer);

    return _possibleConstructorReturn(this, (Wcontainer.__proto__ || Object.getPrototypeOf(Wcontainer)).call(this, props));
  }

  _createClass(Wcontainer, [{
    key: 'renderTitle',
    value: function renderTitle() {
      return _react2.default.createElement(
        'div',
        { className: prefix + '-title' },
        this.props.title,
        _react2.default.createElement('span', { className: prefix + '-time' })
      );
    }
  }, {
    key: 'renderMainNormal',
    value: function renderMainNormal() {
      var _props$height = this.props.height,
          height = _props$height === undefined ? 0 : _props$height;


      var rowHeight = height;
      if (this.props.title) {
        //标题字体14px ,距下面有10px宽度
        rowHeight = rowHeight - 18 - 2 - 10 - 20;
      }

      var containerClasses = (0, _classnames2.default)(_defineProperty({}, prefix + '-main', true));

      return _react2.default.createElement(
        'div',
        { className: containerClasses },
        _react2.default.createElement(
          Row,
          { align: 'center', style: {
              lineHeight: rowHeight + 'px',
              height: rowHeight + 'px'
            } },
          _react2.default.Children.map(this.props.children, function (child, i) {
            if (child.type.displayName === 'Wicon') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '2' },
                child
              );
            }
            if (child.type.Chart && child.type.Chart.displayName === 'Wminiline') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '4' },
                child
              );
            }
            if (child.type.displayName === 'Divider') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '1' },
                child
              );
            }
            return _react2.default.createElement(
              Col,
              null,
              child
            );
          })
        )
      );
    }
  }, {
    key: 'renderMainCross',
    value: function renderMainCross() {
      var _classNames2;

      var _props$height2 = this.props.height,
          height = _props$height2 === undefined ? 0 : _props$height2;


      var rowHeight = height;
      if (this.props.title) {
        //标题字体18px ,距下面有10px宽度
        rowHeight = rowHeight - 18 - 2 - 10 - 20;
      }
      console.log(rowHeight);
      var rowStyle = {
        lineHeight: rowHeight + 'px',
        height: rowHeight + 'px'
      };

      var containerClasses = (0, _classnames2.default)((_classNames2 = {}, _defineProperty(_classNames2, prefix + '-main', true), _defineProperty(_classNames2, prefix + '-cross', true), _classNames2));

      var maxColPerRow = 0;
      var currentColPerRow = 0;
      // 计算栅格的ColSpan
      _react2.default.Children.forEach(this.props.children, function (child, i) {
        if (child.type.displayName !== 'Divider') {
          currentColPerRow += 1;
        } else {
          if (currentColPerRow > maxColPerRow) {
            maxColPerRow = currentColPerRow;
          }
          currentColPerRow = 0;
        }
      });
      var ColPerRow = ~~(24 / maxColPerRow);
      function chunks(arr, maxSpan) {
        var rs = [];
        var oneRow = [];
        _react2.default.Children.forEach(arr, function (child, i) {
          if (child.type.displayName === 'Divider') {
            rs.push(_react2.default.createElement(
              Row,
              { align: 'center' },
              oneRow
            ));
            oneRow = [];
          } else if (i === arr.length - 1) {
            oneRow.push(_react2.default.createElement(
              Col,
              { span: ColPerRow },
              child
            ));
            rs.push(_react2.default.createElement(
              Row,
              { align: 'center' },
              oneRow
            ));
          } else {
            oneRow.push(_react2.default.createElement(
              Col,
              { span: ColPerRow },
              child
            ));
          }
        });
        return rs;
      }

      return _react2.default.createElement(
        'div',
        { className: containerClasses },
        _react2.default.createElement(
          'div',
          { className: prefix + '-multi-row-container', style: rowStyle },
          chunks(this.props.children, ColPerRow)
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames3;

      var _props = this.props,
          _props$height3 = _props.height,
          height = _props$height3 === undefined ? 0 : _props$height3,
          arrange = _props.arrange,
          title = _props.title,
          className = _props.className;

      var mainClasses = (0, _classnames2.default)((_classNames3 = {}, _defineProperty(_classNames3, '' + prefix, true), _defineProperty(_classNames3, className, !!className), _classNames3));

      return _react2.default.createElement(
        'div',
        { className: mainClasses, style: {
            minHeight: height + 'px',
            height: height + 'px'
          } },
        title && this.renderTitle(),
        arrange === 'normal' && this.renderMainNormal(),
        arrange === 'cross' && this.renderMainCross()
      );
    }
  }]);

  return Wcontainer;
}(_react2.default.Component), _class.defaultProps = {
  arrange: 'normal'
}, _temp);
Wcontainer.displayName = 'Wcontainer';
exports.default = Wcontainer;


Wcontainer.propTypes = {
  title: _propTypes2.default.string,
  height: _propTypes2.default.number
};

Wcontainer.divider = _divider2.default;
module.exports = exports['default'];