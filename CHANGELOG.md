### 1.0.12 (2021-10-14)

#### New Features

- Wmap label 属性支持 style 配置样式
- Wline area 允许独立配置样式

### 1.0.11 (2021-09-14)

#### New Features

- CDN 字体版本入口文件同步更新

#### Bug Fixes

- 柱图的percentage百分比配置项调整为选填项

### 1.0.10 (2021-09-14)

#### New Features

- Wbar 增加分组百分比堆叠柱图

### 1.0.9(2021-08-19)

#### New Features

- Wbar 增加百分比堆叠柱图
- Wline 增加自定义shape
- Wbar & Wlinebar 增加 columnWidthRatio 和 dodgePadding 等配置

#### Bug Fixes

- guide line 不设置 text 属性会报错的问题

### 1.0.8 (2021-07-30)

#### New Features

- 图例更新到无数据时，valueFormatter 第一项返回空字符串

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
