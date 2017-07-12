---
order: 3
title:
  zh-CN: 横向柱状图
  en-US: Basic
---

## zh-CN

横向柱状图

## en-US


````jsx
import { Wbar } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
  }
];

let options = {
  title: '横向柱状图',
  subTitle: '',
  column: false
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
            <Wbar ref="chart1" config={options} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
