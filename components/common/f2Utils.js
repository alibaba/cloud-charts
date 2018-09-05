export function dealData(originData, config) {
  const newData = [];
  originData.forEach((oneData) => {
    const { name: dataName } = oneData;

    oneData.data.forEach((d, i) => {
      if (Array.isArray(d)) {
        const [x, y, ...extra] = d;
        newData.push({
          x,
          y,
          extra,
          type: `${dataName}`
        });
      } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
        const x = config.xAxis.categories[i];
        const y = isNaN(d) ? d[0] : d;
        newData.push({
          x,
          y,
          extra: [],
          type: `${dataName}`
        });
      } else {
        const { x, y, ...extra } = d;
        newData.push({
          x,
          y,
          extra,
          type: `${dataName}`
        });
      }
    });
  });

  return newData;
}

export function setDomStyle(elem, styleObj) {
  for (const prop in styleObj) {
    elem.style[prop] = styleObj[prop];
  }
}

export function setInlineDomStyle(styleObj) {
  let result = "style='";
  for (const prop in styleObj) {
    if (styleObj.hasOwnProperty(prop)) {
      result += `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${styleObj[prop]}; `;
    }
  }
  return `${result}'`;
}

let uniqueId = 0;
export function generateUniqueId(extra = '') {
  return `react-f2-${extra}${uniqueId++}`;
}

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 获取当前点击的点在canvas中的相对位置
export function getPoint(canvas, clientX, clientY) {
  const bbox = canvas.getBoundingClientRect();
  return {
    x: clientX - bbox.left,
    y: clientY - bbox.top
  };
}
