import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wcontainer, Wline } from '@alife/aisc-widgets';

const data = [
  {
    "name":"曲线1",
    "data":[]
  },
  {
    "name":"曲线2",
    "data":[]
  },
  {
    "name":"曲线3",
    yAxis: 1,
    "data":[]
  },
  {
    "name":"曲线4",
    yAxis: 1,
    "data":[]
  },
];

for (let i = 0; i < 24; i++) {
  const time = `2020-01-01 ${i}:00:00`;
  data[0].data.push([time, Math.round(Math.random() * 100 + 800)]);
  data[1].data.push([time, Math.round(Math.random() * 100 + 600)]);
  data[2].data.push([time, Math.round(Math.random() * 100 + 400)]);
  data[3].data.push([time, Math.round(Math.random() * 100 + 200)]);
}

const stories = storiesOf('autoTickCount', module);
stories.add('折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        tickCount: 'auto',
        type: 'cat',
        // mask: 'YYYY-MM-DD HH:mm:ss',
        // autoRotate: true,
        // autoHide: true,
      },
      yAxis: {
        min: 0,
        tickCount: 'auto',
      }
    }} data={data} />
  </Wcontainer>
));
stories.add('双轴折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      yAxis: [{}, {
        tickCount: 'auto',
      }],
    }} data={data} />
  </Wcontainer>
));
