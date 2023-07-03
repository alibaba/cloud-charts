import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import { Wcontainer, Wline, Wbar } from '@alicloud/cloud-charts';

const stories = storiesOf('linebugs', module);
stories.addDecorator(withKnobs);

let data = [
  {
    name: '机房1',
    data: [
      [1483372800000, 1151],
      [1483459200000, 4778],
      [1483545600000, 21175],
      [1483632000000, 19048],
      [1483718400000, 14748],
      [1483804800000, 18494],
      [1483891200000, 10597],
      [1483977600000, 8788],
      [1484064000000, 12985],
      [1484150400000, 2492],
      [1484236800000, 5965],
      [1484323200000, 10246],
      [1484409600000, 12160],
      [1484496000000, 6877],
    ],
  },
];

stories.add('折线图-辅助线渐变问题', () => (
  <Wline
    height="300"
    data={data}
    // localRefresh={false}
    config={{
      guide: {
        line: {
          // top: true,
          // status: 'warning',
          // axis: 'y',
          // value: 10000,
        },
        filter: [
          {
            status: 'error',
            axis: 'x',
            value: [1483372800000, 1483545600000],
          },
          // {
          //   status: 'error',
          //   axis: 'x',
          //   value: [1484323200000, 1484496000000],
          // },
          // {
          //   status: 'warning',
          //   axis: 'y',
          //   value: [10000, 'max'],
          // },
        ],
      },
    }}
  />
));

stories.add('柱图-辅助线渐变问题', () => (
  <Wbar
    height="300"
    data={data}
    config={{
      guide: {
        filter: [
          {
            status: 'error',
            axis: 'x',
            value: [1483372800000, 1483545600000],
          },
          // {
          //   status: 'error',
          //   axis: 'x',
          //   value: [1484323200000, 1484496000000],
          // },
          // {
          //   status: 'warning',
          //   axis: 'y',
          //   value: [10000, 'max'],
          // },
        ],
      },
    }}
  />
));
