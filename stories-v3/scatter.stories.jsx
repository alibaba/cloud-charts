/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-scatter，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWscatterModel } from "@alicloud/cloud-charts-scatter";
import { Wscatter } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "集群A",
    data: [
      [12, 15], [20, 28], [35, 42], [50, 55], [65, 60],
      [80, 72], [95, 90], [40, 35], [60, 48], [75, 68],
    ],
  },
  {
    name: "集群B",
    data: [
      [10, 22], [25, 35], [38, 50], [55, 62], [70, 75],
      [85, 80], [45, 30], [30, 45], [62, 55], [90, 85],
    ],
  },
];

const cases = [
  { name: "基础散点图", config: {} },
  { name: "带抖动", config: { jitter: true } },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWscatterModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Scatter 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wscatter}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-scatter"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
