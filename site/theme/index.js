const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';

module.exports = {
  typeOrder: {
    '基础组件': 0,
    '表格型卡片': 1,
    '按钮迷你卡片': 2,
    '柱图迷你卡片': 3,
    '环迷你卡片': 4,
    '数值迷你卡片': 5
  },
  categoryOrder: {
    '指引': 0,
  },
  routes: {
    path: '/',
    prefix: 'p2widgets',
    component: './template/Layout/index',
    indexRoute: {component: homeTmpl},
    dataPath: '/',
    childRoutes: [{
      path: '/',
      component: homeTmpl,
      dataPath: '/',
    }, {
      path: 'components/:children/',
      component: contentTmpl
    }, {
      path: 'guide/:children/',
      component: contentTmpl
    }, {
      path: 'spec/:children/',
      component: contentTmpl
    }],
  },
  source: {
    components: './components',
    guide: './guide',
    spec: './spec'
  },
  link: [{to: `/components/wnumber/`, children: "基础组件"},
    {to: `/guide/start/`, children: "指引"}]
};
