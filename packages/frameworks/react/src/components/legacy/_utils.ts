export const PrefixName = 'cloud-charts';
export const FullCrossName = `widgets-${PrefixName}`;

export type Status = 'error' | 'warning' | 'normal' | 'success' | 'none';

export type ChartData = any;

const statusColorNameMap: Record<string, string> = {
  error: 'red',
  warning: 'orange',
  normal: 'normal',
  success: 'green',
  none: 'gray',
  primary: 'primary',
  blue: 'blue',
};

export function getStatusColorName(status: string | undefined): string {
  return statusColorNameMap[status || 'normal'] || status || 'normal';
}

export function warn(chartName: string, message: string): void {
  if (typeof console !== 'undefined') console.warn(`[${chartName}] ${message}`);
}

export function chartLog(_chartName: string, _action: string): void {
  // Minimal logging stub for legacy components - no-op in production
}

export function isMobile(): boolean {
  return typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export interface MobileProps {
  isMobile?: boolean;
}

export function isMobileWithProps(props: MobileProps): boolean {
  return !!(props.isMobile || (props.isMobile !== false && isMobile()));
}
