import React from 'react';
import { storiesOf } from '@storybook/react';
import { Wcandlestick, Wcontainer } from '@alife/aisc-widgets';

const data = [
  {
    name: '股票价格',
    data: [
      [1186444800000, { start: 22.75, end: 23.44, max: 23.7, min: 22.69 }],
      [1186358400000, { start: 23.03, end: 22.97, max: 23.15, min: 22.44 }],
      [1186099200000, { start: 23.2, end: 22.92, max: 23.39, min: 22.87 }],
      [1186012800000, { start: 22.65, end: 23.36, max: 23.7, min: 22.65 }],
      [1185926400000, { start: 23.17, end: 23.25, max: 23.4, min: 22.85 }],
      [1185840000000, { start: 23.88, end: 23.25, max: 23.93, min: 23.24 }],
      [1185753600000, { start: 23.55, end: 23.62, max: 23.88, min: 23.38 }],
      [1185494400000, { start: 23.98, end: 23.49, max: 24.49, min: 23.47 }],
      [1185408000000, { start: 24.4, end: 24.03, max: 24.49, min: 23.62 }],
      [1185321600000, { start: 25.01, end: 24.68, max: 25.32, min: 24.59 }],
      [1185235200000, { start: 24.8, end: 24.84, max: 25.34, min: 24.73 }],
      [1185148800000, { start: 25.43, end: 24.99, max: 25.46, min: 24.98 }],
      [1184889600000, { start: 25.7, end: 25.35, max: 25.89, min: 25.2 }],
      [1184803200000, { start: 26.32, end: 26.03, max: 26.34, min: 25.92 }],
      [1184716800000, { start: 26.07, end: 26.2, max: 26.72, min: 26.02 }],
      [1184630400000, { start: 26.74, end: 27.53, max: 27.8, min: 26.7 }],
      [1184544000000, { start: 26.48, end: 26.7, max: 26.74, min: 26.13 }],
      [1184284800000, { start: 26.87, end: 26.58, max: 26.97, min: 26.5 }],
      [1184198400000, { start: 26.7, end: 26.96, max: 26.97, min: 26.34 }],
      [1184112000000, { start: 27.03, end: 26.69, max: 27.05, min: 26.55 }],
      [1184025600000, { start: 27.09, end: 26.97, max: 27.57, min: 26.96 }],
      [1183939200000, { start: 26.92, end: 27.2, max: 27.33, min: 26.82 }],
      [1183680000000, { start: 27.01, end: 27.1, max: 27.14, min: 26.93 }],
      [1183593600000, { start: 26.92, end: 26.99, max: 27.14, min: 26.9 }],
      [1183420800000, { start: 26.95, end: 27, max: 27.25, min: 26.9 }],
      [1183334400000, { start: 27.19, end: 26.86, max: 27.27, min: 26.76 }],
      [1183075200000, { start: 27.21, end: 27.13, max: 27.38, min: 26.93 }],
      [1182988800000, { start: 27.44, end: 27.25, max: 27.49, min: 27.12 }],
      [1182902400000, { start: 27.51, end: 27.58, max: 27.66, min: 27.4 }],
      [1182816000000, { start: 27.73, end: 27.71, max: 28.18, min: 27.36 }],
      [1182729600000, { start: 27.6, end: 27.64, max: 27.77, min: 27.34 }],
      [1182470400000, { start: 27.68, end: 27.38, max: 27.79, min: 27.31 }],
      [1182384000000, { start: 27.69, end: 27.67, max: 27.94, min: 27.55 }],
      [1182297600000, { start: 27.89, end: 27.66, max: 28.17, min: 27.66 }],
      [1182211200000, { start: 29.4, end: 27.63, max: 29.4, min: 27.54 }],
      [1182124800000, { start: 27.72, end: 28.12, max: 28.34, min: 27.5 }],
      [1181865600000, { start: 27.49, end: 27.31, max: 27.52, min: 27.19 }],
      [1181779200000, { start: 27.38, end: 27.3, max: 27.64, min: 27.15 }],
      [1181692800000, { start: 27.12, end: 27.38, max: 27.41, min: 26.61 }],
      [1181606400000, { start: 27.3, end: 27.05, max: 27.66, min: 26.98 }],
      [1181520000000, { start: 27.27, end: 27.35, max: 27.52, min: 27.15 }],
      [1181260800000, { start: 27.02, end: 27.39, max: 27.45, min: 26.96 }],
      [1181174400000, { start: 27.34, end: 26.98, max: 27.73, min: 26.98 }],
      [1181088000000, { start: 28.05, end: 27.44, max: 28.11, min: 27.3 }],
      [1181001600000, { start: 28.4, end: 28.23, max: 28.59, min: 28.1 }],
      [1180915200000, { start: 28.6, end: 28.59, max: 28.78, min: 28.4 }],
      [1180656000000, { start: 28.9, end: 28.78, max: 29.13, min: 28.61 }],
      [1180569600000, { start: 28.76, end: 28.7, max: 28.85, min: 28.49 }],
      [1180483200000, { start: 28.19, end: 28, max: 28.38, min: 28 }],
      [1180396800000, { start: 28.36, end: 28.4, max: 28.73, min: 28.2 }],
      [1180051200000, { start: 28.44, end: 28.58, max: 28.73, min: 28.34 }],
      [1179964800000, { start: 28.65, end: 28.41, max: 28.88, min: 28.25 }],
      [1179878400000, { start: 29.1, end: 28.61, max: 29.37, min: 28.53 }],
      [1179792000000, { start: 29.33, end: 28.92, max: 29.35, min: 28.78 }],
      [1179705600000, { start: 29.62, end: 29.35, max: 29.86, min: 29.32 }],
      [1179446400000, { start: 28.9, end: 29.75, max: 29.8, min: 28.78 }],
      [1179360000000, { start: 28.99, end: 28.57, max: 29.13, min: 28.49 }],
      [1179273600000, { start: 28.89, end: 29.21, max: 29.37, min: 28.25 }],
      [1179187200000, { start: 29.16, end: 28.81, max: 29.42, min: 28.75 }],
      [1179100800000, { start: 29.79, end: 29.5, max: 30, min: 29.08 }],
      [1178841600000, { start: 29.62, end: 30.05, max: 30.08, min: 29.53 }],
    ],
  },
];

const options = {
  tooltip: {
    showTitle: true, // default: true
    labelAlias: {
      start: '开盘价',
      end: '收盘价',
      max: '最高价',
      min: '最低价',
    },
  },
};

const stories = storiesOf('Wcandlestick', module);
stories.add('烛形图', () => (
  <Wcontainer className="demos">
    <Wcandlestick height="300" config={options} data={data} />
  </Wcontainer>
));