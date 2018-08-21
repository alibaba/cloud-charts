"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = autoSelect;
/**
 * 根据平台（移动、PC）选择需要渲染的图表组件
 * 如果移动图表不存在，直接返回 PC 图表
 *
 * @example
 *
 * ```
 * import AiscLine from '@alife/aisc-widgets';
 * import AismLine from '@alife/aism-widgets';
 *
 * export default autoSelect(AiscLine, AismLine);
 * ```
 *
 * @param {React.Component}} aisc - PC 端图表
 * @param {React.Component} aism - 移动端图表
 */
var isMobile = exports.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function autoSelect(aisc, aism) {
  if (!isMobile || !aism) {
    return aisc;
  }
  return aism;
}