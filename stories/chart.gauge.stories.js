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
  customStyles: {
    gaugeTextStyle: {
      scale: false,
      fontSize: '24px',
    },
  },
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
  //   gaugeTextStyle: {
  //     fill: 'lightblue',
  //     fontSize: '36px',
  //   }
  // },
}

stories.add('仪表盘基础用法', () => <div style={{height: 200,  display: 'flex', alignItems: 'center'}} ><Wgauge config={config} data={{ current: 80.1111, label: 'CPU利用率' }} /></div>);

stories.add('仪表盘1', () => <div style={{height: 200 }} ><Wgauge data={{current: 81, label: ''}} config={config1}  /></div>);

stories.add('仪表盘2', () => <div style={{height: 200}} ><Wgauge data={{current: 90}} config={config2} /></div>);