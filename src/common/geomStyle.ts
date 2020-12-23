'use strict';

import { Geometry, Types } from "./types";

export type GeomStyleConfig = Types.LooseObject | Types.StyleOption | Types.StyleCallback;

/**
 * 设置图形元素 style
 *
 * @param {Geometry} geom 图形元素
 * @param {GeomStyleConfig} styleConfig 样式配置项
 * @param {Object} defaultStyle 默认样式
 * @param {string} defaultFields 函数调用key
 * */
export default function geomStyle(
  geom: Geometry,
  styleConfig: GeomStyleConfig,
  defaultStyle: Types.LooseObject = {},
  defaultFields: string = 'x*y*type*extra',
) {
  if (!styleConfig) {
    return;
  }
  if (typeof styleConfig === 'function') {
    geom.style({
      fields: defaultFields,
      callback(...args) {
        const s = styleConfig(...args) || {};
        return {
          ...defaultStyle,
          ...s,
        };
      },
    });
  } else if (styleConfig.callback || styleConfig.cfg) {
    const { fields, callback, cfg } = styleConfig as Types.StyleOption;
    if (cfg) {
      geom.style({
        cfg: {
          ...defaultStyle,
          ...cfg,
        },
      });
    } else {
      geom.style({
        fields: fields || defaultFields,
        callback(...args) {
          const s = callback(...args) || {};
          return {
            ...defaultStyle,
            ...s,
          };
        },
      });
    }
  } else if (typeof styleConfig === 'object') {
    const s = {
      ...defaultStyle,
    };
    // 找到style设置中的所有函数
    const funcList: { key: string, value: Types.StyleCallback }[] = [];
    Object.keys(styleConfig).forEach((key) => {
      const value = (styleConfig as Types.LooseObject)[key];
      if (typeof value === 'function') {
        // 如果是函数，则存入 funcList 中
        funcList.push({ key, value });
      } else {
        // 剩余是普通样式，直接设置到 s 中
        s[key] = value;
      }
    });
    if (funcList.length > 0) {
      // style 设置存在函数
      geom.style({
        fields: defaultFields,
        callback(...args) {
          funcList.forEach(({ key, value }) => {
            s[key] = value(...args);
          });
          return s;
        },
      });
    } else {
      // 不存在函数，直接存入
      geom.style(s);
    }
  }
}
