import React, { useState, useEffect } from 'react';

import { storiesOf } from '@storybook/react';

import { Wcontainer, Wline, Wbar, Wpie, Wscatter } from '@alicloud/cloud-charts';

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
        // symbol: true,
        // spline: true,
        area: true,
        slider: true,
        animate: {
          update: false,
        },
      }}
      data={lineData}
      force
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
        animate: {
          // enter: false,
          update: false,
          // leave: false,
        },
        // columnWidthRatio: 1,
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
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    <Wpie
      height="300"
      config={{
        autoFormat: true,
      }}
      data={pieData}
    />
    <Wpie height="300" config={{}} data={pieData} />
  </div>
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

stories.add('数据从无到有', () => {
  const [d, setD] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(lineData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wline
        height="300"
        config={{
          area: true,
        }}
        data={d}
      />
    </Wcontainer>
  );
});
