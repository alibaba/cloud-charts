---
order: 10
title:
  zh-CN: 分面
  en-US: Facet
---

## zh-CN

基础

## en-US


````jsx
import { Wbar, COLORS } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "facet": '分面1',
    "data":[]
  },
  {
    "name":"柱2",
    "facet": '分面2',
    "data":[]
  },
  {
    "name":"柱3",
    "facet": '分面1',
    "data":[]
  },
  {
    "name":"柱4",
    "facet": '分面2',
    "data":[]
  }
];

for (let i = 0; i < 10; i++) {
  const name = i + '-' + i;
  data[0].data.push([name, Math.random() * 100 + 100]);
  data[1].data.push([name, Math.random() * 100 + 100]);
  data[2].data.push([name, Math.random() * 100 + 100]);
  data[3].data.push([name, Math.random() * 100 + 100]);
}

let options1 = {
  padding: [40, 24, 20, 44],
  colors: [COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory1, COLORS.widgetsColorCategory3, COLORS.widgetsColorCategory3],
  legend:{
    align: 'right'
  },
  marginRatio: 0.05,
  facet: true,
  zoom: true
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wbar ref="chart1" config={options1} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
