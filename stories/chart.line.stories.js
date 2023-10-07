import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import { Wcontainer, Wline } from '@alicloud/cloud-charts';

const data = [
  {
    name: '机房A',
    data: [
      [1483372800000, 4092],
      [1483459200000, 1592],
      [1483545600000, 3714],
      [1483632000000, 4854],
      [1483718400000, 6514],
      [1483804800000, 9022],
      [1483891200000, 6023],
      [1483977600000, 4018],
    ],
  },
  {
    name: '机房B',
    yAxis: 1,
    // visible: false,
    data: [
      [1483372800000, 6051],
      [1483459200000, 3278],
      [1483545600000, 5175],
      [1483632000000, 6548],
      [1483718400000, 9048],
      [1483804800000, 11394],
      [1483891200000, 8597],
      [1483977600000, 6588],
    ],
  },
];

const stories = storiesOf('Wline', module);
stories.addDecorator(withKnobs);

stories.add('折线图', () => <Wline height="300" data={data} />);
stories.add('平滑曲线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        spline: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('带点折线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        symbol: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('面积折线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        area: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('面积曲线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        // area: true,
        spline: true,
        guide: {
          line: [
            {
              top: true,
              text: {
                title: '水平线',
                position: 'start',
                // align: 'start',
              },
              // status: 'warning',
              axis: 'y',
              value: 7000,
              // 自定义样式，可设置为虚线
              style: {
                lineDash: [4, 4],
              },
            },
            {
              top: true,
              text: {
                title: '垂直线',
                position: 'end',
                align: 'center',
              },
              status: 'none',
              axis: 'x',
              value: 1483718400000,
            },
          ],
          filter: {
            status: 'error', // normal | success | warning | error
            // 区域位置
            axis: 'x',
            value: [1483718400000, 'max'],
          },
        },
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('堆叠面积图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        area: true,
        stack: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('带网格线', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        grid: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('双轴折线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        yAxis: [{}, {}],
        area: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('拖拽缩放', () => (
  <Wcontainer className="demos">
    <Wline
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

const stepOptions = {
  关闭: null,
  默认: true,
  '水平-垂直': 'hv',
  '垂直-水平': 'vh',
  '水平-垂直-水平': 'hvh',
  '垂直-水平-垂直': 'vhv',
};
stories.add('阶梯折线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        // step: select('阶梯形状', stepOptions, null),
        step: true,
      }}
      data={data}
    />
  </Wcontainer>
));

const singleData = [
  {
    name: '机房A',
    data: [[1483632000000, 4854]],
  },
  {
    name: '机房B',
    yAxis: 1,
    data: [[1483632000000, 6548]],
  },
];
stories.add('单个点折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" data={singleData} force />
  </Wcontainer>
));
stories.add('Tooltip 设置', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        tooltip: {
          titleFormatter: function (v) {
            return 'title: ' + v;
          },
          nameFormatter: function (v) {
            return 'name: ' + v;
          },
          valueFormatter: function (v) {
            return 'value: ' + v;
          },
        },
      }}
      data={data}
    />
  </Wcontainer>
));

const data1 = [];
const data2 = [];

let now = Date.now();
for (var i = 0; i < 30; i++) {
  let t = now - (30 - i) * 1000;
  data1.push([t, Math.round(Math.random() * 60) + 300]);
  data2.push([t, Math.round(Math.random() * 60) + 300]);
}
class NewData extends React.Component {
  state = {
    data: [
      {
        name: '机房A',
        data: data1,
      },
      {
        name: '机房B',
        data: data2,
      },
    ],
  };

  componentDidMount() {
    setInterval(() => {
      let t = Date.now();

      data1.push([t, Math.round(Math.random() * 60) + 300]);
      data2.push([t, Math.round(Math.random() * 60) + 300]);

      data1.shift();
      data2.shift();

      this.setState({
        data: [
          {
            name: '机房A',
            data: data1,
          },
          {
            name: '机房B',
            data: data2,
          },
        ],
      });
    }, 1000);
  }

  render() {
    return (
      <Wcontainer className="demos">
        <Wline height="300" config={{}} data={this.state.data} />
      </Wcontainer>
    );
  }
}
stories.add('动态数据', () => <NewData />);

stories.add('修改shape', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        // guide: {
        //   line: {
        //     top: true,
        //     text: '80%',
        //     status: 'error',
        //     axis: 'x',
        //     value: 1483718400000,
        //   },
        //   filter: {
        //     status: 'error', // normal | success | warning | error
        //     // 区域位置
        //     axis: 'x',
        //     value: [1483718400000, 'max'],
        //   },
        // },
        area: true,
        // 还要考虑选中状态样式
        symbol: {
          // shape支持函数？
          shape: 'square', // 内置图形, 'circle', 'diamond', 'square', 'triangle', 'triangle-down'
          size: 6, // 大小
          geomStyle: {
            // 样式
            // stroke: 'red',
            fill: 'red',
            lineWidth: 1,
          },
        },
      }}
      data={data}
    />
  </Wcontainer>
));

stories.add('数据从有到无', () => {
  const [d, setD] = useState(data);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD([]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wline
        height="300"
        config={{
          area: true,
          legend: {
            nameFormatter: function (v, data) {
              return 'name:' + v;
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

// // 齐全度展示图
// const attendData = [
//   {
//     x: 1483372800000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483459200000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483545600000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483632000000,
//     y: 1,
//     type: 'error',
//   },
//   {
//     x: 1483718400000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483804800000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483891200000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483977600000,
//     y: 1,
//     type: 'error'
//   }
// ].map(d => {
//   return {
//     ...d,
//     detail: [
//       { name: 'all', value: 100 },
//       { name: '111', value: 80 },
//       { name: '222', value: 20 },
//     ],
//   };
// });
//
// const attendCustomChart = {
//   // 不转换格式
//   convertData: false,
//   init(chart, config, data) {
//     chart.source(data, {
//       x: {
//         type: 'timeCat',
//         mask: 'YYYY-MM-DD HH:mm:ss',
//       },
//       // 柱高度为 0～1，设置 Y 轴跨度为 -1～2，保证柱高度占中心三分之一
//       y: {
//         min: -1,
//         max: 2,
//       }
//     });
//
//     // 关闭坐标轴
//     chart.axis(false);
//
//     // 关闭图例
//     chart.legend(false);
//
//     chart.tooltip({
//       crosshairs: {
//         type: 'y'
//       },
//       inPlot: false,
//     });
//
//     // 自定义 tooltip 展示
//     chart.on('tooltip:change', function(ev) {
//       const items = ev.items; // tooltip显示的项
//       const origin = items[0]; // 将一条数据改成多条数据
//       const detail = origin.point._origin.detail;
//       items.splice(0); // 清空
//       detail.forEach((d) => {
//         const color = d.value < 100 ? Util.getStatusColor('error') : Util.getStatusColor('success');
//         items.push(Object.assign({}, origin, {
//           name: d.name,
//           value: d.value,
//           color: color,
//           marker: {
//             ...origin.marker,
//             fill: color,
//           },
//         }));
//       });
//     });
//
//     // 柱图模拟多色直线
//     chart.interval()
//       .position('x*y')
//       .shape('funnel')
//       .color('type', (type) => {
//         if (type === 'error') {
//           return Util.getStatusColor('error');
//         }
//         return Util.getStatusColor('success');
//       });
//
//     chart.render();
//   }
// };
//
// function Attend() {
//   return (
//     <Wcontainer>
//       <Wline height="24" data={attendData} customChart={attendCustomChart} />
//     </Wcontainer>
//   );
// }
// stories.add('齐全度展示图', () => (
//   <Attend />
// ));

const rangeAreaData = [
  {
    name: '平均值',
    data: [
      [1483372800000, 3592],
      [1483459200000, 6092],
      [1483545600000, 5714],
      [1483632000000, 5984],
      [1483718400000, 8514],
      [1483804800000, 8666],
      [1483891200000, 8023],
      [1483977600000, 6018],
    ],
  },
  {
    name: '范围',
    data: [
      [1483372800000, [1592, 5135]],
      [1483459200000, [4092, 8341]],
      [1483545600000, [3714, 7561]],
      [1483632000000, [3984, 8321]],
      [1483718400000, [6514, 10000]],
      [1483804800000, [6666, 10000]],
      [1483891200000, [6023, 10000]],
      [1483977600000, [4018, 8654]],
    ],
  },
];
stories.add('区域面积图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
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
      }}
      data={rangeAreaData}
    />
  </Wcontainer>
));

stories.add('带虚线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        geomStyle: {
          lineDash(x, y, type) {
            console.log('dash', x, y, type);
            if (type === '机房B') {
              return [4, 4];
            }
            return null;
          },
          lineWidth(x, y, type) {
            // console.log('width', x, y, type);
            if (type === '异常点') {
              return 0;
            }
            return 2;
          },
        },
        symbol: {
          size: (type) => {
            if (type === '异常点') {
              return 4;
            } else {
              return 0;
            }
          },
        },
        // geomStyle(x, y, type) {
        //   if (type === '机房B') {
        //     return {
        //       lineDash: [4,4],
        //     }
        //   }
        //   return {};
        // }
      }}
      data={data}
    />
  </Wcontainer>
));

stories.add('带区域渲染折线 changeSize', () => {
  const c = {
    // "padding": [
    //   10,
    //   20,
    //   30,
    //   30
    // ],
    yAxis: {
      min: 0,
    },
    xAxis: {
      type: 'time',
      mask: 'YYYY-MM-DD',
    },
    tooltip: {},
    guide: {
      area: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
      filter: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
    },
    colors: ['#A5B0BD'],
    symbol: true,
    legend: false,
  };
  return (
    <Wline
      config={c}
      data={[
        {
          name: '资源健康度',
          data: [
            [1649174400000, 79],
            [1650038400000, 0],
            [1650902400000, 79.56],
            [1651766400000, 79.62],
            [1652198400000, 0],
          ],
        },
      ]}
    />
  );
});

const multipleData = [
  {
    name: '',
    data: [
      [1483372800000, 1592],
      [1483459200000, 1092],
      [1483545600000, 1714],
      [1483632000000, 2984],
      [1483718400000, 3514],
      [1483804800000, 3666],
      [1483891200000, 3023],
      [1483977600000, 3018],
    ],
  },
  {
    name: '',
    data: [
      [1483372800000, 2592],
      [1483459200000, 2092],
      [1483545600000, 3714],
      [1483632000000, 4984],
      [1483718400000, 7514],
      [1483804800000, 7666],
      [1483891200000, 7023],
      [1483977600000, 5018],
    ],
  },
  {
    name: '机房C',
    data: [
      [1483372800000, 7592],
      [1483459200000, 9092],
      [1483545600000, 8714],
      [1483632000000, 8984],
      [1483718400000, 11514],
      [1483804800000, 11666],
      [1483891200000, 11023],
      [1483977600000, 9018],
    ],
  },
];

stories.add('不指定name', () => <Wline height="300" data={multipleData} />);

const zeroData = [
  {
    name: '机房A',
    data: [
      [1483372800000, 4092],
      [1483459200000, 1592],
      [1483545600000, 3714],
      [1483632000000, 4854],
      [1483718400000, 6514],
      [1483804800000, 9022],
      [1483891200000, 6023],
      [1483977600000, 4018],
    ],
  },
  {
    name: '机房B',
    yAxis: 1,
    // visible: false,
    data: [
      [1483372800000, 0],
      [1483459200000, 0],
      [1483545600000, 0],
      [1483632000000, 0],
      [1483718400000, 0],
      [1483804800000, 0],
      [1483891200000, 0],
      [1483977600000, 0],
    ],
  },
  {
    name: '机房C',
    data: [
      [1483372800000, 1592],
      [1483459200000, 1092],
      [1483545600000, 1714],
      [1483632000000, 2984],
      [1483718400000, 3514],
      [1483804800000, 3666],
      [1483891200000, 3023],
      [1483977600000, 3018],
    ],
  },
  {
    name: '机房D',
    data: [
      [1483372800000, 2592],
      [1483459200000, 2092],
      [1483545600000, 3714],
      [1483632000000, 4984],
      [1483718400000, 7514],
      [1483804800000, 7666],
      [1483891200000, 7023],
      [1483977600000, 5018],
    ],
  },
  {
    name: '机房Es',
    data: [
      [1483372800000, 7592],
      [1483459200000, 9092],
      [1483545600000, 8714],
      [1483632000000, 8984],
      [1483718400000, 11514],
      [1483804800000, 11666],
      [1483891200000, 11023],
      [1483977600000, 9018],
    ],
  },
];

stories.add('可筛选出全为0的线图', () => <Wline height="300" data={zeroData} />);

stories.add('极端数据场景（少）', () => {
  const [d, setD] = useState([
    {
      name: '浏览器占比',
      data: [
        [1483459200000, 1592],
        [1483545600000, 3714],
        [1483632000000, 4854],
        [1483718400000, 6514],
      ],
    },
  ]);
  const [d2, setD2] = useState(data);
  const [d3, setD3] = useState(data);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(data);
      setD2([
        {
          name: '浏览器占比',
          data: [
            [1483459200000, 1592],
            [1483545600000, 3714],
            [1483632000000, 4854],
            [1483718400000, 6514],
          ],
        },
      ]);
    }, 2000);
    setD3();
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Wcontainer className="demos" title="极端少-不极端">
        <Wline
          height="300"
          config={{
            area: true,
            legend: {
              nameFormatter: function (v, data) {
                return 'name:' + v;
              },
              valueFormatter: function (v, data) {
                return v + '%';
              },
            },
          }}
          data={d}
          // force // 测试强制开关
        />
      </Wcontainer>
      <Wcontainer title="不极端-极端少">
        <Wline
          height="300"
          config={{
            area: true,
            legend: {
              nameFormatter: function (v, data) {
                return 'name:' + v;
              },
              valueFormatter: function (v, data) {
                return v + '%';
              },
            },
          }}
          data={d2}
        />
      </Wcontainer>
      <Wcontainer className="demos" title="不极端-大数据">
        <Wline
          height="300"
          config={{
            area: true,
            legend: {
              nameFormatter: function (v, data) {
                return 'name:' + v;
              },
              valueFormatter: function (v, data) {
                return v + '%';
              },
            },
          }}
          data={d}
        />
      </Wcontainer>
    </>
  );
});

const timeData = {
  year_1: [
    // 跨年，间隔大于一年
    {
      name: '机房A',
      data: [
        [1483372800000, 1592],
        [1583372800000, 1592],
        [1683561600000, 4092],
      ],
    },
  ],
  year_2: [
    // 跨年，间隔小于半年，大于1个月
    {
      name: '机房A2222222222222222222222222222222222231231231fwefq141331231231fwefq1413',
      data: [
        [1670515200000, 1592],
        // [1673193600000, 2222],
        // [1673280000000, 4092],
      ],
    },
  ],
  year_3: [
    // 跨年，间隔为1个月
    {
      name: '机房A',
      data: [
        [1670515200000, 2222],
        [1673193600000, 2222],
        [1675872000000, 2222],
        [1678291200000, 2222],
        [1680969600000, 1592],
        [1683561600000, 4092],
      ],
    },
  ],
};
stories.add('测试跨度', () => (
  <div
    style={{
      display: 'flex',
    }}
  >
    <div
      style={{
        flex: '0 0 calc(50% - 10px)',
      }}
    >
      <Wline
        height="300"
        data={timeData.year_1}
        config={
          {
            // xAxis: {
            //   nice: false
            // }
          }
        }
      />
    </div>
    <div
      style={{
        flex: '0 0 calc(50% - 10px)',
      }}
    >
      <Wline height="300" data={timeData.year_2} config={{}} />
    </div>
  </div>
));

const onePoint = [
  {
    name: '浏览器占比',
    data: [[1483459200000, 1592]],
  },
];

const twoPoint = [
  {
    name: '浏览器占比',
    data: [
      [1670515200000, 2222],
      [1683561600000, 4092],
    ],
  },
];

const twoLine = [
  {
    name: 'A',
    data: [[1670515200000, 2222]],
  },
  {
    name: 'B',
    data: [[1683561600000, 4092]],
  },
];

stories.add('极端数据测试', () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Wline height="300" data={onePoint} config={{ label: { labelFormatter: () => 'test' } }} />
    <Wline height="300" data={twoPoint} config={{}} />
    <Wline height="300" data={twoLine} config={{}} />
  </div>
));

stories.add('带标签折线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      config={{
        symbol: true,
        label: true,
      }}
      data={data}
    />
  </Wcontainer>
));

stories.add('legend单选', () => (
  <Wline height="300" data={data} config={{ legend: { useReverseChecked: false } }} />
));
