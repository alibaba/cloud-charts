import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wfunnel } from '@alife/aisc-widgets';

const data = [
  {
    "name":"流量转化",
    "data":[["浏览网站",50000],["放入购物车",35000],["生成订单",25000],["支付订单",15000],["完成交易",8000]]
  }
];

const stories = storiesOf('Wfunnel', module);
stories.addDecorator(withKnobs);

stories.add('漏斗图', () => (
    <Wfunnel height="300" data={data} />
));
