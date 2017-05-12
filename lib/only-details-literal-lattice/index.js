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

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OnlyDetailsLiteralLattice = (_temp = _class = function (_React$Component) {
  _inherits(OnlyDetailsLiteralLattice, _React$Component);

  _createClass(OnlyDetailsLiteralLattice, [{
    key: 'renderCell',
    value: function renderCell(value, i, j) {
      if (this.state.details[i][j] && this.state.details[i][j].cell) {
        return this.state.details[i][j].cell(value);
      } else {
        return value === undefined ? '-' : value.toLocaleString();
      }
    }
  }]);

  function OnlyDetailsLiteralLattice(props) {
    _classCallCheck(this, OnlyDetailsLiteralLattice);

    var _this = _possibleConstructorReturn(this, (OnlyDetailsLiteralLattice.__proto__ || Object.getPrototypeOf(OnlyDetailsLiteralLattice)).call(this, props));

    var details = props.details;
    var row = props.row;
    var col = props.col;
    var result = [];
    for (var i = 0, len = details.length; i < len; i += col) {
      result.push(details.slice(i, i + col));
    }
    var rows = Array.apply(null, Array(row)).map(function (item, i) {
      return i;
    });
    var cols = Array.apply(null, Array(col)).map(function (item, i) {
      return i;
    });

    _this.state = {
      details: result,
      rows: rows,
      cols: cols
    };
    return _this;
  }

  _createClass(OnlyDetailsLiteralLattice, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var details = this.state.details;
      var dataSource = this.props.dataSource;

      var rows = this.state.rows;
      var cols = this.state.cols;

      return _react2.default.createElement(
        'div',
        { className: 'only-details-literal-lattice' },
        _react2.default.createElement(
          'div',
          { className: 'only-details-literal-lattice-details' },
          rows.map(function (row, i) {
            var rowHtml = cols.map(function (col, j) {
              var detail = details[row][col] || {};
              var thresholdsClassName = "only-details-literal-lattice-details-detail-data healthy";
              if (detail && detail.key) {
                thresholdsClassName = (0, _classnames2.default)("only-details-literal-lattice-details-detail-data healthy", {
                  'orange-threshold': detail.orangeThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.orangeThreshold) ? true : false,
                  "red-threshold": detail.redThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.redThreshold) ? true : false
                });
              }
              var data = detail.label === undefined ? '' : dataSource[detail.key];
              return _react2.default.createElement(
                'div',
                { className: 'only-details-literal-lattice-details-detail', key: j },
                _react2.default.createElement(
                  'div',
                  { className: thresholdsClassName },
                  _this2.renderCell(data, i, j),
                  _react2.default.createElement(
                    'span',
                    { className: 'only-details-literal-lattice-details-detail-unit' },
                    detail.unit || ''
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'only-details-literal-lattice-details-detail-text' },
                  detail.label || ''
                )
              );
            });
            return _react2.default.createElement(
              'div',
              { className: 'only-details-literal-lattice-details-row', key: i },
              rowHtml
            );
          })
        )
      );
    }
  }]);

  return OnlyDetailsLiteralLattice;
}(_react2.default.Component), _class.propTypes = {
  title: _react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  }),
  subTitle: _react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  }),
  row: _react2.default.PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  col: _react2.default.PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  details: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    unit: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired,
    cell: _react2.default.PropTypes.func
  })),
  dataSource: _react2.default.PropTypes.object,
  onClickHealthy: _react2.default.PropTypes.func
}, _class.defaultProps = {
  //默认值
  row: 2,
  col: 2,
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
}, _temp);
OnlyDetailsLiteralLattice.displayName = 'OnlyDetailsLiteralLattice';
exports.default = OnlyDetailsLiteralLattice;
module.exports = exports['default'];