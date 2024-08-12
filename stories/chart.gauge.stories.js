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
}

const config1 = {
  percentage: false,
  unit: '个',
  gaugeScale: {
    scaleNum: 9,
    // scale: false,
  },
}

const config2 = {
  // gaugeScale: {},
  colors: 'p6',
  outRing: false,
  // customStyles: {
  //   valueStyle: {
  //     fill: 'lightblue',
  //     fontSize: '36px',
  //     fontSize: '36px'
  //   }
  // },
}

const newConfig = {
  outRing: true,
  percentage: false,
  // x轴负向为-180，x轴正向为0，角度沿顺时针增大，起始结束角度需保持对称
  angle: {
    start: -180,
    end: 0,
  },
  gaugeScale: {
    scaleNum: 9,
    scale: true,
  },
  colors: [
    [60, 'error'],
    [80, 'warning'],
    [100, 'success'],
  ],
  strokeWidth: 15,
  // customStyles: {
  //   scaleLineLength: 6,
  //   gaugeTextStyle: {
  //     fontWeight: '400',
  //     fontSize: '12px',
  //   },
  // },
  // decorationGap: 8,
};

stories.add('仪表盘基础用法', () => <div ><Wgauge config={newConfig} data={{ current: 90 }} /></div>);

stories.add('仪表盘1', () => <div style={{height: 200, width: 300 }} ><Wgauge data={{current: 81, label: ''}} config={config1}  /></div>);

stories.add('仪表盘2', () => <div style={{height: 200}} ><Wgauge data={{current: 90, label: ''}} config={newConfig} /></div>);

stories.add('仪表盘3', () => <div style={{height: 120}} ><Wgauge data={{current: 90, label: 'test11'}} config={config2} /></div>);

stories.add('仪表盘4', () => <div style={{height: 300 }} ><Wgauge data={{current: 81, label: ''}} config={config1}  /></div>);

stories.add('仪表盘5', () => <div style={{height: 300 }} ><Wgauge data={{current: 81, label: 'testsssssssssssssssssssssssssssssssssssssss'}} config={config1}  /></div>);