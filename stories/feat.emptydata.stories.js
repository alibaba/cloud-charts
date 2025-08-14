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
  Wplaceholder
} from '@alicloud/cloud-charts';

const stories = storiesOf('emptyData', module);

stories.add('业务图表空数据', () => (
  <Wplaceholder empty height={300} />
));

stories.add('线图', () => (
  <Wcontainer className="demos">
    <Wline
      height="300"
      data={[]}
      emptyInfo={<div style={{ transform: 'translateX(-50%)' }}>tesatehasfkjdhkfladsljgkhdsagfhdsjklfbsdjkf</div>}
    />
  </Wcontainer>
));

stories.add('柱图', () => (
  <Wcontainer className="demos">
    <Wbar height="300" data={[]} />
  </Wcontainer>
));

stories.add('箱型图', () => (
  <Wcontainer className="demos">
    <Wbox height="300" data={[]} />
  </Wcontainer>
));

stories.add('烛形图', () => (
  <Wcontainer className="demos">
    <Wcandlestick height="300" data={[]} />
  </Wcontainer>
));

stories.add('直方图', () => (
  <Wcontainer className="demos">
    <Whistogram height="300" data={[]} />
  </Wcontainer>
));

stories.add('线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" data={[]} />
  </Wcontainer>
));

stories.add('线点图', () => (
  <Wcontainer className="demos">
    <Wlinescatter height="300" data={[]} />
  </Wcontainer>
));

stories.add('散点图', () => (
  <Wcontainer className="demos">
    <Wscatter height="300" data={[]} />
  </Wcontainer>
));

stories.add('雷达图', () => (
  <Wcontainer className="demos">
    <Wradar height="300" data={[]} />
  </Wcontainer>
));

stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" data={[]} />
  </Wcontainer>
));

stories.add('环图', () => (
  <Wcontainer className="demos">
    <Wpie height="300" data={[]} config={{ cycle: true }} />
  </Wcontainer>
));

stories.add('多重饼图', () => (
  <Wcontainer className="demos">
    <WmultiPie height="300" data={{}} />
  </Wcontainer>
));

stories.add('多重环图', () => (
  <Wcontainer className="demos">
    <WmultiPie height="300" data={{ name: 'test', children: [] }} config={{ cycle: true }} />
  </Wcontainer>
));

stories.add('玫瑰图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" data={[]} />
  </Wcontainer>
));

stories.add('玫瑰环图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" data={[]} config={{ cycle: true }} />
  </Wcontainer>
));

stories.add('漏斗图', () => (
  <Wcontainer className="demos">
    <Wfunnel height="300" data={[]} />
  </Wcontainer>
));

stories.add('热力图', () => (
  <Wcontainer className="demos">
    <Wheatmap height="300" data={[]} />
  </Wcontainer>
));

stories.add('层次图', () => (
  <Wcontainer className="demos">
    <Whierarchy height="300" data={{ children: [] }} />
  </Wcontainer>
));

stories.add('分箱图', () => (
  <Wcontainer className="demos">
    <Wrectangle height="300" data={[]} />
  </Wcontainer>
));

stories.add('桑基图', () => (
  <Wcontainer className="demos">
    <Wsankey height="300" data={{ nodes: [] }} />
  </Wcontainer>
));

stories.add('树图', () => (
  <Wcontainer className="demos">
    <Wtreemap height="300" data={{}} />
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

stories.add('有数据到无数据（暂不处理）', () => {
  const [d, setD] = useState(barData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setD([]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={d} />
    </Wcontainer>
  );
});

stories.add('无数据到有数据（柱图）', () => {
  const [d, setD] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setD(barData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height="300" data={d} />
    </Wcontainer>
  );
});

stories.add('数据与尺寸同时变', () => {
  const [test, setTest] = useState({ data: [], height: 300 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTest({
        data: barData,
        height: 500,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wbar height={test.height} data={test.data} />
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

stories.add('无数据到有数据（漏斗图）', () => {
  const [d, setD] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setD(funnelData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wfunnel height="300" data={d} />
    </Wcontainer>
  );
});
