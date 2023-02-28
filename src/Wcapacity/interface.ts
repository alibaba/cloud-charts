export interface IProps {
  data?: any;
  config?: ConfigItem;
  height?: number;
  style?: any;
}

interface GuideConfig {
  threshold: string;
  status: string;
}

export interface ConfigItem {
  barConfig?: any;
  barSize: number;
  startColor?: string;
  endColor?: string;
  percentConfig?: any;
  guide?: GuideConfig;
  processBarConfig?: any;
  processBarBackConfig?: any;
  labelConfig?: any;
  titleConfig?: any;
}