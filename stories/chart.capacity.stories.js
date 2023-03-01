import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wcapacity } from '@alife/aisc-widgets';

const stories = storiesOf('Wcapacity', module);

const dafaultData = {
  percent: {
    name: '利用率',
    displayNumber: 89,
  },
};

const emptyData = {
  percent: {
    name: '利用率',
    displayNumber: 0,
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
          // status: 'error',
        },
      }}
      height={200} // 柱高度
    />
  </>
));
