import type { ChartModel, ChartRuntimeContext } from '../runtime/types';
import type { LineSeries } from './line';
import { createLineModel } from './lineModel';
import type { MinilineChartConfig } from './minilineDefaultConfig';
import { getMinilineDefaultConfig } from './minilineDefaultConfig';
import { deepMerge } from '../runtime/rules/merge';

export interface CreateMinilineModelInput {
  data: LineSeries[];
  config?: MinilineChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 迷你折线图：内部复用 createLineModel，仅改 chartName + 注入 miniline 默认配置（无 axis/legend/tooltip）。
 * 旧版 src/Wminiline 通过 extends Line 覆盖 chartName + getDefaultConfig。
 */
export function createMinilineModel(input: CreateMinilineModelInput): ChartModel {
  const mergedConfig = deepMerge(
    getMinilineDefaultConfig() as Record<string, unknown>,
    (input.config ?? {}) as Record<string, unknown>,
  ) as MinilineChartConfig;
  return createLineModel({
    data: input.data,
    config: mergedConfig as never,
    context: input.context,
  });
}
