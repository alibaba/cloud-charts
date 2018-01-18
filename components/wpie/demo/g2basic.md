---
order: 5
title:
  zh-CN: G2
  en-US: G2
---

## zh-CN

G2 版 基础饼图

## en-US


````jsx
import { WG2Pie } from '@alife/aisc-widgets';

let options = {
  legend: {
    valueFormatter(v, data) {
      console.log(v, data);
      return v;
    }
  }
};

let data = [
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


class Demo extends React.Component{
  state = {
    data: []
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        data: [
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
        ]
      });
    }, 2000);
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <WG2Pie height={300} config={options} data={data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
