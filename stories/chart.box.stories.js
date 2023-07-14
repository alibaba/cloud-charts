import React from 'react';
import { storiesOf } from '@storybook/react';
import { Wcontainer, Wbox } from '@alicloud/cloud-charts';

const data = [
  {
    name: '柱1',
    data: [['一', [1, 9, 16, 22, 24]]],
  },
  {
    name: '柱2',
    data: [['二', [3, 10, 17, 28, 32]]],
  },
  {
    name: '柱3',
    data: [['三', [2, 8, 12, 19, 26]]],
  },
  {
    name: '柱4',
    data: [['四', [5, 8, 12, 21, 35]]],
  },
  {
    name: '柱5',
    data: [['五', [1, 7, 10, 17, 22]]],
  },
];

const options = {
  size: 40
};

const stories = storiesOf('Wbox', module);
stories.add('箱型图', () => (
  <Wcontainer className="demos">
    <Wbox height="300" config={options} data={data} />
  </Wcontainer>
));
