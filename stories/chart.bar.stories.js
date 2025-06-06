import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wbar, Wcontainer } from '@alicloud/cloud-charts';
import { cloneDeep } from 'lodash';

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
    <Wbar
      height="300"
      config={{
        // legend: {
        //   position: 'top',
        // },
        // yAxis: {
        //   type: 'quantize',
        // },
        // scrollbar: true,
        size: 18,
        xAxis: {
          // labelFormatter: (v) => {
          //   console.log(1111, v)
          //   return v
          // }
        }
      }}
      data={[
        {
          "name": "数量",
          "data": [
            [
              "中心云-test",
              "26725"
            ],
            [
              "17E-1",
              "546"
            ],
            [
              "59E-arm",
              "325"
            ],
            [
              "公共云测试",
              "94"
            ],
            [
              "50E-test",
              "0"
            ]
          ]
        }
      ]}
      force
    />
  </Wcontainer>
));

const testData = [
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
  const [chartData, setChartData] = useState(testData);

  useEffect(() => {
    const timer = setTimeout(() => {
      const changedData = testData.map((group) => ({
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
        // label: true,
        showStackSum: true,
        yAxis: {
          max: 500,
        },
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
        showStackSum: true,
      }}
      data={data}
    />
  </Wcontainer>
));

const yuData = cloneDeep(data).slice(0, 1);
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
  label: true,
};

let data4 = [
  {
    name: '柱1',
    data: [['一', 56]],
  },
];

stories.add('分组堆叠图(图例显示数字)', () => (
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
          // column: {
          //   reflect: true,
          // },
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
              value: [20, 'max'],
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

const zeroData = [
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
      ['一', 0],
      ['二', 0],
      ['三', 0],
      ['四', 0],
      ['五', 0],
      ['六', 0],
      ['七', 0],
      ['八', 0],
      ['九', 0],
    ],
  },
];

stories.add('可筛选出全为0的柱状图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{}} data={zeroData} />
  </Wcontainer>
));

const extremeData1 = [
  {
    name: 'test',
    data: [
      ['slb1231212423523254123123123125212441', 400],
      ['vpc234232324', 200],
    ],
  },
];

const extremeData2 = [
  {
    name: 'test',
    data: [['slb', 400]],
  },
];

stories.add('极端数据1（分类型)', () => (
  <Wcontainer className="demos">
    <Wbar height="300" data={extremeData1} force={{ extreme: false }} />
  </Wcontainer>
));

stories.add('极端数据2（分类型)', () => (
  <Wcontainer className="demos">
    <Wbar height="300" data={extremeData2} />
  </Wcontainer>
));

const extremeData3 = [
  {
    name: '机房A',
    data: [
      [1483372800000, 1592],
      [1483459200000, 4092],
    ],
  },
  {
    name: '机房B',
    data: [[1483372800000, 3592]],
  },
];
stories.add('极端数据（时间分类型)', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{ xAxis: { type: 'timeCat' } }} data={extremeData3} />
  </Wcontainer>
));

const manyData = [
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
      ['十', 45],
      ['十一', 6],
      ['十二', 89],
      ['十三', 32],
    ],
  },
];

const littleData = [
  {
    name: '柱1',
    data: [['一', 59]],
  },
];

stories.add('从多数据到少数据', () => {
  const [d, setD] = useState(manyData);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(littleData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={d} />
    </Wcontainer>
  );
});

stories.add('从少数据到多数据', () => {
  const [d, setD] = useState(littleData);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(manyData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={d} />
    </Wcontainer>
  );
});

const stackData = [
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

stories.add('极端数据+堆叠', () => {
  const [d, setD] = useState(stackData);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={d} force={false} config={{ stack: true }} />
    </Wcontainer>
  );
});

const columnData = [
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
      ['六', 100],
      ['七', 21],
      ['八', 100],
      ['九', 71],
    ],
  },
];

const dodgeData = [
  {
    name: '柱1',
    dodge: '分组1',
    data: [
      ['0-0', 400],
      ['1-1', 368.5774285541682],
      ['2-2', 319.46590450613223],
      ['3-3', 329.953581730495],
      ['4-4', 362.02255356841863],
      ['5-5', 356.18703843093465],
      ['6-6', 335.87491680258154],
      ['7-7', 347.8144190956929],
      ['8-8', 351.53314471631825],
      ['9-9', 336.78483141992774],
    ],
  },
  {
    name: '柱2',
    dodge: '分组2',
    data: [
      ['0-0', 250],
      ['1-1', 102.26794216638983],
      ['2-2', 129.65457779136605],
      ['3-3', 101.56208526870452],
      ['4-4', 184.9464011197059],
      ['5-5', 124.09187080031035],
      ['6-6', 118.93167886564532],
      ['7-7', 137.38820946995082],
      ['8-8', 168.13065143306804],
      ['9-9', 124.41292025672496],
    ],
  },
  {
    name: '柱3',
    dodge: '分组2',
    data: [
      ['0-0', 200],
      ['1-1', 143.42939580910783],
      ['2-2', 173.41042467473696],
      ['3-3', 163.71840146885077],
      ['4-4', 109.18016807137556],
      ['5-5', 127.9431338398262],
      ['6-6', 114.21569957269615],
      ['7-7', 140.8968365465857],
      ['8-8', 137.23695812901974],
      ['9-9', 192.66197147713766],
    ],
  },
  {
    name: '柱4',
    dodge: '分组2',
    data: [
      ['0-0', 142.7422522597824],
      ['1-1', 119.8436301287528],
      ['2-2', 148.00924709470718],
      ['3-3', 186.78811186926157],
      ['4-4', 117.02442492535125],
      ['5-5', 121.99650120083685],
      ['6-6', 144.31875224249848],
      ['7-7', 141.91228581169287],
      ['8-8', 130.79706132099858],
      ['9-9', 158.64916171077135],
    ],
  },
];

const periodData = [
  {
    name: '柱1',
    data: [
      ['一', [12, 76]],
      ['二', [30, 68]],
      ['三', [36, 81]],
      ['四', [37, 77]],
      ['五', [12, 81]],
      ['六', [46, 100]],
      ['七', [30, 90]],
      ['八', [18, 79]],
      ['九', [8, 73]],
    ],
  },
  {
    name: '柱2',
    data: [
      ['一', [30, 92]],
      ['二', [2, 54]],
      ['三', [45, 76]],
      ['四', [20, 69]],
      ['五', [24, 88]],
      ['六', [0, 76]],
      ['七', [18, 41]],
      ['八', [28, 100]],
      ['九', [25, 96]],
    ],
  },
];

stories.add('label padding测试', () => (
  <>
    <Wcontainer className="demos" title="横向柱图">
      <Wbar
        height="300"
        config={{
          column: false,
          legend: false,
          label: true,
        }}
        data={columnData}
      />
    </Wcontainer>

    <Wcontainer className="demos" title="堆叠图">
      <Wbar
        height="300"
        config={{
          legend: false,
          stack: true,
          label: true,
        }}
        data={columnData}
      />
    </Wcontainer>
    <Wcontainer className="demos" title="分组堆叠">
      <Wbar
        height="300"
        config={{
          legend: false,
          dodgeStack: true,
          label: true,
        }}
        data={dodgeData}
      />
    </Wcontainer>
    <Wcontainer className="demos" title="百分比堆叠">
      <Wbar
        height="300"
        config={{
          legend: false,
          stack: true,
          label: true,
          percentage: true,
        }}
        data={columnData}
      />
    </Wcontainer>
    <Wcontainer className="demos" title="区间柱状图">
      <Wbar
        height="300"
        config={{
          legend: false,
          label: true,
        }}
        data={periodData}
      />
    </Wcontainer>

    <Wcontainer className="demos" title="普通柱图">
      <Wbar
        height="300"
        config={{
          legend: {
            position: 'bottom',
            visible: true,
          },
          label: true,
        }}
        data={data}
      />
    </Wcontainer>
  </>
));

const changedData = [
  {
    name: '柱1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 80],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
  {
    name: '柱2',
    data: [
      ['一', 87],
      ['二', 15],
      ['三', 4],
      ['四', 49],
      ['五', 64],
      ['六', 76],
      ['七', 21],
      ['八', 79],
      ['九', 71],
    ],
  },
];

stories.add('数据更新label测试', () => {
  const [d, setD] = useState(data);

  useEffect(() => {
    setTimeout(() => {
      setD(changedData);
    }, 3000);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar
        height="300"
        config={{
          legend: {
            position: 'bottom',
            visible: true,
          },
          label: true,
        }}
        data={d}
      />
    </Wcontainer>
  );
});

const test111 = [
  {
    name: '机房A',
    data: [
      [1483372800000, 1592],
      [1483459200000, 4092],
      [1483545600000, 3714],
      [1483632000000, 3984],
      [1483718400000, 6514],
      [1483804800000, 6666],
      [1483891200000, 6023],
      [1483977600000, 4018],
    ],
  },
  {
    name: '机房B',
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
];

stories.add('event', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      data={test111}
      config={{
        xAxis: {
          type: 'timeCat',
        },
        // label: {
        //   // 默认为 'top'，标签显示在柱子上侧
        //   position: 'middle',
        //   // 正值向上偏移，负值向下偏移
        //   offset: -10,
        // },
        zoom: true,
        stack: true,
      }}
      event={{
        'zoom:end': (event) => {
          console.log('zoom:end', event);
        },
        'interval:click': (event) => {
          console.log('click', event);
        },
      }}
    />
  </Wcontainer>
));
