/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-sunburst，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWsunburstModel } from "@alicloud/cloud-charts-sunburst";
import { Wsunburst } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = {
  name: "根",
  children: [
    {
      name: "分类A",
      children: [
        { name: "A-1", value: 100 },
        { name: "A-2", value: 80 },
        { name: "A-3", value: 60 },
      ],
    },
    {
      name: "分类B",
      children: [
        { name: "B-1", value: 120 },
        { name: "B-2", value: 50 },
      ],
    },
    {
      name: "分类C",
      children: [
        { name: "C-1", value: 90 },
        { name: "C-2", value: 70 },
        { name: "C-3", value: 40 },
        { name: "C-4", value: 30 },
      ],
    },
  ],
};

const cases = [
  { name: "基础旭日图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWsunburstModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Sunburst 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wsunburst}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-sunburst"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
