import React from "react";
import G2 from "g2";
import createG2 from "utils/createG2";
import { autobind } from "core-decorators";

import "./index.scss";

export default class scatterPlot extends React.Component {
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
  renderChart() {
    let { data } = this.props;
    let scaleList = data.map(item => +item.scale),
      pueList = data.map(item => +item.pue);
    let maxScale = Math.max.apply(Math, scaleList),
      maxPue = Math.max.apply(Math, pueList);
    let maxScaleNormal = this.getAmountLevel(maxScale),
      maxPueNormal = this.getAmountLevel(maxPue);
    let maxScaleAxis =
        maxScaleNormal.amount * Math.pow(10, maxScaleNormal.level),
      maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
    G2.Global.setTheme("cheery"); // 切换默认主题
    const Chart = createG2(chart => {
      chart.col("scale", {
        tickCount: 8,
        min: 0,
        max: maxScaleAxis,
        alias: "服务器数量",
      });
      chart.col("pue", {
        min: 0,
        max: maxPueAxis,
        alias: "PUE",
      });
      chart.tooltip(true, {
        map: {
          title: "idc",
          name: "scale",
          value: "pue",
        },
      });
      chart
        .point()
        .position("scale*pue")
        .color("idc")
        .shape("idc", ["circle", "triangle-down", "square", "diamond"])
        .size(5);
      // 添加辅助元素
      chart
        .guide()
        .text(
          [Math.floor(maxScaleAxis / 3 / 2 * 1), maxPueAxis - 1],
          `0 - ${Math.floor(maxScaleAxis / 3 / 2 * 2)}`,
          {
            fontSize: "15px",
          }
        );
      chart
        .guide()
        .text(
          [Math.floor(maxScaleAxis / 3 / 2 * 3), maxPueAxis - 1],
          `${Math.floor(maxScaleAxis / 3 / 2 * 2)} - ${Math.floor(
            maxScaleAxis / 3 / 2 * 4
          )}`,
          {
            fontSize: "15px",
          }
        );
      chart
        .guide()
        .text(
          [Math.floor(maxScaleAxis / 3 / 2 * 5), maxPueAxis - 1],
          `${Math.floor(maxScaleAxis / 3 / 2 * 4)} - ${Math.floor(
            maxScaleAxis / 3 / 2 * 6
          )}`,
          {
            fontSize: "15px",
          }
        );
      chart
        .guide()
        .rect([0, 0], [Math.floor(maxScaleAxis / 3 / 2 * 2), maxPueAxis]);
      chart
        .guide()
        .rect(
          [Math.floor(maxScaleAxis / 3 / 2 * 2), 0],
          [Math.floor(maxScaleAxis / 3 / 2 * 4), maxPueAxis],
          {
            fillOpacity: 0.2,
          }
        );
      chart
        .guide()
        .rect(
          [Math.floor(maxScaleAxis / 3 / 2 * 4), 0],
          [Math.floor(maxScaleAxis / 3 / 2 * 6), maxPueAxis],
          {
            fillOpacity: 0.3,
          }
        );
      chart.on("plotclick", this.props.onClick);
      chart.render();
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
      <div className="scatter-plot-container">
        {data && data.length ? (
          <Chart data={data} width={600} height={450} forceFit={true} />
        ) : (
          "无数据"
        )}
      </div>
    );
  }
}
