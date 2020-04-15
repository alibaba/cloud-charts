const transformVars = require('./transformVars');

/*
 * Define factory to create plugins that convert SASS variables to JS object
 *
 * @param {object} [opts] Options to pass to the `transformVars` method
 *
 * @return {SassExtractPluginInstance}
 */
const sassExtractJs = opts => ({
  run: options => ({
    postExtract: extractedVariables => transformVars(extractedVariables.global, opts || options),
  }),
});

module.exports = sassExtractJs;
