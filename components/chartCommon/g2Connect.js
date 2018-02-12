'use strict';

function handlePlotmove(e) {

}

function handlePlotleave() {

}

function connect(charts) {
  for(const chartSrc of charts){
    for(const chartDest of charts){
      if(chartSrc === chartDest){
        continue;
      }
      chartSrc.on('plotmove', e => {chartDest.showTooltip(e);});
      chartSrc.on('plotleave', () => {chartDest.hideTooltip();})
    }
  }
}

export default (...charts) => {
  for(const chartSrc of charts){
    for(const chartDest of charts){
      if(chartSrc === chartDest){
        continue;
      }
      chartSrc.on('plotmove', e => {chartDest.showTooltip(e);});
      chartSrc.on('plotleave', () => {chartDest.hideTooltip();})
    }
  }
}