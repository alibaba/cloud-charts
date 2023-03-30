import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wmulticircle, Wcontainer, Wnumber } from '@alife/aisc-widgets';

const stories = storiesOf('Wmulticircle', module);

const test1 = [
  {
    name: '柱1',
    data: [
      ['一', 0.58],
      ['二', 0.23],
      // ['三', 0.19],
      // ['四', 0.27],
      // ['五', 1.29],
      // ['22', 0.27],
      // ['五22', 1.29],
    ],
  },
];

stories.add('多重圆环', () => (
  <>
    <Wcontainer className="demos">
      <Wmulticircle
        height="400"
        config={{
          max: 2, // 目前不可以小于所有数据中的最大值
          showDecoration: true,
        }}
        data={test1}
      >
        111
      </Wmulticircle>
    </Wcontainer>
    <Wcontainer className="demos">
      <Wmulticircle
        height="300"
        config={{
          max: 2, // 目前不可以小于所有数据中的最大值
          showDecoration: {
            innerRadius: 100 // 自定义圆环底
          },
          size: 16
        }}
        data={test1}
      >
        <Wnumber>222</Wnumber>
      </Wmulticircle>
    </Wcontainer>
  </>
));


