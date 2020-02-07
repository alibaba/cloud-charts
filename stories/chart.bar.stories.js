import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

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
    <Wbar height="300" config={{
      stack: true,
      // size: 2 * 360 / 9,
      polar: true,
      innerRadius: 0.2,
    }} data={data} />
  </Wcontainer>
));

const yuData = data.slice(0, 1);
yuData[0].data = yuData[0].data.slice(0, 5).sort((a, b) => {
  return a[1] - b[1];
});
stories.add('玉玦图', () => (
  <Wcontainer className="demos">
    <Wbar height="360" config={{
      polar: true,
      column: false,
      innerRadius: 0.2,
    }} data={yuData} />
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

const histData = [{"name":"Ideal","data":[61.4,59.2,60.9,62.4,61.3,62.4,61.2,62.2,61.8,61.7,61.8,61.4,61.7,61.6,61.1,62.6,62.3,62.4,61,62.5,62.1,63.8,62.7,62,62,60.6,61.5,62.3,63,62.6,62.9,61.4,61.3,62.2,60.1,62.3,64,61.8,62.1,61.7,61.5,61.8,62.4,61.3,61.2,61.6,62.8,61.7,62.4,61.7,62.1,61.1,61.7,62.3,62.6,61.6,61.4,61.2,61,61.7,58.6,61.1,60.7,61.5,61.9,63.3,61.6,61.1,61.4,62.4,61.4,62.3,61.5,62.1,62.4,60.7,61.3,62,61.5,61.3,61.2,61,62,61.9,62.1,62.3,62.4,61.4,60.5,61.6,61.4,62,61.4,62.4,62.5,62.9,60.8,62.6,61.9,62.3,62.6,62.1,61.9,60.9,60.9,62.4,62.6,61.5,60.9,61.2,61.5,61.5,62.2,61,62.3,62.2,61.9,61.9,62.5,61.8,61.9,62.8,60.7,61.6,60.7,62.6,61.8,62.7,61.3,62.2,60.2,61.5,62.4,61.9,61.5,61.7,62.7,62.7,60.7,62.2,59.5,62.5,61.5,61.7,61.3,61.6,60.8,62,61.8,61.1,62.1,60.1,60.7,62,60.8,61.2,62.9,62.7,62.5,62.3,61,62.6,61.4,61.8,62.3,63,61.9,61.1,61.9,62.6,62.6,61,61.9,62.6,60.3,62.1,62,61.8,62.1,60.4,61.4,61.7,62.3,62.1,60.4,62.3,61.8,62.4,61.3,62.3,62.7,61.2,62.5,60.9,62.1,61.4,62.1,61.8,62.4,60,62.3,62,61.4,61,61.2,61.6,61.6,62,62.2,61.7,61.7,61.7,61.4,61,61.6,62.5,63,61.4,62,62.3,61.8,60.9,60.6,60.9,61.5,62.3,62.5,60.9,62.6,62.3,61.4,62,61.7,62.7,61.3,61.3,61.2,62.3,62.6,61.8,62.1,62.8,62,62,62.8,61.9,62.2,62.2,61.3,61.6,61.8,61.1,61.7,60.8,61.2,62.2,61.2,61.1,61.1,62.6,62.3,62.5,63,62.7,61.8,61.8,61.6,61.9,61.4,61.3,61.3,60.8,62.6,61.6,62.4,61.6,61.8,61.9,62.1,62.6,61.6,62.3,62.7,62.2,62.3,61.9,59.9,62,61.4,61.2,61.1,62,62.4,61.3,62.3,62,61.5,61.7,62.4,61.3,61.3,61.4,60.8,61.1,61.5,61.7,62,61.8,62.3,61.6,61.3,61.6,62,61.4,62.1,60,60.8,61.3,62.3,62.2,61.8,61.2,62.7,61.8,61.5,60.7,62,62,61.1,60.7,59.8,60.8,61.1,61.2,61.8,61.7,62.3,62,60.5,61.2,62.1,62,61.7,62,61.8,62.6,61.6,61,62.1,62.2,61.9,62.1,61.6,62.2,61.6,61.7,60.5,62.4,62.2,60.9,62.3,61.8,60.9,61.4,61.8,61.9,61.3,62,60.1,61.6,62.7,61.1,61.6,61.1,61.9,61.7,61.3,61.6,60.8,61.6,61.6,63.3,62.6,61.9,62.2,61.8,62,61.5,61.9,61.5,62.2,62.3,61.5,62.1,61.1,61.9,62.2,61.6,60.7,61.2,63,62,61.6,62.3,62,61.6,62.3,61,61.7,62.1,62.4,61.1,62.6,62.3,61.9,61.7,62.5,62,62.2,62.1,62.5,60.2,61.8,62.4,61.7,62.5,61.5,60.6,60.6,62,59,61.8,62.3,62.1,62.5,62.5,61.2,61.5,62.2,60.9,61.7,61.5,62.1,63,61.8,61.5,61.3,62.2,62.2,62.4,62.3,61.9,61.6,61.4,61.9,61.7,62.6,61.7,61.3,62,61.4,61.1,60.2,61.9,61.3,62.3,62.3,62.7,62,61.3,62.5,62.9,62,61.2,62.4,61.3,61.9,61.7,62.3,61.4,61.8,62.6,61.8,62.4,61.7,61.9,59.8,62,62.2,61.6,61.6,62.7,63.2,60.9,61.1,61.9,62.4,60.8,61.8,62.1,61.9,62,61,61.2,62.2,60.7,61.7,62.2,61.9,61.4,62.3,62.9,61.1,62,62.7,62.6,61.8,60.2,61.2,62.8,60.5,62.3,63,61.8,62.1,61.7,60.4,62.5,62.2,62.2,61.7,60.8,61.3,61.2,60.9,62,62.1,62.3,61.4,61.7,62,62.3,60.9,62.6,62,62,61.7,60.8,62,61.9,61.4,61.2,61.8,61.1,61.3,61.6,61.7,62.4,61.8,62.4,60.2,61.2,60.8,62.7,61.6,61,62,61.6,61.8,61.5,61.3,61.2,60.2,62,61.7,61.7,62.6,62.2,62.4,62.4,62.6,61.3,61.7,62.9,61,62,61.7,61.9,62.5,61.3,62.2,61.1,61.9,62.1,62.5,61,61.1,61.4,62.4,61.8,60.3,61.9,61.4,62.1,61.9,61.3,62,61.3,61.8,62,61.8,62,62,61.8,62.7,60.9,61.4,60.1,61.9,61,61.7,61.1,61.8,61.4,61.2,62,62.8,61.3,61.7,62,62.6,60.8,62,61.8,61.8,62,60.3,61.2,60.7,62.3,62.1,62,61.9,60.5,61.2,61.8,61.9,62.1,62.2,61.8,60.8,62,61.9,61.9,61.1,60.8,62.2,61.5,60.5,62.6,62.2,61.1,62.1,61.3,61.5,62.4,62.2,62.4,62,61.9,62.1,62.3,62.3,61.9,62.6,61.7,62.2,61.3,61.5,60.3,62.5,62.4,60.2,62.5,62.2,61.2,62.9,62.8,61.6,62.2,61.5,62.7,61.7,62.5,61.5,61.9,62.8,61.1,62,61.4,61.5,61.6,62.7,62.1,60.9,60.9,61,62.1,60.3,62.6,62.1,61.9,61.9,61.1,61.4,61.3,62,61.8,61.5,61.6,61.7,61,62.4,60.5,62,61.7,61.5,61.9,61.8,58.8,62.1,61.7,62.4,61.7,62.2,61.6,61.2,61.9,62.7,60.9,61.1,63,62.2,62.7,62.6,60.7,62,62.8,61.4,61.2,61.3,61.4,61.7,61.9,60.5,61,60.7,63,62,62,61,62.2,62.1,62.2,62.7,61.6,62.6,62.2,61.1,62.1,62.2,61.2,62.2,62,60.3,63]},{"name":"Good","data":[64,63.6,63.5,56.9,63.8,58,63.8,64.3,60,57.8,63.8,60.3,63.8,63.9,63.5,64.1,63.9,63,63.4,63.6,63.1,65,58.7,62.8,63.3,65.5,63.5,64.3,63.8,58.2,63.2,58.9,64.1,63.2,63.7,61.8,57.8,63.3,63.5,58.2,63.6,64.3,62.3,63.9,63.1,58.7,63.4,63.3,60.4,63.2,63.1,57.9,59.2,59.2,63.1,63.5,63.8,63.7,63.7,60.5,63.7,58.2,63.8,64.2,63.6,63.2,64.2,57.6,63.7,63.5,56.7,64.8,64.2,58.4,64.3,61.2,63.8,63.9,63.1,63.3,59.2,62.6,57.2,57.4,63.6,63.7,57.6,58.8,63.9,63.5,59.4,58.9,58.9,56.9,59.8,63.5,60.1,60.1,64,62.7,63.6,63.6,64.2,63.2,61.3,63.8,58.5,59,64.2,63.6,63.6,61.8,63,64.2,63.2,61.1,63.7,63.8,63.8,63.4,63.8,56.3,63.7,57.9,63.2,64.1,63.3,63.7,64.6,60.2,62.7,63.9,64.3,63.3,63.8,64.4,62.6,63.7,58.6,65.8,59.2,57.9,63.8,64.2,59.4,63.7,64.2,63.7,62.5,60.6,63.3,63.5,63.8,62.3,59.6,63.9,61.8,63.5,63.6,63.2,63.9,62.4,57.8,58.5,57.8,63.3,60.8,60.2,63.3,63.7,57.9,60.9,57.3,57.8,63.6,62.9,57.8,63.1,61.3,63.3,61.4,63.4,63.7]},{"name":"Premium","data":[61.4,62.5,62.5,61.1,60.2,61.2,62,61.5,61.4,59.1,59.3,61.2,61.9,62.2,62.9,61.2,62.2,60.8,60.9,62.9,59.5,61.9,59.2,58.8,61,61.1,61.1,61.4,61.5,61.7,59.3,61.7,63,61.7,62.5,62,61.5,62.7,62.4,61.3,60.3,61.3,61.4,60.1,59.1,59.5,59.8,61.1,61.5,61,62.8,62,58.8,62,61.2,62.4,61.2,59.9,59.8,62.7,59.6,62.6,62.9,62.6,60.6,60.8,59.1,62.4,62.5,60.7,62.4,59.9,62.1,61.6,62.6,58.6,59.7,61.2,62.6,61.6,60.1,60.5,61.8,62.4,62.3,60.6,62.3,58,62.1,60.2,62.8,62.5,61,60.7,60.5,62.3,58.8,61.9,61.8,61,62.7,63,62.5,61.7,61.4,60.5,62.5,61.6,62.3,62.6,61.5,62.4,61.1,61.9,59.3,61.1,62.2,61.9,61.9,62.6,63,61.6,59.7,61.2,62.1,62.4,61.3,62.2,62.5,62.8,60.7,62.7,61.5,62.8,62.5,58.2,62.3,62.7,61.8,62.5,61.9,61.1,62.3,60.3,62.6,62.7,61.8,61.2,62.7,61.2,61.9,59.6,62.4,62.2,59.3,62.6,62.1,62.3,61.3,62.2,62,61.5,60.1,60.1,61.5,58.4,60.1,62.3,62.7,60.8,60.5,60.6,63,62,61.5,58.4,61.6,61.8,62.8,59.9,58.8,59.9,62.1,62.6,62.6,60.8,62.5,61.4,62.6,60.4,61.8,59.3,61,60.6,61.2,62.6,61.9,60.9,59,62.1,61.9,61.5,61.6,58.4,61,61,60.5,59.9,61.6,59.5,62.4,61.8,62.2,62.9,58.8,62.3,62,60.5,62.4,60.3,61.2,59.6,60.6,59.5,60.5,62.4,62,62.8,62.3,59.4,61.1,61.6,59.8,60.5,61.3,62,62.5,61.2,60.2,59.9,59.8,62.5,61.3,60.3,62.6,61.8,60.9,61.1,61.1,61.6,61.8,59.5,61.5,59.4,61.3,61.7,61,60.1,60.8,60.4,61.2,61.5,61.2,62.5,62.1,60.4,61.5,61.3,62.4,58.8,62.1,60.1,62,60.3,61.4,61.9,59.8,62.8,59.3,61.9,61.1,60.2,62.5,60.2,60.1,61,61.8,60.5,59.6,62.1,60.9,61.7,60.9,61,62,62.4,62.6,60.5,61.3,61.5,61.9,61.2,62.5,61.1,62.2,62.8,62.2,62.4,61.3,60.8,60.9,61.3,62.9,62,61.8,62.4,60.1,59.3,58.4,60.7,61.4,60.5,62,59.2,61.7,62.6,63,61.1,62.4,62.2,62.4,59.1,60.4,60.9,59.6,58.8,62.1,61,59.5,61.7,62.2,60.3,62.6,62.1,60.1,60.5,61,62,60.6,61.4,62.6,61.3,60.2,62.2,58,61.2,60.3,62.3,60.7,61.5,63,61.3,59.5,61.7,61.2,61.5,61.5,60.6,58.3,61.5,59.2,61.4,62,63,62,61.6,60.9,61.1,59.5,62.8,60.7,62.6,61,62,62.1,61.3,61.9,62.7,61.3,61.3,62.2,61.8,61.1,62.1,61.9,62.7,62,61.4,61.3,60.5,61.1,62.9,62.4,61.3,60.5,59.7,60.3,61.9,60.7,59.6,60.1,62.2,62.9,60.5,61.8,60.5,63,61.2,59.1,62.1,61.2,62.7,62.2,60.7,61.8,62.2,62.3,62.3,61.3,63,62.3,59.3,62.2,62.9,60.2,61.2,61.5,59.6,59.9,62.6,62.8,59.7,62.3,61,63,58.9,61.8,62.6,61.1,62.1,61.3,60.9,61.3,58.6,62.4,59.6,61.3,59.7,60.8,60,61.9,62.6,61.1,62.3,59,60.3,62.1,61,60.2,61.9,61.2,60.8,62,61.7,61.9,62.1,58.2,62,62.6,62.2,60,62.9,61.7,62.8,62.3,62.6,62.7,62.5,62.7,62,60.1,61.4,59.6,60.1,62.6,63,61.4,59.4,62.8,61.3,61,62.7,61.9,63,61.2,61.3,62.4,60.2,61.9,62.7,60.2,61.9,62.8,62.3,62.2,60.6,62.1,60.7,59.8,60.9,59.2,62.3,61.4,60.9,63,61.5,60.3]},{"name":"Very-Good","data":[62.9,62.3,63.4,62.1,60.7,61.7,58.1,62.2,60.5,61.5,63,63,60.4,59.6,59.4,63.1,63.4,63.1,61.4,62.9,59.6,62.7,61.9,59.3,61.5,62.4,61.2,58.6,62.3,63.3,63.2,62.6,61.2,60.2,63,63.7,60.8,63.4,62.7,62.8,60.9,61.5,58.8,62.8,62.7,62.9,62.4,60.9,62.9,63.5,63.2,62.8,62.1,63.4,60.3,62.8,62.9,58.2,61.8,61.1,63.2,62.7,59.8,62.4,61.4,61.9,61.1,61.4,63.6,62.9,62.6,61.9,60,62.7,60.9,62.4,62.1,60.7,61.6,63.4,62.9,61.9,62,62.2,62.2,63.2,63,61,62.2,62.9,62.5,63.6,59.9,61.1,62.2,62.5,60.3,60.2,60.2,61.7,63.3,62.9,62.3,63.1,61.8,62.5,62.7,63,61.8,62.9,60.5,62.6,61.2,63.3,61.1,62.8,62.6,61.6,62.3,60.4,62.9,62,60.4,61,62.1,61.9,60.9,62.2,64.2,62.4,60.4,61.2,63.2,62.8,62.1,59.2,62.4,60.7,62.5,64,63.3,60.7,62.7,60.6,60.1,61.9,62.4,61.7,63.5,59.1,61.6,60.7,62.8,61.2,60.8,61.2,59.2,62.2,63.1,61.9,60,61.1,60.5,62.3,62.8,63.1,61.8,60.9,63.3,61.4,61.6,62.4,63.1,59.6,63,62.5,62.7,62.3,60.1,60.7,58.4,63.3,63.4,63.4,62.6,61.2,61.9,63.8,59.3,60.6,62.6,62.4,62.9,62.6,63.7,62,63.3,62.1,61.7,61.5,63.5,62,61.2,62.9,59.5,58.5,61.8,62.5,62.7,63.1,63.5,61.4,64,63.2,62.8,64.2,62.4,63.6,60.7,62.9,62.2,59.3,62.8,61.1,62.9,63.3,62.4,63.7,63.4,63.5,62.9,62.1,63.1,61.8,61.9,61.8,62.1,62.2,61.7,62.5,60.6,60.6,63.7,63.2,60.5,63.1,61.3,60.2,62.6,63.5,61.4,63.2,58.6,63,61,63.2,61.4,60.9,63.5,62.7,62.6,62.9,62,62.6,59.1,59.1,61.3,61.8,62.1,63.2,62.1,60,59.8,59.2,63.8,59.5,62.2,59.5,60.4,62.1,63.7,63.2,60.1,63,63.2,63.5,60.1,62.9,59.7,62.8,62.1,61,61,58,62.1,61,60.2,62.2,62.9,59.4,58.9,63.1,63.7,62.5,61.4,62.6,62.8,62,61,63.4,61.3,62.6,63.5,63.3,58.8,61.7,61.1,60.3,62.3,60.7,62.8,61.5,61.3,63.3,59.6,62.5,60.7,61,62.9,63.3,62,63,61.6,61.4,61.2,62,59.6,62.4,64.4,62.6,63.1,63.1,58.7,62.8,63.1,60.5,63.3,62.6,62.2,59.6,62.1,62.2,63.4,62.8,63.5,63.1,62.8,63.2,61.8,61.3,60.9,63.5,62.8,63.1,62,60.9,59.6,62.1,61.3,62.5,59.8,60.5,63.2,62.2,62.9,60.2,62.2,62.5,63.1,63,58.6,61.4,58.7,61.9,62.8,60.4,61.5,60,61,63.1,62.5,61.8,62.9,63.2,61.5,62.2,58.6,63.1,59.8,59.2,62.3,61.6,63.1,62.8,59.6,63.2,61.3,63.4,63.6,59.3,62,61.9,63.4,62.8,63.1,61.9,60.1,60.6,58.2,62.3,60.4,63.3,57.1,62.6,62.1,60.7,61.3,63.2,61.8,62.2,60.5,57.1,62.5,63.1,63.3,60.2,61.9,63.1,61.7,62.9,60.9,62.1,63,61.6,62.6,60.4,59.6,63.1,61.4,63.4,64.2,62]},{"name":"Fair","data":[66,64.7,64.8,64.5,67.4,65,67.6,55.1,61.7,64.6,65,67.1,67.8,65,54.7,68.7,68.2,59.4,65.9,64.5,65.5,69.8,65.7,61.2,58.9,66,66.4,64.9,58.9,65.5,64.4,66.9,65.4,65.1,66.3,64.3,65.7,65.4,55.2,64.5,64.4,55.9,66,56.9,59.5,60,64,64.7,69.5,60.1,65,65,66.2,61.1,65,64.7,66.1,55.3,65.7,65.2,65.2,55.9]}];
stories.add('直方图', () => (
  <Wcontainer className="demos">
    <Wbar
      height="300"
      config={{
        histogram: {
          binWidth: 1, // default: 1
          tickInterval: 4, // default: 4
          normalize: true, // default: false
        },
      }}
      data={histData}
    />
  </Wcontainer>
));
