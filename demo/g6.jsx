import G6 from '@antv/g6';
// const G6 = window.G6;

let data = {
  nodes: [{
    id: 'node1',
    x: 100,
    y: 200
  },{
    id: 'node2',
    x: 300,
    y: 200
  }],
  edges: [{
    id: 'edge1',
    target: 'node2',
    source: 'node1'
  }]
};

const deg_to_rad = Math.PI / 180;
function getTreeData(x1, y1, angle, depth, nodes = [], edges = []) {
  if (depth !== 0) {
    var x2 = x1 + Math.cos(angle * deg_to_rad) * depth * 10.0;
    var y2 = y1 + Math.sin(angle * deg_to_rad) * depth * 10.0;
    var id1 = G6.Util.guid();
    var id2 = G6.Util.guid();
    nodes.push({
      id: id1,
      x: x1,
      y: y1
    });
    nodes.push({
      id: id2,
      x: x2,
      y: y2
    });
    edges.push({
      source: id1,
      target: id2
    });
    getTreeData(x2, y2, angle - 30, depth - 1, nodes, edges);
    getTreeData(x2, y2, angle + 30, depth - 1, nodes, edges);
  }
  return {
    nodes: nodes,
    edges: edges
  };
}

data = getTreeData(0, 0, 90, 7);

// 第一级有N个，后面每一级都是二叉树
data = {
  nodes: [{
    id: 'root',
    x: 0,
    y: 0,
  }],
  edges: []
};

const edgeLength = 50;
const number = 30;
const depth = 4;

for (let i = 0; i < number; i++) {
  const rad = (2 * Math.PI / number) * i;

  mockTreeData(data.nodes[0], rad, depth, data.nodes, data.edges);
}

function mockTreeData(source, rad, depthIndex, nodes = [], edges = []) {
  const { x: x1, y: y1, id: id1 } = source;

  if (depthIndex !== 0) {
    const x2 = x1 + Math.cos(rad) * edgeLength;
    const y2 = y1 + Math.sin(rad) * edgeLength;
    const id2 = G6.Util.guid();
    const target = {
      id: id2,
      x: x2,
      y: y2,
      depth: depthIndex,
    };

    nodes.push(target);
    edges.push({
      source: id1,
      target: id2
    });

    // 当前深度
    const currentDepth = depth - depthIndex;
    // 计算当前层的点的总数
    const currentNodesNumber = number * Math.pow(2, currentDepth);
    // 均分的弧度值
    let deltaRad =  2 * Math.PI / currentNodesNumber;

    deltaRad = deltaRad / (depthIndex - 1);
    // // 递归第一层
    // if (depthIndex === depth) {
    //   deltaRad = deltaRad / 3;
    // } else if (depthIndex === 2) {
    //   // 递归倒数第二层，不调整deltaRad
    //   // deltaRad = deltaRad * 2;
    // } else if (depthIndex === 4) {
    //   deltaRad = deltaRad / 3;
    // } else {
    //   // 其余情况，除2
    //   deltaRad = deltaRad / 2;
    // }

    // deltaRad = ( 2 * Math.PI / number ) / Math.pow(2, currentDepth + 1);
    //
    // deltaRad = deltaRad / 2

    // 随机跳过一些生成
    if (depthIndex !== depth && Math.random() < 0.1) {
      return;
    }
    mockTreeData(target, rad - deltaRad, depthIndex - 1, nodes, edges);
    mockTreeData(target, rad + deltaRad, depthIndex - 1, nodes, edges);
  }
  return {
    nodes: nodes,
    edges: edges
  };
}

const tooltip = new G6.Plugins['tool.tooltip']();
const graph = new G6.Graph({
  container: 'container',
  fitView: 'autoZoom',
  width: 600,
  height: 600,
  plugins: [ tooltip ]
});

graph.node({
  size: 2,
  tooltip(model) {
    return [
      ['x', model.x],
      ['y', model.y],
      ['depth', model.depth || 'root'],
    ]
  }
});

graph.read(data);
