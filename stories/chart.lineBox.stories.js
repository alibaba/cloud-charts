import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import { Wlinebox, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  {
    name: '机房1',
    type: 'box',
    data: [
      [1483372800000, [11000, 11300, 11751, 11900, 12100]],
      [1483459200000, [3000, 3428, 4078, 5098, 4178]],
      [1483545600000, [1100, 1600, 2175, 2500, 3000]],
    ],
  },
  {
    name: '机房3',
    type: 'line',
    yAxis: 1,
    data: [
      [1483372800000, 11751],
      [1483459200000, 4078],
      [1483545600000, 2175],
      [1483632000000, 12048],
      [1483718400000, 1748],
      [1483804800000, 10494],
      [1483891200000, 9597],
      [1483977600000, 4788],
      // [1484064000000, 2085],
      // [1484150400000, 492],
      // [1484236800000, 2965],
      // [1484323200000, 4246],
      // [1484409600000, 2160],
      // [1484496000000, 11877],
    ],
  },
  // {
  //   name: '机房4',
  //   type: 'line',
  //   yAxis: 1,
  //   data: [
  //     [1483372800000, 1151],
  //     [1483459200000, 4778],
  //     [1483545600000, 21175],
  //     [1483632000000, 19048],
  //     [1483718400000, 14748],
  //     [1483804800000, 18494],
  //     [1483891200000, 10597],
  //     [1483977600000, 8788],
  //     [1484064000000, 12985],
  //     [1484150400000, 2492],
  //     [1484236800000, 5965],
  //     [1484323200000, 10246],
  //     [1484409600000, 12160],
  //     [1484496000000, 6877],
  //   ],
  // },
];

const stories = storiesOf('Wlinebox', module);
stories.addDecorator(withKnobs);
stories.add('箱形线图', () => (
  <Wcontainer className="demos">
    <Wlinebox
      height="300"
      config={{
        area: true,
        symbol: true,
        spline: true,
        boxGeomStyle: {
          cursor: 'pointer',
        },
        lineGeomStyle: {
          cursor: 'pointer',
        },
        tooltip: {
          columns: 2,
        },
        // guide: {
        //   line: [
        //     {
        //       top: true,
        //       text: {
        //         title: '水平线',
        //         position: 'start',
        //         // align: 'start',
        //       },
        //       // status: 'warning',
        //       axis: 'y',
        //       value: 7000,
        //       // 自定义样式，可设置为虚线
        //       style: {
        //         lineDash: [4, 4],
        //       },
        //     },
        //     {
        //       top: true,
        //       text: {
        //         title: '垂直线',
        //         position: 'end',
        //         align: 'center',
        //       },
        //       status: 'none',
        //       axis: 'x',
        //       value: 1483718400000,
        //     },
        //   ],
        // }
      }}
      data={data}
    />
  </Wcontainer>
));
