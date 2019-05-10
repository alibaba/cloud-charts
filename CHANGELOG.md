### 2.4.2 (2019-05-09)

#### New Features

- 优化Wcircle展示样式，内容支持居中
- Wplaceholder支持width属性设置

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