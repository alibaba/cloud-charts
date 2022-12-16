import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wcontainer, Wline, Wbar, Wpie, Wscatter, Wsankey } from '@alife/aisc-widgets';

function generateData(number) {
  const random = (seed) => {
    return '0.' + Math.sin(seed).toString().substr(6);
  };

  const res = [
    {
      name: '某日监控数据（秒级）',
      data: [],
    },
  ];

  const now = Date.now();
  for (let i = 0; i < number; i++) {
    const t = now - (3000 - i) * 1000;
    const value = +random(t);
    res[0].data.push([t, value]);
  }

  return res;
}

const stories = storiesOf('errorWrap', module);

stories.add('不完整数据', () => (
  <Wcontainer className="demos">
    <Wsankey
      height={300}
      config={{}}
      data={{
        nodes: [
          {}
        ],
        links: [
          { source: 0, target: 1, value: 5 },
          { source: 0, target: 2, value: 1 },
          {
            source: 0,
            target: 3,
            value: 1,
          },
        ],
      }}
    />
  </Wcontainer>
));
