'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _index = require('@alife/aisc/lib/grid/index');

var _index2 = _interopRequireDefault(_index);

var _divider = require('./views/divider');

var _divider2 = _interopRequireDefault(_divider);

var _wcircle = require('../wcircle');

var _wcircle2 = _interopRequireDefault(_wcircle);

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

var _platform = require('../common/platform');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Row = _index2.default.Row,
    Col = _index2.default.Col;

var prefix = 'aisc-wcontainer';

var Wcontainer = (_temp = _class = function (_React$Component) {
  _inherits(Wcontainer, _React$Component);

  function Wcontainer(props) {
    _classCallCheck(this, Wcontainer);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, (Wcontainer.__proto__ || Object.getPrototypeOf(Wcontainer)).call(this, props));

    (0, _log2.default)('Wcontainer', 'init');
    return _this;
  }

  _createClass(Wcontainer, [{
    key: 'renderTitle',
    value: function renderTitle(title, titleBorder, operation, titleStyle) {
      var titleBorderCls = titleBorder ? prefix + '-title-border' : '';
      return _react2.default.createElement(
        'div',
        { className: prefix + '-title ' + titleBorderCls, style: titleStyle },
        title,
        operation ? _react2.default.createElement(
          'div',
          { className: prefix + '-operation' },
          operation
        ) : null
      );
    }
  }, {
    key: 'renderMainNormal',
    value: function renderMainNormal(contentStyle) {
      var _props = this.props,
          propsChildren = _props.children,
          title = _props.title,
          fullContent = _props.fullContent;


      var oneChild = _react2.default.Children.count(propsChildren) === 1;
      if (oneChild && propsChildren && propsChildren.type && propsChildren.type.isG2Chart || fullContent) {
        return _react2.default.createElement(
          'div',
          { className: prefix + '-main ' + prefix + '-main-one-chart ' + (title ? '' : 'no-title'), style: contentStyle },
          propsChildren
        );
      }

      return _react2.default.createElement(
        'div',
        { className: prefix + '-main ' + (title ? '' : 'no-title'), style: contentStyle },
        _react2.default.createElement(
          Row,
          { align: 'center' },
          _react2.default.Children.map(propsChildren, function (child, i) {
            if (!child) {
              return child;
            }
            if (oneChild) {
              return _react2.default.createElement(
                Col,
                { span: '24', key: i },
                child
              );
            }
            if (child.type.displayName === 'Wicon' || child.type.displayName === 'Wcircle') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '2', key: i },
                child
              );
            }
            if (child.type.displayName === 'AiscWidgetsG2MiniLine') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '4', key: i },
                child
              );
            }
            if (child.type.displayName === 'Divider') {
              return _react2.default.createElement(
                Col,
                { fixedSpan: '1', key: i },
                child
              );
            }
            return _react2.default.createElement(
              Col,
              { key: i },
              child
            );
          })
        )
      );
    }
  }, {
    key: 'renderMainCross',
    value: function renderMainCross(contentStyle) {
      var maxColPerRow = 0;
      var currentColPerRow = 0;
      // 计算栅格的ColSpan
      _react2.default.Children.forEach(this.props.children, function (child) {
        if (child.type.displayName !== 'Divider') {
          currentColPerRow += 1;
        } else if (child.type && child.type !== 'combiner') {
          if (currentColPerRow > maxColPerRow) {
            maxColPerRow = currentColPerRow;
          }
          currentColPerRow = 0;
        }
      });
      var ColPerRow = ~~(24 / maxColPerRow);
      return _react2.default.createElement(
        'div',
        { className: prefix + '-main ' + prefix + '-cross', style: contentStyle },
        _react2.default.createElement(
          'div',
          { className: prefix + '-multi-row-container' },
          chunks(this.props.children, ColPerRow)
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames,
          _this2 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          arrange = _props2.arrange,
          title = _props2.title,
          titleBorder = _props2.titleBorder,
          operation = _props2.operation,
          className = _props2.className,
          style = _props2.style,
          titleStyle = _props2.titleStyle,
          contentStyle = _props2.contentStyle,
          otherProps = _objectWithoutProperties(_props2, ['width', 'height', 'arrange', 'title', 'titleBorder', 'operation', 'className', 'style', 'titleStyle', 'contentStyle']);

      var mainClasses = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, '' + prefix, true), _defineProperty(_classNames, prefix + '-mobile', (0, _platform.isMobileWithProps)(otherProps)), _defineProperty(_classNames, className, !!className), _classNames));

      return _react2.default.createElement(
        'div',
        _extends({
          className: mainClasses,
          style: _extends({
            width: width,
            minHeight: height,
            height: height
          }, style)
        }, otherProps, {
          ref: function ref(o) {
            _this2.container = o;
          }
        }),
        title && this.renderTitle(title, titleBorder, operation, titleStyle),
        arrange === 'normal' && this.renderMainNormal(contentStyle),
        arrange === 'cross' && this.renderMainCross(contentStyle)
      );
    }
  }]);

  return Wcontainer;
}(_react2.default.Component), _class.displayName = 'Wcontainer', _class.defaultProps = {
  arrange: 'normal',
  height: '100%',
  operation: '',
  titleBorder: true
}, _temp);
Wcontainer.displayName = 'Wcontainer';
exports.default = Wcontainer;


Wcontainer.propTypes = {
  title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
};

function chunks(arr, maxSpan) {
  var rs = [];
  var oneRow = [];
  _react2.default.Children.forEach(arr, function (child, i) {
    if (child.type && child.type.displayName === 'Divider') {
      rs.push(_react2.default.createElement(
        Row,
        { type: 'across', align: 'center', key: i },
        oneRow
      ));
      oneRow = [];
    } else if (child.type === 'combiner' && oneRow.length) {
      var lastChild = oneRow[oneRow.length - 1].props.children;
      var lastSpan = oneRow[oneRow.length - 1].props.span;
      oneRow[oneRow.length - 1] = _react2.default.createElement(
        Col,
        { span: lastSpan + maxSpan, key: i },
        lastChild
      );
    } else if (i === arr.length - 1) {
      oneRow.push(_react2.default.createElement(
        Col,
        { span: maxSpan, key: i },
        child
      ));
      rs.push(_react2.default.createElement(
        Row,
        { type: 'across', align: 'center', key: i },
        oneRow
      ));
    } else {
      oneRow.push(_react2.default.createElement(
        Col,
        { span: maxSpan, key: i },
        child
      ));
    }
  });
  return rs;
}

Wcontainer.divider = _divider2.default;
Wcontainer.combiner = 'combiner';
module.exports = exports['default'];