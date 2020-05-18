const lineTest = require('./wline.test.js');
const barTest = require('./wbar.test.js');

function setDefaultViewAndWait(d) {
  d.cases.forEach((c) => {
    if (!c.view) {
      c.view = { width: 480, height: 360 };
    }
    if (!c.wait) {
      c.wait = 1000;
    }
  });

  return d;
}

module.exports = [
  // setDefaultViewAndWait(lineTest),
  setDefaultViewAndWait(barTest),
];
