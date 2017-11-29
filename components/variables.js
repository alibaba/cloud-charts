export colors from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';

import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
fonts['fontFamilyNumber'] = "DINMediumNumber, " + fonts.fontFamilyBase;

export { fonts };