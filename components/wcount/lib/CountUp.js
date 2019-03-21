/*

 countUp.js
 by @inorganik

 */

// target = id of html element or var of previously selected html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places, default 0
// duration = duration of animation in seconds, default 2
// options = optional object of options (see below)

export default function (target, startVal, endVal, decimals, duration, options) {

    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    // default options
    this.options = {
      useEasing: true, // toggle easing
      useGrouping: true, // 1,000,000 vs 1000000
      separator: ',', // character to use as a separator
      decimal: '.', // character to use as a decimal
      placeholder: "-",//非数据时的替换
    };
    // extend default options with passed options object
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        this.options[key] = options[key];
      }
    }
    if (this.options.separator === '') this.options.useGrouping = false;
    if (!this.options.prefix) this.options.prefix = '';
    if (!this.options.suffix) this.options.suffix = '';

    this.d = (typeof target === 'string') ? document.getElementById(target.replace('#', '')) : target;
    this.startVal = Number(startVal);
    if (isNaN(startVal)) this.startVal = Number((startVal.match(/[\d]+/g) || []).join('')); // strip non-numerical characters
    this.endVal = Number(endVal);
    if (isNaN(endVal)) this.endVal = Number((endVal.match(/[\d]+/g) || []).join('')); // strip non-numerical characters
    this.countDown = (this.startVal > this.endVal);
    this.frameVal = this.startVal;
    this.decimals = Math.max(0, decimals || 0);
    this.dec = Math.pow(10, this.decimals);
    this.duration = Number(duration) * 1000 || 2000;
    var self = this;

    this.version = function () {
      return '1.5.3';
    };

    // Print value to target
    this.printValue = function (value) {
      const result = (!isNaN(value)) ? self.formatNumber(value) : self.options.placeholder;
      if (self.d.tagName === 'INPUT') {
        this.d.value = result;
      }
      else if (self.d.tagName === 'text') {
        this.d.textContent = result;
      }
      else {
        let html = '';
        for (let i = 0; i < result.length; i++) {
          const s = result.charAt(i);
          if (s === self.options.separator) {
            html += '<span class="count-up-separator">' + s + '</span>';
          } else if (s === self.options.decimal) {
            html += '<span class="count-up-decimal">' + s + '</span>';
          } else {
            html += '<span class="count-up-num-' + s + '">' + s + '</span>';
          }
        }
        this.d.innerHTML = html;
      }
    };

    // Robert Penner's easeOutExpo
    this.easeOutExpo = function (t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };
    this.count = function (timestamp) {

      if (!self.startTime) {
        self.throttle = 0;
        self.startTime = timestamp;
      }

      self.timestamp = timestamp;

      var progress = timestamp - self.startTime;
      self.remaining = self.duration - progress;

      // 偶数次渲染，或者最后一次才会渲染dom
      if (self.throttle % 2 === 0 || progress >= self.duration) {
        // to ease or not to ease
        if (self.options.useEasing) {
          if (self.countDown) {
            self.frameVal = self.startVal - self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
          } else {
            self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
          }
        } else {
          if (self.countDown) {
            self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
          } else {
            self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
          }
        }

        // don't go past endVal since progress can exceed duration in the last frame
        if (self.countDown) {
          self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
        } else {
          self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
        }

        // decimal
        self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

        // format and print value
        self.printValue(self.frameVal);
      }

      self.throttle = self.throttle + 1;

      // whether to continue
      if (progress < self.duration) {
        self.rAF = requestAnimationFrame(self.count);
      } else {
        if (self.callback) self.callback();
      }
    };
    // start your animation
    this.start = function (callback) {
      self.callback = callback;
      // make sure values are valid
      if (!isNaN(self.endVal) && !isNaN(self.startVal) && self.startVal !== self.endVal) {
        self.rAF = requestAnimationFrame(self.count);
      } else if (self.startVal === self.endVal) {
        console.log('countUp error: startVal and endVal is equal');
        self.printValue(endVal);
      } else {
        console.log('countUp error: startVal or endVal is not a number');
        self.printValue(endVal);
      }
      return false;
    };
    // toggles pause/resume animation
    this.pauseResume = function () {
      if (!self.paused) {
        self.paused = true;
        cancelAnimationFrame(self.rAF);
      } else {
        self.paused = false;
        delete self.startTime;
        self.duration = self.remaining;
        self.startVal = self.frameVal;
        requestAnimationFrame(self.count);
      }
    };
    // reset to startVal so animation can be run again
    this.reset = function () {
      self.paused = false;
      delete self.startTime;
      self.startVal = startVal;
      cancelAnimationFrame(self.rAF);
      self.printValue(self.startVal);
    };
    // pass a new endVal and start animation
    this.update = function (newEndVal) {
      cancelAnimationFrame(self.rAF);
      self.paused = false;
      delete self.startTime;
      self.startVal = self.frameVal;
      self.endVal = Number(newEndVal);
      self.countDown = (self.startVal > self.endVal);
      if (!isNaN(self.startVal) && !isNaN(self.endVal)) {
        self.rAF = requestAnimationFrame(self.count);
      } else {
        self.printValue(self.endVal)
      }

    };
    this.formatNumber = function (num) {
      var neg = (num < 0),
        x, x1, x2, x3, i, len;
      let numStr = Math.abs(num).toFixed(self.decimals) + '';
      x = numStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? self.options.decimal + x[1] : '';
      if (self.options.useGrouping) {
        x3 = '';
        for (i = 0, len = x1.length; i < len; ++i) {
          if (i !== 0 && ((i % 3) === 0)) {
            x3 = self.options.separator + x3;
          }
          x3 = x1[len - i - 1] + x3;
        }
        x1 = x3;
      }
      return (neg ? '-' : '') + self.options.prefix + x1 + x2 + self.options.suffix;
    };

    // format startVal on initialization
    self.printValue(self.startVal);
  };


// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 0, 99.99, 2, 2.5);
// numAnim.start();
// numAnim.update(135);
// with optional callback:
// numAnim.start(someMethodToCallOnComplete);
