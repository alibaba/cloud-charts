import React, { useState, useEffect } from 'react';

import { storiesOf } from '@storybook/react';

import { Wcontainer, Wline, Wbar, Wpie, Wscatter } from '@alicloud/cloud-charts';

function generateData(number) {
  const random = (seed) => {
    return '0.' + Math.sin(seed).toString().substr(6);
  };

  const res = [
    {
      name: '平均值',
      data: [],
    },
    {
      name: '范围',
      data: [],
    },
  ];

  const now = Date.now();
  for (let i = 0; i < number; i++) {
    const t = now - (3000 - i) * 1000;
    const value = +random(t);
    res[0].data.push([t, value]);
    res[1].data.push([t, value - 0.4, value + 0.4]);
  }

  return res;
}

const stories = storiesOf('bigdata', module);

const lineData = generateData(400);

stories.add('线图（time）', () => (
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
        area: {
          geomStyle(x, y, type, extra) {
            if (type === '平均值') {
              return {
                opacity: 0,
                fill: 'transparent',
              };
            }
            return {};
          },
        },
        geomStyle(x, y, type, extra) {
          if (type === '范围') {
            return {
              opacity: 0,
              fill: 'transparent',
              stroke: 'transparent',
            };
          }
          return {};
        },
        // slider: true,
        animate: {
          update: false,
        },
      }}
      data={lineData}
      // force={true}
    />
  </Wcontainer>
));

stories.add('线图（cat）', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        xAxis: {
          type: 'cat',
        },
        // legend: {
        //   foldable: true,
        // },
        symbol: true,
        // spline: true,
        area: true,
      }}
      data={lineData}
      // force={true}
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
        // legend: {
        //   foldable: true,
        // },
        // slider: true,
        // animate: {
        //   // enter: false,
        //   update: false,
        //   // leave: false,
        // },
        // columnWidthRatio: 1,
      }}
      data={barData}
      // force={{
      //   bigdata: true,
      // }}
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

stories.add('从大数据变普通数据（线图）', () => {
  const [d, setD] = useState(lineData);
  useEffect(() => {
    const timer = setTimeout(() => {
      const newData = generateData(10);
      setD(newData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wline
        height="300"
        config={{
          area: true,
          xAxis: {
            type: 'cat',
          },
        }}
        data={d}
      />
    </Wcontainer>
  );
});

const simplePieData = [
  {
    name: '饼图测试数据',
    data: [
      ['a', 40.5],
      ['e', 7.1],
      ['b', 27.9],
      ['c', 24.1],
    ],
  },
];

stories.add('从大数据变普通数据（饼图）', () => {
  const [d, setD] = useState(pieData);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(simplePieData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wpie
        height="300"
        config={{
          autoFormat: true,
        }}
        data={d}
      />
    </Wcontainer>
  );
});

stories.add('更改配置项', () => {
  const [format, setFormat] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormat(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wpie
        height="300"
        config={{
          autoFormat: format,
        }}
        data={pieData}
      />
    </Wcontainer>
  );
});
