import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wline, Wcontainer } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房A",
    "data":[[1483372800000,4092],[1483459200000,1592],[1483545600000,3714],[1483632000000,4854],[1483718400000,6514],[1483804800000,9022],[1483891200000,6023],[1483977600000,4018]]
  }, {
    "name":"机房B",
    "yAxis": 1,
    "data":[[1483372800000,6051],[1483459200000,3278],[1483545600000,5175],[1483632000000,6548],[1483718400000,9048],[1483804800000,11394],[1483891200000,8597],[1483977600000,6588]]
  }
];

let options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
  yAxis: {
    min: 0
  }
};

storiesOf('Wline', module)
  .add('折线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{}} data={data}/>
    </Wcontainer>
  ))
  .add('平滑曲线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        spline: true,
      }} data={data}/>
    </Wcontainer>
  ))
  .add('带点折线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        symbol: true
      }} data={data}/>
    </Wcontainer>
  ))
  .add('面积折线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        area: true,
      }} data={data}/>
    </Wcontainer>
  ))
  .add('面积曲线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        area: true,
        spline: true,
      }} data={data}/>
    </Wcontainer>
  ))
  .add('堆叠面积图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        area: true,
        stack: true,
      }} data={data}/>
    </Wcontainer>
  ))
  .add('带网格线', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        grid: true,
      }} data={data}/>
    </Wcontainer>
  ))
  .add('双轴折线图', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        yAxis: [{}, {}],
      }} data={data}/>
    </Wcontainer>
  ))
  .add('拖拽缩放', () => (
    <Wcontainer className="demos">
      <Wline height="300" config={{
        zoom: true,
      }} data={data}/>
    </Wcontainer>
  ));
