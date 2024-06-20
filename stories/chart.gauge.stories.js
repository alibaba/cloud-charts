import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wgauge } from '@alicloud/cloud-charts';

const stories = storiesOf('Wgauge', module);

const config = {
  outRing: true,
  percentage: false,
  unit: '个',
  gaugeScale: {
    scaleNum: 9,
  },
  customStyles: {
    gaugeTextStyle: {
      // scale: false,
      fontSize: '12px',
    },
    gaugeLineStyle: {
      stroke: 'lightgreen'
    }
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
  gaugeScale: {},
  customStyles: {
    gaugeTextStyle: {
      fill: 'lightblue',
      fontSize: '36px',
    }
  },
}

stories.add('仪表盘基础用法', () => <div style={{height: 200,  display: 'flex', alignItems: 'center'}} ><Wgauge config={config} data={{ current: 60.1111 }} /></div>);

stories.add('仪表盘1', () => <div style={{height: 200 }} ><Wgauge data={{current: 81}} config={config1}  /></div>);

stories.add('仪表盘2', () => <div style={{height: 200}} ><Wgauge data={{current: 77}} config={config2} /></div>);