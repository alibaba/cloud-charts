// extra APIs
require('@antv/data-set/lib/api/geo');
require('@antv/data-set/lib/api/hierarchy');
require('@antv/data-set/lib/api/partition');
require('@antv/data-set/lib/api/statistics');

// connectors
require('@antv/data-set/lib/connector/default');
// require('@antv/data-set/lib/connector/dsv');
require('@antv/data-set/lib/connector/geo-graticule');
require('@antv/data-set/lib/connector/geojson');
require('@antv/data-set/lib/connector/graph');
// require('@antv/data-set/lib/connector/hexjson');
require('@antv/data-set/lib/connector/hierarchy');
// require('@antv/data-set/lib/connector/topojson');

// transforms
// static
require('@antv/data-set/lib/transform/default');
require('@antv/data-set/lib/transform/filter');
require('@antv/data-set/lib/transform/fold');
require('@antv/data-set/lib/transform/map');
require('@antv/data-set/lib/transform/partition');
require('@antv/data-set/lib/transform/percent');
require('@antv/data-set/lib/transform/pick');
require('@antv/data-set/lib/transform/proportion');
require('@antv/data-set/lib/transform/rename');
require('@antv/data-set/lib/transform/reverse');
require('@antv/data-set/lib/transform/sort');
require('@antv/data-set/lib/transform/sort-by');
require('@antv/data-set/lib/transform/subset');
// imputation
// require('@antv/data-set/lib/transform/fill-rows');
// require('@antv/data-set/lib/transform/impute');
// statistics
// require('@antv/data-set/lib/transform/aggregate');
// regression
// require('@antv/data-set/lib/transform/regression');
// KDE
// require('@antv/data-set/lib/transform/kde');
// binning
// require('@antv/data-set/lib/transform/bin/hexagon');
require('@antv/data-set/lib/transform/bin/histogram');
// require('@antv/data-set/lib/transform/bin/quantile');
require('@antv/data-set/lib/transform/bin/rectangle');
// geo
require('@antv/data-set/lib/transform/geo/centroid');
require('@antv/data-set/lib/transform/geo/projection');
require('@antv/data-set/lib/transform/geo/region');
// diagram
require('@antv/data-set/lib/transform/diagram/arc');
// require('@antv/data-set/lib/transform/diagram/dagre'); // 默认不引入
require('@antv/data-set/lib/transform/diagram/sankey');
// require('@antv/data-set/lib/transform/diagram/voronoi');
// hierarchy
// require('@antv/data-set/lib/transform/hierarchy/cluster');
// require('@antv/data-set/lib/transform/hierarchy/compact-box');
// require('@antv/data-set/lib/transform/hierarchy/dendrogram');
// require('@antv/data-set/lib/transform/hierarchy/indented');
// require('@antv/data-set/lib/transform/hierarchy/pack');
require('@antv/data-set/lib/transform/hierarchy/partition');
// require('@antv/data-set/lib/transform/hierarchy/tree');
// require('@antv/data-set/lib/transform/hierarchy/treemap');
// tag cloud
// require('@antv/data-set/lib/transform/tag-cloud');
// waffle
// require('@antv/data-set/lib/transform/waffle');
// kernel smoothing
// require('@antv/data-set/lib/transform/kernel-smooth/density');
// require('@antv/data-set/lib/transform/kernel-smooth/regression');

module.exports = require('@antv/data-set/lib/data-set');