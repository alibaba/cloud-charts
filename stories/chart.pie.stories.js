import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wpie, Wnumber, Wcontainer } from '@alife/aisc-widgets';

const data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ]
  }
];

const stories = storiesOf('Wpie', module);
stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{}} data={data} />
  </Wcontainer>
));
stories.add('标签饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      label: true,
      legend: false,
    }} data={data} />
  </Wcontainer>
));
stories.add('块可选饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      select: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带内容环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
    }} data={data}>
      <Wnumber bottomTitle="现代浏览器占比" unit="%">72.5</Wnumber>
    </Wpie>
  </Wcontainer>
));
stories.add('带标签环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
      label: true,
      legend: false,
    }} data={data} />
  </Wcontainer>
));
