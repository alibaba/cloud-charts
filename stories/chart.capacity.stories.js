import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wcapacity } from '@alicloud/cloud-charts';

const stories = storiesOf('Wcapacity', module);

const dafaultData = {
  percent: {
    name: '利用率',
    displayNumber: 120,
  },
};

const emptyData = {
  percent: {
    name: '利用率',
    displayNumber: 0,
  },
};

const lessData = {
  percent: {
    name: '利用率',
    displayNumber: 1.2,
  },
};

stories.add('单水位', () => (
  <>
    <Wcapacity
      data={emptyData}
      config={{}}
      height={200} // 柱高度
      style={{
        marginBottom: 20,
      }}
    />
    <Wcapacity
      data={dafaultData}
      config={{
        // percentConfig: {
        //   width: 200 // 柱宽度
        // },
        startColor: 'error',
        // startColor: '#297acc', // 波浪头部颜色
        // endColor: 'rgba(39,137,242,0)', // 波浪尾部颜色
        guide: {
          threshold: '80%',
          status: 'error',
        },
      }}
      height={200} // 柱高度
      style={{
        marginBottom: 20,
      }}
    />
    <Wcapacity
      data={lessData}
      config={{}}
      height={200} // 柱高度
      style={{
        marginBottom: 20,
      }}
    />
    <h4>自定义颜色</h4>
    <Wcapacity
      data={dafaultData}
      config={{
        startColor: '#F7A854',
        barConfig: {
          background: '#FFF5EB',
        },
        labelConfig: {
          color: 'var(--color-text-1, #1A1A1A)',
        },
        size: 'large'
      }}
      height={200} // 柱高度
    />
  </>
));
