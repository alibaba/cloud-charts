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

var NumberMiniC = function (_React$Component) {
  _inherits(NumberMiniC, _React$Component);

  function NumberMiniC() {
    _classCallCheck(this, NumberMiniC);

    return _possibleConstructorReturn(this, (NumberMiniC.__proto__ || Object.getPrototypeOf(NumberMiniC)).apply(this, arguments));
  }

  _createClass(NumberMiniC, [{
    key: 'render',


    // constructor(props){
    //   super(props);
    //   this.state = {
    //     title: this.props.title,
    //     total: this.props.data.total || 0,
    //     down: this.props.data.down || 0,
    //     out: this.props.data.out || 0
    //   }
    // }
    //
    // componentWillReceiveProps (nextProps) {
    //   if(this.props.data !== nextProps.data){
    //     this.setState({
    //       total: nextProps.data.total || 0,
    //       down: nextProps.data.down || 0,
    //       out: nextProps.data.out || 0
    //     });
    //   }
    //   if(this.props.title !== nextProps.title){
    //     this.setState({
    //       title: nextProps.title
    //     });
    //   }
    // }

    value: function render() {
      var dataSource = this.props.dataSource || {};
      var main = Number(dataSource[this.props.mainKey || 'main']);
      if (isNaN(main) || !isFinite(main)) {
        main = '-';
      } else {
        main = main.toLocaleString();
      }

      // let clsDown = classNames({
      //   'state-index-sub-item': true,
      //   'state-index-sub-warn': this.state.down > 0
      // });
      //
      // let clsOut = classNames({
      //   'state-index-sub-item': true,
      //   'state-index-sub-warn': this.state.out > 0
      // });

      return _react2.default.createElement(
        'div',
        { className: 'state-index' },
        _react2.default.createElement(
          'h5',
          null,
          this.props.title
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
              main
            ),
            _react2.default.createElement(
              'b',
              null,
              this.props.mainUnit
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'state-index-count-sub' },
            this.props.mainTitle
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'state-index-sub' },
          this.props.details.map(function (detail, i) {
            var data = dataSource[detail.key];
            var hasWarn = false;
            if (detail.cell) {
              data = detail.cell(data);
            } else {
              data = Number(data);
              if (isNaN(data) || !isFinite(data)) {
                data = '-';
              } else {
                if (data > 0) {
                  hasWarn = true;
                }
                data = data.toLocaleString();
              }
            }

            var cls = (0, _classnames2.default)('state-index-sub-item', {
              'state-index-sub-warn': hasWarn
            });

            return _react2.default.createElement(
              'div',
              { className: cls, key: i },
              _react2.default.createElement(
                'div',
                { className: 'state-index-sub-item-box' },
                _react2.default.createElement(
                  'b',
                  null,
                  detail.label
                ),
                _react2.default.createElement(
                  'span',
                  null,
                  data
                )
              )
            );
          })
        )
      );
    }
  }]);

  return NumberMiniC;
}(_react2.default.Component);

NumberMiniC.displayName = 'NumberMiniC';
exports.default = NumberMiniC;
module.exports = exports['default'];