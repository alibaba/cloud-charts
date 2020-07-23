import * as React from "react";

export as namespace AiscWidgets;

declare namespace AiscWidgets {
    export const version: string;
    export const VERSION: string;

    // 主题包和颜色值
    export namespace themes {
        function setTheme(): void;
    }

    // 打点控制
    export function track(): void;

    // 插件系统
    export const plugins: object;
    export const pluginManager: object;

    // 暴露工具类
    export namespace Util {
        const propertyMap: object;
        function propertyAssign();
        function getParentSize();
        function getStatusColor();
        function isInvalidNumber();
        function numberDecimal();
        function beautifyNumber();
        function getRawData();
        function filterKey();
        function isEqual();
        function isEqualWith();
        function merge();
    }

    export const Wnumber: React.Component;
    export const Wcontainer: React.Component;
    export const Wicon: React.Component;
    export const Wcircle: React.Component;
    export const Wminicontainer: React.Component;
    export const Wshoot: React.Component;
    export const Wplaceholder: React.Component;
    export const Wperline: React.Component;
    export const Wcount: React.Component;
    export const Wdashboard: React.Component;

    export const Wline: React.Component;
    export const Wminiline: React.Component;
    export const Wbar: React.Component;
    export const Whistogram: React.Component;
    export const Wlinebar: React.Component;
    export const Wpie: React.Component;
    export const Wscatter: React.Component;
    export const Wmap: React.Component;
    export const Wcustom: React.Component;
    export const Wsankey: React.Component;
    export const Wnightingale: React.Component;
    export const Wradar: React.Component;
    export const Wrectangle: React.Component;
    export const Wfunnel: React.Component;
    export const WmultiPie: React.Component;
    export const Wbox: React.Component;
    export const Wcandlestick: React.Component;
    export const Wheatmap: React.Component;
    export const Wtreemap: React.Component;
    export const Whierarchy: React.Component;
}
