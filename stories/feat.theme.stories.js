import React, { useEffect, useMemo, useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select, color } from '@storybook/addon-knobs';

import { themes, Wcontainer, Wline, Wbar, Wlinebar } from '@alicloud/cloud-charts';
import { isContrastColorWhite } from '@antv/g2/esm/util/color';

const data = [
  {
    name: '机房A',
    data: [
      [1483372800000, 4092],
      [1483459200000, 1592],
      [1483545600000, 3714],
      [1483632000000, 4854],
      [1483718400000, 6514],
      [1483804800000, 9022],
      [1483891200000, 6023],
      [1483977600000, 4018],
    ],
  },
  {
    name: '机房B',
    yAxis: 1,
    data: [
      [1483372800000, 6051],
      [1483459200000, 3278],
      [1483545600000, 5175],
      [1483632000000, 6548],
      [1483718400000, 9048],
      [1483804800000, 11394],
      [1483891200000, 8597],
      [1483977600000, 6588],
    ],
  },
];

const lineBarData = [
  {
    name: '机房1',
    type: 'bar',
    data: [
      [1483372800000, 1892],
      [1483459200000, 7292],
      [1483545600000, 5714],
      [1483632000000, 5354],
      [1483718400000, 2014],
      [1483804800000, 22],
      [1483891200000, 11023],
      [1483977600000, 5218],
      [1484064000000, 8759],
      [1484150400000, 9981],
      [1484236800000, 4533],
      [1484323200000, 11398],
      [1484409600000, 1064],
      [1484496000000, 6494],
    ],
  },
  {
    name: '机房2',
    type: 'bar',
    data: [
      [1483372800000, 182],
      [1483459200000, 792],
      [1483545600000, 514],
      [1483632000000, 554],
      [1483718400000, 204],
      [1483804800000, 22],
      [1483891200000, 1023],
      [1483977600000, 528],
      [1484064000000, 879],
      [1484150400000, 981],
      [1484236800000, 453],
      [1484323200000, 1198],
      [1484409600000, 1064],
      [1484496000000, 694],
    ],
  },
  {
    name: '机房3',
    type: 'line',
    yAxis: 1,
    data: [
      [1483372800000, 11751],
      [1483459200000, 4078],
      [1483545600000, 2175],
      [1483632000000, 12048],
      [1483718400000, 1748],
      [1483804800000, 10494],
      [1483891200000, 9597],
      [1483977600000, 4788],
      [1484064000000, 2085],
      [1484150400000, 492],
      [1484236800000, 2965],
      [1484323200000, 4246],
      [1484409600000, 2160],
      [1484496000000, 11877],
    ],
  },
  {
    name: '机房4',
    type: 'line',
    yAxis: 1,
    data: [
      [1483372800000, 1151],
      [1483459200000, 4778],
      [1483545600000, 21175],
      [1483632000000, 19048],
      [1483718400000, 14748],
      [1483804800000, 18494],
      [1483891200000, 10597],
      [1483977600000, 8788],
      [1484064000000, 12985],
      [1484150400000, 2492],
      [1484236800000, 5965],
      [1484323200000, 10246],
      [1484409600000, 12160],
      [1484496000000, 6877],
    ],
  },
];

const stories = storiesOf('theme', module);
stories.addDecorator(withKnobs);

const config1 = {
  percentage: false,
  // unit: '个',
  gaugeScale: {
    scaleNum: 9,
    // scale: false,
  },
}

function ThemeDemo() {
  const theme = select(
    '主题',
    {
      默认: 'normal',
      暗色: 'dark',
      自定义: {
        name: 'customTheme',
        'widgets-container-background': '#f2f3f7',
      },
    },
    themes.name,
  );

  useMemo(() => {
    themes.setTheme(theme);
  }, [theme]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wplaceholder loading height={200} />
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wplaceholder noData height={200} language={'en-us'} />
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wline height="200" data={[]} language={'en-us'} />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wcontainer className="demos">
            <Wline
              height="300"
              data={data}
              config={{
                area: true,
                colors: ['#00FFFF'],
                areaColors: ['l(90) 0:#000000 1:#00FFFF00'], // 颜色渐变
              }}
            />
          </Wcontainer>
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wcontainer className="demos">
            <Wbar
              height="300"
              config={{
                xAxis: {
                  type: 'timeCat',
                },
                colors: ['#131313'],
                stack: true,
                label: {
                  position: 'middle',
                },
              }}
              data={data}
            />
          </Wcontainer>
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wcontainer className="demos">
            <Wlinebar
              height="300"
              data={lineBarData}
              config={{
                label: {
                  position: 'middle',
                },
              }}
            />
          </Wcontainer>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wpie
            height={200}
            data={[
              {
                name: '浏览器占比',
                data: [
                  ['Firefox', 45.0],
                  ['IE', 26.8],
                  ['Chrome', 12.8],
                  ['Safari', 8.5],
                  ['Opera', 6.2],
                  ['Others', 0.7],
                ],
              },
            ]}
          />
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wbar
            data={data}
            height={200}
            language={'en-us'}
            config={{
              xAxis: {
                type: 'timeCat',
                autoRotate: true,
                autoHide: false,
                // autoEllipsis: true
              },
            }}
          />
        </div>
        <div style={{ flex: '1 1 33.33%' }}>
          <Wline height="200" data={data} language={'en-us'} />
        </div>
      </div>
    </div>
  );
}

stories.add('主题动态切换', () => <ThemeDemo />);

stories.add('亮暗颜色判断测试', () => {
  const bg = color('背景色', '#fff');
  const isDark = isContrastColorWhite(bg);
  return (
    <div style={{ width: 300, height: 300, background: bg }}>
      <span style={{ color: isDark ? '#fff' : '#333' }}>isDark: {String(isDark)}</span>
    </div>
  );
});

stories.add('颜色变量测试', () => {
  return (
    <div>
      <Wbar
        height="300"
        config={{
          xAxis: {
            type: 'timeCat',
          },
          colors: ['error', 'warning'],
          stack: true,
        }}
        data={data}
      />
    </div>
  );
});

stories.add('loading测试', () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div style={{ height: 300 }}>
      <Wbar
        height="300"
        config={{
          xAxis: {
            type: 'timeCat',
          },
          stack: true,
        }}
        data={data}
        loading={loading}
      />
    </div>
  );
});
