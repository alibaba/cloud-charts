import React, { useState, useEffect } from 'react';

import { storiesOf } from '@storybook/react';

import {
  Wcontainer,
  Wline,
  Wbar,
  Wbox,
  Wcandlestick,
  Whistogram,
  Wlinebar,
  Wlinescatter,
  Wpie,
  Wscatter,
  Wradar,
  WmultiPie,
  Wnightingale,
  Wfunnel,
  Wheatmap,
  Whierarchy,
  Wrectangle,
  Wsankey,
  Wtreemap,
  Wplaceholder,
  Wmulticircle,
  Wlinebox,
} from '@alicloud/cloud-charts';

const stories = storiesOf('loading', module);

stories.add('业务图表loading', () => <Wplaceholder loading height={300} />);

stories.add('线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      data={[
        {
          name: '',
          data: [['2021', 11]],
        },
      ]}
      loading
      loadingInfo={<div>test</div>}
      config={{
        zoom: true,
      }}
    />
  </Wcontainer>
));

stories.add('线图（双轴）', () => (
  <Wcontainer className="demos">
    <Wline height="300" data={[]} config={{ yAxis: [{}, {}] }} loading />
  </Wcontainer>
));

stories.add('柱图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" data={[]} loading stateType="ai" />
  </Wcontainer>
));

stories.add('箱型图', () => (
  <Wcontainer className="demos">
    <Wbox height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('烛形图', () => (
  <Wcontainer className="demos">
    <Wcandlestick height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('直方图', () => (
  <Wcontainer className="demos">
    <Whistogram height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('线柱图（双轴）', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" data={[]} config={{ yAxis: [{}, {}] }} loading />
  </Wcontainer>
));

stories.add('线点图', () => (
  <Wcontainer className="demos">
    <Wlinescatter height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('散点图', () => (
  <Wcontainer className="demos">
    <Wscatter height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('雷达图', () => (
  <Wcontainer className="demos">
    <Wradar height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" data={[]} config={{ cycle: true }} loading />
  </Wcontainer>
));

stories.add('多重饼图', () => (
  <Wcontainer className="demos">
    <WmultiPie height="300" data={{}} loading />
  </Wcontainer>
));

stories.add('多重环图', () => (
  <Wcontainer className="demos">
    <WmultiPie height="300" data={{ name: 'test', children: [] }} config={{ cycle: true }} loading />
  </Wcontainer>
));

stories.add('玫瑰图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('玫瑰环图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" data={[]} config={{ cycle: true }} loading />
  </Wcontainer>
));

stories.add('漏斗图', () => (
  <Wcontainer className="demos">
    <Wfunnel height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('热力图', () => (
  <Wcontainer className="demos">
    <Wheatmap height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('层次图', () => (
  <Wcontainer className="demos">
    <Whierarchy height="300" data={{ children: [] }} loading />
  </Wcontainer>
));

stories.add('分箱图', () => (
  <Wcontainer className="demos">
    <Wrectangle height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('桑基图', () => (
  <Wcontainer className="demos">
    <Wsankey height="300" data={{ nodes: [] }} loading />
  </Wcontainer>
));

stories.add('树图', () => (
  <Wcontainer className="demos">
    <Wtreemap height="300" data={{}} loading />
  </Wcontainer>
));

stories.add('多重圆环', () => (
  <Wcontainer className="demos">
    <Wmulticircle height="300" data={[]} loading />
  </Wcontainer>
));

stories.add('箱型线图', () => (
  <Wcontainer className="demos">
    <Wlinebox height="300" data={[]} loading />
  </Wcontainer>
));

const barData = [
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

stories.add('从loading到有数据（柱图）', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={barData} loading={loading} />
    </Wcontainer>
  );
});

const radarData = [
  {
    name: '平均水准',
    data: [
      ['2001', 41],
      ['2002', 38],
      ['2003', 33],
      ['2004', 30],
      ['2005', 25],
      ['2006', 42],
    ],
  },
  {
    name: '个人水准',
    data: [
      ['2001', 25],
      ['2002', 72],
      ['2003', 35],
      ['2004', 27],
      ['2005', 54],
      ['2006', 52],
    ],
  },
];

stories.add('从loading到有数据（雷达图）', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wradar height="300" data={radarData} loading={loading} />
    </Wcontainer>
  );
});

const funnelData = [
  {
    name: '流量转化',
    data: [
      ['浏览网站', 50000],
      ['放入购物车', 35000],
      ['生成订单', 25000],
      ['支付订单', 15000],
      ['完成交易', 8000],
    ],
  },
];

stories.add('从loading到有数据（漏斗图）', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wfunnel height="300" data={funnelData} loading={loading} />
    </Wcontainer>
  );
});

stories.add('从loading到无数据', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={[]} loading={loading} />
    </Wcontainer>
  );
});
