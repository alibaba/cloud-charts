---
title: LineBase
order: 1
---

本 Demo 演示一行文字的用法。

````jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { LineBase } from '@alicloud/console-charts';

const data = [
  {
    name: '机房A',
    data: [
      [1483372800000, 1592],
      [1483459200000, 4092],
      [1483545600000, 3714],
      [1483632000000, 3984],
      [1483718400000, 6514],
      [1483804800000, 6666],
      [1483891200000, 6023],
      [1483977600000, 4018]
    ]
  },
  {
    name: '机房B',
    data: [
      [1483372800000, 3592],
      [1483459200000, 6092],
      [1483545600000, 5714],
      [1483632000000, 5984],
      [1483718400000, 8514],
      [1483804800000, 8666],
      [1483891200000, 8023],
      [1483977600000, 6018]
    ]
  }
];

class App extends Component {
  render() {
    return (
      <div>
        <LineBase data={data} />
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
````
