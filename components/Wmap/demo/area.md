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
  {
    "name": "一",
    "data": [
      {
        "name": "北京",
        "value": 10
      },
      {
        "name": "天津",
        "value": 18
      },
      {
        "name": "上海",
        "value": 22
      },
      {
        "name": "重庆",
        "value": 39
      },
      {
        "name": "内蒙古",
        "value": 22
      },
      {
        "name": "广西",
        "value": 43
      }
    ]
  },
  {
    "name": "二",
    "data": [
      {
        "name": "西藏",
        "value": 56
      },
      {
        "name": "宁夏",
        "value": 65
      },
      {
        "name": "新疆",
        "value": 69
      },
      {
        "name": "香港",
        "value": 22
      },
      {
        "name": "澳门",
        "value": 36
      },
      {
        "name": "江西",
        "value": 95
      }
    ]
  },
  {
    "name": "三",
    "data": [
      {
        "name": "河南",
        "value": 23
      },
      {
        "name": "四川",
        "value": 105
      },
      {
        "name": "贵州",
        "value": 141
      },
      {
        "name": "辽宁",
        "value": 33
      },
      {
        "name": "山东",
        "value": 135
      },
      {
        "name": "山西",
        "value": 115
      }
    ]
  },
  {
    "name": "四",
    "data": [
      {
        "name": "浙江",
        "value": 160
      },
      {
        "name": "海南",
        "value": 49
      },
      {
        "name": "陕西",
        "value": 140
      },
      {
        "name": "福建",
        "value": 134
      },
      {
        "name": "青海",
        "value": 197
      },
      {
        "name": "湖北",
        "value": 202
      }
    ]
  },
  {
    "name": "五",
    "data": [
      {
        "name": "甘肃",
        "value": 31
      },
      {
        "name": "安徽",
        "value": 224
      },
      {
        "name": "台湾",
        "value": 126
      },
      {
        "name": "云南",
        "value": 235
      },
      {
        "name": "黑龙江",
        "value": 72
      },
      {
        "name": "广东",
        "value": 91
      }
    ]
  },
  {
    "name": "六",
    "data": [
      {
        "name": "湖南",
        "value": 212
      },
      {
        "name": "河北",
        "value": 27
      },
      {
        "name": "吉林",
        "value": 22
      },
      {
        "name": "江苏",
        "value": 295
      }
    ]
  }
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
