import { pxToNumber } from './number';

export const requestAnimationFrame: typeof globalThis.requestAnimationFrame | undefined =
  typeof globalThis !== 'undefined' ? globalThis.requestAnimationFrame : undefined;

export function getParentSize(element: HTMLElement | undefined | null, width?: number | string, height?: number | string): [number, number] {
  let resolvedWidth: number | string = width || '';
  let resolvedHeight: number | string = height || '';
  const parent = element?.parentElement?.parentElement;

  if (parent && typeof window !== 'undefined') {
    const parentStyle = window.getComputedStyle(parent);
    const paddingTop = pxToNumber(parentStyle.getPropertyValue('padding-top'));
    const paddingRight = pxToNumber(parentStyle.getPropertyValue('padding-right'));
    const paddingBottom = pxToNumber(parentStyle.getPropertyValue('padding-bottom'));
    const paddingLeft = pxToNumber(parentStyle.getPropertyValue('padding-left'));

    if (!width) {
      resolvedWidth = parent.clientWidth - paddingLeft - paddingRight;
    }
    if (!height) {
      resolvedHeight = parent.clientHeight - paddingTop - paddingBottom;
    }
  }

  return [Number(resolvedWidth), Number(resolvedHeight)];
}
