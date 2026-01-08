---
name: cloud-charts-reconstructor
description: 专业的React图表库重构专家，能够自动完成CloudCharts从React 17/G2 4.x到React 18/G2 5.x的完整重构，包括代码迁移、测试、文档生成和发布
version: 2.0.0
author: AI Architect
license: MIT
tags:
  - react
  - g2
  - typescript
  - vite
  - migration
  - chart-library
  - automation
---

# CloudCharts 重构专家技能

## 核心能力

这是一个专业的AI技能，能够自动完成CloudCharts图表库的现代化重构：

### 1. 架构分析与规划
- ✅ 自动分析现有代码结构
- ✅ 识别技术债务和风险点
- ✅ 生成详细的重构计划
- ✅ 估算时间和资源需求

### 2. 自动化重构执行
- ✅ 构建工具迁移 (Webpack 4 → Vite)
- ✅ React 版本升级 (17 → 18)
- ✅ G2 版本升级 (4.x → 5.x)
- ✅ 代码现代化 (类组件 → Hooks)
- ✅ 类型系统完善 (TypeScript 5)

### 3. 质量保障
- ✅ 自动化测试生成
- ✅ 性能基准测试
- ✅ 视觉回归测试
- ✅ 代码质量检查

### 4. 文档与发布
- ✅ 生成完整技术文档
- ✅ 创建迁移指南
- ✅ 生成API参考
- ✅ 自动化发布流程

## 使用场景

### 场景1: 全自动重构
```
用户: "请自动完成CloudCharts的重构，目标是React 18 + G2 5.x + Vite"
AI: 
  1. 分析当前项目
  2. 生成重构计划
  3. 执行代码迁移
  4. 运行测试
  5. 生成文档
  6. 准备发布
```

### 场景2: 分阶段执行
```
用户: "先完成阶段1: 构建工具迁移"
AI:
  1. 创建Vite配置
  2. 迁移构建脚本
  3. 测试构建
  4. 验证产物
```

### 场景3: 问题修复
```
用户: "G2 5.x升级后柱状图不显示，帮我修复"
AI:
  1. 分析错误日志
  2. 对比API变化
  3. 定位问题代码
  4. 应用修复
  5. 验证功能
```

### 场景4: 新功能开发
```
用户: "基于新架构添加一个散点图组件"
AI:
  1. 参考现有组件架构
  2. 使用G2 5.x API
  3. 生成完整代码
  4. 添加测试
  5. 更新文档
```

## 详细指令

### 1. 重构准备阶段

当用户请求重构时，首先执行：

```bash
# 1. 分析项目结构
cd /path/to/cloud-charts
npm run analyze

# 2. 检查依赖版本
npm ls react react-dom @antv/g2 webpack

# 3. 生成当前状态报告
# - 代码行数统计
# - 组件数量
# - 测试覆盖率
# - 构建时间基准
```

**输出**: 生成 `REFACTOR-ANALYSIS.md` 包含：
- 当前技术栈详情
- 风险评估矩阵
- 时间估算
- 推荐执行顺序

### 2. 构建工具迁移

**目标**: Webpack 4 → Vite

**执行步骤**:
```bash
# 1. 安装Vite
npm install -D vite @vitejs/plugin-react

# 2. 创建配置
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CloudCharts',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@antv/g2', '@antv/data-set', 'lodash', 'classnames'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@antv/g2': 'G2',
          '@antv/data-set': 'DataSet',
          lodash: '_',
          classnames: 'classNames'
        }
      }
    },
    define: {
      __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
EOF

# 3. 迁移构建脚本逻辑
cat > scripts/build-themes.ts << 'EOF'
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { compileString } from 'sass';

function compileTheme(themePath: string, outputPath: string) {
  const scss = readFileSync(themePath, 'utf-8');
  const result = compileString(scss, {
    loadPaths: [resolve(__dirname, '../src/themes')]
  });
  
  // 提取CSS变量
  const vars: Record<string, string> = {};
  const varRegex = /\$([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(result.css)) !== null) {
    vars[match[1]] = match[2].trim();
  }
  
  writeFileSync(outputPath, `export default ${JSON.stringify(vars, null, 2)};`);
}

function main() {
  const themePath = resolve(__dirname, '../src/themes');
  const themes = readdirSync(themePath).filter(f => f.endsWith('.scss'));
  
  themes.forEach(theme => {
    if (theme === 'base.scss' || theme === 'index.scss') return;
    
    const input = resolve(themePath, theme);
    const output = resolve(themePath, theme.replace('.scss', '.style.ts'));
    
    compileTheme(input, output);
    console.log(`✅ 编译主题: ${theme}`);
  });
}

main();
EOF

# 4. 更新package.json
npm pkg set scripts.build="vite build && tsc --emitDeclarationOnly"
npm pkg set scripts.dev="vite"
npm pkg set scripts.test="vitest"
npm pkg set type="module"
```

**验证标准**:
- ✅ `npm run build` 在10秒内完成
- ✅ 生成 `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts`
- ✅ 文件大小 < 500KB
- ✅ 无构建警告

### 3. React 18 升级

**执行步骤**:
```bash
# 1. 升级依赖
npm install react@^18.2.0 react-dom@^18.2.0
npm install -D @types/react@^18.2.0 @types/react-dom@^18.2.0

# 2. 更新peerDependencies
npm pkg set peerDependencies.react="^18.2.0"
npm pkg set peerDependencies.react-dom="^18.2.0"

# 3. 检查兼容性
npx tsc --noEmit

# 4. 更新入口文件（如果需要）
# 检查 src/index.ts 是否有 ReactDOM.render
# 替换为 createRoot
```

**关键检查点**:
- ✅ `componentDidMount` / `componentDidUpdate` 正常工作
- ✅ Context API 正常
- ✅ 事件系统正常
- ✅ 无React 18弃用警告

### 4. G2 5.x 升级

**这是最关键的阶段**，需要重写大量代码：

#### 4.1 更新依赖
```bash
npm install @antv/g2@^5.0.0
npm install -D @antv/g2@^5.0.0
```

#### 4.2 重写 Base.tsx

**G2 4.x vs 5.x API 映射**:

| 4.x API | 5.x API | 说明 |
|---------|---------|------|
| `new Chart({container})` | `new Chart({container})` | 基本相同 |
| `chart.scale({x: {type: 'cat'}})` | `.scale('x', {type: 'category'})` | 链式调用 |
| `chart.interval().position('x*y')` | `chart.interval().encode('x', 'x').encode('y', 'y')` | 声明式API |
| `chart.data(data)` | `.data(data)` | 链式调用 |
| `chart.render()` | `chart.render()` | 相同 |
| `chart.changeData(data)` | `chart.changeData(data)` | 相同 |

**新 Base.tsx 核心代码**:
```typescript
import { Chart } from '@antv/g2';
import React from 'react';
import { merge } from 'lodash';

class Base<ChartConfig, Props> extends React.Component<Props> {
  protected chart: Chart | null = null;
  protected chartDom: HTMLDivElement | null = null;
  
  initChart() {
    const { width, height, config, data } = this.props;
    
    // 创建Chart实例
    this.chart = new Chart({
      container: this.chartDom!,
      width: width || 600,
      height: height || 400,
      padding: config.padding || 'auto',
      autoFit: true,
    });
    
    // 应用主题
    if (this.context?.theme) {
      this.chart.theme(getG2Theme(this.context.theme));
    }
    
    // 调用子类初始化
    this.init(this.chart, config, data);
    
    // 渲染
    this.chart.render();
  }
  
  // 子类需要实现的方法
  init(chart: Chart, config: ChartConfig, data: any): void {}
  
  changeData(chart: Chart, config: ChartConfig, data: any): void {
    chart?.changeData(data);
  }
}
```

#### 4.3 更新各图表组件

**以 Wbar 为例**:

```typescript
// 旧 (G2 4.x)
init(chart: Chart, config: WbarConfig, data: any) {
  chart.scale({ x: { type: 'cat' }, y: { nice: true } });
  chart.data(data);
  
  const geom = chart.interval()
    .position('x*y')
    .color('type', config.colors);
  
  if (config.stack) {
    geom.adjust('stack');
  }
  
  rectXAxis(this, chart, config);
  rectYAxis(this, chart, config);
}

// 新 (G2 5.x)
init(chart: Chart, config: WbarConfig, data: any) {
  const interval = chart
    .interval()
    .data(data)
    .encode('x', 'x')
    .encode('y', 'y')
    .encode('color', 'type')
    .scale('y', { nice: true })
    .scale('x', { type: 'category' });
  
  if (config.stack) {
    interval.adjust('stack');
  }
  
  // 轴配置需要使用新的API
  if (config.xAxis) {
    chart.axis('x', {
      title: config.xAxis.title,
      label: { autoRotate: config.xAxis.autoRotate }
    });
  }
}
```

#### 4.4 更新工具函数

**rectXAxis (G2 5.x 版本)**:
```typescript
export function rectXAxis(chartObj: any, chart: Chart, config: any) {
  if (config.xAxis === false) {
    chart.axis('x', false);
    return;
  }
  
  const axisConfig: any = {
    title: config.xAxis?.title || null,
    label: {
      autoRotate: config.xAxis?.autoRotate,
      autoEllipsis: config.xAxis?.autoEllipsis,
      formatter: config.xAxis?.labelFormatter
    }
  };
  
  chart.axis('x', axisConfig);
}
```

#### 4.5 主题系统适配

```typescript
// G2 5.x 主题API变化
import { getG2theme } from '../themes/themeTools';

// 旧
chart.theme({ theme: 'dark' });

// 新
chart.theme(getG2theme('dark'));
```

### 5. Hooks 迁移

**创建自定义Hook**:

```typescript
// src/common/useChart.ts
import { useRef, useEffect, useCallback } from 'react';
import { Chart } from '@antv/g2';

export function useChart<Config>(props: ChartProps<Config>) {
  const chartRef = useRef<Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 初始化
  useEffect(() => {
    if (!containerRef.current) return;
    
    const chart = new Chart({
      container: containerRef.current,
      width: props.width || 600,
      height: props.height || 400,
      autoFit: true,
    });
    
    chartRef.current = chart;
    
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, []);
  
  // 数据更新
  useEffect(() => {
    if (chartRef.current && props.data) {
      chartRef.current.changeData(props.data);
    }
  }, [props.data]);
  
  // 配置更新
  useEffect(() => {
    if (chartRef.current && props.config) {
      // 重新应用配置
      applyConfig(chartRef.current, props.config);
    }
  }, [props.config]);
  
  return { chartRef, containerRef };
}
```

**函数组件版本**:
```typescript
export function Wbar<Config = WbarConfig>(props: ChartProps<Config>) {
  const { chartRef, containerRef } = useChart(props);
  
  useEffect(() => {
    if (chartRef.current && props.config) {
      // 初始化配置
      const chart = chartRef.current;
      const config = props.config;
      
      // 使用G2 5.x API配置
      chart
        .interval()
        .data(props.data || [])
        .encode('x', 'x')
        .encode('y', 'y')
        .encode('color', 'type');
      
      if (config.stack) {
        chart.adjust('stack');
      }
      
      chart.render();
    }
  }, [chartRef, props.config, props.data]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: props.width || '100%', 
        height: props.height || 400 
      }} 
    />
  );
}
```

### 6. AI 编程体系建立

#### 6.1 创建技能模板

```bash
mkdir -p .claude/skills/cloud-charts-dev
```

**.claude/skills/cloud-charts-dev/SKILL.md**:
```markdown
---
name: cloud-charts-dev
description: CloudCharts 开发专家 - 擅长创建新图表组件、修复Bug、优化性能
version: 1.0.0
---

# CloudCharts 开发专家

## 核心能力
1. 创建新图表组件
2. 修复现有Bug
3. 性能优化
4. 生成测试
5. 更新文档

## 开发规范

### 1. 组件结构
```typescript
// src/Wnewchart/index.tsx
import Base from '../common/Base';
import { Chart } from '@antv/g2';

interface WnewchartConfig extends BaseChartConfig {
  // 配置项定义
}

export class Wnewchart extends Base<WnewchartConfig> {
  chartName = 'G2Newchart';
  
  getDefaultConfig(): WnewchartConfig {
    return {
      // 默认配置
    };
  }
  
  init(chart: Chart, config: WnewchartConfig, data: any) {
    // 使用G2 5.x API
    chart
      .newGeometry()
      .data(data)
      .encode('x', 'x')
      .encode('y', 'y');
  }
}
```

### 2. 数据格式
```typescript
const data = [
  { name: '系列1', data: [['x1', 10], ['x2', 20]] }
];
```

### 3. 测试规范
```typescript
describe('Wnewchart', () => {
  it('renders correctly', () => {
    const { container } = render(<Wnewchart data={data} />);
    expect(container.querySelector('.wnewchart')).toBeTruthy();
  });
});
```

## 任务流程

### 创建新组件
1. 分析需求和数据格式
2. 参考现有组件架构
3. 生成代码框架
4. 添加配置接口
5. 实现初始化逻辑
6. 编写测试用例
7. 更新导出文件
8. 生成文档

### 修复Bug
1. 复现问题
2. 分析错误日志
3. 定位问题代码
4. 应用修复
5. 运行测试
6. 验证功能

### 性能优化
1. 分析性能瓶颈
2. 优化数据处理
3. 减少重绘
4. 添加缓存
5. 性能测试
```

#### 6.2 创建测试技能

```bash
mkdir -p .claude/skills/cloud-charts-testing
```

**.claude/skills/cloud-charts-testing/SKILL.md**:
```markdown
---
name: cloud-charts-testing
description: CloudCharts 测试专家 - 生成单元测试、集成测试、视觉回归测试
version: 1.0.0
---

# CloudCharts 测试专家

## 测试类型

### 1. 单元测试 (Vitest)
```typescript
describe('Wbar 配置合并', () => {
  it('应该正确合并默认配置和用户配置', () => {
    const defaults = { stack: false, colors: ['#1890ff'] };
    const user = { stack: true };
    const result = merge(defaults, user);
    expect(result.stack).toBe(true);
  });
});
```

### 2. 组件测试 (React Testing Library)
```typescript
describe('Wbar 渲染', () => {
  it('应该正确渲染数据', () => {
    const data = [{ name: '测试', data: [['x', 10]] }];
    render(<Wbar data={data} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

### 3. 性能测试
```typescript
it('大数据量渲染时间', () => {
  const start = performance.now();
  render(<Wbar data={largeData} />);
  const end = performance.now();
  expect(end - start).toBeLessThan(100);
});
```

### 4. 视觉回归测试
```typescript
// .storybook/test-runner.js
module.exports = {
  async preRender(page) {
    await page.addStyleTag({
      content: `* { animation-duration: 0s !important; }`
    });
  },
  async postRender(page) {
    await page.screenshot({ path: `screenshots/${story.id}.png` });
  }
};
```

## 测试策略

### 阶段1: 核心功能
- [ ] 所有图表类型渲染
- [ ] 配置项生效
- [ ] 数据更新
- [ ] 事件响应

### 阶段2: 边界情况
- [ ] 空数据
- [ ] 大数据
- [ ] 极端数据
- [ ] 异常输入

### 阶段3: 集成测试
- [ ] 主题切换
- [ ] 国际化
- [ ] 响应式
- [ ] 性能基准
```

#### 6.3 创建文档技能

```bash
mkdir -p .claude/skills/cloud-charts-docs
```

**.claude/skills/cloud-charts-docs/SKILL.md**:
```markdown
---
name: cloud-charts-docs
description: CloudCharts 文档专家 - 生成API文档、迁移指南、使用示例
version: 1.0.0
---

# CloudCharts 文档专家

## 文档类型

### 1. API 参考文档
```typescript
/**
 * 柱状图配置项
 * 
 * @example
 * ```typescript
 * const config: WbarConfig = {
 *   stack: true,
 *   colors: ['#1890ff', '#13c2c2'],
 *   xAxis: { autoRotate: false }
 * };
 * ```
 * 
 * @property {boolean} stack - 是否堆叠
 * @property {Colors} colors - 颜色方案
 * @property {XAxisConfig} xAxis - X轴配置
 */
interface WbarConfig extends BaseChartConfig {
  stack?: boolean;
  colors?: Colors;
  xAxis?: XAxisConfig;
}
```

### 2. 迁移指南
```markdown
# 从 v1.x 迁移到 v2.x

## 主要变化

### 1. React 版本
- 旧: React 15/16/17
- 新: React 18+

### 2. G2 版本
- 旧: G2 4.x
- 新: G2 5.x

### 3. 构建工具
- 旧: Webpack 4
- 新: Vite

## 迁移步骤

1. 更新依赖
```bash
npm install react@^18.2.0 @antv/g2@^5.0.0
```

2. 检查API变化
- chart.interval().position() → chart.interval().encode()
- chart.scale({x: {...}}) → chart.scale('x', {...})

3. 测试功能
```

### 3. 使用示例库
```markdown
## 柱状图示例

### 基础柱状图
```jsx
import { Wbar, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  { name: '系列1', data: [['一', 59], ['二', 23]] }
];

<Wcontainer>
  <Wbar height={400} data={data} />
</Wcontainer>
```

### 堆叠柱状图
```jsx
<Wbar 
  data={data} 
  config={{ stack: true, colors: ['#1890ff', '#13c2c2'] }} 
/>
```

### 事件处理
```jsx
<Wbar
  event={{
    'plot:click': (ev) => console.log(ev.data)
  }}
/>
```
```

### 7. 自动化工作流

#### 7.1 GitHub Actions 配置

**.github/workflows/refactor.yml**:
```yaml
name: AI-Driven Refactoring

on:
  workflow_dispatch:
    inputs:
      phase:
        description: 'Refactoring phase'
        required: true
        type: choice
        options:
          - all
          - build-tools
          - react18
          - g2-5x
          - hooks
          - testing

jobs:
  refactor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Phase 1 - Build Tools
        if: github.event.inputs.phase == 'all' || github.event.inputs.phase == 'build-tools'
        run: |
          npm install -D vite @vitejs/plugin-react
          node scripts/migrate-build.js
          npm run build
          npm run test
      
      - name: Phase 2 - React 18
        if: github.event.inputs.phase == 'all' || github.event.inputs.phase == 'react18'
        run: |
          npm install react@^18.2.0 react-dom@^18.2.0
          npm install -D @types/react@^18.2.0 @types/react-dom@^18.2.0
          npm run test
      
      - name: Phase 3 - G2 5.x
        if: github.event.inputs.phase == 'all' || github.event.inputs.phase == 'g2-5x'
        run: |
          npm install @antv/g2@^5.0.0
          node scripts/migrate-g2.js
          npm run build
          npm run test
      
      - name: Generate Report
        run: |
          node scripts/generate-report.js > REFACTOR-REPORT.md
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: "AI: Automated Refactoring - Phase ${{ github.event.inputs.phase }}"
          body: |
            ## 自动重构完成
            
            ### 执行阶段
            - [x] ${{ github.event.inputs.phase }}
            
            ### 产出物
            - 构建产物
            - 测试报告
            - 性能基准
            
            ### 验证清单
            - [ ] 所有测试通过
            - [ ] 构建成功
            - [ ] 文档更新
            
            ### AI 执行日志
            See workflow run for details.
          branch: ai/refactor-${{ github.event.inputs.phase }}
          delete-branch: true
```

#### 7.2 自动化脚本

**scripts/migrate-g2.js**:
```javascript
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

// G2 4.x → 5.x API 映射
const API_MAP = {
  "chart.interval().position('x*y')": "chart.interval().encode('x', 'x').encode('y', 'y')",
  "chart.scale({x: {type: 'cat'}})": "chart.scale('x', {type: 'category'})",
  "chart.data(data)": ".data(data)",
  // 更多映射...
};

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  
  // 替换API调用
  Object.keys(API_MAP).forEach(oldAPI => {
    content = content.replaceAll(oldAPI, API_MAP[oldAPI]);
  });
  
  writeFileSync(filePath, content);
  console.log(`✅ Migrated: ${filePath}`);
}

// 处理所有组件
const srcDir = resolve(__dirname, '../src');
const components = readdirSync(srcDir).filter(f => f.startsWith('W'));

components.forEach(comp => {
  const compPath = resolve(srcDir, comp, 'index.tsx');
  if (existsSync(compPath)) {
    migrateFile(compPath);
  }
});
```

### 8. 质量检查清单

#### 8.1 构建验证
```bash
# 检查清单
✅ npm run build 成功
✅ 生成 ES/CJS/UMD 格式
✅ 类型定义完整
✅ 包体积 < 500KB
✅ 无构建警告
```

#### 8.2 功能验证
```bash
# 测试清单
✅ 所有图表类型渲染正常
✅ 配置项生效
✅ 主题切换正常
✅ 国际化正常
✅ 事件系统正常
✅ 数据更新正常
```

#### 8.3 性能验证
```bash
# 性能基准
✅ 首次渲染 < 100ms
✅ 数据更新 < 50ms
✅ 大数据渲染流畅
✅ 内存无泄漏
```

#### 8.4 文档验证
```bash
# 文档清单
✅ API 参考完整
✅ 使用示例丰富
✅ 迁移指南清晰
✅ 类型注释完整
```

## 执行流程

### 完整重构流程

```bash
# 1. 分析阶段
openskills run cloud-charts-reconstructor --phase=analyze

# 2. 构建工具迁移
openskills run cloud-charts-reconstructor --phase=build-tools

# 3. React 18 升级
openskills run cloud-charts-reconstructor --phase=react18

# 4. G2 5.x 升级
openskills run cloud-charts-reconstructor --phase=g2-5x

# 5. Hooks 迁移
openskills run cloud-charts-reconstructor --phase=hooks

# 6. 测试与验证
openskills run cloud-charts-testing --phase=all

# 7. 文档生成
openskills run cloud-charts-docs --phase=all

# 8. 生成报告
openskills run cloud-charts-reconstructor --phase=report
```

## 产出物

### 1. 代码产出
- ✅ `dist/` - 构建产物
- ✅ `src/` - 现代化代码
- ✅ `test/` - 完整测试
- ✅ `types/` - 类型定义

### 2. 文档产出
- ✅ `AI-知识库文档.md` - 技术文档
- ✅ `重构计划书.md` - 项目规划
- ✅ `实施指南.md` - 操作手册
- ✅ `API_REFERENCE.md` - API参考
- ✅ `MIGRATION_GUIDE.md` - 迁移指南

### 3. 报告产出
- ✅ `REFACTOR-REPORT.md` - 重构报告
- ✅ `PERFORMANCE-REPORT.md` - 性能报告
- ✅ `TEST-REPORT.md` - 测试报告

## 使用示例

### 示例1: 完整重构
```
用户: "请使用cloud-charts-reconstructor技能完成完整重构"
AI: 
  1. 分析项目结构
  2. 生成重构计划
  3. 执行阶段1: 构建工具
  4. 执行阶段2: React 18
  5. 执行阶段3: G2 5.x
  6. 执行阶段4: Hooks
  7. 运行测试
  8. 生成文档
  9. 输出报告
```

### 示例2: 问题修复
```
用户: "使用cloud-charts-dev技能修复柱状图在React 18下的警告"
AI:
  1. 查找警告代码
  2. 分析原因
  3. 应用修复
  4. 运行测试
  5. 验证修复
```

### 示例3: 新功能
```
用户: "使用cloud-charts-dev技能添加一个箱线图组件"
AI:
  1. 分析需求
  2. 生成代码
  3. 添加测试
  4. 更新文档
  5. 验证功能
```

## 技能组合

这些技能可以组合使用：

```bash
# 完整工作流
openskills install anthropics/skills
openskills install cloud-charts-reconstructor
openskills install cloud-charts-dev
openskills install cloud-charts-testing
openskills install cloud-charts-docs

# 执行完整重构
openskills run cloud-charts-reconstructor --phase=all

# 后续开发
openskills run cloud-charts-dev --task="add-component"
openskills run cloud-charts-testing --task="run-all"
openskills run cloud-charts-docs --task="update-api"
```

## 维护与更新

### 定期更新
```bash
# 更新技能
openskills update cloud-charts-reconstructor

# 查看版本
openskills list --installed
```

### 技能优化
```bash
# 测试新功能
openskills test cloud-charts-reconstructor

# 生成使用统计
openskills stats
```

---

**版本**: 2.0.0  
**最后更新**: 2026-01-09  
**状态**: ✅ 生产就绪

