/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-linescatter，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWlinescatterModel } from "@alicloud/cloud-charts-linescatter";
import { Wlinescatter } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "流量",
    data: [
      ["周一", 3800], ["周二", 2000], ["周三", 4000],
      ["周四", 5200], ["周五", 6000], ["周六", 8500], ["周日", 6500],
    ],
  },
];

const cases = [
  { name: "线散点混合", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWlinescatterModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/LineScatter 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wlinescatter}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-linescatter"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
