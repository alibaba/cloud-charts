---
category: 组件
subtitle: CircleMiniA
type: 环迷你卡片
title: A
cols: 1
---

## API

| 属性         | 说明                                       | 类型     | 默认值    |
| ---------- | ---------------------------------------- | ------ | ------ |
| title      | 标题文案                                     | String | ''     |
| ringTitle  | 圆环标题                                     | String | ''     |
| ringKey    | 环数据的Key                                  | String | 'ring' |
| details    | 详情的配置，包涵文案、数据Key、渲染方式。形如 [{"label":"Text","key":"a"},{"label":"Text","key":"b"}] | Array  | []     |
| dataSource | 展示的数据源。形如 { ringKey: 0.8, a: 10, b: 20}  | Object | {}     |

### details

| 属性    | 说明                    | 类型              |
| ----- | --------------------- | --------------- |
| label | 文案                    | String          |
| key   | 与数据中的key一一对应，用于获取相应数据 | String          |
| cell  | 自定义渲染函数               | Function(value) |

### dataSource

| 属性   | 说明           | 类型            |
| ---- | ------------ | ------------- |
| data | 数据           | String，Number |
| key  | 与配置中的key一一对应 | String        |