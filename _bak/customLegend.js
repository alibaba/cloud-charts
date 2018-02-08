// Line
// 自定义图例html
// if (config.legend) {
//   let chartNode = this.chartDom;
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

// Pie
// 自定义图例html
// if (config.legend) {
//   let chartNode = this.chartDom;
//   chartNode.style.position = 'relative';
//   let boxHeight = chartNode.offsetHeight - config.padding[0] - config.padding[2];
//   let boxWidth = chartNode.offsetWidth  - config.padding[1] - config.padding[3] - boxHeight * 0.6;
//   let diameter = boxHeight < boxWidth ? boxHeight * 0.6 : boxWidth * 0.6;
//
//   let geom = chart.getAllGeoms()[0]; // 获取所有的图形
//   let items = geom.get('frames'); // 获取图形对应的数据
//   let stash = {};
//
//   let ulNode = document.createElement('ul');
//   ulNode.classList.add('ac-pie-legend');
//   ulNode.style.top = config.padding[0] + + diameter* 0.3 + 'px';
//   ulNode.style.left = config.padding[3] + diameter + boxWidth * 0.55  + 'px';
//   ulNode.style.height = diameter + 'px';
//   // if(config.legend.align === 'right'){
//   //   ulNode.style.right = config.padding[1] + 'px';
//   // }else{
//   //   ulNode.style.left = 5 + 'px';
//   // }
//   ulNode.innerHTML = '';
//
//   for (let i = 0, l = items.length; i < l; i++) {
//     let item = items[i];
//     let itemData = item.data[0];
//     if (!itemData) {
//       return;
//     };
//     let color = itemData.color;
//     if(!itemData._origin){
//       return;
//     }
//     let type = itemData._origin.type;
//     let name = itemData._origin.name;
//     let value = itemData._origin.value;
//
//     let nameFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(name, item, i) : name ;
//     let valueFormatter = config.legend.valueFormatter ? config.legend.valueFormatter(value, item, i) : value ;
//
//     let liHtml = '<li class="item" data-id="' + name + '"><i class="dot" style="background:' + color + ';"></i><b>' + nameFormatter + '</b><span>' + valueFormatter + '</span></li>';
//     ulNode.innerHTML += liHtml;
//     chartNode.appendChild(ulNode);
//
//     stash[name] = {
//       item: item,
//       color: color,
//       name: name,
//       isChecked: true,
//       index: i
//     };
//   }
//   let dotDom = chartNode.getElementsByClassName('dot');
//   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
//     item.addEventListener('click', (e) => {
//       let node = getLegendNode(e.target);
//       let name = node.getAttribute('data-id');
//       // filter(name);
//       g2LegendFilter(name, stash, Util, dotDom, chart, 'name');
//     });
//   });
//   // function filter(name) {
//   //   let obj = stash[name];
//   //   let filterNames = [];
//   //   obj.isChecked = obj.isChecked ? false : true;
//   //   Util.each(stash, function (v) {
//   //     if (v.isChecked) {
//   //       dotDom[v.index].style.background = v.color;
//   //       filterNames.push(v.name);
//   //     } else {
//   //       dotDom[v.index].style.background = '#999';
//   //     }
//   //   });
//   //
//   //   chart.filter('name', filterNames);
//   //   chart.repaint();
//   // }
// }

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}