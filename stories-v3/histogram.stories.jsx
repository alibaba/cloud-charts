/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-histogram，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWhistogramModel } from "@alicloud/cloud-charts-histogram";
import { Whistogram } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "响应时间",
    data: [
      ["0-100", 150], ["100-200", 320], ["200-300", 280],
      ["300-400", 190], ["400-500", 120], ["500-600", 60],
      ["600-700", 30], ["700-800", 10],
    ],
  },
];

const cases = [
  { name: "基础直方图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWhistogramModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Histogram 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Whistogram}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-histogram"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
