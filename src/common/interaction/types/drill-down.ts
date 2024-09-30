import { G2Dependents } from "../../types";

export type DrillDownCfg = {
  /**
   * @title 是否启用
   * @description 是否启用 drillDown interaction
   */
  enabled?: boolean;
  /**
   * @title 面包屑
   * @description 设置面包屑相关配置
   */
  breadCrumb?: {
    /**
     * @title 位置
     * @description 设置面包屑显示位置
     */
    position: 'top-left' | 'bottom-left';
    /**
     * @title 根文本
     * @description 设置面包屑根文本
     */
    rootText?: string;
    /**
     * @title 分割线文本
     * @description 设置面包屑分割线文本
     */
    dividerText?: string;
    /**
     * @title 字体样式
     * @description 设置面包屑字体样式
     */
    textStyle?: G2Dependents.ShapeAttrs;
    /**
     * @title 激活的字体样式
     * @description 设置面包屑字激活的字体样式
     */
    activeTextStyle?: G2Dependents.ShapeAttrs;
  };
};
