import assert from 'node:assert/strict';

import { createBarModel } from '../src/model/barModel.ts';
import { assembleInteractionSpec } from '../src/model/createChartModel.ts';
import { normalizeAxis, normalizeYAxis } from '../src/runtime/axis/index.ts';
import { normalizeLegend } from '../src/runtime/features/legend.ts';
import {
  normalizeLegendInteractions,
  normalizeScrollbar,
  normalizeSlider,
  normalizeZoom,
} from '../src/runtime/features/interactions.ts';
import { normalizeTooltip } from '../src/runtime/features/tooltip.ts';
import { buildGuideMarks } from '../src/runtime/features/guide.ts';
import { buildLineMarks } from '../src/runtime/features/marks.ts';
import { mapColors } from '../src/runtime/common/color.ts';
import { unitConversion } from '../src/runtime/format/unitConversion.ts';
import { getAutoTimeMask, getLanguage, getText, onLanguageChange, setLanguage } from '../src/runtime/i18n/index.ts';
import { getThemeName, onThemeChange, resolveTheme, setTheme } from '../src/runtime/theme/index.ts';

const theme = resolveTheme('light');
const token = theme.token;

function assertThemeGate() {
  assert.equal(theme.name, 'normal');
  assert.equal(typeof token['widgets-legend-text'], 'string');
  assert.equal(typeof theme.g2Theme, 'object');
  assert.deepEqual(theme.g2Theme.legendCategory.itemSpacing, [6, 18]);
  assert.equal(theme.g2Theme.legendCategory.rowPadding, 6);
  assert.equal(theme.g2Theme.legendCategory.colPadding, 18);

  const custom = resolveTheme({ 'widgets-legend-text': '#123456' });
  assert.equal(custom.name, 'custom');
  assert.equal(custom.token['widgets-legend-text'], '#123456');

  const seen = [];
  const off = onThemeChange((name) => seen.push(name));
  setTheme('dark');
  off();
  setTheme('light');
  assert.equal(getThemeName(), 'light');
  assert.deepEqual(seen, ['dark']);
}

function assertLegendGate() {
  const legend = normalizeLegend(
    { position: 'bottom', align: 'left', showData: true },
    token,
    { marker: 'square', valueMap: { Revenue: 100 } },
  );

  assert.equal(legend.visible, true);
  assert.equal(legend.position, 'bottom');
  assert.equal(legend.mode, 'g2');
  assert.equal(legend.spec.itemLabelFill, token['widgets-legend-text']);
  assert.equal(legend.spec.itemLabelFontSize, 12);
  assert.deepEqual(legend.spec.itemSpacing, [6, 18]);
  assert.equal(legend.spec.itemMarker, 'rect');
  assert.equal(legend.spec.itemValueText({ label: 'Revenue' }), '100');

  const hidden = normalizeLegend({ visible: false }, token);
  assert.equal(hidden.spec, false);

  const topLegend = normalizeLegend({ position: 'top' }, token);
  assert.deepEqual(topLegend.spec.padding, [0, 0, 16, 0]);
  const rightPolarLegend = normalizeLegend({ position: 'right' }, token, { isPolar: true });
  assert.deepEqual(rightPolarLegend.spec.padding, [0, 0, 0, 24]);

  const formatterArgs = [];
  const formattedLegend = normalizeLegend({ nameFormatter: (...args) => { formatterArgs.push(args); return `Name:${args[0]}:${args[2]}`; } }, token);
  assert.equal(formattedLegend.spec.itemLabelText({ label: 'Revenue' }, 2), 'Name:Revenue:2');
  assert.deepEqual(formatterArgs[0], ['Revenue', { label: 'Revenue' }, 2]);
}

function assertTooltipGate() {
  const tooltip = normalizeTooltip({
    xAxisType: 'band',
    titleFormatter: (x) => `Title:${x}`,
    valueFormatter: (value) => `Value:${value}`,
    themeToken: token,
  });

  assert.equal(tooltip.visible, true);
  assert.equal(tooltip.spec.shared, true);
  assert.equal(tooltip.spec.css['.g2-tooltip'].color, token['widgets-tooltip-text']);
  assert.deepEqual(tooltip.interactionTooltip.crosshairs, { type: 'rect' });
  assert.equal(tooltip.interactionTooltip.marker, false);
  assert.equal(tooltip.markSpec.title({ x: 'Q1' }), 'Title:Q1');
  assert.deepEqual(tooltip.markSpec.items[0]({ type: 'Revenue', y: 12 }, 0, []), { name: 'Revenue', value: 'Value:12' });

  const timeTooltip = normalizeTooltip({ xAxisType: 'time', xAxisMask: 'YYYY-MM-DD', themeToken: token });
  assert.deepEqual(timeTooltip.interactionTooltip.crosshairs, { type: 'x' });
  assert.equal(timeTooltip.markSpec.title({ x: '2024-01-02T00:00:00Z' }), '2024-01-02');
  assert.equal(timeTooltip.interactionTooltip.filter({ name: 'A', value: 1 }, 0, [{ name: 'A', value: 1 }, { name: 'A', value: 1 }]), true);
  assert.equal(timeTooltip.interactionTooltip.filter({ name: 'A', value: 1 }, 1, [{ name: 'A', value: 1 }, { name: 'A', value: 1 }]), false);

  const formattedTitleTooltip = normalizeTooltip({
    xAxisType: 'time',
    titleFormatter: (title, datum) => `Title:${title}:${datum.x}`,
    themeToken: token,
  });
  assert.equal(formattedTitleTooltip.markSpec.title, undefined);
  assert.equal(formattedTitleTooltip.interactionTooltip.title('2024-01-02', { x: '2024-01-02T00:00:00Z' }), 'Title:2024-01-02:2024-01-02T00:00:00Z');

  const columnsTooltip = normalizeTooltip({ columns: 2, dodge: true, themeToken: token });
  assert.equal(columnsTooltip.spec.css['.g2-tooltip-list']['column-count'], 2);
  assert.equal(columnsTooltip.spec.dodge, undefined);
  assert.equal(columnsTooltip.dodge, true);

  const bareTooltip = normalizeTooltip({ themeToken: token });
  assert.deepEqual(bareTooltip.markSpec.items[0]({ type: 'undefined-name-0', y: 1 }, 0, []), { name: '', value: '1' });

  const dualYAxisTooltip = normalizeTooltip({
    dualYAxisFormatConfigs: [{ unit: '元' }, { unit: '%' }],
    themeToken: token,
  });
  assert.deepEqual(dualYAxisTooltip.markSpec.items[0]({ type: 'Left', y: 100, yAxis: 0 }, 0, []), { name: 'Left', value: '100元' });
  assert.deepEqual(dualYAxisTooltip.markSpec.items[0]({ type: 'Right', y: 0.5, yAxis: 1 }, 0, []), { name: 'Right', value: '0.5%' });

  const sortedTooltip = normalizeTooltip({ sort: 'desc', themeToken: token });
  const items = [{ name: 'A', value: 1 }, { name: 'B', value: 3 }, { name: 'C', value: 2 }];
  const sortedItems = [...items].sort((left, right) => sortedTooltip.interactionTooltip.sort(left) - sortedTooltip.interactionTooltip.sort(right));
  assert.deepEqual(sortedItems.map((item) => item.name), ['B', 'C', 'A']);
  assert.equal(sortedTooltip.spec.sort, undefined);
}

function assertAxisGate() {
  const xAxis = normalizeAxis({ type: 'band' }, { field: 'x', grid: true, token });
  assert.equal(xAxis.line, true);
  assert.equal(xAxis.tick, true);
  assert.equal(xAxis.grid, true);
  assert.equal(xAxis.style.labelFill, token['widgets-axis-label']);
  assert.deepEqual(xAxis.transform, [
    { type: 'rotate', optionalAngles: [0, 45], recoverWhenFailed: false },
    { type: 'ellipsis' },
  ]);

  const timeAxis = normalizeAxis({ type: 'time', mask: 'YYYY' }, { field: 'x', token });
  assert.equal(timeAxis.labelAutoRotate, false);
  assert.equal(timeAxis.labelAutoHide, false);
  assert.equal(timeAxis.labelFormatter('2024-01-01T00:00:00Z'), '2024');

  const autoMaskTimeAxis = normalizeAxis({ type: 'time', mask: 'auto' }, { field: 'x', token });
  assert.equal(autoMaskTimeAxis.labelFormatter('2024-01-01T00:00:00'), '00:00:00\n2024-01-01');

  const defaultYAxis = normalizeAxis({}, { field: 'y', token });
  assert.equal(defaultYAxis.labelFormatter(1234), '1,234');

  const yAxis = normalizeYAxis([{ alias: 'left' }, { alias: 'right' }], { grid: true, token });
  assert.equal(yAxis.y.line, true);
  assert.equal(yAxis.y.grid, true);
  assert.equal(yAxis.y.title, 'left');
  assert.equal(yAxis.y.titleTransform, 'rotate(-90deg)');
  assert.equal(yAxis.y1.position, 'right');
  assert.equal(yAxis.y1.grid, false);
  assert.equal(yAxis.y1.title, 'right');
  assert.equal(yAxis.y1.titleTransform, 'rotate(-90deg)');

  assert.equal(normalizeAxis({ tick: true }, { field: 'y', token }).tick, true);
  assert.equal(normalizeAxis({ tickLine: false }, { field: 'x', token }).tick, false);
}

function assertI18nGate() {
  const seen = [];
  const off = onLanguageChange((language) => seen.push(language));
  setLanguage('en-US');
  assert.equal(getText('reset'), 'Reset');
  off();
  setLanguage('zh-CN');

  assert.equal(getLanguage(), 'zh-CN');
  assert.deepEqual(seen, ['en-US']);
  assert.equal(getText('reset', { language: 'zh-CN' }), '重置');
  assert.equal(getText('neimenggu', { language: 'zh-CN' }), '内蒙古');
  assert.equal(getText('xianggang', { language: 'en-US' }), 'Hong Kong');
  assert.equal(getText('reset', { language: 'en-US', locale: { loading: 'Loading now' } }), 'Reset');
  assert.equal(getText('reset', { language: 'en-US', locale: { 'zh-cn': { reset: '默认重置' }, 'en-US': { loading: 'Loading now' } } }), '默认重置');
  assert.equal(getText('reset', { locale: { reset: 'Reset now' } }), 'Reset now');
  assert.equal(getAutoTimeMask([['2024-01-01', 1], ['2024-01-02', 2]], { language: 'zh-CN' }), 'MM-DD');
}

function assertFormatColorGate() {
  assert.deepEqual(unitConversion(1, undefined, 1, undefined, 'time'), { value: 1, unit: 's' });
  assert.equal(mapColors('primary', token), token['widgets-color-primary']);
  assert.deepEqual(mapColors(['widgets-color-red', 'gray', '#ffffff'], token), [
    token['widgets-color-red'],
    token['widgets-color-gray'],
    '#ffffff',
  ]);
}

function assertBarRuleGate() {
  const percentage = createBarModel({
    data: [{ name: 'Revenue', data: [['Q1', 0.25], ['Q2', 0.75]] }],
    config: { animate: false, percentage: true },
    context: { theme: 'light' },
  });
  assert.equal(percentage.spec.scale.y.min, 0);
  assert.equal(percentage.spec.scale.y.max, 1);
  assert.equal('labelFormatter' in percentage.spec.scale.y, false);
  assert.equal(percentage.spec.axis.y.labelFormatter(0.25), '25%');

  const labelPadding = createBarModel({
    data: [{ name: 'Revenue', data: [['Q1', 100]] }],
    config: { animate: false, label: true, appendPadding: [0, 0, 5, 0] },
    context: { theme: 'light' },
  });
  assert.deepEqual(labelPadding.config.appendPadding, [24, 0, 24, 0]);

  const empty = createBarModel({
    data: [],
    config: { animate: false },
    context: { theme: 'light' },
  });
  assert.deepEqual(empty.config.colors, ['gray']);
  assert.deepEqual(empty.spec.scale.color.range, [token['widgets-color-gray']]);
}

function assertStateGate() {
  const loading = createBarModel({
    data: [{ name: 'Revenue', data: [['Q1', 100]] }],
    config: { animate: false },
    context: { theme: 'light', state: { loading: true } },
  });
  assert.equal(loading.state, 'loading');

  const empty = createBarModel({
    data: [],
    config: { animate: false },
    context: { theme: 'light' },
  });
  assert.equal(empty.state, 'empty');
  assert.equal(empty.metadata.isEmpty, true);
}

function assertInteractionGate() {
  const legend = normalizeLegend(
    { allowAllCanceled: true, useReverseChecked: true },
    token,
    { marker: 'square', valueMap: { Revenue: 100 } },
  );
  const interactions = normalizeLegendInteractions(legend, {
    rawData: [{ name: 'Hidden', visible: false }],
  });
  const interactionSpec = assembleInteractionSpec([
    normalizeZoom({ zoom: true }, '重置', token),
    ...interactions,
  ].filter(Boolean));

  assert.equal(interactionSpec.legacyEllipsisText, true);
  assert.deepEqual(interactionSpec.legacyLegendHighlight, { resetOnClick: true });
  assert.deepEqual(interactionSpec.legacyLegendFilter, {
    allowAllCanceled: true,
    mode: 'singleChecked',
    keepLast: false,
    hiddenValues: ['Hidden'],
  });
  assert.deepEqual(interactionSpec.legacyRectZoom, {
    resetText: '重置',
    events: ['zoom:start', 'zoom:end', 'zoom:reset'],
    style: { fill: token['widgets-color-background'], stroke: token['widgets-color-gray'], lineWidth: 0.5, pointerEvents: 'none' },
    textStyle: { fill: token['widgets-color-primary'] },
    activeStyle: { fill: token['widgets-color-background'], stroke: token['widgets-color-primary'] },
  });
  assert.equal(interactionSpec.legacyTooltipGuard, true);

  const sliderData = [
    { x: 'Q1', y: 1 },
    { x: 'Q2', y: 2 },
    { x: 'Q3', y: 3 },
    { x: 'Q4', y: 4 },
    { x: 'Q5', y: 5 },
  ];
  const slider = normalizeSlider({
    slider: {
      sampleRate: 0.5,
      backgroundStyle: { stroke: '#111111' },
      handlerStyle: { fill: '#222222' },
      textStyle: { fill: '#333333' },
      trendCfg: { smooth: true, areaStyle: { fillOpacity: 0.2 } },
    },
  }, { token, data: sliderData, width: 2 });
  assert.equal(slider.x.start, 0.64);
  assert.equal(slider.x.end, 1);
  assert.equal(slider.x.showText, false);
  assert.equal(slider.x.sampleRate, 0.4);
  assert.equal(slider.x.type, 'simple');
  assert.equal(slider.x.style.track.fill, token['widgets-color-background']);
  assert.equal(slider.x.style.track.stroke, '#111111');
  assert.equal(slider.x.style.handle.fill, '#222222');
  assert.equal(slider.x.style.handle.stroke, token['widgets-slider-handler-border-color']);
  assert.equal(slider.x.style.handleLabel.fill, '#333333');
  assert.equal(slider.x.style.sparkline.smooth, true);
  assert.equal(slider.x.style.sparkline.line.stroke, token['widgets-slider-trend-bg']);
  assert.equal(slider.x.style.sparkline.area.fillOpacity, 0.2);
  assert.deepEqual(slider.x.style.sparkline.data, [sliderData[0], sliderData[3], sliderData[4]]);

  assert.deepEqual(normalizeScrollbar({ scrollbar: true }), { type: 'horizontal', categorySize: 32 });
}

function assertGuideMarkGate() {
  const guideMarks = buildGuideMarks({
    line: [
      { axis: 'y', value: -1, status: 'warning', text: 'Threshold' },
      { axis: 'x', value: 'Q1', status: 'success', text: { title: 'Launch' } },
    ],
    area: { axis: 'y1', value: [-10, 120], status: 'blue' },
    filter: { axis: 'y1', value: [20, 80], status: 'red', useGradient: true },
  }, {
    themeToken: token,
    scales: { y: { min: 0, max: 100 }, y1: { min: 10, max: 90 } },
  });

  assert.equal(guideMarks[0].data[0].value, 0);
  assert.deepEqual(guideMarks[0].labels[0], {
    text: 'Threshold',
    position: 'start',
    autoRotate: true,
    offsetX: 0,
    offsetY: -6,
    style: { fill: token['widgets-color-orange'], textAlign: 'start' },
  });
  assert.deepEqual(guideMarks[1].labels[0], {
    text: 'Launch',
    position: 'end',
    autoRotate: false,
    offsetX: 0,
    offsetY: 0,
    style: { fill: token['widgets-color-green'], textAlign: 'center' },
  });
  assert.deepEqual(guideMarks[2].data[0], { start: 10, end: 90 });
  assert.equal(guideMarks[2].yField, 'y1');
  assert.equal(guideMarks[3].style.fill, `l(90) 0:${token['widgets-color-red']} 1:${token['widgets-color-red']}00`);

  const marks = buildLineMarks({
    area: { geomStyle: { fillOpacity: 0.4 } },
    geomStyle: { strokeOpacity: 0.8 },
    symbol: { shape: 'circle', geomStyle: { r: 5 } },
    lineWidth: 2,
  });
  assert.equal(marks[0].style.fillOpacity, 0.4);
  assert.equal(marks[1].style.strokeOpacity, 0.8);
  assert.equal(marks[1].style.lineWidth, 2);
  assert.equal(marks[2].style.shape, 'circle');
  assert.equal(marks[2].style.r, 5);
  assert.equal(marks[2].style.geomStyle, undefined);
}

function assertDataTypeG2Gate() {
  const rawData = [
    { x: 'Q1', y: 100, type: 'Revenue' },
    { x: 'Q2', y: 200, type: 'Revenue' },
  ];
  const model = createBarModel({
    data: rawData,
    config: { dataType: 'g2', animate: false, legend: false, tooltip: false },
    context: { theme: 'light' },
  });

  assert.deepEqual(model.data, rawData);
  assert.deepEqual(model.spec.data, rawData);
  assert.equal(model.spec.children[0].data, rawData);
  assert.equal(model.legend.spec, false);
  assert.equal(model.tooltip.spec, false);
}

assertThemeGate();
assertLegendGate();
assertTooltipGate();
assertAxisGate();
assertI18nGate();
assertFormatColorGate();
assertBarRuleGate();
assertStateGate();
assertInteractionGate();
assertGuideMarkGate();
assertDataTypeG2Gate();

console.log('Verified core runtime release gates: theme, legend, tooltip, axis, i18n, state, interactions, guide/marks, dataType:g2.');
