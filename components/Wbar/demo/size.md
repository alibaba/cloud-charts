---
order: 12
title:
  zh-CN: 大小
  en-US: Size
---

## zh-CN

控制柱图粗细

## en-US


````jsx
import { Wbar, COLORS } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "facet": '分面1',
    "data":[]
  },
  {
    "name":"柱2",
    "facet": '分面2',
    "data":[]
  },
  {
    "name":"柱3",
    "facet": '分面1',
    "data":[]
  },
  {
    "name":"柱4",
    "facet": '分面2',
    "data":[]
  }
];

for (let i = 0; i < 10; i++) {
  const name = i + '-' + i;
  data[0].data.push([name, Math.random() * 100 + 100]);
  data[1].data.push([name, Math.random() * 100 + 100]);
  data[2].data.push([name, Math.random() * 100 + 100]);
  data[3].data.push([name, Math.random() * 100 + 100]);
}

data = {"success":true,"errorCode":null,"errorMsg":null,"data":[{"data":[["阿里云",1539],["大数据",1239],["大文娱",939],["电商",1539],["开发测试",639],["蚂蚁",1639]],"name":"7000机柜","facet":"机柜个数"},{"data":[["阿里云",0.50],["大数据",0.50],["大文娱",0.50],["电商",0.50],["开发测试",0.50],["蚂蚁",0.50]],"name":"7000机柜","facet":"机柜超电比"},{"data":[["阿里云",1552],["大数据",1252],["大文娱",952],["电商",1552],["开发测试",652],["蚂蚁",1652]],"name":"8000机柜","facet":"机柜个数"},{"data":[["阿里云",0.50],["大数据",0.50],["大文娱",0.50],["电商",0.50],["开发测试",0.50],["蚂蚁",0.50]],"name":"8000机柜","facet":"机柜超电比"},{"data":[["阿里云",1513],["大数据",1213],["大文娱",913],["电商",1513],["开发测试",613],["蚂蚁",1613]],"name":"5000机柜","facet":"机柜个数"},{"data":[["阿里云",0.50],["大数据",0.50],["大文娱",0.50],["电商",0.50],["开发测试",0.50],["蚂蚁",0.50]],"name":"5000机柜","facet":"机柜超电比"},{"data":[["阿里云",1526],["大数据",1226],["大文娱",926],["电商",1526],["开发测试",626],["蚂蚁",1626]],"name":"6000机柜","facet":"机柜个数"},{"data":[["阿里云",0.50],["大数据",0.50],["大文娱",0.50],["电商",0.50],["开发测试",0.50],["蚂蚁",0.50]],"name":"6000机柜","facet":"机柜超电比"}]};

let options1 = {
  padding: [40, 24, 20, 44],
  /* colors(name, facet) {
    console.log(name, facet);
    return COLORS.widgetsColorCategory1;
  }, */
  yAxis: {
    labelFormatter(label, info, i) {
      if (info.facet === '机柜个数') {
        return label + '个';
      } else {
        return label + '%';
      }
    }
  },
  tooltip: {
    valueFormatter(v, data) {
      if (data.facet === '机柜个数') {
        return v + '个';
      } else {
        return v + '%';
      }
    }
  },
  size: 20,
  facet: true,
  zoom: true
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wbar ref="chart1" config={options1} data={data.data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
