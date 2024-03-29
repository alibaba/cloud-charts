import React, { useEffect } from 'react';

import { storiesOf } from '@storybook/react';
import {
  Wbar,
  Wline,
  Wplaceholder,
  Wmap,
  ChartProvider,
  setLanguage,
} from '@alicloud/cloud-charts';

const stories = storiesOf('locale', module);

const timeData = [
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
  {
    name: '机房B',
    yAxis: 1,
    // visible: false,
    data: [
      [1483372800000, 6051],
      [1483459200000, 3278],
      [1483545600000, 5175],
      [1483632000000, 6548],
      [1483718400000, 9048],
      [1483804800000, 11394],
      [1483891200000, 8597],
      [1483977600000, 6588],
    ],
  },
  {
    name: '异常点',
    data: [
      [1483372800000, 2051],
      [1483459200000, 3278],
      [1483545600000, 4175],
      [1483632000000, 2548],
      [1483718400000, 1048],
      [1483804800000, 1394],
      [1483891200000, 5597],
      [1483977600000, 3588],
    ],
  },
];

stories.add('通用图表', () => (
  <ChartProvider language="en-us">
    <Wbar height="300" data={[]} />
    <Wline height="300" data={[]} />
    <Wline height="300" data={timeData} />
  </ChartProvider>
));

stories.add('通用图表自定义', () => (
  <ChartProvider
    locale={{
      loading: '自定义加载中...',
      error: '自定义数据异常',
      noData: '自定义无数据',
      empty: '自定义暂无数据',
      reset: '自定义重置',
    }}
  >
    <Wbar height="300" data={[]} />
    <Wline height="300" data={[]} />
  </ChartProvider>
));

stories.add('通用图表兼容', () => (
  <ChartProvider language="zh-cn">
    <Wbar height="300" data={[]} language="en-us" />
    <Wline height="300" data={[]} />
  </ChartProvider>
));

const data = [
  {
    name: '柱1',
    data: [
      ['一', 59],
      ['二', 23],
      ['三', 19],
      ['四', 27],
      ['五', 77],
      ['六', 100],
      ['七', 70],
      ['八', 61],
      ['九', 15],
    ],
  },
  {
    name: '柱2',
    data: [
      ['一', 92],
      ['二', 15],
      ['三', 4],
      ['四', 49],
      ['五', 64],
      ['六', 76],
      ['七', 21],
      ['八', 100],
      ['九', 71],
    ],
  },
];

stories.add('zoom', () => (
  <ChartProvider language="en-us">
    <Wbar height="300" data={data} config={{ zoom: true }} language="zh-cn" />
  </ChartProvider>
));

stories.add('Wplaceholder', () => (
  <ChartProvider language="en-us">
    <Wplaceholder loading />
    <Wplaceholder noData />
    <Wplaceholder empty />
    <Wplaceholder error />
  </ChartProvider>
));

stories.add('Wplaceholder兼容', () => (
  <ChartProvider
    language="en-us"
    locale={{
      loading: '自定义加载中...',
      error: '自定义数据异常',
      noData: '自定义无数据',
      empty: '自定义暂无数据',
      reset: '自定义重置',
    }}
  >
    <Wplaceholder loading language={'zh-cn'} />
    <Wplaceholder
      noData
      locale={{
        loading: '组件自定义加载中...',
        error: '组件自定义数据异常',
        noData: '组件自定义无数据',
        empty: '组件自定义暂无数据',
        reset: '组件自定义重置',
      }}
    />
    <Wplaceholder empty />
    <Wplaceholder error />
  </ChartProvider>
));

stories.add('setLanguage', () => {
  useEffect(() => {
    setTimeout(() => {
      setLanguage('en-us');
    }, 3000);
  });

  return <Wbar height="300" data={[]} />;
});

stories.add('优先级', () => {
  useEffect(() => {
    setTimeout(() => {
      setLanguage('zh-cn');
    }, 3000);
  });

  return (
    <ChartProvider language="en-us">
      <Wbar height="300" data={[]} />
      <Wline height="300" data={[]} />
    </ChartProvider>
  );
});

stories.add('地图', () => (
  <ChartProvider language="en-us">
    <Wmap
      config={{
        label: true,
      }}
    />
  </ChartProvider>
));

stories.add('事件', () => {
  useEffect(() => {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('setCloudChartsLanguage', { detail: 'en-us' }));
    }, 3000);
  }, []);

  return <Wline height="300" data={[]} />;
});

stories.add('自定义locale', () => {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('setCloudChartsLanguage', { detail: 'zh-cn' }));
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('setCloudChartsLanguage', { detail: 'en-us' }));
    }, 3000);
  }, []);

  return (
    <ChartProvider
      locale={{
        'zh-cn': {
          empty: '测试测试',
        },
        'en-us': {
          empty: 'test test',
        },
      }}
    >
      <Wbar height="300" data={[]} config={{ zoom: true }} language="zh-cn" />
    </ChartProvider>
  );
});

stories.add('地图自定义', () => {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('setCloudChartsLanguage', { detail: 'zh-cn' }));
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('setCloudChartsLanguage', { detail: 'en-us' }));
    }, 3000);
  }, []);

  return (
    <ChartProvider
      locale={{
        'zh-cn': {
          beijing: '测试',
        },
        'en-us': {
          beijing: 'test',
        },
      }}
    >
      <Wmap
        config={{
          label: true,
        }}
      />
    </ChartProvider>
  );
});
