export { beautifyNumber, isInvalidNumber, numberDecimal } from '../format';

type PrimitiveTokenValue = string | number | string[] | undefined | null;

export function pxToNumber(value: PrimitiveTokenValue, fallback = 0): number {
  if (value === undefined || value === null || value === '' || Array.isArray(value)) {
    return fallback;
  }
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number(value.replace('px', ''));
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function toNumber(value: PrimitiveTokenValue, fallback = 0): number {
  if (value === undefined || value === null || value === '' || Array.isArray(value)) {
    return fallback;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function toStringValue(value: PrimitiveTokenValue, fallback = ''): string {
  if (value === undefined || value === null || value === '' || Array.isArray(value)) {
    return fallback;
  }
  return String(value);
}
