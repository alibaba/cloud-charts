import React, { Component } from 'react';

class SliderItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { count, item } = this.props;
    const width = `${100 / count}%`;
    return (
      <li className="slider-item" style={{ width }}>
        <img src={item.src} alt={item.alt} />
      </li>
    );
  }
}

class SliderDots extends Component {
  constructor(props) {
    super(props);
  }

  handleDotClick(i) {
    const option = i - this.props.nowLocal;
    this.props.turn(option);
  }

  render() {
    const dotNodes = [];
    const { count, nowLocal } = this.props;
    for (let i = 0; i < count; i++) {
      dotNodes[i] = (
        <span
          key={`dot${i}`}
          className={`slider-dot${i === this.props.nowLocal ? ' slider-dot-selected' : ''}`}
          onClick={this.handleDotClick.bind(this, i)}
        />
      );
    }
    return (
      <div className="slider-dots-wrap">
        {dotNodes}
      </div>
    );
  }
}


class SliderArrows extends Component {
  constructor(props) {
    super(props);
  }

  handleArrowClick(option) {
    this.props.turn(option);
  }

  render() {
    return (
      <div className="slider-arrows-wrap">
        <span
          className="slider-arrow slider-arrow-left"
          onClick={this.handleArrowClick.bind(this, -1)}
        >
          &lt;
        </span>
        <span
          className="slider-arrow slider-arrow-right"
          onClick={this.handleArrowClick.bind(this, 1)}
        >
          &gt;
        </span>
      </div>
    );
  }
}


class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLocal: 0,
    };
  }

  // 向前向后多少
  turn(n) {
    let _n = this.state.nowLocal + n;
    if (_n < 0) {
      _n += this.props.items.length;
    }
    if (_n >= this.props.items.length) {
      _n -= this.props.items.length;
    }
    this.setState({ nowLocal: _n });
  }

  // 开始自动轮播
  goPlay() {
    if (this.props.autoplay) {
      this.autoPlayFlag = setInterval(() => {
        if (this.sliderDom) {
          this.turn(1);
        }
      }, this.props.delay * 1000);
    }
  }

  // 暂停自动轮播
  pausePlay() {
    clearInterval(this.autoPlayFlag);
  }

  componentDidMount() {
    this.goPlay();
  }

  render() {
    const count = this.props.items.length;

    const itemNodes = this.props.items.map((item, idx) => <SliderItem item={item} count={count} key={`item${idx}`} />);

    const arrowsNode = <SliderArrows turn={this.turn.bind(this)} />;

    const dotsNode = <SliderDots turn={this.turn.bind(this)} count={count} nowLocal={this.state.nowLocal} />;

    return (
      <div
        ref={ref => this.sliderDom = ref}
        className="slider"
        onMouseOver={this.props.pause ? this.pausePlay.bind(this) : null} onMouseOut={this.props.pause ? this.goPlay.bind(this) : null}
      >
        <div className="slider-inner">
          <ul
            style={{
              left: `${-100 * this.state.nowLocal}%`,
              transitionDuration: `${this.props.speed}s`,
              width: `${this.props.items.length * 100}%`
            }}
          >
            {itemNodes}
          </ul>
        </div>
        {this.props.arrows ? arrowsNode : null}
        {this.props.dots ? dotsNode : null}
      </div>
    );
  }
}

Slider.defaultProps = {
  speed: 1,
  delay: 2,
  pause: true,
  autoplay: true,
  dots: true,
  arrows: true,
  items: [],
};

Slider.autoPlayFlag = null;

export default Slider;
