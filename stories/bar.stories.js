import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wbar, Wcontainer } from '@alife/aisc-widgets';

const data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
  }
];

const stories = storiesOf('Wbar', module);
stories.add('柱状图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{}} data={data}/>
  </Wcontainer>
));
stories.add('堆叠柱状图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{
      stack: true,
    }} data={data}/>
  </Wcontainer>
));
stories.add('横向柱状图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{
      column: false
    }} data={data}/>
  </Wcontainer>
));
stories.add('带网格线', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{
      grid: true,
    }} data={data}/>
  </Wcontainer>
));
stories.add('拖拽缩放', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={{
      zoom: true,
    }} data={data} event={{
      'zoom:start': (s) => {
        action('zoom:start')(s);
      },
      'zoom:end': (s) => {
        action('zoom:end')(s);
      },
      'zoom:reset': (s) => {
        action('zoom:reset')(s);
      }
    }}/>
  </Wcontainer>
));
