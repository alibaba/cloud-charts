/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-nightingale，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWnightingaleModel } from "@alicloud/cloud-charts-nightingale";
import { Wnightingale } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "时段",
    data: [
      ["00:00", 120], ["03:00", 40], ["06:00", 80],
      ["09:00", 300], ["12:00", 450], ["15:00", 380],
      ["18:00", 500], ["21:00", 260],
    ],
  },
];

const cases = [
  { name: "基础玫瑰图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWnightingaleModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Nightingale 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wnightingale}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-nightingale"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
