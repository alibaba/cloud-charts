import React, { useEffect, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select, radios } from '@storybook/addon-knobs';

import { Wcontainer, Wline, Wpie } from '@alicloud/cloud-charts';

const data = [
  {
    name: '数据项长名称',
    data: [
      [1483372800000, 92],
      [1483459200000, 92],
      [1483545600000, 714],
    ],
  },
  {
    name: '短名',
    // "yAxis": 1,
    data: [
      [1483372800000, 651],
      [1483459200000, 278],
      [1483545600000, 175],
    ],
  },
  {
    name: '长数据值',
    yAxis: 1,
    data: [
      [1483372800000, 206051],
      [1483459200000, 193278],
      [1483545600000, 305175],
    ],
  },
];

const longData = [
  {
    name: '数据项长名称',
    data: [
      [1483372800000, 92],
      [1483459200000, 92],
      [1483545600000, 714],
    ],
  },
  {
    name: '短名',
    // "yAxis": 1,
    data: [
      [1483372800000, 651],
      [1483459200000, 278],
      [1483545600000, 175],
    ],
  },
  {
    name: '长数据值',
    yAxis: 1,
    data: [
      [1483372800000, 206051],
      [1483459200000, 193278],
      [1483545600000, 305175],
    ],
  },
  {
    name: '数据项长名称1',
    data: [
      [1483372800000, 89],
      [1483459200000, 78],
      [1483545600000, 714],
    ],
  },
  {
    name: '短名1',
    // "yAxis": 1,
    data: [
      [1483372800000, 641],
      [1483459200000, 268],
      [1483545600000, 165],
    ],
  },
  {
    name: '长数据值1',
    yAxis: 1,
    data: [
      [1483372800000, 204051],
      [1483459200000, 195278],
      [1483545600000, 308175],
    ],
  },
  {
    name: '数据项长名称2',
    data: [
      [1483372800000, 32],
      [1483459200000, 42],
      [1483545600000, 814],
    ],
  },
  {
    name: '短名2',
    // "yAxis": 1,
    data: [
      [1483372800000, 751],
      [1483459200000, 258],
    ],
  },
  {
    name: '长数据值2',
    yAxis: 1,
    data: [
      [1483372800000, 208051],
      [1483459200000, 193578],
    ],
  },
  {
    name: '数据项长名称3',
    data: [[1483372800000, 82]],
  },
  {
    name: '短名3',
    // "yAxis": 1,
    data: [[1483372800000, 751]],
  },
  {
    name: '长数据值3',
    yAxis: 1,
    data: [[1483372800000, 206051]],
  },
];

const stories = storiesOf('tooltip', module);

stories.add('样式测试', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{}} data={data} />
  </Wcontainer>
));

stories.add('多列展示', () => (
  <Wcontainer className="demos">
    <Wline
      height="240"
      config={{
        tooltip: {
          // columns: 2,
        },
      }}
      data={longData}
    />
  </Wcontainer>
));

stories.add('拓展区域', () => (
  <Wline
    height="240"
    config={{
      tooltip: {
        columns: false,
        // extra: <>111</>,
        reactContent: (title, data) => {
          // console.log(title, data);
          return (
            <>
              <div class="g2-tooltip-title">{title}</div>
              <ul class="g2-tooltip-list">
                {data?.map((el) => {
                  return (
                    <li class="g2-tooltip-list-item">
                      <span
                        class="g2-tooltip-marker"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: el?.color,
                        }}
                      ></span>
                      <span class="g2-tooltip-name">{el?.name}</span>:
                      <span class="g2-tooltip-value">{el?.value}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="cloud-charts-tooltip-extra" style={{ paddingBottom: 12 }}>
                <div
                  className="cloud-charts-tooltip-extra-divide"
                  style={{ height: 1, width: '100%', backgroundColor: '#e8e8e8', marginBottom: 12 }}
                ></div>
                <div className="cloud-charts-tooltip-extra-title" style={{ marginBottom: 20 }}>
                  额外信息
                </div>
                <div className="cloud-charts-tooltip-extra-content">
                  <img
                    width={260}
                    src="https://img.alicdn.com/imgextra/i2/O1CN0155ic2z1Qoa8Xpvefa_!!6000000002023-0-tps-590-612.jpg"
                  ></img>
                </div>
              </div>
            </>
          );
        },
      },
    }}
    data={data}
  />
));

const lineData = [
  {
    name: '机房Adfadfsaf',
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

stories.add('自定义tooltip', () => (
  <div style={{ width: 500, height: 300, position: 'absolute', right: 10 }}>
    <Wline
      height="300"
      config={{
        tooltip: {
          customTooltip: (title, data) => {
            return (
              <div
                style={{
                  background: '#fff',
                  cursor: 'default',
                  padding: 20,
                  border: '1px solid #ccc',
                  width: 200,
                }}
              >
                <div>{title}</div>
                <div>
                  {data.map((item) => {
                    return <div key={item.name}>{`${item.name}: ${item.value}`}</div>;
                  })}
                </div>
              </div>
            );
          },
        },
      }}
      data={lineData}
    />
  </div>
));

stories.add('自定义tooltip（默认）', () => (
  <div style={{ width: 500, height: 300, position: 'absolute', right: 10 }}>
    <Wline
      height="300"
      config={{
        tooltip: {
          customTooltip: true,
        },
      }}
      data={lineData}
    />
  </div>
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

stories.add('自定义tooltip(饼图)', () => (
  <div>
    <Wpie
      height="300"
      config={{
        tooltip: {
          customTooltip: (title, data) => {
            return (
              <div
                style={{
                  background: '#fff',
                  cursor: 'default',
                  padding: 20,
                  border: '1px solid #ccc',
                  width: 200,
                }}
              >
                <div>{title}</div>
                <div>
                  {data.map((item) => {
                    return <div key={item.name}>{`${item.name}: ${item.value}`}</div>;
                  })}
                </div>
              </div>
            );
          },
        },
      }}
      data={pieData}
    />
  </div>
));

stories.add('自定义tooltip（formatter）', () => (
  <div style={{ width: 500, height: 300, position: 'absolute', right: 10 }}>
    <Wline
      height="300"
      config={{
        yAxis: {
          valueType: 'count',
          needUnitTransform: true,
        },
        tooltip: {
          customTooltip: true,
          titleFormatter: () => 'title',
          nameFormatter: () => 'test',
        },
      }}
      data={lineData}
    />
  </div>
));

const multipleData = [];

for (let i = 0; i < 25; i++) {
  const group = {
    name: `AliyunEcs_cpu_total{hostname="xxx${i + 1}",instanceId="i-xxx${i + 1}"}`,
    data: [],
  };
  for (let j = 0; j < 6; j++) {
    const time = `2020-01-01 ${j}:00:00`;
    group.data.push([time, Math.round(Math.random() * 10) + 100 + i * 10]);
  }
  multipleData.push(group);
}

stories.add('自定义tooltip（锁定）', () => (
  <div style={{ width: 500, height: 300 }}>
    <Wline
      height="300"
      config={{
        tooltip: {
          customTooltip: true,
          lockable: true,
        },
      }}
      data={multipleData}
    />
  </div>
));

stories.add('自定义tooltip（跟随滚动）', () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ width: 500, height: 300 }}>
      <Wline
        height="300"
        config={{
          tooltip: {
            customTooltip: true,
            lockable: true,
            followTrigger: true,
          },
        }}
        data={multipleData}
      />
    </div>
    <div style={{ width: 500, height: 300 }}>
      <Wline
        height="300"
        config={{
          tooltip: {
            customTooltip: true,
            lockable: true,
            followTrigger: true,
          },
        }}
        data={multipleData}
      />
    </div>
    <div style={{ width: 500, height: 300 }}>
      <Wline
        height="300"
        config={{
          tooltip: {
            customTooltip: true,
            lockable: true,
            followTrigger: true,
          },
        }}
        data={multipleData}
      />
    </div>
  </div>
));
