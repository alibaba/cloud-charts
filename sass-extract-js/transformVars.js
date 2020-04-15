const camelCase = require('camel-case');

/*
 * Add escaped quotes around font names other than the generic CSS font families
 * While quotes are not required, they are recommended by the spec
 * https://www.w3.org/TR/css-fonts-3/#generic-font-families
 *
 * @param {string} str Font family name
 *
 * @return {string}
 */
function quoteFontName(str) {
  const genericFonts = [
    'serif',
    'sans-serif',
    'cursive',
    'fantasy',
    'monospace',
  ];
  return genericFonts.includes(str.toLowerCase()) ? str : `'${str}'`;
}

/*
 * Get the CSS value from a sass-extract data structure
 * https://github.com/jgranstrom/sass-extract#general-variable-value-structure
 *
 * @param {object} sassVar Abstract data structure for SASS variable
 *
 * @return {string|int} CSS value
 */
function getSassValue(sassVar, options) {
  const { type, value } = sassVar;
  switch (type) {
    case 'SassNumber':
      return sassVar.unit ? `${value}${sassVar.unit}` : value;

    case 'SassColor': {
      const {
        r, g, b, a, hex
      } = value;
      const hasAlpha = a !== 1;
      if (options.hex && !hasAlpha) {
        return hex;
      }
      return hasAlpha
        ? `rgba(${r.toFixed()}, ${g.toFixed()}, ${b.toFixed()}, ${a})`
        : `rgb(${r.toFixed()}, ${g.toFixed()}, ${b.toFixed()})`;
    }

    case 'SassList': {
      const isStringList = value.every(item => item.type === 'SassString');
      const newList = value.map(getSassValue);
      return isStringList
        ? newList.map(quoteFontName).join(', ')
        : newList.join(' ');
    }

    case 'SassMap':
      return transformVars(value, options);

    default:
      return value;
  }
}

/*
 * Transform style object key
 * - Strip leading '$'
 * - Convert to camelCase if `shouldCamelCase` is true
 *
 * @param {string} key Style object key
 * @param {boolean} shouldCamelCase Convert keys to camelCase
 *
 * @return {string} Converted key
 */
function transformKey(key, shouldCamelCase) {
  const newKey = key.replace('$', '');
  return shouldCamelCase ? camelCase(newKey, null, true) : newKey;
}

/*
 * Reduce SASS-compiled variables object into theme object
 *
 * @param {object} varsObj Output from `sass-extract` render
 * @param {object} [options] Options object
 * @param {boolean} [options.camelCase] Should keys be converted to camelCase (default: true)
 *
 * @return {object} Transformed variables object
 */
function transformVars(varsObj, options) {
  const opts = Object.assign({ camelCase: true }, options);
  return Object.keys(varsObj).reduce((acc, key) => {
    const newKey = transformKey(key, opts.camelCase);
    const newVal = getSassValue(varsObj[key], opts);
    acc[newKey] = newVal;
    return acc;
  }, {});
}

module.exports = transformVars;
