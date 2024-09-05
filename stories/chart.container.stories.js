import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';

import { Wlistcontainer } from '@alicloud/cloud-charts';

const stories = storiesOf('Wlistcontainer', module);

const svgIcon = (
  <svg viewBox="0 0 1024 1024" width="24" height="24">
    <path
      d="M526.797 37.594c-58.295 0-105.567 44.59-105.567 99.576 0 141.815 105.567 346.262 105.567 346.262S632.364 278.025 632.364 137.17c0-54.985-47.272-99.576-105.6-99.576M166.003 363.895C272.265 451.454 490.648 494.82 490.648 494.82s-88.75-209.71-194.317-296.673c-41.214-33.964-103.78-24.397-139.796 21.352-35.983 45.782-31.78 110.433 9.468 144.397m630.19-117.749c8.607-6.687 17.91-8.11 24.232-8.11 16.32 0 32.607 8.772 43.53 23.503 17.678 23.802 16.056 55.614-3.607 70.941-51.145 39.823-133.341 68.789-199.813 87.327 36.844-63.03 86.367-135.294 135.658-173.66m95.338 128.275c42.34-32.938 48.331-97.788 13.407-144.794-21.451-28.867-53.297-44.293-84.513-44.293-19.664 0-39.062 6.091-55.382 18.836C655.868 289.148 561.72 496.806 561.72 496.806s221.396-38.003 329.81-122.384m24.132 135.923c-131.553-31.448-344.606 25.887-344.606 25.887s167.205 148.071 297.831 179.255c51.046 12.182 102.886-23.835 115.763-80.508 12.91-56.673-17.975-112.485-68.988-124.667m-373.837 48.265s-6.488 233.71 54.488 361.092c23.835 49.788 85.904 68.657 138.638 42.207 52.734-26.45 76.138-88.22 52.336-138.008-61.407-128.243-245.462-265.291-245.462-265.291M266.571 823.404c-23.371 49.854 0.53 111.327 53.363 137.28 52.866 25.953 114.67 6.555 138.041-43.3 60.248-128.573 51.41-360.926 51.41-360.926S326.389 695.724 266.57 823.404M135.084 503.923c-53.462 12.48-86.069 70.742-72.827 130.096 13.24 59.388 67.299 97.358 120.76 84.878 137.844-32.21 312.597-186.108 312.597-186.108s-223.647-60.844-360.497-28.866"
      p-id="8933"
    ></path>
  </svg>
);

const testData_1 = [
  {
    label: 'ECS',
    value: 23,
  },
  {
    label: 'EIP',
    value: 45,
  },
  {
    label: 'GDB',
    value: 12,
  },
  {
    label: 'HBASE',
    value: 2,
  },
  {
    label: 'NAS',
    value: 234,
  },
];

const testData_2 = testData_1.map((el) => {
  return {
    ...el,
    icon: svgIcon,
    unit: '个',
  };
});

const testData_5 = [
  {
    label: 'ECS',
    value: 23,
    // unit:"个",
    // status:"success",
    valueTags: [
      {
        text: '正常',
        status: 'normal',
      },
    ],
  },
  {
    label: 'EIP',
    value: 45,
    valueTags: [
      {
        text: '告警',
        status: 'warning',
      },
    ],
  },
  {
    label: 'GDB',
    value: 12,
    valueTags: [
      {
        text: '错误',
        status: 'error',
      },
    ],
  },
];

const testData_6 = [
  {
    label: 'ECS',
    value: 23,
    // itemStyle: {
    //   width: 200,
    // },
    chart: {
      type: 'Wline',
      data: [
        {
          name: '测试数据',
          data: [
            [10, 20],
            [34, 67],
            [45, 12],
            [66, 32],
            [90, 3],
          ],
        },
      ],
      config: {
        area: true,
      },
    },
  },
  {
    label: 'EIP',
    value: 45,
    // itemStyle: {
    //   width: 200,
    // },
    chart: {
      type: 'Wcircle',
      data: 0.45,
      position: 'right',
    },
  },
  {
    label: 'GDB',
    value: 2,
    // itemStyle: {
    //   width: 200,
    // },
    chart: {
      type: 'Wcircle',
      data: 0.45,
      position: 'right',
    },
  },
];

stories.add('指标卡（基本版）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={testData_1} />
  </div>
));

stories.add('指标卡（带icon）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={testData_2} />
  </div>
));

stories.add('指标卡（带chart）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={testData_6} />
  </div>
));

const status_data = [
  {
    label: 'ECS',
    value: 23,
    chart: {
      type: 'Wline',
      position: 'center',
      data: [
        {
          name: '测试数据',
          data: [
            [10, 20],
            [34, 67],
            [45, 12],
            [66, 32],
            [90, 3],
          ],
        },
      ],
      config: {
        area: true,
        colors: ['success'],
      },
    },
  },
  {
    label: 'SLB',
    value: 45,
    chart: {
      type: 'Wline',
      position: 'center',
      data: [
        {
          name: '测试数据',
          data: [
            [1483372800000, 4],
            [1483459200000, 3.5],
            [1483545600000, 5],
            [1483632000000, 4.9],
            [1483718400000, 6],
            [1483804800000, 7],
            [1483891200000, 9],
          ],
        },
      ],
      config: {
        area: true,
        colors: ['warning'],
      },
    },
  },
  {
    label: 'OSS',
    value: 1234000,
    chart: {
      type: 'Wline',
      position: 'center',
      data: [
        {
          name: '测试数据',
          data: [
            [1483372800000, 67],
            [1483459200000, 3.5],
            [1483545600000, 34],
            [1483632000000, 87],
            [1483718400000, 60],
            [1483804800000, 17],
            [1483891200000, 9],
          ],
        },
      ],
      config: {
        area: true,
        colors: ['error'],
      },
    },
  },
  {
    label: 'K8S',
    value: 432.54354,
    chart: {
      type: 'Wline',
      position: 'center',
      data: [
        {
          name: '测试数据',
          data: [
            [1483372800000, 6],
            [1483459200000, 35],
            [1483545600000, 340],
            [1483632000000, 8],
            [1483718400000, 36],
            [1483804800000, 7],
            [1483891200000, 59],
          ],
        },
      ],
      config: {
        area: true,
        // colors: ['normal'],
      },
    },
  },
];

stories.add('指标卡（大盘）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={status_data} backgroundType="none" showDivider={false} />
  </div>
));

const gauge_data = [
  {
    data: {
      current: 77,
    },
  },
  {
    data: {
      current: 34,
    },
  },
  {
    data: {
      current: 50,
    },
  },
  {
    data: {
      current: 9,
    },
  },
];

const gauge_data2 = [
  {
    data: {
      current: 77,
    },
    config: {
      gaugeScale: {
        scaleNum: 5,
        scale: true,
      },
    },
  },
  {
    data: {
      current: 34,
    },
    config: {
      gaugeScale: {
        scaleNum: 5,
        scale: true,
      },
      angle: {
        start: -210,
        end: 30,
      },
    },
  },
  {
    data: {
      current: 50,
    },
    config: {
      outRing: true,
      percentage: true,
      angle: {
        start: -210,
        end: 30,
      },
      gaugeScale: {
        scaleNum: 9,
        scale: true,
      },
    },
  },
  {
    data: {
      current: 9,
    },
    config: {
      outRing: true,
    },
  },
];

stories.add('仪表盘', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wgauge" data={gauge_data} config={{}} />
  </div>
));

stories.add('仪表盘（不同配置项）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wgauge" data={gauge_data2} />
  </div>
));

stories.add('指标卡（fullSize）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={testData_1} fullSize />
  </div>
));

stories.add('指标卡（大盘fullSize）', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wnumbercard" data={status_data} fullSize backgroundType="none" showDivider={false} />
  </div>
));

stories.add('仪表盘(fullSize)', () => (
  <div style={{ width: '100%', height: 400 }}>
    <Wlistcontainer chart="Wgauge" data={gauge_data} config={{}} fullSize />
  </div>
));
