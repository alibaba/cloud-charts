import { Action, IGroup, Util } from '@antv/g2';
import { get, isNil, last, size } from '@antv/util';
import { DrillDownCfg } from '../types/drill-down';
import { deepAssign } from '../../common';
import { computeData, transformNodes } from '../../utils/transformTreeNodeData';

// 面包屑文字和分割符'/'之间的距离
const PADDING = 4;
// 面包屑位置距离树图的距离
const PADDING_LEFT = 0;
// 面包屑位置距离树图的顶部距离
export const PADDING_TOP = 5;

/** Group name of breadCrumb: 面包屑 */
export const BREAD_CRUMB_NAME = 'drilldown-bread-crumb';

// 面包屑默认配置
export const DEFAULT_BREAD_CRUMB_CONFIG: DrillDownCfg['breadCrumb'] = {
  /** 位置，默认：左上角 */
  position: 'top-left',
  dividerText: '/',
  textStyle: {
    fontSize: 12,
    fill: 'rgba(0, 0, 0, 0.65)',
    cursor: 'pointer',
  },
  activeTextStyle: {
    fill: '#87B5FF',
  },
};

/**
 * hierarchy 数据转换的参数
 */
export const HIERARCHY_DATA_TRANSFORM_PARAMS = 'hierarchy-data-transform-params';

/**
 * Hierarchy plot 节点的数据
 */
export type HierarchyNode<N = any /** 节点 */> = {
  /** 节点的原始数据，树型结构（todo 是否更正 key 为 origin） */
  data?: { name: string; value?: any; children: { name: string; value?: any }[] };
  /** 在构建节点数据时候，增加的扩展配置, 用于存储 transformData 的入参配置 */
  [HIERARCHY_DATA_TRANSFORM_PARAMS]: object;
  /** 当前的层级结构，每一次下钻都会更新. 不是 unique */
  depth: number;
  /** 当前所处高度，depth + height = 总的层级 */
  height: number;
  parent: N;
  children: N[];
  value?: number;
  name: string;
};

type Datum = Record<string, any>;

type HistoryCache = {
  name: string;
  id: string;
  children: Datum[];
}[];

/**
 * @description 下钻交互的 action
 *
 * 适用于：hierarchy
 */
export class DrillDownAction extends Action {
  /** Action name */
  public name = 'drill-down';

  // 存储历史下钻数据
  protected historyCache: HistoryCache = [];
  // 存储初始数据
  protected rootData: any = [];
  // 面包屑 group
  private breadCrumbGroup: IGroup = null;
  // 面包屑基础配置
  private breadCrumbCfg: DrillDownCfg['breadCrumb'] = DEFAULT_BREAD_CRUMB_CONFIG;

  /**
   * 点击事件, 下钻数据，并绘制面包屑
   */
  public click() {

    const data = get(this.context, ['event', 'data', 'data']);
    if (!data) return false;

    this.drill(data);
    this.drawBreadCrumb();
  }

  /**
   * 重置位置，初始化及触发 chart  afterchangesize 回调时使用
   */
  public resetPosition() {
    // 当在第一层级未绘制面包屑，此时 changedata 触发 resetPosition 函数，需判断 this.breadCrumbGroup 是否存在
    if (!this.breadCrumbGroup) return;
    const coordinate = this.context.view.getCoordinate();
    const breadCrumbGroup = this.breadCrumbGroup;
    const bbox = breadCrumbGroup.getBBox();

    const { position } = this.getButtonCfg();

    // @todo 后续抽取一个函数来处理，以及增加 margin 或者 padding 的设置
    // 非 polar 的，需要使用 coordinate，除却图表组件
    let point = { x: coordinate.start.x, y: coordinate.end.y - (bbox.height + PADDING_TOP * 2) };
    if (coordinate.isPolar) {
      // 默认，左上角直接出发
      point = { x: 0, y: 0 };
    }
    if (position === 'bottom-left') {
      // 涉及到坐标反转的问题
      point = { x: coordinate.start.x, y: coordinate.start.y };
    }
    /** PADDING_LEFT, PADDING_TOP 与画布边缘的距离 */
    const matrix = Util.transform(null, [['t', point.x + PADDING_LEFT, point.y + bbox.height + PADDING_TOP]]);
    breadCrumbGroup.setMatrix(matrix);
  }

  /**
   * 返回上一层
   */
  public back(): void {
    if (size(this.historyCache)) {
      this.backTo(this.historyCache.slice(0, -1));
    }
  }

  /**
   * 重置
   */
  public reset(): void {
    if (this.historyCache[0]) {
      this.backTo(this.historyCache.slice(0, 1));
    }
    // 清空
    this.historyCache = [];
    this.hideCrumbGroup();
  }

  /**
   * 下钻数据并更新 view 显示层
   * @param nodeInfo 下钻数据
   */
  protected drill(nodeInfo: HierarchyNode) {
    const { view } = this.context;

    // 重新 update 数据
    // 1. 用nodeInfo数据转为dataset
    // 2. dv转换为nodes列表
    // 3. 列表传入图表的view里面，更新数据
    nodeInfo.value = undefined;
    // console.log('update nodeInfo', nodeInfo);
    const { source: drillData } = computeData(nodeInfo);

    // console.log('update drillData', drillData)
    view.changeData(drillData);

    // 存储历史记录
    const historyCache: HistoryCache = [];

    let node = nodeInfo;
    while (node) {
      const nodeData = node.data || node;
      nodeData.value = undefined;

      const { source: childrenData } = computeData(nodeData);
      // console.log('遍历', nodeData, childrenData)

      historyCache.unshift({
        id: `${nodeData.name}_${node.height}_${node.depth}`,
        name: nodeData.name,
        children: childrenData,
      });
      node = node?.parent;
    }
  
    if (this.rootData?.length === 0) {
      this.rootData = [historyCache[0]];
    }

    this.historyCache = (this.historyCache || []).slice(0, -1).concat(historyCache);
  }

  /**
   * 回退事件，点击面包屑时触发
   * @param historyCache 当前要回退到的历史
   */
  protected backTo(historyCache: HistoryCache) {
    if (!historyCache || historyCache.length <= 0) {
      return;
    }

    const { view } = this.context;
    // const data = last(historyCache).children; // 处理后的数组
    // 目前只考虑两层的计算
    // console.log('backTo', historyCache, this.rootData)
    view.changeData(this.rootData[0].children);

    if (historyCache.length > 1) {
      this.historyCache = historyCache;
      this.drawBreadCrumb();
    } else {
      // 清空
      this.historyCache = [];
      this.hideCrumbGroup();
    }
  }

  /**
   * 获取 mix 默认的配置和用户配置
   */
  private getButtonCfg() {
    const { view } = this.context;
    const drillDownConfig: DrillDownCfg = get(view, ['interactions', 'drill-down', 'cfg', 'drillDownConfig']);

    return deepAssign(this.breadCrumbCfg, drillDownConfig?.breadCrumb, this.cfg);
  }

  /**
   * 显示面包屑
   */
  private drawBreadCrumb() {
    this.drawBreadCrumbGroup();
    this.resetPosition();
    this.breadCrumbGroup.show();
  }

  /**
   * 绘制 Button 和 文本
   */
  private drawBreadCrumbGroup() {
    const config = this.getButtonCfg();
    const cache = this.historyCache;

    // 初始化面包屑 group
    if (!this.breadCrumbGroup) {
      this.breadCrumbGroup = this.context.view.foregroundGroup.addGroup({
        name: BREAD_CRUMB_NAME,
      });
    } else {
      this.breadCrumbGroup.clear();
    }

    // 绘制面包屑
    let left = 0;
    cache.forEach((record, index) => {
      // 添加文本
      const textShape = this.breadCrumbGroup.addShape({
        type: 'text',
        id: record.id,
        name: `${BREAD_CRUMB_NAME}_${record.name}_text`,
        attrs: {
          text: index === 0 && !isNil(config.rootText) ? config.rootText : record.name,
          ...config.textStyle,
          x: left,
          y: 0,
        },
      });

      const textShapeBox = textShape.getBBox();
      left += textShapeBox.width + PADDING;

      // 增加文本事件
      textShape.on('click', (event) => {
        const targetId = event.target.get('id');
        if (targetId !== last(cache)?.id) {
          const newHistoryCache = cache.slice(0, cache.findIndex((d) => d.id === targetId) + 1);
          this.backTo(newHistoryCache);
          // this.reset();
        }
      });
      // active 效果内置
      textShape.on('mouseenter', (event) => {
        const targetId = event.target.get('id');
        if (targetId !== last(cache)?.id) {
          textShape.attr(config.activeTextStyle);
        } else {
          textShape.attr({ cursor: 'default' });
        }
      });
      textShape.on('mouseleave', () => {
        textShape.attr(config.textStyle);
      });

      if (index < cache.length - 1) {
        // 添加反斜杠
        const dividerShape = this.breadCrumbGroup.addShape({
          type: 'text',
          name: `${config.name}_${record.name}_divider`,
          attrs: {
            text: config.dividerText,
            ...config.textStyle,
            x: left,
            y: 0,
          },
        });

        const dividerBox = dividerShape.getBBox();
        left += dividerBox.width + PADDING;
      }
    });
  }

  /**
   * 隐藏面包屑
   */
  private hideCrumbGroup() {
    if (this.breadCrumbGroup) {
      this.breadCrumbGroup.hide();
    }
  }

  /**
   * @override
   * destroy: 销毁资源
   */
  public destroy() {
    if (this.breadCrumbGroup) {
      this.breadCrumbGroup.remove();
    }
    super.destroy();
  }
}
