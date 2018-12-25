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
  // var nodes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  // var edges = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

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

function mockTreeData() {
  
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
