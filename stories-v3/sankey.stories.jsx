/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-sankey，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWsankeyModel } from "@alicloud/cloud-charts-sankey";
import { Wsankey } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = {
  nodes: [
    { name: "来源A" }, { name: "来源B" }, { name: "来源C" },
    { name: "中间1" }, { name: "中间2" },
    { name: "目标X" }, { name: "目标Y" },
  ],
  edges: [
    { source: "来源A", target: "中间1", value: 30 },
    { source: "来源A", target: "中间2", value: 20 },
    { source: "来源B", target: "中间1", value: 40 },
    { source: "来源C", target: "中间2", value: 35 },
    { source: "中间1", target: "目标X", value: 50 },
    { source: "中间1", target: "目标Y", value: 20 },
    { source: "中间2", target: "目标X", value: 25 },
    { source: "中间2", target: "目标Y", value: 30 },
  ],
};

const cases = [
  { name: "基础桑基图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWsankeyModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Sankey 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wsankey}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-sankey"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
