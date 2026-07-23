import { CORE_PKG, REACT_PKG } from '../registry.mjs';

/**
 * 源码复制模式下的 import 改写。
 * 把对 @alicloud/cloud-charts-core 的引用改写为用户项目里的 core 别名（config.aliases.core）。
 * 组件间相对 import（../../hooks/...）保持不变——因为复制时保留了 react/src 的目录结构。
 *
 * @param {string} content 源文件内容
 * @param {{coreAlias:string}} opts
 */
export function rewriteImports(content, { coreAlias }) {
  // 匹配 from '@alicloud/cloud-charts-core' 及其子路径
  const escaped = CORE_PKG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(['"])${escaped}(/[^'"]*)?\\1`, 'g');
  return content.replace(re, (_m, q, sub = '') => `${q}${coreAlias}${sub || ''}${q}`);
}

/**
 * 判断文件是否需要 import 改写（仅 ts/tsx/js/jsx/mjs）。
 */
export function isCodeFile(name) {
  return /\.(tsx?|jsx?|mjs)$/.test(name);
}

export { CORE_PKG, REACT_PKG };
