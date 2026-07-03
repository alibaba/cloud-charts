export function containsChinese(value: string): boolean {
  return /[\u4e00-\u9fa5]/.test(value);
}
