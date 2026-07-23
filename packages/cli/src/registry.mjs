/**
 * cloud-charts 组件注册表（单一事实来源）。
 *
 * 每个组件条目描述：如何在不同框架下把源码复制到用户项目，或作为 npm 依赖安装。
 * - reactDir: packages/frameworks/react/src/charts/<dir>
 * - reactExport: 新 React 组件导出名（Bar / Line ...）
 * - vanillaPkg / vanillaDir: 单图 vanilla 包（Angular / Vue / 原生）
 * - compatDir: 旧版 <W*> 兼容层目录（legacy 源）
 * - core: 该组件在 packages/core/src/model 下的三件套（源码复制模式需一并带上）
 *
 * frameworks 字段表示该组件当前已实现的框架。vue 全局尚未实现。
 */

export const CORE_PKG = '@alicloud/cloud-charts-core';
export const REACT_PKG = '@alicloud/cloud-charts-react';
export const LEGACY_PKG = '@alicloud/cloud-charts';
export const G2_DEP = '@antv/g2';
export const G2_VERSION = '~5.4.8';

/** solid 已实现的图表 */
const SOLID_READY = new Set([
  'bar',
  'box',
  'candlestick',
  'funnel',
  'heatmap',
  'hexagonal',
  'hierarchy',
  'histogram',
  'line',
  'lineBar',
  'linebox',
  'lineScatter',
  'map',
  'miniline',
  'multiCircle',
  'nightingale',
  'pie',
  'radar',
  'rectangle',
  'sankey',
  'scatter',
  'sunburst',
  'treemap',
]);

/** id: 稳定短名（与 vanilla 目录一致，wbar/wline...） */
const CHARTS = [
  // id,            reactDir,      reactExport,   coreModel
  ['wbar', 'bar', 'Bar', 'bar'],
  ['wbox', 'box', 'Box', 'box'],
  ['wcandlestick', 'candlestick', 'Candlestick', 'candlestick'],
  ['wfunnel', 'funnel', 'Funnel', 'funnel'],
  ['wheatmap', 'heatmap', 'Heatmap', 'heatmap'],
  ['whexagonal', 'hexagonal', 'Hexagonal', 'hexagonal'],
  ['whierarchy', 'hierarchy', 'Hierarchy', 'hierarchy'],
  ['whistogram', 'histogram', 'Histogram', 'histogram'],
  ['wline', 'line', 'Line', 'line'],
  ['wlinebar', 'lineBar', 'LineBar', 'lineBar'],
  ['wlinebox', 'linebox', 'Linebox', 'linebox'],
  ['wlinescatter', 'lineScatter', 'LineScatter', 'lineScatter'],
  ['wmap', 'map', 'Map', 'map'],
  ['wminiline', 'miniline', 'Miniline', 'miniline'],
  ['wmulticircle', 'multiCircle', 'MultiCircle', 'multiCircle'],
  ['wnightingale', 'nightingale', 'Nightingale', 'nightingale'],
  ['wpie', 'pie', 'Pie', 'pie'],
  ['wradar', 'radar', 'Radar', 'radar'],
  ['wrectangle', 'rectangle', 'Rectangle', 'rectangle'],
  ['wsankey', 'sankey', 'Sankey', 'sankey'],
  ['wscatter', 'scatter', 'Scatter', 'scatter'],
  ['wsunburst', 'sunburst', 'Sunburst', 'sunburst'],
  ['wtreemap', 'treemap', 'Treemap', 'treemap'],
];

function vanillaPkgFor(id) {
  // wbar -> @alicloud/cloud-charts-bar, wmulticircle -> @alicloud/cloud-charts-multicircle
  return `@alicloud/cloud-charts-${id.slice(1)}`;
}

function buildChart([id, reactDir, reactExport, coreModel]) {
  const frameworks = ['react', 'vanilla'];
  if (SOLID_READY.has(reactDir)) frameworks.splice(1, 0, 'solid');
  return {
    id,
    type: 'chart',
    reactExport,
    frameworks,
    source: {
      react: {
        // 复制该图表目录整体
        dirs: [`packages/frameworks/react/src/charts/${reactDir}`],
      },
      vanilla: {
        dirs: [`packages/charts/${id}/src`],
        pkg: vanillaPkgFor(id),
      },
      solid: SOLID_READY.has(reactDir)
        ? { dirs: [`packages/frameworks/solid/src/charts/${reactDir}`] }
        : null,
      legacy: {
        dirs: [`packages/compat/src/${cap(reactExport)}`],
        // compat 包装层转发到 @alicloud/cloud-charts-react
      },
    },
    // 源码复制模式下，core model 三件套需要一起带上（react/solid 都依赖 core）
    coreModel,
    npmDeps: [],
  };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** 非图表 UI 组件（仅 React 新架构实现） */
const UI_COMPONENTS = [
  ['wnumber', 'Wnumber', 'components/Wnumber'],
  ['wcircle', 'Wcircle', 'components/Wcircle'],
  ['wcount', 'Wcount', 'components/Wcount'],
  ['wgauge', 'Wgauge', 'components/Wgauge'],
  ['wnumbercard', 'Wnumbercard', 'components/Wnumbercard'],
  ['wlistcontainer', 'Wlistcontainer', 'components/Wlistcontainer'],
  ['wplaceholder', 'Wplaceholder', 'components/Wplaceholder'],
  ['freetooltip', 'FreeTooltip', 'components/FreeTooltip'],
  ['ailoadingicon', 'AiLoadingIcon', 'components/AiLoadingIcon'],
  ['legends', 'TableLegend', 'components/legends'],
];

function buildUi([id, reactExport, rel]) {
  return {
    id,
    type: 'ui',
    reactExport,
    frameworks: ['react'],
    source: {
      react: { dirs: [`packages/frameworks/react/src/${rel}`] },
      vanilla: null,
      solid: null,
      legacy: null,
    },
    coreModel: null,
    npmDeps: [],
  };
}

/**
 * React 源码复制模式下所有图表/组件共享的运行时（hooks/provider/state/renderers/shared）。
 * 复制任意 react 组件时都会带上，避免相对 import 断裂。core model 之外的相对依赖都在这里。
 */
export const REACT_SHARED_DIRS = [
  'packages/frameworks/react/src/hooks',
  'packages/frameworks/react/src/provider',
  'packages/frameworks/react/src/state',
  'packages/frameworks/react/src/renderers',
  'packages/frameworks/react/src/shared',
  'packages/frameworks/react/src/components/legends',
];

export const SOLID_SHARED_DIRS = [
  'packages/frameworks/solid/src/primitives',
  'packages/frameworks/solid/src/provider',
  'packages/frameworks/solid/src/state',
  'packages/frameworks/solid/src/renderers',
];

export const SOLID_SHARED_FILES = [
  'packages/frameworks/solid/src/charts/createModelChart.tsx',
];

/** 源码复制模式下始终需要的 core 运行时目录（model 之外的公共部分） */
export const CORE_SHARED_DIRS = [
  'packages/core/src/adapters',
  'packages/core/src/g2-types',
  'packages/core/src/native',
  'packages/core/src/renderers',
  'packages/core/src/runtime',
  'packages/core/src/themes',
  'packages/core/src/types',
  'packages/core/src/utils',
];

export const REGISTRY = [
  ...CHARTS.map(buildChart),
  ...UI_COMPONENTS.map(buildUi),
];

export const FRAMEWORKS = ['react', 'solid', 'vanilla'];
/** 计划中但尚未实现的框架 */
export const PLANNED_FRAMEWORKS = ['vue'];

export function findComponent(id) {
  const key = String(id).toLowerCase();
  return REGISTRY.find((c) => c.id === key || c.reactExport.toLowerCase() === key);
}

export function componentsForFramework(fw) {
  return REGISTRY.filter((c) => c.frameworks.includes(fw));
}
