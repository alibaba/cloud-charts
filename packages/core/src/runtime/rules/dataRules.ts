import type { RuleConfigObject, RuleData, RuleProcessOutput } from './types';

/** 统一数据处理：根据数据小数位推断 decimal，复现旧 rule/dataRules.ts 的 runDataRules。 */
export function runDataRules(data: RuleData, config: RuleConfigObject): RuleProcessOutput {
  if (!Array.isArray(data)) {
    return { data, config };
  }

  const nextConfig: RuleConfigObject = { ...config };

  const valueList = data.map((item) => {
    const record = item as { y?: unknown; y0?: unknown; y1?: unknown };
    return record.y || record.y0 || record.y1;
  });

  let maxDecimals = 0;
  valueList.forEach((value) => {
    if (typeof value === 'number' && value.toString().includes('.')) {
      const fraction = value.toString().split('.')[1];
      const decimals = fraction ? fraction.length : 0;
      if (decimals > maxDecimals) {
        maxDecimals = decimals;
      }
    }
  });

  if (maxDecimals > 6) {
    maxDecimals = 6;
  }

  const yAxis = nextConfig.yAxis as Record<string, unknown> | unknown[] | undefined;
  const yAxisDecimal = !Array.isArray(yAxis) && yAxis ? (yAxis as Record<string, unknown>).decimal : undefined;

  if (!yAxisDecimal && !nextConfig.closeDataRules && maxDecimals !== 0) {
    nextConfig.decimal = maxDecimals;

    if (!Array.isArray(yAxis)) {
      if (yAxis) {
        nextConfig.yAxis = { ...(yAxis as Record<string, unknown>), decimal: maxDecimals };
      } else {
        nextConfig.yAxis = { decimal: maxDecimals };
      }
    }
  }

  return { data, config: nextConfig };
}
