"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _g2Connect = _interopRequireDefault(require("./common/g2Connect"));

var common = _interopRequireWildcard(require("./common/common"));

// import { Util } from '@antv/g2';
var _default = {
  Connect: _g2Connect["default"],
  // 图表联动组件
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
};
exports["default"] = _default;