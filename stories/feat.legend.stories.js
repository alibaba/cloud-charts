import React, { useEffect, useRef, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import {
  Wcontainer,
  Wline,
  Wlinebar,
  Wpie,
  Wbar,
  WmultiPie,
  ChartProvider,
  Wheatmap,
  themes,
} from '@alicloud/cloud-charts';


const data = [
  {
    name: '机房A',
    data: [
      [1483372800000, 4092],
      [1483459200000, 1592],
      // [1483545600000, 3714],
      // [1483632000000, 4854],
      // [1483718400000, 6514],
      // [1483804800000, 9022],
      // [1483891200000, 6023],
      // [1483977600000, 4018],
    ],
  },
  // {
  //   "name":"机房B",
  //   "yAxis": 1,
  //   "data":[[1483372800000,6051],[1483459200000,3278],[1483545600000,5175],[1483632000000,6548],[1483718400000,9048],[1483804800000,11394],[1483891200000,8597],[1483977600000,6588]]
  // }
];

const lineBarData = [
  {
    name: '机房1',
    type: 'bar',
    data: [
      [1483372800000, 1892],
      [1483459200000, 7292],
      [1483545600000, 5714],
      [1483632000000, 5354],
      [1483718400000, 2014],
      [1483804800000, 22],
      [1483891200000, 11023],
      [1483977600000, 5218],
      [1484064000000, 8759],
      [1484150400000, 9981],
      [1484236800000, 4533],
      [1484323200000, 11398],
      [1484409600000, 1064],
      [1484496000000, 6494],
    ],
  },
  {
    name: '机房2',
    type: 'bar',
    data: [
      [1483372800000, 182],
      [1483459200000, 792],
      [1483545600000, 514],
      [1483632000000, 554],
      [1483718400000, 204],
      [1483804800000, 22],
      [1483891200000, 1023],
      [1483977600000, 528],
      [1484064000000, 879],
      [1484150400000, 981],
      [1484236800000, 453],
      [1484323200000, 1198],
      [1484409600000, 1064],
      [1484496000000, 694],
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
      [1484064000000, 2085],
      [1484150400000, 492],
      [1484236800000, 2965],
      [1484323200000, 4246],
      [1484409600000, 2160],
      [1484496000000, 11877],
    ],
  },
  {
    name: '机房4',
    type: 'line',
    yAxis: 1,
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

const stories = storiesOf('legend', module);
stories.addDecorator(withKnobs);
// const handleClick = action('onClick');
// stories.add('config.legend.onClick', () => (
//   <Wcontainer className="demos">
//     <Wline height="300" config={{
//       legend: {
//         // onClick: (e) => {
//         //   handleClick('config.legend.onClick', e);
//         // },
//       }
//     }} data={data} />
//   </Wcontainer>
// ));
//
// function LineLegendClick() {
//   const chart = useRef();
//   useEffect(() => {
//     if (chart.current) {
//       const legend = chart.current.get('legendController').legends['top-center'][0];
//       legend && legend.on('itemclick', handleClick);
//     }
//   }, []);
//   return (
//     <Wcontainer className="demos">
//       <Wline getChartInstance={c => (chart.current = c)} height="300" data={data} />
//     </Wcontainer>
//   );
// }
// stories.add('线图图例点击', () => (
//   <LineLegendClick />
// ));
//
// function LineBarLegendClick() {
//   const chart = useRef();
//   useEffect(() => {
//     if (chart.current) {
//       const legends = chart.current.get('legendController').legends['top-center'];
//       legends[0] && legends[0].on('itemclick', handleClick);
//       legends[1] && legends[1].on('itemclick', handleClick);
//     }
//   }, []);
//   return (
//     <Wcontainer className="demos">
//       <Wlinebar getChartInstance={c => (chart.current = c)} height="300" data={lineBarData} />
//     </Wcontainer>
//   );
// }
// stories.add('线柱图图例点击', () => (
//   <LineBarLegendClick />
// ));

const positionOptions = {
  顶部: 'top',
  底部: 'bottom',
};
const alignOptions = {
  左: 'left',
  中: 'center',
  右: 'right',
};
const radioOptions = {
  上左: 'top-left',
  上中: 'top',
  上右: 'top-right',
  下左: 'bottom-left',
  下中: 'bottom',
  下右: 'bottom-right',
  左上: 'left-top',
  左中: 'left',
  左下: 'left-bottom',
  右上: 'right-top',
  右中: 'right',
  右下: 'right-bottom',
};
stories.add('图例位置测试-line', () => (
  <div style={{ width: 800, height: 500 }}>
    <Wbar
      // height="300"
      config={{
        legend: {
          // position: select('上下位置', positionOptions, 'top'),
          // align: select('左右分布', alignOptions, 'left'),
          position: radios('位置', radioOptions, 'top'),
          align: '',
        },
      }}
      data={data}
      // force={false}
    />
  </div>
));

stories.add('图例位置测试-linebar', () => (
  <Wcontainer className="demos">
    <Wlinebar
      height="300"
      config={{
        legend: {
          // position: select('上下位置', positionOptions, 'top'),
          // align: select('左右分布', alignOptions, 'left'),
          position: radios('位置', radioOptions, 'top'),
          align: '',
        },
      }}
      data={lineBarData}
    />
  </Wcontainer>
));

const pieData = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
    ],
  },
];
stories.add('图例位置测试-pie', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        legend: {
          position: radios('位置', radioOptions, 'top'),
          align: '',
        },
      }}
      data={pieData}
    />
  </Wcontainer>
));

const longData = [
  {
    name: '机房A机房A机房A机房A机房A机房A机房A',
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
    type: 'line',
  },
  {
    name: '机房B机房B机房B机房B机房B机房B',
    type: 'line',
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
  {
    name: '机房C机房C机房C机房C机房C机房C',
    yAxis: 1,
    type: 'bar',
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
  {
    name: '机房D机房D机房D机房D机房D机房D',
    yAxis: 1,
    type: 'bar',
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
  {
    name: '机房E机房E机房E机房E机房E机房E',
    yAxis: 1,
    type: 'bar',
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
  {
    name: '机房F机房F机房F机房F机房F机房F',
    yAxis: 1,
    type: 'bar',
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
stories.add('超长图例截取', () => (
  <Wcontainer className="demos">
    <Wlinebar
      width="400"
      height="300"
      config={{
        legend: {
          customConfig: {
            maxItemWidth: 100,
          },
        },
      }}
      data={longData}
    />
  </Wcontainer>
));

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
  // percentage: true,
  legend: {
    dodge: true,
    showData: true,
    // foldable: true,
  },
  tooltip: {
    dodge: true,
  },
};

stories.add('分组 - 柱图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={options2} data={data3} />
  </Wcontainer>
));

let data4 = [
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
  {
    name: '柱3',
    facet: '分面1',
    data: [],
  },
  {
    name: '柱4',
    facet: '分面2',
    data: [],
  },
];

for (let i = 0; i < 10; i++) {
  const name = i + '-' + i;
  data4[0].data.push([name, Math.random() * 100 + 100]);
  data4[1].data.push([name, Math.random() * 100 + 100]);
  data4[2].data.push([name, Math.random() * 100 + 100]);
  data4[3].data.push([name, Math.random() * 100 + 100]);
}

stories.add('镜面柱图 - 分组图例', () => {
  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          marginRatio: 0.05,
          facet: true,
          padding: [20, 20],
          legend: {
            dodge: true,
          },
          tooltip: {
            dodge: true,
          },
        }}
        data={data4}
      />
    </Wcontainer>
  );
});

const pieData2 = {
  name: 'root',
  value: 0,
  children: [
    {
      name: '计算',
      dodge: '计算',
      children: [
        {
          name: 'root-0-0',
          value: 17,
        },
        {
          name: 'root-0-1',
          value: 97,
        },
      ],
    },
    {
      name: '存储',
      dodge: '存储',
      children: [
        {
          name: 'root-1-0',
          value: 16,
        },
        {
          name: 'root-1-1',
          value: 130,
        },
      ],
    },
    {
      name: '网络',
      dodge: '网络',
      children: [
        {
          name: 'root-2-0',
          value: 2,
        },
        {
          name: 'root-2-1',
          value: 17,
        },
        {
          name: 'root-2-2',
          value: 26,
        },
        {
          name: 'root-2-3',
          value: 100,
        },
      ],
    },
  ],
};

stories.add('分组 - 饼图', () => (
  <Wcontainer className="demos">
    <WmultiPie
      height="300"
      config={{
        cycle: true,
        // innerRadius: 0.6,
        colors: [
          '#297acc',
          '#43bf7e',
          '#8a87f5',
          '#4d91d6',
          '#75aae0',
          '#62cc94',
          '#84d9ac',
          '#a19ef7',
          '#b8b6fa',
          '#cecdfa',
          '#e6e6fc',
        ],
        legend: {
          showData: true,
          dodge: true,
          // table: true
        },
        innerContent: true,
      }}
      data={pieData2}
    />
  </Wcontainer>
));

const lineData = [
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
  {
    name: '异常点',
    data: [
      [1483372800000, 2051],
      [1483459200000, 3278],
      [1483545600000, 4175],
      [1483632000000, 2548],
      [1483718400000, 1048],
      [1483804800000, 1394],
      [1483891200000, 5597],
      [1483977600000, 3588],
    ],
  },
];

const multipleData = [];

for (let i = 0; i < 21; i++) {
  const group = {
    name: `曲线fasgkghfdjgaskhgkdjsgbkajdbga,mdsngdsamn,gbds,mbmfadsfdsafdsaadsdsgadfsxgvafdxgsgahgfkjk ${
      i + 1
    }`,
    data: [],
  };
  for (let j = 0; j < 24; j++) {
    const time = `2020-01-01 ${j}:00:00`;
    group.data.push([time, Math.round(Math.random() * 10) + 100 + i * 10]);
  }
  multipleData.push(group);
}

stories.add('列表型legend', () => {
  const [d, setD] = useState(lineData);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setD(multipleData);
  //   }, 3000);
  // }, []);
  return (
    <div>
      <Wline
        // height="300"
        data={d}
        config={{
          yAxis: {
            labelFormatter: (value) => {
              return `${value / 1000}K`;
            },
          },
          legend: {
            // position: 'right',
            table: {
              statistics: ['min', 'max', 'avg', 'current'],
            },
            valueFormatter: (value) => {
              return `${(value / 1000).toFixed(3)}K`;
            },
          },
        }}
      />
    </div>
  );
});

stories.add('列表型legend(config变化)', () => {
  const [config, setConfig] = useState({});
  useEffect(() => {
    setTimeout(() => {
      setConfig({
        legend: {
          visible: true,
          // position: 'right',
          table: {
            statistics: ['min', 'max', 'avg', 'current'],
          },
        },
      });
    }, 3000);
  }, []);

  return (
    <div style={{ width: 800, height: 300 }}>
      <Wpie
        // height="300"
        data={pieData}
        config={config}
      />
    </div>
  );
});

stories.add('列表型legend（国际化）', () => {
  return (
    <div>
      <ChartProvider language="en-us" locale={{ min: 'test' }}>
        <Wline
          height="300"
          // language="zh-cn"
          data={lineData}
          config={{
            legend: {
              // visible: false,
              // position: 'right',
              table: {
                statistics: ['min', 'max', 'avg'],
              },
            },
          }}
        />
      </ChartProvider>
    </div>
  );
});

stories.add('列表型legend（多条线）', () => {
  return (
    <div>
      <Wline
        height="300"
        data={multipleData}
        config={{
          legend: {
            // position: 'right',
            table: {
              statistics: ['min'],
              decimal: 1,
            },
          },
        }}
      />
    </div>
  );
});

stories.add('列表型legend（右侧）', () => {
  return (
    <div>
      <Wline
        height="300"
        data={multipleData}
        config={{
          legend: {
            position: 'right',
            table: {
              statistics: ['min', 'max', 'avg', 'current'],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('列表型legend（小尺寸）', () => {
  return (
    <div>
      <Wline
        height="300"
        width="200"
        data={multipleData}
        config={{
          legend: {
            table: {
              statistics: ['min', 'max', 'avg', 'current'],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('列表型legend（柱图）', () => {
  return (
    <div>
      <Wbar
        height="300"
        data={lineData}
        config={{
          legend: {
            // position: 'right',
            table: {
              statistics: ['min', 'max', 'avg', 'current'],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('列表型legend（饼图）', () => {
  return (
    <div style={{ width: 800, height: 400 }}>
      <Wpie
        // height="300"
        data={pieData}
        config={{
          legend: {
            position: 'right-top',
            table: {
              statistics: ['min', 'max', 'avg', 'current'],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('legend折叠(数据少时）', () => {
  const [d, setD] = useState(lineData);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setD(multipleData);
  //   }, 3000);
  // }, []);
  return (
    <div style={{ width: 600 }}>
      <Wline
        // height="300"
        data={d}
        config={{
          legend: {
            position: 'bottom-right',
            foldable: true,
          },
        }}
      />
    </div>
  );
});

stories.add('legend折叠(多条线）', () => {
  return (
    <div style={{ width: 600 }}>
      <Wline
        // height="300"
        data={multipleData}
        config={{
          legend: {
            foldable: true,
            showData: true,
          },
        }}
      />
    </div>
  );
});

stories.add('legend折叠(柱图）', () => {
  return (
    <div style={{ width: 600 }}>
      <Wbar
        height="300"
        data={data4}
        config={{
          legend: {
            foldable: true,
          },
        }}
      />
    </div>
  );
});

const pieData3 = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
      ['Firefox111Firefox111', 45.0],
      ['IE111IE111', 26.8],
      ['Chrome111Chrome111', 12.8],
      ['Safari111Safari111', 8.5],
      ['Opera111Opera111', 6.2],
      ['Others111Others222', 0.7],
      ['Firefox111Firefox222', 45.0],
      ['IE111IE222', 26.8],
      ['Chrome111Chrome222', 12.8],
      ['Safari111Safari222', 8.5],
      ['Opera111Opera222', 6.2],
      ['Others111Others222', 0.7],
      ['Chrome111Chrome333', 12.8],
      ['Safari111Safari333', 8.5],
      ['Opera111Opera333', 6.2],
      ['Others111Others333', 0.7],
    ],
  },
];

stories.add('legend折叠(饼图）', () => {
  return (
    <div style={{ width: 600, height: 300 }}>
      <Wpie
        // height="300"
        data={pieData}
        config={{
          legend: {
            // position: 'bottom-left',
            foldable: true,
          },
        }}
      />
    </div>
  );
});

stories.add('legend折叠(线柱图）', () => {
  return (
    <div style={{ width: 600 }}>
      <Wlinebar
        height="300"
        data={lineBarData}
        config={{
          legend: {
            foldable: true,
          },
        }}
      />
    </div>
  );
});

const testData = [
  {
    x: 'ECS 1',
    y: 'time',
    type: 'green',
  },
  {
    x: 'ECS 2',
    y: 'time',
    type: 'red',
  },
  {
    x: 'ECS 3',
    y: 'time',
    type: 'yellow',
  },
  {
    x: 'ECS 4',
    y: 'time',
    type: 'orange',
  },
];

stories.add('阶梯状legend(热力图）', () => {
  return (
    <div style={{ height: 300, width: 600 }}>
      <Wheatmap
        // height="300"
        data={testData}
        config={{
          xAxis: false,
          yAxis: false,
          dataType: 'g2',
          colors: (type) => {
            return themes[`widgets-color-${type}`];
          },
          legend: {
            gradient: {
              valueRange: [100, 0],
              // colors: [
              //   {
              //     type: 'green',
              //     color: '#ffff00',
              //   },
              //   {
              //     type: 'red',
              //     color: '#ff0000',
              //   },
              // ],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('阶梯状legend(线图无意义，纯测试）', () => {
  return (
    <div style={{ width: 600 }}>
      <Wline
        // height="300"
        data={data}
        config={{
          // colors: (type) => {
          //   if (type === 'normal') {
          //     return '#00ff00';
          //   } else if (type === 'p0') {
          //     return '#ff0000';
          //   } else if (type === 'p1') {
          //     return '#0000ff';
          //   } else {
          //     return '#cccccc';
          //   }
          // },
          legend: {
            // table: true,
            gradient: true,
          },
        }}
      />
    </div>
  );
});

const testData = [
  {
    x: 'ECS 1',
    y: 'time',
    type: 'green',
  },
  {
    x: 'ECS 2',
    y: 'time',
    type: 'red',
  },
  {
    x: 'ECS 3',
    y: 'time',
    type: 'yellow',
  },
  {
    x: 'ECS 4',
    y: 'time',
    type: 'orange',
  },
];

stories.add('阶梯状legend(热力图）', () => {
  return (
    <div style={{ height: 300, width: 600 }}>
      <Wheatmap
        // height="300"
        data={testData}
        config={{
          xAxis: false,
          yAxis: false,
          dataType: 'g2',
          colors: (type) => {
            return themes[`widgets-color-${type}`];
          },
          legend: {
            gradient: {
              valueRange: [100, 0],
              // colors: [
              //   {
              //     type: 'green',
              //     color: '#ffff00',
              //   },
              //   {
              //     type: 'red',
              //     color: '#ff0000',
              //   },
              // ],
            },
          },
        }}
      />
    </div>
  );
});

stories.add('阶梯状legend(线图无意义，纯测试）', () => {
  return (
    <div style={{ width: 600 }}>
      <Wline
        height="300"
        data={data}
        config={{
          // colors: (type) => {
          //   if (type === 'normal') {
          //     return '#00ff00';
          //   } else if (type === 'p0') {
          //     return '#ff0000';
          //   } else if (type === 'p1') {
          //     return '#0000ff';
          //   } else {
          //     return '#cccccc';
          //   }
          // },
          legend: {
            // table: true,
            gradient: true,
          },
        }}
      />
    </div>
  );
});
