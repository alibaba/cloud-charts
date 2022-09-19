import React, { useEffect, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select, radios } from "@storybook/addon-knobs";

import { Wcontainer, Wline, Wlinebar } from '@alicloud/cloud-charts';

const data = [
  {
    "name":"数据项长名称",
    "data":[[1483372800000,92],[1483459200000,92],[1483545600000,714]]
  },
  {
    "name":"短名",
    // "yAxis": 1,
    "data":[[1483372800000,651],[1483459200000,278],[1483545600000,175]]
  },
  {
    "name":"长数据值",
    "yAxis": 1,
    "data":[[1483372800000,206051],[1483459200000,193278],[1483545600000,305175]]
  }
];

const longData = [
  {
    "name":"数据项长名称",
    "data":[[1483372800000,92],[1483459200000,92],[1483545600000,714]]
  },
  {
    "name":"短名",
    // "yAxis": 1,
    "data":[[1483372800000,651],[1483459200000,278],[1483545600000,175]]
  },
  {
    "name":"长数据值",
    "yAxis": 1,
    "data":[[1483372800000,206051],[1483459200000,193278],[1483545600000,305175]]
  },
  {
    "name":"数据项长名称1",
    "data":[[1483372800000,89],[1483459200000,78],[1483545600000,714]]
  },
  {
    "name":"短名1",
    // "yAxis": 1,
    "data":[[1483372800000,641],[1483459200000,268],[1483545600000,165]]
  },
  {
    "name":"长数据值1",
    "yAxis": 1,
    "data":[[1483372800000,204051],[1483459200000,195278],[1483545600000,308175]]
  },
  {
    "name":"数据项长名称2",
    "data":[[1483372800000,32],[1483459200000,42],[1483545600000,814]]
  },
  {
    "name":"短名2",
    // "yAxis": 1,
    "data":[[1483372800000,751],[1483459200000,258]]
  },
  {
    "name":"长数据值2",
    "yAxis": 1,
    "data":[[1483372800000,208051],[1483459200000,193578]]
  },
  {
    "name":"数据项长名称3",
    "data":[[1483372800000,82]]
  },
  {
    "name":"短名3",
    // "yAxis": 1,
    "data":[[1483372800000,751]]
  },
  {
    "name":"长数据值3",
    "yAxis": 1,
    "data":[[1483372800000,206051]]
  }
];


const stories = storiesOf('tooltip', module);

stories.add('样式测试', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{}} data={data} />
  </Wcontainer>
));

stories.add('多列展示', () => (
  <Wcontainer className="demos">
    <Wline height="240" config={{
      tooltip: {
        // columns: 2,
      }
    }} data={longData} />
  </Wcontainer>
));
