'use strict';

import React from 'react';

export default function (props) {
  // 2018-09-17 设置 viewBox 和 preserveAspectRatio 让南海诸岛能根据图表大小缩放
  // 2020-04-09 等比例缩放，并限制最小高宽
  return React.createElement(
    'svg',
    { version: '1.1', baseProfile: 'full', width: '10%', height: '20%', className: props.className, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 64 88', preserveAspectRatio: 'xMaxYMax meet' },
    React.createElement(
      'g',
      { className: 'south-china-sea-group' },
      React.createElement(
        'text',
        { className: 'south-china-sea-name', fill: props.fontColor, x: '30', y: '85', fontSize: '8' },
        '\u5357\u6D77\u8BF8\u5C9B'
      ),
      React.createElement('path', { className: 'south-china-sea-land', fill: props.landColor, d: 'M55.9,0.8c0,0.6,0,0.4-0.2,1.1C55.4,3.1,56,2.8,56.5,4c0.4,0.8,0.2,0.4,0.9,0.8c0.7,0.4,0.9,0.5,0.9,1.2c0,0.6,0.2,0.8,0.6,0.7s0-1.1,0.2-1.9c0.2-0.9,0.6-1.2,1.1-2.2c0.2-0.5,0.3-1.4,0.4-1.7' }),
      React.createElement('path', { className: 'south-china-sea-land', fill: props.landColor, d: 'M10.9,10.6c0.3,0,0.6,0,0.6,0c0.4,0,0.7-0.1,1.2-0.2c0.6-0.2,1.6-0.2,2-0.2s0.7,0.1,0.3,0.5c-0.4,0.4,0.4,0.4,1,0.3c0.6-0.1,0.6-0.3,0.5-0.5c-0.1-0.3-0.2-0.5,0-0.7s0.3-0.3,0.5,0.4c0.2,0.6,0.8,0.4,1.1,0.6c0.3,0.2-0.4,0.5-0.7,1s-0.2,1.5,0.1,2.5c0.3,0.9,0.9,1.5,1.6,1.5s1.1-0.5,1.2-1s-0.3-1.2-0.5-1.2c-0.2-0.1-0.8-0.1-0.9-0.4c-0.1-0.3,0.2-0.7,0.6-0.7c0.4,0.1,0.4,0.4,0.8,0.4c0.4,0.1,0.2,0,0.3-0.4c0.1-0.6,0.8-1.1,1.2-1.2c2.6-0.7,2.6-0.7,2.6-0.7c0.9-0.3,1.6-1,2.2-0.9s0.9,0,1.4-0.1s1-1,1.3-1.4c0.4-0.4,0.7-0.4,1.1,0.1s0.8,0.2,1.2-0.1c0.4-0.3,0.2-1.3,0-1.8s0.1-0.8,0.5-1s0.4,0.3,1,0.7c0.5,0.4,0.5,0.8,0.1,1.2s-0.1,0.5,0.2,0.5c0.3,0,1.2,0.1,1.5-0.3c0.3-0.4-0.1-0.9-0.4-1.2s0.7-0.7,1.1-0.8s0.7-0.2,0.7,0.1S36.4,6,36.7,6s2.3-0.4,2.9-0.6c0.5-0.2,2.3-0.8,3-1.1s1-1.5,1.3-2.2c0.3-0.6,0.5-0.6,1-0.6c0.2,0,0.4-0.1,0.5-0.2C45.5,1.2,8.2,1.1,2,1C1.8,1,1.4,1,1.2,1C0.5,1,1.4,3.4,1.4,3.4l0,0c0,0-0.1-0.2,1.8,1.4c0.4,0.4,3.3-0.7,3.1,0.4c-0.8,4,0.8,4,1.4,4.4c0.4,0.3,1.2-0.1,1.6,0.1C9.9,10.1,10.4,10.4,10.9,10.6C10.6,10.5,10.8,10.6,10.9,10.6z M13.2,21.8c0,0-0.6-2.5,0.1-3s1.1-0.4,1.3-0.9c0.2-0.4,0.1-0.9,0.9-1.2c0.9-0.4,1.2-0.4,1.8-0.2c0.7,0.2,0.8,0.3,1.3,0s1.4-0.5,1.9-0.6S21.6,16,22,17c0.4,0.9,0.3,1.2-0.4,1.7c-0.7,0.4-1.2,0.9-1.2,1.7c0,0.9-0.4,1.4-0.8,1.3c-0.4-0.1-1.4,0.7-2.2,1.4c-0.7,0.6-1.2,0.4-2.1,0.1c-0.9-0.2-1.5-0.5-1.7-0.7C13.6,22.3,13.2,21.8,13.2,21.8' }),
      React.createElement('path', { className: 'south-china-sea-line', stroke: props.lineColor, fill: 'none', d: 'M1.1,3.2l0.2,0.1l0.6,0.4L1.7,4l1.1,0.6l1-0.2l1.5,0.2l1,0.6l-0.5,1L5.7,7.3v1.2l1.2,0.6l0.8,0.5L9.1,10l0.8-0.2l0.9,0.7 M14.8,31L14.8,31l1,0.9l1,1.3l0.6,1.2l1.3,4 M11.1,62.2L11.1,62.2l-0.7,2.3l0.2,3.5l0.3,2.3 M24.2,79.4L24.2,79.4l3-0.4l2.7-0.7l3.1-1.4 M41,66.6L41,66.6l5.5-6.2 M54.2,50L54.2,50l1.3-3.1l0.7-4.9 M60.5,12.5L60.5,12.5l2.8-5.2 M55,24.4L55,24.4l2.5-6.9 M55.2,35.7L55.2,35.7l-0.8-6.9 M19.7,44.8L19.7,44.8l-0.2,1.9l-0.2,1.6l-0.4,1.6l-0.8,2.5' }),
      React.createElement('rect', { className: 'south-china-sea-box', stroke: props.boxColor, fill: 'none', x: '0.8', y: '0.8', width: '62.5', height: '87.3' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M16.9,63.3c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S16.9,63.6,16.9,63.3L16.9,63.3z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M41,58.5c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S41,58.9,41,58.5L41,58.5z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M35.2,62.5c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C34.9,63.2,35.2,62.8,35.2,62.5L35.2,62.5z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M34,51.9c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C33.7,52.6,34,52.3,34,51.9L34,51.9z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M46.9,46.9c0-0.4-0.3-0.7-0.7-0.7s-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S46.9,47.3,46.9,46.9L46.9,46.9z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M32.4,59.7c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S32.4,60.1,32.4,59.7L32.4,59.7z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M30.6,70c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C30.2,70.7,30.6,70.4,30.6,70L30.6,70z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M44.8,10.9c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C44.4,11.6,44.8,11.3,44.8,10.9L44.8,10.9z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M49.1,31.7c-0.3,0.3-0.3,0.7,0,1s0.7,0.3,1,0s0.3-0.7,0-1C49.8,31.4,49.4,31.4,49.1,31.7L49.1,31.7z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M25.1,25.8c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C24.7,26.6,25.1,26.2,25.1,25.8L25.1,25.8z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M29,29.8c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S29,30.2,29,29.8L29,29.8z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M24.1,31.2c0-0.4-0.3-0.7-0.7-0.7s-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S24.1,31.6,24.1,31.2L24.1,31.2z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M38.2,29c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C37.9,29.7,38.2,29.4,38.2,29L38.2,29z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M34,31.8c0,0.4,0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7s-0.3-0.7-0.7-0.7S34,31.4,34,31.8L34,31.8z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M51.7,49.1c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C51.4,49.8,51.7,49.5,51.7,49.1L51.7,49.1z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M37,47.1c0-0.4-0.3-0.7-0.7-0.7s-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7S37,47.5,37,47.1L37,47.1z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M38.2,53.1c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C37.9,53.8,38.2,53.5,38.2,53.1L38.2,53.1z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M25.1,62.9c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C24.7,63.6,25.1,63.2,25.1,62.9L25.1,62.9z' }),
      React.createElement('path', { className: 'south-china-sea-island', fill: props.islandColor, d: 'M28,75.4c0-0.4-0.3-0.7-0.7-0.7c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7C27.7,76.1,28,75.8,28,75.4L28,75.4z' })
    )
  );
}