import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wradar } from '@alicloud/cloud-charts';

const data = [
  {
    name: '平均水准',
    data: [
      ['2001', 41],
      ['2002', 38],
      ['2003', 33],
      ['2004', 30],
      ['2005', 25],
      ['2006', 42],
    ]
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
    ]
  }
];

const stories = storiesOf('Wradar', module);
stories.addDecorator(withKnobs);

stories.add('雷达图', () => (
    <Wradar height="300" data={data} />
));
