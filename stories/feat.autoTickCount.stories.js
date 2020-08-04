import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wcontainer, Wline } from '@alicloud/cloud-charts';

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

const stories = storiesOf('autoTickCount', module);
stories.add('折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        tickCount: 'auto',
      },
      yAxis: {
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
