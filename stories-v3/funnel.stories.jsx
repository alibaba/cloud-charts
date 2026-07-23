/* eslint-disable */
// v3 链路验收 stories：新 vanilla 包（@alicloud/cloud-charts-funnel，G2 v5）与旧 React 组件（G2 v4）双列对比。
// 启动：npm run storybook:v3（端口 6007）

import React from "react";
import { storiesOf } from "@storybook/react";
import { renderWfunnelModel } from "@alicloud/cloud-charts-funnel";
import { Wfunnel } from "@alicloud/cloud-charts";
import { CompareTwoCols } from "./_helpers/CompareTwoCols";

const data = [
  {
    name: "漏斗",
    data: [
      ["浏览页面", 50000],
      ["放入购物车", 35000],
      ["生成订单", 25000],
      ["支付完成", 15000],
      ["完成交易", 8000],
    ],
  },
];

const cases = [
  { name: "基础漏斗图", config: {} },
  { name: "对比漏斗", config: { align: "center" } },
];

const renderVanilla = (container, { themeName, language, config, chartData }) =>
  renderWfunnelModel({
    container,
    data: chartData,
    config,
    context: { theme: themeName, language },
  });

const stories = storiesOf("v3/Funnel 新旧对比", module);
cases.forEach((item) => {
  stories.add(item.name, (_args, context) => {
    const themeName = context?.globals?.theme || "normal";
    return (
      <CompareTwoCols
        OldComponent={Wfunnel}
        data={data}
        config={item.config}
        themeName={themeName}
        newPackageLabel="@alicloud/cloud-charts-funnel"
        renderVanilla={(container, opts) =>
          renderVanilla(container, { ...opts, config: item.config, chartData: data })
        }
      />
    );
  });
});
