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
const len = 100;
for (let i = 0; i < 50; i++) {
  let x = Math.cos((2 * Math.PI / 50) * i) * 100;
  let y = Math.sin((2 * Math.PI / 50) * i) * 100;
  const id = G6.Util.guid();

  data.nodes.push({
    id,
    x,
    y,
  });
  data.edges.push({
    source: 'root',
    target: id
  });
}

function mockTreeData(x1, y1, angle, depth, nodes = [], edges = []) {
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

const graph = new G6.Graph({
  container: 'container',
  fitView: 'autoZoom',
  width: 600,
  height: 600
});

graph.node({
  size: 2
});

graph.read(data);
