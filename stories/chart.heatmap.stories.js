import React from 'react';

import { storiesOf } from '@storybook/react';
import { Util, Wheatmap, Wcontainer } from '@alife/aisc-widgets';

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

// mock 数据开始
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
      list: [],
    };
  } else {
    // timeStatusArrData.unshift([String(t.getMinutes()), String(t.getHours()), '正常', timeStr]);
    d.type = '正常';
    d.extra.value = '正常';
  }

  timeStatusArrData.unshift(d);
}
// mock 数据结束

const timeStatusConfig = {
  colors(name) {
    if (name === '正常') {
      return Util.getStatusColor('normal');
    }
    if (name === '异常') {
      return Util.getStatusColor('error');
    }
    if (name === '无数据') {
      return Util.getStatusColor('none');
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
    nameFormatter(name, raw, i, arr) {
      const data = arr[i].point._origin;
      return data.extra.time;
    },
    valueFormatter(v) {
      if (typeof v === 'object') {
        return '异常';
      }
      return v;
    }
  },
  dataType: 'g2',
};

stories.add('时序状态图', () => (
  <Wcontainer className="demos">
    <Wheatmap config={timeStatusConfig} data={timeStatusArrData} />
  </Wcontainer>
));
