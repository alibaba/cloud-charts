const path = require('path');

const lineData = [
  {
    "name":"机房A",
    "data":[[1483372800000,4092],[1483459200000,1592],[1483545600000,3714],[1483632000000,4854],[1483718400000,6514],[1483804800000,9022],[1483891200000,6023],[1483977600000,4018]]
  }, {
    "name":"机房B",
    "yAxis": 1,
    "data":[[1483372800000,6051],[1483459200000,3278],[1483545600000,5175],[1483632000000,6548],[1483718400000,9048],[1483804800000,11394],[1483891200000,8597],[1483977600000,6588]]
  }
];

module.exports = {
  // 用于设定组件名称，基准测试名称会以此为准，一旦设定不可修改
  name: 'Wline',
  // 用于指定组件的根目录， source + main = 组件的执行文件
  source: path.join(__dirname, '..', 'components', 'Wline'),
  // 指定组件的执行文件地址，可为 jsx,js,tsx 结尾，注意需要为上述 source 的相对地址
  main: 'G2Line.js',
  // 放置测试用例的数组
  cases: [
    {
      // 此 id 一旦创建不可修改
      id: '基础线图',
      // 会直接传输给组件的props，自行定义
      config: {
        data: lineData,
      }
    },
    {
      id: '平滑曲线图',
      config: {
        config: {
          spline: true,
        },
        data: lineData,
      }
    },
    {
      id: '带点折线图',
      config: {
        config: {
          symbol: true,
        },
        data: lineData,
      }
    },
    {
      id: '面积折线图',
      config: {
        config: {
          area: true,
        },
        data: lineData,
      }
    },
    {
      id: '面积曲线图',
      config: {
        config: {
          area: true,
          spline: true,
        },
        data: lineData,
      }
    },
    {
      id: '堆叠面积图',
      config: {
        config: {
          area: true,
          stack: true,
        },
        data: lineData,
      }
    },
    {
      id: '带标签折线图',
      config: {
        config: {
          label: true,
        },
        data: lineData,
      }
    },
    {
      id: '双轴折线图',
      config: {
        config: {
          yAxis: [{}, {}],
        },
        data: lineData,
      }
    },
    {
      id: '阶梯折线图',
      config: {
        config: {
          step: true,
        },
        data: lineData,
      }
    },
    {
      id: '虚线折线图',
      config: {
        config: {
          geomStyle: {
            lineDash(x, y, type) {
              if (type === '机房B') {
                return [4, 4];
              }
              return null;
            }
          }
        },
        data: lineData,
      }
    },
    {
      id: '单点线图',
      config: {
        data: [
          {
            "name":"机房A",
            "data":[[1483632000000,4854]]
          }, {
            "name":"机房B",
            "data":[[1483632000000,6548]]
          }
        ],
      }
    },
  ]
};
