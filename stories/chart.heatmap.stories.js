import React from 'react';

import { storiesOf } from '@storybook/react';
import { Util, Wheatmap, Wcontainer, themes } from '@alife/aisc-widgets';

const stories = storiesOf('Wheatmap', module);

const data = [
  {
    name: '类型一',
    data: [
      ['aws1', 'aws1'],
      ['aws2', 'aws2'],
      ['aws3', 'aws3'],
      ['aws4', 'aws4'],
      ['aws5', 'aws5'],
    ],
  },
  {
    name: '类型二',
    data: [
      ['aws1', 'aws2', 234],
      ['aws1', 'aws3', 234],
      ['aws1', 'aws4', 234],
      ['aws2', 'aws1', 234],
      ['aws2', 'aws3', 234],
      ['aws2', 'aws4', 234],
      ['aws2', 'aws5', 234],
      ['aws3', 'aws1', 234],
      ['aws3', 'aws4', 234],
      ['aws3', 'aws5', 234],
      ['aws4', 'aws1', 234],
      ['aws4', 'aws2', 234],
      ['aws4', 'aws5', 234],
      ['aws5', 'aws1', 234],
      ['aws5', 'aws2', 234],
      ['aws5', 'aws3', 234],
      ['aws5', 'aws4', 234],
    ],
  },
  {
    name: '类型三',
    data: [
      ['aws1', 'aws5', 234],
      ['aws3', 'aws2', 234],
      ['aws4', 'aws3', 234],
    ],
  }
];

stories.add('基础色块图', () => (
  <Wcontainer className="demos">
    <Wheatmap height="600" data={data} />
  </Wcontainer>
));

// 最终数据格式如下：
// 列表需要按照时间顺序排序，否则展示会错乱
// [
//   // 正常状态，x 对应X轴数据，y 对应Y轴数据，type 用于区分颜色，extra 用于渲染 tooltip
//   {
//     "x": "0",
//     "y": "6",
//     "extra": {
//       "time": "2020-04-22 06:00:00",
//       "value": "正常"
//     },
//     "type": "正常"
//   },
//   // 异常，extra 中的数据格式可以自定义，在 config 中对应即可
//   {
//     "x": "4",
//     "y": "6",
//     "extra": {
//       "time": "2020-04-22 06:04:00",
//       "value": {
//         "list": [
//           {
//             "time": "10:00:00",
//             "status": "正常"
//           },
//           {
//             "time": "10:00:20",
//             "status": "异常"
//           },
//           {
//             "time": "10:00:40",
//             "status": "正常"
//           }
//         ]
//       }
//     },
//     "type": "异常"
//   },
//   // 无数据状态
//   {
//     "x": "6",
//     "y": "6",
//     "extra": {
//       "time": "2020-04-22 06:06:00",
//       "value": "无数据"
//     },
//     "type": "无数据"
//   },
// ];

// === mock 数据开始 ===
const timeStatusData = [
  {
    name: '正常',
    data: [],
  },
  {
    name: '异常',
    data: [],
  },
  {
    name: '无数据',
    data: [],
  }
];
const timeStatusArrData = [];
// 当前分钟开始时间戳
const now = new Date().setSeconds(0,0);
// 对齐本小时最后一分钟
const endTime = new Date().setMinutes(59, 0, 0);
function ten(v) {
  if (v < 10) {
    return `0${v}`;
  }
  return v;
}

for (let i = 0; i < 6 * 60; i++) {
  const t = new Date(endTime - i * 60000);

  const timeStr = `${t.getFullYear()}-${ten(t.getMonth() + 1)}-${ten(t.getDate())} ${ten(t.getHours())}:${ten(t.getMinutes())}:${ten(t.getSeconds())}`;

  const d = {
    x: String(t.getMinutes()),
    y: String(t.getHours()),
    extra: {
      time: timeStr,
    },
  };

  if (t.getTime() === now) {
    d.extra.highlight = true;
  }

  if (t.getTime() > now) {
    // timeStatusData[2].data.unshift([`${t.getMinutes()}m`, `${t.getHours()}h`, '无数据']);
    // timeStatusData[2].data.unshift([String(t.getMinutes()), String(t.getHours()), '无数据', timeStr]);
    d.type = '无数据';
    d.extra.value = '无数据';
  } else if (Math.random() < 0.05) {
    // timeStatusData.unshift([String(t.getMinutes()), String(t.getHours()), {
    //   list: [],
    // }, timeStr]);
    d.type = '异常';
    d.extra.value = {
      list: [
        {
          time: '10:00:00',
          status: '正常',
        },
        {
          time: '10:00:20',
          status: '异常',
        },
        {
          time: '10:00:40',
          status: '正常',
        },
      ],
    };
  } else {
    // timeStatusArrData.unshift([String(t.getMinutes()), String(t.getHours()), '正常', timeStr]);
    d.type = '正常';
    d.extra.value = '正常';
  }

  timeStatusArrData.unshift(d);
}
// === mock 数据结束 ===

const normalColor = '#c9e6fd';
const errorColor = Util.getStatusColor('error');
const noneColor = Util.getStatusColor('none');
const timeStatusConfig = {
  colors(type) {
    if (type === '正常') {
      return normalColor;
    }
    if (type === '异常') {
      return errorColor;
    }
    if (type === '无数据') {
      return noneColor;
    }
  },
  xAxis: {
    tickCount: 16,
    labelFormatter(v) {
      return `${v}m`;
    },
  },
  yAxis: {
    labelFormatter(v) {
      return `${v}h`;
    },
  },
  tooltip: {
    // tooltip 开头内容，这里展示完整的时间戳
    nameFormatter(name, raw, i, arr) {
      const data = arr[i].point._origin;
      return data.extra.time;
    },
    valueFormatter(v) {
      // tooltip 内容需自行定义，返回 html 字符串，不支持 React 组件
      if (typeof v === 'object') {
        const list = v.list.map((item) => {
          return `<span style="color: ${item.status === '异常' ? errorColor : ''}">${item.time}: ${item.status}</span>`;
        }).join('<br />');

        return `<br />详情：<br />${list}`;
      }
      return v;
    }
  },
  geomStyle: {
    stroke(x,y,type,extra) {
      // 高亮点
      if (extra.highlight) {
        return Util.getStatusColor('normal');
      }
      return themes['widgets-map-area-border'];
    },
  },
  dataType: 'g2',
};

stories.add('时序状态图', () => (
  <Wcontainer className="demos">
    <Wheatmap config={timeStatusConfig} data={timeStatusArrData} />
  </Wcontainer>
));
