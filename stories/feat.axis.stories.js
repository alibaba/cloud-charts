import React, { useEffect, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select, radios } from "@storybook/addon-knobs";

import { Wcontainer, Wline, Wbar } from '@alife/aisc-widgets';

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

// const lineBarData = [
//   {
//     "name":"机房1",
//     type: 'bar',
//     "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
//   },
//   {
//     "name":"机房2",
//     type: 'bar',
//     "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
//   },
//   {
//     "name":"机房3",
//     type: 'line',
//     yAxis: 1,
//     "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
//   },
//   {
//     "name":"机房4",
//     type: 'line',
//     yAxis: 1,
//     "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
//   }
// ];


const stories = storiesOf('axis', module);
stories.addDecorator(withKnobs);
stories.add('轴标题', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        alias: '时间轴'
      },
      yAxis: {
        alias: '具体数值'
      },
    }} data={data} />
  </Wcontainer>
));

stories.add('tickLine', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      xAxis: {
        tickLine: true,
      },
    }} data={data} />
  </Wcontainer>
));


let barData = [
  {
    "name":"柱1",
    "dodge": '分组1',
    "data":[]
  },
  {
    "name":"柱2",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱3",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱4",
    "dodge": '分组2',
    "data":[]
  },
];

for (let i = 0; i < 10; i++) {
  const name = i + '-------------------' + i;
  barData[0].data.push([name, Math.random() * 100 + 300]);
  barData[1].data.push([name, Math.random() * 100 + 100]);
  barData[2].data.push([name, Math.random() * 100 + 100]);
  barData[3].data.push([name, Math.random() * 100 + 100]);
}

let barConfig = {
  dodgeStack: true,
  column: false,
  xAxis: {
    autoEllipsis: true,
    autoHide: false,
    customConfig: {
      verticalLimitLength: 100,
      label: {
        style: {

        }
      }
    }
  }
};

stories.add('超出省略', () => (
  <Wcontainer className="demos">
    <Wbar height="300" config={barConfig} data={barData} />
  </Wcontainer>
));

// stories.add('图例位置测试-linebar', () => (
//   <Wcontainer className="demos">
//     <Wlinebar height="300" config={{
//
//     }} data={lineBarData} />
//   </Wcontainer>
// ));
