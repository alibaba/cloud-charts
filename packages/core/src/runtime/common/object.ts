type CommonPlainObject = Record<string, unknown>;

function isObjectLike(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

function isType(value: unknown, type: string): boolean {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isPlainObject(value: unknown): value is CommonPlainObject {
  if (!isObjectLike(value) || !isType(value, 'Object')) {
    return false;
  }

  let prototype = value;
  while (Object.getPrototypeOf(prototype) !== null) {
    prototype = Object.getPrototypeOf(prototype);
  }
  return Object.getPrototypeOf(value) === prototype;
}

function deepMergeAssign(target: CommonPlainObject, source: CommonPlainObject, level: number, maxLevel: number): void {
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (!sourceValue) {
      target[key] = sourceValue;
      return;
    }

    if (isPlainObject(sourceValue)) {
      if (!isPlainObject(target[key])) {
        target[key] = {};
      }
      if (level < maxLevel) {
        deepMergeAssign(target[key] as CommonPlainObject, sourceValue, level + 1, maxLevel);
      } else {
        target[key] = sourceValue;
      }
      return;
    }

    if (Array.isArray(sourceValue)) {
      target[key] = [...sourceValue];
      return;
    }

    target[key] = sourceValue;
  });
}

export function deepAssign<T extends CommonPlainObject>(result: T, ...sources: Array<CommonPlainObject | undefined | null>): T {
  sources.forEach((source) => {
    if (source) {
      deepMergeAssign(result, source, 0, 5);
    }
  });
  return result;
}
