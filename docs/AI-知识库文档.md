# CloudCharts 智能图形组件库 - AI知识库文档

## 一、项目概述

### 1.1 项目简介
CloudCharts 是一个面向中后台的开箱即用图表库，基于 React + G2 构建，提供 20+ 种图表类型，支持主题切换、国际化、数据规则等高级功能。

### 1.2 核心特性
- **React 组件化**: 基于 React 15/16/17 的类组件架构
- **G2 图表引擎**: 基于 AntV G2 4.x 版本
- **配置化图表**: 无需学习 G2 复杂语法，通过配置项使用
- **主题系统**: 支持明暗主题切换，CSS 变量驱动
- **国际化**: 支持 zh-CN、en-US、zh-TW
- **智能规则**: 大数据、极端数据、空数据自动处理
- **AOP 切面**: 支持生命周期钩子和事件系统

## 二、技术架构

### 2.1 当前技术栈

```json
{
  "核心依赖": {
    "react": "15.6 || 16 || 17",
    "@antv/g2": "^4.2.9",
    "webpack": "^4.46.0"
  },
  "构建工具": {
    "build-scripts": "^0.1.3",
    "build-plugin-component": "^1.0.3"
  },
  "开发工具": {
    "typescript": "4.6.4",
    "storybook": "^6.4.12",
    "jest": "^29.5.0"
  }
}
```

### 2.2 目录结构

```
cloud-charts/
├── src/
│   ├── Wbar/           # 柱状图组件
│   ├── Wline/          # 折线图组件
│   ├── Wpie/           # 饼图组件
│   ├── ...             # 其他图表组件
│   ├── common/         # 公共工具和基类
│   │   ├── Base.tsx    # 图表基类
│   │   ├── types.ts    # TypeScript 类型定义
│   │   └── common.ts   # 工具函数
│   ├── themes/         # 主题系统
│   │   ├── normal.scss # 默认主题
│   │   ├── dark.scss   # 暗色主题
│   │   └── index.ts    # 主题管理
│   ├── locales/        # 国际化
│   │   ├── zh-cn.ts
│   │   ├── en-us.ts
│   │   └── zh-tw.ts
│   ├── rule/           # 智能规则系统
│   │   ├── index.ts    # 规则定义
│   │   ├── bigData.ts  # 大数据处理
│   │   └── extremeData.ts # 极端数据处理
│   ├── ChartProvider/  # React Context 提供者
│   └── plugins/        # 插件系统
├── stories/            # Storybook 演示
├── build.json          # 构建配置
├── build.before.js     # 构建前置脚本
└── build.after.js      # 构建后置脚本
```

### 2.3 核心架构模式

#### 2.3.1 组件继承体系
```
Base (React.Component)
  └── Wbar / Wline / Wpie / ...
      ├── init()        # 初始化图表
      ├── changeData()  # 更新数据
      └── destroy()     # 销毁图表
```

#### 2.3.2 数据流架构
```
用户 Props → 数据转换 → 规则处理 → 配置合并 → G2 渲染
            (highchartsDataToG2Data)  (runInitRule)  (processFinalConfig)
```

#### 2.3.3 AOP 切面系统
- **beforeInit**: 初始化前处理
- **beforeWidgetsInit**: 组件初始化前事件
- **afterWidgetsInit**: 组件初始化后事件
- **beforeWidgetsChangeData**: 数据变更前事件
- **afterWidgetsChangeData**: 数据变更后事件

## 三、核心组件详解

### 3.1 图表基类 (Base.tsx)

#### 3.1.1 核心生命周期
```typescript
class Base<ChartConfig, Props> extends React.Component<Props> {
  // 1. 构造函数
  constructor(props)
  
  // 2. 组件挂载
  componentDidMount()
    └─> initChart()
        ├─> 合并配置项
        ├─> 数据预处理
        ├─> 运行初始化规则
        ├─> 创建 G2 Chart 实例
        ├─> 调用子类 init()
        ├─> 绑定事件/交互
        └─> chart.render()
  
  // 3. 组件更新
  componentDidUpdate(prevProps)
    ├─> 配置变化 → rerender()
    ├─> 数据变化 → changeData()
    ├─> 尺寸变化 → handleChangeSize()
    └─> 事件/交互更新
  
  // 4. 组件卸载
  componentWillUnmount()
    └─> handleDestroy()
        ├─> 清除事件
        ├─> 清除定时器
        └─> chart.destroy()
}
```

#### 3.1.2 配置项合并策略
```typescript
// 优先级从低到高
const finalConfig = merge(
  {},                    // 空对象
  this.defaultConfig,    // 组件默认配置
  globalBaseConfig,      // 全局通用配置
  globalComsConfig,      // 全局组件配置
  props.config           // 用户传入配置
);
```

### 3.2 柱状图组件 (Wbar)

#### 3.2.1 配置项接口
```typescript
interface WbarConfig extends BaseChartConfig {
  colors?: Colors;              // 颜色方案
  xAxis?: XAxisConfig | false;  // X轴配置
  yAxis?: YAxisConfig | false;  // Y轴配置
  legend?: LegendConfig | boolean; // 图例
  tooltip?: TooltipConfig | boolean; // 提示框
  stack?: boolean;              // 堆叠模式
  dodge?: boolean;              // 分组模式
  dodgeStack?: boolean;         // 分组堆叠
  percentage?: boolean;         // 百分比堆叠
  polar?: boolean;              // 极坐标
  facet?: boolean | FacetConfig; // 分面/镜面
  label?: LabelConfig | boolean; // 数据标签
  size?: GeomSizeConfig;        // 柱子尺寸
  geomStyle?: GeomStyleConfig;  // 柱子样式
  zoom?: boolean;               // 缩放
  slider?: boolean;             // 缩略轴
  scrollbar?: boolean;          // 滚动条
}
```

#### 3.2.2 数据格式
```typescript
// 标准格式
const data = [
  {
    name: '系列1',
    data: [['x1', 10], ['x2', 20], ['x3', 15]]
  },
  {
    name: '系列2',
    data: [['x1', 8], ['x2', 25], ['x3', 12]]
  }
];

// 高级格式（支持分组、分面）
const data = [
  {
    name: '系列1',
    data: [{x: 'x1', y: 10, dodge: '组A', facet: '面1'}]
  }
];
```

#### 3.2.3 绘制流程
```typescript
init(chart, config, data) {
  // 1. 设置数据度量 (scale)
  chart.scale({ x: {...}, y: {...}, type: {...} });
  
  // 2. 数据处理
  const dataView = computerData(config, data); // 百分比/堆叠计算
  
  // 3. 设置坐标轴
  rectXAxis(this, chart, config);
  rectYAxis(this, chart, config);
  
  // 4. 设置图例
  rectLegend(this, chart, config);
  
  // 5. 设置提示框
  rectTooltip(this, chart, config);
  
  // 6. 设置坐标系
  chart.coordinate('polar' or 'rect');
  
  // 7. 绘制几何图形
  drawBar(chart, config, colors);
  
  // 8. 添加交互
  rectZoom(chart, config);
  rectSlider(chart, config);
  rectScrollbar(chart, config);
}
```

### 3.3 主题系统

#### 3.3.1 主题结构
```typescript
interface Theme {
  'widgets-bg': string;              // 背景色
  'widgets-axis-line': string;       // 轴线颜色
  'widgets-axis-label': string;      // 轴标签颜色
  'widgets-legend-text': string;     // 图例文字
  'category_12': string[];           // 分类颜色
  // ... 更多变量
}
```

#### 3.3.2 主题切换机制
```typescript
// 1. SCSS 变量定义 (normal.scss)
$widgets-bg: #ffffff;
$widgets-axis-line: #e8e8e8;

// 2. 编译为 JS 对象 (build.before.js)
sassExtract.renderSync({...}); // 生成 normal.style.ts

// 3. 运行时切换
setTheme('dark'); // 更新 CSS 变量 + 触发重绘
```

### 3.4 智能规则系统

#### 3.4.1 规则分类
```typescript
// 1. 大数据规则
{
  type: BigDataJudgement.Length,
  threshold: 15,
  message: '数据过于密集',
  process: processBarBigData // 自动开启缩略轴
}

// 2. 极端数据规则
{
  processBarExtremeData: (chart, config, data) => {
    // 检测数据差异过大
    // 自动调整坐标轴范围
    return { isExtreme: boolean, config?: any };
  }
}

// 3. 空数据规则
{
  emptyData: EmptyDataProcess.Axis,
  // 显示占位图或提示
}
```

#### 3.4.2 规则执行时机
```typescript
// 初始化时
runInitRule(this, config, data);

// 渲染前
runBeforePaintRule(this, config, data);

// 数据变更后
runAfterDataChangedRule(this, config, data);
```

## 四、构建系统

### 4.1 构建流程

```
build.before.js
  ├─> 编译 SCSS 变量 → .style.ts
  └─> 配置 Babel 插件

build-scripts build
  ├─> TypeScript 编译
  ├─> Webpack 打包
  └─> 生成 lib/es/build 目录

build.after.js
  ├─> 调整输出路径
  ├─> 配置 externals
  ├─> 生成主题包 (dark.js)
  └─> 清理临时文件
```

### 4.2 输出产物
```
build/
  ├── index.js          # UMD 包
  ├── dark.js           # 暗色主题包
  └── index.css         # 样式

lib/                    # CommonJS
  ├── index.js
  └── index.d.ts

es/                     # ES Modules
  ├── index.js
  └── index.d.ts
```

### 4.3 关键配置

#### 4.3.1 build.json
```json
{
  "plugins": ["./build.before.js", "build-plugin-component", "./build.after.js"],
  "filename": "index",
  "library": "CloudCharts",
  "libraryTarget": "umd"
}
```

#### 4.3.2 Webpack externals
```javascript
{
  react: { root: 'React', commonjs: 'react', ... },
  'react-dom': { root: 'ReactDOM', ... },
  '@alicloud/cloud-charts': { root: 'CloudCharts', ... }
}
```

## 五、Storybook 演示系统

### 5.1 故事文件结构
```javascript
// stories/chart.bar.stories.js
import { Wbar, Wcontainer } from '@alicloud/cloud-charts';

const stories = storiesOf('Wbar', module);

stories.add('基础柱状图', () => (
  <Wcontainer>
    <Wbar height={300} data={data} config={config} />
  </Wcontainer>
));

stories.add('堆叠柱状图', () => (
  <Wcontainer>
    <Wbar height={300} data={data} config={{ stack: true }} />
  </Wcontainer>
));
```

### 5.2 功能演示分类
- **图表类型**: bar, line, pie, radar, funnel...
- **功能特性**: axis, legend, tooltip, zoom, slider...
- **特殊场景**: bigdata, emptydata, locale, theme...

## 六、使用示例

### 6.1 基础使用
```jsx
import { Wbar, Wcontainer, ChartProvider } from '@alicloud/cloud-charts';

const data = [
  { name: '系列1', data: [['一', 59], ['二', 23], ['三', 19]] },
  { name: '系列2', data: [['一', 92], ['二', 15], ['三', 4]] }
];

function App() {
  return (
    <ChartProvider language="zh-cn" theme="normal">
      <Wcontainer>
        <Wbar 
          height={400} 
          data={data}
          config={{
            legend: { align: 'right' },
            stack: true
          }}
        />
      </Wcontainer>
    </ChartProvider>
  );
}
```

### 6.2 高级配置
```jsx
<Wbar
  config={{
    colors: ['#1890ff', '#13c2c2'],
    xAxis: { autoRotate: false, autoEllipsis: true },
    yAxis: { min: 0, max: 100 },
    legend: { position: 'top' },
    tooltip: { 
      titleFormatter: (title) => `月份: ${title}`,
      nameFormatter: (name) => `系列: ${name}`,
      valueFormatter: (value) => `${value} 个`
    },
    label: { visible: true, position: 'top' },
    zoom: true,
    slider: true
  }}
/>
```

### 6.3 事件处理
```jsx
<Wbar
  event={{
    'plot:click': (ev) => {
      console.log('点击数据:', ev.data);
    },
    'tooltip:show': (ev) => {
      console.log('提示框显示');
    }
  }}
/>
```

### 6.4 自定义主题
```jsx
<ChartProvider theme={{
  'widgets-bg': '#f0f2f5',
  'widgets-axis-line': '#cccccc',
  'category_12': ['#ff6900', '#fcb900', '#00d084']
}}>
  {/* 图表组件 */}
</ChartProvider>
```

## 七、最佳实践

### 7.1 性能优化
1. **大数据场景**: 开启 `slider` 或 `scrollbar`
2. **频繁更新**: 使用 `changeData()` 而非重绘
3. **函数更新**: 设置 `enableFunctionUpdate={true}`
4. **局部刷新**: `localRefresh={true}`

### 7.2 错误处理
```jsx
<Wbar
  loading={isLoading}
  loadingInfo="数据加载中..."
  errorInfo="数据加载失败"
  emptyInfo="暂无数据"
/>
```

### 7.3 规则控制
```jsx
<ChartProvider rule={{
  extreme: false,    // 关闭极端数据处理
  bigdata: false     // 关闭大数据处理
}}>
  {/* 图表 */}
</ChartProvider>
```

## 八、常见问题

### Q1: 如何升级到 React 18?
**A**: 需要更新 peerDependencies，修改类组件为函数组件/Hooks，测试兼容性

### Q2: 如何升级到 G2 5.x?
**A**: G2 5.x API 变化较大，需要重写 Base.tsx 的初始化和渲染逻辑

### Q3: 如何替换 Webpack?
**A**: 可考虑 Vite/Rollup，需要重写 build.before.js 和 build.after.js

### Q4: 如何支持 AI 编程?
**A**: 需要提供清晰的 API 文档、类型定义、使用示例和规则说明

## 九、参考资料

- [AntV G2 官方文档](https://g2.antv.vision/)
- [React 官方文档](https://react.dev/)
- [Storybook 文档](https://storybook.js.org/)
- [项目 GitHub](https://github.com/alibaba/cloud-charts)

---

**文档版本**: 1.0  
**最后更新**: 2026-01-09  
**维护者**: AI Assistant

