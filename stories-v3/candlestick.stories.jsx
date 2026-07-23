/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-candlestick，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWcandlestickModel } from "@alicloud/cloud-charts-candlestick";
import { Wcandlestick } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "K线",
    data: [
      ["2024-01-02", [100, 110, 95, 108]],
      ["2024-01-03", [108, 115, 105, 112]],
      ["2024-01-04", [112, 118, 109, 116]],
      ["2024-01-05", [116, 120, 110, 113]],
      ["2024-01-06", [113, 117, 108, 115]],
      ["2024-01-07", [115, 122, 112, 120]],
      ["2024-01-08", [120, 125, 118, 123]],
    ],
  },
];

const cases = [
  { name: "基础K线图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWcandlestickModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Candlestick 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wcandlestick}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-candlestick"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
