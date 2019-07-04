---
category: 组件
subtitle: 地图
type: 图表组件
title: Wmap
cols: 1
---

> 根据国家地图法，所有对外披露的地图应优先使用高德服务绘制，如要使用本组件且页面对外披露，需要向国家相关部门送审，详情见：<https://pinkong.bbs.taobao.com/detail.html?postId=8064073>

## 介绍

一个完整的地图，不只是显示地理边界。成熟的地图方案（Google，百度，高德，Mapbox，Leaflet）都是分层的，就像PhotoShop的图层一样层层叠加，最底层是我们通常理解的地图，上层可以叠加路线信息，地图标识，名称等。 

![地图分层](<http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/1090809a25f2ab146f7d49a3dccfe22f.PNG>)

我们的地图组件也是分层设计，用户可以自行选择需要的图层。目前提供以下几种图层：

- Wmap 底图(必选)，用于绘制基础地理边界。
- Wmap.Area 块状地图，地理区块着色展示，常用于分级统计图。
- Wmap.Point 散点地图，地理标记点展示，常同于标记具体的城市或坐标。
- Wmap.Custom 自定义地图，可自行根据数据绘制需要的内容，组件内部会将绘制点定位到具体坐标上。

底图必须包裹在最外层，其余图层均可自行选择，允许多次使用，叠加顺序由声明的顺序决定（自定义地图一定绘制在最顶层）。

```jsx
<Wmap height={500} config={options}>
  <Wmap.Area data={areaData} />
  <Wmap.Point data={pointData} />
  <Wmap.Custom data={customData} render={this.renderPoint} />
</Wmap>
```

### Wmap 底图

由于组件内部会自动适配绘制比例（保证绘制的地图不变形），所以组件的高宽通常会大于地图展示的大小。

| 属性      | 说明      | 类型      | 默认值        |
| ------- | ------- | ------- | ---------- |
| width   | 地图宽度    | Number  | 自适应父元素宽度   |
| height  | 地图高度    | Number  | 自适应父元素高度   |
| config  | 配置项   | Object  | 见下方具体配置    |
| geoData | 地图数据    | GeoJSON | 默认使用中国地图（带钓鱼岛、赤尾屿、南海诸岛九段线）数据，如果需要使用其它地图则需要自行准备数据 |

#### config 配置项

| 属性名        | 描述                                       | 类型                | 默认值                         |
| ---------- | ---------------------------------------- | ----------------- | --------------------------- |
| padding    | 图表边距                                     | array             | [20, 20, 20, 20] |
| legend     | 图例配置项，仅支持 nameFormatter，详情见 [图例 Legend](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142) | object \| boolean | {}                          |
| tooltip    | 提示信息配置项，仅支持 nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}                          |
| label | 图形文本配置项，详情见 [图形文本 Label](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286) | object \| boolean | false             |
| areaColors | 块状地图的颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.order_10 |
| pointColors | 散点地图的颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.category_12 |
| showSouthChinaSea | 是否显示南海诸岛                            | boolean           | true                       |
| projection | 自定义地图投影函数 | d3 projection | d3.geo.geoConicEqualArea().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]) |
| background | 地图颜色设置                         | object           | {   fill: themes['widgets-map-area-bg'],   stroke: themes['widgets-map-area-border'], } |

### Wmap.Area 块状地图

| 属性 | 说明                                                         | 类型  | 默认值 |
| ---- | ------------------------------------------------------------ | ----- | ------ |
| data | 块状地图数据，示例见上方分级统计地图：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/276/example/494> | Array | []     |

### Wmap.Point 散点地图

| 属性  | 说明                                                         | 类型              | 默认值 |
| ----- | ------------------------------------------------------------ | ----------------- | ------ |
| data  | 散点地图数据，示例见上方散点地图：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/276/example/495> | Array             | []     |
| label | 图形文本配置项，这里的设置会覆盖底图config中label的设置，详情见 [图形文本 Label](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286) | object \| boolean | false  |
| size  | 散点大小                                                     | number            | 4      |

### Wmap.Custom 自定义地图

| 属性   | 说明                                                         | 类型     | 默认值 |
| ------ | ------------------------------------------------------------ | -------- | ------ |
| data   | 自定义地图数据，示例见上方自定义地图：<http://aisc.alibaba-inc.com/site/pc#/cate/4/page/276/example/496> | Array    | []     |
| render | 自定义渲染函数，接受三个参数 point，index，otherProps。分别是 当前数据点，当前索引和剩余props属性，返回可渲染的 React Element。 | function | null   |