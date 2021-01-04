import React, { useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, number, array } from "@storybook/addon-knobs";

import { Wpie, Wnumber, Wcontainer } from '@alife/aisc-widgets';

const data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ]
  }
];

// function WdashboardDemo() {
//   const data = number('仪表盘数字', 20);
//   const arr = array('值域范围', [0, 100],);
//   const [count, setCount] = useState(data);
//   const [range, setRange] = useState(arr);
//   useMemo(() => {
//     setRange(arr.map(Number));
//     setCount(data);
//   }, [data, arr]);
//   return <Wdashboard data={count} config={{range}} className="demos"/>;
// }

const stories = storiesOf('Wpie', module);
stories.addDecorator(withKnobs);

stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie width={300} height="300" config={{
      // outerRadius: 0.5,
      legend: {
        // align: 'top',
        // padding: [20, 0, 0, 20]
        nameFormatter(v) {
          return v + v;
        },
        valueFormatter(v) {
          return `${v} %`
        }
      },
      tooltip: {
        valueFormatter(n, ...args) {
          // console.log(args);
          return n;
        }
      }
    }} data={data} />
  </Wcontainer>
));
stories.add('标签饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      label: true,
      legend: false,
    }} data={data} />
  </Wcontainer>
));
stories.add('块可选饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      select: true,
      geomStyle: {
        cursor: 'pointer',
      }
    }} data={data} />
  </Wcontainer>
));
stories.add('环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带内容环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
    }} data={data}>
      <Wnumber bottomTitle="现代浏览器占比" unit="%">72.5</Wnumber>
    </Wpie>
  </Wcontainer>
));
stories.add('带标签环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" config={{
      cycle: true,
      label: true,
      legend: false,
    }} data={data} />
  </Wcontainer>
));
// stories.add('仪表盘', () => (
//   <WdashboardDemo data={11} className="demos"/>
// ));
