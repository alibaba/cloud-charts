---
category: 组件
subtitle: TopList
type: 信息展示
title: Top列表
cols: 1
---

## API

### TopList

| 属性         | 说明                           | 类型      | 默认值                                   |
| ---------- | ---------------------------- | ------- | ------------------------------------- |
| title      | 标题文案                         | String  | ''                                    |
| titleAlign | 标题水平位置                       | String  | 'center'，可选值有 `left`，`center`，`right` |
| topLimit   | top数据条数，多于该数目的数据不会被显示        | Number  | 10                                    |
| dataSource | 展示的数据源                       | Array   | []                                    |
| tabMode    | 是否启用tab模式                    | Boolean | false                                 |
| activeKey  | tab模式下默认选中的tab（仅开启了tab模式后有效） | String  | ''，不设置时默认选中第一个                        |

### TopList.Group

| 属性         | 说明                                       | 类型     | 默认值                                 |
| ---------- | ---------------------------------------- | ------ | ----------------------------------- |
| title      | 分组名称，该内容仅在tab模式下显示在tab中，用于区分不同tab        | String | ''                                  |
| dataSource | 展示的数据源，在分组中设置后会忽略到顶层TopList中设置的dataSource | Array  | []                                  |
| width      | 分组宽度，一般情况不需要手动设置。设置为'auto'可使宽度压缩到最小      | String | 可选值有`px`，`%`，`auto`                 |
| align      | 该组水平对齐位置                                 | String | 跟随页面设置，可选值有 `left`，`center`，`right` |
| tabKey     | tab模式下分组的唯一标示，仅tab模式生效                   | String | 默认与title值相同                         |

### TopList.Group.Column

| 属性        | 说明                                 | 类型                             | 默认值                                 |
| --------- | ---------------------------------- | ------------------------------ | ----------------------------------- |
| title     | 列名称，显示在列顶端                         | String                         | ''                                  |
| width     | 列宽度，一般情况不需要手动设置。设置为'auto'可使宽度压缩到最小 | String                         | 可选值有`px`，`%`，`auto`                 |
| align     | 该列水平对齐位置                           | String                         | 跟随页面设置，可选值有 `left`，`center`，`right` |
| dataIndex | 指定渲染的key                           | String                         | ''                                  |
| sortable  | 该列是否为排序列。排序列指定了以该列为排序key以及样式有特殊处理。 | Boolean                        | false                               |
| sort      | 自定义排序函数，                           | Function(a, b)                 | 按照sortable列的值降序排列                   |
| cell      | 自定义渲染函数                            | Function(value, index, record) | null                                |
