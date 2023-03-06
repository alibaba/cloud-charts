import React, { useEffect, useMemo, useRef, useState } from 'react';

import { storiesOf } from '@storybook/react';

import { Wcontainer, Wline, Wbar } from '@alife/aisc-widgets';

const data = [
  {
    "name":"机房A",
    "data":[[1483372800000,4092],[1483459200000,1592],[1483545600000,3714],[1483632000000,4854],[1483718400000,6514],[1483804800000,9022],[1483891200000,6023],[1483977600000,4018]]
  }, {
    "name":"机房B",
    "yAxis": 1,
    "data":[[1483372800000,6051],[1483459200000,3278],[1483545600000,5175],[1483632000000,6548],[1483718400000,9048],[1483804800000,11394],[1483891200000,8597],[1483977600000,6588]]
  }
];

// const lineBarData = [
//   {
//     "name":"机房1",
//     type: 'bar',
//     "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
//   },
//   {
//     "name":"机房2",
//     type: 'bar',
//     "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
//   },
//   {
//     "name":"机房3",
//     type: 'line',
//     yAxis: 1,
//     "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
//   },
//   {
//     "name":"机房4",
//     type: 'line',
//     yAxis: 1,
//     "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
//   }
// ];


const stories = storiesOf('axis', module);

stories.add('轴标题', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        alias: '时间轴'
      },
      yAxis: {
        alias: '具体数值'
      },
    }} data={data} />
  </Wcontainer>
));

stories.add('tickLine', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        tickLine: true,
      },
    }} data={data} />
  </Wcontainer>
));


let barData = [
  {
    "name":"柱1",
    "dodge": '分组1',
    "data":[]
  },
  {
    "name":"柱2",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱3",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱4",
    "dodge": '分组2',
    "data":[]
  },
];

for (let i = 0; i < 10; i++) {
  const name = i + '-------------------' + i;
  barData[0].data.push([name, Math.random() * 100 + 300]);
  barData[1].data.push([name, Math.random() * 100 + 100]);
  barData[2].data.push([name, Math.random() * 100 + 100]);
  barData[3].data.push([name, Math.random() * 100 + 100]);
}

let barConfig = {
  dodgeStack: true,
  // column: false,
  xAxis: {
    autoEllipsis: true, // 自动省略
    autoHide: false, // 自动抽样隐藏标签
    autoRotate: true, // 标签自动旋转
    customConfig: {
      verticalLimitLength: 50, // 省略字长限制
    }
  }
};

stories.add('超出省略', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={barConfig} data={barData} />
  </Wcontainer>
));

// stories.add('图例位置测试-linebar', () => (
//   <Wcontainer className="demos">
//     <Wlinebar height="300" config={{
//
//     }} data={lineBarData} />
//   </Wcontainer>
// ));

const configList = [
  {
    yAxis: {
      tickMethod: 'wilkinson-extended',
    },
    animate: false,
  },
  {
    name: 'wilkinson-extended with minLimit',
    yAxis: {
      tickMethod: 'wilkinson-extended',
      minLimit: 0,
    },
    animate: false,
  },
  {
    yAxis: {
      tickMethod: 'r-pretty',
    },
    animate: false,
  },
  {
    yAxis: {
      tickMethod: 'd3-linear',
    },
    animate: false,
  },
  {
    yAxis: {
      tickMethod: 'integer',
      // minLimit: 0,
    },
    animate: false,
  },
];

stories.add('tick 计算', () => {
  const [height, setHeight] = useState(360);
  const [dataHeight, setDataHeight] = useState(1);
  const [lineStart, setLineStart] = useState(0);
  const [lineEnd, setLineEnd] = useState(-1);

  const barData = useMemo(() => {
    return [
      {
        name: '测试数据',
        data: [
          ['数据一', dataHeight],
          // ['数据二', dataHeight * 2]
        ],
      },
    ];
  }, [dataHeight]);

  const lineData = useMemo(() => {
    const result = [];
    const now = new Date().setMilliseconds(0);
    const len = 5;

    const step = (lineEnd - lineStart) / (len - 1);

    for (let i = 0; i < len; i++) {
      result.push([now - (len - i) * 60000, lineStart + i * step]);
    }
    return [
      {
        name: '测试数据',
        data: result,
      },
    ];
  }, [lineStart, lineEnd]);

  return (
    <div>
      <p>
        图表高度
        <span style={{ display: 'inline-block', marginLeft: 8, width: 36 }}>{height}</span>
        <input style={{ width: 720 }} type="range" onChange={e => setHeight(Number(e.target.value))} min="200" max="500" value={height} step="1" />
      </p>
      <p>柱图</p>
      <p>
        数据大小
        <span style={{ display: 'inline-block', marginLeft: 8, width: 36 }}>{dataHeight}</span>
        <input style={{ width: 720 }} type="range" onChange={e => setDataHeight(Number(e.target.value))} min="-100" max="500" value={dataHeight} step="1" />
      </p>
      <div style={{ display: 'flex' }}>
        {
          configList.map((c, i) => {
            return (
              <div key={i} style={{ flex: `${100 / configList.length}%`, padding: '0 20px' }}>
                <span>yAxis config</span>
                <pre style={{ height: 80, background: '#f7f7f7', padding: 20 }}>
                  {JSON.stringify(c.yAxis, null, 2)}
                </pre>
                <Wbar height={height} config={c} data={barData} />
              </div>
            );
          })
        }
      </div>
      <p>线图</p>
      <p>
        数据起始
        <span style={{ display: 'inline-block', marginLeft: 8, width: 36 }}>{lineStart}</span>
        <input style={{ width: 720 }} type="range" onChange={e => setLineStart(Number(e.target.value))} min="-100" max="500" value={lineStart} step="1" />
      </p>
      <p>
        数据结束
        <span style={{ display: 'inline-block', marginLeft: 8, width: 36 }}>{lineEnd}</span>
        <input style={{ width: 720 }} type="range" onChange={e => setLineEnd(Number(e.target.value))} min="-100" max="500" value={lineEnd} step="1" />
      </p>
      <div style={{ display: 'flex' }}>
        {
          configList.map((c, i) => {
            return (
              <div key={i} style={{ flex: `${100 / configList.length}%`, padding: '0 20px' }}>
                <span>yAxis config</span>
                <pre style={{ height: 80, background: '#f7f7f7', padding: 20 }}>
                  {JSON.stringify(c.yAxis, null, 2)}
                </pre>
                <Wline height={height} config={c} data={lineData} />
              </div>
            );
          })
        }
      </div>
    </div>
  );
});

stories.add('多条柱图整数 tick', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        scrollbar: true,
        yAxis: {
          // max: 50,
          tickCount: 10,
          // min: 0,
          // nice: false,
          // min: 0,
          tickMethod: 'integer',
        },
      }}
      data={[
        {
          "name": "删除",
          "type": "bar",
          "data": [
            ["产品线", 1],
            ["负载均衡", 1]
          ]
        },
        {
          "name": "更新",
          "type": "bar",
          "data": [
            ["应用系统", 10],
            ["产品线", 2]
          ]
        }
      ]}
    />
  </Wcontainer>
));
