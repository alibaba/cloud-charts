import color from '!!sass-variable-loader!@alife/aisc-core/scss/themes/_color_dark.scss';
import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';

const prefix = 'widgets-';

Object.assign(color, {
  [prefix + 'tooltip-background']: 'rgba(255, 255, 255, 0.9)',
  [prefix + 'tooltip-shadow']: '0 1px 5px 0 rgba(0, 0, 0, 0.2)',
  colors_12: [
    color.colorB16,
    color.colorF12,
    color.colorF23,
    color.colorF32,
    // '#2889EC',
    // '#F6A71F',
    // '#EF5350',
    // '#4AD051',
    '#8B73CC',
    '#0F1BB3',

    '#429588',
    '#735546',
    '#D42762',
    '#673EBC',
    '#65DBFF',
    '#5ABCD6'
  ]
});

fonts['fontFamilyNumber'] = "DINMediumNumber, " + fonts.fontFamilyBase;

export { size, color, fonts };
