import themes from '../themes/index';

class DashBoard {
  constructor(selector, options) {
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options = Object.assign(this.defaultOptions || {}, options || {});
    this.data = 0;
    this.oldData = 0;
    this.default = {
      padding: 80,//总空余
      lineWidth: 1,//刻度表的线宽
      counterClockwise: false,//画圆方向
      startAngle: 0.25 * Math.PI,//圆环起始角度
      endAngle: 0.75 * Math.PI,//圆环终止角度
      valueAngle: 0.25 * Math.PI,//默认值0的角度,
      timerCount: 0,//计时器状态
      tempData: 0,//动画过渡值
      timer: "",//计时器
      valueColor: "",
    };
    this.defaultOptions = {
      text: '', //仪表盘内部文案，不能与指针共存
      textColor: themes.colorBlack, //仪表盘内部文案
      textInDashboard: false,//是否在仪表盘内部显示文案
      textSize: 12,
      url: "",
      urlLength: 60,//icon长宽
      urlBottom: 30,
      // textLength: 20,//文字长度
      radius: 135,//刻度表线半径
      dialRadius: 165,//刻度盘圆环外半径
      blankAngle: 0 * Math.PI,//刻度盘空余角度
      angle: 1.5 * Math.PI,//刻度盘角度(包括空余角度)
      boardFontColor: themes.colorText12,//刻度盘字体颜色
      boardFontSize: 12,//刻度盘字体大小
      borderColor: themes.colorTransparent,//刻度表线颜色
      pointerColor: themes.colorText12,//刻度线颜色
      valuePartColor: themes.colorB16,//值域颜色
      maxPartColor: themes.colorFill12,//刻度盘圆环
      maxValueColor: themes.colorTransparent,//最大值标记颜色
      pointOutColor: themes.colorTransparent, // 值域刻度颜色
      currentValueColor: themes.colorTransparent,//当前值刻度线颜色
      pointerOutterWidth: 8,// 指针包含的外圆半径
      pointerWidth: 90,// 指针针尖相对于圆心半径
      pointerAngle: 0.6 * Math.PI,// 指针两边与圆心角度
      pointerPartColor: themes.colorB16,// 指针颜色
      pointerAreaWidth: 0,
      pointerAreaColor: themes.colorTransparent,
      dialWidth: 20,//刻度盘圆环宽度
      range: [0, 100],//取值范围,值域
      pointCount: 6,//刻度点 数量
      // pointOutCount: 8,//外部刻度点 数量
      transitionDuration: 300,//过度动画时间
      isShowMax: true,//是否有最大值标记
      maxValue: 0,
      maxValueLineWidth: 2,//最大值刻度线宽
      width: '',//canvas width
      height: '',//canvas height ,

    };
    this.options = Object.assign(this.defaultOptions, this.options);
    if (this.element) {
      this.init();
    }
  }

  init() {
    let self = this;
    this.data = this.options.range[0];
    //仪表盘
    let canvas = this.element.appendChild(document.createElement("canvas"));
    canvas.height = this.options.radius * (1 + Math.sin((this.options.angle - Math.PI) / 2)) + this.default.padding + this.default.lineWidth;
    canvas.width = this.options.radius * 2 + this.default.padding + this.default.lineWidth;
    if (this.options.height) {
      canvas.style.transform = `scale(${this.options.height / canvas.height})`;
    }
    if (this.options.width) {
      canvas.style.transform = `scale(${this.options.width / canvas.width})`;
    }

    this.context = canvas.getContext('2d');
    this.default.x = (canvas.width) / 2;
    this.default.y = canvas.width / 2;
    this.radius = this.default.x - this.default.padding / 2 - this.default.lineWidth / 2;
    this.default.startAngle = this.default.valueAngle = Math.PI - (this.options.angle - Math.PI) / 2;
    this.default.endAngle = (this.options.angle - Math.PI) / 2;
    this.drawDashBoard(this.data);
    this.drawIcon();
  }

  drawIcon() {
    if (this.options.url) {
      let pastImg = this.element.querySelector('.icon-img');
      if (pastImg) pastImg.remove();
      let img = document.createElement("img");
      img.src = this.options.url;
      img.className = "icon-img";
      img.style.position = "absolute";
      img.style.width = `${this.options.urlLength}px`;
      img.style.height = `${this.options.urlLength}px`;
      img.style.left = 0;
      img.style.right = 0;
      img.style.margin = "auto";
      img.style.bottom = `${this.options.urlBottom}px`;
      this.element.appendChild(img);
    }
  }

  changeColor(color) {
    let result = color;
    if (Array.isArray(color)) {
      result = this.context.createLinearGradient(0, 0, this.options.dialRadius * 2, 0);
      color.forEach((item, index) => {
        result.addColorStop(Number(index), item);
      });
    }
    return result
  }

  drawDashBoard(data) {
    let self = this;
    //刻度表 线
    let percent = (data - this.options.range[0]) / (this.options.range[1] - this.options.range[0]);
    let endAngle = percent * ((this.options.angle - this.options.blankAngle)) + this.default.startAngle + this.options.blankAngle / 2;
    this.arcDraw(this.radius, this.default.startAngle, this.default.endAngle, this.default.lineWidth, this.options.borderColor)

    //值域0以下部分
    let valuePartColor = this.changeColor(this.options.valuePartColor);
    this.arcDraw(this.options.dialRadius - this.options.dialWidth / 2, this.default.startAngle, this.default.startAngle + this.options.blankAngle / 2, this.options.dialWidth, valuePartColor);
    let maxPartColor = this.changeColor(this.options.maxPartColor);
    this.arcDraw(this.options.dialRadius - this.options.dialWidth / 2, this.default.startAngle, endAngle, this.options.dialWidth, valuePartColor);
    this.arcDraw(this.options.dialRadius - this.options.dialWidth / 2, endAngle, this.default.endAngle, this.options.dialWidth, maxPartColor);

    if (this.options.isShowMax) {
      this.options.maxValue = this.options.maxValue > this.options.range[1] ? this.options.range[1] : this.options.maxValue;
      this.valueDraw(this.options.maxValue, false, this.options.maxValueColor);
    }
    //刻度表 点
    this.pointDraw(this.options.pointCount, 0, 10, this.options.radius, this.options.pointerColor, true);
    this.pointDraw(this.options.pointCount, 0, this.options.dialWidth, this.options.dialRadius - this.options.dialWidth / 2, this.options.pointOutColor);
    if (this.options.text) {
      this.writeText(this.options.text, this.options.unit, this.options.url);
    } else {
      //刻度指针
      this.arcDraw(this.options.pointerOutterWidth, 0, 2 * Math.PI, 1, this.options.pointerPartColor, true);
      this.pointerDraw(data);// 指针中心点
      this.arcDraw(this.options.pointerAreaWidth, 0, 2 * Math.PI, 1, this.options.pointerPartColor, true, `${this.options.pointerAreaColor}`);
    }
  }

  arcDraw(radius, startAngle, endAngle, lineWidth, color, isfill, fillColor) {
    this.context.beginPath();
    this.context.arc(this.default.x, this.default.y, radius, startAngle, endAngle, this.default.counterClockwise);
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = color;
    this.context.stroke();
    if (isfill) {
      this.context.save();
      this.context.fillStyle = fillColor || color;
      this.context.fill();
      this.context.restore();
    }
  }

  //画值线
  pointLineDraw(A, pointerLength, R, color) {
    let Rmax = R + pointerLength / 2;
    let Rmin = R - pointerLength / 2;
    let X = this.default.x;
    let Y = this.default.y;
    this.context.beginPath();
    this.context.moveTo(X - Rmin * Math.cos(A), Y - Rmin * Math.sin(A));
    this.context.lineTo(X - Rmax * Math.cos(A), Y - Rmax * Math.sin(A));
    this.context.lineWidth = 2;
    this.context.strokeStyle = color;
    this.context.closePath();
    this.context.stroke();
  }

  //画刻度,刻度坐标公式(X-R*Math.cos(A) ,Y-R*sin(A))
  pointDraw(number, start, pointerLength, R, color, isText) {
    for (let i = start; i < number; i++) {
      let A = i / (number - 1) * (this.options.angle - this.options.blankAngle) + this.default.startAngle - Math.PI + this.options.blankAngle / 2;
      let Rmax = R + pointerLength / 2;
      let Rmin = R - pointerLength / 2;
      let X = this.default.x;
      let Y = this.default.y;
      let tx = X - (Rmin - this.options.boardFontSize) * Math.cos(A);
      let ty = Y - (Rmin - this.options.boardFontSize) * Math.sin(A);
      let text = (i != number - 1) ? i / (number - 1) * (this.options.range[1] - this.options.range[0]) + this.options.range[0] : '∞';
      this.context.beginPath();
      this.context.moveTo(X - Rmin * Math.cos(A), Y - Rmin * Math.sin(A));
      this.context.lineTo(X - Rmax * Math.cos(A), Y - Rmax * Math.sin(A));
      this.context.lineWidth = 1;
      this.context.strokeStyle = color;
      this.context.closePath();
      this.context.stroke();
      if (isText) {
        this.writeFontText(tx, ty, A - Math.PI / 2, text);//画刻度字
      }
    }
  }

  //仪表盘内部文案
  writeText(text, unit, url) {
    let textSize = Number(this.options.textSize);
    let yArr = [this.default.y + textSize, this.default.y + 2 * textSize];
    if (!url) yArr = [this.default.y, this.default.y + Number(textSize)];
    this.context.save();
    this.context.textAlign = "center";
    this.context.fillStyle = this.options.textColor;
    this.context.font = textSize + `px ${themes['widgets-font-family-txd-m-number']}`;
    this.context.fillText(text, this.default.x, yArr[0]);
    this.context.restore();
    this.context.save();
    this.context.textAlign = "center";
    this.context.fillStyle = this.options.unitColor;
    this.context.font = this.options.unitSize + `px ${themes['widgets-font-family-txd-m-number']}`;
    this.context.fillText(unit, this.default.x, yArr[1]);
    this.context.restore();
  }

  writeFontText(tx, ty, A, text) {
    this.context.save();
    // if (text == '∞') {
    //   tx += 10;
    // } else if (text == this.options.range[0]) {
    //   tx -= 10;
    // } else {
    this.context.translate(tx, ty);
    this.context.rotate(A);
    this.context.translate(-tx, -ty);
    // }
    if (text >= 10000) {
      text = text / 10000 + "W";
    }
    this.context.textAlign = "center";
    this.context.fillStyle = this.options.boardFontColor;
    this.context.font = this.options.boardFontSize + `px ${themes['widgets-font-family-txd-m-number']}`;
    this.context.fillText(text, tx, ty);
    this.context.restore();
  }

  //标值,可以选择在标记在刻度盘还是刻度表上,坐标公式(X-R*Math.cos(A) ,Y-R*sin(A))
  valueDraw(data, isInDial, color) {
    let A = (data - this.options.range[0]) / (this.options.range[1] - this.options.range[0]) * (this.options.angle - this.options.blankAngle) + this.default.startAngle - Math.PI + this.options.blankAngle / 2;
    let dialWidth, Rmax, Rmin;
    let X = this.default.x;
    let Y = this.default.y;
    let valueColor = this.changeColor(this.options.valuePartColor);

    if (isInDial) {
      dialWidth = 10;//线长度
      Rmax = this.radius + dialWidth / 2;
      Rmin = this.radius - dialWidth / 2;
    } else {
      Rmax = this.options.dialRadius;
      Rmin = this.options.dialRadius - this.options.dialWidth;
    }
    if (color) {
      valueColor = color;
    }
    this.context.beginPath();
    this.context.moveTo(X - Rmin * Math.cos(A), Y - Rmin * Math.sin(A));
    this.context.lineTo(X - Rmax * Math.cos(A), Y - Rmax * Math.sin(A));
    this.context.lineWidth = this.options.maxValueLineWidth;
    this.context.strokeStyle = valueColor;
    this.context.closePath();
    this.context.stroke();
  }

  //画指针
  pointerDraw(value) {
    let A = (value - this.options.range[0]) / (this.options.range[1] - this.options.range[0]) * (this.options.angle - this.options.blankAngle) + this.default.startAngle - Math.PI + this.options.blankAngle / 2;
    let a = this.options.pointerAngle;
    let X = this.default.x;
    let Y = this.default.y;
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(X - this.options.pointerOutterWidth * Math.cos(A - a / 2), Y - this.options.pointerOutterWidth * Math.sin(A - a / 2));
    this.context.lineTo(X - this.options.pointerWidth * Math.cos(A), Y - this.options.pointerWidth * Math.sin(A));
    this.context.lineTo(X - this.options.pointerOutterWidth * Math.cos(A + a / 2), Y - this.options.pointerOutterWidth * Math.sin(A + a / 2));
    this.context.lineTo(X - this.options.pointerOutterWidth * Math.cos(A), Y - this.options.pointerOutterWidth * Math.sin(A));
    this.context.lineWidth = 2;
    this.context.fillStyle = this.options.pointerPartColor;
    this.context.fill();
    this.context.restore();
  }

  getData() {
    return this.data;
  }

  setData(data, sync) {
    if (typeof data === 'number') {
      this.data = Object.assign(this.data, data);
      this.oldData = this.data;
      let little = (this.options.range[1] - this.options.range[0]) / 200000;
      this.data = data > this.options.range[1] ? (this.options.range[1] - little) : (data < this.options.range[0] ? this.options.range[0] : data);//Object.assign(this.data,data);
      //console.log(this.data)
      sync = sync === undefined ? true : sync;
      if (sync) this.render();
    }
  }

  addData(data, shift) {
    data = Array.isArray(data) ? data : [data];
    this.data = this.data.concat(data);
    if (shift) this.data.splice(0, data.length);
    this.render();
  }

  getOption(key) {
    if (key) return this.options[key];
    else return this.options;
  }

  setOption(options, sync) {
    sync = sync === undefined ? true : sync;
    Object.assign(this.options, options);
    if (sync) this.render();
  }

  animate() {
    //requestAnimationFrame( self.animate.bind(self) );
    let self = this;
    if (self.default.timer) {
      self.oldData = self.default.tempData;
      clearInterval(self.default.timer);
    }
    let width = self.options.radius * 2 + self.default.padding + self.default.lineWidth;
    let animateMove = function () {
      if (self.default.timerCount <= 50) {
        self.context.clearRect(0, 0, width, width);
        self.default.tempData = self.default.timerCount / 50 * (self.data - self.oldData) + self.oldData;
        self.drawDashBoard(self.default.tempData);
        self.default.timerCount = self.default.timerCount + 1;
      } else {
        clearInterval(self.default.timer)
      }
    };
    self.default.timer = setInterval(animateMove, self.options.transitionDuration / 50);
  }

  render() {
    this.default.timerCount = 0;
    this.animate()
  }
}


module.exports = DashBoard;
