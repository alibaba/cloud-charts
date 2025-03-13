import React, { MutableRefObject, useEffect, useState, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { PrefixName, FullCrossName } from '../../constants';
import './index.scss';

const prefix = `${PrefixName}-tooltip`;

export interface WidgetsTooltipProps {
  /** tooltip中的内容 */
  content: string | React.ReactNode;

  /** 位置偏移量 */
  offset?: { x?: number; y?: number };
}

/** 监听文字，过长省略时显示tooltip */
const WidgetsTooltip = forwardRef(({ content, offset }: WidgetsTooltipProps, ref: MutableRefObject<HTMLDivElement>) => {
  // 是否hover在label上
  const [visible, setVisible] = useState<boolean>(false);

  // label是否超过宽度，需要使用tooltip
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // 判断label是否超过宽度
  useEffect(() => {
    setShowTooltip(ref?.current?.offsetWidth <= ref?.current?.scrollWidth);
  }, [ref?.current?.offsetWidth, ref?.current?.scrollWidth]);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const handleMouseEnter = () => {
      if (showTooltip) {
        setVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    ref?.current?.addEventListener('mouseenter', handleMouseEnter);
    ref?.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref?.current?.removeEventListener('mouseenter', handleMouseEnter);
      ref?.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref?.current, showTooltip]);

  // 计算位置
  const pos = { x: 0, y: 0 };
  // let curElement = ref.current;
  // while (curElement && curElement !== document.body) {
  //   pos.x += curElement.offsetLeft;
  //   pos.y += curElement.offsetTop;
  //   curElement = curElement.offsetParent as HTMLDivElement;
  // }

  // 减去scroll的宽高
  // let curElement = ref.current;
  // while (curElement && curElement !== document.body) {
  //   pos.x -= curElement.scrollLeft;
  //   pos.y -= curElement.scrollTop;
  //   curElement = curElement.parentElement as HTMLDivElement;
  // }

  const rect = ref.current?.getBoundingClientRect();
  pos.x = (rect?.left ?? 0) + document.documentElement.scrollLeft;
  pos.y = (rect?.top ?? 0) + document.documentElement.scrollTop;

  return ReactDOM.createPortal(
    visible && (
      <div
        className={`${FullCrossName} ${prefix}-container`}
        style={{
          position: 'absolute',
          top: pos.y + (offset?.y || 0),
          left: pos.x + ref.current?.offsetWidth / 2 + (offset?.x || 0),
        }}
      >
        <div className={`${prefix}-arrow`} style={{ position: 'absolute' }}>
          <div className={`${prefix}-arrow-content`} style={{ position: 'absolute' }} />
        </div>
        <div className={`${prefix}-content`}>{content || ''}</div>
      </div>
    ),
    document.body,
  );
});

export default WidgetsTooltip;
