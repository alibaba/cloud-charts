/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-linebar，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWlinebarModel } from "@alicloud/cloud-charts-linebar";
import { Wlinebar } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "机房A",
    type: "bar",
    data: [
      ["周一", 4092], ["周二", 1592], ["周三", 3714],
      ["周四", 4854], ["周五", 6514], ["周六", 9022], ["周日", 6023],
    ],
  },
  {
    name: "趋势",
    type: "line",
    data: [
      ["周一", 5000], ["周二", 3000], ["周三", 4500],
      ["周四", 5500], ["周五", 7500], ["周六", 10000], ["周日", 7000],
    ],
  },
];

const cases = [
  { name: "基础线柱混合", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWlinebarModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/LineBar 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wlinebar}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-linebar"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
