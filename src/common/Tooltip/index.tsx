import React, { MutableRefObject, useEffect, useState, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { PrefixName, FullCrossName } from '../../constants';
import { calcTextWidth } from '../ellipsisLabel';
import './index.scss';

const prefix = `${PrefixName}-tooltip`;

export interface WidgetsTooltipProps {
  /** tooltip中的内容 */
  content: string | React.ReactNode;

  /** 位置偏移量 */
  offset?: { x?: number; y?: number };

  /** 位置，默认下方，当靠近页面边缘时会自适应*/
  position?: 'top' | 'bottom';
}

/** 监听文字，过长省略时显示tooltip */
const WidgetsTooltip = forwardRef(
  ({ content, offset, position = 'bottom' }: WidgetsTooltipProps, ref: MutableRefObject<HTMLDivElement>) => {
    // 是否hover在label上
    const [visible, setVisible] = useState<boolean>(false);

    // label是否超过宽度，需要使用tooltip
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    // 判断label是否超过宽度
    useEffect(() => {
      if (typeof content === 'string') {
        // 计算宽度
        const textWidth = calcTextWidth(content);
        setShowTooltip(textWidth > ref.current?.offsetWidth);
      } else {
        setShowTooltip(ref.current?.offsetWidth < ref.current?.scrollWidth);
      }
    }, [ref.current?.offsetWidth, ref.current?.scrollWidth, content]);

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

    const rect = ref.current?.getBoundingClientRect();
    pos.x = (rect?.left ?? 0) + document?.documentElement?.scrollLeft;
    pos.y = (rect?.top ?? 0) + document.documentElement.scrollTop;

    pos.x += (ref.current?.offsetWidth ?? 0) / 2;

    return ReactDOM.createPortal(
      visible && (
        <div
          className={`${FullCrossName} ${prefix}-container`}
          style={{
            position: 'absolute',
            top: pos.y + (offset?.y || 0) + (position === 'bottom' ? 20 : -10),
            left: pos.x + (offset?.x || 0),
            transform: position === 'bottom' ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
          }}
        >
          {position === 'bottom' && (
            <div className={`${prefix}-arrow ${prefix}-arrow-bottom`} style={{ position: 'absolute' }}>
              <div
                className={`${prefix}-arrow-content ${prefix}-arrow-content-bottom`}
                style={{ position: 'absolute' }}
              />
            </div>
          )}
          <div className={`${prefix}-content`}>{content || ''}</div>
          {position === 'top' && (
            <div className={`${prefix}-arrow ${prefix}-arrow-top`} style={{ position: 'absolute' }}>
              <div className={`${prefix}-arrow-content ${prefix}-arrow-content-top`} style={{ position: 'absolute' }} />
            </div>
          )}
        </div>
      ),
      document.body,
    );
  },
);

export default WidgetsTooltip;
