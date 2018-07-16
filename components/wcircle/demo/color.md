---
order: 12
title:
  zh-CN: 自定义颜色
  en-US: Color
---

## zh-CN

自定义颜色

## en-US

basic use.


````jsx
import {
  Wcircle
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
      <Wcircle type="gauge" 
        title="标题"
        unit="%"
        status="red"
        percent={0.6}
        bottomTitle="底部标题"
        bottomNumber={2}
        bottomUnit="单位"
        bottomTrend="raise"
        color="#49DBFF"
      >
        70
      </Wcircle>
    </div>,
mountNode);
````
