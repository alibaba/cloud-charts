/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-treemap，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWtreemapModel } from "@alicloud/cloud-charts-treemap";
import { Wtreemap } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = {
  name: "根",
  children: [
    { name: "服务A", value: 400 },
    { name: "服务B", value: 300 },
    { name: "服务C", value: 200 },
    { name: "服务D", value: 150 },
    { name: "服务E", value: 100 },
    { name: "服务F", value: 80 },
  ],
};

const cases = [
  { name: "基础矩形树图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWtreemapModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Treemap 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wtreemap}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-treemap"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
