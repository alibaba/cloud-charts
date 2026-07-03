import { beautifyNumber, isInvalidNumber, numberDecimal } from './numberFormat';
import { unitConversion, type ValueType } from './unitConversion';

export interface ValueFormatConfig {
  unit?: string;
  decimal?: number;
  grouping?: boolean | string;
  needUnitTransform?: boolean;
  unitTransformTo?: string;
  valueType?: ValueType | string;
  hideZeroUnit?: boolean;
  customCarryUnits?: string | string[];
  customCarryThreshold?: number;
  addonTextAfter?: string;
}

export type ValueFormatter = (value: unknown, ...args: unknown[]) => unknown;

export function hasFormatConfig(config?: ValueFormatConfig | null): boolean {
  if (!config) {
    return false;
  }

  return Boolean(
    config.unit ||
      config.decimal !== undefined ||
      config.grouping ||
      config.needUnitTransform ||
      config.valueType ||
      config.unitTransformTo ||
      config.addonTextAfter,
  );
}

export function createValueFormatter(config?: ValueFormatConfig | null): ValueFormatter | undefined {
  const formatConfig = config || {};
  const {
    unit,
    decimal = 1,
    grouping = true,
    needUnitTransform,
    unitTransformTo,
    valueType,
    hideZeroUnit = false,
    customCarryUnits = [],
    customCarryThreshold,
    addonTextAfter = '',
  } = formatConfig;

  if (!hasFormatConfig(formatConfig)) {
    return undefined;
  }

  return (value: unknown) => {
    if (typeof value === 'string' && value.startsWith('widgets-pad-')) {
      return '';
    }

    let result = value;
    let resultUnit = unit || '';

    if (isInvalidNumber(value)) {
      return `${value ?? ''}${resultUnit}`;
    }

    if (needUnitTransform && (unit || valueType)) {
      let transformValue = Number(result);
      if (valueType === 'percent_1') {
        transformValue *= 100;
      }

      const conversionResult = unitConversion(
        transformValue,
        unit,
        decimal,
        unitTransformTo,
        valueType,
        customCarryUnits,
        customCarryThreshold,
        addonTextAfter,
      );

      result = conversionResult.value;
      resultUnit = conversionResult.unit;

      if (valueType === 'count' && resultUnit === 'counts') {
        resultUnit = '';
      }
    }

    result = numberDecimal(result, decimal);

    if (grouping || ['money', 'dollar', 'count'].includes(String(valueType))) {
      result = beautifyNumber(result, typeof grouping === 'boolean' ? ',' : grouping);
    }

    if (hideZeroUnit && Number(result) === 0) {
      resultUnit = '';
    }

    return ['money', 'dollar'].includes(String(valueType)) ? `${resultUnit}${result}` : `${result}${resultUnit}`;
  };
}

export function customFormatter(config?: ValueFormatConfig | null): ValueFormatter | null {
  return createValueFormatter(config) || null;
}

export function formatValue(value: unknown, config?: ValueFormatConfig | null): unknown {
  const formatter = createValueFormatter(config);
  return formatter ? formatter(value) : value;
}

export function resolveValueFormatter(
  explicitFormatter?: ValueFormatter,
  config?: ValueFormatConfig | null,
): ValueFormatter | undefined {
  return explicitFormatter || createValueFormatter(config);
}

export { beautifyNumber, isInvalidNumber, numberDecimal } from './numberFormat';
export { findUnitArray, unitConversion, unitMap } from './unitConversion';
export type { UnitConversionResult, ValueType } from './unitConversion';
