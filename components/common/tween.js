class Tween {
  constructor(config, callback) {
    const { maxFps } = config;
    this.config = config;
    this._callback = callback;
    this.refresh = this.refresh.bind(this);
    this.lastUpdate = null;
    this.interval = 1000 / maxFps;
    this.timer = null;

    this.start();
  }

  start() {
    this._isPlay = true;
    this._startTime = Date.now();
    this.lastUpdate = this._startTime;
    this.refresh();
  }

  stop() {
    this._isPlay = false;
  }

  refresh() {
    if (this._isPlay && this.config.autoUpdate) {
      if (window.requestAnimationFrame) {
        this.timer = window.requestAnimationFrame(this.refresh);
      } else {
        this.timer = setTimeout(this.refresh, 1000 / 60);
      }

      const now = Date.now();
      if (this.config.maxFps < 60) {
        const delta = now - this.lastUpdate;
        if (delta > this.interval) {
          // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
          this.lastUpdate = now - (delta % this.interval);

          this.update(now);
        }
      } else {
        this.update(now);
      }
    }
  }

  update(time) {
    const now = time || Date.now();

    if (now < this._startTime) {
      return true;
    }

    let elapsed = (now - this._startTime) / this.config.duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    this._callback(elapsed);

    if (elapsed === 1) {
      this.stop();
    }
  }

  destroy() {
    this.stop();

    if (this.timer) {
      if (window.requestAnimationFrame) {
        window.cancelAnimationFrame(this.timer);
      } else {
        clearTimeout(this.timer);
      }
    }
  }
}

const nameMap = {};

export default function (name, config, callback) {
  if (nameMap[name]) {
    // restart
    nameMap[name].start();
  } else {
    // start
    nameMap[name] = new Tween(config, callback);
  }

  return nameMap[name];
}
