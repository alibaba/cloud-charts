### 1.0.30 (2022-01-31)
#### New Features
- 线图柱图缩略轴自适应
- 柱状图增加间距检测
- 散点图增加点大小检测
- 更新主题配置

#### Bug Fixes

- 修复额外图表背景色问题

### 1.0.29 (2022-12-29)
#### New Features
- 增加20色主题
- 增加颜色校验规则以及提示
- 更新业务组件无数据占位图颜色

### 1.0.28 (2022-12-08)
#### New Features
- 支持自定义组件的空数据检测
- 新增业务图表空数据占位样式
- 优化图表异常显示
- 更新默认亮暗色主题
- 增加大数据下线图性能优化方案

#### Bug Fixes

- 数据完整性检测问题修复

### 1.0.27 (2022-11-30)
#### New Features
- 统一优化图表异常展示
- 增加空数据检测以及对应展示优化
- 优化大数据检测逻辑

#### Bug Fixes

- 修复线图数据字段为空时的图表显示问题

### 1.0.26 (2022-11-01)
- 3.0.25版本跳过
#### Bug Fixes

- 修复同时改数据与尺寸造成的绘制问题
- 修复柱图多视图情况下数据更新不正确的问题 & 增加对应示例

### 1.0.24 (2022-09-23)

#### Bug Fixes

- 修复构建缺少对应依赖的问题

### 1.0.23 (2022-09-19)
#### New Features

- 升级 G2 依赖版本
- 增加整数型轴标签计算方法
- 增加图例自适应能力，开放对应配置
- 增加通过事件设置图表库主题的能力
- 增加横向柱状图镜像配置
- Tooltip 增加分列展示能力
- 更新设计规范
- 更新柱图最大宽度

#### Bug Fixes

- 自动时间格式错误回退到默认格式的问题

### 1.0.22 (2022-08-19)

#### New Features

- 图表大小变化时关闭动画，降低性能消耗，避免 guide 动画渲染错位的问题
- 飞线子弹阴影颜色能从数据中获取

#### Bug Fixes

- 数据更新后饼图内容元素位置没有更新的问题

### 1.0.21 (2022-05-13)

#### New Features

- 多次主题切换时 css 变量保持合并状态

#### Bug Fixes

- 全局变量设置主题可能报错的问题

### 1.0.20 (2022-05-11)

#### New Features

- 优化相邻层次图 label 逻辑
- 全局 label 增加 callback 配置能力
- 优化 label 函数入参模式

#### Bug Fixes

- Wmap 开启 label 有冗余报错
- 通过 window 设置默认主题时会报错的问题

### 1.0.19 (2022-04-14)

#### New Features

- 饼图/多重饼图增加渲染角度控制项
- 优化镜像柱图配置逻辑，支持横向镜面条形图
- 增加从全局变量获取默认主题的能力
- cdn 模式添加线点图入口
- 添加 react 开发依赖
- 优化 Wmap 配置项类型
- 优化 Function 类型
- 优化辅助线类型
- 优化基础类型注释
- 增加 appendPadding 适配

#### Bug Fixes

- 图表 chartInit 打点不正确的问题
- 线柱图 areaColors 不生效的问题
- 地图组件类型问题

### 1.0.18 (2022-01-14)

#### New Features

- 调整依赖配置

### 1.0.17 (2022-01-14)

#### New Features

- 增加线点图以及示例
- react 依赖版本扩充

#### Bug Fixes

- 线柱图 bar size array key 不正确的问题

### 1.0.16 (2022-01-06)

#### Bug Fixes

- 更新漏斗图自定义label & 修复percent位置居中问题
- 修复容器内部图表自适应问题

### 1.0.15 (2022-01-06)

#### New Features

- 饼图支持空数据时展示灰色块
- Wbar 增加 dodge 配置项，控制分类模式。优化 geom 绘制逻辑

#### Bug Fixes

- 饼图总数为0显示NAN的问题
- 漏斗图labelformater失效的问题
- 分面柱状图 yAxis.labelFormatter 失效的问题
- 轴配置类型不严谨

### 1.0.14 (2021-12-13)

#### New Features

- 增加 beforeWidgetsInit & afterWidgetsInit 特殊事件
- 增加 beforeWidgetsChangeData & afterWidgetsChangeData 特殊事件
- chore: 补充 node-sass 依赖 && 适配底层 sass-loader 更新后的编译配置

#### Bug Fixes

- geomStyle 某些情况下样式互相影响的问题

### 1.0.13 (2021-11-08)

#### Bug Fixes

- 修复 tooltip padding 不生效的问题。
- 修复 柱形状 active region 交互样式无法跟随主题的问题
- 注释修复

### 1.0.12 (2021-10-14)

#### New Features

- Wmap label 属性支持 style 配置样式。
- Wline area 允许独立配置样式。

### 1.0.11 (2021-09-14)

#### New Features

- CDN 字体版本入口文件同步更新。

#### Bug Fixes

- 柱图的percentage百分比配置项调整为选填项。

### 1.0.10 (2021-09-14)

#### New Features

- Wbar 增加分组百分比堆叠柱图。

### 1.0.9(2021-08-19)

#### New Features

- Wbar 增加百分比堆叠柱图。
- Wline 增加自定义shape。
- Wbar & Wlinebar 增加 columnWidthRatio 和 dodgePadding 等配置。

#### Bug Fixes

- guide line 不设置 text 属性会报错的问题。

### 1.0.8 (2021-07-30)

#### New Features

- 图例更新到无数据时，valueFormatter 第一项返回空字符串。

#### Bug Fixes

- 饼图带图例 formatter 时从有数据到无数据报错的问题。

### 1.0.7 (2021-07-30)

#### New Features

- 图表支持配置 interaction。
- 导出 G2 核心包，方便自定义底层扩展。

#### Bug Fixes

- 饼图从有数据更新到无数据时报错的问题。

### 1.0.6 (2021-07-30)

#### New Features

- Wmap 地图组件支持多个同类型图层同时渲染。
- 优化滚动条组件样式，并接入主题变量。

#### Bug Fixes

- Wmap 地图组件图层在更新时无法响应配置项变化的问题。
- 工具类文件循环依赖的问题。

### 1.0.5 (2021-04-12)

#### Bug Fixes

- 迷你线图线条可能变细的问题

- (test) 测试用例切换主题没有名字的问题

### 1.0.4 (2021-03-30)

#### New Features

- 线柱图 Wlinebar 增加 barSize 配置，可以设置柱的粗细。

- 主题包新增线粗细配置项。

#### Bug Fixes

- 饼图 Wpie 只有一条数据时点选事件导致跳动的问题。

- 不传配置项时更新数据会报错的问题。

- 世界地图组件引用异常。

- 矩形分箱图 Wrectangle 轴设置为时间类型报错的问题。

- 按需加载后缺少 dataset 部分函数导致报错的问题。

### 1.0.0 (2021-03-05)

1.0 大版本正式发布，详细请见：https://www.yuque.com/docs/share/6f29041d-dab8-44c7-8848-fa376ee4e9e8

### 0.1.10 (2021-01-15)

#### New Features

- 组件增加“允许函数配置项更新”的选项。
- 优化 afterrender 渲染周期。

#### Bug Fixes

- 自动计算padding在图例设定固定折叠行数后可能不正确的问题。

### 0.1.9 (2020-12-11)

#### Refactor

- style(g2Theme.js): add userSelect attribute to prevent users from selecting text of the legend

#### Bug Fixes

- 一些scss样式计算错误，导致被 less 引用时报错

- 饼图图例出现滚动条(Chrome 87)

### 0.1.8 (2020-11-20)

#### New Features

- Wnumber 数字组件新增 rightRatioStatus 属性。

### 0.1.7 (2020-11-11)

双十一来啦，大家买的开心(手还好)吗？

#### New Features

- 图表联动增加自定义联动函数的能力。

- 散点图增加扰动点图配置能力。

### 0.1.6 (2020-10-23)

#### New Features

- 圆环 Wcircle 补充 propTypes。
- refactor: 优化 guide filter，增加健壮性。

### 0.1.5 (2020-09-28)

#### New Features

- 色块图添加label功能。
- chore: 补全地图 d.ts 文件。
- chore: module引用样式改为css。

### 0.1.4 (2020-09-24)

#### Bug Fixes

- npm缺少 index.d.ts 文件。

### 0.1.3 (2020-09-10)

#### Bug Fixes

- npm引用时tree-shaking无法正确保留css的问题。

### 0.1.2 (2020-09-03)

#### New Features

- chore: 添加 index.d.ts 文件。

#### Bug Fixes

- 打点函数能正确统计动态切换的主题。

### 0.1.1 (2020-08-28)

#### New Features

- chore: 添加 sideEffects 设置。

#### Bug Fixes

- 地图组件某些城市定位错误的问题。

- 某些组件关闭图例后依然有canvas图例。

### 0.1.0 (2020-08-05)

面向中后台的开箱即用图表库，让前端图表更简单。
