import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wcontainer, Wline, Wbar, Wpie, Wscatter } from '@alife/aisc-widgets';

function generateData(number) {
  const random = (seed) => {
    return '0.' + Math.sin(seed).toString().substr(6);
  };

  const res = [
    {
      name: '某日监控数据（秒级）',
      data: [],
    },
  ];

  const now = Date.now();
  for (let i = 0; i < number; i++) {
    const t = now - (3000 - i) * 1000;
    const value = +random(t);
    res[0].data.push([t, value]);
  }

  return res;
}

const stories = storiesOf('bigdata', module);

const lineData = generateData(400);

stories.add('线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        xAxis: {
          type: 'time',
          mask: 'HH:mm:ss',
        },
        symbol: true,
        spline: true,
        slider: true,
        area: true,
      }}
      data={lineData}
      // force
    />
  </Wcontainer>
));

const barData = generateData(300);

stories.add('柱状图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        xAxis: {
          type: 'timeCat',
          mask: 'HH:mm:ss',
        },
        slider: true,
      }}
      data={barData}
    />
  </Wcontainer>
));

const pieData = [
  {
    name: '饼图测试数据',
    data: [
      ['a', 40.5],
      ['b', 27.9],
      ['c', 24.1],
      ['d', 15.5],
      ['e', 7.1],
      ['f', 5.6],
      ['g', 3.2],
      ['h', 2.3],
      ['i', 1.5],
      ['j', 0.3],
      ['k', 0.2],
    ],
  },
];

stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{}} data={pieData} />
  </Wcontainer>
));

const scatterData = generateData(2000);

stories.add('散点图', () => (
  <Wcontainer className="demos">
    <Wscatter
      height="300"
      config={{
        xAxis: {
          type: 'time',
          mask: 'HH:mm:ss',
        },
      }}
      data={scatterData}
    />
  </Wcontainer>
));
