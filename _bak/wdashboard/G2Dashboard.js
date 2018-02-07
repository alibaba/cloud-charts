import React from "react";
import G2 from "g2";
import createG2 from "./createG2";
import { autobind } from "core-decorators";

import "../../index.scss";

const color = ["#4AD051", "#F6A71F", "#EF5350"];
// 自定义Shape 部分
let Shape = G2.Shape;
Shape.registShape("point", "dashBoard", {
  drawShape: function(cfg, group) {
    let origin = cfg.origin; // 原始数据
    let value = origin.value;
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint({
      // 将标记点转换到画布坐标
      x: point.x,
      y: 0.95,
    });
    let center = this.parsePoint({
      // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
    let r = 15;
    let ra = 0.8 * r;
    let X1 = center.x;
    let Y1 = center.y;
    let X2 = point.x;
    let Y2 = point.y;
    let B = 150 / 180;
    let Xa, Xb, Xc, Ya, Yb, Yc; // 绘制小箭头需要的三个点
    let shape;
    if (Y1 == Y2) {
      if (X1 > X2) {
        Xa = X2 + Math.cos(B) * ra;
        Ya = Y2 - Math.sin(B) * ra;
        Xb = X2 + Math.cos(B) * ra;
        Yb = Y2 + Math.sin(B) * ra;
        Xc = X2 + 2 * ra;
        Yc = Y2;
      } else {
        Xa = X2 - Math.cos(B) * ra;
        Ya = Y2 - Math.sin(B) * ra;
        Xb = X2 - Math.cos(B) * ra;
        Yb = Y2 + Math.sin(B) * ra;
        Xc = X2 - 2 * ra;
        Yc = Y2;
      }
    } else if (Y1 > Y2) {
      let A = Math.atan((X1 - X2) / (Y1 - Y2));
      Xa = X2 + ra * Math.sin(A + B);
      Ya = Y2 + ra * Math.cos(A + B);
      Xb = X2 + ra * Math.sin(A - B);
      Yb = Y2 + ra * Math.cos(A - B);
      Xc = X2 + 2 * ra * Math.sin(A);
      Yc = Y2 + 2 * ra * Math.cos(A);
    } else {
      if (X1 > X2) {
        let A = Math.atan((Y2 - Y1) / (X1 - X2));
        Xa = X2 + ra * Math.cos(A + B);
        Ya = Y2 - ra * Math.sin(A + B);
        Xb = X2 + ra * Math.cos(A - B);
        Yb = Y2 - ra * Math.sin(A - B);
        Xc = X2 + 2 * ra * Math.cos(A);
        Yc = Y2 - 2 * ra * Math.sin(A);
      } else {
        let A = Math.atan((Y2 - Y1) / (X2 - X1));
        Xa = X2 - ra * Math.cos(A - B);
        Ya = Y2 - ra * Math.sin(A - B);
        Xb = X2 - ra * Math.cos(A + B);
        Yb = Y2 - ra * Math.sin(A + B);
        Xc = X2 - 2 * ra * Math.cos(A);
        Yc = Y2 - 2 * ra * Math.sin(A);
      }
    }
    shape = group.addShape("circle", {
      attrs: {
        x: X2,
        y: Y2,
        r: r,
        fill: cfg.color,
      },
    });
    group.addShape("circle", {
      attrs: {
        x: X2,
        y: Y2,
        r: r / 2,
        fill: "white",
      },
    });
    // 添加文本1
    group.addShape("text", {
      attrs: {
        x: X1,
        y: Y1 - 25,
        text: "PUE",
        fontSize: 18,
        fill: "#CCCCCC",
        textAlign: "center",
      },
    });
    // 添加文本2
    group.addShape("text", {
      attrs: {
        x: X1,
        y: Y1 + 25,
        text: value,
        fontSize: 18,
        fill: "#F75B5B",
        textAlign: "center",
      },
    });
    group.addShape("polygon", {
      attrs: {
        points: [[Xa, Ya], [Xc, Yc], [Xb, Yb], [Xa, Ya]],
        fill: cfg.color,
      },
    });
    return shape;
  },
});

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  getAmountLevel(num) {
    num = +num;
    let eStr = num.toExponential(2);
    let temp = eStr.split("e");
    let amount = Math.floor(+temp[0]) + 1;
    let level = +temp[1];
    return { amount, level };
  }
  @autobind
  drawGuide(chart) {
    const { data } = this.props;
    const val = data[0].value;
    let pueList = data.map(item => +item.value);
    let maxPue = Math.max.apply(Math, pueList);
    let maxPueNormal = this.getAmountLevel(maxPue);
    let maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
    const lineWidth = 30;
    chart.guide().clear();
    chart.guide().arc([1, 0.95], [maxPueAxis, 0.95], {
      // 底灰色
      stroke: "#CCCCCC",
      lineWidth: lineWidth,
    });
    val - 1 > (maxPueAxis - 1) / 3 &&
      chart.guide().arc([1, 0.95], [(maxPueAxis - 1) / 3 + 1, 0.95], {
        // 低PUE
        stroke: color[0],
        lineWidth: lineWidth,
      });
    val - 1 > (maxPueAxis - 1) / 3 * 2 &&
      chart
        .guide()
        .arc(
          [(maxPueAxis - 1) / 3 + 1, 0.95],
          [(maxPueAxis - 1) / 3 * 2 + 1, 0.95],
          {
            // 中PUE
            stroke: color[1],
            lineWidth: lineWidth,
          }
        );
    val - 1 > 0 &&
      val - 1 <= (maxPueAxis - 1) / 3 &&
      chart.guide().arc([1, 0.95], [val, 0.95], {
        // 低PUE
        stroke: color[0],
        lineWidth: lineWidth,
      });
    val - 1 > (maxPueAxis - 1) / 3 &&
      val - 1 <= (maxPueAxis - 1) / 3 * 2 &&
      chart.guide().arc([(maxPueAxis - 1) / 3 + 1, 0.95], [val, 0.95], {
        // 中PUE
        stroke: color[1],
        lineWidth: lineWidth,
      });
    val - 1 > (maxPueAxis - 1) / 3 * 2 &&
      val - 1 <= maxPueAxis - 1 &&
      chart.guide().arc([(maxPueAxis - 1) / 3 * 2 + 1, 0.95], [val, 0.95], {
        // 高PUE
        stroke: color[2],
        lineWidth: lineWidth,
      });
    chart.changeData(data);
  }
  @autobind
  renderChart() {
    let { data } = this.props;
    let pueList = data.map(item => +item.value);
    let maxPue = Math.max.apply(Math, pueList);
    let maxPueNormal = this.getAmountLevel(maxPue);
    let maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
    const Chart = createG2(chart => {
      chart.coord("gauge", {
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
      });
      chart.col("value", {
        min: 1,
        max: maxPueAxis,
        tickInterval: 0.5,
      });
      chart.axis("value", {
        tickLine: {
          stroke: "#EEEEEE",
        },
        labelOffset: -26,
      });
      chart
        .point()
        .position("value")
        .shape("dashBoard")
        .color("value", function(v) {
          // 根据值的大小确定标记的颜色
          let rst;
          if (v - 1 < (maxPueAxis - 1) / 3) {
            rst = color[0];
          } else if (v - 1 < (maxPueAxis - 1) / 3 * 2) {
            rst = color[1];
          } else {
            rst = color[2];
          }
          return rst;
        });
      chart.legend(false);
      this.drawGuide(chart);
      chart.changeData();
    });
    return Chart;
  }
  render() {
    let { data } = this.props;
    let Chart;
    if (data && data.length) {
      Chart = this.renderChart();
    }
    return (
      <div className="dashboard-container">
        {data && data.length ? (
          <Chart data={data} width={600} height={550} forceFit={true} />
        ) : (
          "无数据"
        )}
      </div>
    );
  }
}
