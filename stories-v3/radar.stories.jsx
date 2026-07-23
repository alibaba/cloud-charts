/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-radar，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWradarModel } from "@alicloud/cloud-charts-radar";
import { Wradar } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "机房A",
    data: [
      ["CPU", 70], ["内存", 85], ["磁盘", 60], ["网络", 90], ["负载", 55],
    ],
  },
  {
    name: "机房B",
    data: [
      ["CPU", 45], ["内存", 60], ["磁盘", 80], ["网络", 65], ["负载", 75],
    ],
  },
];

const cases = [
  { name: "基础雷达图", config: {} },
  { name: "面积雷达图", config: { area: true } },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWradarModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Radar 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wradar}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-radar"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
