import colors from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';
import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';

const prefix = 'widgets-';

Object.assign(colors, {
  [prefix + 'tooltip-background']: 'rgba(255, 255, 255, 0.9)',
  [prefix + 'tooltip-shadow']: '0 1px 5px 0 rgba(0, 0, 0, 0.2)',
  // [prefix + 'tooltip-background']: 'rgba(255, 255, 255, 0.9)',
  // [prefix + 'tooltip-background']: 'rgba(255, 255, 255, 0.9)',
});

fonts['fontFamilyNumber'] = "DINMediumNumber, " + fonts.fontFamilyBase;

export { size, colors, fonts };
