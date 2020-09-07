/**
 * 根据props和ua判断是否为移动端
 *
 * @param {Object} props - 组件props
 */
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function isMobileWithProps(props) {
  return !!(props.isMobile || (props.isMobile !== false && isMobile));
}
