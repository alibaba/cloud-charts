import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wfunnel } from '@alicloud/cloud-charts';

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

const directionData = [
  {
    "name":"柱1",
    "data":[["一", 100], ["二", 75], ["三", 50], ["四", 20], ["五", 10]]
  }
];

const directionData_2 = [
  {
    "name":"柱1",
    "data":[["一", 100], ["二", 40], ["三", 20], ["四", 15], ["五", 10]]
  }
];

class NewData extends React.Component {
  state = {
    data: directionData
  }

  componentDidMount() {
    setInterval(() => {
      let t = Date.now();

      this.setState({
        data: directionData_2,
      })
    }, 2000);
  }

  render(){
    return (
      <Wcontainer className="demos">
        <Wfunnel height="300" config={{}} data={this.state.data}/>
      </Wcontainer>
    );
  }
}
stories.add('纵向-左侧', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'vertical',
        align: 'left',
        label: true,
      }}
      data={directionData}
    />
  </Wcontainer>
));
stories.add('纵向-中间', () => (
  <Wcontainer className="demos">
    <Wfunnel
      height="300"
      config={{
        // padding: [20, 20, 20, 20],
        direction: 'vertical',
        align: 'center',
        label: false,
      }}
      data={directionData}
    />
  </Wcontainer>
));
stories.add('纵向-右侧', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'vertical',
        align: 'right',
        label: true,
      }}
      data={directionData}
    />
  </Wcontainer>
));

stories.add('横向-顶部', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'horizontal',
        align: 'top',
        label: true,
      }}
      data={directionData}
    />
  </Wcontainer>
));
stories.add('横向-中间', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        padding: [20, 20, 20, 20],
        direction: 'horizontal',
        align: 'center',
        label: true,
      }}
      data={directionData}
    />
  </Wcontainer>
));
stories.add('横向-底部', () => (
  <Wcontainer className="demos">
    <Wfunnel
      width={500}
      height="300"
      config={{
        direction: 'horizontal',
        align: 'bottom',
        label: true,
      }}
      data={directionData}
    />
  </Wcontainer>
));

stories.add('动态数据', () => (
  <NewData />
));
