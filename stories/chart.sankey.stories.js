import React, { useState, useEffect } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Wsankey, Wcontainer } from '@alife/aisc-widgets';

const stories = storiesOf('Wsankey', module);
stories.add('基础桑基图', () => (
  <Wcontainer className="demos">
    <Wsankey height="500" config={{}} data={{
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
      const newData = {
        "nodes": [{"name": "Brazil"}, {"name": "Portugal"}, {"name": "France"}, {"name": "Spain"}, {"name": "England"}, {"name": "Canada"}, {"name": "Mexico"}, {"name": "USA"}, {"name": "Angola"}, {"name": "Senegal"}, {"name": "Morocco"}, {"name": "South Africa"}, {"name": "Mali"}, {"name": "China"}, {"name": "India"}],
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
          }, {"source": 8, "target": 13, "value": 5}, {
            "source": 8,
            "target": 14,
            "value": 1
          }, {"source": 9, "target": 13, "value": 5}, {
            "source": 9,
            "target": 14,
            "value": 1
          }, {"source": 12, "target": 13, "value": 5}, {
            "source": 12,
            "target": 14,
            "value": 1
          }, {"source": 10, "target": 13, "value": 5}, {
            "source": 10,
            "target": 14,
            "value": 1
          }]
      };
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
