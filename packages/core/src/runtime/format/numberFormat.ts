export function isInvalidNumber(value: unknown): boolean {
  return (
    Number.isNaN(Number(value)) ||
    !Number.isFinite(Number(value)) ||
    value === '' ||
    typeof value === 'object' ||
    /[A-Z]/.test(String(value))
  );
}

export function numberDecimal(value: unknown, decimal = 1): string | number | unknown {
  if (isInvalidNumber(value) || isInvalidNumber(decimal)) {
    return value;
  }

  const normalizedDecimal = Math.max(0, Math.round(Number(decimal)));
  const ratio = 10 ** normalizedDecimal;
  return Math.round(Number(value) * ratio) / ratio;
}

export function beautifyNumber(value: unknown, separator = ','): string | unknown {
  if (isInvalidNumber(value)) {
    return value;
  }

  const isNegative = Number(value) < 0;
  const numberParts = String(value).split('.');
  let integerPart = numberParts[0].replace('-', '');
  let result = '';

  while (integerPart.length > 3) {
    result = `${separator}${integerPart.slice(-3)}${result}`;
    integerPart = integerPart.slice(0, integerPart.length - 3);
  }

  if (integerPart) {
    result = `${integerPart}${result}`;
  }

  if (numberParts[1]) {
    result = `${result}.${numberParts[1]}`;
  }

  return isNegative ? `-${result}` : result;
}
