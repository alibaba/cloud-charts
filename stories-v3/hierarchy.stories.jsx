/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-hierarchy，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWhierarchyModel } from "@alicloud/cloud-charts-hierarchy";
import { Whierarchy } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = {
  name: "根节点",
  children: [
    {
      name: "子节点A",
      children: [
        { name: "A-1", value: 50 },
        { name: "A-2", value: 30 },
      ],
    },
    {
      name: "子节点B",
      children: [
        { name: "B-1", value: 40 },
        { name: "B-2", value: 20 },
        { name: "B-3", value: 60 },
      ],
    },
    { name: "子节点C", value: 80 },
  ],
};

const cases = [
  { name: "基础层级图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWhierarchyModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Hierarchy 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Whierarchy}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-hierarchy"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
