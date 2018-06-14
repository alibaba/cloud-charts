---
order: 2
title:
  zh-CN: CPU
  en-US: CPU
---

## zh-CN

最简单的用法。

## en-US


````jsx
import { Wrectangle } from '@alife/aisc-widgets';

let data = {"success":true,"errorCode":null,"errorMsg":null,"data":[{"ncPower":50,"cpuUtil":0.00},{"ncPower":60,"cpuUtil":1.00},{"ncPower":70,"cpuUtil":2.00},{"ncPower":80,"cpuUtil":3.00},{"ncPower":90,"cpuUtil":4.00},{"ncPower":100,"cpuUtil":5.00},{"ncPower":110,"cpuUtil":6.00},{"ncPower":120,"cpuUtil":7.00},{"ncPower":130,"cpuUtil":8.00},{"ncPower":140,"cpuUtil":9.00},{"ncPower":150,"cpuUtil":10.00},{"ncPower":160,"cpuUtil":11.00},{"ncPower":170,"cpuUtil":12.00},{"ncPower":180,"cpuUtil":13.00},{"ncPower":190,"cpuUtil":14.00},{"ncPower":200,"cpuUtil":15.00},{"ncPower":210,"cpuUtil":16.00},{"ncPower":220,"cpuUtil":17.00},{"ncPower":230,"cpuUtil":18.00},{"ncPower":240,"cpuUtil":19.00},{"ncPower":250,"cpuUtil":20.00},{"ncPower":260,"cpuUtil":21.00},{"ncPower":270,"cpuUtil":22.00},{"ncPower":280,"cpuUtil":23.00},{"ncPower":290,"cpuUtil":24.00},{"ncPower":300,"cpuUtil":25.00},{"ncPower":310,"cpuUtil":26.00},{"ncPower":320,"cpuUtil":27.00},{"ncPower":330,"cpuUtil":28.00},{"ncPower":340,"cpuUtil":29.00},{"ncPower":350,"cpuUtil":30.00},{"ncPower":360,"cpuUtil":31.00},{"ncPower":370,"cpuUtil":32.00},{"ncPower":380,"cpuUtil":33.00},{"ncPower":390,"cpuUtil":34.00},{"ncPower":400,"cpuUtil":35.00},{"ncPower":410,"cpuUtil":36.00},{"ncPower":420,"cpuUtil":37.00},{"ncPower":430,"cpuUtil":38.00},{"ncPower":440,"cpuUtil":39.00},{"ncPower":450,"cpuUtil":40.00},{"ncPower":460,"cpuUtil":41.00},{"ncPower":470,"cpuUtil":42.00},{"ncPower":480,"cpuUtil":43.00},{"ncPower":490,"cpuUtil":44.00},{"ncPower":500,"cpuUtil":45.00},{"ncPower":510,"cpuUtil":46.00},{"ncPower":520,"cpuUtil":47.00},{"ncPower":530,"cpuUtil":48.00},{"ncPower":540,"cpuUtil":49.00},{"ncPower":550,"cpuUtil":50.00},{"ncPower":560,"cpuUtil":51.00},{"ncPower":570,"cpuUtil":52.00},{"ncPower":580,"cpuUtil":53.00},{"ncPower":590,"cpuUtil":54.00},{"ncPower":600,"cpuUtil":55.00},{"ncPower":610,"cpuUtil":56.00},{"ncPower":620,"cpuUtil":57.00},{"ncPower":630,"cpuUtil":58.00},{"ncPower":640,"cpuUtil":59.00},{"ncPower":650,"cpuUtil":60.00},{"ncPower":660,"cpuUtil":61.00},{"ncPower":670,"cpuUtil":62.00},{"ncPower":680,"cpuUtil":63.00},{"ncPower":690,"cpuUtil":64.00},{"ncPower":700,"cpuUtil":65.00},{"ncPower":710,"cpuUtil":66.00},{"ncPower":720,"cpuUtil":67.00},{"ncPower":730,"cpuUtil":68.00},{"ncPower":740,"cpuUtil":69.00},{"ncPower":750,"cpuUtil":70.00},{"ncPower":760,"cpuUtil":71.00},{"ncPower":770,"cpuUtil":72.00},{"ncPower":780,"cpuUtil":73.00},{"ncPower":790,"cpuUtil":74.00},{"ncPower":800,"cpuUtil":75.00},{"ncPower":810,"cpuUtil":76.00},{"ncPower":820,"cpuUtil":77.00},{"ncPower":830,"cpuUtil":78.00},{"ncPower":840,"cpuUtil":79.00},{"ncPower":850,"cpuUtil":80.00},{"ncPower":860,"cpuUtil":81.00},{"ncPower":870,"cpuUtil":82.00},{"ncPower":880,"cpuUtil":83.00},{"ncPower":890,"cpuUtil":84.00},{"ncPower":900,"cpuUtil":85.00},{"ncPower":910,"cpuUtil":86.00},{"ncPower":920,"cpuUtil":87.00},{"ncPower":930,"cpuUtil":88.00},{"ncPower":940,"cpuUtil":89.00},{"ncPower":950,"cpuUtil":90.00},{"ncPower":960,"cpuUtil":91.00},{"ncPower":970,"cpuUtil":92.00},{"ncPower":980,"cpuUtil":93.00},{"ncPower":990,"cpuUtil":94.00},{"ncPower":1000,"cpuUtil":95.00},{"ncPower":1010,"cpuUtil":96.00},{"ncPower":1020,"cpuUtil":97.00},{"ncPower":1030,"cpuUtil":98.00},{"ncPower":1040,"cpuUtil":99.00}]};

let options1 = {
  bin: {
    fields: [ 'cpuUtil', 'ncPower' ]
  }
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item" style={{height: "298px"}}>
            <Wrectangle config={options1} data={data.data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
