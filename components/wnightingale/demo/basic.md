---
order: 1
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础

## en-US


````jsx
import { WNightingale } from '@alife/aisc-widgets';

const data = [
    {year: '2001', population: 41.8 },
    {year: '2002', population: 38 },
    {year: '2003', population: 33.7 },
    {year: '2004', population: 30.7 },
    {year: '2005', population: 25.8 },
    {year: '2006', population: 31.7 },
    {year: '2007', population: 33 },
    {year: '2008', population: 46 },
    {year: '2009', population: 38.3 },
    {year: '2010', population: 28 },
    {year: '2011', population: 42.5 },
    {year: '2012', population: 30.3 }
  ];

let options1 = {
  position: 'year*population',
  label: 'year',
  tooltip: {
    showTitle: false,
    formatter: (target, source, value) => {
      return {
        name: source.year,
        value
      };
    }
  }
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
            <WNightingale ref="chart1" config={options1} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
