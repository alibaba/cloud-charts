import React from 'react';

import { storiesOf } from '@storybook/react';
import { Whierarchy, Wcontainer } from '@alife/aisc-widgets';
import flare from './data/flare.json';

const stories = storiesOf('Whierarchy', module);

stories.add('相邻层次图', () => (
  <Wcontainer className="demos">
    <Whierarchy height="600" data={flare} />
  </Wcontainer>
));

stories.add('极坐标相邻层次图（旭日图）', () => (
  <Wcontainer className="demos">
    <Whierarchy
      height="1000"
      config={{
        polar: true,
      }}
      data={flare}
    />
  </Wcontainer>
));
