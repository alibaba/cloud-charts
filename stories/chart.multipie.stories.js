import React, { useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { withKnobs, number, array } from "@storybook/addon-knobs";

import { WmultiPie, Wnumber, Wcontainer } from '@alife/aisc-widgets';

const depth = 2;
function mockData(target, maxDepth, deep = 0) {
  if (deep < maxDepth) {
    target.children = [];
    const totalValue = Math.round(Math.random() * 100) + 100;
    const loop = Math.round(Math.random() * 3) + 1;
    let unuseValue = totalValue;

    for(let i = 0; i < loop; i++) {
      const name = `${target.name}-${i}`;
      let value = Math.round(Math.random() * totalValue / loop);

      if (i === loop - 1) {
        value = unuseValue;
      } else {
        unuseValue -= value;
      }

      if (deep !== maxDepth - 1) {
        value = undefined;
      }

      target.children.push(mockData({name, value}, maxDepth, deep + 1))
    }
  }

  return target;
}

const multiPieData = mockData({
  name: 'root',
  value: 0,
}, 2);
const multiPieData2 = mockData({
  name: 'root',
  value: 0,
}, 3);
const multiPieData3 = mockData({
  name: 'root',
  value: 0,
}, 4);

const stories = storiesOf('WmultiPie', module);
stories.add('多重饼图', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{}} data={multiPieData} />
      </Wcontainer>
    </div>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{
          tooltip: {
            valueFormatter(n, ...args) {
              console.log(args);
              return n;
            }
          }
        }} data={multiPieData2} />
      </Wcontainer>
    </div>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{}} data={multiPieData3} />
      </Wcontainer>
    </div>
  </div>
));

stories.add('多重环图', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{ cycle: true }} data={multiPieData} />
      </Wcontainer>
    </div>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{
          cycle: true,
          tooltip: {
            valueFormatter(n, ...args) {
              console.log(args);
              return n;
            }
          }
        }} data={multiPieData2} />
      </Wcontainer>
    </div>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{ cycle: true }} data={multiPieData3} />
      </Wcontainer>
    </div>
  </div>
));
