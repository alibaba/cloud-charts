import React from 'react';
import { Grid, Panel, RankList } from '@alife/p2charts';
const { Item, TitleSub } = Panel;

const cols = [
  {key: 'value', cls: 'bigger', isIndex: true, width: 60},
  {key: 'site', link: 'http://106.11.160.79/dashboard/db/ceph-cluster-summary?var-Cluster=', linkKey: 'link'},
  {key: 'tenant_cn', width: 50},
  {key: 'region_cn', width: 50}
];
const cols1 = mergeArr(cols,[{ key: 'cpu', percent: true }]);
const cols2 = mergeArr(cols,[{ key: 'memory', percent: true }]);
const cols3 = mergeArr(cols,[{ key: 'net' , suffix: 'MB', width: 80}]);
const cols4 = mergeArr(cols,[{ key: 'io'}]);

const dictionary = {
  'middleware': '中间件',
  'db': '数据库',
  'zhangbei': '张北',
  'shanghai': '上海'
};

const data = [
  {
    "tenant": "db",
    "region": "shanghai",
    "site": "et2",
    "id": 1,
    "pool": 6,
    "pg": 24576,
    "total_space": 86,
    "used_space": 24.6,
    "ceph_osd_in_count": 216,
    "ceph_osd_out_count": 0,
    "ceph_osd_up_count": 216,
    "ceph_osd_down_count": 0,
    "cpu_usage": 0.9,
    "mem_usage": 0.21,
    "load": 0.2,
    "iops": 0,
    "net_receive": 379772,
    "net_send": 399600
  },
  {
    "tenant": "db",
    "region": "zhangbei",
    "site": "na61",
    "id": 1,
    "pool": 1,
    "pg": 6144,
    "total_space": 365,
    "used_space": 180,
    "ceph_osd_in_count": 63,
    "ceph_osd_out_count": 0,
    "ceph_osd_up_count": 63,
    "ceph_osd_down_count": 0,
    "cpu_usage": 0.4,
    "mem_usage": 0.18,
    "load": 0.8,
    "iops": 0,
    "net_receive": 77737,
    "net_send": 938930
  },
  {
    "tenant": "db",
    "region": "shanghai",
    "site": "eu13",
    "id": 1,
    "pool": 1,
    "pg": 192,
    "total_space": 85,
    "used_space": 12,
    "ceph_osd_in_count": 216,
    "ceph_osd_out_count": 0,
    "ceph_osd_up_count": 216,
    "ceph_osd_down_count": 0,
    "cpu_usage": 0.12,
    "mem_usage": 0.80,
    "load": 0,
    "iops": 0,
    "net_receive": 512000,
    "net_send": 128000
  }
];

class Tops extends React.Component{

  constructor() {
    super();
    this.state = {
      data1: [],
      data2: [],
      data3: [],
      data4: []
    };
  }

  componentWillMount() {
    let newData = dataHandler(data);
    this.setState({
      data1: dataSort(data, cols1),
      data2: dataSort(data, cols2),
      data3: dataSort(data, cols3),
      data4: dataSort(data, cols4)
    });
  }

  render() {
    return (
      <Panel>
        <Item>
          <RankList title="CPU使用率Top10" data={this.state.data1} cols={cols1} />
        </Item>
        <Item>
          <RankList title="内存使用率Top10" data={this.state.data2} cols={cols2} />
        </Item>
        <Item>
          <RankList title="网络带宽使用量Top10" data={this.state.data3} cols={cols3} />
        </Item>
        <Item>
          <RankList title="IOPS使用量Top10" data={this.state.data4} cols={cols4} />
        </Item>
      </Panel>
    )
  }

}

function dataHandler(data){
  let ret = [];
  if(Array.isArray(data)){
    ret = data.map((d)=>{
      d['cpu'] = d.cpu_usage;
      d['memory'] = d.mem_usage;
      d['net'] = Math.round((d.net_receive + d.net_send) / 1024);
      d['io'] = d.iops;
      d['tenant_cn'] = dictionary[d['tenant']] || d['tenant'];
      d['region_cn'] = dictionary[d['region']] || d['region'];
      d['link'] = d.tenant + '.' + d.region + '.' + d.site + '.1';
    });
  }
  return ret;
}

function dataSort(data,cols){
  let dt = JSON.parse(JSON.stringify(data)); //纯值类型数组拷贝
  let key = '';
  cols.forEach((item)=>{
    if(item.isIndex) key = item.key;
  });
  if(!key) return dt;
  dt.sort((a,b)=>{
    return a[key] > b[key]? -1 : 1;
  });
  return dt;
}

function mergeArr(oriArr,newArr){
  let arr = JSON.parse(JSON.stringify(oriArr)); //纯值类型数组拷贝
  newArr.forEach((item,i)=>{
    if(item) arr[i] = Object.assign(arr[i],item);
  });
  return arr;
}

export default Tops;
