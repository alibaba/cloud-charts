'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _g2Connect = require('./common/g2Connect');

var _g2Connect2 = _interopRequireDefault(_g2Connect);

var _common = require('./common/common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({}, _g2.default.Util, {
  Connect: _g2Connect2.default, // 图表联动组件
  propertyMap: common.propertyMap,
  propertyAssign: common.propertyAssign,
  getParentSize: common.getParentSize,
  getStatusColor: common.getStatusColor,
  isInvalidNumber: common.isInvalidNumber,
  numberDecimal: common.numberDecimal,
  beautifyNumber: common.beautifyNumber,
  getRawData: common.getRawData,
  filterKey: common.filterKey,
  isEqual: common.isEqual,
  isEqualWith: common.isEqualWith,
  merge: common.merge
});