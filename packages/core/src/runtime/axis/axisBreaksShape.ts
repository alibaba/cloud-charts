const BREAKS_GAP = 0.03;

const DEFAULT_STYLE = {
  fill: '#fff',
  stroke: '#aaa',
  lineDash: [4, 3],
  lineWidth: 0.5,
  fillOpacity: 1,
  strokeOpacity: 1,
};

const PADDING = 0;

/**
 * Create path points and corresponding clip paths.
 * Mirrors G2's internal AxisBreaks shape logic, but avoids importing
 * @antv/g directly so it can live in packages/core without extra deps.
 */
const createPathPoints = (
  y: number,
  width: number,
  offset: number,
  vertices: number,
  isLowerBoundary: boolean,
  lineWidth: number,
) => {
  const pathPoints: string[] = [];
  const clipPoints: string[] = [];
  const segments = vertices - 1;

  for (let i = 1; i < segments; i++) {
    const x = (i / segments) * width;
    const offsetY = y + (i % 2 === 0 ? offset : -offset);

    pathPoints.push(`${x},${offsetY}`);
    clipPoints.push(`${x},${isLowerBoundary ? offsetY - lineWidth : offsetY + lineWidth}`);
  }

  // Ensure last point reaches width.
  pathPoints.push(`${width},${y}`);
  clipPoints.push(`${width + lineWidth},${y}`);

  return [pathPoints, clipPoints] as const;
};

/**
 * Custom G2 v5 shape for Y-axis break indicators.
 *
 * The built-in `shape.break` bails out when `scale.x.sortedDomain` is empty,
 * which happens for continuous X axes (time/linear). This implementation
 * drops that check and draws the break wavy lines across the full plot width
 * regardless of the X scale type.
 */
export function customAxisBreaksShape(_: unknown, params: any) {
  const { context, selection, view } = params;
  const layer = selection.select('.plot').node();
  const { document } = context.canvas;

  return (option: any) => {
    const {
      key,
      start,
      end,
      gap = BREAKS_GAP,
      vertices = 50,
      lineWidth = 0.5,
      verticeOffset = 3,
      ...style
    } = option;

    const g = document.createElement('g', {
      id: `break-group-${key}`,
      className: 'axis-breaks-group',
    });

    if (!layer) return g;

    const yScale = view.scale?.y?.getOptions?.();
    if (!yScale) return g;

    const { range, domain } = yScale;
    const startIndex = domain.indexOf(start);
    const endIndex = domain.indexOf(end);
    const { width: plotWidth, height: plotHeight } = layer.getBBox();

    if (startIndex === -1 || endIndex === -1 || !plotHeight) return g;

    const reverse = range[0] > range[1];
    const lowerY = range[startIndex] * plotHeight;
    const upperY = range[endIndex] * plotHeight;

    let linePath = '';
    let clipPath = '';

    for (const [boundaryIndex, { y, isLower }] of [
      { y: upperY, isLower: false },
      { y: lowerY, isLower: true },
    ].entries()) {
      const clipOffset = reverse ? lineWidth : -lineWidth;
      const [pathPoints, clipPoints] = createPathPoints(
        y,
        plotWidth - PADDING,
        verticeOffset,
        vertices,
        isLower,
        clipOffset,
      );

      if (boundaryIndex === 0) {
        linePath = `M ${PADDING},${y} L ${pathPoints.join(' L ')} `;
        clipPath = `M ${PADDING - lineWidth},${y + clipOffset} L ${clipPoints.join(' L ')} `;
      } else {
        linePath += `L ${plotWidth - PADDING},${y} L ${[...pathPoints]
          .reverse()
          .join(' L ')} L ${PADDING},${y} Z`;
        clipPath += `L ${plotWidth - PADDING + lineWidth + 2},${y - clipOffset} L ${[
          ...clipPoints,
        ]
          .reverse()
          .join(' L ')} L ${PADDING - lineWidth},${y - clipOffset} Z`;
      }
    }

    const pathAttrs = { ...DEFAULT_STYLE, ...style };

    try {
      const path1 = document.createElement('path', {
        style: { ...pathAttrs, d: linePath },
      });
      const path2 = document.createElement('path', {
        style: { ...pathAttrs, d: clipPath, lineWidth: 0, cursor: 'pointer' },
      });
      g.appendChild(path1);
      g.appendChild(path2);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to create break path:', e);
    }

    return g;
  };
}

(customAxisBreaksShape as any).props = {};
