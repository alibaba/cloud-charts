import React, { useEffect, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import { themes, Wcontainer, Wline, Wbar, Wheatmap, ChartProvider, Util } from '@alife/aisc-widgets';

const stories = storiesOf('monitor', module);
stories.addDecorator(withKnobs);

// tooltip超出问题
stories.add('线图-秒级CPU', () => {
  const [d, setD] = useState([]);
  useEffect(() => {
    fetch('https://mocks.alibaba-inc.com/mock/lf7wkn3y//monitorCPU.json')
      .then((response) => response.json())
      .then((data) => setD(data.data));
  }, []);
  return (
    <Wcontainer className="demos">
      <Wline
        height="300"
        config={{
          tooltip: {
            columns: false,
          },
          legend: {},
        }}
        data={d}
      />
    </Wcontainer>
  );
});

// tooltip样式问题
stories.add('热力图-代码提交', () => {
  const [d, setD] = useState([]);
  useEffect(() => {
    fetch('https://mocks.alibaba-inc.com/mock/lf7wkn3y//monitorCode.json')
      .then((response) => response.json())
      .then((data) => setD(data.data));
  }, []);
  return (
    <Wcontainer className="demos">
      <Wheatmap
        height="300"
        config={{
          colors: themes.order_10.slice().reverse().join('-'),
          yAxis: {
            labelFormatter(v) {
              return `${Number(v) * 2}点 - ${Number(v) * 2 + 2}点`;
            },
          },
          legend: false,
          // label: true,
          tooltip: {
            // 自定义 tooltip 内容
            reactContent(title, data) {
              if (!title || !data.length) {
                return null;
              }
              const { x, y, type } = data[0].data;
              return (
                <div>
                  <div className="g2-tooltip-title">
                    {x} {Number(y) * 2}点 - {Number(y) * 2 + 2}点
                  </div>
                  <ul className="g2-tooltip-list">
                    {
                      <li className="g2-tooltip-list-item">
                        <span className="g2-tooltip-name">数量</span>
                        <span className="g2-tooltip-value">{type}</span>
                      </li>
                    }
                  </ul>
                </div>
              );
            },
          },
          dataType: 'g2',
        }}
        data={d}
      />
    </Wcontainer>
  );
});

stories.add('全局配置', () => {
  const [d, setD] = useState([]);
  let chart1 = null;
  let chart2 = null;
  let chart3 = null;
  let connection;

  useEffect(() => {
    connection = new Util.Connect([chart1, chart2, chart3]);
  });

  useEffect(() => {
    fetch('https://mocks.alibaba-inc.com/mock/lf7wkn3y//monitorCPU.json')
      .then((response) => response.json())
      .then((data) => setD(data.data));
  }, []);

  return (
    <ChartProvider
      language="en-US"
      rule={{
        extreme: true,
      }}
      theme={'dark'}
      defaultConfig={{
        // 单类型图表配置
        Line: {
          tooltip: {
            columns: false,
          },
        },
        Bar: {},
        // 通用配置
        baseConfig: {
          xAxis: {
            autoEllipsis: true,
          },
          tooltip: {
            position: 'left',
          },
          legend: {
            customConfig: {
              maxItemWidth: 0.7,
            },
          },
        },
      }}
    >
      <Wline height="300" width={300} data={d} getChartInstance={(c) => (chart1 = c)} />
      <Wline
        height="300"
        width={300}
        data={d}
        config={{
          tooltip: {
            columns: true,
          },
          legend: {
            customConfig: {
              maxItemWidth: 0.3,
            },
          },
        }}
        getChartInstance={(c) => (chart2 = c)}
      />
      {/* <Wbar height="300" data={d} getChartInstance={(c) => (chart3 = c)} /> */}
    </ChartProvider>
  );
});
