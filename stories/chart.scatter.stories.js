import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wscatter, Wcontainer } from '@alife/aisc-widgets';

const data = [
    {
        name: '机房1',
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
            [1484496000000, 6494]
        ]
    }
];

const stories = storiesOf('Wscatter', module);
stories.add('基础散点图', () => (
  <Wcontainer className="demos">
    <Wscatter height="300" config={{
        padding: [40, 5, 24, 44],
        xAxis: {
            type: 'time',
            mask: 'YYYY-MM-DD'
        }
    }} data={data} />
  </Wcontainer>
));

const data2 = [
    {
        name: '团队1',
        data: [
            ['A', 35],
            ['A', 10],
            ['B', 32],
            ['A', 7],
            ['C', 32],
            ['B', 23],
            ['A', 80],
            ['C', 33],
            ['A', 11],
            ['A', 32],
            ['B', 24],
            ['B', 72],
            ['C', 14],
            ['A', 42]
        ]
    },
    {
        name: '团队2',
        data: [
            ['A', 54],
            ['A', 10],
            ['B', 24],
            ['B', 72],
            ['C', 14],
            ['A', 42],
            ['B', 32],
            ['A', 7],
            ['C', 32],
            ['B', 23],
            ['A', 24],
            ['C', 33],
            ['A', 11],
            ['A', 32]
        ]
    },
    {
        name: '团队3',
        data: [
            ['A', 31],
            ['A', 10],
            ['A', 11],
            ['A', 32],
            ['B', 24],
            ['B', 32],
            ['A', 7],
            ['C', 32],
            ['B', 23],
            ['A', 43],
            ['C', 33],
            ['B', 72],
            ['C', 14],
            ['A', 42]
        ]
    }
];

stories.add('扰动点图', () => (
    <Wcontainer className="demos">
        <Wscatter height="300" config={{
            padding: [40, 5, 24, 29],
            jitter: true,
            yAxis: {
                min: 0,
                max: 100,
            }
        }} data={data2} />
    </Wcontainer>
));

