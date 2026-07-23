import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createBarModel } from '../src/model/barModel.ts';
import { createBoxModel } from '../src/model/boxModel.ts';
import { createCandlestickModel } from '../src/model/candlestickModel.ts';
import { createFunnelModel } from '../src/model/funnelModel.ts';
import { createHeatmapModel } from '../src/model/heatmapModel.ts';
import { createHexagonalModel } from '../src/model/hexagonalModel.ts';
import { createHierarchyModel } from '../src/model/hierarchyModel.ts';
import { createHistogramModel } from '../src/model/histogramModel.ts';
import { createLineModel } from '../src/model/lineModel.ts';
import { createLineBarModel } from '../src/model/lineBarModel.ts';
import { createLineboxModel } from '../src/model/lineboxModel.ts';
import { createLineScatterModel } from '../src/model/lineScatterModel.ts';
import { createMapModel } from '../src/model/mapModel.ts';
import { createMinilineModel } from '../src/model/minilineModel.ts';
import { createMultiCircleModel } from '../src/model/multiCircleModel.ts';
import { createNightingaleModel } from '../src/model/nightingaleModel.ts';
import { createPieModel } from '../src/model/pieModel.ts';
import { createRadarModel } from '../src/model/radarModel.ts';
import { createRectangleModel } from '../src/model/rectangleModel.ts';
import { createSankeyModel } from '../src/model/sankeyModel.ts';
import { createScatterModel } from '../src/model/scatterModel.ts';
import { createSunburstModel } from '../src/model/sunburstModel.ts';
import { createTreemapModel } from '../src/model/treemapModel.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.join(__dirname, '__snapshots__/model-golden.json');
const shouldUpdate = process.argv.includes('--update');

const context = { theme: 'light', language: 'zh-CN' };
const baseConfig = { animate: false };

const treeData = {
  name: 'root',
  children: [
    { name: 'A', value: 30 },
    { name: 'B', children: [{ name: 'B1', value: 20 }, { name: 'B2', value: 10 }] },
  ],
};

const cases = [
  ['bar', () => createBarModel({ data: [{ name: 'Revenue', data: [['Q1', 100], ['Q2', 200]] }], config: { ...baseConfig, grid: true }, context })],
  ['box', () => createBoxModel({ data: [{ name: 'Box', data: [['G1', 1, 3, 5, 7, 9], ['G2', 2, 4, 6, 8, 10]] }], config: baseConfig, context })],
  ['candlestick', () => createCandlestickModel({ data: [{ name: 'K', data: [['2024-01', 10, 15, 8, 18], ['2024-02', 15, 12, 10, 16]] }], config: baseConfig, context })],
  ['funnel', () => createFunnelModel({ data: [{ name: 'Funnel', data: [['Visit', 100], ['Signup', 60], ['Pay', 30]] }], config: baseConfig, context })],
  ['heatmap', () => createHeatmapModel({ data: [{ name: 'Heat', data: [['Mon', 'AM', 5], ['Mon', 'PM', 8], ['Tue', 'AM', 3], ['Tue', 'PM', 6]] }], config: baseConfig, context })],
  ['hexagonal', () => createHexagonalModel({ data: [{ name: 'Hex', data: [[1, 2], [3, 4], [1.5, 2.5], [5, 6]] }], config: baseConfig, context })],
  ['hierarchy', () => createHierarchyModel({ data: treeData, config: baseConfig, context })],
  ['histogram', () => createHistogramModel({ data: [{ name: 'Dist', data: [1, 2, 2, 3, 3, 3, 4, 5] }], config: baseConfig, context })],
  ['line', () => createLineModel({ data: [{ name: 'Visits', data: [['Mon', 120], ['Tue', 180], ['Wed', 160]] }], config: { ...baseConfig, xAxis: { type: 'point' }, grid: true }, context })],
  ['lineGuideAreaStyle', () => createLineModel({
    data: [{ name: 'Visits', data: [['Mon', 120], ['Tue', 180], ['Wed', 160]] }],
    config: {
      ...baseConfig,
      xAxis: { type: 'point' },
      yAxis: { min: 100, max: 200 },
      area: { geomStyle: { fillOpacity: 0.35 } },
      areaColors: ['#ff0000'],
      geomStyle: { strokeOpacity: 0.7 },
      symbol: { shape: 'circle', geomStyle: { r: 4 } },
      guide: {
        line: { axis: 'y', value: 90, status: 'warning', text: '低水位' },
        area: { axis: 'y', value: [80, 220], status: 'blue' },
        filter: { axis: 'y', value: [120, 160], status: 'red', useGradient: true },
      },
    },
    context,
  })],
  ['barGeomStyleGuide', () => createBarModel({
    data: [{ name: 'Revenue', data: [['Q1', 100], ['Q2', 200]] }],
    config: {
      ...baseConfig,
      geomStyle: { fillOpacity: 0.6 },
      yAxis: { min: 0, max: 150 },
      guide: { area: { axis: 'y', value: [-10, 200], status: 'success' } },
    },
    context,
  })],
  ['lineBar', () => createLineBarModel({ data: [{ name: 'Bar', geomType: 'bar', data: [['A', 10], ['B', 20]] }, { name: 'Line', geomType: 'line', data: [['A', 30], ['B', 40]] }], config: baseConfig, context })],
  ['linebox', () => createLineboxModel({ data: [{ name: 'Line', geomType: 'line', data: [['A', 10], ['B', 20]] }, { name: 'Box', geomType: 'box', data: [['A', 1, 3, 5, 7, 9], ['B', 2, 4, 6, 8, 10]] }], config: baseConfig, context })],
  ['lineScatter', () => createLineScatterModel({ data: [{ name: 'Line', geomType: 'line', data: [['A', 10], ['B', 20]] }, { name: 'Scatter', geomType: 'scatter', data: [['A', 15], ['B', 25]] }], config: baseConfig, context })],
  ['map', () => createMapModel({ data: [{ name: 'Map', data: [{ name: 'Beijing', value: 100, lng: 116.4, lat: 39.9 }, { name: 'Shanghai', value: 80, lng: 121.5, lat: 31.2 }] }], config: baseConfig, context })],
  ['miniline', () => createMinilineModel({ data: [{ name: 'Mini', data: [['Mon', 10], ['Tue', 20], ['Wed', 15]] }], config: baseConfig, context })],
  ['multiCircle', () => createMultiCircleModel({ data: [{ name: 'Ring1', value: 75, max: 100 }, { name: 'Ring2', value: 50, max: 100 }], config: baseConfig, context })],
  ['nightingale', () => createNightingaleModel({ data: [{ name: 'Rose', data: [['A', 30], ['B', 50], ['C', 20]] }], config: baseConfig, context })],
  ['pie', () => createPieModel({ data: [{ name: 'Browser', data: [['Chrome', 60], ['Firefox', 20], ['Safari', 15]] }], config: { ...baseConfig, cycle: true }, context })],
  ['radar', () => createRadarModel({ data: [{ name: 'Score', data: [['Speed', 80], ['Power', 60], ['Range', 70]] }], config: baseConfig, context })],
  ['rectangle', () => createRectangleModel({ data: [{ name: 'Rect', data: [[1, 1, 5], [2, 2, 10], [3, 1, 7]] }], config: baseConfig, context })],
  ['sankey', () => createSankeyModel({ data: { nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }], links: [{ source: 'A', target: 'B', value: 10 }, { source: 'A', target: 'C', value: 5 }] }, config: baseConfig, context })],
  ['scatter', () => createScatterModel({ data: [{ name: 'Points', data: [[1, 2], [3, 4], [5, 6]] }], config: baseConfig, context })],
  ['sunburst', () => createSunburstModel({ data: treeData, config: baseConfig, context })],
  ['treemap', () => createTreemapModel({ data: treeData, config: baseConfig, context })],
];

function stableReplacer(key, value) {
  if (typeof value === 'function') return '[Function]';
  if (value instanceof RegExp) return String(value);
  if (key === 'theme') {
    if (value && typeof value === 'object' && 'g2Theme' in value && 'token' in value) {
      return { name: value.name, tokenKeys: Object.keys(value.token || {}).sort() };
    }
    if (value && typeof value === 'object') {
      return { keys: Object.keys(value).sort() };
    }
  }
  return value;
}

function normalizeModel(model) {
  return JSON.parse(JSON.stringify({
    state: model.state,
    metadata: model.metadata,
    data: model.data,
    config: model.config,
    legend: model.legend,
    tooltip: model.tooltip,
    interactions: model.interactions,
    spec: model.spec,
    theme: model.theme,
  }, stableReplacer));
}

function createSnapshot() {
  return Object.fromEntries(cases.map(([name, createModel]) => [name, normalizeModel(createModel())]));
}

const actual = createSnapshot();

if (shouldUpdate) {
  fs.writeFileSync(snapshotPath, `${JSON.stringify(actual, null, 2)}\n`);
  console.log(`Updated ${path.relative(process.cwd(), snapshotPath)}`);
  process.exit(0);
}

if (!fs.existsSync(snapshotPath)) {
  throw new Error(`Missing snapshot. Run: npm run test:model-golden -- --update`);
}

const expected = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
assert.deepEqual(actual, expected);
console.log(`Verified ${cases.length} core model golden snapshots.`);
