import React, { useState, useEffect } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Wsankey, Wcontainer } from '@alicloud/cloud-charts';

const stories = storiesOf('Wsankey', module);
stories.add('基础桑基图', () => (
  <Wcontainer className="demos">
    <Wsankey height="500" config={{

    }} data={{
      "nodes": [{"name": "Brazil"}, {"name": "Portugal"}, {"name": "France"}, {"name": "Spain"}, {"name": "England"}, {"name": "Canada"}, {"name": "Mexico"}, {"name": "USA"}, {"name": "Angola"}, {"name": "Senegal"}, {"name": "Morocco"}, {"name": "South Africa"}, {"name": "Mali"}, {"name": "China"}, {"name": "India"}, {"name": "Japan"}],
      "links": [
        {"source": 0, "target": 1, "value": 5}, {"source": 0, "target": 2, "value": 1}, {
          "source": 0,
          "target": 3,
          "value": 1
        }, {"source": 0, "target": 4, "value": 1}, {"source": 5, "target": 1, "value": 1}, {
          "source": 5,
          "target": 2,
          "value": 5
        }, {"source": 5, "target": 4, "value": 1}, {"source": 6, "target": 1, "value": 1}, {
          "source": 6,
          "target": 2,
          "value": 1
        }, {"source": 6, "target": 3, "value": 5}, {"source": 6, "target": 4, "value": 1}, {
          "source": 7,
          "target": 1,
          "value": 1
        }, {"source": 7, "target": 2, "value": 1}, {"source": 7, "target": 3, "value": 1}, {
          "source": 7,
          "target": 4,
          "value": 5
        }, {"source": 1, "target": 8, "value": 2}, {"source": 1, "target": 9, "value": 1}, {
          "source": 1,
          "target": 10,
          "value": 1
        }, {"source": 1, "target": 11, "value": 3}, {"source": 2, "target": 8, "value": 1}, {
          "source": 2,
          "target": 9,
          "value": 3
        }, {"source": 2, "target": 12, "value": 3}, {"source": 2, "target": 10, "value": 3}, {
          "source": 2,
          "target": 11,
          "value": 1
        }, {"source": 3, "target": 9, "value": 1}, {"source": 3, "target": 10, "value": 3}, {
          "source": 3,
          "target": 11,
          "value": 1
        }, {"source": 4, "target": 8, "value": 1}, {"source": 4, "target": 9, "value": 1}, {
          "source": 4,
          "target": 10,
          "value": 2
        }, {"source": 4, "target": 11, "value": 7}, {"source": 11, "target": 13, "value": 5}, {
          "source": 11,
          "target": 14,
          "value": 1
        }, {"source": 11, "target": 15, "value": 3}, {"source": 8, "target": 13, "value": 5}, {
          "source": 8,
          "target": 14,
          "value": 1
        }, {"source": 8, "target": 15, "value": 3}, {"source": 9, "target": 13, "value": 5}, {
          "source": 9,
          "target": 14,
          "value": 1
        }, {"source": 9, "target": 15, "value": 3}, {"source": 12, "target": 13, "value": 5}, {
          "source": 12,
          "target": 14,
          "value": 1
        }, {"source": 12, "target": 15, "value": 3}, {"source": 10, "target": 13, "value": 5}, {
          "source": 10,
          "target": 14,
          "value": 1
        }, {"source": 10, "target": 15, "value": 3}]
    }}/>
  </Wcontainer>
));

stories.add('动态数据', () => {
  const oldData = {
    "nodes": [{"name": "Brazil"}, {"name": "Portugal"}, {"name": "France"}, {"name": "Spain"}, {"name": "England"}, {"name": "Canada"}, {"name": "Mexico"}, {"name": "USA"}, {"name": "Angola"}, {"name": "Senegal"}, {"name": "Morocco"}, {"name": "South Africa"}, {"name": "Mali"}, {"name": "China"}, {"name": "India"}, {"name": "Japan"}],
    "links": [
      {"source": 0, "target": 1, "value": 5}, {"source": 0, "target": 2, "value": 1}, {
        "source": 0,
        "target": 3,
        "value": 1
      }, {"source": 0, "target": 4, "value": 1}, {"source": 5, "target": 1, "value": 1}, {
        "source": 5,
        "target": 2,
        "value": 5
      }, {"source": 5, "target": 4, "value": 1}, {"source": 6, "target": 1, "value": 1}, {
        "source": 6,
        "target": 2,
        "value": 1
      }, {"source": 6, "target": 3, "value": 5}, {"source": 6, "target": 4, "value": 1}, {
        "source": 7,
        "target": 1,
        "value": 1
      }, {"source": 7, "target": 2, "value": 1}, {"source": 7, "target": 3, "value": 1}, {
        "source": 7,
        "target": 4,
        "value": 5
      }, {"source": 1, "target": 8, "value": 2}, {"source": 1, "target": 9, "value": 1}, {
        "source": 1,
        "target": 10,
        "value": 1
      }, {"source": 1, "target": 11, "value": 3}, {"source": 2, "target": 8, "value": 1}, {
        "source": 2,
        "target": 9,
        "value": 3
      }, {"source": 2, "target": 12, "value": 3}, {"source": 2, "target": 10, "value": 3}, {
        "source": 2,
        "target": 11,
        "value": 1
      }, {"source": 3, "target": 9, "value": 1}, {"source": 3, "target": 10, "value": 3}, {
        "source": 3,
        "target": 11,
        "value": 1
      }, {"source": 4, "target": 8, "value": 1}, {"source": 4, "target": 9, "value": 1}, {
        "source": 4,
        "target": 10,
        "value": 2
      }, {"source": 4, "target": 11, "value": 7}, {"source": 11, "target": 13, "value": 5}, {
        "source": 11,
        "target": 14,
        "value": 1
      }, {"source": 11, "target": 15, "value": 3}, {"source": 8, "target": 13, "value": 5}, {
        "source": 8,
        "target": 14,
        "value": 1
      }, {"source": 8, "target": 15, "value": 3}, {"source": 9, "target": 13, "value": 5}, {
        "source": 9,
        "target": 14,
        "value": 1
      }, {"source": 9, "target": 15, "value": 3}, {"source": 12, "target": 13, "value": 5}, {
        "source": 12,
        "target": 14,
        "value": 1
      }, {"source": 12, "target": 15, "value": 3}, {"source": 10, "target": 13, "value": 5}, {
        "source": 10,
        "target": 14,
        "value": 1
      }, {"source": 10, "target": 15, "value": 3}]
  };
  const [ d, setD ] = useState(() => oldData);
  useEffect(() => {
    const timer = setTimeout(() => {
      const newData = {"nodes":[{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"tianji.CapabilityService#"},{"name":"tianji.CapabilityService#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"portal"},{"name":"app"},{"name":"app"},{"name":"tianji_config"},{"name":"portal"},{"name":"portal"},{"name":"portal"},{"name":"tianji_config"},{"name":"tianji_config"},{"name":"app"},{"name":"portal"},{"name":"portal"},{"name":"tianji_config"},{"name":"portal"},{"name":"portal"},{"name":"portal"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"1000"},{"name":"10006"},{"name":"10006"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"789"},{"name":"484"},{"name":"155"},{"name":"206"},{"name":"781"},{"name":"208"},{"name":"149"},{"name":"412"},{"name":"112"},{"name":"712"},{"name":"62"},{"name":"688"},{"name":"433"},{"name":"900"},{"name":"392"},{"name":"99"},{"name":"978"},{"name":"134"},{"name":"250"},{"name":"312"},{"name":"889"},{"name":"835"}],"links":[{"source":1,"target":22,"value":1},{"source":1,"target":23,"value":1},{"source":1,"target":24,"value":1},{"source":1,"target":25,"value":1},{"source":1,"target":26,"value":1},{"source":1,"target":27,"value":1},{"source":1,"target":28,"value":1},{"source":1,"target":29,"value":1},{"source":1,"target":30,"value":1},{"source":1,"target":31,"value":1},{"source":1,"target":32,"value":1},{"source":1,"target":33,"value":1},{"source":1,"target":34,"value":1},{"source":1,"target":35,"value":1},{"source":1,"target":36,"value":1},{"source":1,"target":37,"value":1},{"source":1,"target":38,"value":1},{"source":1,"target":39,"value":1},{"source":1,"target":40,"value":1},{"source":1,"target":41,"value":1},{"source":1,"target":42,"value":1},{"source":1,"target":43,"value":1},{"source":22,"target":44,"value":1},{"source":23,"target":45,"value":1},{"source":24,"target":46,"value":1},{"source":25,"target":47,"value":1},{"source":26,"target":48,"value":1},{"source":27,"target":49,"value":1},{"source":28,"target":50,"value":1},{"source":29,"target":51,"value":1},{"source":30,"target":52,"value":1},{"source":31,"target":53,"value":1},{"source":32,"target":54,"value":1},{"source":33,"target":55,"value":1},{"source":34,"target":56,"value":1},{"source":35,"target":57,"value":1},{"source":36,"target":58,"value":1},{"source":37,"target":59,"value":1},{"source":38,"target":60,"value":1},{"source":39,"target":61,"value":1},{"source":40,"target":62,"value":1},{"source":41,"target":63,"value":1},{"source":42,"target":64,"value":1},{"source":43,"target":65,"value":1},{"source":44,"target":66,"value":1},{"source":45,"target":67,"value":1},{"source":46,"target":68,"value":1},{"source":47,"target":69,"value":1},{"source":48,"target":70,"value":1},{"source":49,"target":71,"value":1},{"source":50,"target":72,"value":1},{"source":51,"target":73,"value":1},{"source":52,"target":74,"value":1},{"source":53,"target":75,"value":1},{"source":54,"target":76,"value":1},{"source":55,"target":77,"value":1},{"source":56,"target":78,"value":1},{"source":57,"target":79,"value":1},{"source":58,"target":80,"value":1},{"source":59,"target":81,"value":1},{"source":60,"target":82,"value":1},{"source":61,"target":83,"value":1},{"source":62,"target":84,"value":1},{"source":63,"target":85,"value":1},{"source":64,"target":86,"value":1},{"source":65,"target":87,"value":1}]};
      setD(newData);
      action('更新数据')(newData);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wcontainer className="demos">
      <Wsankey height="500" config={{}} data={d}/>
    </Wcontainer>
  );
});

stories.add('桑基图数据测试', () => (
  <Wcontainer className="demos">
    <Wsankey height="500" config={{}} data={
      {"nodes":[{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"pangu.PanguSupervisor#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"tianji.CapabilityService#"},{"name":"tianji.CapabilityService#"},{"name":"tianji.ArmoryStateWriteback#"},{"name":"pangu.PanguSupervisor#"},{"name":"portal"},{"name":"app"},{"name":"app"},{"name":"tianji_config"},{"name":"portal"},{"name":"portal"},{"name":"portal"},{"name":"tianji_config"},{"name":"tianji_config"},{"name":"app"},{"name":"portal"},{"name":"portal"},{"name":"tianji_config"},{"name":"portal"},{"name":"portal"},{"name":"portal"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"app"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"1000"},{"name":"10006"},{"name":"10006"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"10006"},{"name":"1000"},{"name":"10006"},{"name":"1000"},{"name":"1000"},{"name":"789"},{"name":"484"},{"name":"155"},{"name":"206"},{"name":"781"},{"name":"208"},{"name":"149"},{"name":"412"},{"name":"112"},{"name":"712"},{"name":"62"},{"name":"688"},{"name":"433"},{"name":"900"},{"name":"392"},{"name":"99"},{"name":"978"},{"name":"134"},{"name":"250"},{"name":"312"},{"name":"889"},{"name":"835"}],"links":[{"source":1,"target":22,"value":1},{"source":1,"target":23,"value":1},{"source":1,"target":24,"value":1},{"source":1,"target":25,"value":1},{"source":1,"target":26,"value":1},{"source":1,"target":27,"value":1},{"source":1,"target":28,"value":1},{"source":1,"target":29,"value":1},{"source":1,"target":30,"value":1},{"source":1,"target":31,"value":1},{"source":1,"target":32,"value":1},{"source":1,"target":33,"value":1},{"source":1,"target":34,"value":1},{"source":1,"target":35,"value":1},{"source":1,"target":36,"value":1},{"source":1,"target":37,"value":1},{"source":1,"target":38,"value":1},{"source":1,"target":39,"value":1},{"source":1,"target":40,"value":1},{"source":1,"target":41,"value":1},{"source":1,"target":42,"value":1},{"source":1,"target":43,"value":1},{"source":22,"target":44,"value":1},{"source":23,"target":45,"value":1},{"source":24,"target":46,"value":1},{"source":25,"target":47,"value":1},{"source":26,"target":48,"value":1},{"source":27,"target":49,"value":1},{"source":28,"target":50,"value":1},{"source":29,"target":51,"value":1},{"source":30,"target":52,"value":1},{"source":31,"target":53,"value":1},{"source":32,"target":54,"value":1},{"source":33,"target":55,"value":1},{"source":34,"target":56,"value":1},{"source":35,"target":57,"value":1},{"source":36,"target":58,"value":1},{"source":37,"target":59,"value":1},{"source":38,"target":60,"value":1},{"source":39,"target":61,"value":1},{"source":40,"target":62,"value":1},{"source":41,"target":63,"value":1},{"source":42,"target":64,"value":1},{"source":43,"target":65,"value":1},{"source":44,"target":66,"value":1},{"source":45,"target":67,"value":1},{"source":46,"target":68,"value":1},{"source":47,"target":69,"value":1},{"source":48,"target":70,"value":1},{"source":49,"target":71,"value":1},{"source":50,"target":72,"value":1},{"source":51,"target":73,"value":1},{"source":52,"target":74,"value":1},{"source":53,"target":75,"value":1},{"source":54,"target":76,"value":1},{"source":55,"target":77,"value":1},{"source":56,"target":78,"value":1},{"source":57,"target":79,"value":1},{"source":58,"target":80,"value":1},{"source":59,"target":81,"value":1},{"source":60,"target":82,"value":1},{"source":61,"target":83,"value":1},{"source":62,"target":84,"value":1},{"source":63,"target":85,"value":1},{"source":64,"target":86,"value":1},{"source":65,"target":87,"value":1}]}
    }/>
  </Wcontainer>
));
