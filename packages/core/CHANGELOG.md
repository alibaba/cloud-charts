# @alicloud/cloud-charts-core Changelog

## 1.0.0-alpha.5 (Unreleased)

### Bug Fixes

- 修复 spec-first 路径（NativeChartController）未应用默认 margin/padding 导致 G2 v5 classic 主题下 canvas 四周出现 16px 意外留白的问题
  - 提取 `applyDefaultLayout()` 为共享函数，data+config 路径（composeChartModel）和 spec-first 路径（NativeChartController）统一调用
  - 在 `ChartSpec` 类型中新增 `margin`、`marginTop`、`padding` 字段声明
  - Commit: `fix(core): apply default margin/padding to spec-first path` (7a58bf1f)
