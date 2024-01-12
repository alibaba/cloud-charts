/**
 * 计算省略后的文本
 * @param text 原文本
 * @param maxWidth 最大宽度
 * @param font 字体样式
 * @param ellipsisText 省略文本
 * @param ellipsisType 省略方式，头/中间/尾
 */
export default function ellipsisLabel(
  text: string | number,
  maxWidth: number,
  font?: any,
  ellipsisText: string = '...',
  ellipsisType: 'head' | 'middle' | 'tail' = 'tail',
) {
  const str = typeof text !== 'string' ? text.toString() : text;
  const PLACEHOLDER_WIDTH = calcTextWidth(ellipsisText, font);

  if (PLACEHOLDER_WIDTH >= maxWidth) {
    return ellipsisText;
  }
  if (calcTextWidth(str, font) <= maxWidth) {
    return text;
  }

  const leftWidth = maxWidth - PLACEHOLDER_WIDTH;
  const length = str.length;

  if (ellipsisType === 'tail') {
    let leftStr = '';
    for (let index = 1; index <= length; index++) {
      const currentStr = str.slice(0, index);
      if (calcTextWidth(currentStr, font) >= leftWidth) {
        break;
      }
      leftStr = currentStr;
    }
    return `${leftStr}${ellipsisText}`;
  } else if (ellipsisType === 'head') {
    let leftStr = '';
    for (let index = length - 1; index >= 0; index--) {
      const currentStr = str.slice(index, length);
      if (calcTextWidth(currentStr, font) >= leftWidth) {
        break;
      }
      leftStr = currentStr;
    }
    return `${ellipsisText}${leftStr}`;
  } else {
    let left = '';
    let right = '';
    for (let index = 1; index < Math.floor(length / 2); index++) {
      const currentLeft = str.slice(0, index);
      const currentRight = str.slice(length - index, length);
      if (calcTextWidth(`${currentLeft}${currentRight}`, font) >= leftWidth) {
        break;
      }
      left = currentLeft;
      right = currentRight;
    }
    return `${left}${ellipsisText}${right}`;
  }
}

let ctx: CanvasRenderingContext2D = null;

export function calcTextWidth(text: string, font?: any) {
  const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = font;
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
  }
  ctx!.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
  return ctx!.measureText(text).width;
}
