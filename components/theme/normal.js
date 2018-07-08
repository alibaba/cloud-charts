import color from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';
import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';

import widgetsVar from '!!sass-variable-loader!./normal.scss';

const prefix = 'widgets-';

Object.assign(color, widgetsVar, {
  // [`${prefix}tooltip-background`]: 'rgba(255, 255, 255, 0.9)',
  // [`${prefix}tooltip-shadow`]: '0 1px 5px 0 rgba(0, 0, 0, 0.2)',
  // [`${prefix}tooltip-cross-line`]: '#dddddd',
  // [`${prefix}tooltip-cross-react`]: '#CCD6EC',
  // [`${prefix}tooltip-cross-react-opacity`]: 0.3,

  // 分类色阶
  category_12: [
    widgetsVar.widgetsColorCategory1,
    widgetsVar.widgetsColorCategory2,
    widgetsVar.widgetsColorCategory3,
    widgetsVar.widgetsColorCategory4,
    widgetsVar.widgetsColorCategory5,
    widgetsVar.widgetsColorCategory6,
    widgetsVar.widgetsColorCategory7,
    widgetsVar.widgetsColorCategory8,
    widgetsVar.widgetsColorCategory9,
    widgetsVar.widgetsColorCategory10,
    widgetsVar.widgetsColorCategory11,
    widgetsVar.widgetsColorCategory12,
  ],
  // 连续色阶，比较接近的颜色会错开
  linear_10: [
    widgetsVar.widgetsColorLinear1,
    widgetsVar.widgetsColorLinear5,
    widgetsVar.widgetsColorLinear9,
    widgetsVar.widgetsColorLinear3,
    widgetsVar.widgetsColorLinear7,
    widgetsVar.widgetsColorLinear10,
    widgetsVar.widgetsColorLinear2,
    widgetsVar.widgetsColorLinear4,
    widgetsVar.widgetsColorLinear6,
    widgetsVar.widgetsColorLinear8,
  ],
  // 顺序色阶，连续相似的颜色排列
  order_10: [
    widgetsVar.widgetsColorLinear1,
    widgetsVar.widgetsColorLinear2,
    widgetsVar.widgetsColorLinear3,
    widgetsVar.widgetsColorLinear4,
    widgetsVar.widgetsColorLinear5,
    widgetsVar.widgetsColorLinear6,
    widgetsVar.widgetsColorLinear7,
    widgetsVar.widgetsColorLinear8,
    widgetsVar.widgetsColorLinear9,
    widgetsVar.widgetsColorLinear10,
  ],
});

fonts.fontFamilyNumber = widgetsVar.fontFamilyNumber;

export { size, color, fonts };
