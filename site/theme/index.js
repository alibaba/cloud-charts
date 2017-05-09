const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';

module.exports = {
  typeOrder: {
    '信息展示': 0,
  },
  categoryOrder: {
    '指引': 0,
  },
  routes: {
    path: '/',
    prefix: 'aisc',
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
    }],
  },
  source: {
    components: './components',
    guide: './guide'
  },
  link: [{to: `/`, children: "首页"},
    {to: `/components/component/`, children: "组件"},
    {to: `/guide/start/`, children: "指引"}]
};
