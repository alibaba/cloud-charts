import React, { useMemo, useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { withKnobs, number, array } from "@storybook/addon-knobs";

import { WmultiPie, Wnumber, Wcontainer } from '@alicloud/cloud-charts';

const data = {
  name: 'root',
  id: 'dashboard-instance-distribution-root',
  value: 0,
  children: [
    {
      children: [
        {
          name: 'API 分组',
          value: 411,
          id: 'ascm.resourceType.cloudapi_apigroup',
        },
        {
          name: 'API网关',
          value: 32,
          id: 'ascm.resourceType.cloudapi_api',
        },
        {
          name: 'API应用',
          value: 9,
          id: 'ascm.resourceType.cloudapi_app',
        },
        {
          name: 'API 插件管理',
          value: 0,
          id: 'ascm.resourceType.cloudapi_plugin',
        },
        {
          name: '资源栈',
          value: 2,
          id: 'ascm.resourceType.stack',
        },
        {
          name: '模板管理',
          value: 0,
          id: 'ascm.resourceType.template',
        },
      ],
      name: '开发工具',
      id: 'DeveloperTools',
    },
    {
      children: [
        {
          name: '路由表',
          value: 127,
          id: 'ascm.resourceType.route_table',
        },
        {
          name: '专有网络VPC',
          value: 127,
          id: 'ascm.resourceType.vpc_instance',
        },
        {
          name: '交换机',
          value: 119,
          id: 'ascm.resourceType.vswitch_instance',
        },
        {
          name: '自定义DNS主备服务器',
          value: 0,
          id: 'ascm.resourceType.vpc_dhcp',
        },
        {
          name: '网络ACL',
          value: 0,
          id: 'ascm.resourceType.network_acl',
        },
        {
          name: '负载均衡',
          value: 21,
          id: 'ascm.resourceType.slb_instance',
        },
        {
          name: 'SLB访问控制',
          value: 1,
          id: 'ascm.resourceType.slb_access_control',
        },
        {
          name: '服务器证书',
          value: 1,
          id: 'ascm.resourceType.server_certificate',
        },
        {
          name: 'CA证书',
          value: 0,
          id: 'ascm.resourceType.ca_certificate',
        },
        {
          name: '路由器接口',
          value: 6,
          id: 'ascm.resourceType.router_interface',
        },
        {
          name: '边界路由器',
          value: 3,
          id: 'ascm.resourceType.virtual_border_router',
        },
        {
          name: '物理专线',
          value: 2,
          id: 'ascm.resourceType.physical_connection',
        },
        {
          name: 'EIP 实例',
          value: 3,
          id: 'ascm.resourceType.eip_instance',
        },
        {
          name: '租户内网域名',
          value: 3,
          id: 'ascm.resourceType.auth_zone',
        },
        {
          name: '租户默认转发配置',
          value: 0,
          id: 'ascm.resourceType.user_default_forward',
        },
        {
          name: '租户转发域名',
          value: 0,
          id: 'ascm.resourceType.forward_zone',
        },
        {
          name: 'DNS 私有线路',
          value: 0,
          id: 'ascm.resourceType.dns_private_line',
        },
        {
          name: 'NAT网关',
          value: 0,
          id: 'ascm.resourceType.nat_gateway',
        },
        {
          name: 'IPv6网关',
          value: 0,
          id: 'ascm.resourceType.ipv6_gateway',
        },
        {
          name: '高可用虚拟IP',
          value: 0,
          id: 'ascm.resourceType.vpc_havip',
        },
        {
          name: '用户网关',
          value: 0,
          id: 'ascm.resourceType.customer_gateway',
        },
        {
          name: 'SSL 服务端',
          value: 0,
          id: 'ascm.resourceType.ssl_vpn_server',
        },
        {
          name: 'IPsec连接',
          value: 0,
          id: 'ascm.resourceType.vpn_connection',
        },
        {
          name: 'VPN 网关',
          value: 0,
          id: 'ascm.resourceType.vpn_gateway',
        },
        {
          name: 'SSL客户端',
          value: 0,
          id: 'ascm.resourceType.ssl_vpn_client_cert',
        },
      ],
      name: '网络',
      id: 'Networking',
    },
    {
      children: [
        {
          name: 'ECS实例',
          value: 16,
          id: 'ascm.resourceType.ecs_instance',
        },
        {
          name: 'ECS 磁盘',
          value: 16,
          id: 'ascm.resourceType.disk',
        },
        {
          name: 'ECS命令执行结果',
          value: 71,
          id: 'ascm.resourceType.ecs_order_result',
        },
        {
          name: 'ECS-安全组',
          value: 59,
          id: 'ascm.resourceType.security_group',
        },
        {
          name: '弹性网卡',
          value: 16,
          id: 'ascm.resourceType.network_interface',
        },
        {
          name: '云盘快照链',
          value: 2,
          id: 'ascm.resourceType.snapshot_links',
        },
        {
          name: 'ECS快照 SNAPSHOT',
          value: 2,
          id: 'ascm.resourceType.snapshot',
        },
        {
          name: '异步任务',
          value: 2,
          id: 'ascm.resourceType.ecs_task',
        },
        {
          name: 'ECS 镜像',
          value: 2,
          id: 'ascm.resourceType.image',
        },
        {
          name: '自动快照策略',
          value: 0,
          id: 'ascm.resourceType.auto_snapshot_policy',
        },
        {
          name: '快照一致性组',
          value: 0,
          id: 'ascm.resourceType.ecs_snapshot_group',
        },
        {
          name: '存储集',
          value: 0,
          id: 'ascm.resourceType.storage_set',
        },
        {
          name: '安全组参数模板',
          value: 0,
          id: 'ascm.resourceType.security_group_param_template',
        },
        {
          name: '部署集',
          value: 0,
          id: 'ascm.resourceType.deployment_set',
        },
        {
          name: 'HPC集群',
          value: 0,
          id: 'ascm.resourceType.ecs_hpccluster',
        },
        {
          name: '文件下发',
          value: 0,
          id: 'ascm.resourceType.ecs_file_send',
        },
        {
          name: 'ECS-密钥对',
          value: 0,
          id: 'ascm.resourceType.keypair',
        },
        {
          name: 'ECS命令',
          value: 0,
          id: 'ascm.resourceType.ecs_order',
        },
        {
          name: 'ECS回收站',
          value: 0,
          id: 'ascm.resourceType.ecs_instance_recycle',
        },
        {
          name: 'ACK集群',
          value: 2,
          id: 'ascm.resourceType.cluster',
        },
        {
          name: 'ESS 定时任务',
          value: 0,
          id: 'ascm.resourceType.scheduled_task',
        },
        {
          name: 'ESS 告警任务',
          value: 0,
          id: 'ascm.resourceType.alarm_task',
        },
        {
          name: 'ESS 伸缩组',
          value: 0,
          id: 'ascm.resourceType.scaling_group',
        },
        {
          name: '专线绑定',
          value: 0,
          id: 'ascm.resourceType.dedicated_line_binding',
        },
        {
          name: '裸机实例',
          value: 0,
          id: 'ascm.resourceType.bms_instance',
        },
        {
          name: '镜像仓库（专有云高级版）',
          value: 0,
          id: 'ascm.resourceType.cree_repo',
        },
        {
          name: '命名空间（专有云高级版）',
          value: 0,
          id: 'ascm.resourceType.cree_namespace',
        },
        {
          name: '专有宿主机 DDH',
          value: 0,
          id: 'ascm.resourceType.dedicated_host',
        },
        {
          name: '专有宿主机集群 DDH',
          value: 0,
          id: 'ascm.resourceType.dedicated_host_cluster',
        },
        {
          name: '镜像仓库',
          value: 0,
          id: 'ascm.resourceType.cr_repo',
        },
        {
          name: '命名空间',
          value: 0,
          id: 'ascm.resourceType.cr_namespace',
        },
      ],
      name: '弹性计算',
      id: 'ElasticComputing',
    },
    {
      children: [
        {
          name: '项目',
          value: 61,
          id: 'ascm.resourceType.odps_engine',
        },
        {
          name: '配额组',
          value: 26,
          id: 'ascm.resourceType.cu',
        },
        {
          name: 'DataHub项目',
          value: 9,
          id: 'ascm.resourceType.datahub_project',
        },
        {
          name: 'Hologres实例',
          value: 7,
          id: 'ascm.resourceType.hologres_instance',
        },
        {
          name: 'Elasticsearch on k8s实例',
          value: 1,
          id: 'ascm.resourceType.elasticsearchk8s_instance',
        },
        {
          name: '命名空间',
          value: 0,
          id: 'ascm.resourceType.namespace',
        },
      ],
      name: '大数据',
      id: 'DTplus',
    },
    {
      children: [
        {
          name: 'RDS 实例',
          value: 9,
          id: 'ascm.resourceType.rds_instance',
        },
        {
          name: 'RDS回收站',
          value: 12,
          id: 'ascm.resourceType.rds_instance_recycle',
        },
        {
          name: '分析型数据库MySQL集群',
          value: 1,
          id: 'ascm.resourceType.adb_cluster',
        },
        {
          name: '云数据库Redis实例',
          value: 0,
          id: 'ascm.resourceType.redis_instance',
        },
        {
          name: 'PolarDB本地盘实例',
          value: 0,
          id: 'ascm.resourceType.polardb_instance',
        },
        {
          name: 'PolarDB本地盘回收站实例',
          value: 0,
          id: 'ascm.resourceType.polardb_instance_recycle',
        },
        {
          name: 'PolarDB集群',
          value: 0,
          id: 'ascm.resourceType.polardb_dbcluster',
        },
      ],
      name: '数据库',
      id: 'ApsaraDB',
    },
    {
      children: [
        {
          name: 'OSS 实例',
          value: 10,
          id: 'ascm.resourceType.oss_instance',
        },
        {
          name: 'Single Tunnel',
          value: 0,
          id: 'ascm.resourceType.oss_single_tunnel',
        },
        {
          name: '日志服务项目',
          value: 1,
          id: 'ascm.resourceType.sls_product',
        },
      ],
      name: '存储',
      id: 'Storage',
    },
    {
      children: [
        {
          name: '集群列表',
          value: 4,
          id: 'ascm.resourceType.edas_cluster',
        },
        {
          name: '分布式应用服务 EDAS',
          value: 3,
          id: 'ascm.resourceType.edas_application',
        },
        {
          name: 'Kafka实例',
          value: 2,
          id: 'ascm.resourceType.kafka_instance',
        },
        {
          name: '云原生网关 COP 实例',
          value: 0,
          id: 'ascm.resourceType.cop_instance',
        },
      ],
      name: '中间件',
      id: 'Middleware',
    },
    {
      children: [
        {
          name: '密钥',
          value: 4,
          id: 'ascm.resourceType.kms_instance',
        },
      ],
      name: '安全',
      id: 'Security',
    },
    {
      children: [
        {
          name: '模型在线服务',
          value: 1,
          id: 'ascm.resourceType.service',
        },
        {
          name: '资源组',
          value: 0,
          id: 'ascm.resourceType.pai_resource_group',
        },
        {
          name: 'AI工作空间',
          value: 0,
          id: 'ascm.resourceType.workspace',
        },
      ],
      name: '人工智能与机器学习',
      id: 'AIMachineLearning',
    },
    {
      children: [
        {
          name: '演练计划 / 灾难恢复计划',
          value: 0,
          id: 'ascm.resourceType.recoveryPlan',
        },
        {
          name: '保护组',
          value: 0,
          id: 'ascm.resourceType.protectionGroup',
        },
        {
          name: '演练记录 / 灾难恢复记录',
          value: 0,
          id: 'ascm.resourceType.process',
        },
      ],
      name: '容灾',
      id: 'DisasterRecovery',
    },
    {
      children: [
        {
          name: '报警规则',
          value: 0,
          id: 'ascm.resourceType.metric_rule',
        },
        {
          name: 'CMS告警模版',
          value: 0,
          id: 'ascm.resourceType.metric_rule_template',
        },
        {
          name: '应用分组',
          value: 0,
          id: 'ascm.resourceType.app_group',
        },
        {
          name: '迁移源',
          value: 0,
          id: 'ascm.resourceType.sourceserver',
        },
        {
          name: '迁移计划',
          value: 0,
          id: 'ascm.resourceType.migration_group',
        },
        {
          name: '跨平台应用扫描',
          value: 0,
          id: 'ascm.resourceType.porting_task',
        },
        {
          name: 'VMware 数据源',
          value: 0,
          id: 'ascm.resourceType.vmware_source',
        },
        {
          name: '迁云网关',
          value: 0,
          id: 'ascm.resourceType.migration_gateway',
        },
        {
          name: '调研任务',
          value: 0,
          id: 'ascm.resourceType.survey_job',
        },
        {
          name: '调度组',
          value: 0,
          id: 'ascm.resourceType.dispatch_group',
        },
      ],
      name: '迁移与运维管理',
      id: 'MigrationManagement',
    },
    {
      children: [
        {
          name: 'IaC任务',
          value: 0,
          id: 'ascm.resourceType.iac_task',
        },
        {
          name: 'IaC模板',
          value: 0,
          id: 'ascm.resourceType.iac_module',
        },
      ],
      name: '应用服务',
      id: 'ApplicationServices',
    },
  ],
};

const stories = storiesOf('WmultiPie', module);
stories.add('多重饼图', () => (
  <Wcontainer className="demos">
    <WmultiPie
      height="300"
      config={{
        cycle: true,
        legend: {
          // "foldable": true,
          table: {
            // "statistics": [
            //   "min"
            // ]
          },
          unit: '¥',
          needUnitTransform: true,
          valueType: 'money',
          decimal: 3,
        },
        // colors: ["#29236d", "#392b9c", "#5139dd"]
      }}
      data={{
        name: 'root',
        id: 'dashboard-instance-distribution-root',
        value: 0,
        children: [
          {
            children: [
              {
                name: '网络ACL',
                value: 7009,
                id: 'ascm.resourceType.network_acl',
              },
              {
                name: '专有网络VPC',
                value: 4086,
                id: 'ascm.resourceType.vpc_instance',
              },
              {
                name: '路由表',
                value: 4085,
                id: 'ascm.resourceType.route_table',
              },
              {
                name: '交换机',
                value: 467,
                id: 'ascm.resourceType.vswitch_instance',
              },
              {
                name: '自定义DNS主备服务器',
                value: 9,
                id: 'ascm.resourceType.vpc_dhcp',
              },
              {
                name: '负载均衡',
                value: 984,
                id: 'ascm.resourceType.slb_instance',
              },
              {
                name: 'SLB访问控制',
                value: 6,
                id: 'ascm.resourceType.slb_access_control',
              },
              {
                name: '服务器证书',
                value: 2,
                id: 'ascm.resourceType.server_certificate',
              },
              {
                name: 'CA证书',
                value: 2,
                id: 'ascm.resourceType.ca_certificate',
              },
              {
                name: 'EIP 实例',
                value: 73,
                id: 'ascm.resourceType.eip_instance',
              },
              {
                name: '路由器接口',
                value: 69,
                id: 'ascm.resourceType.router_interface',
              },
              {
                name: '边界路由器',
                value: 0,
                id: 'ascm.resourceType.virtual_border_router',
              },
              {
                name: '物理专线',
                value: 0,
                id: 'ascm.resourceType.physical_connection',
              },
              {
                name: 'IPv6网关',
                value: 13,
                id: 'ascm.resourceType.ipv6_gateway',
              },
              {
                name: '高可用虚拟IP',
                value: 13,
                id: 'ascm.resourceType.vpc_havip',
              },
              {
                name: 'NAT网关',
                value: 11,
                id: 'ascm.resourceType.nat_gateway',
              },
              {
                name: '租户内网域名',
                value: 6,
                id: 'ascm.resourceType.auth_zone',
              },
              {
                name: 'DNS 私有线路',
                value: 2,
                id: 'ascm.resourceType.dns_private_line',
              },
              {
                name: '租户默认转发配置',
                value: 1,
                id: 'ascm.resourceType.user_default_forward',
              },
              {
                name: '租户转发域名',
                value: 1,
                id: 'ascm.resourceType.forward_zone',
              },
              {
                name: '用户网关',
                value: 4,
                id: 'ascm.resourceType.customer_gateway',
              },
              {
                name: 'SSL 服务端',
                value: 0,
                id: 'ascm.resourceType.ssl_vpn_server',
              },
              {
                name: 'IPsec连接',
                value: 0,
                id: 'ascm.resourceType.vpn_connection',
              },
              {
                name: 'VPN 网关',
                value: 0,
                id: 'ascm.resourceType.vpn_gateway',
              },
              {
                name: 'SSL客户端',
                value: 0,
                id: 'ascm.resourceType.ssl_vpn_client_cert',
              },
            ],
            name: '网络',
            id: 'Networking',
          },
          {
            children: [
              {
                name: 'ECS实例',
                value: 413,
                id: 'ascm.resourceType.ecs_instance',
              },
              {
                name: 'ECS 磁盘',
                value: 563,
                id: 'ascm.resourceType.disk',
              },
              {
                name: 'ECS快照 SNAPSHOT',
                value: 501,
                id: 'ascm.resourceType.snapshot',
              },
              {
                name: 'ECS命令执行结果',
                value: 487,
                id: 'ascm.resourceType.ecs_order_result',
              },
              {
                name: '云盘快照链',
                value: 446,
                id: 'ascm.resourceType.snapshot_links',
              },
              {
                name: '弹性网卡',
                value: 423,
                id: 'ascm.resourceType.network_interface',
              },
              {
                name: 'ECS-安全组',
                value: 241,
                id: 'ascm.resourceType.security_group',
              },
              {
                name: 'ECS 镜像',
                value: 116,
                id: 'ascm.resourceType.image',
              },
              {
                name: '异步任务',
                value: 30,
                id: 'ascm.resourceType.ecs_task',
              },
              {
                name: '部署集',
                value: 28,
                id: 'ascm.resourceType.deployment_set',
              },
              {
                name: 'ECS-密钥对',
                value: 11,
                id: 'ascm.resourceType.keypair',
              },
              {
                name: '快照一致性组',
                value: 8,
                id: 'ascm.resourceType.ecs_snapshot_group',
              },
              {
                name: 'ECS命令',
                value: 8,
                id: 'ascm.resourceType.ecs_order',
              },
              {
                name: '存储集',
                value: 5,
                id: 'ascm.resourceType.storage_set',
              },
              {
                name: '自动快照策略',
                value: 1,
                id: 'ascm.resourceType.auto_snapshot_policy',
              },
              {
                name: '文件下发',
                value: 1,
                id: 'ascm.resourceType.ecs_file_send',
              },
              {
                name: 'HPC集群',
                value: 0,
                id: 'ascm.resourceType.ecs_hpccluster',
              },
              {
                name: 'ECS回收站',
                value: 0,
                id: 'ascm.resourceType.ecs_instance_recycle',
              },
              {
                name: 'ESS 伸缩组',
                value: 31,
                id: 'ascm.resourceType.scaling_group',
              },
              {
                name: 'ESS 定时任务',
                value: 2,
                id: 'ascm.resourceType.scheduled_task',
              },
              {
                name: 'ESS 告警任务',
                value: 0,
                id: 'ascm.resourceType.alarm_task',
              },
              {
                name: '命名空间（专有云高级版）',
                value: 2,
                id: 'ascm.resourceType.cree_namespace',
              },
              {
                name: '镜像仓库（专有云高级版）',
                value: 1,
                id: 'ascm.resourceType.cree_repo',
              },
              {
                name: '专有宿主机集群 DDH',
                value: 2,
                id: 'ascm.resourceType.dedicated_host_cluster',
              },
              {
                name: '专有宿主机 DDH',
                value: 1,
                id: 'ascm.resourceType.dedicated_host',
              },
              {
                name: '弹性高性能计算 E-HPC 集群',
                value: 3,
                id: 'ascm.resourceType.ehpc_cluster',
              },
              {
                name: '裸金属-智算算力集群',
                value: 1,
                id: 'ascm.resourceType.bmscluster',
              },
              {
                name: 'BMCP-密钥对',
                value: 1,
                id: 'ascm.resourceType.bmcp_keypair',
              },
              {
                name: '性能评测',
                value: 0,
                id: 'ascm.resourceType.bmcp_evaluation_task',
              },
              {
                name: 'BMCP实例',
                value: 0,
                id: 'ascm.resourceType.bmcp_instance',
              },
              {
                name: '容器-智算算力集群',
                value: 0,
                id: 'ascm.resourceType.ackcluster',
              },
              {
                name: '裸金属-超算算力集群',
                value: 0,
                id: 'ascm.resourceType.ehpccluster',
              },
              {
                name: 'BMCP-安全组',
                value: 0,
                id: 'ascm.resourceType.bmcp_security_group',
              },
              {
                name: 'EVPC',
                value: 0,
                id: 'ascm.resourceType.evpc_instance',
              },
              {
                name: 'ACK集群',
                value: 2,
                id: 'ascm.resourceType.cluster',
              },
              {
                name: '专线绑定',
                value: 0,
                id: 'ascm.resourceType.dedicated_line_binding',
              },
              {
                name: '裸机实例',
                value: 0,
                id: 'ascm.resourceType.bms_instance',
              },
              {
                name: '镜像仓库',
                value: 0,
                id: 'ascm.resourceType.cr_repo',
              },
              {
                name: '命名空间',
                value: 0,
                id: 'ascm.resourceType.cr_namespace',
              },
            ],
            name: '弹性计算',
            id: 'ElasticComputing',
          },
          {
            children: [
              {
                name: 'IaC模板',
                value: 423,
                id: 'ascm.resourceType.iac_module',
              },
              {
                name: 'IaC任务',
                value: 330,
                id: 'ascm.resourceType.iac_task',
              },
            ],
            name: '应用服务',
            id: 'ApplicationServices',
          },
        ],
      }}
    />
  </Wcontainer>
));

stories.add('多重环图', () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie
          height="300"
          config={{
            cycle: true,
            autoFormat: true,
          }}
          data={data}
        />
      </Wcontainer>
    </div>
    {/* <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie
          height="300"
          config={{
            cycle: true,
            tooltip: {
              valueFormatter(n, ...args) {
                return n;
              },
            },
          }}
          data={multiPieData2}
        />
      </Wcontainer>
    </div> */}
    {/* <div style={{ width: '33.33%' }}>
      <Wcontainer className="demos">
        <WmultiPie height="300" config={{ cycle: true }} data={multiPieData3} />
      </Wcontainer>
    </div> */}
  </div>
));

stories.add('多重环图(数据变化)', () => {
  const [data, setData] = useState(multiPieData);

  useEffect(() => {
    setTimeout(() => {
      setData(multiPieData2);
    }, 3000);
  }, []);
  return (
    <div>
      <WmultiPie
        height="300"
        config={{
          cycle: true,
        }}
        data={data}
      />
    </div>
  );
});
