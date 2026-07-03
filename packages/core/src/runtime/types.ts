import type { ChartPrimitiveValue, ChartSpec } from '../types/spec';

export type ChartLanguage = string;

export interface LocaleTextMap {
  loading?: string;
  error?: string;
  noData?: string;
  empty?: string;
  reset?: string;
  aiLoading?: string;
  [key: string]: string | string[][] | undefined;
}

export type LocaleConfig = LocaleTextMap | Record<ChartLanguage, LocaleTextMap>;

export type ThemeTokenValue = string | number | string[];

export type ThemeToken = Record<string, ThemeTokenValue>;

export interface ResolvedTheme {
  name: string;
  token: ThemeToken;
  g2Theme: Record<string, unknown>;
}

export interface RuleSwitchConfig {
  empty?: boolean;
  bigData?: boolean;
  extremeData?: boolean;
  processConfig?: boolean;
  processData?: boolean;
}

export type RuleConfig = boolean | RuleSwitchConfig;

export interface ChartStateConfig {
  loading?: boolean;
  loadingInfo?: unknown;
  errorInfo?: unknown;
  emptyInfo?: unknown;
}

export type ChartRenderState = 'normal' | 'loading' | 'empty' | 'error';

export interface ChartRuntimeContext {
  language?: ChartLanguage;
  locale?: LocaleConfig;
  theme?: string | ThemeToken;
  defaultConfig?: Record<string, unknown>;
  rule?: RuleConfig;
  size?: [number, number];
  state?: ChartStateConfig;
}

export interface LegendModel {
  visible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  mode: 'g2' | 'table' | 'foldable' | 'gradient';
  field?: string;
  spec?: Record<string, unknown> | false;
  showData?: boolean;
  clickable?: boolean;
  hoverable?: boolean;
  allowAllCanceled?: boolean;
  useReverseChecked?: boolean;
  onHover?: (...args: unknown[]) => unknown;
  onClick?: (...args: unknown[]) => unknown;
  itemNameFormatter?: (...args: unknown[]) => unknown;
  itemValueFormatter?: (...args: unknown[]) => unknown;
  /** mode='table' 时的统计列配置 */
  tableConfig?: Record<string, unknown>;
  /** mode='foldable' 时的展开/折叠配置 */
  foldableConfig?: Record<string, unknown>;
  /** mode='gradient' 时的色阶配置 */
  gradientConfig?: Record<string, unknown>;
  /** legend items 数据（name/color/value/...），由 model 填充供 React 渲染层使用 */
  items?: Array<{ name: string; color?: string; value?: unknown; [key: string]: unknown }>;
}

export interface TooltipModel {
  visible: boolean;
  spec?: Record<string, unknown> | false;
  markSpec?: Record<string, unknown> | false;
  lockable?: boolean;
  showColon?: boolean;
  columns?: number | false;
  customContent?: unknown;
  reactContent?: unknown;
  customTooltip?: unknown;
  /** G2 v5 spec.interaction.tooltip 配置（shared/crosshairs），由 model 调用方合并到 interaction */
  interactionTooltip?: Record<string, unknown>;
}

export interface InteractionModel {
  name: string;
  spec?: Record<string, unknown> | boolean;
}

export interface ChartModelMetadata {
  chartName: string;
  dataSize?: number;
  isEmpty?: boolean;
  isBigData?: boolean;
  isExtreme?: boolean;
  needRerender?: boolean;
}

export interface ChartModel {
  spec: ChartSpec;
  data: Array<Record<string, ChartPrimitiveValue>>;
  config: Record<string, unknown>;
  context: ChartRuntimeContext;
  state: ChartRenderState;
  theme?: ResolvedTheme;
  legend?: LegendModel;
  tooltip?: TooltipModel;
  interactions?: InteractionModel[];
  metadata: ChartModelMetadata;
}

export interface RuleResult {
  data?: Array<Record<string, ChartPrimitiveValue>>;
  config?: Record<string, unknown>;
  state: ChartRenderState;
  metadata: Partial<ChartModelMetadata>;
}
