'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StateIndex = function (_React$Component) {
  _inherits(StateIndex, _React$Component);

  function StateIndex(props) {
    _classCallCheck(this, StateIndex);

    var _this = _possibleConstructorReturn(this, (StateIndex.__proto__ || Object.getPrototypeOf(StateIndex)).call(this, props));

    _this.state = {
      title: _this.props.title,
      total: _this.props.data.total || 0,
      down: _this.props.data.down || 0,
      out: _this.props.data.out || 0
    };
    return _this;
  }

  _createClass(StateIndex, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.data !== nextProps.data) {
        this.setState({
          total: nextProps.data.total || 0,
          down: nextProps.data.down || 0,
          out: nextProps.data.out || 0
        });
      }
      if (this.props.title !== nextProps.title) {
        this.setState({
          title: nextProps.title
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var clsDown = (0, _classnames2.default)({
        'state-index-sub-item': true,
        'state-index-sub-warn': this.state.down > 0
      });

      var clsOut = (0, _classnames2.default)({
        'state-index-sub-item': true,
        'state-index-sub-warn': this.state.out > 0
      });

      return _react2.default.createElement(
        'div',
        { className: 'state-index' },
        _react2.default.createElement(
          'h5',
          null,
          this.state.title
        ),
        _react2.default.createElement(
          'div',
          { className: 'state-index-count' },
          _react2.default.createElement(
            'div',
            { className: 'state-index-count-num' },
            _react2.default.createElement(
              'span',
              null,
              this.state.total.toLocaleString()
            ),
            _react2.default.createElement(
              'b',
              null,
              '\u4E2A'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'state-index-count-sub' },
            'OSD\u6570'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'state-index-sub' },
          _react2.default.createElement(
            'div',
            { className: clsDown },
            _react2.default.createElement(
              'div',
              { className: 'state-index-sub-item-box' },
              _react2.default.createElement(
                'b',
                null,
                'OSD Down'
              ),
              _react2.default.createElement(
                'span',
                null,
                this.state.down.toLocaleString()
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: clsOut },
            _react2.default.createElement(
              'div',
              { className: 'state-index-sub-item-box' },
              _react2.default.createElement(
                'b',
                null,
                'OSD Out'
              ),
              _react2.default.createElement(
                'span',
                null,
                this.state.out.toLocaleString()
              )
            )
          )
        )
      );
    }
  }]);

  return StateIndex;
}(_react2.default.Component);

StateIndex.displayName = 'StateIndex';
exports.default = StateIndex;
module.exports = exports['default'];