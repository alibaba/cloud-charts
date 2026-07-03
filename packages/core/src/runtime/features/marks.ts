export interface LineLabelConfig {
  /** false 关闭；true 启用默认；object 详细配置 */
  visible?: boolean;
  /** G2 v5 label 位置：top / bottom / middle / inside / outside ... */
  position?: string;
  offset?: number;
  /** 自定义格式化（输出 string），等价旧 label.labelFormatter（v, datum, idx, all）→ string */
  labelFormatter?: (value: unknown, datum: Record<string, unknown>, index: number, data: Array<Record<string, unknown>>) => unknown;
  /** 完整接管 label 输出，等价旧 label.callback；返回 string 或 LabelObject */
  callback?: (...args: unknown[]) => unknown;
  /** 取哪个字段作为 label 文本；缺省取 yField */
  field?: string;
  /** 文本样式 */
  style?: Record<string, unknown>;
  /** 透传到 G2 v5 labels[] 的其它原生字段 */
  [key: string]: unknown;
}

export interface LineMarkConfig {
  area?: boolean;
  stack?: boolean;
  spline?: boolean;
  step?: string | boolean;
  symbol?: boolean | Record<string, unknown>;
  colors?: unknown;
  areaColors?: unknown;
  areaFillOpacity?: number;
  lineWidth?: number;
  symbolFillColor?: string;
  symbolLineWidth?: number;
  /** 数据标签：false 关闭；true 默认；object 详细配置 */
  label?: boolean | LineLabelConfig;
  animate?: boolean | Record<string, unknown>;
  [key: string]: unknown;
}

export interface MarkSpec {
  type: string;
  data?: Array<Record<string, unknown>>;
  encode?: Record<string, unknown>;
  transform?: Array<Record<string, unknown>>;
  scale?: Record<string, unknown>;
  axis?: Record<string, unknown> | false;
  style?: Record<string, unknown>;
  tooltip?: boolean | Record<string, unknown>;
  [key: string]: unknown;
}

const STEP_SHAPES = ['hv', 'vh', 'hvh', 'vhv'];

function resolveLineShape(config: LineMarkConfig): string {
  if (config.spline) {
    return 'smooth';
  }
  if (config.step && !config.area) {
    const step = String(config.step);
    return STEP_SHAPES.includes(step) ? step : 'hv';
  }
  return 'line';
}

/**
 * 把 LineLabelConfig 规范化为 G2 v5 labels[] 项。
 * 旧 src/common/label.ts 语义：取字段（field 或 yField），position/offset/labelFormatter/callback/style 直接映射。
 */
function buildLabelsArray(label: boolean | LineLabelConfig | undefined, yField: string): Array<Record<string, unknown>> | undefined {
  if (label === false || label === undefined || label === null) return undefined;
  const cfg: LineLabelConfig = typeof label === 'object' ? label : {};
  if (cfg.visible === false) return undefined;
  const text = cfg.field ?? yField;
  const item: Record<string, unknown> = { text };
  if (cfg.position) item.position = cfg.position;
  if (typeof cfg.offset === 'number') item.offset = cfg.offset;
  if (cfg.labelFormatter) item.formatter = cfg.labelFormatter;
  if (cfg.callback) item.formatter = cfg.callback;
  if (cfg.style) item.style = cfg.style;
  // 透传其它 G2 v5 原生字段（fontSize/fill/textBaseline 等）
  Object.entries(cfg).forEach(([k, v]) => {
    if (['visible', 'position', 'offset', 'labelFormatter', 'callback', 'field', 'style'].includes(k)) return;
    if (item[k] === undefined) item[k] = v;
  });
  return [item];
}

/**
 * 将折线图业务配置规范化为 G2 5 spec 的 marks 数组。
 * 复现旧 drawLine 的语义：area+stack→stackY、spline→smooth、step→hv/vh、symbol→point mark、lineWidth、label。
 */
export function buildLineMarks(config: LineMarkConfig, yField = 'y'): MarkSpec[] {
  const marks: MarkSpec[] = [];
  const stackTransform = config.area && config.stack ? [{ type: 'stackY', reverse: true }] : undefined;
  const lineShape = resolveLineShape(config);
  const areaShape = config.spline ? 'smooth' : 'area';
  const animate = config.animate === false ? false : undefined;
  const labels = buildLabelsArray(config.label, yField);

  if (config.area) {
    marks.push({
      type: 'area',
      encode: { x: 'x', y: yField, color: 'type' },
      transform: stackTransform,
      animate,
      style: {
        shape: areaShape,
        fillOpacity: config.areaFillOpacity,
      },
      tooltip: false,
    });
  }

  const lineMark: MarkSpec = {
    type: 'line',
    encode: { x: 'x', y: yField, color: 'type' },
    transform: stackTransform,
    animate,
    style: {
      shape: lineShape,
      lineWidth: config.lineWidth,
      lineJoin: 'round',
    },
  };
  if (labels) {
    lineMark.labels = labels;
  }
  marks.push(lineMark);

  if (config.symbol) {
    const symbolConfig = typeof config.symbol === 'object' ? config.symbol : {};
    marks.push({
      type: 'point',
      encode: { x: 'x', y: yField, color: 'type' },
      transform: stackTransform,
      animate,
      style: {
        shape: (symbolConfig.shape as string) || 'hollowCircle',
        fill: config.symbolFillColor,
        lineWidth: config.symbolLineWidth,
        ...symbolConfig,
      },
    });
  }

  return marks;
}
