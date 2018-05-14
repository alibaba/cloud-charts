---
order: 1
title:
  zh-CN: 分级统计图
  en-US: Area
---

## zh-CN

分级统计图。

## en-US


````jsx
import { Wcontainer, Wmap } from '@alife/aisc-widgets';


let data = [
  { name: '广东', value: 20 },
  { name: '新疆', value: 1 },
  { name: '山西', value: 5 },
  { name: '山东', value: 10 },
  { name: '浙江', value: 32 },
  { name: '青海', value: 24 },
  { name: '四川', value: 46 },
  { name: '广西', value: 64 },
  { name: '西藏', value: 3 },
  { name: '湖南', value: 7 },
  { name: '湖北', value: 12 },
  { name: '安徽', value: 30 },
  { name: '甘肃', value: 28 },
  { name: '河南', value: 50 },
];

let options = {

  tooltip: {
    nameFormatter(v, raw, i, items) {
      console.log(v, raw, i, items);
      return 'name: ' + v;
    },
    valueFormatter(v, raw, i, items) {
      console.log(v, raw, i, items);
      return 'value: ' + v;
    }
  },
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={600} style={{ width: 800 }}>
        <Wmap config={options}>
          <Wmap.Area data={data} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
