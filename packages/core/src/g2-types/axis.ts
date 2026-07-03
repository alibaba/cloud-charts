/**
 * G2 v5 Axis Spec — re-export 上游真实类型 + 业务字段放宽。
 *
 * G2 v5 AxisOptions 来自 @antv/g2/lib/component/axis，字段级样式由 @antv/component 提供。
 * 字段链路（IDE Cmd+Click 跳转）：
 *   spec.tickLength → AxisOptions.tickLength
 *   spec.labelFontSize / labelFill / lineStroke 等 → @antv/component 的 axis types
 */

export type { AxisOptions } from '@antv/g2/lib/component/axis';

import type { AxisOptions } from '@antv/g2/lib/component/axis';

/**
 * 我们 normalizeAxis 输出的 spec 形态。
 * 大部分字段直接来自 G2 AxisOptions，labelFormatter 等回调放宽以兼容业务写法。
 *
 * AxisOptions 自身已是 [key: string]: any，所以放宽不影响 IDE 提示。
 */
export type AxisSpec = Partial<Omit<AxisOptions, 'labelFormatter' | 'tickFormatter'>> & {
  /** G2 真实类型 (datum, index, array) => string；业务回调返回 unknown 也常见。 */
  labelFormatter?: (...args: unknown[]) => unknown;
  tickFormatter?: (...args: unknown[]) => unknown;
  /** 我们 axis spec 还携带 breaks（G2 5.4+ 断轴），axisBreaksShape 自定义 shape。 */
  breaks?: Array<Record<string, unknown>>;
  /** 兼容 G2 [key: string]: any 扩展。 */
  [key: string]: unknown;
};
