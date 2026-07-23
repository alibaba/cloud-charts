/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-hexagonal，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWhexagonalModel } from "@alicloud/cloud-charts-hexagonal";
import { Whexagonal } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "蜂窝",
    data: [
      [0.1, 0.2, 5], [0.3, 0.5, 12], [0.6, 0.8, 8],
      [0.2, 0.7, 15], [0.8, 0.3, 6], [0.5, 0.5, 20],
      [0.9, 0.9, 10], [0.4, 0.1, 3], [0.7, 0.6, 18],
    ],
  },
];

const cases = [
  { name: "基础蜂窝图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWhexagonalModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Hexagonal 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Whexagonal}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-hexagonal"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
