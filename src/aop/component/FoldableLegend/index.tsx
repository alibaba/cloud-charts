import React, { useState, useEffect, useRef } from 'react';
import { PrefixName } from '../../../constants';
import { ListItem } from '@antv/g2/esm/dependents';
import { Chart } from '@antv/g2';
import themes from '../../../themes';
import { filterLegend, highlightLegend, clearHighlight } from '../../../common/chartRefs';
import WidgetsTooltip from '../../../common/Tooltip';
import LegendMarker from '../../../common/LegendMarker';
import './index.scss';

const prefix = `${PrefixName}-foldable-legend`;

export interface FoldableLegendProps {
  /** 配置项 */
  config: any;

  /** chart实例 **/
  chart: Chart;

  /** legend items */
  legendItems: ListItem[];
}

export default function FolableLegend({ config, chart, legendItems = [] }: FoldableLegendProps) {
  // @ts-ignore
  const { widgetsCtx } = chart;

  // 是否需要折叠
  const [foldable, setFoldable] = useState<boolean>(false);

  // 当前是否折叠
  const [folded, setFolded] = useState<boolean>(true);

  // 显示的元素个数
  const [num, setNum] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);

  // legendItems的缓存，用于比较是否变化
  const itemsCache = useRef<any[]>([]);

  const containerWidth = widgetsCtx?.size[0];
  const containerHeight = widgetsCtx?.size[1] || 200;

  const [activedItem, setActivedItem] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const legendField = widgetsCtx?.legendField || 'type';

  // legend items变化时，重新计算legend
  useEffect(() => {
    // 深比较legend items的数量与名称是否改变
    if (
      itemsCache.current?.length !== legendItems?.length ||
      itemsCache.current?.some((item: any, index: number) => item.name !== legendItems[index].name)
    ) {
      handleFold();
      setFilteredItems([]);
      itemsCache.current = legendItems;
    }
  }, [legendItems]);

  // 图表尺寸变化时，修改legend尺寸，重新变成折叠状
  useEffect(() => {
    handleFold();
  }, [containerHeight, containerWidth, config]);

  useEffect(() => {
    setFilteredItems([]);
  }, [config]);

  // 点击高亮legend
  useEffect(() => {
    filterLegend(
      chart,
      (value: any) => {
        return !filteredItems.includes(value);
      },
      legendField,
    );
  }, [filteredItems]);

  // hover高亮legend
  const activeItem = (itemName: string) => {
    highlightLegend(chart, (value: any) => value === itemName, legendField);
  };

  // 清除高亮
  const clearActive = () => {
    clearHighlight(chart);
  };

  useEffect(() => {
    clearActive();
    if (activedItem) {
      activeItem(activedItem);
    }
  }, [activedItem]);

  const renderItem = (item: ListItem) => {
    const { name, marker } = item;
    const id = item.id || name;
    return (
      <>
        <div
          className={`${prefix}-marker`}
          onClick={(event: MouseEvent) => {
            if (filteredItems.includes(id)) {
              setFilteredItems((pre) => pre.filter((filteredItem) => filteredItem !== id));
            } else if (filteredItems.length !== legendItems.length - 1) {
              setFilteredItems((pre) => [...pre, id]);
              clearActive();
            } else {
              setFilteredItems([]);
            }
            event.stopPropagation();
          }}
        >
          <LegendMarker marker={marker} disable={filteredItems.includes(id)} />
        </div>
        <div>
          <LegendName
            name={name}
            style={{
              maxWidth: containerWidth - 16 - 16 - 4,
              // fontWeight: activedItem === id ? 500 : 'normal',
              // color:
              //   activedItem === id ? themes['widgets-legend-text-highlight'] : themes['widgets-legend-text-normal'],
            }}
          />
        </div>
      </>
    );
  };

  // 判断是否需要折叠及折叠的元素个数
  useEffect(() => {
    if (!contentRef?.current) {
      return;
    }
    setFoldable(contentRef?.current?.scrollHeight !== 20);

    const childrenNodes = contentRef.current.children;
    let index = 0;
    for (index = 0; index < childrenNodes.length; index++) {
      if ((childrenNodes[index] as HTMLDivElement).offsetTop >= 20) {
        break;
      }
    }
    setNum(index);
  }, [containerWidth, legendItems]);

  // 展开所有items
  const handleUnfold = () => {
    // 图表高度缩小
    const chartDom = widgetsCtx?.chartDom;
    const height = containerHeight - Math.min(contentRef?.current?.scrollHeight, containerHeight * 0.3);
    // @ts-ignore
    chartDom.style.height = `${height}px`;
    chart.changeSize(containerWidth, height);

    setFolded(false);
  };

  // 折叠当前items
  const handleFold = () => {
    // 图表高度恢复
    const chartDom = widgetsCtx?.chartDom;
    if (chartDom) {
      const height = containerHeight - 20;
      // @ts-ignore
      chartDom.style.height = `${height}px`;
      try {
        chart.changeSize(containerWidth, height);
      } catch (e) {}

      // 滚动到最上方
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }

      setFolded(true);
    }
  };

  return (
    <div className={`${prefix}-container`}>
      <div
        ref={contentRef}
        className={`${prefix}-content`}
        style={{ maxHeight: folded ? 20 : containerHeight * 0.3, overflowY: !folded ? 'auto' : 'hidden' }}
      >
        {legendItems.map((item: ListItem) => {
          const id = item.id || item.name;
          return (
            <div
              key={id}
              className={`${prefix}-item`}
              style={{
                color: !filteredItems.includes(id)
                  ? activedItem === id
                    ? themes['widgets-legend-text-highlight']
                    : themes['widgets-legend-text-normal']
                  : themes['widgets-color-disable'],
              }}
              onMouseEnter={() => {
                if (!filteredItems.includes(id)) {
                  setActivedItem(id);
                }
              }}
              onMouseLeave={() => {
                if (!filteredItems.includes(id)) {
                  setActivedItem('');
                }
              }}
              onClick={() => {
                if (filteredItems?.length === legendItems?.length - 1 && !filteredItems.includes(id)) {
                  setFilteredItems([]);
                } else {
                  setFilteredItems(
                    legendItems
                      .map((item: ListItem) => item.id || item.name)
                      .filter((legendName: string) => legendName !== id),
                  );
                }
              }}
            >
              {renderItem(item)}
            </div>
          );
        })}
      </div>
      {foldable && folded && (
        <div className={`${prefix}-more`} onClick={handleUnfold}>
          <div className={`${prefix}-name`} style={{ color: themes['widgets-color-text-1'] }}>
            +{legendItems?.length - num}
          </div>
          <svg
            fill="none"
            width="8.149999618530273"
            height="8.487500190734863"
            viewBox="0 0 8.149999618530273 8.487500190734863"
          >
            <g transform="matrix(0,1,-1,0,8.149999618530273,-8.149999618530273)">
              <path
                d="M8.812499618530273,8.15L12.887499618530274,4.075L8.812499618530273,0L8.149999618530273,0.6625L11.562499618530273,4.075L8.149999618530273,7.4875L8.812499618530273,8.15ZM15.312499618530273,4.075L11.899999618530273,7.4875L12.562499618530273,8.15L16.637499618530274,4.075L12.562499618530273,0L11.899999618530273,0.6625L15.312499618530273,4.075Z"
                fill={themes['widgets-color-text-2']}
              />
            </g>
          </svg>
        </div>
      )}
      {!folded && (
        <div className={`${prefix}-fold`} onClick={handleFold}>
          <svg
            fill="none"
            width="8.149999618530273"
            height="8.487500190734863"
            viewBox="0 0 8.149999618530273 8.487500190734863"
          >
            <g transform="matrix(0,-1,-1,0,16.637499809265137,16.637499809265137)">
              <path
                d="M8.812499618530273,16.637500190734862L12.887499618530274,12.562500190734863L8.812499618530273,8.487500190734863L8.149999618530273,9.150000190734863L11.562499618530273,12.562500190734863L8.149999618530273,15.975000190734864L8.812499618530273,16.637500190734862ZM15.312499618530273,12.562500190734863L11.899999618530273,15.975000190734864L12.562499618530273,16.637500190734862L16.637499618530274,12.562500190734863L12.562499618530273,8.487500190734863L11.899999618530273,9.150000190734863L15.312499618530273,12.562500190734863Z"
                fill={themes['widgets-color-text-2']}
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

function LegendName({ name = '', style = {} }: { name: string; style: any }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className={`${prefix}-name`} style={style} ref={ref}>
        {name}
      </div>
      <WidgetsTooltip ref={ref} content={name} />
    </>
  );
}
