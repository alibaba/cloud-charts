import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wcontainer, Wline, Wbar, Util, Wscatter } from '@alife/aisc-widgets';

const lineData = [
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

const barData = [
  {
    name: '柱1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 100],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
  {
    name: '柱2',
    data: [
      ['一', 92],
      ['二', 15],
      ['三', 4],
      ['四', 49],
      ['五', 64],
      ['六', 76],
      ['七', 21],
      ['八', 100],
      ['九', 71],
    ],
  },
];

const stories = storiesOf('connect', module);

class ConnectDemo extends React.Component{
  chart1 = null;
  chart2 = null;
  chart3 = null;
  componentDidMount() {
    new Util.Connect([this.chart1, this.chart2], {
      custom(e, target, source) {
        console.log(e, target)
        target.showTooltip({ x: e.x, y: e.y });
      }
    });
  }
  render(){
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
        <Wline height="280" getChartInstance={(c) => (this.chart1 = c)} config={{}} data={lineData}/>
        <Wbar height="280" getChartInstance={(c) => (this.chart2 = c)} config={{}} data={barData}/>
        <Wscatter height="280" getChartInstance={(c) => (this.chart3 = c)} config={{}} data={lineData}/>
      </div>
    );
  }
}
stories.add('线柱联动', () => (
  <ConnectDemo />
));

