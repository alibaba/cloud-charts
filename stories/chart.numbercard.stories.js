import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wnumbercard, Wnumberoverview, Wcontainer } from '@alife/aisc-widgets';

const stories = storiesOf('Wnumbercard', module);

const svgIcon = (
  <svg viewBox="0 0 1024 1024" width="24" height="24">
    <path
      d="M526.797 37.594c-58.295 0-105.567 44.59-105.567 99.576 0 141.815 105.567 346.262 105.567 346.262S632.364 278.025 632.364 137.17c0-54.985-47.272-99.576-105.6-99.576M166.003 363.895C272.265 451.454 490.648 494.82 490.648 494.82s-88.75-209.71-194.317-296.673c-41.214-33.964-103.78-24.397-139.796 21.352-35.983 45.782-31.78 110.433 9.468 144.397m630.19-117.749c8.607-6.687 17.91-8.11 24.232-8.11 16.32 0 32.607 8.772 43.53 23.503 17.678 23.802 16.056 55.614-3.607 70.941-51.145 39.823-133.341 68.789-199.813 87.327 36.844-63.03 86.367-135.294 135.658-173.66m95.338 128.275c42.34-32.938 48.331-97.788 13.407-144.794-21.451-28.867-53.297-44.293-84.513-44.293-19.664 0-39.062 6.091-55.382 18.836C655.868 289.148 561.72 496.806 561.72 496.806s221.396-38.003 329.81-122.384m24.132 135.923c-131.553-31.448-344.606 25.887-344.606 25.887s167.205 148.071 297.831 179.255c51.046 12.182 102.886-23.835 115.763-80.508 12.91-56.673-17.975-112.485-68.988-124.667m-373.837 48.265s-6.488 233.71 54.488 361.092c23.835 49.788 85.904 68.657 138.638 42.207 52.734-26.45 76.138-88.22 52.336-138.008-61.407-128.243-245.462-265.291-245.462-265.291M266.571 823.404c-23.371 49.854 0.53 111.327 53.363 137.28 52.866 25.953 114.67 6.555 138.041-43.3 60.248-128.573 51.41-360.926 51.41-360.926S326.389 695.724 266.57 823.404M135.084 503.923c-53.462 12.48-86.069 70.742-72.827 130.096 13.24 59.388 67.299 97.358 120.76 84.878 137.844-32.21 312.597-186.108 312.597-186.108s-223.647-60.844-360.497-28.866"
      p-id="8933"
    ></path>
  </svg>
);

stories.add('指标卡片基础用法', () => (
  <div>
    <Wnumbercard
      label="默认透明卡片"
      value={100}
      unit="%"
      //status="success"
      // itemStyle={{
      //   width: 250,
      // }}
      // icon={<TwoToneIcon type="cloud" size="xl" color="#5a5a5a" />}
    />
    <Wnumbercard
      label="灰色卡片"
      value={100}
      backgroundType="fill"
      //labelTooltip="测试数据tooltip"
      unit="%"
      //status="success"
      //iconPosition="right"
      icon={svgIcon}
    />
    <Wnumbercard
      label="背景图片卡片"
      value={100}
      unit="%"
      backgroundType="image"
      backgroundImage="url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)"
      itemStyle={{
        width: 320,
      }}
    />
  </div>
));

stories.add('label超过宽度显示tooltip', () => (
  <Wnumbercard
    label="测试数据懂法守法打开iUSA分个大吉手机打萨法手打"
    value={100}
    unit="%"
    status="success"
    itemStyle={{
      width: 250,
    }}
  />
));

stories.add('带tag的指标卡片', () => (
  <>
    <Wnumbercard
      label="单个tag"
      value={673242}
      unit="个"
      status="success"
      tags={[
        {
          text: 'tag1',
          status: 'success',
        },
      ]}
    />
    <Wnumbercard
      label="多个tag"
      value={673242}
      unit="个"
      status="success"
      tags={[
        {
          text: 'aaabbb',
          status: 'warning',
        },
        {
          text: 'testtest',
          status: 'p1',
        },
        {
          text: 'default',
        },
      ]}
    />
    <Wnumbercard
      label="限制tag个数"
      value={673242}
      unit="个"
      status="success"
      tagMaxNumber={2}
      tags={[
        {
          text: 'aaabbb',
          status: 'warning',
        },
        {
          text: 'testtest',
          status: 'p1',
        },
        {
          text: 'default',
        },
      ]}
    />
    <Wnumbercard
      label="带趋势"
      value={673242}
      unit="个"
      status="success"
      tags={[
        {
          text: '45.6%',
          status: 'success',
          trend: 'up',
        },
        {
          text: '2.4%',
          status: 'p4',
          trend: 'down',
        },
      ]}
    />
    <Wnumbercard
      label="超出截断"
      value={673242}
      unit="个"
      status="success"
      itemStyle={{
        width: 200,
      }}
      tags={[
        {
          text: 'aaabbb',
          status: 'warning',
        },
        {
          text: 'testtest',
          status: 'p1',
        },
        {
          text: 'default',
        },
      ]}
    />
  </>
));

stories.add('带线图的指标卡片', () => (
  <Wnumbercard
    label="测试数据"
    value={100}
    unit="%"
    status="success"
    itemStyle={{
      width: 250,
    }}
    chart={{
      type: 'line',
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
    }}
  />
));

stories.add('带复杂线图的指标卡片', () => (
  <Wnumbercard
    label="测试数据"
    value={100}
    unit="%"
    status="success"
    itemStyle={{
      height: 300,
      width: 300,
    }}
    chart={{
      type: 'line',
      height: 200,
      position: 'bottom',
      data: [
        {
          name: '机房A',
          data: [
            [1483372800000, 4092],
            [1483459200000, 1592],
            [1483545600000, 3714],
            [1483632000000, 4854],
            [1483718400000, 6514],
            [1483804800000, 9022],
            [1483891200000, 6023],
            [1483977600000, 4018],
          ],
        },
      ],
      config: {
        xAxis: {
          type: 'time',
          mask: 'MM-DD',
        },
        area: true,
        symbol: true,
        tooltip: true,
      },
    }}
  />
));

stories.add('带圆环的指标卡片', () => (
  <Wnumbercard
    label="测试数据"
    value={45}
    unit="%"
    status="success"
    itemStyle={{
      width: 250,
    }}
    chart={{
      type: 'circle',
      data: 0.45,
      position: 'right',
      config: {
        // status: 'normal'
      },
    }}
  />
));

const testData = [
  {
    label: 'ECS',
    value: 23,
    icon: {
      type: 'ecs',
    },
  },
  {
    label: 'EIP',
    value: 45,
    icon: {
      type: 'eip',
    },
  },
  {
    label: 'GDB',
    value: 12,
    icon: {
      type: 'gdb',
    },
  },
  {
    label: 'HBASE',
    value: 2,
    icon: {
      type: 'hbase',
    },
  },
  {
    label: 'NAS',
    value: 234,
    icon: {
      type: 'nas',
    },
  },
  {
    label: 'ECS',
    value: 2,
    icon: {
      type: 'ecs',
    },
  },
  {
    label: 'EIP',
    value: 459,
    icon: {
      type: 'eip',
    },
  },
  {
    label: 'GDB',
    value: 122,
    icon: {
      type: 'gdb',
    },
  },
  {
    label: 'HBASE',
    value: 89,
    icon: {
      type: 'hbase',
    },
  },
  {
    label: 'NAS',
    value: 234,
    icon: {
      type: 'nas',
    },
  },
  {
    label: 'GDB',
    value: 122,
    icon: {
      type: 'gdb',
    },
  },
  {
    label: 'HBASE',
    value: 89,
    icon: {
      type: 'hbase',
    },
  },
];

stories.add('数据卡片概览', () => (
  <div>
    <Wnumberoverview data={testData} />
  </div>
));

stories.add('带分割线的数据卡片概览', () => (
  <div>
    <Wnumberoverview data={testData} showDivider />
  </div>
));

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
];

const testData_2 = [
  {
    label: 'ECS',
    value: 23,
    unit: '个',
    tags: [
      {
        text: '正常',
        status: 'success',
      },
    ],
    backgroundType: 'image',
    backgroundImage:
      'url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)',
  },
  {
    label: 'EIP',
    value: 45,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)',
  },
  {
    label: 'GDB',
    value: 12,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)',
  },
  {
    label: 'HBASE',
    value: 2,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)',
  },
  {
    label: 'NAS',
    value: 234,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'url(https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png)',
  },
];

const testData_3 = [
  {
    label: 'ECS',
    value: 23,
    icon: svgIcon,
  },
  {
    label: 'EIP',
    value: 45,
    icon: svgIcon,
  },
  {
    label: 'GDB',
    value: 12,
    icon: svgIcon,
  },
];

const testData_4 = [
  {
    label: 'ECS',
    value: 23,
    // backgroundType:"fill",
    status: 'success',
  },
  {
    label: 'EIP',
    value: 45,
    // backgroundType:"fill",
    status: 'warning',
  },
  {
    label: 'GDB',
    value: 12,
    // backgroundType:"fill",
    status: 'error',
  },
];

const testData_5 = [
  {
    label: 'ECS',
    value: 23,
    // unit:"个",
    // status:"success",
    tags: [
      {
        text: '正常',
        status: 'success',
      },
    ],
  },
  {
    label: 'EIP',
    value: 45,
    tags: [
      {
        text: '告警',
        status: 'warning',
      },
    ],
  },
  {
    label: 'GDB',
    value: 12,
    tags: [
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
    itemStyle: {
      width: 200,
    },
    chart: {
      type: 'line',
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
    itemStyle: {
      width: 200,
    },
    chart: {
      type: 'circle',
      data: 0.45,
      position: 'right',
      config: {
        // status: 'normal'
      },
    },
  },
];

stories.add('数据卡片 - 业务场景', () => (
  <>
    <Wcontainer className="demos" title="标题+数字">
      {/* 白底为默认值的话showDivider也默认开启 */}
      <Wnumberoverview data={testData_1} showDivider />
    </Wcontainer>
    <Wcontainer className="demos" title="标题+数字+单位+ICON">
      <Wnumberoverview data={testData_3} showDivider />
    </Wcontainer>
    <Wcontainer className="demos" title="标题+数字+单位+背景">
      <Wnumberoverview data={testData_2} />
    </Wcontainer>
    <Wcontainer className="demos" title="标题+数字+状态">
      <Wnumberoverview data={testData_4} showDivider />
    </Wcontainer>
    <Wcontainer className="demos" title="标题+数字+Tag">
      <Wnumberoverview data={testData_5} showDivider />
    </Wcontainer>
    <Wcontainer className="demos" title="标题+数字+miniChart">
      <Wnumberoverview data={testData_6} />
    </Wcontainer>
  </>
));
