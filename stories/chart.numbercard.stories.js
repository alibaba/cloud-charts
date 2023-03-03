import React from 'react';

import { storiesOf } from '@storybook/react';

import { Wnumbercard, Wnumberoverview } from '@alife/aisc-widgets';

const stories = storiesOf('Wnumbercard', module);

stories.add('指标卡片基础用法', () => (
  <Wnumbercard
    label="测试数据"
    value={100}
    //labelTooltip="测试数据tooltip"
    unit="%"
    //status="success"
    itemStyle={{
      width: 250,
    }}
    // icon={<TwoToneIcon type="cloud" size="xl" color="#5a5a5a" />}
  />
));

stories.add('带数值趋势的指标卡片', () => (
  <>
    <Wnumbercard
      label="测试数据"
      value={673242}
      unit="个"
      status="success"
      itemStyle={{
        width: 250,
      }}
      trend={34.5}
    />
    <Wnumbercard
      label="测试数据"
      value={673242}
      unit="个"
      status="success"
      itemStyle={{
        width: 250,
      }}
      trend={-34.5}
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
