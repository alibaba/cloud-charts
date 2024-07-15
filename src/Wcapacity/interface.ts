export interface IProps {
  data?: any;
  config?: ConfigItem;
  height?: number;
  style?: any;
  prefix?: string;
}

interface GuideConfig {
  threshold: string;
  status: string;
}

export interface ConfigItem {
  barConfig?: any;
  size?: string;
  barSize: number | string;
  startColor?: string;
  endColor?: string;
  percentConfig?: any;
  guide?: GuideConfig;
  processBarConfig?: any;
  processBarBackConfig?: any;
  labelConfig?: any;
  titleConfig?: any;
  closeUniAnimation?: boolean;
}