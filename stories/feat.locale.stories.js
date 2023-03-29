import React, { useEffect } from 'react';

import { storiesOf } from '@storybook/react';
import { Wbar, Wline, Wplaceholder, Wmap, ChartProvider, setLanguage } from '@alife/aisc-widgets';

const stories = storiesOf('locale', module);

stories.add('通用图表', () => (
  <ChartProvider language="en-us">
    <Wbar height="300" data={[]} />
    <Wline height="300" data={[]} />
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
