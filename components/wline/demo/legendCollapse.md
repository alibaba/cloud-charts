---
order: 19
title:
  zh-CN: 图例折叠
  en-US: LegendCollapse
---

## zh-CN



## en-US


````jsx
import { Wcontainer, Wline } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房1机房1机房1机房1",
    "data":[]
  },
  {
    "name":"机房2机房1",
    "data":[]
  },
  {
    "name":"机房3机房1机房3",
    "data":[]
  },
  {
    "name":"机房4机房1机房1机房4",
    "data":[]
  },
  {
    "name":"机房5机房1机房5",
    "data":[]
  },
  {
    "name":"机房6机房6",
    "data":[]
  },
  {
    "name":"机房7机房1机房1机房7",
    "data":[]
  },
  {
    "name":"机房8机房1机房8",
    "data":[]
  },
];

let now = (new Date()).setHours(0, 0, 0, 0);
for(let i = 0; i < 30; i++) {
  let time = now - (30 - i) * 24 * 3600000;
  let offset = 0;
  if (i === 9) {
    offset = -3000;
  }
  if (i === 22) {
    offset = -6000;
  }
  data.forEach((d) => {
    const value = Math.round(Math.random() * 1000) + 9000 + offset;
    d.data.push([time, value]);
  });
}

let options1 = {
  xAxis: {type: 'time', tickCount: 10, autoRotate: true},
  tooltip: {
    sort: 'desc'
  }
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={300}>
        <Wline config={options1} data={data}/>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
