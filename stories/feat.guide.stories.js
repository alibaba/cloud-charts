import React, { useEffect, useRef, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import { Wline, Wlinebar, Wbar } from '@alicloud/cloud-charts';

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

const stories = storiesOf('guide', module);
stories.addDecorator(withKnobs);

stories.add('带标注线图', () => {
  const c = {
    appendPadding: [8, 0, 0, 0],
    xAxis: {
      type: 'time',
      mask: 'YYYY-MM-DD',
    },
    guide: {
      area: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
      line: [
        {
          axis: 'x',
          value: 1650038400000,
          status: 'warning',
          text: {
            title: 'X轴测试文案',
            // position: '',
            // align: '',
            // offsetY: 20,
          },
        },
        {
          axis: 'y',
          value: 60,
          status: 'warning',
          text: {
            title: 'Y轴测试文案',
            // position: '',
            // align: '',
          },
        }
      ],
      filter: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
    },
    // symbol: true,
  };
  return (
    <Wline
      config={c}
      data={[
        {
          name: '资源健康度',
          data: [
            [1649174400000, 79],
            [1650038400000, 0],
            [1650902400000, 79.56],
            [1651766400000, 79.62],
            [1652198400000, 0],
          ],
        },
      ]}
    />
  );
});

stories.add('带标注柱图', () => {
  const c = {
    appendPadding: [8, 0, 0, 0],
    xAxis: {
      type: 'timeCat',
      mask: 'YYYY-MM-DD',
    },
    guide: {
      area: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
      line: [
        {
          axis: 'x',
          value: 1650038400000,
          status: 'warning',
          text: {
            title: 'X轴测试文案',
            // position: '',
            // align: '',
            // offsetY: 20,
          },
        },
        {
          axis: 'y',
          value: 60,
          status: 'warning',
          text: {
            title: 'Y轴测试文案',
            // position: '',
            // align: '',
          },
        }
      ],
      filter: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
    },
  };
  return (
    <Wbar
      config={c}
      data={[
        {
          name: '资源健康度',
          data: [
            [1649174400000, 79],
            [1650038400000, 0],
            [1650902400000, 79.56],
            [1651766400000, 79.62],
            [1652198400000, 0],
          ],
        },
      ]}
    />
  );
});

stories.add('带标注横向柱图', () => {
  const c = {
    appendPadding: [20, 0, 0, 0],
    xAxis: {
      type: 'timeCat',
      mask: 'YYYY-MM-DD',
    },
    guide: {
      area: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
      line: [
        {
          axis: 'x',
          value: 1650038400000,
          status: 'warning',
          text: {
            title: 'X轴测试文案',
            // position: '',
            // align: '',
            // offsetY: 20,
          },
        },
        {
          axis: 'y',
          value: 60,
          status: 'warning',
          text: {
            title: 'Y轴测试文案',
            // position: '',
            // align: '',
          },
        }
      ],
      filter: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
    },
    column: false,
  };
  return (
    <Wbar
      config={c}
      data={[
        {
          name: '资源健康度',
          data: [
            [1649174400000, 79],
            [1650038400000, 0],
            [1650902400000, 79.56],
            [1651766400000, 79.62],
            [1652198400000, 0],
          ],
        },
      ]}
    />
  );
});

stories.add('带标注分面柱图', () => {
  const c = {
    appendPadding: [0, 20, 0, 20],
    xAxis: {
      // type: 'timeCat',
      // mask: 'YYYY-MM-DD',
    },
    guide: {
      area: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
      line: [
        {
          axis: 'x',
          value: '自建',
          status: 'warning',
          text: {
            title: 'X轴测试文案',
            // position: '',
            // align: '',
            // offsetY: 20,
          },
        },
        {
          axis: 'y',
          value: 60,
          status: 'warning',
          text: {
            title: 'Y轴测试文案',
            // position: '',
            // align: '',
          },
        }
      ],
      filter: {
        axis: 'y',
        value: [51, 70],
        status: 'warning',
      },
    },
    facet: true,
  };
  return (
    <Wbar
      config={c}
      data={[
        {
          name: '碳排量',
          data: [
            ['联通', 50.61],
            ['自建', 91.67],
          ],
          facet: '分面1',
        },
        {
          name: '度电排量',
          data: [
            ['联通', 68],
            ['自建', 92],
          ],
          facet: '分面2',
        },
      ]}
    />
  );
});

stories.add('带标注线柱图', () => {
  const c = {
    xAxis: {
      type: 'timeCat',
      mask: 'YYYY-MM-DD',
    },
    guide: {
      area: {
        axis: 'y',
        value: [5100, 7000],
        status: 'warning',
      },
      line: {
        axis: 'y',
        value: 6000,
        status: 'warning',
        text: {
          title: '测试文案',
          // position: '',
          // align: '',
        },
      },
      filter: {
        axis: 'y',
        value: [5100, 7000],
        status: 'warning',
      },
    },
    symbol: true,
  };
  return (
    <Wlinebar
      config={c}
      data={lineBarData}
    />
  );
});
