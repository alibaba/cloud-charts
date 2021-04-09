import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wbar, Wcontainer } from '@alicloud/cloud-charts';

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
        'zoom:start': s => {
          action('zoom:start')(s);
        },
        'zoom:end': s => {
          action('zoom:end')(s);
        },
        'zoom:reset': s => {
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
        'interval:click': s => {
          action('interval:click')(s);
        },
      }}
    />
  </Wcontainer>
));


let data2 = [
    {
        "name":"柱1",
        "facet": '分面1',
        "data":[]
    },
    {
        "name":"柱2",
        "facet": '分面2',
        "data":[]
    },
    {
        "name":"柱3",
        "facet": '分面1',
        "data":[]
    },
    {
        "name":"柱4",
        "facet": '分面2',
        "data":[]
    }
];
for (let i = 0; i < 10; i++) {
    const name = i + '-' + i;
    data2[0].data.push([name, Math.random() * 100 + 100]);
    data2[1].data.push([name, Math.random() * 100 + 100]);
    data2[2].data.push([name, Math.random() * 100 + 100]);
    data2[3].data.push([name, Math.random() * 100 + 100]);
}
let options1 = {
    padding: [40, 24, 20, 44],
    // colors: [COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory3, COLORS.widgetsColorCategory3],
    marginRatio: 0.05,
    facet: true
};
stories.add('镜面柱图', () => (
    <Wcontainer className="demos">
        <Wbar
            height="300"
            config={options1}
            data={data2}
        />
    </Wcontainer>
));


let data3 = [
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
    const name = i + '-' + i;
    data3[0].data.push([name, Math.random() * 100 + 100]);
    data3[1].data.push([name, Math.random() * 100 + 100]);
    data3[2].data.push([name, Math.random() * 100 + 100]);
    data3[3].data.push([name, Math.random() * 100 + 100]);
}
let options2 = {
    dodgeStack: true
};
stories.add('分组堆叠图', () => (
    <Wcontainer className="demos">
        <Wbar
            height="300"
            config={options2}
            data={data3}
        />
    </Wcontainer>
));
