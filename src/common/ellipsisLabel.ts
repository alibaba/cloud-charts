import { IElement } from '@antv/g-base';
import { ext, vec3 } from '@antv/matrix-util';
import { containsChinese, pxToNumber } from '../common/common';
import themes from '../themes';

const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point: { x: number; y: number }, angle: number, matrix = identityMatrix): number[] {
  if (!angle) {
    // 角度为 0 或者 null 时返回 null
    return null;
  }
  const m = ext.transform(matrix, [
    ['t', -point.x, -point.y],
    ['r', angle],
    ['t', point.x, point.y],
  ]);
  return m;
}

/**
 * 判断两个数值 是否接近
 * - 解决精度问题（由于无法确定精度上限，根据具体场景可传入 精度 参数）
 */
export const near = (x: number, y: number, e = Number.EPSILON ** 0.5): boolean =>
  [x, y].includes(Infinity) ? Math.abs(x) === Math.abs(y) : Math.abs(x - y) < e;

// 从矩阵获取旋转的角度
export function getAngleByMatrix(
  matrix: [number, number, number, number, number, number, number, number, number],
): number {
  const xVector: [number, number, number] = [1, 0, 0];
  const out: [number, number, number] = [0, 0, 0];
  vec3.transformMat3(out, xVector, matrix);
  return Math.atan2(out[1], out[0]);
}

// 文本是否旋转
function isRotate(label: IElement) {
  const matrix = label.attr('matrix');
  return matrix && matrix[0] !== 1; // 仅在这个场景下判定
}

function getRotateAngle(label: IElement) {
  const angle = isRotate(label) ? getAngleByMatrix(label.attr('matrix')) : 0;
  return angle % 360;
}

// 是否重叠
export function isOverlap(isVertical: boolean, first: IElement, second: IElement, minGap: number) {
  let overlap = false;
  const angle = getRotateAngle(first);
  const distance = isVertical
    ? Math.abs(second.attr('y') - first.attr('y'))
    : Math.abs(second.attr('x') - first.attr('x'));
  const prevBBox = (isVertical ? second.attr('y') > first.attr('y') : second.attr('x') > first.attr('x'))
    ? first.getBBox()
    : second.getBBox();

  const firstBBox = first.getBBox();
  const secondBBox = second.getBBox();

  // 最大重叠尺寸
  let overlapMaxGap = 0;

  if (isVertical) {
    const ratio = Math.abs(Math.cos(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      overlap = prevBBox.width + minGap > distance;
    } else {
      overlap = prevBBox.height / ratio + minGap > distance;
    }
  } else {
    const ratio = Math.abs(Math.sin(angle));
    if (near(ratio, 0, Math.PI / 180)) {
      overlapMaxGap = Math.max(firstBBox.width / 2 + secondBBox.width / 2 - distance, overlapMaxGap);
      // console.log(firstBBox, secondBBox, distance)
      overlap = prevBBox.width + minGap > distance;
    } else {
      overlap = prevBBox.height / ratio + minGap > distance;
    }
  }

  return {
    isOverlap: overlap,
    maxGap: overlapMaxGap,
  };
}

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
  ellipsisType: 'head' | 'middle' | 'tail' = 'middle',
  hasCustom: boolean = false,
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

  let adjustEllipsisType = themes['widgets-global-axis-label-ellipsisType'];
  // 在包含中文且用户没有自定义省略方式的情况下，默认使用尾省略
  if (hasCustom) {
    adjustEllipsisType = ellipsisType;
  } else if (!hasCustom && containsChinese(text.toString())) {
    adjustEllipsisType = 'tail';
  }
  // 页面统一省略方式
  themes.setTheme(
    {
      'widgets-global-axis-label-ellipsisType': adjustEllipsisType,
    },
    false,
  );

  if (adjustEllipsisType === 'tail') {
    let leftStr = '';
    for (let index = 1; index <= length; index++) {
      const currentStr = str.slice(0, index);
      if (calcTextWidth(currentStr, font) >= leftWidth) {
        break;
      }
      leftStr = currentStr;
    }
    return `${leftStr}${ellipsisText}`;
  } else if (adjustEllipsisType === 'head') {
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
  const {
    fontSize = pxToNumber(themes['widgets-font-size-1']),
    fontFamily = themes['widgets-font-family-txd-m-number'],
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontVariant = 'normal',
  } = font || {};
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
  }
  ctx!.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
  return ctx!.measureText(text).width;
}
