### 1.1.20 (2024-09-20)

#### New Features

- Wlistcontainer增加空数据状态
- 自定义tooltip加最大高度与滚动条、位置调整
- TableLegend和FoldableLegend增加正反选及nameFormatter兼容
- 增加秒级单位转换
- 仪表盘新增fontColorFit，使字体颜色与圆环一致

#### Bug Fixes

- 仪表盘超过100或小于0时的展示
- 覆盖文本省略内置交互，增加legend Value省略
- 修改自定义tooltip的样式
- 自定义tooltip兼容各种formatter
- 修改tooltip显示位置的计算以及指标卡label过长时的样式

### 1.1.19 (2024-09-10)

#### Bug Fixes

- 修复轴关闭情况下额外配置影响的问题
- 修复tooltip联动的时候错位的情况
- 增加列表型图例配置项以保证图例高度一致

### 1.1.18 (2024-09-05)

#### New Features
- 增加WlistContainer
- 更新单位转换的tooltip与legend的联动

#### Bug Fixes

- 修复表格型图例点击时数据缺失的问题
- 仪表盘不传config报错

### 1.1.17 (2024-09-01)

#### New Features
- 增加冷灰色阶
- 关闭console提示
- 支持原生图例与自定义图表交互行为的配置项兼容

#### Bug Fixes

- 修复线图自定义渐变导致的问题
- 隐藏空数据、loading、错误状态下的自定义legend
- 解决表格型图例不能配小数位数的问题

### 1.1.16 (2024-08-23)

#### New Features
- 更新柱图百分比堆叠时内置Y轴显示百分比数值
- 支持统一联动的图例交互

#### Bug Fixes

- 修改table legend高度计算问题
- 隐藏空数据、loading、错误状态下的自定义legend

### 1.1.15 (2024-08-12)

#### New Features
- 线柱图支持拖拽缩放
- 表格型legend支持自定义列
- getLegendItems透出额外信息
- 更新剪裁默认值，关闭超出剪裁

#### Bug Fixes

- 修复仪表盘刻度显示不全
- 修复双轴时表格型legend统计值计算不到的问题
- 修复legend在未定义尺寸时报错的问题

### 1.1.14 (2024-07-19)

#### New Features
- 更新面积图填充色彩规范
- 更新雷达图轴线配置示例

#### Bug Fixes

- 修复数据指标卡最小高度问题
- 修复轴文本计算逻辑

### 1.1.13 (2024-07-15)

#### New Features

- 增加水位动画一致性(页面级)
- 调整X轴重叠检测的优先级为自动省略>自动隐藏>自动旋转
- 增加指标卡（大盘形态）
- 缩略轴增加标记点功能，显示对应标记点
- 内置自定义tooltip
- 内置阶梯状legend

#### Bug Fixes

- 修复tickCount为null时页面报错问题
- 修复空数据到空数据转换时显示数据异常的问题
- 修复自定义图例宽高变化时报错的问题
- 修复loading和无数据时还显示了缩放

### 1.1.12 (2024-06-20)

#### New Features

- 色彩算法支持向前向后取色
- 增加仪表盘组件
- 增加柱图在分类轴的文本自适应
- 内置图表类型配置项预处理方法，堆叠图默认开启面积

#### Bug Fixes

- 修复无数据时辅助线还显示的问题
- 修复无数据时非标准展示问题

### 1.1.11 (2024-05-21)

#### Bug Fixes

- 修复旭日图模块导入问题

### 1.1.10 (2024-05-16)

#### New Features

- 更新轴标签位移的判断条件
- 柱状图增加 intervalPadding 配置（自动判断分组柱间距）
- 增加渲染时间的性能统计
- 增加工具函数：自动计算顺序色、遍历树、统一单位
- 更新多重圆环的数据排序能力 && 自定义 dataset 相邻层次算法
- 图表由有数据变为无数据时，改为展示空数据状态

#### Bug Fixes

- 修复 re-export 导致业务报错
- 修复 X 轴纵向时，轴标签位移错误问题
- 修复传入 G2 的数据结构报错的问题
- 修复英文时间国际化不统一的问题
- 【重构】图例增加适配多种数据结构类型
- 【重构】统一所有交互目录

### 1.1.9 (2024-03-22)

#### New Features

- 增加轴刻度计算增加对应的首尾展示
- 更新X轴自动采样最小间隔 & 增加轴标签只有2/3数量时的样式调整

#### Bug Fixes

- 优化类型定义 & 修复部分类型错误

### 1.1.8 (2024-03-13)

#### Bug Fixes

- X轴类型为timeCat时水平区域标记范围溢出的问题
- guide line 文本位置不正确的问题
- 分面柱图使用标注时报错的问题

### 1.1.7 (2024-03-08)

#### Bug Fixes

- 饼图空数据占位图形在尺寸变化时没有适配
- X轴类型为timeCat时水平区域标记范围溢出的问题
- 修复部分类型错误

### 1.1.6 (2024-03-06)

#### New Features

- 更新用户自定义X轴mask的国际化转换

#### Bug Fixes

- 更新饼图的中心圆环DOM顺序
- 修改X轴标签自动采样开启的判断逻辑
- 优化代码逻辑、补充类型定义

### 1.1.5 (2024-03-01)

#### New Features

- 增加force适配
- 更新log埋点信息
- 更新渲染时间统计
- 更新蜂窝图显示
- 更新主题色 & 增加主色变量区分原先蓝色关键字命名
- 更新Y轴千分位的使用
- 增加全局ResizeObserver方法，用于监听图表父元素的尺寸变化从而更新图表尺寸
- 更新时间国际化
- 更新饼图的大数据处理

#### Bug Fixes

- 自定义主题包切换不生效的问题
- 更新水位的统计名称
- plugins map 类型定义错误
- 修复时间分类tick count计算问题
- 修复折叠图例导致图表报错的问题
- 线图数据只有一个点和其他数据不一致时，无法渲染的问题
- 修复切换语言的时候饼图的无数据样式消失的问题（未清除无数据shape）

### 1.1.4 (2024-02-06)

#### New Features

- 优化线图少数据时开启label遮挡的问题
- 自定义tooltip增加 marker 和 数据吸附逻辑
- 调整自定义 tooltip 定位逻辑，改为 fixed 定位

### 1.1.3 (2024-01-31)

#### Bug Fixes

- postmessage 问题修复
- 减少自定义legend中tooltip创建的空div
- 自定义tooltip改为fixed定位:
- 修改自定义tooltip的辅助线显示条件
- 修复时间刻度算法空数据报错的问题

### 1.1.2 (2024-01-26)

#### New Features

- 更新 tooltip 规则 & 时间轴的自动计算
- 去除 node-sass 依赖，改为 dart-sass
- 自定义 tooltip 增加辅助线
- 更新轴相关的主题
- 增加图表用户自定义配置项使用的统计
- 列表型 legend 增加 valueFormatter 适配
- 增加图表性能（渲染时间）打点

#### Bug Fixes

- 修复时间分类的轴刻度计算方法
- 更新线柱图的时间刻度算法，修复时间类型/时间部分 tick 不显示的问题
- 修复折叠型 legend 收起时未恢复初始状态的问题
- 修复图形元素高亮有黑边的问题 && 增加特殊形状的高亮处理
- 修复缩放从右往左滑动无法触发重置按钮的问题
- 关闭局部渲染，解决自定义字体导致错位的问题

### 1.1.1 (2024-01-18)

#### New Features

- 增加配置：堆叠柱图开启堆叠总数显示
- 增加规则：圆环图中心内容的检测与推荐提示
- 增加规则：曲线配置规则，不推荐开启

#### Bug Fixes

- 修改 tooltip 动画
- 更新桑基图图例样式
- 屏蔽自定义 tooltip 报错
- 调整线图极端数据下的计算逻辑
- 修复 config 改变时图表高度未重新设置的问题

### 1.1.0 (2024-01-12)

#### New Features

- 新增规范（色彩、字体、间距、大小、布局位置、数据状态统一）具体设计 20+细节（详情：https://mgdone.alibaba-inc.com/file/111647510831029?fileOpenFrom=home）；
- 开放图例、tooltip 的自定义能力
- 增加列表型图例能力
- 增加图例折叠能力
- 增加分组场景下的图例、tooltip 的显示
- 增加 tooltip 自动锁定能力
- 增加内置规则：饼图内容自动计算总数/多线图面积图开启规则
- 更新辅助线渐变逻辑

#### Bug Fixes

- 修复 colors 传函数无法获取 legend 颜色的问题
- 修复图表不传高度时不显示的问题
- 修复折叠型 legend 在数据变化时不显示的问题
- 修复图表尺寸变化时折叠型 legend 没变的问题
- 修复列表型 legend 开启判断逻辑
- 修改折叠型 legend 高度计算的问题

### 1.0.51 (2023-12-05)

#### Bug Fixes

- 增加 log 统计的时间

### 1.0.50 (2023-11-30)

#### Bug Fixes

- 修改数据指标卡样式,改为调整单位的下间距

#### New Features

- 增加上下文主题、语言、配置项、规则切换的能力

### 1.0.49 (2023-11-15)

#### Bug Fixes

- 修复 findLast 引发的报错

#### New Features

- 埋点统计增加图表初始化次数以及类别

### 1.0.48 (2023-10-20)

#### Bug Fixes

- 修复数据指标卡 value 被截断的问题
- 修复 zoom 事件与 click 事件冲突的问题
- 增加自定义 locale 对 chartProvider 中设置的语言的适配

### 1.0.47 (2023-10-13)

#### Bug Fixes

- 多重圆环 legend valueFormatter 返回的问题
- 多重圆环图例 value 计算错误问题

### 1.0.46 (2023-10-12)

#### Bug Fixes

- 修复 loading 时更新数据图表出错的问题
- 修复 legend 正选时不能取消单选的问题
- 修复数据指标卡 name 与 value 不对齐的问题
- 多重圆环不支持自定义 legend 和 tooltip 的问题
- chartRef 加初始值兜底

### 1.0.45 (2023-09-15)

#### New Features

- 增加 chartRef，提供获取 chart 实例、获取 legend 信息、过滤 legend、高亮与取消高亮 legend 的方法
- 自定义国际化 locale 支持传多语言映射
- Wmap 自定义国际化增加 name 字段支持
- 增加多图表 filter 联动
- 增加 legend 正向选择与反向选择的配置项

#### Bug Fixes

- 修复数据指标卡片中 label tooltip 出现时机和位置错误的问题
- 调整 Wmap 中的标签颜色

### 1.0.44 (2023-08-24)

#### New Features

- 更新柱图在横向显示的情况下默认为垂直显示
- 调整数据指标卡的单位颜色
- 增加繁体中文国际化
- 更新主题包

#### Bug Fixes

- 修复地图中南海诸岛的颜色与字体问题
- 修复图表 loading 状态不受宽高影响的问题
- 修复线柱图自动加 padding 逻辑报错的问题

### 1.0.43 (2023-07-21)

#### New Features

- 新增箱形线图
- 桑基图重构
- 增加线图规则：只有一条线且数据大小相等的时候让线居中
- 增加测试用例 & UI 截图测试能力

#### Bug Fixes

- 调整柱图与线柱图的自动加 padding 逻辑
- 全局配置能力和规则冲突问题
- 数据指标卡主题更新问题
- 数据指标卡片没有 onClick 时取消手型光标
- 修复线柱图部分情况下 label 显示不全的问题

### 1.0.42 (2023-07-07)

#### New Features

- 数据指标卡新设计规范：tag 与 minichart 部分

#### Bug Fixes

- 修复数据卡片概览列数计算的问题
- 修复柱图 label 在柱子高度接近 y 轴最大值时显示不全的问题
- 修复 ChartProvider 中的语言不生效的问题
- 更新水位自动超过阈值告警

### 1.0.41 (2023-07-03)

#### New Features

- 数据指标卡新设计规范
- 增加 getLanguage 函数
- 饼图、线图与柱图 支持精细化动画控制
- 线图、线点图与散点图增加 x 轴 range 适配
- 增加全局配置能力（包含主题、配置项）
- 环图增加环宽检测

#### Bug Fixes

- 修复部分类型问题
- 修复柱图 label 在某些情况下无法完全展示的问题
- 临时关闭辅助线虚线配置

### 1.0.40 (2023-06-01)

#### New Features

- 优化线图极端数据场景下的展示
- 增加图表 loading 状态
- 增加数据指标卡对 string 类型数值的字体支持
- 调整数据指标卡布局

#### Bug Fixes

- 优化 treemap 数据处理
- 修复 Wplaceholder 国际化问题
- 开启图例项的最大宽度默认值，保证图例项的正常展示
- 修复 sass 不再支持 除号 导致 warning 的问题
- 修复 errorWrap 固定高度问题

### 1.0.39 (2023-05-10)

#### New Features

- 增加颜色变量映射

#### Bug Fixes

- 修复数据指标卡数值为 0 时没 margin 的问题
- 修复 treemap 数据项与 label 配置项不透传的问题
- 修复 treemap 有白边的问题
- 更新语法格式和问题
- 修复饼图和多重圆环内容区域过高的问题

### 1.0.38 (2023-04-21)

#### New Features

- 增加国际化事件和全局变量 setAiscWidgetsLanguage ｜ AiscWidgetsDefaultLanguage

#### Bug Fixes

- 修复极端数据场景用户自定义图例被覆盖的问题
- 修复质量分数为 NAN 的问题
- 修复全局依赖的问题
- 修复地图国际化的问题

### 1.0.37 (2023-03-30)

#### New Features

- 增加地图组件国际化
- 增加国际化方法 setLanguage
- 增加图表规则汇总，计算图表质量分数
- 更新柱图极端数据场景默认不开启左对齐和占位的问题
- 增加环状图显示底纹装饰的效果

#### Bug Fixes

- 修复辅助线配置导致图表异常的问题

### 1.0.36 (2023-03-24)

#### New Features

- 增加国际化 ChartProvider
- 增加主题的关键字使用，利用状态色的颜色变量进行映射
- 更新占位图无数据样式 & 新增提示

#### Bug Fixes

- 修复空数据状态切换主题颜色不生效的问题
- 修复柱图极端数据场景只有开启占位才隐藏 tooltip

### 1.0.35 (2023-03-17)

#### Bug Fixes

### 1.0.34 (2023-03-17)

#### New Features

- 更新组件加载样式

#### Bug Fixes

- 修复构建问题

### 1.0.33 (2023-03-08)

#### Bug Fixes

- Whierarchy 在 npm 引入时可能会报错的问题

### 1.0.32 (2023-03-07)

- 增加跨源通信
- 增加图例 hover 效果
- 增加图表渐变色
- 增加柱图默认左对齐 + 占位显示
- 增加水位、数字概览业务组件收敛到图表库中
- 增加 P1-P7 业务告警色

### 1.0.31 (2023-02-06)

#### New Features

- 增加多重圆环
- 柱状图增加极端数据处理
- 饼图增加数据收敛功能
- 增加规则错误码映射

#### Bug Fixes

- 修复柱状图 x 轴标签格式化问题
- 优化 checkColor 函数性能

### 1.0.30 (2023-01-17)

#### New Features

- 线图柱图缩略轴自适应
- 柱状图增加间距检测
- 散点图增加点大小检测
- 更新主题配置

#### Bug Fixes

- 修复额外图表背景色问题

### 1.0.29 (2022-12-29)

#### New Features

- 增加 20 色主题
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

- 3.0.25 版本跳过

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

- 更新漏斗图自定义 label & 修复 percent 位置居中问题
- 修复容器内部图表自适应问题
- 修复漏斗图 percent 位置居中问题
- 更新漏斗图自定义 label

### 1.0.15 (2022-01-06)

#### New Features

- 饼图支持空数据时展示灰色块
- Wbar 增加 dodge 配置项，控制分类模式。优化 geom 绘制逻辑

#### Bug Fixes

- 饼图总数为 0 显示 NAN 的问题
- 漏斗图 labelformater 失效的问题
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

- 柱图的 percentage 百分比配置项调整为选填项。

### 1.0.10 (2021-09-14)

#### New Features

- Wbar 增加分组百分比堆叠柱图。

### 1.0.9(2021-08-19)

#### New Features

- Wbar 增加百分比堆叠柱图。
- Wline 增加自定义 shape。
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

配置项变更请看 [3.0 升级指南](https://yuque.antfin.com/docs/share/bec5abe5-e333-481f-88b3-ebd4b968bbfc)

---

## 2.X

### 2.6.31 (2021-03-11)

#### Bug Fixes

- Wtreemap 矩阵树图数据更新可能报错的问题。

### 2.6.30 (2021-03-04)

#### New Features

- 组件增加“允许函数配置项更新”的选项。
- 优化 afterrender 渲染周期。

#### Bug Fixes

- 自动计算 padding 在图例设定固定折叠行数后可能不正确的问题。

### 0.1.9 (2020-12-11)

#### Refactor

- style(g2Theme.js): add userSelect attribute to prevent users from selecting text of the legend

#### Bug Fixes

- 一些 scss 样式计算错误，导致被 less 引用时报错

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

- npm 引用 scss 改为 css。

### 0.1.5 (2020-09-28)

#### New Features

- Wheatmap 色块图添加 label 功能。

### 0.1.4 (2020-09-24)

#### Bug Fixes

- npm 引用时 tree-shaking 无法正确保留 css 的问题。

### 0.1.3 (2020-09-10)

#### Bug Fixes

- npm 引用时 tree-shaking 无法正确保留 css 的问题。

### 0.1.2 (2020-09-03)

#### New Features

- chore: 添加 index.d.ts 文件。

#### Bug Fixes

- 打点函数能正确统计动态切换的主题。

### 0.1.1 (2020-08-28)

#### New Features

- chore: 添加 sideEffects 设置。

#### Bug Fixes

- 某些组件关闭图例后依然有 canvas 图例。

- 某些组件关闭图例后依然有 canvas 图例。

### 0.1.0 (2020-08-05)

面向中后台的开箱即用图表库，让前端图表更简单。

### 2.6.15 (2020-07-16)

#### New Features

- chore: 升级 G2 版本至 3.5.17。
- Wshoot 优化飞线弧度逻辑。

### 2.6.14 (2020-07-02)

#### New Features

- track 打点函数允许通过全局变量关闭。
- Wmap 地图组件暴露内部 Geo 数据 和 省市经纬度数据。
- Wshoot 飞线组件允许动态更新 getPosition 函数。

#### Bug Fixes

- 修复 Wshoot 飞线只展示第一次渲染的数据的问题。

### 2.6.13 (2020-06-15)

#### Bug Fixes

- 修复自动计算 padding 不生效的 bug。

### 2.6.12 (2020-06-11)

#### New Features

- 基础图表添加 geomStyle 配置项。

#### Bug Fixes

- 修复 Wmap 自动计算 padding 的 bug。

### 2.6.11 (2020-05-28)

#### Bug Fixes

- 修复 html 图例自动计算 padding 的 bug。

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

- 新增图例方向支持自动计算 padding 功能，目前所有直角坐标系图表默认全部使用 auto padding。
- 新增 npm 按需加载能力，大幅调整文件结构，现在可以使用 tree-shaking 来精简图表库尺寸了。详情：https://widgets.alibaba-inc.com/quickstart/tree-shaking
- Wcontainer 卡片新增捕获包裹组件的报错并提示的功能，防止图表库报错导致页面崩溃。
- 调整 Wcandlestick 烛形图的配置项和数据格式，更贴近其它组件的用法。
- 优化 Whistogram 直方图逻辑和配置项，支持更多分箱算法配置。
- chore: 优化主题包逻辑，为后续图表设计器打下基础。
- chore: 升级 G2 版本至 3.5.14。
- 在 npm 中添加 8 个组件的 gui.schema.json 文件，方便搭建系统使用。

### 2.6.4 (2020-03-26)

#### New Features

- 新增图例方向支持 auto padding 的功能。
- chore: 优化主题包，收敛主题变量。

#### Bug Fixes

- Guide 辅助标记状态色没有动态响应主题切换的问题。
- 饼图图例在位置足够时可能会换行的问题。
- Wscatter 散点图在自定义 size 时可能出现拖拽图例的问题。

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

- 辅助标记 Guide - line&area 设置新增 style 属性，允许自定义对应样式。
- 更新专有云 亮色/暗色 主题包。

#### Bug Fixes

- 动态切换主题时部分图表样式不正确的问题。

### 2.6.1 (2020-02-20)

#### Bug Fixes

- 多重饼图尺寸错误的问题。
- npm 引用在某些构建系统中报错的问题。

### 2.6.0 (2020-02-20)

#### New Features

- 新增「动态切换主题」功能，不刷线页面也能切换主题，更加简单易用，详见：https://widgets.alibaba-inc.com/quickstart/theme
- 新增「自动计算时间格式」功能，已在 线图、迷你线图、散点图 中默认开启，其余图表可以手动开启。
- 新增图表：Whistogram 直方图，详见：https://widgets.alibaba-inc.com/example/Whistogram
- 新增图表：Wcandlestick 烛型图，详见：https://widgets.alibaba-inc.com/example/Wcandlestick
- Wnightingale 玫瑰图 新增「玫瑰环图」功能。详见：https://widgets.alibaba-inc.com/example/Wnightingale/Wnightingale-circle
- Wbar 柱状图 新增「玉玦图」功能。详见：https://widgets.alibaba-inc.com/example/Recommendation/Wbar-radial
- Wmap 区域地图&散点地图 支持 props 传入 config 配置项。
- Wfunnel 漏斗图配置项优化，`config.align` 可以使用 start/end 指代之前的 left/right 或 top/bottom。
- chore: 优化 npm 引入方式，支持手动按需引入。

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

- Wmap 飞线 Shoot 组件 可以自定义 className 和 style。

#### Bug Fixes

- Wmap 设置多层飞线组件后渲染可能会互相影响的问题。

### 2.5.13 (2020-01-09)

#### New Features

- Wmap 新增 飞线 Shoot 组件，世界地图插件同步增加飞线组件。

#### Bug Fixes

- Wline 设置面积图为渐变色时 图例 & tooltip 颜色不正确的问题。
- 快速触发 resize 可能导致图表无法响应大小变化的问题。

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
- chore: 移动 scss 依赖项到 devDependencies 中。

### 2.5.8 (2019-10-14)

#### New Features

- Wcontainer 内部 Row 组件 type 属性改为 no-padding。
- Guide 辅助线能通过 visible 属性关闭。

### 2.5.7 (2019-09-06)

#### Bug Fixes

- 修复 Wcircle 组件颜色无法自定义的问题。
- 修复实例的 customChart 属性会污染所有同类型图表的问题。

### 2.5.6 (2019-08-28)

#### New Features

- Wbar 新增极坐标系展示功能。

### 2.5.5 (2019-08-01)

#### New Features

- 新增自动计算轴标签个数的功能。
- Util.merge 方法实现改为 lodash.merge 方法。
- 升级依赖的 aisc 版本和 icon 内容。

### 2.5.4 (2019-07-25)

#### Bug Fixes

- 修复地图组件数据无法更新的问题。
- 修复地图组件自定义点位置在 resize 后不正确的问题。

### 2.5.3 (2019-07-18)

#### Bug Fixes

- 修复地图组件在某些尺寸下图例无法点击的问题。

### 2.5.2 (2019-07-11)

#### New Features

- 地图组件配置项增加 label 属性，效果与 labels 相同。labels 属性之后会废弃。

#### Bug Fixes

- 修复世界地图插件 npm 引用会报错的问题。

### 2.5.1 (2019-06-20)

#### New Features

- chore: 升级打包框架至 Webpack4，并添加 StoryBook 作为开发调试框架。
- 添加拖拽缩放的事件回调，包括 zoom:start, zoom:end, zoom:reset。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/145>

#### Bug Fixes

- 修复 npm 引用时会报错的问题。

### 2.5.0 (2019-06-13)

#### New Features

- 新增插件机制，用于添加某些无法直接整合在图表库中的功能。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/304>
- 新增世界地图插件，增强了展示能力。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/305>
- 调整 Wcontainer 卡片内边距逻辑，微调图表的内边距。对外部调整更友好。

### 2.4.6 (2019-06-06)

#### New Features

- 新增 X&Y 轴标题功能，通过 xAxis.alias / yAxis.alias 即可设定标题。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141>
- 圆环组件增加 linecap 属性，允许将两端圆角设为直角。<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/33>

#### Bug Fixes

- 修复图表外层存在 css scale 时 tooltip 位置不正确的问题。
- 修复某些情况下数据无法更新的问题。

### 2.4.5 (2019-05-30)

#### New Features

- chore: 升级 React 生命周期相关函数已适应高版本 React。

#### Bug Fixes

- 修复轴属性设置为 null 时会变为 0 的问题。

### 2.4.4 (2019-05-23)

#### New Features

- 轴属性设置允许覆盖为 null。
- tooltip & legend 允许使用 visible 属性关闭显示。
- 去除多余的传递到 container 元素上的属性。

### 2.4.3 (2019-05-16)

#### New Features

- 所有主题相关变量下沉到 @alife/aisc-core 包中，统一维护。
- 新增阿里云暗色主题包。

#### Bug Fixes

- 修复文字颜色设置不生效的问题。

### 2.4.2 (2019-05-09)

#### New Features

- 优化 Wcircle 展示样式，内容支持居中。
- Wplaceholder 支持 width 属性设置。

#### Bug Fixes

- 修复了 guide 无法设置 top 层级的问题。

### 2.4.1 (2019-04-25)

#### Bug Fixes

- 修复 tooltip 可能被自身图表遮挡的问题。
- 修复自适应图表大小时图表可能变空白的问题。

### 2.4.0 (2019-04-18)

#### New Features

- 升级底层 G2 依赖至最新版本 3.5.3。
- 新增 filter 型辅助标记，可以用于图表部分元素染色。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144>
- 新增 饼图蜘蛛型 label 功能。详情：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/25/example/537>
- 色块图组件 分割线颜色适配主题变化。

#### Bug Fixes

- 修复卡片中图表无法动态缩小的问题。
- 修复可能会出现 G2 图表初始化报错的问题。

### 2.3.17 (2019-03-28)

#### New Features

- 新增 色块图组件，地址：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/301

#### Bug Fixes

- 修复 饼图 padding 设置 auto 时会报错的问题。
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

- 基类减少多余 props 传入。

### 2.3.14 (2019-03-07)

#### New Features

- 雷达图支持对 X 轴进行配置。

### 2.3.13 (2019-03-01)

#### New Features

- chore: 重新加入 eslint，校验代码格式错误。

#### Bug Fixes

- 修复字体地址引用可能不正确的问题。

### 2.3.12 (2019-02-28)

#### New Features

- 专有云改造，字体文件引用地址本地化。
- 优化打包体积，gzip 体积减少近 90kb(约 18%)。
- X 轴添加标签旋转角度快捷配置。
- 拖拽缩放重置按钮支持国际化配置。

#### Bug Fixes

- 修复打点无法完全关闭的问题。
- 修复 Wplaceholder svg 属性 warning。

### 2.3.11 (2019-02-21)

#### Bug Fixes

- 修复通过 props 动态变化图表大小时可能会出现渲染错误的问题。

### 2.3.10 (2019-01-31)

#### New Features

- 升级新版 g2-connect 插件，支持按照数据维度联动，详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/267。
- 增强线图&柱图 size 设置能力，支持自定义映射字段。
- tooltip 添加新控制项，允许 tooltip 移出图表外，用于图表较小的场景，详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143。
- 新增 getChartInstance 方法，用于直接获得图表实例，方便进行联动等操作。

### 2.3.9 (2019-01-25)

#### New Features

- 折线图标记点添加额外样式控制功能。
- 饼图添加坐标轴自定义处理的功能。

#### Bug Fixes

- 修复饼图 selectData 为空时无法清空选中的问题。

### 2.3.8 (2019-01-17)

#### New Features

- 添加多层饼图组件，内部测试中。
- 饼图添加选中效果，并且可以通过配置项控制选中。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/25/example/523

### 2.3.7 (2018-12-28)

#### Bug Fixes

- 修复地图组件在配置项动态更新时可能会报错的问题。

### 2.3.6 (2018-12-20)

#### New Features

- 增加 version 变量，可以直接获取当前版本号。
- 增加了 scale 设置和图例字号设置的逻辑健壮性。

#### Bug Fixes

- 修复多个图表实例间图例自定义样式会相互污染的问题。
- 修复图例设置为 true 时图例位置不正确的问题。

### 2.3.5 (2018-12-13)

#### New Features

- 线柱图拆分线柱的 label 配置项，可以分开配置。
- 新增 占位图组件的“无数据状态”。
- 新增 折线图允许调整线条粗细 的功能。

### 2.3.4 (2018-12-07)

#### Bug Fixes

- 修复雷达图 Y 轴标签颜色不正常的问题。
- 暂时关闭自动切换移动端图表的功能。

### 2.3.3 (2018-12-06)

#### New Features

- 卡片 container 蓝色标记线大小跟随文字大小变化。
- 卡片 container 随新版 aisc 规范，添加圆角。
- 新增图例项可以默认置灰的功能。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142

### 2.3.2 (2018-11-26)

#### Bug Fixes

- chore: 修复 npm 引入可能会报错的问题。

### 2.3.1 (2018-11-22)

#### New Features

- chore: 锁定 aisc 版本，防止打包构建报错。

#### Bug Fixes

- 修复线柱图可能会报错的问题。

### 2.3.0 (2018-11-22)

#### New Features

- 增强图例位置控制功能，支持 上左、上中、上右、下左、下中、下右 六个方位。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- 新增 图形 label 功能。详情见：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286
- 新增仪表盘组件。
- 构建工程优化，打包体积减少，gzip 大小（400kb）比原来精简 17%。

#### Bug Fixes

- 修复颜色设置不为数组时报错的问题。
- 修复图表大小变化时无法更新折叠图例的问题。
- 修复 g2 生成的 div 比设定高度高一些的问题。

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

- 修复配置项更改太快时 dom 节点重复绘制的问题。

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
- chore: 升级依赖 data-set 至 0.9.4。并优化包引用，打包后体积减少 140kb(gzip)。

#### Bug Fixes

- 修复组件库会覆盖 window.\_ 变量的问题。

### 2.1.24 (2018-08-23)

建议所有 2.1.21、2.1.22、2.1.23 用户都升级该版本。

#### New Features

- 正式发布 图例过多时自动折叠的功能。http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142
- 辅助标记 - line 的文案添加自定义样式的功能。
- 初步添加移动端适配方案，容器卡片自动适配移动端内边距。

#### Bug Fixes

- 修复图例过多自动折叠功能的一些样式问题。

### 2.1.23 (2018-08-16)

#### New Features

- 完善 图例过多自动折叠 的功能，可以根据图表高度自动计算折叠行数。

### 2.1.22 (2018-08-10)

#### New Features

- 新增图例过多时自动折叠的功能。
- chore: 新增 afterRender 生命周期。

#### Bug Fixes

- 修复与 aisc 样式冲突问题，彻底分离 icon 相关样式。

### 2.1.21 (2018-08-03)

#### New Features

- 调整数字组件样式。
- chore: 更新 Aisc 依赖版本。

#### Bug Fixes

- 修复内部图标可能会和 Aisc 图标冲突的问题。

### 2.1.20 (2018-08-02)

#### New Features

- 加强地图组件计算地理坐标时的兼容性。
- 自定义地图 render 函数新增传入 props。

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

- 线柱图更新数据时 sync 失效，某些情况下无法绘制图形的问题。

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

- chore: 底层 Aisc 依赖升级至 2.6.0。

#### Bug Fixes

- Aisc Icon 样式污染问题。

### 2.1.9 (2018-05-24)

#### New Features

- 新增 Aone 主题包。
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
- npm 引入方式报错

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
- chore: 底层 G2 依赖升级至 3.0.10。

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

- chore: 底层 G2 依赖升级至 3.0.5-beta.6。
- 新增 X 轴 label 自动旋转功能。
- 新增南丁格尔图图例相关逻辑。
- 占位图组件添加 加载中(loading) 和 异常(error) 状态。

#### Bug Fixes

- 饼图外半径值没有受到限制[0 - 1]。

### 2.1.3 (2018-03-15)

#### New Features

- chore: 锁定 G2 版本，避免意外更新导致的问题。

#### Bug Fixes

- 折线图开启拖拽缩放后可能的报错问题。

### 2.1.2 (2018-03-13)

#### New Features

- chore: 底层 Aisc 依赖升级到 2.5.27。
- 新增折线图拖拽放大的功能。
- 调整暗色主题样式细节。

#### Bug Fixes

- \#14405293 图表组件的子组件无法随数据更新的问题。
- 饼图子组件高度可能不正确的问题。

### 2.1.1 (2018-03-01)

#### New Features

- 新增图表联动功能，已提取为公共 tnpm 包，可推广给其它 G2 使用者使用。
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
- 图表组件可以动态更新 className 和 style。

#### Bug Fixes

- 获取状态颜色名称的函数在转入空值时返回错误的问题。
- 线柱图图例设置右侧位置显示错误的问题。
- 饼图图例最大高度受外半径影响的问题。

### 2.0.6 (2018-01-26)

#### New Features

- 统一了组件中状态相关的 api 名词，统一使用 normal, warning, error 等词汇。

#### Bug Fixes

- 细节样式问题。
- circle 组件在 gauge 仪表盘模式时百分比小于 15%时样式错误。

### 2.0.5 (2018-01-19)

#### Bug Fixes

- 单个圆环组件配合 container 样式错误。

### 2.0.4 (2018-01-18)

#### New Features

- 容器标题的底部标线允许控制关闭。
- 饼图图例/tooltip 回调参数中添加 percent 数据。
- 饼图圆环时支持添加内部文案。
- placeholder 组件允许添加文案。
- 更新新版的灰色颜色值。

#### Bug Fixes

- 迷你折线图配合小容器使用的问题。
- 容器底部 padding 问题。
- 动态数据处理的问题。

### 2.0.3 (2018-01-11)

#### New Features

- 容器允许添加自定义操作区的内容。
- 迷你折线图底层切换至 G2。
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
- icon 组件支持修改颜色，添加颜色翻转功能。

#### Bug Fixes

- 桑基图初始化报错问题。

### 2.0.1 (2018-01-02)

#### New Features

- 添加占位图 placeholder 组件。
- 开放更多度量可配置项。
- 优化对旧版本 datetime 的兼容。
- 优化 Y 轴辅助线的默认偏移量。

#### Bug Fixes

- 折线图 X 轴范围默认改为最大。

### 2.0.0 (2017-12-29)

大版本更新，详细的配置项变更请看 [2.0 升级指南](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137)

#### 新特性

- 底层图表库全面跟进 G2 3.0，对外输出无版权问题。
- 支持主题包切换功能。
- 更加丰富的图表，新增 散点图、桑基图、南丁格尔玫瑰图 组件。
