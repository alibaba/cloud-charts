type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 轻量深合并，复现旧代码 lodash.merge 的对象递归合并行为，避免在 core 引入 lodash。 */
export function deepMerge<T extends PlainObject>(target: T, source?: PlainObject): T {
  if (!source) {
    return { ...target };
  }

  const result: PlainObject = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  });

  return result as T;
}
