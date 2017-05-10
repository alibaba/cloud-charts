---
category: 组件
subtitle: Panel
type: 信息展示
title: 卡片
cols: 1
---

## API

### Panel

| 属性        | 说明                           | 类型      | 默认值            |
| --------- | ---------------------------- | ------- | -------------- |
| title     | 标题文案                         | String  | ''             |
| className | 自定义类名                        | String  | ''             |
| tabMode   | 是否启用tab模式（仅设置了title时生效）      | Boolean | false          |
| activeKey | tab模式下默认选中的tab（仅开启了tab模式后有效） | String  | ''，不设置时默认选中第一个 |

### Panel.TitleSub

该标签内的内容会被放到标题栏右侧。（仅在Panel设置了title时生效）

| 属性        | 说明    | 类型     | 默认值  |
| --------- | ----- | ------ | ---- |
| className | 自定义类名 | String | ''   |

### Panel.Item

| 属性        | 说明                                | 类型     | 默认值         |
| --------- | --------------------------------- | ------ | ----------- |
| title     | 分组名称，该内容仅在tab模式下显示在tab中，用于区分不同tab | String | ''          |
| className | 自定义类名                             | String | ''          |
| tabKey    | tab模式下分组的唯一标示，仅tab模式生效            | String | 默认与title值相同 |
