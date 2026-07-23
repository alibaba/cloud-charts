/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-line，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from 'react';
import { storiesOf } from '@storybook/react';
import { renderWlineModel } from '@alicloud/cloud-charts-line';
import { Wline } from '@alicloud/cloud-charts';
import { CompareTwoCols } from './_helpers/CompareTwoCols';

const data = [
  {
    name: '机房A',
    data: [
      [1483372800000, 4092], [1483459200000, 1592], [1483545600000, 3714],
      [1483632000000, 4854], [1483718400000, 6514], [1483804800000, 9022],
      [1483891200000, 6023], [1483977600000, 4018],
    ],
  },
  {
    name: '机房B',
    data: [
      [1483372800000, 6051], [1483459200000, 3278], [1483545600000, 5175],
      [1483632000000, 6548], [1483718400000, 9048], [1483804800000, 11394],
      [1483891200000, 8597], [1483977600000, 6588],
    ],
  },
];

const cases = [
  { name: '基础折线图', config: {} },
  { name: '平滑曲线图', config: { spline: true } },
  { name: '带点折线图', config: { symbol: true } },
  { name: '面积折线图', config: { area: true } },
  { name: '堆叠面积图', config: { area: true, stack: true } },
  { name: '阶梯折线图', config: { step: true } },
  { name: '带网格线', config: { grid: true } },
  { name: '拖拽缩放 (zoom)', config: { zoom: true } },
];

const renderVanillaLine = (container, { themeName, language, config, chartData }) =>
  renderWlineModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf('v3/Line 新旧对比', module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || 'normal';
    return (
      <CompareTwoCols
        OldComponent={Wline}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-line"
        renderVanilla={(container, opts) =>
          renderVanillaLine(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
