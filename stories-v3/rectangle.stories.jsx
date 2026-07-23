/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-rectangle，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWrectangleModel } from "@alicloud/cloud-charts-rectangle";
import { Wrectangle } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "利用率",
    data: [
      ["服务A", 85],
      ["服务B", 60],
      ["服务C", 92],
      ["服务D", 45],
      ["服务E", 78],
    ],
  },
];

const cases = [
  { name: "基础色块图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWrectangleModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Rectangle 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wrectangle}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-rectangle"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
