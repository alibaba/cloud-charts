---
category: 组件
subtitle: 桑基图
type: 图表组件
title: WSankey
cols: 1
---


## API

### 通用参数

| 成员 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| config | 相关配置 | Object | 见下方具体配置 |
| data | 传入数据，必填 | Array | 见下方具体配置 |
| width | 容器宽度 | Number | 自适应父元素宽度 |
| height | 容器高度 | Number | 自适应父元素高度 |

### 桑基图配置及数据格式

* config:

```javascript
  {
    tooltip: { //默认显示，设置为false时，表示不显示
      formatter: null, // tooltip value格式化函数。参数：target,source,value
    },
    textStyle: {
      fill: '#545454',
      textAlign: 'start'
    },//文字颜色与对齐方式
    padding: [12, 0, 12, 0] //容器内边距，单位是像素。不建议修改
  }
```

* data:

```javascript
  {
      "nodes": [
          {
              "name": "Brazil"
          },
          {
              "name": "Portugal"
          },
          {
              "name": "France"
          },
          {
              "name": "Spain"
          },
          {
              "name": "England"
          },
          {
              "name": "Canada"
          },
          {
              "name": "Mexico"
          },
          {
              "name": "USA"
          },
          {
              "name": "Angola"
          },
          {
              "name": "Senegal"
          },
          {
              "name": "Morocco"
          },
          {
              "name": "South Africa"
          },
          {
              "name": "Mali"
          },
          {
              "name": "China"
          },
          {
              "name": "India"
          },
          {
              "name": "Japan"
          }
      ],
      "links": [
          {
              "source": 0,
              "target": 1,
              "value": 5
          },
          {
              "source": 0,
              "target": 2,
              "value": 1
          },
          {
              "source": 0,
              "target": 3,
              "value": 1
          },
          {
              "source": 0,
              "target": 4,
              "value": 1
          },
          {
              "source": 5,
              "target": 1,
              "value": 1
          },
          {
              "source": 5,
              "target": 2,
              "value": 5
          },
          {
              "source": 5,
              "target": 4,
              "value": 1
          },
          {
              "source": 6,
              "target": 1,
              "value": 1
          },
          {
              "source": 6,
              "target": 2,
              "value": 1
          },
          {
              "source": 6,
              "target": 3,
              "value": 5
          },
          {
              "source": 6,
              "target": 4,
              "value": 1
          },
          {
              "source": 7,
              "target": 1,
              "value": 1
          },
          {
              "source": 7,
              "target": 2,
              "value": 1
          },
          {
              "source": 7,
              "target": 3,
              "value": 1
          },
          {
              "source": 7,
              "target": 4,
              "value": 5
          },
          {
              "source": 1,
              "target": 8,
              "value": 2
          },
          {
              "source": 1,
              "target": 9,
              "value": 1
          },
          {
              "source": 1,
              "target": 10,
              "value": 1
          },
          {
              "source": 1,
              "target": 11,
              "value": 3
          },
          {
              "source": 2,
              "target": 8,
              "value": 1
          },
          {
              "source": 2,
              "target": 9,
              "value": 3
          },
          {
              "source": 2,
              "target": 12,
              "value": 3
          },
          {
              "source": 2,
              "target": 10,
              "value": 3
          },
          {
              "source": 2,
              "target": 11,
              "value": 1
          },
          {
              "source": 3,
              "target": 9,
              "value": 1
          },
          {
              "source": 3,
              "target": 10,
              "value": 3
          },
          {
              "source": 3,
              "target": 11,
              "value": 1
          },
          {
              "source": 4,
              "target": 8,
              "value": 1
          },
          {
              "source": 4,
              "target": 9,
              "value": 1
          },
          {
              "source": 4,
              "target": 10,
              "value": 2
          },
          {
              "source": 4,
              "target": 11,
              "value": 7
          },
          {
              "source": 11,
              "target": 13,
              "value": 5
          },
          {
              "source": 11,
              "target": 14,
              "value": 1
          },
          {
              "source": 11,
              "target": 15,
              "value": 3
          },
          {
              "source": 8,
              "target": 13,
              "value": 5
          },
          {
              "source": 8,
              "target": 14,
              "value": 1
          },
          {
              "source": 8,
              "target": 15,
              "value": 3
          },
          {
              "source": 9,
              "target": 13,
              "value": 5
          },
          {
              "source": 9,
              "target": 14,
              "value": 1
          },
          {
              "source": 9,
              "target": 15,
              "value": 3
          },
          {
              "source": 12,
              "target": 13,
              "value": 5
          },
          {
              "source": 12,
              "target": 14,
              "value": 1
          },
          {
              "source": 12,
              "target": 15,
              "value": 3
          },
          {
              "source": 10,
              "target": 13,
              "value": 5
          },
          {
              "source": 10,
              "target": 14,
              "value": 1
          },
          {
              "source": 10,
              "target": 15,
              "value": 3
          }
      ]
  }
```

