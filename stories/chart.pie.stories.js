import React, { useEffect, useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, array } from '@storybook/addon-knobs';

import { Wpie, Wnumber, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', -12.8222222],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
    ],
  },
];

const extermeData = [
  {
    name: '浏览器占比',
    data: [
      ['计算', 90860.0],
      ['存储', 6067.8],
      ['网络', 459.8],
      ['数据库22222222', 102.5],
      ['云产品1', 0],
      ['云产品2', 0],
      ['云产品3', 0],
    ],
  },
];

const temp = [
  {
    name: '浏览器占比',
    data: [['Firefox', 45.0]],
  },
];
// function WdashboardDemo() {
//   const data = number('仪表盘数字', 20);
//   const arr = array('值域范围', [0, 100],);
//   const [count, setCount] = useState(data);
//   const [range, setRange] = useState(arr);
//   useMemo(() => {
//     setRange(arr.map(Number));
//     setCount(data);
//   }, [data, arr]);
//   return <Wdashboard data={count} config={{range}} className="demos"/>;
// }

class NewData extends React.Component {
  state = {
    data,
  };

  componentDidMount() {
    setInterval(() => {
      let t = Date.now();

      this.setState({
        data: temp,
      });
    }, 2000);
  }

  render() {
    return (
      <Wcontainer className="demos">
        <Wpie
          height="300"
          config={{
            select: true,
            geomStyle: {
              cursor: 'pointer',
            },
          }}
          data={this.state.data}
        />
      </Wcontainer>
    );
  }
}

const stories = storiesOf('Wpie', module);

stories.add('饼图', () => (
  <Wcontainer className="demos">
    <Wpie
      width={300}
      height="300"
      config={{
        label: true,
        // outerRadius: 0.5,
        legend: {
          // align: 'top',
          // padding: [20, 0, 0, 20]
          // nameFormatter(v) {
          //   return v + v;
          // },
          // valueFormatter(v) {
          //   return `${v}%`;
          // },
          unit: '¥',
          "needUnitTransform": true,
          "valueType": "money",
          decimal: 3,
        },
        cycle: true,
        innerContent: true,
        tooltip: {
          // valueFormatter(n, ...args) {
          //   // console.log(args);
          //   return n;
          // },
        },
      }}
      data={data}
    />
  </Wcontainer>
));

stories.add('饼图-为0测试', () => (
  <Wcontainer className="demos">
    <Wpie
      width={300}
      height="300"
      config={{
        legend: {
          valueFormatter(v, d) {
            return d.percent;
          },
        },
      }}
      data={data_0}
    />
  </Wcontainer>
));

stories.add('标签饼图', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        label: true,
        legend: false,
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('块可选饼图', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        select: true,
        geomStyle: {
          cursor: 'pointer',
        },
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('环图', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        cycle: true,
        showDecoration: {
          // innerRadius: 100 // 自定义圆环底
        },
      }}
      data={data}
    />
  </Wcontainer>
));
stories.add('带内容环图', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        cycle: true,
      }}
      data={data}
    >
      <Wnumber bottomTitle="现代浏览器占比" unit="%">
        72.5
      </Wnumber>
    </Wpie>
  </Wcontainer>
));
stories.add('带点选饼图', () => (
  <Wcontainer className="demos">
    <NewData />
  </Wcontainer>
));
stories.add('带标签环图', () => (
  <Wcontainer className="demos">
    <Wpie
      height="300"
      config={{
        cycle: true,
        label: true,
        legend: false,
      }}
      data={data}
    />
  </Wcontainer>
));
// stories.add('仪表盘', () => (
//   <WdashboardDemo data={11} className="demos"/>
// ));

stories.add('饼图数据从有到无', () => {
  const [d, setD] = useState(data);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD([]);
      // setD([{ name: '浏览器占比', data: [] }]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wpie
        height="300"
        config={{
          cycle: true,
          tooltip: {
            valueFormatter: function (v, data) {
              return v + '%';
            },
          },
          legend: {
            valueFormatter: function (v, data) {
              return v + '%';
            },
          },
        }}
        data={d}
      />
    </Wcontainer>
  );
});

stories.add('饼图数据从无到有', () => {
  const [d, setD] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setD(data);
      // setD([{ name: '浏览器占比', data: [] }]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wpie
        height="300"
        config={{
          cycle: true,
          tooltip: {
            valueFormatter: function (v, data) {
              return v + '%';
            },
          },
          legend: {
            valueFormatter: function (v, data) {
              return v + '%';
            },
          },
        }}
        data={d}
      >
        <Wnumber bottomTitle="现代浏览器占比" unit="%">
          72.5
        </Wnumber>
      </Wpie>
    </Wcontainer>
  );
});

stories.add('限定角度', () => (
  <Wcontainer className="demos">
    <Wpie
      width={500}
      height="300"
      config={{
        cycle: true,
        startAngle: Math.PI,
        endAngle: 1.5 * Math.PI,
        // outerRadius: 1,
      }}
      data={data}
    >
      asdklfh
    </Wpie>
  </Wcontainer>
));

const longData = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
      ['Firefox111Firefox111', 45.0],
      ['IE111IE111', 26.8],
      ['Chrome111Chrome111', 12.8],
      ['Safari111Safari111', 8.5],
      ['Opera111Opera111', 6.2],
      ['Others111Others222', 0.7],
      ['Firefox111Firefox222', 45.0],
      ['IE111IE222', 26.8],
      ['Chrome111Chrome222', 12.8],
      ['Safari111Safari222', 8.5],
      ['Opera111Opera222', 6.2],
      ['Others111Others222', 0.7],
      ['Chrome111Chrome333', 12.8],
      ['Safari111Safari333', 8.5],
      ['Opera111Opera333', 6.2],
      ['Others111Others333', 0.7],
    ],
  },
];
stories.add('饼图图例切分', () => (
  <Wcontainer className="demos">
    <Wpie
      width={380}
      height="240"
      config={{
        legend: {
          customConfig: {
            // maxWidth: 300,
            // maxItemWidth: 300,
            // maxWidthRatio: 0.5,
          },
        },
      }}
      data={longData}
    />
  </Wcontainer>
));

const zeroData = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 0],
      ['Others', 0],
    ],
  },
];

stories.add('可筛选为全0的饼图', () => (
  <Wcontainer className="demos">
    <Wpie
      width={300}
      height="300"
      data={zeroData}
      config={{
        legend: {
          valueFormatter(v, d) {
            return d.percent;
          },
        },
      }}
    />
  </Wcontainer>
));

stories.add('饼图-蜘蛛标签', () => (
  <Wcontainer className="demos">
    <Wpie
      width={300}
      height="300"
      data={[
        {
          name: '浏览器占比',
          data: [
            ['Firefox', 45.0],
            ['IE', 26.8],
            ['Chrome', 32.8],
            ['Safari', 28.5],
            ['Opera', 18.5],
          ],
        },
      ]}
      config={{
        cycle: true,
        outerRadius: 0.4, // 动态调整
        legend: false,
        label: {
          layout: [
            { type: 'pie-spider' },
            { type: 'limit-in-plot', cfg: { action: 'translate' /** 或 ellipsis */ } },
          ],
          labelFormatter: (v, datam) => {
            return `${datam?._origin?.x}(${v})`;
          },
        },
      }}
    />
  </Wcontainer>
));

stories.add('自动填充中心内容', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <Wcontainer className="demos">
      <Wpie
        width={300}
        height="300"
        data={data}
        loading={loading}
        config={{
          cycle: true,
          innerContent: true,
        }}
      />
    </Wcontainer>
  );
});

stories.add('大数据判断', () => (
  <Wcontainer className="demos">
    <Wpie
      width={300}
      height="300"
      data={extermeData}
      config={{
        cycle: true,
        // 增加间隔后推荐增加点击效果
        // 保证占比小的数据的显示
        select: true,
        // geomStyle(x, y, type) {
        //   return {
        //     stroke: themes['widgets-color-background'],
        //     lineWidth: 2,
        //     cursor: 'pointer',
        //   };
        // },
        innerContent: {
          value: 40000
        },
        autoFormat: {
          // percent: 0.05
        },
        // legend: {
        //   position: 'bottom',
        //   align: 'center',
        //   collapseRow: Math.ceil(extermeData[0].data.length / 2),
        //   customConfig: {
        //     // pageNavigator: false
        //   }
        // }
      }}
    />
  </Wcontainer>
));

const testData = [
  {
    name: '浏览器占比',
    data: [
      ['Firefox', 0],
      ['IE', 0],
      ['Chrome', 0],
    ],
  },
];

stories.add('环图bug', () => {
  useEffect(() => {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('setAiscWidgetsLanguage', { detail: 'en-us' }));
    }, 3000);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wpie
        height="300"
        data={testData}
        config={{
          cycle: true,
        }}
      />
    </Wcontainer>
  );
});