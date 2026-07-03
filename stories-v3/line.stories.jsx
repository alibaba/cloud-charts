/* eslint-disable */
// v3 链路 stories：通过 vanilla API 在 iframe 中渲染新架构图表，验证 @alicloud/cloud-charts-line 包可用。
// 启动方式：在 examples/cloud-charts-wline-vanilla-demo 跑 `npm run dev`，然后访问对应端口。
// 此处仅作 Storybook 元数据登记。

import React from 'react';

const VANILLA_DEMO_URL = 'http://localhost:5179';

export default {
  title: 'Wline/v3',
  parameters: {
    docs: {
      description: {
        component:
          '通过 @alicloud/cloud-charts-line（基于 G2 v5.4.8 + @alicloud/cloud-charts-core 运行时模型）渲染的折线图。' +
          '请先启动 `examples/cloud-charts-wline-vanilla-demo` 的 vite dev server，本故事通过 iframe 内嵌该 demo。',
      },
    },
  },
};

export const Vanilla折线图 = () => (
  <iframe
    src={VANILLA_DEMO_URL}
    title="@alicloud/cloud-charts-line vanilla demo"
    style={{ width: '100%', height: 600, border: '1px solid #ddd' }}
  />
);