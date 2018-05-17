---
order: 4
title:
  zh-CN: ME盒马地图
  en-US: Me
---

## zh-CN

ME盒马地图

## en-US


````jsx
import { Wcontainer, Wmap, COLORS } from '@alife/aisc-widgets';

let data = [
  {
    "name": "北京市",
    "data": [
      {
        "city": "北京市",
        "shop": "北京一店",
        "indicator1": 3000,
        "indicator2": 200,
        "indicator3": 4,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 3000
          }
        ],
        "warning": [
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 200
          }
        ],
        "error": []
      },
      {
        "city": "北京市",
        "shop": "北京二店",
        "indicator1": 2000,
        "indicator2": 300,
        "indicator3": 5,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 2000
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 300
          }
        ],
        "warning": [],
        "error": []
      },
      {
        "city": "北京市",
        "shop": "北京三店",
        "indicator1": 5000,
        "indicator2": 400,
        "indicator3": 2,
        "normal": [
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 400
          }
        ],
        "warning": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 5000
          }
        ],
        "error": []
      }
    ],
    "normal": [
      {
        "city": "北京市",
        "shop": "北京二店",
        "indicator1": 2000,
        "indicator2": 300,
        "indicator3": 5,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 2000
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 300
          }
        ],
        "warning": [],
        "error": []
      }
    ],
    "warning": [
      {
        "city": "北京市",
        "shop": "北京一店",
        "indicator1": 3000,
        "indicator2": 200,
        "indicator3": 4,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 3000
          }
        ],
        "warning": [
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 200
          }
        ],
        "error": []
      },
      {
        "city": "北京市",
        "shop": "北京三店",
        "indicator1": 5000,
        "indicator2": 400,
        "indicator3": 2,
        "normal": [
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 400
          }
        ],
        "warning": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 5000
          }
        ],
        "error": []
      }
    ],
    "error": [],
    "value": 3,
    "type": "异常"
  },
  {
    "name": "上海市",
    "data": [
      {
        "city": "上海市",
        "shop": "上海一店",
        "indicator1": 3600,
        "indicator2": 240,
        "indicator3": 6,
        "normal": [],
        "warning": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 3600
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 240
          }
        ],
        "error": []
      },
      {
        "city": "上海市",
        "shop": "上海零店",
        "indicator1": 2200,
        "indicator2": 640,
        "indicator3": 1,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 2200
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 640
          }
        ],
        "warning": [],
        "error": []
      }
    ],
    "normal": [
      {
        "city": "上海市",
        "shop": "上海零店",
        "indicator1": 2200,
        "indicator2": 640,
        "indicator3": 1,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 2200
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 640
          }
        ],
        "warning": [],
        "error": []
      }
    ],
    "warning": [
      {
        "city": "上海市",
        "shop": "上海一店",
        "indicator1": 3600,
        "indicator2": 240,
        "indicator3": 6,
        "normal": [],
        "warning": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 3600
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 240
          }
        ],
        "error": []
      }
    ],
    "error": [],
    "value": 2,
    "type": "异常"
  },
  {
    "name": "杭州市",
    "data": [
      {
        "city": "杭州市",
        "shop": "亲橙里",
        "indicator1": 1000,
        "indicator2": 500,
        "indicator3": 10,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 1000
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 500
          }
        ],
        "warning": [],
        "error": []
      }
    ],
    "normal": [
      {
        "city": "杭州市",
        "shop": "亲橙里",
        "indicator1": 1000,
        "indicator2": 500,
        "indicator3": 10,
        "normal": [
          {
            "key": "indicator1",
            "name": "指标一",
            "value": 1000
          },
          {
            "key": "indicator2",
            "name": "指标二",
            "value": 500
          }
        ],
        "warning": [],
        "error": []
      }
    ],
    "warning": [],
    "error": [],
    "value": 1,
    "type": "正常"
  }
];

function valueFormatter(value, raw, index, items) {
  const errorShop = raw.error.concat(raw.warning);
  if (errorShop.length === 0) {
    return '正常';
  }

  const errorKeyMap = {};
  const errorShopStr = errorShop.map((e) => {
    const { shop } = e;

    e.error.concat(e.warning).forEach((keyInfo) => {
      if (errorKeyMap[keyInfo.key]) {
        errorKeyMap[keyInfo.key].count += 1;
      } else {
        errorKeyMap[keyInfo.key] = {
          name: keyInfo.name,
          count: 1
        };
      }
    });

    return `<span style="display: block; color: ${COLORS.widgetsColorOrange}">${shop}</span>`;
  }).join('');

  const errorKey = Object.keys(errorKeyMap).map((errorKey) => {
    const info = errorKeyMap[errorKey];
    return `<span style="color: ${COLORS.widgetsColorOrange}">${info.name}</span> 报警${info.count}次`;
  });

  return `<br /><span style="display: block; margin: 8px 0 4px 0">异常门店：<span style="color: ${COLORS.widgetsColorRed}">${errorShop.length}家</span></span>
${errorShopStr}<span style="display: block; margin: 8px 0 4px 0">异常指标：<span style="color: ${COLORS.widgetsColorRed}">${errorKey.length}个</span></span>${errorKey.join('<br />')}`;
}

let options = {
  pointColors(type) {
    return type === '异常' ? COLORS.widgetsColorRed : COLORS.widgetsColorGreen;
  },
  dataType: 'g2',
  tooltip: {
    valueFormatter: valueFormatter
  },
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={600} style={{ width: 800 }}>
        <Wmap config={options}>
          <Wmap.Point data={data} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
