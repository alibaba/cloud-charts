# ChartProvider — 主题与语言注入

在应用根部包裹，为子树所有图表统一注入主题与语言。

## API

```tsx
import { ChartProvider } from '@alicloud/cloud-charts-react';

interface ChartProviderProps {
  theme?: string;      // 'normal' | 'dark' | 'yunxiao'
  locale?: string;     // 'zh-CN' | 'en-US' ...
  children?: React.ReactNode;
}
```

## 优先级链（固定）

**显式 prop > context.prop > Provider 值 > 全局状态**

每个图表内部解析：
```ts
const language = props.language ?? props.context?.language ?? provider.locale;
const themeName = props.theme  ?? props.context?.theme  ?? provider.theme;
```

## 用法

```tsx
// 整棵子树统一主题 + 语言
<ChartProvider theme="dark" locale="zh-CN">
  <Dashboard />
</ChartProvider>

// 单图覆盖 Provider，不改全局
<Line data={data} theme="yunxiao" height={320} />
```

## 主题

| 主题 | 场景 |
|------|------|
| `normal` | 默认浅色，仪表盘/文档/产品截图 |
| `dark` | 深色模式、监控大屏、夜间 |
| `yunxiao` | 云效 DevOps 控制台风格 |

## 规则
- **禁止硬编码颜色伪造主题**。若图表颜色像 G2 默认蓝青色，说明它没走 Provider。
- Provider 会在挂载与主题变化时调用 `injectCSSVariables`，切主题自动生效。
