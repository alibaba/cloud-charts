const nameMap = {};

export default function (name, duration, callback) {
  if (nameMap[name]) {
    //restart
    nameMap[name].start();
  } else {
    //start
    nameMap[name] = new Tween(duration, callback);
  }
}

class Tween {
  constructor(duration, callback) {
    this._duration = duration;
    this._callback = callback;
    this.refresh = this.refresh.bind(this);

    this.start();
  }

  start() {
    this._isPlay = true;
    this._startTime = Date.now();
    this.refresh();
  }

  stop() {
    this._isPlay = false;
  }

  refresh() {
    if (this._isPlay) {
      if(window.requestAnimationFrame) {
        window.requestAnimationFrame(this.refresh);
      } else {
        setTimeout(this.refresh, 1000/60);
      }
      this.update();
    }
  }

  update() {
    const time = Date.now();

    if (time < this._startTime) {
      return true;
    }

    let elapsed = (time - this._startTime) / this._duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    this._callback(elapsed);

    if (elapsed === 1) {
      this.stop();
    }
  }
}