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

var OnlyDetailsLiteralLattice = function (_React$Component) {
  _inherits(OnlyDetailsLiteralLattice, _React$Component);

  function OnlyDetailsLiteralLattice(props) {
    _classCallCheck(this, OnlyDetailsLiteralLattice);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    var details = props.details;
    var row = props.row;
    var col = props.col;
    var result = [];
    for (var i = 0, len = details.length; i < len; i += col) {
      result.push(details.slice(i, i + col));
    }

    _this.state = {
      details: result
    };
    return _this;
  }

  OnlyDetailsLiteralLattice.prototype.render = function render() {
    var details = this.state.details;
    var dataSource = this.props.dataSource;

    var thresholds = details.map(function (item) {
      var thresholdsClassName = (0, _classnames2['default'])("healthy-status-details-detail-data healthy", {
        'orange-threshold': item.orangeThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.orangeThreshold) ? true : false,
        "red-threshold": item.redThreshold !== undefined && (0, _common.compareComputed)(item.compare, dataSource[item.key], item.redThreshold) ? true : false
      });
      return thresholdsClassName;
    });
    return _react2['default'].createElement(
      'div',
      { className: 'only-details-literal-lattice' },
      _react2['default'].createElement(
        'div',
        { className: 'only-details-literal-lattice-details' },
        details.map(function (row, i) {
          var rowHtml = row.map(function (detail, j) {
            var thresholdsClassName = (0, _classnames2['default'])("only-details-literal-lattice-details-detail-data healthy", {
              'orange-threshold': detail.orangeThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.orangeThreshold) ? true : false,
              "red-threshold": detail.redThreshold !== undefined && (0, _common.compareComputed)(detail.compare, dataSource[detail.key], detail.redThreshold) ? true : false
            });
            return _react2['default'].createElement(
              'div',
              { className: 'only-details-literal-lattice-details-detail', key: detail.key },
              _react2['default'].createElement(
                'div',
                { className: thresholdsClassName },
                dataSource[detail.key] === undefined ? '-' : dataSource[detail.key]
              ),
              _react2['default'].createElement(
                'div',
                { className: 'only-details-literal-lattice-details-detail-text' },
                detail.label
              )
            );
          });
          return _react2['default'].createElement(
            'div',
            { className: 'only-details-literal-lattice-details-row', key: i },
            rowHtml
          );
        })
      )
    );
  };

  return OnlyDetailsLiteralLattice;
}(_react2['default'].Component);

OnlyDetailsLiteralLattice.propTypes = {
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
  row: _react2['default'].PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  col: _react2['default'].PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
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
OnlyDetailsLiteralLattice.defaultProps = {
  //默认值
  row: 2,
  col: 2,
  details: [{
    "label": "OSD in",
    "key": "a"
  }, {
    "label": "OSD out",
    "key": "b"
  }, {
    "label": "OSD up",
    "key": "c"
  }, {
    "label": "OSD down",
    "key": "d"
  }],
  dataSource: {}
};
exports['default'] = OnlyDetailsLiteralLattice;
module.exports = exports['default'];