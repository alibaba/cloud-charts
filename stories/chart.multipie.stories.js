import React, { useMemo, useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { withKnobs, number, array } from "@storybook/addon-knobs";

import { WmultiPie, Wnumber, Wcontainer } from '@alicloud/cloud-charts';

const depth = 2;
function mockData(target, maxDepth, deep = 0) {
  if (deep < maxDepth) {
    target.children = [];
    const totalValue = Math.round(Math.random() * 100) + 100;
    const loop = Math.round(Math.random() * 3) + 1;
    let unuseValue = totalValue;

    for (let i = 0; i < loop; i++) {
      const name = `${target.name}-${i}`;
      let value = Math.round((Math.random() * totalValue) / loop);

      if (i === loop - 1) {
        value = unuseValue;
      } else {
        unuseValue -= value;
      }

      if (deep !== maxDepth - 1) {
        value = undefined;
      }

      target.children.push(
        mockData(
          {
            name,
            value,
            deep: deep + 1,
            parent: target,
          },
          maxDepth,
          deep + 1,
        ),
      );
    }
  }

  return target;
}

const multiPieData = mockData(
  {
    name: 'root',
    value: 0,
    deep: 0,
  },
  2,
);
const multiPieData2 = mockData(
  {
    name: 'root',
    value: 0,
  },
  3,
);
const multiPieData3 = mockData(
  {
    name: 'root',
    value: 0,
  },
  4,
);

const colors = [];
function translateTree(node, idx) {
  if (node.children) {
    // if (node.deep === 1) {
    //   node.color = themes.category_20[idx];
    // }
    node.children.map((el, index) => {
      // if (el?.parent?.color) {
      //   const colorList = Util.calcLinearColor(el.parent.color, '#ffffff', node.children.length + 1);
      //   el.color = colorList[index];
      // }
      //   el.color = el.name.split('|||')[1];
      //   el.name = el.name.split('|||')[0];
      Reflect.deleteProperty(el, 'color');
      translateTree(el, index);
    });
  }
  // colors.push(node.color)
  return node;
}

const data = {
  name: 'root',
  children: [
    {
      name: 'ahm',
      children: [
        {
          name: 'ahm: ecs.s7-k',
          value: 1,
          color: '#68a3de',
        },
        {
          name: 'ahm: ecs.sn1ne',
          value: 9,
          color: '#adcded',
        },
      ],
      color: '#297ACC',
    },
    {
      name: 'aop',
      children: [
        {
          name: 'aop: ecs.s7-k',
          value: 5,
          color: '#56c78b',
        },
        {
          name: 'aop: ecs.g6x-ft-k10',
          value: 1,
          color: '#69cf99',
        },
        {
          name: 'aop: ecs.sn1ne',
          value: 10,
          color: '#7ed6a8',
        },
        {
          name: 'aop: ecs.xn4',
          value: 3,
          color: '#97deb9',
        },
        {
          name: 'aop: ecs.se1',
          value: 3,
          color: '#b0e8cb',
        },
        {
          name: 'aop: ecs.s6-hg-k',
          value: 16,
          color: '#c9f0dc',
        },
        {
          name: 'aop: ecs.n4',
          value: 2,
          color: '#e4f7ed',
        },
      ],
      color: '#43BF7E',
    },
    {
      name: 'appstreaming',
      children: [
        {
          name: 'appstreaming: ecs.s7-k',
          value: 78,
          color: '#9a97f7',
        },
        {
          name: 'appstreaming: ecs.g7m-se-x25',
          value: 1,
          color: '#a6a3f7',
        },
        {
          name: 'appstreaming: ecs.s7-hg-k',
          value: 2,
          color: '#b6b4fa',
        },
        {
          name: 'appstreaming: ecs.sn1ne',
          value: 6,
          color: '#c4c3fa',
        },
        {
          name: 'appstreaming: ecs.xn4',
          value: 10,
          color: '#d3d2fc',
        },
        {
          name: 'appstreaming: ecs.s6-hg-k',
          value: 24,
          color: '#e1e1fc',
        },
        {
          name: 'appstreaming: ecs.n4',
          value: 5,
          color: '#f0f0ff',
        },
      ],
      color: '#8A87F5',
    },
    {
      name: 'bici',
      children: [
        {
          name: 'bici: ecs.s7-k',
          value: 1,
          color: '#fac58c',
        },
        {
          name: 'bici: ecs.s6-hg-k',
          value: 2,
          color: '#fce2c5',
        },
      ],
      color: '#F7A854',
    },
    {
      name: 'edas-test',
      children: [
        {
          name: 'edas-test: ecs.s7-k',
          value: 4,
          color: '#ebd87c',
        },
        {
          name: 'edas-test: ecs.g7m-se-x25',
          value: 1,
          color: '#eddd8e',
        },
        {
          name: 'edas-test: ecs.n4v2',
          value: 12,
          color: '#f0e29e',
        },
        {
          name: 'edas-test: ecs.sn1ne',
          value: 18,
          color: '#f2e7b1',
        },
        {
          name: 'edas-test: ecs.s6-hg-k',
          value: 7,
          color: '#f7efc6',
        },
        {
          name: 'edas-test: ecs.n4',
          value: 4,
          color: '#faf4d9',
        },
        {
          name: 'edas-test: ecs.se1ne',
          value: 13,
          color: '#fcf9eb',
        },
      ],
      color: '#E8D36B',
    },
    {
      name: 'iaas_hot_upgrade_test',
      children: [
        {
          name: 'iaas_hot_upgrade_test: ecs.s7-k',
          value: 3,
          color: '#dfabff',
        },
        {
          name: 'iaas_hot_upgrade_test: ecs.g6x-ft-k10',
          value: 7,
          color: '#e9c7ff',
        },
        {
          name: 'iaas_hot_upgrade_test: ecs.s6-hg-k',
          value: 21,
          color: '#f4e3ff',
        },
      ],
      color: '#D48FFF',
    },
    {
      name: 'iaas_test',
      children: [
        {
          name: 'iaas_test: ecs.s7-k',
          value: 34,
          color: '#94c447',
        },
        {
          name: 'iaas_test: ecs.g7m-se-x25',
          value: 23,
          color: '#a5cf61',
        },
        {
          name: 'iaas_test: ecs.xn4v2',
          value: 4,
          color: '#b5d97c',
        },
        {
          name: 'iaas_test: ecs.sn1ne',
          value: 1,
          color: '#c5e099',
        },
        {
          name: 'iaas_test: ecs.xn4',
          value: 13,
          color: '#d8ebb9',
        },
        {
          name: 'iaas_test: ecs.s6-hg-k',
          value: 18,
          color: '#ebf5da',
        },
      ],
      color: '#85BA2F',
    },
    {
      name: 'acktest',
      children: [
        {
          name: 'acktest: ecs.gn5i',
          value: 3,
          color: '#8adce6',
        },
        {
          name: 'acktest: ecs.s6-hg-k',
          value: 3,
          color: '#c2edf2',
        },
      ],
      color: '#57CCD9',
    },
    {
      name: 'autotest',
      children: [
        {
          name: 'autotest: ecs.g7m-se-x25',
          value: 1,
          color: '#9bd4e8',
        },
      ],
      color: '#49ADD1',
    },
    {
      name: 'xingmeng',
      children: [
        {
          name: 'xingmeng: ecs.d1',
          value: 2,
          color: '#e68aa0',
        },
        {
          name: 'xingmeng: ecs.n4',
          value: 2,
          color: '#f2c2ce',
        },
      ],
      color: '#D95777',
    },
    {
      name: 'CloudNativeAutotest',
      children: [
        {
          name: 'CloudNativeAutotest: ecs.mn4',
          value: 10,
          color: '#ffecb8',
        },
        {
          name: 'CloudNativeAutotest: ecs.n4v2',
          value: 5,
          color: '#ffefc2',
        },
        {
          name: 'CloudNativeAutotest: ecs.sn1ne',
          value: 7,
          color: '#fff1cc',
        },
        {
          name: 'CloudNativeAutotest: ecs.xn4',
          value: 8,
          color: '#fff4d6',
        },
        {
          name: 'CloudNativeAutotest: ecs.se1',
          value: 1,
          color: '#fff7e0',
        },
        {
          name: 'CloudNativeAutotest: ecs.s6-hg-k',
          value: 2,
          color: '#fffaeb',
        },
        {
          name: 'CloudNativeAutotest: ecs.n4',
          value: 11,
          color: '#fffcf5',
        },
      ],
      color: '#FFE9AC',
    },
    {
      name: 'CloudNativeUpgrade',
      children: [
        {
          name: 'CloudNativeUpgrade: ecs.mn4',
          value: 1,
          color: '#bac1cf',
        },
        {
          name: 'CloudNativeUpgrade: ecs.sn1ne',
          value: 1,
          color: '#ced3de',
        },
        {
          name: 'CloudNativeUpgrade: ecs.se1',
          value: 3,
          color: '#e9ebf0',
        },
      ],
      color: '#A4ACBD',
    },
    {
      name: 'aopdr',
      children: [
        {
          name: 'aopdr: ecs.n4v2',
          value: 1,
          color: '#8ab7e6',
        },
      ],
      color: '#297ACC',
    },
    {
      name: 'arms-demo',
      children: [
        {
          name: 'arms-demo: ecs.n4v2',
          value: 1,
          color: '#97deb9',
        },
      ],
      color: '#43BF7E',
    },
    {
      name: 'astbbigdata',
      children: [
        {
          name: 'astbbigdata: ecs.n4v2',
          value: 18,
          color: '#a19ef7',
        },
        {
          name: 'astbbigdata: ecs.xn4',
          value: 1,
          color: '#b8b6fa',
        },
        {
          name: 'astbbigdata: ecs.se1',
          value: 4,
          color: '#cecdfa',
        },
        {
          name: 'astbbigdata: ecs.s6-hg-k',
          value: 2,
          color: '#e6e6fc',
        },
      ],
      color: '#8A87F5',
    },
    {
      name: 'brandneworg',
      children: [
        {
          name: 'brandneworg: ecs.n4v2',
          value: 1,
          color: '#fad2a7',
        },
      ],
      color: '#F7A854',
    },
    {
      name: 'dbs',
      children: [
        {
          name: 'dbs: ecs.n4v2',
          value: 1,
          color: '#eddd8e',
        },
        {
          name: 'dbs: ecs.gs6vv-kp-k10',
          value: 1,
          color: '#f2e7b1',
        },
        {
          name: 'dbs: ecs.s6-hg-k',
          value: 2,
          color: '#faf4d9',
        },
      ],
      color: '#E8D36B',
    },
    {
      name: 'yundunluck',
      children: [
        {
          name: 'yundunluck: ecs.n4v2',
          value: 1,
          color: '#dda6ff',
        },
        {
          name: 'yundunluck: ecs.xn4',
          value: 1,
          color: '#e6bdff',
        },
        {
          name: 'yundunluck: ecs.se1',
          value: 1,
          color: '#edd1ff',
        },
        {
          name: 'yundunluck: ecs.s6-hg-k',
          value: 1,
          color: '#f6e8ff',
        },
      ],
      color: '#D48FFF',
    },
    {
      name: 'yundune2e',
      children: [
        {
          name: 'yundune2e: ecs.g6x-ft-k10',
          value: 4,
          color: '#a9d169',
        },
        {
          name: 'yundune2e: ecs.sn1ne',
          value: 5,
          color: '#d2e8ae',
        },
      ],
      color: '#85BA2F',
    },
    {
      name: 'gpu专项',
      children: [
        {
          name: 'gpu专项: ecs.gs6vv-kp-k10',
          value: 1,
          color: '#a6e6ed',
        },
      ],
      color: '#57CCD9',
    },
    {
      name: 'hyh',
      children: [
        {
          name: 'hyh: ecs.sn1ne',
          value: 7,
          color: '#70bfdb',
        },
        {
          name: 'hyh: ecs.s6-hg-k',
          value: 1,
          color: '#9bd4e8',
        },
        {
          name: 'hyh: ecs.n4',
          value: 2,
          color: '#cbe8f2',
        },
      ],
      color: '#49ADD1',
    },
    {
      name: 'QHH',
      children: [
        {
          name: 'QHH: ecs.xn4',
          value: 1,
          color: '#e68aa0',
        },
        {
          name: 'QHH: ecs.n4',
          value: 1,
          color: '#f2c2ce',
        },
      ],
      color: '#D95777',
    },
    {
      name: 'hsbc',
      children: [
        {
          name: 'hsbc: ecs.xn4',
          value: 2,
          color: '#fff0c7',
        },
        {
          name: 'hsbc: ecs.s6-hg-k',
          value: 3,
          color: '#fff8e3',
        },
      ],
      color: '#FFE9AC',
    },
    {
      name: 'sub-org-1',
      children: [
        {
          name: 'sub-org-1: ecs.xn4',
          value: 1,
          color: '#ced3de',
        },
      ],
      color: '#A4ACBD',
    },
    {
      name: 'yanzhen',
      children: [
        {
          name: 'yanzhen: ecs.xn4',
          value: 2,
          color: '#68a3de',
        },
        {
          name: 'yanzhen: ecs.s6-hg-k',
          value: 2,
          color: '#adcded',
        },
      ],
      color: '#297ACC',
    },
    {
      name: 'ebs_test',
      children: [
        {
          name: 'ebs_test: ecs.i7x-4x4t-hg-k10',
          value: 1,
          color: '#97deb9',
        },
      ],
      color: '#43BF7E',
    },
    {
      name: 'cm-test',
      children: [
        {
          name: 'cm-test: ecs.s6-hg-k',
          value: 2,
          color: '#c4c3fa',
        },
      ],
      color: '#8A87F5',
    },
    {
      name: 'csb',
      children: [
        {
          name: 'csb: ecs.s6-hg-k',
          value: 1,
          color: '#fad2a7',
        },
      ],
      color: '#F7A854',
    },
    {
      name: 'gts',
      children: [
        {
          name: 'gts: ecs.s6-hg-k',
          value: 1,
          color: '#eddd8e',
        },
        {
          name: 'gts: ecs.se1ne',
          value: 1,
          color: '#f2e7b1',
        },
        {
          name: 'gts: ecs.gn7em-k10',
          value: 1,
          color: '#faf4d9',
        },
      ],
      color: '#E8D36B',
    },
    {
      name: 'hzg_test',
      children: [
        {
          name: 'hzg_test: ecs.s6-hg-k',
          value: 3,
          color: '#e9c7ff',
        },
      ],
      color: '#D48FFF',
    },
    {
      name: 'ning20240419',
      children: [
        {
          name: 'ning20240419: ecs.s6-hg-k',
          value: 1,
          color: '#bcdb8a',
        },
      ],
      color: '#85BA2F',
    },
    {
      name: 'shys',
      children: [
        {
          name: 'shys: ecs.s6-hg-k',
          value: 1,
          color: '#a6e6ed',
        },
      ],
      color: '#57CCD9',
    },
    {
      name: 'slb-e2e',
      children: [
        {
          name: 'slb-e2e: ecs.s6-hg-k',
          value: 10,
          color: '#9bd4e8',
        },
      ],
      color: '#49ADD1',
    },
    {
      name: 'wyk',
      children: [
        {
          name: 'wyk: ecs.s6-hg-k',
          value: 1,
          color: '#eda6b8',
        },
      ],
      color: '#D95777',
    },
    {
      name: 'yhw-test',
      children: [
        {
          name: 'yhw-test: ecs.s6-hg-k',
          value: 1,
          color: '#fff4d6',
        },
      ],
      color: '#FFE9AC',
    },
    {
      name: '交通银行',
      children: [
        {
          name: '交通银行: ecs.s6-hg-k',
          value: 1,
          color: '#ced3de',
        },
      ],
      color: '#A4ACBD',
    },
  ],
};

const stories = storiesOf('WmultiPie', module);
stories.add('多重饼图', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '33.33%' }}>
      {/* <Wcontainer className="demos">
        <WmultiPie height="300" config={{
          // legend: {
          //   dodge: true,
          //   showData: true
          // },
          cycle: true,
          // innerContent: true
        }} data={translateTree(multiPieData)} />
      </Wcontainer> */}
    </div>
    {/* <div style={{ width: '33.33%' }}>
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
    </div> */}
    <div
      style={{
        width: '50%',
      }}
    >
      <Wcontainer className="demos">
        <WmultiPie
          height="300"
          config={{
            cycle: true,
            legend: {
            //   dodge: true,
              table: {
                statistics: ['current']
              },
            //   showData: true,
            },
            showSpacing: false,
            // colors: ["#29236d", "#392b9c", "#5139dd"]
          }}
          data={translateTree(data)}
        />
      </Wcontainer>
    </div>
  </div>
));

stories.add('多重环图', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie
          height="300"
          config={{
            cycle: true,
            // legend: {
            //   table: true,
            //   //   dodge: true,
            // },
            // autoSort: false,
            // reverse: true,
            autoFormat: true,
          }}
          data={multiPieData}
        />
      </Wcontainer>
    </div>
    {/* <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie
          height="300"
          config={{
            cycle: true,
            tooltip: {
              valueFormatter(n, ...args) {
                return n;
              },
            },
          }}
          data={multiPieData2}
        />
      </Wcontainer>
    </div> */}
    {/* <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{ cycle: true }} data={multiPieData3} />
      </Wcontainer>
    </div> */}
  </div>
));

stories.add('多重环图(数据变化)', () => {
  const [data, setData] = useState(multiPieData);

  useEffect(() => {
    setTimeout(() => {
      setData(multiPieData2);
    }, 3000);
  }, []);
  return (
    <div>
      <WmultiPie
        height="300"
        config={{
          cycle: true,
        }}
        data={data}
      />
    </div>
  );
});
