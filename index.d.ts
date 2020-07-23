import * as React from "react";

export as namespace AiscWidgets;

declare namespace AiscWidgets {
    export const version: string;
    export const VERSION: string;

    // 主题包和颜色值
    export namespace themes {
        function setTheme(theme: string): void;
    }

    // 打点控制
    export function track(enable: boolean): void;

    // 插件系统
    export const plugins: object;
    export const pluginManager: object;

    // 暴露工具类
    export namespace Util {
        const propertyMap: object;
        function propertyAssign(...args: any[]): any;
        function getParentSize(...args: any[]): any;
        function getStatusColor(...args: any[]): any;
        function isInvalidNumber(...args: any[]): any;
        function numberDecimal(...args: any[]): any;
        function beautifyNumber(...args: any[]): any;
        function getRawData(...args: any[]): any;
        function filterKey(...args: any[]): any;
        function isEqual(...args: any[]): any;
        function isEqualWith(...args: any[]): any;
        function merge(...args: any[]): any;
    }

    export const Wnumber: React.Component<any>;
    export const Wcontainer: React.Component<any>;
    export const Wicon: React.Component<any>;
    export const Wcircle: React.Component<any>;
    export const Wminicontainer: React.Component<any>;
    export const Wshoot: React.Component<any>;
    export const Wplaceholder: React.Component<any>;
    export const Wperline: React.Component<any>;
    export const Wcount: React.Component<any>;
    export const Wdashboard: React.Component<any>;

    export const Wline: React.Component<any>;
    export const Wminiline: React.Component<any>;
    export const Wbar: React.Component<any>;
    export const Whistogram: React.Component<any>;
    export const Wlinebar: React.Component<any>;
    export const Wpie: React.Component<any>;
    export const Wscatter: React.Component<any>;
    export const Wmap: React.Component<any>;
    export const Wcustom: React.Component<any>;
    export const Wsankey: React.Component<any>;
    export const Wnightingale: React.Component<any>;
    export const Wradar: React.Component<any>;
    export const Wrectangle: React.Component<any>;
    export const Wfunnel: React.Component<any>;
    export const WmultiPie: React.Component<any>;
    export const Wbox: React.Component<any>;
    export const Wcandlestick: React.Component<any>;
    export const Wheatmap: React.Component<any>;
    export const Wtreemap: React.Component<any>;
    export const Whierarchy: React.Component<any>;
}
