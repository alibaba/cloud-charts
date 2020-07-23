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

    export class Wnumber extends React.Component<any, any> {}
    export class Wcontainer extends React.Component<any, any> {}
    export class Wicon extends React.Component<any, any> {}
    export class Wcircle extends React.Component<any, any> {}
    export class Wminicontainer extends React.Component<any, any> {}
    export class Wshoot extends React.Component<any, any> {}
    export class Wplaceholder extends React.Component<any, any> {}
    export class Wperline extends React.Component<any, any> {}
    export class Wcount extends React.Component<any, any> {}
    export class Wdashboard extends React.Component<any, any> {}

    export class Wline extends React.Component<any, any> {}
    export class Wminiline extends React.Component<any, any> {}
    export class Wbar extends React.Component<any, any> {}
    export class Whistogram extends React.Component<any, any> {}
    export class Wlinebar extends React.Component<any, any> {}
    export class Wpie extends React.Component<any, any> {}
    export class Wscatter extends React.Component<any, any> {}
    export class Wmap extends React.Component<any, any> {}
    export class Wcustom extends React.Component<any, any> {}
    export class Wsankey extends React.Component<any, any> {}
    export class Wnightingale extends React.Component<any, any> {}
    export class Wradar extends React.Component<any, any> {}
    export class Wrectangle extends React.Component<any, any> {}
    export class Wfunnel extends React.Component<any, any> {}
    export class WmultiPie extends React.Component<any, any> {}
    export class Wbox extends React.Component<any, any> {}
    export class Wcandlestick extends React.Component<any, any> {}
    export class Wheatmap extends React.Component<any, any> {}
    export class Wtreemap extends React.Component<any, any> {}
    export class Whierarchy extends React.Component<any, any> {}
}

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

export class Wnumber extends React.Component<any, any> {}
export class Wcontainer extends React.Component<any, any> {}
export class Wicon extends React.Component<any, any> {}
export class Wcircle extends React.Component<any, any> {}
export class Wminicontainer extends React.Component<any, any> {}
export class Wshoot extends React.Component<any, any> {}
export class Wplaceholder extends React.Component<any, any> {}
export class Wperline extends React.Component<any, any> {}
export class Wcount extends React.Component<any, any> {}
export class Wdashboard extends React.Component<any, any> {}

export class Wline extends React.Component<any, any> {}
export class Wminiline extends React.Component<any, any> {}
export class Wbar extends React.Component<any, any> {}
export class Whistogram extends React.Component<any, any> {}
export class Wlinebar extends React.Component<any, any> {}
export class Wpie extends React.Component<any, any> {}
export class Wscatter extends React.Component<any, any> {}
export class Wmap extends React.Component<any, any> {}
export class Wcustom extends React.Component<any, any> {}
export class Wsankey extends React.Component<any, any> {}
export class Wnightingale extends React.Component<any, any> {}
export class Wradar extends React.Component<any, any> {}
export class Wrectangle extends React.Component<any, any> {}
export class Wfunnel extends React.Component<any, any> {}
export class WmultiPie extends React.Component<any, any> {}
export class Wbox extends React.Component<any, any> {}
export class Wcandlestick extends React.Component<any, any> {}
export class Wheatmap extends React.Component<any, any> {}
export class Wtreemap extends React.Component<any, any> {}
export class Whierarchy extends React.Component<any, any> {}
