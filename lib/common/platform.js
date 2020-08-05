"use strict";

exports.__esModule = true;
exports.isMobileWithProps = isMobileWithProps;
/**
 * 根据props和ua判断是否为移动端
 *
 * @param {Object} props - 组件props
 */
var isMobile = exports.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function isMobileWithProps(props) {
  return !!(props.isMobile || props.isMobile !== false && isMobile);
}