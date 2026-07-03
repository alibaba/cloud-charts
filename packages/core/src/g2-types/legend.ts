/**
 * G2 v5 Legend Category Spec — 基于上游真实类型构建，部分字段放宽以适配业务写法。
 *
 * 锁定 @antv/g2 ~5.4.8 + @antv/component ^2.1.9。
 * G2 升级 minor 时若上游字段变化会在 typecheck 时立即暴露。
 *
 * 字段链路（IDE 可 Cmd+Click 跳转到上游 .d.ts）：
 *   spec.itemMarkerLineWidth
 *     ← CategoryStyleProps（@antv/component/lib/ui/legend/types.d.ts）
 *     ← CategoryItemsStyleProps via PrefixStyleProps<CallableItemStyle, 'item'>
 *     ← CategoryItemStyleProps.markerLineWidth via PrefixObject<ItemMarkerStyle, 'marker'>
 *     ← ItemMarkerStyle.lineWidth = PathStyleProps.lineWidth (@antv/g)
 */

export type { LegendCategoryOptions } from '@antv/g2/lib/component/legendCategory';
export type {
  CategoryStyleProps,
  CategoryOptions,
  LegendBaseStyleProps,
} from '@antv/component/lib/ui/legend/types';
export type { CategoryItemStyleProps } from '@antv/component/lib/ui/legend/category/item';
export type { CategoryItemsStyleProps } from '@antv/component/lib/ui/legend/category/items';

import type { LegendCategoryOptions } from '@antv/g2/lib/component/legendCategory';
import type { CategoryStyleProps } from '@antv/component/lib/ui/legend/types';

/** 严格部分：直接从 G2 / @antv/component 真实类型获得字段提示。 */
type StrictPart = Partial<Omit<CategoryStyleProps, 'layout' | 'itemLabelText' | 'itemValueText' | 'click'>> &
  Omit<LegendCategoryOptions, 'layout' | 'click'>;

/** 放宽部分：业务写法常用 FlexLayout 对象 / 任意回调返回 / boolean 关闭点击，与 G2 严格定义不兼容。 */
interface RelaxedPart {
  /** G2 真实类型是 'grid' | 'flex' | FlexLayout；业务通常传 {flexDirection,justifyContent,alignItems} 对象。 */
  layout?: unknown;
  /** itemLabelText/itemValueText：G2 要求返回 ExtendDisplayObject；业务回调返回 string/number/unknown 也常见。 */
  itemLabelText?: string | ((...args: unknown[]) => unknown);
  itemValueText?: string | ((...args: unknown[]) => unknown);
  /** click：G2 真实类型仅接受函数；业务用 false 关闭点击交互。 */
  click?: boolean | ((el: unknown) => void);
}

/**
 * 我们 normalizeLegend 输出的 spec 形态：
 * = G2 LegendCategoryOptions（position/dx/dy/orientation 等）
 * + @antv/component CategoryStyleProps 全部样式字段（itemMarker* / itemLabel*Fill / itemValue*FontSize / 等）
 * + 4 个业务放宽字段（layout/itemLabelText/itemValueText/click）
 *
 * G2 v5 LegendCategoryOptions 自身是 [key: string]: any 形态，字段级提示由 CategoryStyleProps 提供。
 */
export type LegendCategorySpec = StrictPart & RelaxedPart;
