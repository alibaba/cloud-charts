import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wfunnel, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  {
    "name":"柱1",
    "data":[["一", 100], ["二", 94], ["三", 86], ["四", 71], ["五", 67], ["六", 54]]
  }
];

const stories = storiesOf('Wfunnel', module);

stories.add('纵向-左侧', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'vertical',
        align: 'left',
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('纵向-中间', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        padding: [20, 20, 20, 20],
        direction: 'vertical',
        align: 'center',
        label: true,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('纵向-右侧', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'vertical',
        align: 'right',
      }}
      data={data}
    />
  </Wcontainer>
));

stories.add('横向-顶部', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'horizontal',
        align: 'top',
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('横向-中间', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        padding: [20, 20, 20, 20],
        direction: 'horizontal',
        align: 'center',
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('横向-底部', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'horizontal',
        align: 'bottom',
      }}
      data={data}
    />
  </Wcontainer>
));
