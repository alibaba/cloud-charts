import type { ExtremeDataOutput, RuleProcessParams } from './types';

function isForceExtreme(force: RuleProcessParams['force']): boolean {
  return force === true || (typeof force === 'object' && force?.extreme === true);
}

/** 线图极端数据处理，复现旧 rule/extremeData.ts 的 processLineExtremeData。 */
export function processLineExtremeData(params: RuleProcessParams): ExtremeDataOutput {
  const { config, data } = params;
  const dataPoints = Array.isArray(data) ? data : [];
  const dataSize = dataPoints.length;

  const lineCount = new Set(dataPoints.map((item) => item.type)).size;
  const yAxis = (config?.yAxis as Record<string, unknown>) || {};
  const firstY = dataPoints[0]?.y;

  let isEqual = false;
  if (lineCount === 1) {
    const baseline = dataPoints[0]?.y;
    const differs = dataPoints.filter((item) => item.y !== baseline);
    if (!differs.length && baseline !== null && baseline !== undefined) {
      isEqual = true;
    }
  }

  const numericFirstY = typeof firstY === 'number' ? firstY : 0;

  if (lineCount === 1 && dataSize === 1) {
    if (isForceExtreme(params.force)) {
      return { isExtreme: true };
    }
    return {
      isExtreme: true,
      config: {
        yAxis: {
          ...yAxis,
          min: numericFirstY > 0 ? 0 : numericFirstY * 2,
          max: numericFirstY > 0 ? numericFirstY * 2 : 0,
        },
        label: {
          labelFormatter: yAxis.labelFormatter,
          ...(typeof config?.label === 'object' ? (config.label as Record<string, unknown>) : {}),
          visible: true,
        },
        symbol: {
          ...(typeof config?.symbol === 'object' ? (config.symbol as Record<string, unknown>) : {}),
          visible: true,
        },
      },
    };
  }

  if (dataSize === lineCount) {
    if (isForceExtreme(params.force)) {
      return { isExtreme: true };
    }
    return {
      isExtreme: true,
      config: {
        symbol: {
          ...(typeof config?.symbol === 'object' ? (config.symbol as Record<string, unknown>) : {}),
          visible: true,
        },
      },
    };
  }

  if (lineCount === 1 && dataSize === 2) {
    if (isForceExtreme(params.force)) {
      return { isExtreme: true };
    }
    return {
      isExtreme: true,
      config: {
        label: {
          labelFormatter: yAxis.labelFormatter,
          ...(typeof config?.label === 'object' ? (config.label as Record<string, unknown>) : {}),
          visible: true,
        },
        symbol: {
          ...(typeof config?.symbol === 'object' ? (config.symbol as Record<string, unknown>) : {}),
          visible: true,
        },
        area: true,
      },
    };
  }

  if (lineCount === 1 && isEqual) {
    if (isForceExtreme(params.force)) {
      return { isExtreme: true };
    }
    return {
      isExtreme: true,
      config: {
        yAxis: {
          ...yAxis,
          min: numericFirstY > 0 ? 0 : numericFirstY * 2,
          max: numericFirstY > 0 ? numericFirstY * 2 : 0,
          tickCount: 3,
        },
      },
    };
  }

  if (lineCount > 3 && !config?.stack && config?.area) {
    if (isForceExtreme(params.force)) {
      return { isExtreme: true };
    }
    return {
      isExtreme: true,
      config: { area: false },
    };
  }

  return { isExtreme: false };
}
