import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wheatmap } from '@alife/aisc-widgets';

const data = [
  {
    name: '类型一',
    data: [
      ['aws1', 'aws1'],
      ['aws2', 'aws2'],
      ['aws3', 'aws3'],
      ['aws4', 'aws4'],
      ['aws5', 'aws5'],
    ],
  },
  {
    name: '类型二',
    data: [
      ['aws1', 'aws2', 234],
      ['aws1', 'aws3', 234],
      ['aws1', 'aws4', 234],
      ['aws2', 'aws1', 234],
      ['aws2', 'aws3', 234],
      ['aws2', 'aws4', 234],
      ['aws2', 'aws5', 234],
      ['aws3', 'aws1', 234],
      ['aws3', 'aws4', 234],
      ['aws3', 'aws5', 234],
      ['aws4', 'aws1', 234],
      ['aws4', 'aws2', 234],
      ['aws4', 'aws5', 234],
      ['aws5', 'aws1', 234],
      ['aws5', 'aws2', 234],
      ['aws5', 'aws3', 234],
      ['aws5', 'aws4', 234],
    ],
  },
  {
    name: '类型三',
    data: [
      ['aws1', 'aws5', 234],
      ['aws3', 'aws2', 234],
      ['aws4', 'aws3', 234],
    ],
  }
];

const stories = storiesOf('Wheatmap', module);
stories.addDecorator(withKnobs);

stories.add('色块图', () => (
    <Wheatmap height="300" data={data} />
));
