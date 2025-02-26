// import { Util } from '@antv/g2';
import g2Connect from './common/g2Connect';
import g2ConnectFilter from './common/g2ConnectFilter';
import * as common from './common/common';

export default {
  Connect: g2Connect, // 图表联动组件
  ConnectFilter: g2ConnectFilter,
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
  merge: common.merge,
  calcLinearColor: common.calcLinearColor,
  traverseTree: common.traverseTree,
  deepAssign: common.deepAssign,
  unitConversion: common.unitConversion,
  isInsideChina: common.isInsideChina,
  getAutoMask: common.getAutoMask,
  generateTimestamps: common.generateTimestamps,
  getHourlyTimestamp: common.getHourlyTimestamp
};
