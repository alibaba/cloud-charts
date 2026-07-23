/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-heatmap，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWheatmapModel } from "@alicloud/cloud-charts-heatmap";
import { Wheatmap } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "热力",
    data: [
      ["Mon", "10:00", 12], ["Mon", "14:00", 45], ["Mon", "18:00", 80],
      ["Tue", "10:00", 30], ["Tue", "14:00", 60], ["Tue", "18:00", 55],
      ["Wed", "10:00", 50], ["Wed", "14:00", 75], ["Wed", "18:00", 40],
      ["Thu", "10:00", 20], ["Thu", "14:00", 90], ["Thu", "18:00", 65],
      ["Fri", "10:00", 70], ["Fri", "14:00", 35], ["Fri", "18:00", 95],
    ],
  },
];

const cases = [
  { name: "基础热力图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWheatmapModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Heatmap 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wheatmap}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-heatmap"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
