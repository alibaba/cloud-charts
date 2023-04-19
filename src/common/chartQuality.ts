export default {
  Font: {
    title: '字体的样式和用法一致',
    weight: 10, // 暂时用最外层权重计算
    ruleInfo: [
      {
        key: 'fontFamily',
        value: {
          chineseFont: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', '微软雅黑'],
          englishFont: ['San Francisco', 'Segoe UI'],
          numberFont: ['TXD-DIN'],
        },
        weight: 10,
        description:
          'macOS中文使用“Ping Fang SC”，英文使用“San Francisco”；Windows中文使用“Microsoft YaHei”，英文使用“Segoe UI”；数字在可视化场景使用“TXD-DIN”字体。',
        type: 'node',
      },
    ],
  },
  Colors: {
    title: '颜色应用保持一致',
    weight: 10,
    ruleInfo: [
      {
        key: 'colors',
        value: {},
        weight: 10,
        description: '图表检测出不符合主题色彩的色值',
        type: 'node',
      },
    ],
  },
  Padding: {
    title: '间距应一致',
    weight: 1,
    ruleInfo: [
      {
        key: 'padding',
        value: {},
        weight: 10,
        description: '图表不需要内设间距，特殊图表除外，如镜面图、额外配置了装饰的图表',
        type: 'node',
      },
    ],
  },
  Container: {
    title: '卡片容器应一致',
    weight: 6,
    ruleInfo: [
      {
        key: 'container',
        value: {},
        weight: 10,
        description: '图表不需要额外使用Wcontainer，该组件已废弃，推荐使用ProCard',
        type: 'node',
      },
    ],
  },
  Wline: {
    title: '线图规范',
    weight: 6,
    ruleInfo: [
      {
        key: 'bigdata',
        // 子项
        value: [
          {
            title: '影响性能、图表展示有效性的配置项需要取消',
            description: '数据量过大，关闭标记点、圆滑曲线、面积配置',
            weight: 2
          },
          {
            title: '展示优化项',
            description: '相邻数据点之间最小间距4px，数据多于临界值则开启缩略轴',
            weight: 1
          }
        ],
        weight: 6,
        description: '大数据规则',
        type: 'node',
      },
      {
        key: 'empty',
        value: [
          {
            title: '需要符合图表空数据规范',
            description: '不需要额外配置无数据占位图, 业务组件除外',
            weight: 5
          },
        ],
        weight: 6,
        description: '空数据展示',
        type: 'node',
      },
      {
        key: 'extreme',
        value: [
          {
            title: '单线展示优化',
            description: '只有一条线的数据，自动开启面积、标记点',
            weight: 1
          },
          {
            title: '单点展示优化',
            description: '数据小于等于2，自动开启标记点',
            weight: 1
          },
        ],
        weight: 6,
        description: '极端数据场景',
        type: 'node',
      },
    ],
  },
  Wbar: {
    title: '柱图规范',
    ruleInfo: [
      {
        key: 'bigdata',
        // 子项
        value: [
          {
            title: '展示优化项',
            description: '最小宽度12px，柱之间最小间隔8px，多余临界值开启缩略轴',
            weight: 1
          }
        ],
        weight: 6,
        description: '大数据规则',
        type: 'node',
      },
      {
        key: 'empty',
        value: [
          {
            title: '需要符合图表空数据规范',
            description: '不需要额外配置无数据占位图, 业务组件除外',
            weight: 5
          },
        ],
        weight: 6,
        description: '空数据展示',
        type: 'node',
      },
      {
        key: 'extreme',
        value: [
          {
            title: '分类轴展示优化',
            description: '只有一个数据的时候，默认左对齐',
            weight: 1
          },
          {
            title: '时间轴展示优化',
            description: '左对齐 + 占位展示',
            weight: 1
          },
        ],
        weight: 6,
        description: '极端数据场景',
        type: 'node',
      },
    ],
  },
  Wpie: {
    title: '饼图规范',
    ruleInfo: [
      {
        key: 'bigdata',
        // 子项
        value: [
          {
            title: '展示优化项',
            description: '展示类别大于5，且剩余内容中，小于等于长度/周长的10%的部分， 默认展示为“其他”',
            weight: 1
          }
        ],
        weight: 6,
        description: '大数据规则',
        type: 'node',
      },
      {
        key: 'empty',
        value: [
          {
            title: '需要符合图表空数据规范',
            description: '不需要额外配置无数据占位图, 业务组件除外',
            weight: 5
          },
        ],
        weight: 6,
        description: '空数据展示',
        type: 'node',
      },
      // {
      //   key: 'match',
      //   value: [
      //     {
      //       title: '容器宽高过小的时候，优化展示',
      //       description: '隐藏图例、label',
      //       weight: 1
      //     },
      //     {
      //       title: '​内容区域宽度过小，优化展示',
      //       description: '内容小于宽高的时候，显示为...，支持hover',
      //       weight: 1
      //     },
      //   ],
      //   weight: 6,
      //   description: '适配场景',
      //   type: 'node',
      // },
    ],
  }
};
