import { isInvalidNumber } from '../format';

export type PlainObject = Record<string, unknown>;

export const propertyMap = {
  axis: [
    'type',
    'showLast',
    'alias',
    'sync',
    'mask',
    'base',
    'exponent',
    'values',
    'range',
    'min',
    'max',
    'minLimit',
    'maxLimit',
    'nice',
    'ticks',
    'tickMethod',
    'tickCount',
    'maxTickCount',
    'tickInterval',
    'minTickInterval',
    'formatter',
  ],
};

const numericPropertyTypes: Record<string, 'number'> = {
  min: 'number',
  max: 'number',
  minLimit: 'number',
  maxLimit: 'number',
  tickCount: 'number',
};

export function propertyAssign(keys: string[], target: PlainObject, source: PlainObject | false | undefined): PlainObject {
  if (!source) {
    return target;
  }

  keys.forEach((key) => {
    const sourceValue = source[key];
    if (sourceValue === undefined || (key === 'tickCount' && sourceValue === 'auto')) {
      return;
    }

    if (numericPropertyTypes[key] !== 'number') {
      target[key] = sourceValue;
      return;
    }

    if (sourceValue === null) {
      target[key] = null;
      return;
    }

    if (!isInvalidNumber(sourceValue)) {
      target[key] = Number(sourceValue);
    }
  });

  return target;
}

export function filterKey<T extends PlainObject>(object: T, keys: string[]): Partial<T> {
  const result: Partial<T> = {};
  Object.keys(object).forEach((key) => {
    if (!keys.includes(key)) {
      result[key as keyof T] = object[key] as T[keyof T];
    }
  });
  return result;
}
