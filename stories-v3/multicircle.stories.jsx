/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-multicircle，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWmulticircleModel } from "@alicloud/cloud-charts-multicircle";
import { Wmulticircle } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "多环",
    data: [
      ["CPU", 75],
      ["内存", 60],
      ["磁盘", 88],
    ],
  },
];

const cases = [
  { name: "基础多环图", config: {} },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWmulticircleModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/MultiCircle 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wmulticircle}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-multicircle"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
