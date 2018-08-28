"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dealData = dealData;
exports.setDomStyle = setDomStyle;
exports.setInlineDomStyle = setInlineDomStyle;
exports.generateUniqueId = generateUniqueId;
exports.escapeHtml = escapeHtml;
exports.getPoint = getPoint;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function dealData(originData, config) {
  var newData = [];
  originData.forEach(function (oneData) {
    var dataName = oneData.name;


    oneData.data.forEach(function (d, i) {
      if (Array.isArray(d)) {
        var _d = _toArray(d),
            x = _d[0],
            y = _d[1],
            extra = _d.slice(2);

        newData.push({
          x: x,
          y: y,
          extra: extra,
          type: "" + dataName
        });
      } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
        var _x = config.xAxis.categories[i];
        var _y = isNaN(d) ? d[0] : d;
        newData.push({
          x: _x,
          y: _y,
          extra: [],
          type: "" + dataName
        });
      } else {
        var _x2 = d.x,
            _y2 = d.y,
            _extra = _objectWithoutProperties(d, ["x", "y"]);

        newData.push({
          x: _x2,
          y: _y2,
          extra: _extra,
          type: "" + dataName
        });
      }
    });
  });

  return newData;
}

function setDomStyle(elem, styleObj) {
  for (var prop in styleObj) {
    elem.style[prop] = styleObj[prop];
  }
}

function setInlineDomStyle(styleObj) {
  var result = "style='";
  for (var prop in styleObj) {
    if (styleObj.hasOwnProperty(prop)) {
      result += prop.replace(/([A-Z])/g, '-$1').toLowerCase() + ": " + styleObj[prop] + "; ";
    }
  }
  return result + "'";
}

var uniqueId = 0;
function generateUniqueId() {
  var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return "react-f2-" + extra + uniqueId++;
}

function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// 获取当前点击的点在canvas中的相对位置
function getPoint(canvas, clientX, clientY) {
  var bbox = canvas.getBoundingClientRect();
  return {
    x: clientX - bbox.left,
    y: clientY - bbox.top
  };
};