import React, { useState, useEffect, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wcontainer, Wmap } from '@alicloud/cloud-charts';

const areaData = [
  {
    "name": "一",
    "data": [
      {
        "name": "北京",
        "value": 10
      },
      {
        "name": "天津",
        "value": 18
      },
      {
        "name": "上海",
        "value": 22
      },
      {
        "name": "重庆",
        "value": 39
      },
      {
        "name": "内蒙古",
        "value": 22
      },
      {
        "name": "广西",
        "value": 43
      }
    ]
  },
  {
    "name": "二",
    "data": [
      {
        "name": "西藏",
        "value": 56
      },
      {
        "name": "宁夏",
        "value": 65
      },
      {
        "name": "新疆",
        "value": 69
      },
      {
        "name": "香港",
        "value": 22
      },
      {
        "name": "澳门",
        "value": 36
      },
      {
        "name": "江西",
        "value": 95
      }
    ]
  },
  {
    "name": "三",
    "data": [
      {
        "name": "河南",
        "value": 23
      },
      {
        "name": "四川",
        "value": 105
      },
      {
        "name": "贵州",
        "value": 141
      },
      {
        "name": "辽宁",
        "value": 33
      },
      {
        "name": "山东",
        "value": 135
      },
      {
        "name": "山西",
        "value": 115
      }
    ]
  },
  {
    "name": "四",
    "data": [
      {
        "name": "浙江",
        "value": 160
      },
      {
        "name": "海南",
        "value": 49
      },
      {
        "name": "陕西",
        "value": 140
      },
      {
        "name": "福建",
        "value": 134
      },
      {
        "name": "青海",
        "value": 197
      },
      {
        "name": "湖北",
        "value": 202
      }
    ]
  },
  {
    "name": "五",
    "data": [
      {
        "name": "甘肃",
        "value": 31
      },
      {
        "name": "安徽",
        "value": 224
      },
      {
        "name": "台湾",
        "value": 126
      },
      {
        "name": "云南",
        "value": 235
      },
      {
        "name": "黑龙江",
        "value": 72
      },
      {
        "name": "广东",
        "value": 91
      }
    ]
  },
  {
    "name": "六",
    "data": [
      {
        "name": "湖南",
        "value": 212
      },
      {
        "name": "河北",
        "value": 27
      },
      {
        "name": "吉林",
        "value": 22
      },
      {
        "name": "江苏",
        "value": 295
      }
    ]
  }
];

const pointData = [
  {
    name: '正常',
    data: [
      { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
      { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
    ]
  },
  {
    name: '异常',
    data: [
      { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
      { name: '广州', lng: 113.5107, lat: 23.2196, value: 30 },
    ]
  },
];

const customPointData = [
  { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
  { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
  { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
  { name: '广州', lng: 113.5107, lat: 23.2196, value: 30 },
  { name: '哈尔滨', lng: 127.9688, lat: 45.368, value: 50 },
  { name: '三亚', lng: 109.3716, lat: 18.3698, value: 60 },
  { name: '喀什', lng: 77.168, lat: 37.8534, value: 36 },
  { name: '自定义点', x: 20, y: 20, value: 36 },
];

const stories = storiesOf('Wmap', module);
stories.add('基础地图', () => (
  <Wcontainer className="demos" height={400}>
    <Wmap config={{}} />
  </Wcontainer>
));
stories.add('带标签基础地图', () => (
  <Wcontainer className="demos" height={400}>
    <Wmap config={{
      label: true,
      background: {
        fill: 'rgba(200,200,200,0.2)'
      }
    }} />
  </Wcontainer>
));
stories.add('区块地图', () => (
  <Wcontainer className="demos" height={400}>
    <Wmap config={{
      tooltip: {
        nameFormatter(n, ...args) {
          console.log(args);
          return n;
        }
      }
    }}>
      <Wmap.Area data={areaData} />
    </Wmap>
  </Wcontainer>
));

const baseAreaData = [
  {
    "name": "一",
    "data": [
      {
        "name": "浙江",
        "value": 43
      },
      {
        "name": "陕西",
        "value": 43
      },
      {
        "name": "青海",
        "value": 43
      },
    ]
  },
];
const outAreaData = [
  {
    "name": "二",
    "data": [
      {
        "name": "浙江",
        "value": 43
      },
      {
        "name": "陕西",
        "value": 43
      },
      {
        "name": "青海",
        "value": 43
      },
    ]
  },
];

stories.add('区块凸起地图', () => {
  const ref = useRef();
  useEffect(() => {
    console.log(ref.current);
    ref.current.bgMapView.interaction('brush');

    ref.current.chart.on('pan', (ev) => {
      // const { points } = ev;
      console.log('pan', ev);
    });
  }, []);
  return (
    <Wcontainer className="demos" height={400}>
      <Wmap
        config={{
          tooltip: false,
          legend: false,
        }}
        ref={ref}
      >
        <Wmap.Area data={baseAreaData} />
        <Wmap.Area
          config={{
            // 45ffff - 109eff
            padding: [0, 0, 8, 0],
            areaColors() {
              return 'l(90) 0:#45ffff 1:#109eff';
            },
          }}
          data={outAreaData} />
      </Wmap>
    </Wcontainer>
  );
});

stories.add('散点地图', () => (
  <Wcontainer className="demos" height={400}>
    <Wmap config={{}}>
      <Wmap.Point data={pointData} />
    </Wmap>
  </Wcontainer>
));

function Resize() {
  const [ width, useWidth ] = useState(800);
  return (
    <Wcontainer className="demos" width={width} height={600} title="动态改变大小" operation={
      <button onClick={() => {
        const w = width > 700 ? 600 : 800;
        useWidth(w);
        action('resize')(w);
        window.dispatchEvent(new Event('resize'));
      }}>resize</button>
    }>
      <Wmap config={{
        // labels: true,
      }}>
        <Wmap.Area data={areaData} />
        <Wmap.Point data={pointData} />
        <Wmap.Custom data={customPointData} render={(point, index) => <span>{index} : {point.name}</span>} />
      </Wmap>
    </Wcontainer>
  );
}
stories.add('动态改变大小', () => (
  <Resize />
));
stories.add('混合使用', () => (
  <Wcontainer className="demos" height={600}>
    <Wmap config={{
      // labels: true,
    }}>
      <Wmap.Area data={areaData} />
      <Wmap.Point data={pointData} />
      <Wmap.Custom data={customPointData} render={(point, index) => <span>{index} : {point.name}</span>} />
    </Wmap>
  </Wcontainer>
));

class Dynamic extends React.Component {
  state = {
    data: pointData,
  };

  componentDidMount() {
    setTimeout(() => {
      action('setData')([
        {
          name: '正常',
          data: [
            { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
            { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
            { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
          ]
        },
      ]);
      this.setState({
        data: [
          {
            name: '正常',
            data: [
              { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
              { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
              { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
            ]
          },
          // {
          //   name: '异常',
          //   data: [
          //     ,
          //     { name: '广州', lng: 113.5107, lat: 23.2196, value: 30 },
          //   ]
          // },
        ],
      });
    }, 2000);
  }

  render() {
    return (
      <Wcontainer className="demos" height={400}>
        <Wmap config={{}}>
          <Wmap.Point data={this.state.data} />
        </Wmap>
      </Wcontainer>
    );
  }
}
stories.add('动态数据', () => (
  <Dynamic />
));

const shootData = [
  { name: '北京', lng: 116.4551, lat: 40.2539 },
  { name: '杭州', lng: 119.5313, lat: 29.8773 },
  { name: '上海', lng: 121.4648, lat: 31.2891 },
  { name: '广州', lng: 113.5107, lat: 23.2196 },
  { name: '四川省' },
  { name: '西安' },
  { name: '哈尔滨', lng: 127.9688, lat: 45.368 },
  { name: '三亚', lng: 109.3716, lat: 18.3698 },
  { name: '喀什', lng: 77.168, lat: 37.8534 },
  { name: '自定义点1', x: -120, y: -120 },
  // { name: '自定义点2', x: 140, y: -120 },
  // { name: '自定义点3', x: 140, y: 120 },
  // { name: '自定义点4', x: -120, y: 120 },
];
function ShootDemo() {
  const log = action('setData');
  const [ width, useWidth ] = useState(800);
  const [data, setData] = useState([]);
  useEffect(() => {
    const dataLen = shootData.length;
    const changeData = () => {
      const newData = [];
      const len = Math.round(Math.random() * 10) + 10;
      for (let i = 0; i < len; i++) {
        let fIndex = Math.round(Math.random() * (dataLen - 1));
        let tIndex = (fIndex + Math.round(Math.random() * (dataLen / 2)) + 1) % dataLen;
        if (fIndex === tIndex) {
          tIndex = (fIndex + 1) % dataLen;
        }
        newData.push({
          from: Object.assign({}, shootData[fIndex]),
          to: Object.assign({}, shootData[tIndex]),
        });
      }

      log(newData);

      setData(newData);
    };

    changeData();
    const timer = setInterval(() => {
      changeData();
    }, 8000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Wcontainer className="demos" width={width} height={600} title="点击右侧测试改变大小" operation={
      <button onClick={() => {
        const w = width > 700 ? 600 : 800;
        useWidth(w);
        action('resize')(w);
        window.dispatchEvent(new Event('resize'));
      }}>resize</button>
    }>
      <Wmap>
        <Wmap.Shoot data={data} />
        <Wmap.Custom data={shootData} render={(point, index) => <span>{index} : {point.name}</span>} />
      </Wmap>
    </Wcontainer>
  );
}
stories.add('飞线地图', () => (
  <ShootDemo />
));

function DoubleShootDemo() {
  const log = action('setData');
  const log2 = action('setDoubleData');
  const shootConfig = {
    maxFps: 30,
  };
  const [data, setData] = useState([]);
  const [doubleData, setDoubleData] = useState([]);
  useEffect(() => {
    const dataLen = shootData.length;
    const changeData = () => {
      const newData = [];
      const newDoubleData = [];
      const len = Math.round(Math.random() * 10) + 10;
      for (let i = 0; i < len; i++) {
        let fIndex = Math.round(Math.random() * (dataLen - 1));
        let tIndex = (fIndex + Math.round(Math.random() * (dataLen / 2)) + 1) % dataLen;
        if (fIndex === tIndex) {
          tIndex = fIndex + 1;
        }
        newData.push({
          from: Object.assign({}, shootData[fIndex]),
          to: Object.assign({}, shootData[tIndex]),
        });
        newDoubleData.push({
          from: Object.assign({}, shootData[fIndex]),
          to: Object.assign({}, shootData[tIndex]),
        });
      }

      log(newData);
      setData(newData);

      setTimeout(() => {
        setDoubleData(newDoubleData);
        log2(newDoubleData);
      }, 4000);
    };

    changeData();
    const timer = setInterval(() => {
      changeData();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Wcontainer className="demos" height={600}>
      <Wmap>
        <Wmap.Shoot data={data} config={shootConfig} debug={1} />
        <Wmap.Shoot data={doubleData} config={shootConfig} debug={2} />
        <Wmap.Custom data={shootData} render={(point, index) => <span>{index} : {point.name}</span>} />
      </Wmap>
    </Wcontainer>
  );
}
stories.add('双层飞线地图', () => (
  <DoubleShootDemo />
));
