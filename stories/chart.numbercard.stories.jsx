import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';

import { Wnumbercard, Wnumberoverview, Wcontainer } from '@alicloud/cloud-charts';

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
      data={{
        label: 'test',
        value: 234,
      }}
      config={{
        status: 'error',
      }}
      label="默认透明卡片"
      value={100}
      unit="%"
      status="success"
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
      backgroundImage="https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png"
      itemStyle={{
        width: 320,
      }}
    />
  </div>
));

stories.add('label超过宽度显示tooltip', () => (
  <Wnumbercard
    label="测试数据懂法守法打开iUSA分个大吉手机打萨法手打"
    value={1004879653148368446452435646}
    unit="%"
    status="success"
    itemStyle={{
      width: 250,
    }}
    labelTags={[
      {
        text: '政',
        status: 'warning',
      },
      {
        text: '企',
        status: 'p1',
      },
    ]}
  />
));

stories.add('带tag的指标卡片', () => (
  <>
    <Wnumbercard
      label="单个tag"
      value={673242}
      unit="个"
      status="success"
      valueTags={[
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
      valueTags={[
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
      label="label tag"
      value={673242}
      unit="个"
      status="success"
      labelTags={[
        {
          text: '政',
          status: 'warning',
        },
        {
          text: '企',
          status: 'p1',
        },
      ]}
    />
    <Wnumbercard
      label="带趋势"
      value={673242}
      unit="个"
      status="success"
      valueTags={[
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
      label="超出滚动"
      value={673242}
      unit="个"
      status="success"
      itemStyle={{
        width: 200,
      }}
      valueTags={[
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

const smallIcon = (
  <svg viewBox="0 0 1024 1024" width="16" height="16">
    <path d="M512 113.777778a398.222222 398.222222 0 0 1 398.222222 398.222222 398.222222 398.222222 0 0 1-398.222222 398.222222 398.222222 398.222222 0 0 1-398.222222-398.222222 398.222222 398.222222 0 0 1 398.222222-398.222222z m241.948444 640.170666A340.650667 340.650667 0 0 0 854.243556 512c0-46.193778-9.045333-91.022222-26.908445-133.233778a342.584889 342.584889 0 0 0-182.158222-182.158222A340.195556 340.195556 0 0 0 512 169.756444c-46.193778 0-91.022222 9.045333-133.233778 26.908445A342.584889 342.584889 0 0 0 196.608 378.88 340.195556 340.195556 0 0 0 169.756444 512c0 46.193778 9.045333 91.022222 26.908445 133.233778a342.584889 342.584889 0 0 0 182.158222 182.158222A340.195556 340.195556 0 0 0 512 854.243556c46.193778 0 91.022222-9.045333 133.12-26.908445a340.423111 340.423111 0 0 0 108.828444-73.386667z m-170.154666-72.817777c0-39.537778-32.199111-71.736889-71.793778-71.736889-39.594667 0-71.793778 32.199111-71.793778 71.793778h-55.978666A127.943111 127.943111 0 0 1 512 553.358222a127.943111 127.943111 0 0 1 127.772444 127.829334h-55.978666zM264.817778 411.249778a46.648889 46.648889 0 1 1 93.297778 0 46.648889 46.648889 0 0 1-93.297778 0z m400.782222 0a46.648889 46.648889 0 1 1 93.297778 0 46.648889 46.648889 0 0 1-93.297778 0z"></path>
  </svg>
);

const mediumIcon = (
  <svg viewBox="0 0 1024 1024" width="32" height="32">
    <path d="M1024 512c0-76.8-61.952-147.456-173.056-196.096 10.752-119.296-19.456-208.896-82.944-247.296-23.552-12.8-47.104-21.504-76.8-21.504-55.296 2.048-117.248 27.648-179.2 72.704C448 72.704 386.048 49.152 332.8 49.152c-27.648 0-53.248 6.144-76.8 18.944-64 38.4-93.696 125.952-82.944 247.296C61.952 364.544 0 435.2 0 512s61.952 147.456 173.056 196.096c-10.752 119.296 19.456 208.896 82.944 247.296 23.552 12.8 47.104 21.504 76.8 21.504 53.248 0 115.2-23.552 179.2-70.656 64 47.104 125.952 70.656 179.2 70.656 27.648 0 53.248-6.144 76.8-19.456 64-38.4 93.696-128 82.944-247.296 111.104-51.2 173.056-121.344 173.056-198.144z m-61.952 0c0 45.056-42.496 91.648-117.248 130.048h-2.048c-8.704-42.496-23.552-87.552-40.448-132.096 16.896-42.496 31.744-87.552 40.448-132.096h2.048c74.752 40.448 117.248 89.088 117.248 134.144z m-407.552 82.944c14.848-10.752 27.648-29.696 34.304-53.248 8.704-6.656 14.848-14.848 14.848-25.6v-23.552c0-8.704-2.048-16.896-8.704-21.504-2.048-25.6-12.8-87.552-82.944-87.552S431.104 443.904 429.056 469.504c-6.144 4.096-8.704 12.8-8.704 21.504v23.552c0 10.752 4.096 23.552 14.848 29.696 6.144 21.504 19.456 40.448 34.304 53.248v4.096c0 2.048 0 6.656-2.048 8.704-29.696 6.656-74.752 25.6-100.352 51.2-10.752-14.848-19.456-29.696-29.696-47.104-19.456-34.304-36.352-66.048-49.152-98.304 14.848-34.304 29.696-66.048 49.152-100.352 14.848-25.6 31.744-51.2 49.152-76.8l10.752-16.896c36.352-4.096 72.704-6.144 109.056-6.144 38.4 0 76.8 2.048 108.544 6.144 21.504 25.6 40.448 55.296 61.952 93.696 19.456 34.304 36.352 66.048 49.152 98.304-14.848 34.304-29.696 66.048-49.152 98.304l-2.048 2.048c-2.048 12.8-10.752 25.6-21.504 42.496-25.6-23.552-70.656-42.496-100.352-51.2 0-2.048-2.048-4.096-2.048-8.704v-2.048h3.584z m202.752-179.2c-6.144-12.8-12.8-23.552-19.456-36.352-8.704-14.848-16.896-29.696-27.648-44.544 25.6 6.144 49.152 12.8 70.656 19.456-4.096 25.6-10.752 51.2-16.896 74.752-2.048-2.56-4.608-6.656-6.656-13.312zM313.856 334.848c-10.752 14.848-19.456 31.744-27.648 47.104-6.144 10.752-12.8 23.552-19.456 36.352l-6.144 12.8c-6.144-23.552-12.8-49.152-16.896-74.752 23.04-8.704 46.592-17.408 70.144-21.504z m-47.104 270.848c6.144 12.8 12.8 23.552 19.456 36.352 8.704 14.848 16.896 29.696 27.648 45.056-25.6-6.144-49.152-12.8-70.656-19.456 4.096-25.6 10.752-51.2 16.896-74.752l6.656 12.8z m443.904 83.456l12.8-19.456c4.096-8.704 10.752-16.896 16.896-25.6 6.656-10.752 12.8-23.552 19.456-36.352 2.048-4.096 4.096-8.704 6.656-14.848 8.704 25.6 14.848 49.152 16.896 74.752-26.112 8.704-49.664 17.408-72.704 21.504z m78.848-396.8c-36.352-12.8-78.848-21.504-134.144-29.696-29.696-36.352-61.952-70.656-93.696-100.352 45.056-31.744 89.6-49.152 130.048-49.152 16.896 0 31.744 4.096 45.056 10.752 39.936 23.552 58.88 82.944 52.736 168.448z m-237.056-40.448c-12.8 0-25.6-2.048-40.448-2.048s-27.648 0-40.448 2.048h-12.8L512 198.656c19.456 16.896 36.352 34.304 53.248 53.248h-12.8z m-183.296 8.192C322.048 266.24 277.504 276.992 235.008 291.84v-2.048c-6.144-82.944 12.8-144.896 53.248-168.448 12.8-6.144 27.648-10.752 45.056-10.752 36.352 0 80.896 16.896 130.048 49.152-34.304 30.208-64.512 61.952-94.208 100.352z m-134.656 471.552c36.352 12.8 78.848 21.504 134.144 29.696 29.696 36.352 61.952 70.656 93.696 100.352-45.056 31.744-89.6 49.152-130.048 49.152-16.896 0-32.256-4.096-45.056-10.752-39.936-23.552-58.88-82.944-52.736-168.448z m315.904 40.448h14.848L512 825.344c-16.896-14.848-36.352-34.304-53.248-51.2 31.744 0 61.952 0 91.648-2.048z m104.448-8.192c47.104-6.656 91.648-16.896 134.144-31.744v2.048c6.656 82.944-12.8 144.896-53.248 168.448-12.8 6.656-27.648 10.752-45.056 10.752-36.352 0-80.896-16.896-130.048-49.152 34.816-30.208 64.512-61.952 94.208-100.352zM221.696 512c-16.896 42.496-31.744 87.552-40.448 132.096H179.2c-74.752-38.4-117.248-85.504-117.248-130.048S104.448 422.4 179.2 384h2.048c10.752 40.448 23.552 85.504 40.448 128z"></path>
  </svg>
);

const bigIcon = (
  <svg viewBox="0 0 1024 1024" width="128" height="128">
    <path d="M512 113.777778a398.222222 398.222222 0 0 1 398.222222 398.222222 398.222222 398.222222 0 0 1-398.222222 398.222222 398.222222 398.222222 0 0 1-398.222222-398.222222 398.222222 398.222222 0 0 1 398.222222-398.222222z m241.948444 640.170666A340.650667 340.650667 0 0 0 854.243556 512c0-46.193778-9.045333-91.022222-26.908445-133.233778a342.584889 342.584889 0 0 0-182.158222-182.158222A340.195556 340.195556 0 0 0 512 169.756444c-46.193778 0-91.022222 9.045333-133.233778 26.908445A342.584889 342.584889 0 0 0 196.608 378.88 340.195556 340.195556 0 0 0 169.756444 512c0 46.193778 9.045333 91.022222 26.908445 133.233778a342.584889 342.584889 0 0 0 182.158222 182.158222A340.195556 340.195556 0 0 0 512 854.243556c46.193778 0 91.022222-9.045333 133.12-26.908445a340.423111 340.423111 0 0 0 108.828444-73.386667z m-170.154666-72.817777c0-39.537778-32.199111-71.736889-71.793778-71.736889-39.594667 0-71.793778 32.199111-71.793778 71.793778h-55.978666A127.943111 127.943111 0 0 1 512 553.358222a127.943111 127.943111 0 0 1 127.772444 127.829334h-55.978666zM264.817778 411.249778a46.648889 46.648889 0 1 1 93.297778 0 46.648889 46.648889 0 0 1-93.297778 0z m400.782222 0a46.648889 46.648889 0 1 1 93.297778 0 46.648889 46.648889 0 0 1-93.297778 0z"></path>
  </svg>
);

stories.add('带icon的指标卡片', () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Wnumbercard
      label="左右的icon建议用xl(32px)"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={mediumIcon}
      iconPosition={'left'}
    />
    <Wnumbercard
      label="左右的icon建议用xl(32px)"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={mediumIcon}
      iconPosition={'right'}
    />
    <Wnumbercard
      label="左上角的icon建议用small(16px)"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={smallIcon}
      iconPosition={'top-left'}
    />
    <Wnumbercard
      label="左右的icon大小会影响卡片大小"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={bigIcon}
      iconPosition={'left'}
    />
    <Wnumbercard
      label="左右的icon大小会影响卡片大小"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={bigIcon}
      iconPosition={'right'}
    />
    <Wnumbercard
      label="左上角的icon大小受限16px，会自动调整大小"
      value={673242}
      unit="个"
      backgroundType="fill"
      icon={bigIcon}
      iconPosition={'top-left'}
    />
  </div>
));

stories.add('带extra的指标卡片', () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Wnumbercard label="默认一直展示" value={100} unit="%" backgroundType="fill" extra={<button>test</button>} />
    <Wnumbercard
      label="hover展示"
      value={100}
      unit="%"
      backgroundType="fill"
      extra={<button>test</button>}
      extraTriggerType="hover"
    />
    <Wnumbercard
      label="hover展示"
      value={100}
      unit="%"
      backgroundType="fill"
      icon={smallIcon}
      iconPosition={'top-left'}
      extra={<button>test</button>}
      extraTriggerType="hover"
      labelTags={[
        {
          text: '政',
          status: 'warning',
        },
        {
          text: '企',
          status: 'p1',
        },
      ]}
    />
  </div>
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
    }}
  />
));

stories.add('以线图为背景的卡片', () => (
  <Wnumbercard
    label="测试数据"
    value={10034352}
    unit="%"
    backgroundType="none"
    itemStyle={{
      width: 250,
      height: 68,
    }}
    chart={{
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
      type: 'Wline',
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
      type: 'Wcircle',
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

const testData2 = [
  {
    data: {
      label: 'ECS',
      value: 23,
    },
    label: 'EIP',
    value: 45,
    config: {
      status: 'success',
      icon: {
        type: 'ecs',
      },
    },
    status: 'error',
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
    <Wnumberoverview data={testData2} />
  </div>
));

stories.add('带分割线的数据卡片概览', () => (
  <div>
    <Wnumberoverview data={testData} showDivider />
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

stories.add('大盘中的数据卡片概览', () => (
  <div>
    <Wnumberoverview data={status_data} backgroundType="none" showDivider={false} />
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
  {
    label: 'HBASE',
    value: 2,
  },
  {
    label: 'NAS',
    value: 234,
  },
];

const testData_2 = [
  {
    label: 'ECS',
    value: 23,
    unit: '个',
    valueTags: [
      {
        text: '正常',
        status: 'success',
      },
    ],
    backgroundType: 'image',
    backgroundImage:
      'https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png',
  },
  {
    label: 'EIP',
    value: 45,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png',
  },
  {
    label: 'GDB',
    value: 12,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png',
  },
  {
    label: 'HBASE',
    value: 2,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png',
  },
  {
    label: 'NAS',
    value: 234,
    unit: '个',
    backgroundType: 'image',
    backgroundImage:
      'https://ascdn.console.inter.env180.shuguang.com/ais-fed/as-lib/0.0.2/csp/yygl_zz_light_qinglian.png',
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

stories.add('数据卡片 - 业务场景', () => {
  const [d_2, setD_2] = useState(testData_1);

  useEffect(() => {
    setD_2(
      testData_1.map((el) => {
        return {
          ...el,
          icon: svgIcon,
          unit: '个',
        };
      }),
    );
  }, []);

  return (
    <>
      <Wcontainer className="demos" title="标题+数字">
        {/* 白底为默认值的话showDivider也默认开启 */}
        <Wnumberoverview data={testData_1} />
      </Wcontainer>
      <Wcontainer className="demos" title="标题+数字+单位+ICON">
        <Wnumberoverview data={d_2} />
      </Wcontainer>
      <Wcontainer className="demos" title="标题+数字+单位+背景">
        <Wnumberoverview data={testData_2} />
      </Wcontainer>
      <Wcontainer className="demos" title="标题+数字+状态">
        <Wnumberoverview data={testData_4} />
      </Wcontainer>
      <Wcontainer className="demos" title="标题+数字+Tag">
        <Wnumberoverview data={testData_5} />
      </Wcontainer>
      <Wcontainer className="demos" title="标题+数字+miniChart">
        <Wnumberoverview data={testData_6} />
      </Wcontainer>
      <Wcontainer className="demos" title="多行组件">
        <Wnumberoverview data={d_2} columns={4} />
      </Wcontainer>
      <Wcontainer className="demos" title="大盘中的数据概览">
        <Wnumberoverview data={status_data} backgroundType="none" showDivider={false} />
      </Wcontainer>
    </>
  );
});
