# cloud-charts-wline-vanilla-demo

`@alicloud/cloud-charts-line` 的端到端 Vite demo，演示如何在纯 JS / 非 React 项目中使用 v3 架构。

## 启动

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5179，看到 QPS 折线图 + 控制台输出 `model.spec`。

## 关键依赖

- `@alicloud/cloud-charts-core`（file:../../packages/core，框架无关运行时）
- `@alicloud/cloud-charts-line`（file:../../packages/charts/wline，单图表薄壳）
- `@antv/g2@~5.4.8`

## 文件结构

```
src/
├── main.ts         # 调 renderWlineModel 渲染图表 + 绑定 update/destroy 按钮
├── g2Renderer.ts   # 自定义 G2 渲染器（createChart / applySpec / destroyChart）
index.html          # 容器 + 控制按钮
vite.config.ts      # alias 指向 packages/*，resolve.dedupe 避免 monorepo hoisting 冲突
```

## 参考

- 源实现：[`cloud-charts/examples/wline-vanilla-demo`](../../../cloud-charts/examples/wline-vanilla-demo)
- 升级背景：参考 `docs/upgrade-overview.md` 与 `docs/refactor/architecture-v2-spec.md`