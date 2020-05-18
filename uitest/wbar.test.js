const path = require('path');

const barData = [
  {
    name: '柱1',
    facet: '分面1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 100],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
  {
    name: '柱2',
    facet: '分面2',
    data: [
      ['一', 92],
      ['二', 15],
      ['三', 4],
      ['四', 49],
      ['五', 64],
      ['六', 76],
      ['七', 21],
      ['八', 100],
      ['九', 71],
    ],
  },
];

const barData2 = [
  {
    "name":"柱1",
    "data":[["一",[12, 76]],["二",[30, 68]],["三",[36, 81]],["四",[37, 77]],["五",[12, 81]],["六",[46, 100]],["七",[30, 90]],["八",[18, 79]],["九",[8, 73]]]
  },
  {
    "name":"柱2",
    "data":[["一",[30, 92]],["二",[2, 54]],["三",[45, 76]],["四",[20, 69]],["五",[24, 88]],["六",[0, 76]],["七",[18, 41]],["八",[28, 100]],["九",[25, 96]]]
  }
];

const barData3 = [{"name":"柱1","dodge":"分组1","data":[["0-0",370],["1-1",396],["2-2",376],["3-3",367],["4-4",395]]},{"name":"柱2","dodge":"分组2","data":[["0-0",151],["1-1",152],["2-2",118],["3-3",126],["4-4",167]]},{"name":"柱3","dodge":"分组2","data":[["0-0",111],["1-1",104],["2-2",184],["3-3",199],["4-4",109]]}];

module.exports = {
  // 用于设定组件名称，基准测试名称会以此为准，一旦设定不可修改
  name: 'Wbar',
  // 用于指定组件的根目录， source + main = 组件的执行文件
  source: path.join(__dirname, '..', 'components', 'Wbar'),
  // 指定组件的执行文件地址，可为 jsx,js,tsx 结尾，注意需要为上述 source 的相对地址
  main: 'G2Bar.js',
  // 放置测试用例的数组
  cases: [
    {
      // 此 id 一旦创建不可修改
      id: '基础柱图',
      // 会直接传输给组件的props，自行定义
      config: {
        data: barData,
      }
    },
    {
      id: '多组堆叠',
      config: {
        config: {
          stack: true,
        },
        data: barData,
      }
    },
    {
      id: '横向柱状',
      config: {
        config: {
          column: false
        },
        data: barData,
      }
    },
    {
      id: '横向堆叠',
      config: {
        config: {
          column: false,
          stack: true,
        },
        data: barData,
      }
    },
    {
      id: '带标签柱图',
      config: {
        config: {
          label: true,
        },
        data: barData,
      }
    },
    {
      id: '带标签堆叠柱图',
      config: {
        config: {
          label: true,
          stack: true,
        },
        data: barData,
      }
    },
    {
      id: '镜面柱图',
      config: {
        config: {
          // marginRatio: 0.05,
          facet: true
        },
        data: barData,
      }
    },
    {
      id: '区间柱状图',
      config: {
        config: {
        },
        data: barData2,
      }
    },
    {
      id: '区间条形图',
      config: {
        config: {
          column: false,
        },
        data: barData2,
      }
    },
    {
      id: '分组堆叠图',
      config: {
        config: {
          dodgeStack: true
        },
        data: barData3,
      }
    },

  ]
};
