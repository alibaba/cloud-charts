### 3.0.25 (2022-010-27)

#### Bug Fixes

- 修复同时改数据与尺寸造成的绘制问题
- 修复柱图多视图情况下数据更新不正确的问题 & 增加对应示例

### 3.0.24 (2022-09-23)

#### Bug Fixes

- 修复构建缺少对应依赖的问题

### 3.0.23 (2022-09-16)

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

### 3.0.19 (2022-04-14)

#### New Features

- 饼图/多重饼图增加渲染角度控制项
- 优化镜像柱图配置逻辑，支持横向镜面条形图
- 增加从全局变量获取默认主题的能力
- 增加通过事件设置图表库主题的能力
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

### 3.0.18 (2022-01-14)

#### Bug Fixes

- 调整依赖配置

### 3.0.17 (2022-01-13)

#### New Features

- 增加线点图以及示例
- react 依赖版本扩充

#### Bug Fixes

- 线柱图 bar size array key 不正确的问题

### 3.0.16 (2022-01-06)

#### Bug Fixes

- 修复容器内部图表自适应问题
- 修复漏斗图percent位置居中问题
- 更新漏斗图自定义label

### 3.0.15 (2022-01-04)

#### New Features

- 饼图支持空数据时展示灰色块
- Wbar 增加 dodge 配置项，控制分类模式。优化 geom 绘制逻辑

#### Bug Fixes

- 饼图总数为0显示NAN的问题
- 漏斗图labelformater失效的问题
- 分面柱状图 yAxis.labelFormatter 失效的问题
- 轴配置类型不严谨

### 3.0.14 (2021-12-13)

#### New Features

- 增加 beforeWidgetsInit & afterWidgetsInit 特殊事件
- 增加 beforeWidgetsChangeData & afterWidgetsChangeData 特殊事件
- chore: 补充 node-sass 依赖 && 适配底层 sass-loader 更新后的编译配置

#### Bug Fixes

- geomStyle 某些情况下样式互相影响的问题

### 3.0.13 (2021-11-4)

#### Bug Fixes

- 修复 tooltip padding 不生效的问题
- 柱形状 active region 交互样式无法跟随主题的问题

### 3.0.12 (2021-10-14)

#### New Features

- Wmap label 属性支持 style 配置样式。
- Wline area 允许独立配置样式。

### 3.0.11 (2021-09-27)

#### Bug Fixes

- Wbar 分组百分比堆叠柱图调整为选填项。
- CDN 字体路径更新。

### 3.0.10 (2021-08-24)

#### New Features

- Wbar 增加分组百分比堆叠柱图。

### 3.0.9 (2021-08-19)

#### New Features

- Wbar 增加百分比堆叠柱图。

### 3.0.8 (2021-07-05)

#### New Features

- 图例更新到无数据时，valueFormatter 第一项返回空字符串。

#### Bug Fixes

- 饼图带图例 formatter 时从有数据到无数据报错的问题。

### 3.0.7 (2021-07-02)

#### New Features

- 图表支持配置 interaction。
- 导出 G2 核心包，方便自定义底层扩展。

#### Bug Fixes

- 饼图从有数据更新到无数据时报错的问题。

### 3.0.6 (2021-05-20)

#### New Features

- Wmap 地图组件支持多个同类型图层同时渲染。
- 优化滚动条组件样式，并接入主题变量。

#### Bug Fixes

- Wmap 地图组件图层在更新时无法响应配置项变化的问题。
- 工具类文件循环依赖的问题。

### 3.0.5 (2021-04-02)

#### Bug Fixes

- Wminiline 迷你线图线条可能变细的问题。

### 3.0.4 (2021-03-25)

#### New Features

- 新增 云效（yunxiao）主题包
- 主题包新增线粗细配置项。

#### Bug Fixes

- Wrectangle 矩形分箱图轴设置为时间类型时报错的问题。
- 按需加载后缺少 dataset 部分函数导致报错的问题。

### 3.0.3 (2021-03-18)

#### Bug Fixes

- 图表不传配置项时更新数据会报错的问题。

### 3.0.2 (2021-03-11)

#### Bug Fixes

- Wpie 饼图只有一条数据时点选事件导致跳动的问题。
- 世界地图组件引用异常。

### 3.0.1 (2021-03-04)

#### New Features

- Wlinebar 线柱图增加柱粗细配置项 barSize。

### 3.0.0 (2021-02-23)

大版本更新，详细请看：[《TXD-Widgets 3.0 全新来袭》](https://yuque.antfin.com/docs/share/46bb0ad4-4109-424b-9023-badcc7772b57?)

配置项变更请看 [3.0 升级指南](https://yuque.antfin.com/docs/share/bec5abe5-e333-481f-88b3-ebd4b968bbfc)



---



## 2.X

### 2.6.31 (2021-03-11)

#### Bug Fixes

- Wtreemap 矩阵树图数据更新可能报错的问题。

### 2.6.30 (2021-03-04)

#### New Features

- Wlinebar 线柱图增加柱粗细配置项 barSize。

### 2.6.29 (2021-01-08)

#### New Features

- 组件基类增加“允许函数配置更新”的属性。

### 2.6.28 (2020-12-30)

#### New Features

- 优化 afterrender 渲染周期，减少渲染延迟。

#### Bug Fixes

- 自动计算padding在图例设定固定折叠行数后可能不正确的问题。

### 2.6.27 (2020-12-11)

#### Bug Fixes

- 饼图图例默认会出现滚动条的问题。

### 2.6.26 (2020-11-24)

#### Bug Fixes

- 部分 scss 定义错误，导致 less 引入样式报错。

### 2.6.25 (2020-11-19)

#### New Features

- Wnumber 数字组件新增 rightRatioStatus 属性。

### 2.6.24 (2020-11-11)

双十一来啦，大家的手还好吗？

#### New Features

- 图表联动增加自定义联动函数的能力。

- 散点图增加扰动点图配置能力。

### 2.6.23 (2020-10-22)

#### New Features

- npm 引用scss改为css。

- 补充 d.ts 声明。

#### Bug Fixes

- 辅助标记 Guide.filter 在无数据时可能会报错的问题。

### 2.6.22 (2020-09-17)

#### New Features

- Wheatmap 色块图添加label功能。

### 2.6.21 (2020-09-10)

#### Bug Fixes

- npm引用时tree-shaking无法正确保留css的问题。

### 2.6.20 (2020-09-03)

#### Bug Fixes

- 打点函数能正确统计动态切换的主题。

### 2.6.19 (2020-08-28)

#### New Features

- chore: package 去除 module 字段。

### 2.6.18 (2020-08-28)

#### Bug Fixes

- 地图组件某些城市定位错误的问题。

### 2.6.17 (2020-08-13)

#### New Features

- chore: 添加 sideEffects 设置。

#### Bug Fixes

- 某些组件关闭图例后依然有canvas图例。

### 2.6.16 (2020-07-23)

#### New Features

- chore: 增加 d.ts 文件。

### 2.6.15 (2020-07-16)

#### New Features

- chore: 升级 G2 版本至 3.5.17。
- Wshoot 优化飞线弧度逻辑。

### 2.6.14 (2020-07-02)

#### New Features

- track 打点函数允许通过全局变量关闭。
- Wmap 地图组件暴露内部 Geo数据 和 省市经纬度数据。
- Wshoot 飞线组件允许动态更新 getPosition 函数。

#### Bug Fixes

- 修复 Wshoot 飞线只展示第一次渲染的数据的问题。

### 2.6.13 (2020-06-15)

#### Bug Fixes

- 修复自动计算padding不生效的bug。

### 2.6.12 (2020-06-11)

#### New Features

- 基础图表添加 geomStyle 配置项。

#### Bug Fixes

- 修复 Wmap 自动计算padding的bug。

### 2.6.11 (2020-05-28)

#### Bug Fixes

- 修复 html图例自动计算padding的bug。

### 2.6.10 (2020-05-14)

#### New Features

- docs: 调整内置 gui.schema 配置。

### 2.6.9 (2020-05-08)

#### New Features

- Wfunnel 新增 label 和 percent 配置项。
- Wtreemap 微调样式以适应主题，borderStyle 配置项改为 geomStyle。

### 2.6.8 (2020-04-23)

#### New Features

- Wheatmap 色块图新增 geomStyle 支持，新增坐标系相关配置。

### 2.6.7 (2020-04-16)

#### New Features

- Wcircle 圆环组件新增“success”状态。
- Wcontainer 卡片的 titleBorder 颜色跟随主色。
- 优化主题变量，并重新内置到库内维护。

#### Bug Fixes

- Wmap 地图南海诸岛不响应主题切换的问题。

### 2.6.6 (2020-04-09)

#### New Features

- 新增 Wtreemap 矩形树图，并支持多层深度的嵌套矩形树图。
- chore: 优化响应配置更新的逻辑，默认忽略配置中回调函数的更新。
- chore: 所有基础图表新增错误捕获的能力，防止报错导致页面崩溃。

#### Bug Fixes

- WmultiPie 多层饼图 在两层数据深度时中心有空缺。
- Wpie 饼图 图例较多时无法上下滚动。
- Wmap 地图 南海诸岛尺寸无法缩放。

### 2.6.5 (2020-04-02)

#### New Features

- 新增图例方向支持自动计算padding功能，目前所有直角坐标系图表默认全部使用 auto padding。
- 新增npm按需加载能力，大幅调整文件结构，现在可以使用 tree-shaking 来精简图表库尺寸了。详情：https://widgets.alibaba-inc.com/quickstart/tree-shaking
- Wcontainer 卡片新增捕获包裹组件的报错并提示的功能，防止图表库报错导致页面崩溃。
- 调整 Wcandlestick 烛形图的配置项和数据格式，更贴近其它组件的用法。
- 优化 Whistogram 直方图逻辑和配置项，支持更多分箱算法配置。
- chore: 优化主题包逻辑，为后续图表设计器打下基础。
- chore: 升级 G2 版本至 3.5.14。
- 在 npm 中添加8个组件的 gui.schema.json 文件，方便搭建系统使用。

### 2.6.4 (2020-03-26)

#### New Features

- 新增图例方向支持 auto padding 的功能。
- chore: 优化主题包，收敛主题变量。

#### Bug Fixes

- Guide 辅助标记状态色没有动态响应主题切换的问题。
- 饼图图例在位置足够时可能会换行的问题。
- Wscatter 散点图在自定义size时可能出现拖拽图例的问题。

### 2.6.3 (2020-03-19)

#### New Features

- chore: 升级 G2 版本至 3.5.13。
- chore: 更新 亮色/暗色 主题包样式。
- 常用直角坐标系图表 padding 默认值改为 auto，更加方便使用。
- 地图 Wmap.Custom 自定义图层不再遮挡底层内容的鼠标事件。

#### Bug Fixes

- 圆环底部标题文字颜色不受主题控制的问题。

### 2.6.2 (2020-02-27)

#### New Features

- 辅助标记Guide - line&area 设置新增 style 属性，允许自定义对应样式。
- 更新专有云 亮色/暗色 主题包。

#### Bug Fixes

- 动态切换主题时部分图表样式不正确的问题。

### 2.6.1 (2020-02-20)

#### Bug Fixes

- 多重饼图尺寸错误的问题。
- npm引用在某些构建系统中报错的问题。

### 2.6.0 (2020-02-20)

#### New Features

- 新增「动态切换主题」功能，不刷线页面也能切换主题，更加简单易用，详见：https://widgets.alibaba-inc.com/quickstart/theme
- 新增「自动计算时间格式」功能，已在 线图、迷你线图、散点图 中默认开启，其余图表可以手动开启。
- 新增图表：Whistogram 直方图，详见：https://widgets.alibaba-inc.com/example/Whistogram
- 新增图表：Wcandlestick 烛型图，详见：https://widgets.alibaba-inc.com/example/Wcandlestick
- Wnightingale 玫瑰图 新增「玫瑰环图」功能。详见：https://widgets.alibaba-inc.com/example/Wnightingale/Wnightingale-circle
- Wbar 柱状图 新增「玉玦图」功能。详见：https://widgets.alibaba-inc.com/example/Recommendation/Wbar-radial
- Wmap 区域地图&散点地图 支持props传入 config 配置项。
- Wfunnel 漏斗图配置项优化，`config.align` 可以使用 start/end 指代之前的 left/right 或 top/bottom。
- chore: 优化npm引入方式，支持手动按需引入。

#### Bug Fixes

- 饼图图例和图形间距异常的问题。
- 桑基图重新渲染可能导致递归栈溢出的问题。
- 图例过长折行时右对齐不生效的问题。
- 雷达图 图例逻辑配置错误的问题。

### 2.5.15 (2020-01-16)

#### New Features

- 新增 图例 defaultClickBehavior 属性，可以在设置了图例 onClick 时保留默认点击行为。
- 统一抽象 size 属性，允许更多自定义配置。
- Wmap.Shoot 地图飞线允许设置自定义 className 和 style。

#### Bug Fixes

- 散点图 size 属性回调参数不符合预期的问题。

### 2.5.14 (2020-01-13)

#### New Features

- Wmap 飞线Shoot组件 可以自定义 className 和 style。

#### Bug Fixes

- Wmap 设置多层飞线组件后渲染可能会互相影响的问题。

### 2.5.13 (2020-01-09)

#### New Features

- Wmap 新增 飞线Shoot 组件，世界地图插件同步增加飞线组件。

#### Bug Fixes

- Wline 设置面积图为渐变色时 图例 & tooltip 颜色不正确的问题。
- 快速触发resize可能导致图表无法响应大小变化的问题。

### 2.5.12 (2019-12-26)

#### Bug Fixes

- 世界地图自定义图层可能无法动态更新数据的问题。
- 世界地图中国边界不正确的问题。

### 2.5.11 (2019-12-12)

#### Bug Fixes

- Wlinebar 线柱图图例样式可能被污染的问题。

### 2.5.10 (2019-12-05)

#### New Features

- Wlinebar 线柱图 新增 柱图分组堆叠的功能。

### 2.5.9 (2019-11-20)

#### New Features

- Wline 折线图 新增 阶梯折线功能。
- Wsankey 桑基图支持动态更新数据。
- chore: 移动scss依赖项到 devDependencies 中。

### 2.5.8 (2019-10-14)

#### New Features

- Wcontainer 内部 Row 组件type属性改为 no-padding。
- Guide 辅助线能通过 visible 属性关闭。

### 2.5.7 (2019-09-06)

#### Bug Fixes

- 修复 Wcircle 组件颜色无法自定义的问题。
- 修复实例的customChart属性会污染所有同类型图表的问题。

### 2.5.6 (2019-08-28)

#### New Features

- Wbar 新增极坐标系展示功能。

### 2.5.5 (2019-08-01)

#### New Features

- 新增自动计算轴标签个数的功能。
- Util.merge 方法实现改为 lodash.merge 方法。
- 升级依赖的aisc版本和icon内容。

### 2.5.4 (2019-07-25)

#### Bug Fixes

- 修复地图组件数据无法更新的问题。
- 修复地图组件自定义点位置在resize后不正确的问题。

### 2.5.3 (2019-07-18)

#### Bug Fixes

- 修复地图组件在某些尺寸下图例无法点击的问题。

### 2.5.2 (2019-07-11)

#### New Features

- 地图组件配置项增加 label 属性，效果与labels相同。labels属性之后会废弃。

#### Bug Fixes

- 修复世界地图插件npm引用会报错的问题。

### 2.5.1 (2019-06-20)

#### New Features

- chore: 升级打包框架至 Webpack4，并添加 StoryBook 作为开发调试框架。
- 添加拖拽缩放的事件回调，包括 zoom:start, zoom:end, zoom:reset。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/145>

#### Bug Fixes

- 修复npm引用时会报错的问题。

### 2.5.0 (2019-06-13)

#### New Features

- 新增插件机制，用于添加某些无法直接整合在图表库中的功能。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/304>
- 新增世界地图插件，增强了展示能力。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/305>
- 调整 Wcontainer 卡片内边距逻辑，微调图表的内边距。对外部调整更友好。

### 2.4.6 (2019-06-06)

#### New Features

- 新增 X&Y轴标题功能，通过 xAxis.alias / yAxis.alias 即可设定标题。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141>
- 圆环组件增加 linecap 属性，允许将两端圆角设为直角。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/33>

#### Bug Fixes

- 修复图表外层存在css scale时tooltip位置不正确的问题。
- 修复某些情况下数据无法更新的问题。

### 2.4.5 (2019-05-30)

#### New Features

- chore: 升级React生命周期相关函数已适应高版本React。

#### Bug Fixes

- 修复轴属性设置为null时会变为0的问题。

### 2.4.4 (2019-05-23)

#### New Features

- 轴属性设置允许覆盖为null。
- tooltip & legend 允许使用 visible 属性关闭显示。
- 去除多余的传递到container元素上的属性。

### 2.4.3 (2019-05-16)

#### New Features

- 所有主题相关变量下沉到 @alife/aisc-core 包中，统一维护。
- 新增阿里云暗色主题包。

#### Bug Fixes

- 修复文字颜色设置不生效的问题。

### 2.4.2 (2019-05-09)

#### New Features

- 优化Wcircle展示样式，内容支持居中。
- Wplaceholder支持width属性设置。

#### Bug Fixes

- 修复了guide无法设置top层级的问题。

### 2.4.1 (2019-04-25)

#### Bug Fixes

- 修复tooltip可能被自身图表遮挡的问题。
- 修复自适应图表大小时图表可能变空白的问题。

### 2.4.0 (2019-04-18)

#### New Features

- 升级底层 G2 依赖至最新版本 3.5.3。
- 新增 filter 型辅助标记，可以用于图表部分元素染色。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144>
- 新增 饼图蜘蛛型label 功能。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/25/example/537>
- 色块图组件 分割线颜色适配主题变化。

#### Bug Fixes

- 修复卡片中图表无法动态缩小的问题。
- 修复可能会出现G2图表初始化报错的问题。

### 2.3.17 (2019-03-28)

#### New Features

- 新增 色块图组件，地址：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/301

#### Bug Fixes

- 修复 饼图padding 设置 auto 时会报错的问题。
- 修复 饼图 drawPadding 不能设置为 0 的问题。

### 2.3.16 (2019-03-21)

#### New Features

- 新增 箱型图(盒须图) 组件，地址：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/298。
- 散点图 新增 气泡图 功能，地址：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/147/example/529。
- 辅助标记(Guide) 增强配置兼容性，添加更多错误配置提示。
- 多重饼图支持颜色配置。

#### Bug Fixes

- 修复 多重饼图 动态更新数据报错的问题。
- 修复 拖拽缩放 在数据更新后失效的问题。
- 修复 数字翻牌器 传入非数字报错的问题。

### 2.3.15 (2019-03-14)

#### New Features

- 地图新增 热力图 插件。
- 新增 阿里云 主题包，调整原有主题包（默认&暗色）颜色配置。
- 多层饼图 组件开放使用。

#### Bug Fixes

- 基类减少多余props传入。

### 2.3.14 (2019-03-07)

#### New Features

- 雷达图支持对X轴进行配置。

### 2.3.13 (2019-03-01)

#### New Features

- chore: 重新加入 eslint，校验代码格式错误。

#### Bug Fixes

- 修复字体地址引用可能不正确的问题。

### 2.3.12 (2019-02-28)

#### New Features

- 专有云改造，字体文件引用地址本地化。
- 优化打包体积，gzip体积减少近90kb(约18%)。
- X轴添加标签旋转角度快捷配置。
- 拖拽缩放重置按钮支持国际化配置。

#### Bug Fixes

- 修复打点无法完全关闭的问题。
- 修复 Wplaceholder svg 属性 warning。

### 2.3.11 (2019-02-21)

#### Bug Fixes

- 修复通过props动态变化图表大小时可能会出现渲染错误的问题。

### 2.3.10 (2019-01-31)

#### New Features

- 升级新版g2-connect插件，支持按照数据维度联动，详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/267。
- 增强线图&柱图 size 设置能力，支持自定义映射字段。
- tooltip 添加新控制项，允许 tooltip 移出图表外，用于图表较小的场景，详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143。
- 新增 getChartInstance 方法，用于直接获得图表实例，方便进行联动等操作。

### 2.3.9 (2019-01-25)

#### New Features

- 折线图标记点添加额外样式控制功能。
- 饼图添加坐标轴自定义处理的功能。

#### Bug Fixes

- 修复饼图selectData为空时无法清空选中的问题。

### 2.3.8 (2019-01-17)

#### New Features

- 添加多层饼图组件，内部测试中。
- 饼图添加选中效果，并且可以通过配置项控制选中。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/25/example/523

### 2.3.7 (2018-12-28)

#### Bug Fixes

- 修复地图组件在配置项动态更新时可能会报错的问题。

### 2.3.6 (2018-12-20)

#### New Features

- 增加version变量，可以直接获取当前版本号。
- 增加了scale设置和图例字号设置的逻辑健壮性。

#### Bug Fixes

- 修复多个图表实例间图例自定义样式会相互污染的问题。
- 修复图例设置为true时图例位置不正确的问题。

### 2.3.5 (2018-12-13)

#### New Features

- 线柱图拆分线柱的label配置项，可以分开配置。
- 新增 占位图组件的“无数据状态”。
- 新增 折线图允许调整线条粗细 的功能。

### 2.3.4 (2018-12-07)

#### Bug Fixes

- 修复雷达图Y轴标签颜色不正常的问题。
- 暂时关闭自动切换移动端图表的功能。

### 2.3.3 (2018-12-06)

#### New Features

- 卡片container 蓝色标记线大小跟随文字大小变化。
- 卡片container 随新版aisc规范，添加圆角。
- 新增图例项可以默认置灰的功能。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142

### 2.3.2 (2018-11-26)

#### Bug Fixes

- chore: 修复npm引入可能会报错的问题。

### 2.3.1 (2018-11-22)

#### New Features

- chore: 锁定aisc版本，防止打包构建报错。

#### Bug Fixes

- 修复线柱图可能会报错的问题。

### 2.3.0 (2018-11-22)

#### New Features

- 增强图例位置控制功能，支持 上左、上中、上右、下左、下中、下右 六个方位。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- 新增 图形label 功能。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286
- 新增仪表盘组件。
- 构建工程优化，打包体积减少，gzip大小（400kb）比原来精简 17%。

#### Bug Fixes

- 修复颜色设置不为数组时报错的问题。
- 修复图表大小变化时无法更新折叠图例的问题。
- 修复g2生成的div比设定高度高一些的问题。

### 2.2.3 (2018-10-12)

#### New Features

- 优化 container 样式。
- 翻牌器渲染次数减半，提高性能。
- 发布移动端测试版。

#### Bug Fixes

- 修复翻牌器组件销毁时没有清空定时器和内部组件的问题。

### 2.2.2 (2018-09-29)

#### New Features

- tooltip 支持关闭冒号显示。
- container 新增 width 属性控制，方便使用。
- container 添加内部样式控制项。

### 2.2.1 (2018-09-20)

#### New Features

- 折线图新增单独配置面积图颜色的功能。
- 地图 - 南海诸岛图颜色跟随主地图颜色，且大小会根据图表大小缩放。
- 开放 图例 click/hover 功能配置项（http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142）。

#### Bug Fixes

- 修复配置项更改太快时dom节点重复绘制的问题。

### 2.2.0 (2018-09-06)

第二个中位版本，建议所有用户升级。

#### New Features

- 开放 动态修改配置项 功能，升级即可使用。
- 使用全新卡片样式和全新数字字体，符合新视觉规范和移动端适配规范。
- 微调多处细节样式。

#### Bug Fixes

- 修复 config.legend.style 被空属性覆盖的问题。

### 2.1.25 (2018-08-30)

#### New Features

- 新增 动态修改配置项 功能，开发部分业务测试。
- 圆环组件开放圆环背景颜色配置。
- chore: 升级依赖 data-set 至0.9.4。并优化包引用，打包后体积减少 140kb(gzip)。

#### Bug Fixes

- 修复组件库会覆盖 window._ 变量的问题。

### 2.1.24 (2018-08-23)

建议所有 2.1.21、2.1.22、2.1.23 用户都升级该版本。

#### New Features

- 正式发布 图例过多时自动折叠的功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- 辅助标记 - line的文案添加自定义样式的功能。
- 初步添加移动端适配方案，容器卡片自动适配移动端内边距。

#### Bug Fixes

- 修复图例过多自动折叠功能的一些样式问题。

### 2.1.23 (2018-08-16)

#### New Features

- 完善 图例过多自动折叠 的功能，可以根据图表高度自动计算折叠行数。

### 2.1.22 (2018-08-10)

#### New Features

- 新增图例过多时自动折叠的功能。
- chore: 新增afterRender生命周期。

#### Bug Fixes

- 修复与aisc样式冲突问题，彻底分离icon相关样式。

### 2.1.21 (2018-08-03)

#### New Features

- 调整数字组件样式。
- chore: 更新Aisc依赖版本。

#### Bug Fixes

- 修复内部图标可能会和Aisc图标冲突的问题。

### 2.1.20 (2018-08-02)

#### New Features

- 加强地图组件计算地理坐标时的兼容性。
- 自定义地图render函数新增传入props。

#### Bug Fixes

- 修复自定义图例样式可能被覆盖的问题。
- 部分工具函数可能报错的问题。

### 2.1.19 (2018-07-26)

#### New Features

- 柱图开放柱宽度配置。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/28
- 图例开放自定义样式功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- chore: 锁定底层库版本。

#### Bug Fixes

- 修复底层库变更导致的问题。

### 2.1.18 (2018-07-19)

#### New Features

- 圆环组件添加自定义颜色的功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/33
- 常用图例开放全部关闭图例的功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- 常用 tooltip 开放关闭标题的功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143
- 优化地图组件投影函数的逻辑，可以通过配置项自定义投影函数。

### 2.1.17 (2018-07-12)

#### New Features

- 柱状图添加 分组堆栈图 功能，详情：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/28/example/508
- 优化 区域地图 颜色计算逻辑。
- 全新暗色主题上线，适配新视觉规范。

### 2.1.16 (2018-07-09)

#### New Features

- 完善 暗色主题 颜色配置。

### 2.1.15 (2018-07-05)

#### New Features

- 分面柱图 yAxis.labelFormatter 第二个参数添加分面信息，可以完成更细致的格式化。
- 完善 暗色主题 颜色配置。

#### Bug Fixes

- 分面柱图 tooltip.nameFormatter 和 tooltip.valueFormatter 第二个参数可能不正确的问题。

### 2.1.14 (2018-06-28)

#### New Features

- 常用图例增加显示最后一项数据的功能（http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142）。
- 增强线图几何图形自定义能力。

#### Bug Fixes

- 线柱图更新数据时  sync 失效，某些情况下无法绘制图形的问题。

### 2.1.13 (2018-06-21)

#### New Features

- 新增漏斗图组件(http://aisc.alibaba-inc.com/site/pc#/cate/4/page/279)。
- 线柱图重新支持 辅助标记(guide) 功能。
- chore: 升级 G2 依赖至 3.1.2 。

#### Bug Fixes

- 线柱图数据更新时残留旧数据的问题。
- 线柱图图例样式问题。

### 2.1.12 (2018-06-14)

#### New Features

- 新增矩形分箱图组件(http://aisc.alibaba-inc.com/site/pc#/cate/4/page/278)。
- 柱状图添加 镜面柱图 功能(http://aisc.alibaba-inc.com/site/pc#/cate/4/page/28/example/503)。

#### Bug Fixes

- 工具函数 - 千分位格式化函数 会丢失小数的问题。
- 线柱图某些情况下可能报错的问题。

### 2.1.11 (2018-06-07)

#### New Features

- 添加 tooltip 项目排序功能(http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143)。
- 新增数字翻牌器组件(http://aisc.alibaba-inc.com/site/pc#/cate/4/page/277)。
- 优化适配高度逻辑，兼容带有内边距的情况。
- 增强地图样式可配置性。

#### Bug Fixes

- 地图图层更新没有响应配置项更新的问题。

### 2.1.10 (2018-05-31)

#### New Features

- chore: 底层Aisc依赖升级至2.6.0。

#### Bug Fixes

- Aisc Icon 样式污染问题。

### 2.1.9 (2018-05-24)

#### New Features

- 新增Aone主题包。
- 添加常用的直角坐标系图表(如折线、柱状、散点)坐标轴隐藏功能。

#### Bug Fixes

- 柱状图拖拽缩放按钮没有销毁的问题。

### 2.1.8 (2018-05-21)

#### New Features

- 添加 用户打点 和 手动关闭打点 的功能。

#### Bug Fixes

- 打包后无法识别地图图层的问题。
- 南丁格尔图、雷达图 图例位置偏上的问题。
- 大部分图表 tooltip、legend 格式化函数第二个参数不正确的问题。
- npm引入方式报错

### 2.1.7 (2018-05-17)

#### New Features

- 添加了地图组件，其中包含 分级统计、散点、自定义点 功能。
- 折线图组件在只有一个数据时会显示出一个点。
- 增强工具函数校验强度。

#### Bug Fixes

无

### 2.1.6 (2018-05-11)

#### New Features

- 增强配置项校验的健壮性。
- chore: 底层G2依赖升级至3.0.10。

#### Bug Fixes

无

### 2.1.5 (2018-04-12)

#### New Features

- 柱状图新增拖拽缩放功能。
- 优化细节样式。

#### Bug Fixes

- 部分工具函数对负数处理不严谨的问题。

### 2.1.4 (2018-03-23)

#### New Features

- chore: 底层G2依赖升级至3.0.5-beta.6。
- 新增X轴label自动旋转功能。
- 新增南丁格尔图图例相关逻辑。
- 占位图组件添加 加载中(loading) 和 异常(error) 状态。

#### Bug Fixes

- 饼图外半径值没有受到限制[0 - 1]。

### 2.1.3 (2018-03-15)

#### New Features

- chore: 锁定G2版本，避免意外更新导致的问题。

#### Bug Fixes

- 折线图开启拖拽缩放后可能的报错问题。

### 2.1.2 (2018-03-13)

#### New Features

- chore: 底层Aisc依赖升级到 2.5.27。
- 新增折线图拖拽放大的功能。
- 调整暗色主题样式细节。

#### Bug Fixes

- \#14405293 图表组件的子组件无法随数据更新的问题。
- 饼图子组件高度可能不正确的问题。

### 2.1.1 (2018-03-01)

#### New Features

- 新增图表联动功能，已提取为公共tnpm包，可推广给其它G2使用者使用。
  - 思路：<https://github.com/antvis/g2/issues/485>
  - 包地址：<http://web.npm.alibaba-inc.com/package/@alife/g2-connect>
  - 示例：<http://riddle.alibaba-inc.com/riddles/a49ae3a6>

#### Bug Fixes

- 逻辑细节优化，减少错误输入导致报错的可能。

### 2.1.0 (2018-02-08)

#### New Features

- 新增“雷达图”组件。
- 南丁格尔图添加显示轴和标签的功能。
- 散点图添加扰动点图的功能。
- 图表组件可以动态更新className和style。

#### Bug Fixes

- 获取状态颜色名称的函数在转入空值时返回错误的问题。
- 线柱图图例设置右侧位置显示错误的问题。
- 饼图图例最大高度受外半径影响的问题。

### 2.0.6 (2018-01-26)

#### New Features

- 统一了组件中状态相关的api名词，统一使用normal, warning, error等词汇。

#### Bug Fixes

- 细节样式问题。
- circle组件在gauge仪表盘模式时百分比小于15%时样式错误。

### 2.0.5 (2018-01-19)

#### Bug Fixes

- 单个圆环组件配合container样式错误。

### 2.0.4 (2018-01-18)

#### New Features

- 容器标题的底部标线允许控制关闭。
- 饼图图例/tooltip回调参数中添加percent数据。
- 饼图圆环时支持添加内部文案。
- placeholder组件允许添加文案。
- 更新新版的灰色颜色值。

#### Bug Fixes

- 迷你折线图配合小容器使用的问题。
- 容器底部padding问题。
- 动态数据处理的问题。

### 2.0.3 (2018-01-11)

#### New Features

- 容器允许添加自定义操作区的内容。
- 迷你折线图底层切换至G2。
- 飞线组件允许修改飞线头部的阴影。
- 添加新状态色：成功(success)色。
- 状态颜色添加成功(success)色。

#### Bug Fixes

- 默认图表内边距问题。
- 图表高度没有自适应的问题。
- 容器无标题时顶部边距问题。
- 圆环组件背景条边缘没有圆角。

### 2.0.2 (2018-01-05)

#### New Features

- 优化南丁格尔玫瑰图的配置项和样式。
- 优化度量计算的逼近数组。
- icon组件支持修改颜色，添加颜色翻转功能。

#### Bug Fixes

- 桑基图初始化报错问题。

### 2.0.1 (2018-01-02)

#### New Features

- 添加占位图placeholder组件。
- 开放更多度量可配置项。
- 优化对旧版本datetime的兼容。
- 优化Y轴辅助线的默认偏移量。

#### Bug Fixes

- 折线图X轴范围默认改为最大。

### 2.0.0 (2017-12-29)

大版本更新，详细的配置项变更请看 [2.0 升级指南](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137)

#### 新特性

- 底层图表库全面跟进G2 3.0，对外输出无版权问题。
- 支持主题包切换功能。
- 更加丰富的图表，新增 散点图、桑基图、南丁格尔玫瑰图 组件。
