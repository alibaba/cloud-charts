import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wmulticircle, Wcontainer, Wnumber, Wpie, Wbar } from '@alicloud/cloud-charts';

const stories = storiesOf('Wmulticircle', module);

const test1 = [
  {
    name: '柱1',
    data: [
      ['一', 0.58, '自定义名称1'],
      ['二', 0.23, '自定义名称2'],
      // ['三', 0.19],
      // ['四', 0.27],
      // ['五', 1.29],
      // ['22', 0.27],
      // ['五22', 1.29],
    ],
  },
];

const test2 = [
  {
    name: '数据',
    data: [
      ['一', 59, '自定义名称1'],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
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
            innerRadius: 100, // 自定义圆环底
          },
          size: 16,
        }}
        data={test1}
      >
        <Wnumber>222</Wnumber>
      </Wmulticircle>
    </Wcontainer>
  </>
));

stories.add('多重圆环-自定义能力', () => (
  <>
    <div className="demos" style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 50%' }}>
        <Wmulticircle
          height="400"
          config={{
            max: 1, // 目前不可以小于所有数据中的最大值
            legend: {
              // position: 'top',
              // 对已有数据增加一些固定前缀
              nameFormatter: (text) => {
                return text + '自定义';
              },
            },
            tooltip: {
              nameFormatter: (text, datam, i) => {
                console.log(text, datam, i);
                return text;
              },
            },
          }}
          data={test1}
        >
          {/* 111 */}
        </Wmulticircle>
      </div>
      <div style={{ flex: '0 0 50%' }}>
        {/* <Wbar
          height="400"
          config={{
            legend: {
              position: 'bottom',
              nameFormatter: (text, datam, i) => {
                console.log(222, datam)
                return text
              }
            },
            polar: true,
            column: false,
            innerRadius: 0.2,
          }}
          data={test2}
        /> */}
        <Wpie
          height="400"
          config={{
            legend: {
              position: 'bottom',
              showData: false,
              // nameFormatter: (text, datam, i) => {
              //   console.log(datam)
              //   return text
              // }
            },
            cycle: true,
          }}
          data={test1}
        ></Wpie>
      </div>
    </div>
  </>
));
