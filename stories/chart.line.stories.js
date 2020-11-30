import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wcontainer, Wline } from '@alife/aisc-widgets';

const data = [
  {
    "name":"机房A",
    "data":[[1483372800000,4092],[1483459200000,1592],[1483545600000,3714],[1483632000000,4854],[1483718400000,6514],[1483804800000,9022],[1483891200000,6023],[1483977600000,4018]]
  }, {
    "name":"机房B",
    "yAxis": 1,
    visible: false,
    "data":[[1483372800000,6051],[1483459200000,3278],[1483545600000,5175],[1483632000000,6548],[1483718400000,9048],[1483804800000,11394],[1483891200000,8597],[1483977600000,6588]]
  }
];

const stories = storiesOf('Wline', module);
stories.addDecorator(withKnobs);

stories.add('折线图', () => (
    <Wline height="300" data={data} />
));
stories.add('平滑曲线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      spline: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带点折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      symbol: true
    }} data={data} />
  </Wcontainer>
));
stories.add('面积折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      area: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('面积曲线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      area: true,
      spline: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('堆叠面积图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      area: true,
      stack: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带网格线', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      grid: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('双轴折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      yAxis: [{}, {}],
      area: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('拖拽缩放', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      zoom: true,
    }} data={data} event={{
      'zoom:start': (s) => {
        action('zoom:start')(s);
      },
      'zoom:end': (s) => {
        action('zoom:end')(s);
      },
      'zoom:reset': (s) => {
        action('zoom:reset')(s);
      }
    }} />
  </Wcontainer>
));

const stepOptions = {
  '关闭': null,
  '默认': true,
  '水平-垂直': 'hv',
  '垂直-水平': 'vh',
  '水平-垂直-水平': 'hvh',
  '垂直-水平-垂直': 'vhv',
};
stories.add('阶梯折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      step: select('阶梯形状', stepOptions, null),
    }} data={data} />
  </Wcontainer>
));

const singleData = [
  {
    "name":"机房A",
    "data":[[1483632000000,4854]]
  }, {
    "name":"机房B",
    "yAxis": 1,
    "data":[[1483632000000,6548]]
  }
];
stories.add('单个点折线图', () => (
  <Wcontainer className="demos">
    <Wline height="300" data={singleData} />
  </Wcontainer>
));
stories.add('Tooltip 设置', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      tooltip: {
        titleFormatter: function(v) {
          return 'title: ' + v;
        },
        nameFormatter: function(v) {
          return 'name: ' + v;
        },
        valueFormatter: function(v) {
          return 'value: ' + v;
        },
      }
    }} data={data} />
  </Wcontainer>
));


const data1 = [];
const data2 = [];

let now = Date.now();
for(var i = 0; i < 30; i++) {
  let t = now - (30 - i) * 1000;
  data1.push([t, Math.round(Math.random() * 60) + 300]);
  data2.push([t, Math.round(Math.random() * 60) + 300]);
}
class NewData extends React.Component {
  state = {
    data: [
      {
        "name":"机房A",
        "data": data1
      },{
        "name":"机房B",
        "data": data2
      }
    ]
  }

  componentDidMount() {
    setInterval(() => {
      let t = Date.now();

      data1.push([t, Math.round(Math.random() * 60) + 300]);
      data2.push([t, Math.round(Math.random() * 60) + 300]);

      data1.shift();
      data2.shift();

      this.setState({
        data: [
          {
            "name":"机房A",
            "data": data1
          },{
            "name":"机房B",
            "data": data2
          }
        ]
      })
    }, 1000);
  }

  render(){
    return (
      <Wcontainer className="demos">
        <Wline height="300" config={{}} data={this.state.data}/>
      </Wcontainer>
    );
  }
}
stories.add('动态数据', () => (
  <NewData />
));

stories.add('带辅助标记', () => (
  <Wcontainer className="demos">
    <Wline height="300" config={{
      guide: {
        line: {
          top: true,
          text: '80%',
          status: 'error',
          axis: 'y',
          value: 5000,
        },
        filter: {
          status: 'error', // normal | success | warning | error
          // 区域位置
          axis: 'x',
          value: [1483718400000, 'max'],
        },
      },
    }} data={[]} />
  </Wcontainer>
));


// // 齐全度展示图
// const attendData = [
//   {
//     x: 1483372800000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483459200000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483545600000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483632000000,
//     y: 1,
//     type: 'error',
//   },
//   {
//     x: 1483718400000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483804800000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483891200000,
//     y: 1,
//     type: 'normal',
//   },
//   {
//     x: 1483977600000,
//     y: 1,
//     type: 'error'
//   }
// ].map(d => {
//   return {
//     ...d,
//     detail: [
//       { name: 'all', value: 100 },
//       { name: '111', value: 80 },
//       { name: '222', value: 20 },
//     ],
//   };
// });
//
// const attendCustomChart = {
//   // 不转换格式
//   convertData: false,
//   init(chart, config, data) {
//     chart.source(data, {
//       x: {
//         type: 'timeCat',
//         mask: 'YYYY-MM-DD HH:mm:ss',
//       },
//       // 柱高度为 0～1，设置 Y 轴跨度为 -1～2，保证柱高度占中心三分之一
//       y: {
//         min: -1,
//         max: 2,
//       }
//     });
//
//     // 关闭坐标轴
//     chart.axis(false);
//
//     // 关闭图例
//     chart.legend(false);
//
//     chart.tooltip({
//       crosshairs: {
//         type: 'y'
//       },
//       inPlot: false,
//     });
//
//     // 自定义 tooltip 展示
//     chart.on('tooltip:change', function(ev) {
//       const items = ev.items; // tooltip显示的项
//       const origin = items[0]; // 将一条数据改成多条数据
//       const detail = origin.point._origin.detail;
//       items.splice(0); // 清空
//       detail.forEach((d) => {
//         const color = d.value < 100 ? Util.getStatusColor('error') : Util.getStatusColor('success');
//         items.push(Object.assign({}, origin, {
//           name: d.name,
//           value: d.value,
//           color: color,
//           marker: {
//             ...origin.marker,
//             fill: color,
//           },
//         }));
//       });
//     });
//
//     // 柱图模拟多色直线
//     chart.interval()
//       .position('x*y')
//       .shape('funnel')
//       .color('type', (type) => {
//         if (type === 'error') {
//           return Util.getStatusColor('error');
//         }
//         return Util.getStatusColor('success');
//       });
//
//     chart.render();
//   }
// };
//
// function Attend() {
//   return (
//     <Wcontainer>
//       <Wline height="24" data={attendData} customChart={attendCustomChart} />
//     </Wcontainer>
//   );
// }
// stories.add('齐全度展示图', () => (
//   <Attend />
// ));
