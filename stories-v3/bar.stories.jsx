/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-bar，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWbarModel } from "@alicloud/cloud-charts-bar";
import { Wbar } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "机房A",
    data: [
      ["周一", 4092], ["周二", 1592], ["周三", 3714],
      ["周四", 4854], ["周五", 6514], ["周六", 9022], ["周日", 6023],
    ],
  },
  {
    name: "机房B",
    data: [
      ["周一", 6051], ["周二", 3278], ["周三", 5175],
      ["周四", 6548], ["周五", 9048], ["周六", 11394], ["周日", 8597],
    ],
  },
];

const cases = [
  { name: "基础柱状图", config: {} },
  { name: "堆叠柱状图", config: { stack: true } },
  { name: "分组柱状图", config: { dodge: true } },
  { name: "百分比堆叠柱状图", config: { percentage: true } },
  { name: "带网格线", config: { grid: true } },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWbarModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Bar 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wbar}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-bar"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
