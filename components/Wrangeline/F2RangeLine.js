import React from 'react';
import { setDomStyle, generateUniqueId } from '../common/f2Utils';
import Line from '../Wline/F2Line';
import { color } from '../themes/';

const bChartOptions = {
  padding: [0, 0, 0, 0],
  legend: { show: false },
  xAxis: { show: false },
  yAxis: { show: false },
  tooltip: { show: false },
  showPointFirst: false,
};

const $S = {
  bContainer: {
    margin: 12,
    border: `1px solid ${color.widgetsColorBlue}`,
    position: 'relative',
  },
  bMark: {
    height: '100%',
    position: 'absolute',
    top: 0,
    border: `1px solid ${color.widgetsColorBlue}`,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    boxSizing: 'border-box',
    zIndex: 1,
  },
  bTran: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: '50%',
    borderWidth: 7,
    borderColor: 'transparent',
    borderBottomColor: color.widgetsColorBlue,
    borderStyle: 'solid',
    marginTop: -14,
    marginLeft: -7,
  },
  transMark1: {
    position: 'absolute',
    left: 0,
    top: -1,
    height: '100%',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  transMark2: {
    position: 'absolute',
    right: 0,
    top: -1,
    height: '100%',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
};
export default class RangeLine extends React.PureComponent {
  constructor(props) {
    super(props);

    const { data, config } = this.props;
    let { rangeStart } = config;

    if (!rangeStart && data && data[0]) {
      rangeStart = data[0].data[0][0];
    }

    this.id = generateUniqueId('rangeline');
    this.bMarkX = 0;
    this.bMarkLeft = 0;
    this.bMarkEndX = 0;

    const rangeStartIndex = this.getGetRangeStartIndex(rangeStart);

    this.state = {
      rangeStartIndex,
    };
  }

  componentDidMount() {
    // 计算底部的mark宽度
    this.calculateBMarkSize();
    // 绑定底部容器的点击事件
    this.bindBContainerEvt();
    // 绑定底部容器区块的点击事件
    this.bindBMarkEvt();
  }

  getGetRangeStartIndex = rangeStart => {
    const { data } = this.props;
    let findIndex;
    data[0].data.forEach((item, index) => {
      if (item[0] === rangeStart) {
        findIndex = index;
      }
    });
    if (!findIndex) {
      return 0;
    } else {
      return findIndex;
    }
  }

  calculateBMarkSize = () => {
    const container = document.querySelector(`#${this.id}`);
    const { data, config } = this.props;
    const { rangeLength } = config;
    const dataLength = data[0].data.length;
    const bContainer = container.querySelector(`.${this.id}-bContainer`);
    const bMark = container.querySelector(`.${this.id}-bMark`);
    const bContainerWidth = bContainer.getClientRects()[0].width;
    const bMarkWidth = bContainerWidth * rangeLength / dataLength;
    this.dataLength = dataLength;
    this.bContainer = bContainer;
    this.bContainerWidth = bContainerWidth;
    this.bContainerLeft = bContainer.getClientRects()[0].left;
    this.bMark = bMark;
    this.bMarkWidth = bMarkWidth;
    setDomStyle(bMark, {
      width: `${bMarkWidth}px`,
    });
    this.setBMarkPos(0);
  }

  setBMarkPos = x => {
    if (x < 0) {
      x = 0;
    }
    // 设置mark元素的位置
    setDomStyle(this.bMark, {
      left: `${x}px`,
    });
    // 同时设置两边的半透明区域的位置
    const transMark1 = document.querySelector(`#${this.id}-trans1`);
    const transMark2 = document.querySelector(`#${this.id}-trans2`);
    setDomStyle(transMark1, {
      width: `${x}px`,
    });
    const bMark2Width = this.bContainerWidth - (x + this.bMarkWidth);

    setDomStyle(transMark2, {
      width: `${bMark2Width > 1 ? bMark2Width - 1 : bMark2Width}px`,
    });
  }

  bindBContainerEvt = () => {
    const container = document.querySelector(`#${this.id}`);
    const bContainer = container.querySelector(`.${this.id}-bContainer`);

    bContainer.addEventListener('touchstart', e => {
      e.stopPropagation();
      let x = e.touches[0].clientX;
      if (x < 0) {
        x = 0;
      } else if (x + this.bMarkWidth > this.bContainerWidth) {
        x = this.bContainerWidth - this.bMarkWidth / 2;
      }
      this.setBMarkPos(x - this.bMarkWidth / 2);
      const rangeStartIndex = Math.round(x / this.bContainerWidth * this.dataLength);
      this.setState({
        rangeStartIndex,
      });
    });
  }

  bindBMarkEvt = () => {
    this.bMark.addEventListener('touchstart', e => {
      e.stopPropagation();
      this.bMarkX = e.touches[0].clientX;
      this.bMarkLeft = this.bMark.getClientRects()[0].left;
    });
    this.bMark.addEventListener('touchmove', e => {
      const touchX = e.touches[0].clientX;
      const dist = touchX - this.bMarkX;
      this.bMarkEndX = this.bMarkLeft + dist;

      if (this.bMarkEndX + this.bMarkWidth > this.bContainerWidth) {
        this.bMarkEndX = this.bContainerWidth - this.bMarkWidth;
      } else if (this.bMarkEndX <= 0) {
        this.bMarkEndX = 0;
      }

      this.setBMarkPos(this.bMarkEndX);
    });
    this.bMark.addEventListener('touchend', () => {
      const rangeStartIndex = Math.round(this.bMarkEndX / this.bContainerWidth * this.dataLength);
      this.setState({
        rangeStartIndex,
      });
    });
  }

  render() {
    const { data, config } = this.props;
    const { rangeStartIndex } = this.state;
    const { rangeLength } = config;

    const topChartData = [
      {
        name: data[0].name,
        data: data[0].data.slice(rangeStartIndex, rangeStartIndex + rangeLength),
      },
    ];

    return (
      <div id={this.id}>
        <Line data={topChartData} />
        <div
          style={$S.bContainer}
          className={`${this.id}-bContainer`}
          ref={o => {
            this.bContainer = o;
          }}
        >
          <div style={$S.transMark1} id={`${this.id}-trans1`} />
          <div style={$S.bMark} className={`${this.id}-bMark`}>
            <div style={$S.bTran} />
          </div>
          <div style={$S.transMark2} id={`${this.id}-trans2`} />
          <Line data={data} config={bChartOptions} height={30} />
        </div>
      </div>
    );
  }
}
