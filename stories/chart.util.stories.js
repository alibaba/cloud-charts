import React, { useEffect, useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import tinycolor from 'tinycolor2';


import { Util } from '@alicloud/cloud-charts';

const stories = storiesOf('Util', module);

const colors_light = [
  //   '#E6F9FF',
  //   '#AFDEF0',
  //   '#79C5E0',
  //   '#49ADD1',
  //   '#0092C7',
  //   '#007FAD',
  //   '#006E96',
  //   '#005E80',
  //   '#004D69',
  //   '#003C52',
  '#F0F0FF',
  '#D7D7FC',
  '#BBBBFA',
  '#A6A3F7',
  '#8A87F5',
  '#6B67E0',
  '#4440BD',
  '#272399',
  '#120E75',
  '#030052',
];

// const colors = Util.calcLinearColor('#007FAD', '', 10, 'center');
// const colors = Util.calcLinearColor('#716969', '', 10, 'center');
const colors = Util.calcLinearColor('#e760a4', '', 10, 'center');
// const colors = Util.calcLinearColor(
//   tinycolor({ r: 255 * Math.random(), g: 255 * Math.random(), b: 255 * Math.random() }).toHexString(),
//   '',
//   10,
//   'center',
// );

stories.add('色彩算法', () => (
  <>
    <div
      style={{
        width: '100%',
        display: 'flex',
      }}
    >
      {colors_light.map((el) => {
        return (
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: el,
            }}
          />
        );
      })}
    </div>
    <div
      style={{
        width: '100%',
        display: 'flex',
      }}
    >
      {colors.map((el) => {
        return (
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: el,
            }}
          />
        );
      })}
    </div>
  </>
));
