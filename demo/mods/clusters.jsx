import React from 'react';
import { Grid, Panel, RankList, TableList } from '@alife/p2charts';
const { Item, TitleSub } = Panel;

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

const cols = [
  {name: '集群名', key: 'site', link: 'http://106.11.160.79/dashboard/db/ceph-cluster-summary?var-Cluster=', linkKey: 'link'},
  {name: '业务', key: 'tenant_cn', width: 80},
  {name: '地域', key: 'region_cn', width: 80},
  //{name: '机器数', key: 'machine', width: 60},
  {name: '总存储容量', key: 'total_space', suffix: 'T', width: 100},
  {name: '存储使用率', key: 'percent_space', morethan: 0.8, percent: true, width: 100},
  {name: 'OSD总数(个)', key: 'ceph_osd_total', width: 90},
  {name: 'OSD Down数', key: 'ceph_osd_down_count', width: 100},
  {name: 'OSD Out数', key: 'ceph_osd_out_count', width: 100},
  {name: 'IOPS', key: 'iops', suffix: 'M/s', width: 90},
  {name: '存储池数', key: 'pool', width: 80},
  {name: 'pg数', key: 'pg', width: 80},
  {name: '集群load', key: 'load', width: 80}
];

const dictionary = {
  'middleware': '中间件',
  'db': '数据库',
  'zhangbei': '张北',
  'shanghai': '上海'
};

let tickDur = window._REFRESH || 10;

class Clusters extends React.Component{

  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentWillMount () {
    this.setState({
      data: dataHandler(data)
    });
  }
  
  render() {
    return (
      <Panel>
        <Item>
          <TableList cols={cols} data={this.state.data} />
        </Item>
      </Panel>
    )
  }

}

function dataHandler(data){
  let ret = [];
  if(Array.isArray(data)){
    ret = data.map((d)=>{
      d['percent_space'] = d.total_space ? d.used_space / d.total_space : 0;
      d['ceph_osd_total'] = d.ceph_osd_in_count + d.ceph_osd_out_count;
      d['load'] = Number(d.load.toFixed(2));
      d['tenant_cn'] = dictionary[d['tenant']] || d['tenant'];
      d['region_cn'] = dictionary[d['region']] || d['region'];
      d['link'] = d.tenant + '.' + d.region + '.' + d.site + '.1';
      return d;
    });
    ret.sort((a,b)=>{
      return a.site < b.site ? -1 : 1;
    });
  }
  return ret;
}

export default Clusters;
