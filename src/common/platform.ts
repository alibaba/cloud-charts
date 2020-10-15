/**
 * 根据props和ua判断是否为移动端
 *
 * @param {Object} props - 组件props
 */
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

interface MobileProps {
  isMobile?: boolean;
}

export function isMobileWithProps(props: MobileProps) {
  return !!(props.isMobile || (props.isMobile !== false && isMobile));
}
