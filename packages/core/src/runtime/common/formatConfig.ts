export interface AxisFormatConfig {
  needUnitTransform?: boolean;
  unit?: string;
  unitTransformTo?: string;
  valueType?: string;
  customCarryUnits?: string | string[];
  customCarryThreshold?: number;
  addonTextAfter?: string;
  grouping?: boolean | string;
  decimal?: number;
  [key: string]: unknown;
}

export interface LegendFormatConfig extends AxisFormatConfig {}

export interface ChartFormatConfig {
  yAxis?: AxisFormatConfig | AxisFormatConfig[] | false;
  legend?: LegendFormatConfig | boolean;
  [key: string]: unknown;
}

export function getFormatConfig(config: ChartFormatConfig): AxisFormatConfig | AxisFormatConfig[] {
  const yAxisConfig = config.yAxis;
  const legendConfig = config.legend;

  if (
    yAxisConfig &&
    typeof yAxisConfig === 'object' &&
    !Array.isArray(yAxisConfig) &&
    yAxisConfig.needUnitTransform &&
    typeof legendConfig === 'object' &&
    legendConfig.needUnitTransform === undefined
  ) {
    legendConfig.needUnitTransform = legendConfig.needUnitTransform ?? yAxisConfig.needUnitTransform;
    legendConfig.unit = legendConfig.unit ?? yAxisConfig.unit;
    legendConfig.unitTransformTo = legendConfig.unitTransformTo ?? yAxisConfig.unitTransformTo;
    legendConfig.valueType = legendConfig.valueType ?? yAxisConfig.valueType;
    legendConfig.customCarryUnits = legendConfig.customCarryUnits ?? yAxisConfig.customCarryUnits;
    legendConfig.customCarryThreshold = legendConfig.customCarryThreshold ?? yAxisConfig.customCarryThreshold;
    legendConfig.addonTextAfter = legendConfig.addonTextAfter ?? yAxisConfig.addonTextAfter;
  }

  if (typeof legendConfig === 'object') {
    const primaryYAxisConfig = Array.isArray(yAxisConfig) ? yAxisConfig[0] : yAxisConfig;
    const primaryFormatConfig =
      primaryYAxisConfig && typeof primaryYAxisConfig === 'object' ? primaryYAxisConfig : undefined;
    legendConfig.grouping = legendConfig.grouping ?? primaryFormatConfig?.grouping;
    legendConfig.decimal = legendConfig.decimal ?? primaryFormatConfig?.decimal;
  }

  if (
    typeof legendConfig === 'object' &&
    (legendConfig.valueType ||
      legendConfig.unit ||
      legendConfig.needUnitTransform ||
      legendConfig.unitTransformTo ||
      legendConfig.decimal)
  ) {
    return legendConfig;
  }

  if (Array.isArray(yAxisConfig) && yAxisConfig.length >= 2) {
    return yAxisConfig;
  }
  if (Array.isArray(yAxisConfig)) {
    return yAxisConfig[0] ?? {};
  }
  return yAxisConfig || {};
}
