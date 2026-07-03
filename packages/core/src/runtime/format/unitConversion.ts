import { numberDecimal } from './numberFormat';

export type ValueType =
  | 'number'
  | 'disk_1000'
  | 'disk_1024'
  | 'bandwidth_1000'
  | 'bandwidth_1024'
  | 'money'
  | 'dollar'
  | 'percent_1'
  | 'percent_100'
  | 'time'
  | 'date'
  | 'count'
  | 'counts'
  | 'custom';

const decimalStorageUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
const decimalBandwidthUnits = ['B/S', 'KB/S', 'MB/S', 'GB/S', 'TB/S', 'PB/S', 'EB/S', 'ZB/S'];
const binaryStorageUnits = ['BYTE', 'KIB', 'MIB', 'GIB', 'TIB', 'PIB', 'EIB', 'ZIB'];
const binaryBandwidthUnits = ['BYTE/S', 'KIB/S', 'MIB/S', 'GIB/S', 'TIB/S', 'PIB/S', 'EIB/S', 'ZIB/S'];

export const unitMap: Record<string, string[]> = {
  number: [],
  disk_1000: decimalStorageUnits,
  disk_1024: binaryStorageUnits,
  bandwidth_1000: decimalBandwidthUnits,
  bandwidth_1024: binaryBandwidthUnits,
  money: ['¥'],
  dollar: ['$'],
  percent_1: ['%'],
  percent_100: ['%'],
  count: ['counts', 'k', 'm', 'b'],
  counts: ['counts', 'k', 'm', 'b'],
  time: ['ps', 'ns', 'μs', 'ms', 's'],
  date: ['ms', 's', 'm', 'h', 'days', 'weeks', 'months', 'years'],
};

export interface UnitConversionResult {
  value: string | number | unknown;
  unit: string;
}

export function findUnitArray(input: string | undefined, valueType?: string): string[] {
  if (!input) {
    return [];
  }

  if (valueType) {
    const unitArray = unitMap[valueType];
    return unitArray?.includes(input) ? unitArray : [];
  }

  const matchedKey = Object.keys(unitMap).find((unitType) => unitMap[unitType].includes(input));
  return matchedKey ? unitMap[matchedKey] : [];
}

function convertDateUnit(
  value: number,
  unit?: 'ms' | 's' | 'm' | 'h' | 'days' | 'weeks' | 'months' | 'years',
  decimal?: number,
): UnitConversionResult {
  const currentUnit = !unit || !unitMap.date.includes(unit) ? 'ms' : unit;
  const conversions = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    years: 365 * 24 * 60 * 60 * 1000,
  };

  let resultValue = currentUnit === 'ms' ? value : value * conversions[currentUnit];
  let resultUnit: string = currentUnit;

  if (resultValue >= conversions.years) {
    resultValue = numberDecimal(resultValue / conversions.years, decimal) as number;
    resultUnit = 'y';
  } else if (resultValue >= conversions.months) {
    resultValue = numberDecimal(resultValue / conversions.months, decimal) as number;
    resultUnit = 'months';
  } else if (resultValue >= conversions.weeks) {
    resultValue = numberDecimal(resultValue / conversions.weeks, decimal) as number;
    resultUnit = 'weeks';
  } else if (resultValue >= conversions.days) {
    resultValue = numberDecimal(resultValue / conversions.days, decimal) as number;
    resultUnit = 'days';
  } else if (resultValue >= conversions.h) {
    resultValue = numberDecimal(resultValue / conversions.h, decimal) as number;
    resultUnit = 'h';
  } else if (resultValue >= conversions.m) {
    resultValue = numberDecimal(resultValue / conversions.m, decimal) as number;
    resultUnit = 'm';
  } else if (resultValue >= conversions.s) {
    resultValue = numberDecimal(resultValue / conversions.s, decimal) as number;
    resultUnit = 's';
  } else {
    resultUnit = 'ms';
  }

  return { value: resultValue, unit: resultUnit };
}

function normalizeUnit(unit: string | undefined, valueType: string | undefined): string | undefined {
  if (!unit) {
    return valueType ? unitMap[valueType]?.[0] : unit;
  }

  if (valueType && ['disk_1000', 'disk_1024', 'bandwidth_1000', 'bandwidth_1024'].includes(valueType)) {
    return unit.toUpperCase();
  }

  if (valueType === 'time') {
    return unit;
  }

  return unit.toLowerCase();
}

export function unitConversion(
  originValue: unknown,
  unit?: string,
  decimal?: number,
  unitTransformTo?: string,
  valueType?: ValueType | string,
  customCarryUnits?: string | string[],
  customCarryThreshold?: number,
  addonTextAfter?: string,
): UnitConversionResult {
  const isNegative = Number(originValue) < 0;
  let value = Math.abs(Number(originValue));
  const suffixUnit = addonTextAfter || '';

  if (valueType === 'custom') {
    const threshold = customCarryThreshold || 1000;
    const units = typeof customCarryUnits === 'string'
      ? customCarryUnits.split(',')
      : customCarryUnits || ['', 'k', 'm', 'b'];
    const currentUnit = unit || units[0] || '';
    let unitIndex = Math.max(0, units.indexOf(currentUnit));

    while (value >= threshold && unitIndex < units.length - 1) {
      value /= threshold;
      unitIndex += 1;
    }

    const finalValue = numberDecimal(value, decimal);
    return {
      value: typeof finalValue === 'number' ? (isNegative ? -finalValue : finalValue) : '-',
      unit: `${units[unitIndex] || ''}${suffixUnit}`,
    };
  }

  if (valueType === 'date') {
    const result = convertDateUnit(
      value,
      unit as 'ms' | 's' | 'm' | 'h' | 'days' | 'weeks' | 'months' | 'years' | undefined,
      decimal,
    );
    return {
      value: typeof result.value === 'number' ? (isNegative ? -result.value : result.value) : '-',
      unit: `${result.unit}${suffixUnit}`,
    };
  }

  const unitType = valueType || 'number';
  const currentUnit = normalizeUnit(unit, unitType);
  const units = findUnitArray(currentUnit, unitType);
  let finalUnit = unit || '';
  const threshold = unitType.includes('1024') ? 1024 : 1000;
  let unitIndex = units.indexOf(currentUnit || '');

  if (unitIndex === -1) {
    return { value: originValue, unit: `${unit || ''}${suffixUnit}` };
  }

  if (unitTransformTo) {
    const targetUnit = ['disk_1000', 'disk_1024', 'bandwidth_1000', 'bandwidth_1024'].includes(unitType)
      ? unitTransformTo.toUpperCase()
      : unitTransformTo.toLowerCase();
    const targetUnitIndex = units.indexOf(targetUnit);

    if (targetUnitIndex === -1 || unitIndex === targetUnitIndex) {
      return { value: originValue, unit: `${unit || ''}${suffixUnit}` };
    }

    const distance = Math.abs(unitIndex - targetUnitIndex);
    value = unitIndex > targetUnitIndex ? value * threshold ** distance : value / threshold ** distance;
    finalUnit = unitTransformTo;
  } else {
    while (value >= threshold && unitIndex < units.length - 1) {
      value /= threshold;
      unitIndex += 1;
    }
    finalUnit = units[unitIndex];
  }

  if (unitType === 'count' && finalUnit === 'counts') {
    finalUnit = '';
  }

  const finalValue = numberDecimal(value, decimal);
  return {
    value: typeof finalValue === 'number' ? (isNegative ? -finalValue : finalValue) : '-',
    unit: `${finalUnit}${suffixUnit}`,
  };
}
