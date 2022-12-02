import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wbar, Wcontainer } from '@alife/aisc-widgets';

const data = [
  {
    name: '柱1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 100],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
  {
    name: '柱2',
    data: [
      ['一', 92],
      ['二', 15],
      ['三', 4],
      ['四', 49],
      ['五', 64],
      ['六', 76],
      ['七', 21],
      ['八', 100],
      ['九', 71],
    ],
  },
];

const stories = storiesOf('Wbar', module);
stories.add('柱状图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{}} data={data} />
  </Wcontainer>
));

const test = [
  {
    name: '柱1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 100],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
];

stories.add('数据与尺寸同时变', () => {
  const [chartData, setChartData] = useState(test);

  useEffect(() => {
    const timer = setTimeout(() => {
      const changedData = test.map((group) => ({
        name: group.name,
        data: group.data.slice(0, 3),
      }));
      setChartData(changedData);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" width={chartData[0].data.length * 50} config={{}} data={chartData} />
    </Wcontainer>
  );
});

stories.add('堆叠柱状图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        stack: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('极坐标堆叠柱状图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        stack: true,
        // size: 2 * 360 / 9,
        polar: true,
        innerRadius: 0.2,
      }}
      data={data}
    />
  </Wcontainer>
));

const yuData = data.slice(0, 1);
yuData[0].data = yuData[0].data.slice(0, 5).sort((a, b) => {
  return a[1] - b[1];
});
// console.log(yuData)
stories.add('玉玦图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="360"
      config={{
        polar: true,
        column: false,
        innerRadius: 0.2,
      }}
      data={yuData}
    />
  </Wcontainer>
));
stories.add('横向柱状图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        column: false,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('带网格线', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        grid: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('拖拽缩放', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        zoom: true,
      }}
      data={data}
      event={{
        'zoom:start': (s) => {
          action('zoom:start')(s);
        },
        'zoom:end': (s) => {
          action('zoom:end')(s);
        },
        'zoom:reset': (s) => {
          action('zoom:reset')(s);
        },
      }}
    />
  </Wcontainer>
));

stories.add('点击下钻', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        zoom: true,
        geomStyle: {
          cursor: 'pointer',
        },
      }}
      data={data}
      event={{
        'interval:click': (s) => {
          action('interval:click')(s);
        },
      }}
    />
  </Wcontainer>
));

let data2 = [
  {
    name: '柱1',
    facet: '分面1',
    data: [],
  },
  {
    name: '柱2',
    facet: '分面2',
    data: [],
  },
  // {
  //     "name":"柱3",
  //     "facet": '分面1',
  //     "data":[]
  // },
  // {
  //     "name":"柱4",
  //     "facet": '分面2',
  //     "data":[]
  // }
];
for (let i = 0; i < 6; i++) {
  const name = i + '------' + i;
  data2[0].data.push([name, Math.round(Math.random() * 1000000) / 10000]);
  data2[1].data.push([name, Math.round(Math.random() * 1000000) / 10000]);
  // data2[2].data.push([name, Math.random() * 100 + 100]);
  // data2[3].data.push([name, Math.random() * 100 + 100]);
}
let options1 = {
  padding: [40, 32, 12, 32],
  colors: ['#43BF7E', '#297ACC'],
  column: false,
  xAxis: {
    visible: false,
  },
  facet: {
    padding: [0, 0, 12, 0],
    spacing: [0, 0],
  },
  label: {
    position: 'right',
    callback(_v, facet) {
      return {
        style: {
          textAlign: facet.columnIndex === 1 ? 'start' : 'end',
          fill: facet.columnIndex === 1 ? '#297ACC' : '#43BF7E',
        },
      };
    },
  },
  columnWidthRatio: 0.4,
  geomStyle(x, y, type) {
    if (type === '柱1') {
      return {
        // 设置柱形状的圆角
        radius: [0, 0, 2, 2],
      };
    }
    if (type === '柱2') {
      return {
        // 设置柱形状的圆角
        radius: [2, 2, 0, 0],
      };
    }
  },
  // colors: [COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory3, COLORS.widgetsColorCategory3],
};
const tempData = [
  {
    name: '碳排量',
    data: [
      ['联通', 0.0061],
      ['自建', 10.9167],
    ],
    facet: '分面1',
  },
  {
    name: '度电排量',
    data: [
      ['联通', 0.0006],
      ['自建', 0.0009],
    ],
    facet: '分面2',
  },
];
const tempData_2 = [
  {
    name: '碳排量',
    data: [
      ['联通', 0.0061],
      ['自建', 10.9167],
    ],
    facet: '分面1',
  },
  {
    name: '度电排量',
    data: [
      ['联通', 5.0061],
      ['自建', 10.9167],
    ],
    facet: '分面2',
  },
];
stories.add('镜面柱图', () => {
  return (
    <Wcontainer className="demos">
      <Wbar height="300" config={options1} data={data2} />
    </Wcontainer>
  );
});

const config_2 = {
  padding: [40, 24, 20, 44],
  marginRatio: 0.05,
  facet: true,
};
stories.add('多视图情况下（数据更新）', () => {
  const [d, setD] = useState(tempData);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(tempData_2);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" config={options1} data={d} />
    </Wcontainer>
  );
});

let data3 = [
  {
    name: '柱1',
    dodge: '分组1',
    data: [],
  },
  {
    name: '柱5',
    dodge: '分组1',
    data: [],
  },
  {
    name: '柱2',
    dodge: '分组2',
    data: [],
  },
  {
    name: '柱3',
    dodge: '分组2',
    data: [],
  },
  {
    name: '柱4',
    dodge: '分组2',
    data: [],
  },
];
for (let i = 0; i < 10; i++) {
  const name = i + '-' + i;
  data3[0].data.push([name, Math.random() * 100 + 100]);
  data3[1].data.push([name, Math.random() * 100 + 100]);
  data3[2].data.push([name, Math.random() * 100 + 100]);
  data3[3].data.push([name, Math.random() * 100 + 100]);
  data3[4].data.push([name, Math.random() * 100 + 100]);
}
let options2 = {
  dodgeStack: true,
};

let data4 = [
  {
    name: '柱1',
    data: [['一', 56]],
  },
];

stories.add('分组堆叠图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={options2} data={data3} />
  </Wcontainer>
));

stories.add('从有数据到无数据', () => {
  const [d, setD] = useState(data);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD([]);
      // setD([{ name: '浏览器占比', data: [] }]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          zoom: true,
          geomStyle: {
            cursor: 'pointer',
          },
          legend: {
            showData: true,
            nameFormatter: function (v, data) {
              return v + '%';
            },
            valueFormatter: function (v, data) {
              return v + '%';
            },
          },
        }}
        data={d}
      />
    </Wcontainer>
  );
});
stories.add('百分比堆叠柱状图', () => {
  const [d, setD] = useState(data);
  useEffect(() => {
    setTimeout(() => {
      setD(data4);
    }, 2000);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          percentage: true,
          stack: true,
          yAxis: {
            max: 1,
            min: 0,
            labelFormatter(value) {
              return (value * 100).toFixed(2) + '%';
            },
          },
        }}
        data={d}
      />
    </Wcontainer>
  );
});

stories.add('分组百分比堆叠柱状图', () => {
  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          percentage: true,
          dodgeStack: true,
          yAxis: {
            max: 1,
            min: 0,
            labelFormatter: function (value) {
              return (value * 100).toFixed(2) + '%';
            },
          },
          tooltip: {
            nameFormatter: function (v, data) {
              return data.dodge + '-' + v;
            },
            valueFormatter: function (v) {
              return (v * 100).toFixed(2) + '%';
            },
          },
        }}
        data={data3}
      />
    </Wcontainer>
  );
});

stories.add('横向柱图（从右往左）', () => {
  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          // maxSize: 24
          column: {
            reflect: true,
          },
          guide: {
            line: {
              // 显示标题相关
              text: {
                title: '警戒线',
                autoRotate: false,
              },
              status: 'error', // normal | success | warning | error
              // 线位置
              axis: 'y',
              value: 50,
            },
            filter: {
              status: 'error', // normal | success | warning | error
              // 区域位置
              axis: 'y',
              value: [50, 'max'],
            },
          },
        }}
        data={data4}
      />
    </Wcontainer>
  );
});

const facetData = [
  {
    name: '柱1',
    facet: '分面1',
    data: [],
  },
  {
    name: '柱2',
    facet: '分面2',
    data: [],
  },
];

for (let i = 0; i < 8; i++) {
  const name = i + '-' + i;
  facetData[0].data.push([name, Math.round(Math.random() * 50 + 50 + i * 20)]);
  facetData[1].data.push([name, Math.round(Math.random() * 50 + 50 + i * 10)]);
}

stories.add('分面柱状图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        column: false,
        xAxis: {
          visible: false,
        },
        facet: {
          padding: [0, 0, 12, 0],
          spacing: [0, 0],
        },
      }}
      data={facetData}
    />
  </Wcontainer>
));
