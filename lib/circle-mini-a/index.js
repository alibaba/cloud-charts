'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircleMiniA = (_temp = _class = function (_React$Component) {
  _inherits(CircleMiniA, _React$Component);

  function CircleMiniA() {
    _classCallCheck(this, CircleMiniA);

    return _possibleConstructorReturn(this, (CircleMiniA.__proto__ || Object.getPrototypeOf(CircleMiniA)).apply(this, arguments));
  }

  _createClass(CircleMiniA, [{
    key: 'render',


    // constructor(props){
    //   super(props);
    //   this.state = {
    //     title: this.props.title,
    //     ratio: this.props.data.ratio || 0,
    //     quantity: this.props.data.quantity || 0,
    //     capacity: this.props.data.capacity || 0
    //   }
    // }
    //
    // componentWillReceiveProps (nextProps) {
    //   if(this.props.data !== nextProps.data){
    //     this.setState({
    //       ratio: nextProps.data.ratio || 0,
    //       quantity: nextProps.data.quantity || 0,
    //       capacity: nextProps.data.capacity || 0
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
      var ratio = Number(dataSource[this.props.ringKey || 'ratio']);
      if (isNaN(ratio) || !isFinite(ratio)) {
        ratio = 0;
      }

      var circumference = 2 * 47 * Math.PI;
      var strokeDasharray = ratio * circumference + ' ' + circumference;

      var clsSvg = (0, _classnames2.default)({
        'capacity-index-svg': true,
        'capacity-index-warn': ratio >= 0.8
      });

      return _react2.default.createElement(
        'div',
        { className: 'capacity-index' },
        _react2.default.createElement(
          'h5',
          null,
          this.props.title
        ),
        _react2.default.createElement(
          'div',
          { className: 'capacity-index-ratio' },
          _react2.default.createElement(
            'div',
            { className: 'capacity-index-ratio-svg' },
            _react2.default.createElement(
              'svg',
              { width: '100%', height: '100%', viewBox: '0 0 106 106', xmlns: 'http://www.w3.org/2000/svg', version: '1.1', className: clsSvg },
              _react2.default.createElement('circle', { r: '47', cx: '53', cy: '53', className: 'capacity-index-svg-bg' }),
              _react2.default.createElement('circle', { r: '47', cx: '53', cy: '53', className: 'capacity-index-svg-ring', strokeDasharray: strokeDasharray, transform: 'rotate(-90, 53 53)' })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'state-index-count-num' },
            _react2.default.createElement(
              'span',
              null,
              Math.round(ratio * 100) + '%'
            ),
            _react2.default.createElement(
              'p',
              null,
              this.props.ringTitle
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'capacity-index-sub' },
          this.props.details.map(function (detail, i) {
            var data = dataSource[detail.key];
            if (detail.cell) {
              data = detail.cell(data);
            } else {
              data = Number(data);
              if (isNaN(data) || !isFinite(data)) {
                data = '-';
              } else {
                data = data.toLocaleString();
              }
            }

            return _react2.default.createElement(
              'div',
              { className: 'capacity-index-sub-item', key: i },
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
            );
          })
        )
      );
    }
  }]);

  return CircleMiniA;
}(_react2.default.Component), _class.propTypes = {
  title: _react2.default.PropTypes.string,
  ringTitle: _react2.default.PropTypes.string,
  ringKey: _react2.default.PropTypes.string,
  details: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    key: _react2.default.PropTypes.string.isRequired,
    cell: _react2.default.PropTypes.func
  })),
  dataSource: _react2.default.PropTypes.object
}, _temp);
CircleMiniA.displayName = 'CircleMiniA';
exports.default = CircleMiniA;
module.exports = exports['default'];