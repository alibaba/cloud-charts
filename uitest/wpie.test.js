const path = require('path');

const pieData = [
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

module.exports = {
  // 用于设定组件名称，基准测试名称会以此为准，一旦设定不可修改
  name: 'Wpie',
  // 用于指定组件的根目录， source + main = 组件的执行文件
  source: path.join(__dirname, '..', 'components', 'Wpie'),
  // 指定组件的执行文件地址，可为 jsx,js,tsx 结尾，注意需要为上述 source 的相对地址
  main: 'G2Pie.js',
  // 放置测试用例的数组
  cases: [
    {
      // 此 id 一旦创建不可修改
      id: '基础饼图',
      // 会直接传输给组件的props，自行定义
      config: {
        data: pieData,
      }
    },
    {
      id: '圆环',
      config: {
        config: {
          cycle: true,
        },
        data: pieData,
      }
    },
    {
      id: '带标签饼图',
      config: {
        config: {
          label: true,
          legend: false,
        },
        data: pieData,
      }
    },
    {
      id: '选择饼图',
      config: {
        config: {
          select: true,
          selectData: 'Chrome',
        },
        data: pieData,
      }
    },
  ]
};
