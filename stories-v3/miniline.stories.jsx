/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-miniline，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWminilineModel } from "@alicloud/cloud-charts-miniline";
import { Wminiline } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "CPU",
    data: [
      [1, 20], [2, 35], [3, 28], [4, 45], [5, 40],
      [6, 55], [7, 50], [8, 60], [9, 52], [10, 48],
    ],
  },
];

const cases = [
  { name: "基础迷你折线", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWminilineModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Miniline 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wminiline}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-miniline"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
        height={80}
      />
    );
  });
});
