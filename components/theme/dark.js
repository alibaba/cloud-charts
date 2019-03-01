import color from '!!sass-variable-loader!@alife/aisc-core/scss/themes/_color_dark.scss';
import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';

import widgetsVar from '!!sass-variable-loader!./dark.scss';

Object.assign(color, widgetsVar, {
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

  // 青色色阶 - turquoise
  // 连续色阶，比较接近的颜色会错开
  linear_turquoise_10: [
    widgetsVar.widgetsColorLinearTurquoise1,
    widgetsVar.widgetsColorLinearTurquoise5,
    widgetsVar.widgetsColorLinearTurquoise9,
    widgetsVar.widgetsColorLinearTurquoise3,
    widgetsVar.widgetsColorLinearTurquoise7,
    widgetsVar.widgetsColorLinearTurquoise10,
    widgetsVar.widgetsColorLinearTurquoise2,
    widgetsVar.widgetsColorLinearTurquoise4,
    widgetsVar.widgetsColorLinearTurquoise6,
    widgetsVar.widgetsColorLinearTurquoise8,
  ],
  // 顺序色阶，连续相似的颜色排列
  order_turquoise_10: [
    widgetsVar.widgetsColorLinearTurquoise1,
    widgetsVar.widgetsColorLinearTurquoise2,
    widgetsVar.widgetsColorLinearTurquoise3,
    widgetsVar.widgetsColorLinearTurquoise4,
    widgetsVar.widgetsColorLinearTurquoise5,
    widgetsVar.widgetsColorLinearTurquoise6,
    widgetsVar.widgetsColorLinearTurquoise7,
    widgetsVar.widgetsColorLinearTurquoise8,
    widgetsVar.widgetsColorLinearTurquoise9,
    widgetsVar.widgetsColorLinearTurquoise10,
  ],
});

fonts.fontFamilyNumber = widgetsVar.fontFamilyNumber;
fonts.fontFamilyTxdMediumNumber = widgetsVar.fontFamilyTxdMediumNumber;
fonts.fontFamilyTxdRegularNumber = widgetsVar.fontFamilyTxdRegularNumber;

export { size, color, fonts };
