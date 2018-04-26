'use strict';

import merge from '../utils/merge';
import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import chinaGeo from './chinaGeo';

const defaultConfig = {
  padding: [40, 40, 40, 40],
  type: 'china',
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  labels: false,
};

export default {
  beforeInit(props) {
    const { config, geoData } = props;
    const newConfig = merge({}, defaultConfig, config);
    if (geoData) {
      this.geoData = geoData;
    }

    return Object.assign({}, props, {
      padding: props.padding || config.padding,
      config: newConfig
    });
  },
  init(chart, config, data) {
    chart.tooltip({
      showTitle: false
    });

    // 同步度量
    chart.scale({
      longitude: {
        sync: true
      },
      latitude: {
        sync: true
      },
    });

    chart.axis(false);

    // 设置图例
    chart.legend(false);
    // chart.legend('trend', {
    //   position: 'left'
    // });

    // 绘制地图背景
    let geoData = null;
    if (this.geoData) {
      // 如果用户有传geoData，优先使用
      geoData = this.geoData;
    } else if (config.type === 'china') {
      // 自带中国地图数据
      geoData = chinaGeo;
    } else {
      console.warn('map: no geo data, can\'t draw the map!');
    }

    const ds = new DataSet();
    const bgMapDataView = ds.createView('back')
      .source(geoData, {
        type: 'GeoJSON'
      });

    const bgMapView = chart.view();
    bgMapView.source(bgMapDataView);
    bgMapView.tooltip(false);
    bgMapView.polygon().position('longitude*latitude').style({
      fill: '#fff',
      stroke: '#ccc',
      lineWidth: 1
    });



    // tooltip
    // if (config.tooltip) {
    //   let tooltipCfg = {
    //     custom: true,
    //     offset: 8,
    //     // crosshairs: {
    //     //   type: 'y' // 启用水平方向的辅助线
    //     // },
    //     // crossLine: {
    //     //   stroke: '#dddddd',
    //     //   lineWidth: 1,
    //     // },
    //     padding: [12, 12, 12, 12],
    //     html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
    //     // itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
    //   };
    //   chart.tooltip(true, tooltipCfg);
    //   if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
    //     chart.on('tooltipchange', function (ev) {
    //       ev.items.forEach((item) => {
    //         item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title) : item.title;
    //         item.value = '';
    //         item.name = '';
    //         // item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
    //         // item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
    //       });
    //     });
    //   }
    // } else {
    //   chart.tooltip(false);
    // }

    // chart.polygon().position(Stat.map.region('name', config.geoData)).color('Population','#e5f5e0-#31a354').style({
    //   fill: 'rgba(49, 157, 255, 0.8)',
    //   stroke: '#999',
    //   lineWidth: 1
    // });
    //
    // if (config.labels) {
    //   chart.point().position(Stat.map.center('name', config.geoData)).size(0).label('name', {offset: 0});
    // }

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let id = chart._attrs.id;
    //   let chartNode = document.getElementById(id);
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getGeoms()[0]; // 获取所有的图形
    //   let items = geom.getData(); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-line-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item._origin;
    //     let color = item.color;
    //     let type = itemData[0].type;
    //     let name = itemData.name;
    //     let value = itemData.value;
    //
    //     let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;
    //
    //     let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[type] = {
    //       item: item,
    //       color: color,
    //       name: type,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let type = node.getAttribute('data-id');
    //       g2LegendFilter(type, stash, Util, dotDom, chart);
    //     });
    //   });
    // }
  }
};


