import { BigDataJudgement, type BigDataJudgementConfig, type RuleConfigObject } from '../types';

/**
 * 极坐标家族（Pie / Nightingale / MultiCircle / MultiPie / Radar）通用 bigData 判断。
 * 旧版（src/rule/index.ts）三条 judgement：
 *   1. Polar threshold=100（半径过小）
 *   2. Number threshold（数据量过多，类目不同）
 * Number 阈值各图不同：Pie=20 / Nightingale=10 / MultiCircle=15 / MultiPie=20 / Radar=10
 */
export function polarBigDataJudgements(numberThreshold: number, polarMessage = '该极坐标图半径过小，会影响展示效果，建议加大图表尺寸'): BigDataJudgementConfig[] {
  return [
    { type: BigDataJudgement.Polar, threshold: 100, message: polarMessage },
    { type: BigDataJudgement.Number, threshold: numberThreshold, message: '数据量过多，会影响展示效果，建议减少数据量' },
  ];
}

/**
 * 笛卡尔简单家族（Box / Candlestick / Linebox / Scatter / Histogram 等）通用 bigData 判断。
 * 旧版各图一条 Length judgement，阈值 = 4 ~ 30 之间。
 */
export function cartesianBigDataJudgements(lengthThreshold: number, message = '数据过于密集，建议减少数据量或加大图表宽度'): BigDataJudgementConfig[] {
  return [{ type: BigDataJudgement.Length, threshold: lengthThreshold, message }];
}

/**
 * 笛卡尔图通用 appendPadding：根据 config.label / symbol / jitter 等给上下补留白。
 * 复现旧 src/rule/index.ts 中 line/bar/scatter/linebar 的 appendPadding 算法。
 *
 * @param config 当前 chart config 对象（直接读取 label / symbol / jitter / appendPadding 字段）
 * @param opts.labelKeys 哪些字段（例如 ['label']、['lineLabel','barLabel']）当真值时增加 padding
 * @param opts.symbolKey 启用时上下 padding +6（默认 'symbol'）
 * @param opts.skipJitter 当 config.jitter 为 true 时跳过补 padding
 * @returns 新 config（不可变更原对象）
 */
export function appendPaddingForCartesian(
  config: RuleConfigObject,
  opts: {
    labelKeys?: string[];
    symbolKey?: string;
    skipJitter?: boolean;
  } = {},
): RuleConfigObject {
  const { labelKeys = ['label'], symbolKey = 'symbol', skipJitter = false } = opts;
  if (skipJitter && config.jitter) {
    return config;
  }
  const hasLabel = labelKeys.some((k) => Boolean(config[k]));
  const hasSymbol = Boolean(config[symbolKey]);
  if (!hasLabel && !hasSymbol) return config;

  // 旧版：top 留 24（label）+ 6（symbol）；bottom 留 24（label）
  const top = (hasLabel ? 24 : 0) + (hasSymbol ? 6 : 0);
  const bottom = hasLabel ? 24 : 0;
  const existing = Array.isArray(config.appendPadding)
    ? (config.appendPadding as number[])
    : [0, 0, 0, 0];
  return {
    ...config,
    appendPadding: [
      Math.max(existing[0] ?? 0, top),
      existing[1] ?? 0,
      Math.max(existing[2] ?? 0, bottom),
      existing[3] ?? 0,
    ],
  };
}
