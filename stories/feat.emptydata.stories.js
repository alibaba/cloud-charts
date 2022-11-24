import React from 'react';

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
} from '@alife/aisc-widgets';

const stories = storiesOf('emptyData', module);

stories.add('线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" data={[]} />
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

stories.add('线柱图（有问题）', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" data={[]} />
  </Wcontainer>
));

stories.add('线点图（有问题）', () => (
  <Wcontainer className="demos">
    <Wlinescatter height="300" data={[]} />
  </Wcontainer>
));
