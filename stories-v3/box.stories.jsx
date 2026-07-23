/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-box，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWboxModel } from "@alicloud/cloud-charts-box";
import { Wbox } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "延迟",
    data: [
      ["Q1", [10, 25, 40, 55, 80]],
      ["Q2", [15, 30, 45, 60, 90]],
      ["Q3", [5, 20, 35, 50, 70]],
      ["Q4", [20, 35, 50, 65, 95]],
    ],
  },
];

const cases = [
  { name: "基础箱线图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWboxModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Box 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wbox}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-box"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
