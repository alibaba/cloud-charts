import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wnightingale, Wnumber, Wcontainer } from '@alicloud/cloud-charts';

const data = [{
  name: '人口比例',
  data: [
    ['2001', 41.8],
    ['2002', 38],
    ['2003', 33.7],
    ['2004', 30.7],
    ['2005', 25.8],
    ['2006', 31.7],
    ['2007', 33],
    ['2008', 46],
    ['2009', 38.3],
    ['2010', 28],
    ['2011', 42.5],
    ['2012', 30.3]
  ]
}];

const stories = storiesOf('Wnightingale', module);
stories.add('玫瑰图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" config={{}} data={data} />
  </Wcontainer>
));
stories.add('无标签玫瑰图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" config={{
      label: false,
    }} data={data} />
  </Wcontainer>
));

stories.add('玫瑰环图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" config={{
      cycle: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带内容玫瑰环图', () => (
  <Wcontainer className="demos">
    <Wnightingale height="300" config={{
      cycle: true,
    }} data={data}>
      <Wnumber bottomTitle="现代浏览器占比" unit="%">72.5</Wnumber>
    </Wnightingale>
  </Wcontainer>
));
// stories.add('带标签环图', () => (
//   <Wcontainer className="demos">
//     <Wnightingale height="300" config={{
//       cycle: true,
//       label: true,
//       legend: false,
//     }} data={data} />
//   </Wcontainer>
// ));
