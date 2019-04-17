import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import classnames from 'classnames';
import { Grid } from '@alife/aisc';
import * as Widgets from '@alife/aisc-widgets';

window.AiscWidgets = Widgets;

const { Row, Col } = Grid;

const pageList = [
  {"name":"线图","id":7,"examples":[{"name":"基本","id":9,"description":"最简单的用法。"},{"name":"轴设置","id":10,"description":"通过 xAxis 和 yAxis 设置轴。"},{"name":"不带提示","id":11,"description":" 设置 tooltip 为 false ，无提示窗。"},{"name":"不带图例","id":12,"description":"设置 legend 为 false，不显示图例。"},{"name":"平滑曲线","id":13,"description":"设置 spline 为 true，展示为平滑曲线。"},{"name":"线上带点","id":14,"description":"设置 symbol 为 true，展示为带点曲线。"},{"name":"网格","id":15,"description":"设置 grid 为 true，图表带横竖网格线。"},{"name":"背景","id":16,"description":"设置 yAxis.bgArea 使Y轴背景带上区间颜色。"},{"name":"图例位置","id":19,"description":"通过legend设置图例位置。"},{"name":"面积曲线","id":20,"description":"设置 area 为 true，展示为面积曲线。"},{"name":"面积堆叠曲线","id":21,"description":"设置 area 为 true，且设置 stack 为 true 展示为面积堆叠曲线。"},{"name":"双轴设置","id":22,"description":"通过将 yAxis 设置为数组设置双轴。"},{"name":"自定义提示","id":23,"description":"设置 tooltip 自定义提示。"},{"name":"图表联动","id":429,"description":"利用 event 事件和ref获得图表实例，可以实现图表间联动的效果。"},{"name":"动态数据","id":25,"description":""},{"name":"拖拽缩放","id":472,"description":"设置zoom为true，图表可以拖拽缩放。"}]},
  {"name":"柱图","id":28,"examples":[{"name":"基本","id":111,"description":""},{"name":"轴设置","id":112,"description":""},{"name":"横向柱状图","id":113,"description":""},{"name":"多组堆叠","id":114,"description":""},{"name":"不带提示也不带网格","id":116,"description":""},{"name":"带网格","id":118,"description":""},{"name":"自定义提示","id":119,"description":"设置 tooltip 自定义提示。"},{"name":"分组堆叠图","id":508,"description":"设置 dodgeStack 为 true，并且在数据中使用 'dodge' 字段区分分组。"},{"name":"镜面柱图","id":503,"description":""}]},
  {"name":"饼图","id":25,"examples":[{"name":"基本","id":96,"description":"最简单的用法。"},{"name":"标签格式化","id":97,"description":"通过设置 valueFormatter 对标签格式化。其中第二个参数中包含了数据的百分比值。配合Util工具函数格式化显示值。"},{"name":"无Tooltip","id":98,"description":"通过设置 tooltip 为 false，不显示Tooltip。"},{"name":"自定义提示","id":99,"description":"\n设置 tooltip 自定义提示。其中 tooltip.valueFormatter 第二个参数中包含了数据的百分比值。配合Util工具函数格式化显示值。"},{"name":"圆环","id":340,"description":"设置 cycle 为 true 显示为圆环。"},{"name":"带内容的圆环","id":424,"description":"在饼图组件内部传入需要显示的内容，会显示在圆环中。"},{"name":"轮播选择","id":523,"description":""}]},
  {"name":"线柱图","id":27,"examples":[{"name":"基本","id":105,"description":"最简单的用法。数据中设置不同的type来区分线和柱"},{"name":"柱状堆积","id":106,"description":"设置 stack 为 true，柱状图堆积。"},{"name":"双轴设置","id":109,"description":"通过将 yAxis 设置为数组设置双轴。"},{"name":"动态数据","id":110,"description":"动态加载数据。"}]},
  {"name":"迷你线图","id":26,"examples":[{"name":"基本","id":100,"description":"默认用法。"},{"name":"平滑曲线","id":101,"description":"设置 spline 为 true，平滑曲线。"},{"name":"面积折线","id":102,"description":"设置 area 为 true，面积折线。"},{"name":"面积曲线","id":103,"description":"设置 spline 为 true, area 为 true，面积曲线。"}]},
  {"name":"散点图","id":147,"examples":[{"name":"基本","id":341,"description":"演示了最基本的用法"},{"name":"多组数据","id":342,"description":"演示了多组数据的散点图"},{"name":"无图例","id":343,"description":"演示了无图例的散点图"},{"name":"扰动点图","id":471,"description":"设置jitter为true可以变为扰动点图。\r\n"},{"name":"气泡图","id":529,"description":"设置 config.size 为数字数组，可以将数值映射到大小中。"}]},
  {"name":"南丁格尔玫瑰图","id":150,"examples":[{"name":"基本","id":347,"description":"基本用法。"},{"name":"单色南丁格尔图","id":352,"description":"将颜色设置为单一种颜色，可以变为单色南丁格尔图。\r\n"},{"name":"带坐标轴","id":470,"description":"设置axis为true可以显示坐标轴，通过设置label.key控制label显示x轴的值还是y轴的值。\r\n"}]},
  {"name":"雷达图","id":262,"examples":[{"name":"基本","id":467,"description":"基本用法。"},{"name":"面积图","id":468,"description":"设置area为true显示面积图。\r\n"},{"name":"点图","id":469,"description":"设置symbol为true显示点图。\r\n"}]},
  {"name":"地图","id":276,"examples":[{"name":"基本","id":493,"description":"最基础用法，仅显示中国地图。"},{"name":"分级统计地图","id":494,"description":"通过 Wmap.Area 子组件来生成分级统计地图。默认的颜色支持十级分级。更多的级数需要自定义颜色。\n数据中的名称必须对应省份名称，全称/简称均可。"},{"name":"散点地图","id":495,"description":"通过 Wmap.Point 子组件来生成散点地图。\n数据中的名称建议对应城市名称，全称/简称均可。如果不对应，则需要提供经纬度（ lng: 116.4551, lat: 40.2539 ）或者坐标（ x: 200, y: 300 ）。"},{"name":"自定义点图","id":496,"description":"通过 Wmap.Custom 子组件来生成自定义点地图。数据中的名称建议对应城市名称，全称/简称均可。如果不对应，则需要提供经纬度（ lng: 116.4551, lat: 40.2539 ）或者坐标（ x: 200, y: 300 ）。"}]},
  {"name":"桑基图","id":138,"examples":[{"name":"基本","id":338,"description":""}]},
  {"name":"矩形分箱图","id":278,"examples":[{"name":"基本","id":502,"description":""}]},
  {"name":"漏斗图","id":279,"examples":[{"name":"基本","id":504,"description":""},{"name":"水平漏斗图","id":505,"description":"设置 direction 为 horizontal 变为水平漏斗图，align 的可选项会发生变化。"},{"name":"尖顶漏斗图","id":506,"description":"设置 pyramid 为 true 变为尖顶漏斗图，仅适合 align 为 'center' 的情况。"}]},
  {"name":"多重饼图","id":297,"examples":[{"name":"基本","id":526,"description":""}]},
  {"name":"箱型图","id":298,"examples":[{"name":"基本","id":527,"description":""},{"name":"分组箱型图","id":528,"description":"传入不同格式的的数据项即可进行分组绘制。"}]},
  {"name":"色块图","id":301,"examples":[{"name":"基本","id":535,"description":""}]}
];

class Demo extends React.Component {

  state = {
    col: 3,
  };

  componentDidMount() {
    // let pageList = [];
    // fetch('http://aisc.alibaba-inc.com/api/category/getSideMenuById?_input_charset=utf-8&id=4')
    //   .then(res => res.json())
    //   .then((res) => {
    //     pageList = res.result.categories[1].pages.map(p => ({ name: p.name, id: p.id }));
    //
    //     const detailList = pageList.map((page) =>{
    //       return fetch(`http://aisc.alibaba-inc.com/api/page/getDetailById?_input_charset=utf-8&id=${page.id}`).then(res => res.json());
    //     });
    //
    //     return Promise.all(detailList);
    //   })
    //   .then((details) => {
    //     details.forEach((detail, i) => {
    //       pageList[i].examples = detail.result.examples.map(e => ({ name: e.name, id: e.id, description: e.description }));
    //     });
    //
    //     console.log(pageList)
    //   });

    pageList.forEach((page) => {
      page.examples.forEach((example) => {
        const script = document.createElement("script");
        script.src = `http://aisc.alibaba-inc.com/packages/example${example.id}.js`;
        script.async = true;
        document.body.appendChild(script);
      });
    });
  }

  render() {
    const { col } = this.state;
    return (
      <div>
        {
          pageList.map((page) =>{
            return (
              <div key={page.id}>
                <h2>
                  {page.name}
                  <a className="chart-list-item-title-link" href={`http://aisc.alibaba-inc.com/site/pc#/cate/4/page/${page.id}`}>详情</a>
                </h2>
                <Row type={['wrap', 'no-padding']} gutter={20}>
                  {
                    page.examples.map((example) => {
                      return (
                        <Col key={example.id} span={24 / col} style={{ minHeight: 200 }} className="chart-list-item">
                          <h3 className="chart-list-item-title">
                            {example.name}
                            <a className="chart-list-item-title-link" href={`http://aisc.alibaba-inc.com/site/pc#/cate/4/page/${page.id}/example/${example.id}`}>详情</a>
                          </h3>
                          <div id={`aisc-example-preview-${example.id}`} />
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            );
          })
        }
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Demo />
    </AppContainer>,
    document.getElementById('container')
  )
};

render();

if (module.hot) {
  module.hot.accept( () => { render() })
}
