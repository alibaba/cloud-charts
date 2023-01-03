import React, { useEffect, useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, array } from "@storybook/addon-knobs";

import { Wpie, Wnumber, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ]
  }
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
    data
  }

  componentDidMount() {
    setInterval(() => {
      let t = Date.now();

      this.setState({
        data: temp,
      })
    }, 2000);
  }

  render(){
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
        // outerRadius: 0.5,
        legend: {
          // align: 'top',
          // padding: [20, 0, 0, 20]
          nameFormatter(v) {
            return v + v;
          },
          valueFormatter(v) {
            return `${v}%`;
          },
        },
        tooltip: {
          valueFormatter(n, ...args) {
            // console.log(args);
            return n;
          },
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
            valueFormatter: function(v, data) {
              return v + '%'
            },
          },
          legend: {
            valueFormatter: function(v, data){
              return v + '%';
            }
          }
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
            valueFormatter: function(v, data) {
              return v + '%'
            },
          },
          legend: {
            valueFormatter: function(v, data){
              return v + '%';
            }
          }
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
