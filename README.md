# ConsoleCharts

面向云控制台场景的开箱即用前端图表库。基于 `@alicloud/cloud-charts` 包装，专注控制台场景，使用更简单方便。

<p align="center">
<a href=" https://www.alibabacloud.com"><img src="https://aliyunsdk-pages.alicdn.com/icons/AlibabaCloud.svg"></a>
</p>

## 安装使用

```bash
npm install @alicloud/console-charts --save
```

```js
// 引入组件
import { LineBase } from "@alicloud/console-charts";

// 仅需要传入 data
<LineBase data={data} />;
```

## 参与贡献

如果您在使用的过程中碰到问题，可以先通过 [Issues](https://github.com/alibaba/cloud-charts/issues) 看看有没有类似的 bug 或者建议。

如需提交代码，请遵从我们的 [贡献指南](https://github.com/alibaba/cloud-charts/blob/console-charts/CONTRIBUTING.md) 。
