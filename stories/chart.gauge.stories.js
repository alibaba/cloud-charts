import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wgauge } from '@alicloud/cloud-charts';

const stories = storiesOf('Wgauge', module);

const config = {
  outRing: true,
  percentage: true,
  angle: {
    start: -210,
    end: 30,
  },
  // unit: '个',
  gaugeScale: {
    scaleNum: 9,
    scale: true,
  },
  // customStyles: {
  //   gaugeTextStyle: {
  //     scale: false,
  //     fontSize: '24px',
  //   },
  // },
  // colors: [[60, 'error'],[80, 'warning'], [100, 'success']]
};

const config1 = {
  // percentage: false,
  needUnitTransform: true,
  decimal: 5,
  angle: {
    start: -210,
    end: 30,
  },
  gaugeScale: {
    scaleNum: 9,
    scale: false,
  },
  valueType: 'percent_100',
};

const config2 = {
  outRing: true,
  percentage: true,
  // x轴负向为-180，x轴正向为0，角度沿顺时针增大，起始结束角度需保持对称
  angle: {
    start: -210,
    end: 30,
  },
  gaugeScale: {
    scaleNum: 9,
    scale: true,
  },
};

const config21 = {
  outRing: true,
  percentage: true,
  // x轴负向为-180，x轴正向为0，角度沿顺时针增大，起始结束角度需保持对称
  angle: {
    start: -210,
    end: 30,
  },
  // gaugeScale: {
  //   scaleNum: 9,
  //   scale: true,
  // },
};

// const newConfig = {
//   outRing: false,
//   // percentage: false,
//   // fontColorFit: true,
//   // renderText: '正常'
//   // x轴负向为-180，x轴正向为0，角度沿顺时针增大，起始结束角度需保持对称
//   // gaugeScale: {
//   //   scaleNum: 9,
//   //   scale: true,
//   // },
//   // colors: [
//   //   [60, 'error'],
//   //   [80, 'warning'],
//   //   [100, 'success'],
//   // ],
//   // strokeWidth: 15,
//   // customStyles: {
//   //   scaleLineLength: 6,
//   //   gaugeTextStyle: {
//   //     fontWeight: '400',
//   //     fontSize: '12px',
//   //   },
//   // },
//   // decorationGap: 8,
// };

const newConfig = {
  needUnitTransform: true,
  angle: {
    start: -210,
    end: 30,
  },
  // colors: 'success',
  colors: [[10, 'normal'],[50, 'warning'], [100, 'success']],
  gaugeScale: {
    scaleNum: 9,
    scale: true,
  },
  outRing: true,
  valueType: 'percent_1',
  renderText: 'trstg',
  percentage: false,
  // x轴负向为-180，x轴正向为0，角度沿顺时针增大，起始结束角度需保持对称
  // gaugeScale: {
  //   scaleNum: 9,
  //   scale: true,
  // },
  // colors: [
  //   [60, 'error'],
  //   [80, 'warning'],
  //   [100, 'success'],
  // ],
  // strokeWidth: 15,
  // customStyles: {
  //   scaleLineLength: 6,
  //   gaugeTextStyle: {
  //     fontWeight: '400',
  //     fontSize: '12px',
  //   },
  // },
  // decorationGap: 8,
};

stories.add('仪表盘基础用法', () => (
  <div style={{ height: 309 }}>
    <Wgauge
      config={newConfig}
      data={{
        current: 0.9808306709265175,
        label: 'Value',
      }}
    />
  </div>
));

stories.add('仪表盘1', () => (
  <div style={{ height: 200 }}>
    <Wgauge data={{ current: 0.9802371541501976, label: '' }} config={config1} />
  </div>
));

stories.add('仪表盘2', () => (
  <div style={{ height: 200 }}>
    <Wgauge data={{ current: 90, label: '' }} config={newConfig} />
  </div>
));

stories.add('仪表盘3', () => (
  <div style={{ height: 290 }}>
    <Wgauge data={{ current: 90, label: 'test11' }} config={config2} />
  </div>
));

stories.add('仪表盘3-1', () => (
  <div style={{ height: 290 }}>
    <Wgauge data={{ current: 90 }} config={config21} />
  </div>
));

stories.add('仪表盘4', () => (
  <div style={{ height: 300 }}>
    <Wgauge data={{ current: 81, label: '' }} config={config1} />
  </div>
));

stories.add('仪表盘5', () => (
  <div style={{ height: 300 }}>
    <Wgauge
      data={{ current: 81, label: 'testsssssssssssssssssssssssssssssssssssssss' }}
      config={config1}
    />
  </div>
));

stories.add('非百分比', () => (
  <div style={{ height: 200 }}>
    <Wgauge
      config={{
        angle: {
          start: -210,
          end: 30,
        },
        gaugeScale: {
          scaleNum: 9,
          scale: false,
        },
        needUnitTransform: true,
        valueType: 'count',
        unit: 'counts',
        min: 500,
        max: 1300,
      }}
      data={{
        current: 724,
        label: 'Value',
      }}
    />
  </div>
));
