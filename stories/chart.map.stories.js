import React, { useState, useEffect, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wcontainer, Wmap, Wplaceholder } from '@alife/aisc-widgets';
import adcodeMap from './data/adcode.json';
import { registerComponentController, registerAction, registerInteraction } from '@antv/g2';
import Gestrue from '@antv/g2/esm/chart/controller/gesture';

registerComponentController('gesture', Gestrue);

import TransformAction from '@antv/g2/esm/interaction/action/view/scale-transform';

const log = action('action');

class Pinch extends TransformAction {
  zoomRatio = 0.05;
  zoomMin = 1;
  zoomMax = 3;
  current = 1;
  /**
   * 缩小
   */
  // zoomIn() {
  //   this.zoom(this.zoomRatio);
  // }

  zoom() {
    const { zoom = 1, direction } = this.context.event;
    const { current, zoomMax, zoomMin, zoomRatio } = this;
    log('pinch', zoom, direction);
    let scale = 0;
    // 放大
    if (zoom > 1 || direction === 'up') {
      scale -= zoomRatio;
    }
    // 缩小
    if (zoom < 1 || direction === 'down') {
      scale += zoomRatio;
    }
    if (!scale) {
      return;
    }
    this.zoomScale(scale);
    // const dims = this.dims;
    // const [xRange, yRange] = dims.map((dim) => {
    //   return this.zoomDim(dim, scale);
    // });


    const xScale = this.getScale('x');
    const yScale = this.getScale('y');
    // console.log(xScale);
    // console.log('r', (xScale.max - xScale.min) / (yScale.max - yScale.min));
    // console.log('nowXRange', xScale.max - xScale.min);


    this.context.view.getRootView().render(true);
  }

  // 等比例缩放
  zoomScale(ratio) {
    const view = this.context.view;
    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (!this.cacheScaleDefs.x) {
      this.cacheScaleDefs.x = {
        // @ts-ignore
        nice: xScale.nice,
        min: xScale.min,
        max: xScale.max,
      };
    }
    if (!this.cacheScaleDefs.y) {
      this.cacheScaleDefs.y = {
        // @ts-ignore
        nice: yScale.nice,
        min: yScale.min,
        max: yScale.max,
      };
    }
    // 原始比例
    const wh = (this.cacheScaleDefs.x.max - this.cacheScaleDefs.x.min) / (this.cacheScaleDefs.y.max - this.cacheScaleDefs.y.min);
    // 使用使用原始度量作为缩放标准
    const xScaleDef = this.cacheScaleDefs.x;
    const xRange = xScaleDef.max - xScaleDef.min;
    const { min, max } = xScale;
    const d = ratio * xRange;
    const toMin = min - d;
    const toMax = max + d;
    const curXRange = toMax - toMin;
    console.log('targetXRange', curXRange, d);
    // const scaled = curRange / xRange;
    // if (toMax > toMin && scaled < 500 && scaled > 0.01) {
      view.scale(xScale.field, {
        // @ts-ignore
        sync: true,
        nice: false,
        min: toMin,
        max: toMax,
      });
    // }

    const targetYRange = curXRange / wh;
    const { min: yMin, max: yMax } = yScale;
    const curYRange = yMax - yMin;
    const yD = (targetYRange - curYRange) / 2;

    view.scale(yScale.field, {
      // @ts-ignore
      sync: true,
      nice: false,
      min: yMin - yD,
      max: yMax + yD,
    });
  }

  /**
   * 放大
   */
  // zoomOut() {
  //   this.zoom(-1 * this.zoomRatio);
  // }

  // 缩放度量
  zoomDim(dim, dRatio) {
    if (this.hasDim(dim)) {
      const scale = this.getScale(dim);
      if (scale.isLinear) {
        return this.zoomLinear(dim, scale, dRatio);
      }
      //  else { // 暂时仅处理连续字段
      // this.zoomCategory(dim, scale, normalPoint);
      // }
    }
  }
  // linear 度量平移
  zoomLinear(dim, scale, dRatio) {
    const view = this.context.view;
    // 只有第一次缓存，否则无法回滚
    if (!this.cacheScaleDefs[dim]) {
      this.cacheScaleDefs[dim] = {
        // @ts-ignore
        nice: scale.nice,
        min: scale.min,
        max: scale.max,
      };
    }
    // 使用使用原始度量作为缩放标准
    const scaleDef = this.cacheScaleDefs[dim];
    const range = scaleDef.max - scaleDef.min;
    const { min, max } = scale;
    const d = dRatio * range;
    const toMin = min - d;
    const toMax = max + d;
    const curRange = toMax - toMin;
    const scaled = curRange / range;
    if (toMax > toMin && scaled < 500 && scaled > 0.01) {
      view.scale(scale.field, {
        // @ts-ignore
        sync: true,
        nice: false,
        min: min - d,
        max: max + d,
      });

      console.log(dim, scaled);

      return range;
    }
  }
}
registerAction('pinch', Pinch);

registerInteraction('view-pinch', {
  start: [
    {
      trigger: 'pan',
      isEnable(context) {
        // log('pan', context.event);
        // console.log(context.event);
        context.event.originalEvent.preventDefault();
        return true;
      },
      action: 'pinch:zoom',
      throttle: { wait: 100, leading: true, trailing: false },
    },
    {
      trigger: 'pinch',
      isEnable(context) {
        // const { points, zoom, center } = ev;
        // log('pinch', context.event.zoom, context.event.center);
        context.event.originalEvent.preventDefault();
        return true;
      },
      action: 'pinch:zoom',
      throttle: { wait: 100, leading: true, trailing: false },
    },
    // {
    //   trigger: 'plot:pinch',
    //   isEnable(context) {
    //     log('plot:pinch');
    //     context.event.gEvent.preventDefault();
    //     return false;
    //   },
    //   action: 'pinch:zoomOut',
    //   throttle: { wait: 100, leading: true, trailing: false },
    // },
    // {
    //   trigger: 'plot:pinch',
    //   isEnable(context) {
    //     log('plot:pinch');
    //     context.event.gEvent.preventDefault();
    //     return true
    //   },
    //   action: 'pinch:zoomIn',
    //   throttle: { wait: 100, leading: true, trailing: false },
    // },
  ],
})

const mList = document.getElementsByName('viewport');
if (mList && mList[0]) {
  mList[0].content = 'width=device-width, initial-scale=1, user-scalable=0';
}

if (window !== window.parent) {
  const pMList = window.parent.document.getElementsByName('viewport');
  if (pMList && pMList[0]) {
    pMList[0].content = 'width=device-width, initial-scale=1, user-scalable=0';
  }
}

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
    // console.log(ref.current.bgMapView.getXScale());
    // console.log(ref.current.bgMapView.getYScales());
    // ref.current.bgMapView.interaction('view-pinch');

    // ref.current.chart.on('polygon:click', (ev) => {
    //   // const { points } = ev;
    //   console.log('pan', ev.data.data);
    // });
  }, []);
  return (
    <Wcontainer className="demos" width={400} height={600}>
      <Wmap
        config={{
          tooltip: false,
          legend: false,
        }}
        ref={ref}
      >
        <Wmap.Area data={areaData} />
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

// let maxDepth = 0;
// function getTreeDepth(data, depth) {
//   if (depth > maxDepth) {
//     maxDepth = depth;
//   }
//   data.forEach((d) => {
//     if (Array.isArray(d)) {
//       getTreeDepth(d, depth + 1);
//     }
//   });
// }
// getTreeDepth(taiwanData60.features[0].geometry.coordinates, 0);
// taiwanData60.features[0].geometry.coordinates.forEach((polygon) => {
//   polygon[0].reverse();
// });
// console.log(maxDepth);
stories.add('自定义地图数据', () => {
  const [loading, setLoading] = React.useState(false);
  const [geoData, setGeoData] = React.useState(undefined);

  React.useEffect(() => {
    setLoading(true);
    // 示例中使用 DataV.GeoAtlas 工具作为数据源：https://datav.aliyun.com/tools/atlas/
    // 实际使用请使用静态化数据保证稳定性。
    fetch('https://geo.datav.aliyun.com/areas_v2/bound/330000_full.json')
      .then(res => res.json())
      .then((res) => {
        setGeoData(res);
        setLoading(false);
      })
      .catch(e => {
        setGeoData(undefined);
        setLoading(false);
      });
  }, []);

  return (
    <Wcontainer>
      {
        loading ? <Wplaceholder loading /> : (
          <Wmap height={500} geoData={geoData} config={{
            label: true,
            showSouthChinaSea: false,
          }} />
        )
      }
    </Wcontainer>
  );
});

stories.add('地图数据选择器', () => {
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [geoData, setGeoData] = React.useState(undefined);
  const historyRef = React.useRef([]);

  React.useEffect(() => {
    if (code) {
      setLoading(true);
      // 示例中使用 DataV.GeoAtlas 工具作为数据源：https://datav.aliyun.com/tools/atlas/
      // 实际使用请使用静态化数据保证稳定性。
      fetch(`https://geo.datav.aliyun.com/areas_v2/bound/${code}_full.json`)
        .then(res => res.json())
        .then((res) => {
          setGeoData(res);
          setLoading(false);
        })
        .catch(e => {
          setCode('');
          setGeoData(undefined);
          setLoading(false);
        });
    } else {
      setLoading(true);
      setGeoData(undefined);
      requestAnimationFrame(() => {
        setLoading(false);
      });
    }
  }, [code]);

  function handleGetChart(chart) {
    if (chart) {
      chart.interaction('element-highlight');
      chart.on('polygon:click', function (e) {
        const name = e && e.data && e.data.data && e.data.data.name
        if (name && adcodeMap[name]) {
          historyRef.current.push({
            name,
            adcode: adcodeMap[name],
          });
          setCode(adcodeMap[name]);
        }
      });
    }
  }

  return (
    <Wcontainer>
      {
        loading ? <Wplaceholder loading /> : (
          <Wmap height={500} geoData={geoData} config={{
            label: true,
            showSouthChinaSea: false,
            background: {
              cursor: 'pointer'
            }
          }} getChartInstance={handleGetChart} />
        )
      }
      {
        code && (
          <div>
            当前区域：{historyRef.current[historyRef.current.length - 1].name}
            <button onClick={() => {
              historyRef.current.pop();
              if (historyRef.current.length === 0) {
                setCode('');
              } else {
                setCode(historyRef.current[historyRef.current.length - 1].adcode);
              }
            }}>返回上一级</button>
            <a href={`https://geo.datav.aliyun.com/areas_v2/bound/${code}_full.json`} target="_blank">下载数据</a>
          </div>
        )
      }
    </Wcontainer>
  );
});


function useJsonp() {
  const [data, setData] = useState();
  useEffect(() => {
    const callbackFuncName = `jsonpCallback_${Math.random().toString(36).substring(2)}`;
    const scriptEl = addScript(`http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/202106?callback=${callbackFuncName}&_=${Date.now()}`);

    window[callbackFuncName] = (res) => {
      setData(res && res[0]);
      removeScript(scriptEl);
      window[callbackFuncName] = undefined;
    };
  }, []);

  return data;
}

function addScript(src) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.src = src;
  document.body.appendChild(script);
  return script;
}

function removeScript(script) {
  document.body.removeChild(script);
}

const colorMap = {
  '热带低压': '#0aff00',
  '热带风暴': '#0164ff',
  '强热带风暴': '#fffb05',
  '台风': '#ffad02',
  '强台风': '#f170f9',
  '超强台风': '#fe0305',
}

const projection = Wmap.getGeoProjection('geoConicEqualArea')
projection
  // @ts-ignore
  .center([0, 36.4])
  .parallels([25, 47])
  .scale(1000)
  .rotate([-105, 0])
  .translate([0, 0])
  .clipExtent([[-100, -100], [960, 500]]);

const config = {
  projection,
}

stories.add('台风路线图', () => {
  const mapRef = useRef();
  const data = useJsonp();
  const [points, setPoints] = useState([]);
  useEffect(() => {
    if (data && mapRef.current) {
      const list = data.points.map((d) => {
        return {
          color: colorMap[d.strong],
          ...mapRef.current.convertPosition({
            lat: d.lat,
            lng: d.lng,
          }),
        };
      });
      setPoints(list);
    }
  }, [data, mapRef.current]);
  return (
    <div style={{ position: 'relative' }}>
      <Wmap height={400} ref={mapRef} config={config} />
      {
        points.length > 0 && (
          <div>
            <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
              <path d={`M${points.map(p => `${p.x},${p.y}`).join(' L')}`} fill="none" stroke="#0164ff" />
              <g>
                {
                  points.map((d, i) => {
                    return <circle cx={d.x} cy={d.y} fill={d.color} r={2} />
                  })
                }
              </g>
            </svg>
            <img
              style={{
                position: 'absolute',
                top: points[points.length - 1].y - 20,
                left: points[points.length - 1].x - 20,
              }}
              src="http://typhoon.zjwater.gov.cn/images/typhoon.gif"
            />
          </div>
        )
      }
    </div>
  );
});
