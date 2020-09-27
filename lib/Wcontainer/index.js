'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _divider = require('./views/divider');

var _divider2 = _interopRequireDefault(_divider);

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

var _platform = require('../common/platform');

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'cloud-wcontainer';

var Wcontainer = function (_React$Component) {
  _inherits(Wcontainer, _React$Component);

  function Wcontainer(props) {
    _classCallCheck(this, Wcontainer);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { criticalError: null };

    // 图表初始化时记录日志
    (0, _log2.default)('Wcontainer', 'init');

    if (props.catchError) {
      _this.componentDidCatch = function (error, info) {
        var onError = _this.props.onError;

        var customError = null;
        if (onError) {
          customError = onError(error, info);
        }
        if (customError !== false) {
          _this.setState({ criticalError: error });
        }
      };
    }
    return _this;
  }

  // componentDidCatch

  Wcontainer.prototype.renderTitle = function renderTitle(title, titleBorder, operation, titleStyle) {
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
  };

  Wcontainer.prototype.renderMainNormal = function renderMainNormal(contentStyle, fullContent) {
    var _props = this.props,
        propsChildren = _props.children,
        title = _props.title;


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
        'div',
        { className: prefix + '-row ' + prefix + '-row-no-padding ' + prefix + '-row-align-center' },
        _react2.default.Children.map(propsChildren, function (child, i) {
          if (!child) {
            return child;
          }
          if (oneChild) {
            return _react2.default.createElement(
              'div',
              { className: prefix + '-col ' + prefix + '-col-24', key: i },
              child
            );
          }
          if (child.type.displayName === 'Wicon' || child.type.displayName === 'Wcircle') {
            return _react2.default.createElement(
              'div',
              { className: prefix + '-col ' + prefix + '-col-fixed-2', key: i },
              child
            );
          }
          if (child.type.displayName === 'CloudChartsG2MiniLine') {
            return _react2.default.createElement(
              'div',
              { className: prefix + '-col ' + prefix + '-col-fixed-4', key: i },
              child
            );
          }
          if (child.type.displayName === 'Divider') {
            return _react2.default.createElement(
              'div',
              { className: prefix + '-col ' + prefix + '-col-fixed-1', key: i },
              child
            );
          }
          return _react2.default.createElement(
            'div',
            { className: prefix + '-col', key: i },
            child
          );
        })
      )
    );
  };

  Wcontainer.prototype.renderMainCross = function renderMainCross(contentStyle) {
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
  };

  Wcontainer.prototype.renderError = function renderError() {
    var title = this.props.title;
    var stack = this.state.criticalError.stack;


    return _react2.default.createElement(
      'div',
      { className: prefix + '-main ' + prefix + '-main-critical-error ' + (title ? '' : 'no-title') },
      _react2.default.createElement(
        'pre',
        null,
        stack ? stack : this.state.criticalError.toString()
      )
    );
  };

  Wcontainer.prototype.render = function render() {
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
        fullContent = _props2.fullContent,
        isMobile = _props2.isMobile,
        catchError = _props2.catchError,
        otherProps = _objectWithoutProperties(_props2, ['width', 'height', 'arrange', 'title', 'titleBorder', 'operation', 'className', 'style', 'titleStyle', 'contentStyle', 'fullContent', 'isMobile', 'catchError']);

    var mainClasses = (0, _classnames2.default)((_classNames = {
      'cloud-charts': true
    }, _classNames['' + prefix] = true, _classNames[prefix + '-mobile'] = (0, _platform.isMobileWithProps)(this.props, isMobile), _classNames[className] = !!className, _classNames));

    var criticalError = catchError && this.state.criticalError;

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
      criticalError && this.renderError(),
      !criticalError && arrange === 'normal' && this.renderMainNormal(contentStyle, fullContent),
      !criticalError && arrange === 'cross' && this.renderMainCross(contentStyle)
    );
  };

  return Wcontainer;
}(_react2.default.Component);

Wcontainer.displayName = 'Wcontainer';
Wcontainer.defaultProps = {
  arrange: 'normal',
  height: '100%',
  operation: '',
  titleBorder: true,
  catchError: true
};
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
        'div',
        { className: prefix + '-row ' + prefix + '-row-across ' + prefix + '-row-align-center', key: i },
        oneRow
      ));
      oneRow = [];
    } else if (child.type === 'combiner' && oneRow.length) {
      var lastChild = oneRow[oneRow.length - 1].props.children;
      var lastSpan = oneRow[oneRow.length - 1].props.span;
      oneRow[oneRow.length - 1] = _react2.default.createElement(
        'div',
        { className: prefix + '-col ' + prefix + '-col-' + (lastSpan + maxSpan), key: i },
        lastChild
      );
    } else if (i === arr.length - 1) {
      oneRow.push(_react2.default.createElement(
        'div',
        { className: prefix + '-col ' + prefix + '-col-' + maxSpan, key: i },
        child
      ));
      rs.push(_react2.default.createElement(
        'div',
        { className: prefix + '-row ' + prefix + '-row-across ' + prefix + '-row-align-center', key: i },
        oneRow
      ));
    } else {
      oneRow.push(_react2.default.createElement(
        'div',
        { className: prefix + '-col ' + prefix + '-col-' + maxSpan, key: i },
        child
      ));
    }
  });
  return rs;
}

Wcontainer.divider = _divider2.default;
Wcontainer.combiner = 'combiner';