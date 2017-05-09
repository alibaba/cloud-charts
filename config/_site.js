const config = require('./config');
const routerCof = require('../site/theme/index')
module.exports = config(`./_site/`,`/${routerCof.routes.prefix}/`);
