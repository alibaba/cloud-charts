---
order: 5
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

遇到特殊的时间值时，会导致highcharts补充多余的X轴值。

Mon Oct 02 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Oct 09 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Oct 16 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Oct 23 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Oct 30 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Nov 06 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Nov 13 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Nov 20 2017 08:00:00 GMT+0800 (中国标准时间)
Mon Nov 27 2017 08:00:00 GMT+0800 (中国标准时间)

## en-US


````jsx
import { Wlinebar } from '@alife/aisc-widgets';

let data = [
    {
        "name": "装机总量",
        "data": [
            [
                1506902400000,
                382
            ],
            [
                1507507200000,
                16412
            ],
            [
                1508112000000,
                10166
            ],
            [
                1508716800000,
                8464
            ],
            [
                1509321600000,
                15170
            ],
            [
                1509926400000,
                1755
            ],
            [
                1510531200000,
                6544
            ],
            [
                1511136000000,
                7698
            ],
            [
                1511740800000,
                5157
            ]
        ],
        "type": "bar",
        "yAxis": 0
    },
    {
        "name": "一次性成功率",
        "data": [
            [
                1506902400000,
                97.38
            ],
            [
                1507507200000,
                95.38
            ],
            [
                1508112000000,
                90.63
            ],
            [
                1508716800000,
                91.59
            ],
            [
                1509321600000,
                89.55
            ],
            [
                1509926400000,
                86.61
            ],
            [
                1510531200000,
                93.34
            ],
            [
                1511136000000,
                93.54
            ],
            [
                1511740800000,
                93.41
            ]
        ],
        "type": "line",
        "yAxis": 1
    },
    {
        "name": "一小时完成率",
        "data": [
            [
                1506902400000,
                85.86
            ],
            [
                1507507200000,
                87.09
            ],
            [
                1508112000000,
                83.78
            ],
            [
                1508716800000,
                81.75
            ],
            [
                1509321600000,
                81.53
            ],
            [
                1509926400000,
                82.62
            ],
            [
                1510531200000,
                85.07
            ],
            [
                1511136000000,
                83.44
            ],
            [
                1511740800000,
                86.68
            ]
        ],
        "type": "line",
        "yAxis": 1
    }
];

// 如果没有下面这一段代码，会导致X轴多出一个没有意义的项
data.forEach((d) => {
  d.data.forEach((da) => {
    da[0] = da[0] - 8*60*60*1000;
  });
});

let options1 = {
  legend:{
    align: 'right',
    allowAllCanceled: true,
  },
  xAxis: {
    type: 'timeCat',
    labelFormatter: (name) => {
      console.log(new Date(name));
      return (new Date(name)).toLocaleString();
    }
  },
  yAxis: [{
    labelFormatter: (value) => {
      return value + '个';
    }
  },
  {
    labelFormatter: (value) => {
      return value + '%';
    }
  }]
}

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item" style={{height: "298px"}}>
            <Wlinebar config={options1} data={data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
