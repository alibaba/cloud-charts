/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-linebox，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWlineboxModel } from "@alicloud/cloud-charts-linebox";
import { Wlinebox } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "趋势",
    type: "line",
    data: [
      ["Q1", 200], ["Q2", 350], ["Q3", 300], ["Q4", 450],
    ],
  },
  {
    name: "范围",
    type: "box",
    data: [
      ["Q1", [100, 150, 200, 250, 300]],
      ["Q2", [200, 280, 350, 400, 500]],
      ["Q3", [150, 220, 300, 370, 450]],
      ["Q4", [250, 350, 450, 520, 600]],
    ],
  },
];

const cases = [
  { name: "线箱混合图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWlineboxModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Linebox 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wlinebox}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-linebox"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
