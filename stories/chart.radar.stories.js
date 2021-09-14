import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wradar } from '@alicloud/cloud-charts';

const data = [
  {
    name: '平均水准',
    data: [
      ['2001', 41],
      ['2002', 38],
      ['2003', 33],
      ['2004', 30],
      ['2005', 25],
      ['2006', 42],
    ]
  },
  {
    name: '个人水准',
    data: [
      ['2001', 25],
      ['2002', 72],
      ['2003', 35],
      ['2004', 27],
      ['2005', 54],
      ['2006', 52],
    ]
  }
];

const stories = storiesOf('Wradar', module);
stories.addDecorator(withKnobs);

stories.add('雷达图', () => (
    <Wradar height="300" data={data} />
));

const timeData = [
  {
    "name":"某日",
    "data":[]
  }
];
const now = new Date('2021-07-21 01:00:00').valueOf();
for(var i = 0; i < 25; i++) {
  const t = now - (25 - i) * 3600000;
  const value = Math.round(Math.random() * Math.random() * 200 + Math.sin(i / 800) * 300) + 800;
  if (i < 3) {
    timeData[0].data.push([t, 0]);
  } else {
    timeData[0].data.push([t, value]);
  }
}

let options = {
  xAxis: {
    type: 'time',
    mask: 'HH:mm',
    tickCount: 12,
  }
};
stories.add('时序雷达图', () => (
  <Wradar height="300" data={timeData} config={options} />
));
