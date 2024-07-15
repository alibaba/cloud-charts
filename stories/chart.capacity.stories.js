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
    displayNumber: 80,
  },
};

const lessData = {
  percent: {
    name: '利用率',
    displayNumber: 50,
  },
};

// 1. 获取所有水位图的实例 + 位置信息
// 2. 针对同一行的水位图，计算每一个水位图与最左边的水位图的偏移量，动画的起始点加上偏移量的绝对值
stories.add('单水位', () => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Wcapacity
        data={emptyData}
        config={{
          barSize: 200,
          guide: {
            threshold: '80%',
            // status: 'error',
          },
        }}
        height={200} // 柱高度
        style={{
          marginBottom: 20,
        }}
      />
      <Wcapacity
        data={{
          percent: {
            name: '利用率',
            displayNumber: 30,
          },
        }}
        config={{
          barSize: 200,
          guide: {
            threshold: '80%',
            // status: 'error',
          },
        }}
        height={200} // 柱高度
        style={{
          marginBottom: 20,
        }}
      />
    </div>

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
        size: 'large',
      }}
      height={200} // 柱高度
    />
  </>
));
