import React from 'react';

import { storiesOf } from '@storybook/react';
import { Whierarchy, Wcontainer, Util } from '@alife/aisc-widgets';
import flare from './data/flare.json';
import fileserverSize from './data/fileserverSize';
import { numberDecimal } from '../src/common/common';

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

function getFileTreeData() {
  const fileTree = {
    name: 'kos-fileserver',
    value: 234252,
    children: [],
  };
  const pathMap = {};
  fileserverSize.slice().reverse().forEach((item) => {
    const { path, value } = item;
    const data = { ...item };
    const pathList = path.split('/');
    data.name = pathList.slice(-1)[0];

    // 最外层
    if (pathList.length === 1) {
      fileTree.children.push(data);
      pathMap[path] = data;

      if (fileTree.value && value) {
        fileTree.value -= value;
      }
    } else {
      const parentPath = pathList.slice(0, -1).join('/');
      const parent = pathMap[parentPath];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(data);
        pathMap[path] = data;

        if (parent.value && value) {
          parent.value -= value;
        }
      } else {
        console.log('parent not found: ', data);
      }
    }
  });

  console.log(fileTree);
  return fileTree;
}

stories.add('文件目录分析', () => (
  <Wcontainer className="demos">
    <Whierarchy
      height="600"
      config={{
        // polar: true,
        tooltip: {
          valueFormatter(v) {
            if (v > 1024) {
              return `${Util.numberDecimal(v / 1024)} mb`;
            }
            return `${v} kb`;
          }
        },
      }}
      data={getFileTreeData()}
    />
  </Wcontainer>
));
