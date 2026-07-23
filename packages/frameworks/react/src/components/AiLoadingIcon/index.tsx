import React from 'react';

/**
 * AI 风格的 loading 指示器：蓝紫渐变四角星 + 周围闪烁小星。
 * 适用场景：AI 正在生成图表 / 流式 spec 还未到达时的占位。
 *
 * 对应旧版 src/common/LoadingStarIcon。新版作为独立组件挪到 packages 下，
 * 可以单独 import 使用：
 *
 *   import { AiLoadingIcon } from '@alicloud/cloud-charts-react';
 *   <Bar data={[]} loading loadingInfo={<AiLoadingIcon text="AI 思考中…" />} />
 */

export interface AiLoadingIconProps {
  /** 副标题文字，默认 "AI is thinking…" */
  text?: React.ReactNode;
  /** 图标尺寸，默认 40 */
  size?: number;
  /** 整体颜色起止色（默认蓝紫渐变 #007EED → #B36CE6） */
  gradient?: { from: string; to: string };
  className?: string;
  style?: React.CSSProperties;
}

const KEYFRAMES = `
@keyframes cc-ai-loading-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes cc-ai-loading-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

let injected = false;
function ensureKeyframes() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-cc-ai-loading', 'true');
  style.appendChild(document.createTextNode(KEYFRAMES));
  document.head.appendChild(style);
  injected = true;
}

export function AiLoadingIcon(props: AiLoadingIconProps): JSX.Element {
  ensureKeyframes();
  const size = props.size ?? 40;
  const from = props.gradient?.from ?? '#007EED';
  const to = props.gradient?.to ?? '#B36CE6';
  const gradId = `cc-ai-loading-grad-${from.slice(1)}-${to.slice(1)}`;

  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    color: '#888',
    fontSize: 13,
    ...props.style,
  };
  const boxStyle: React.CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
  };
  const centerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    animation: 'cc-ai-loading-spin 1.5s ease-out infinite',
  };
  const aroundStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    animation: 'cc-ai-loading-blink 1.5s infinite',
  };

  return (
    <div className={props.className} style={wrapStyle} role="status" aria-live="polite">
      <div style={boxStyle}>
        <div style={centerStyle}>
          <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <defs>
              <linearGradient x1="0" y1="1" x2="1" y2="0" id={gradId}>
                <stop offset="0%" stopColor={from} stopOpacity="1" />
                <stop offset="100%" stopColor={to} stopOpacity="1" />
              </linearGradient>
            </defs>
            <g style={{ opacity: 0.6 }}>
              <path
                d="M8.0618,2.0095C8.1201,2.0289,8.1656,2.0743,8.185,2.1327L9.5029,6.0865C9.5674,6.2803,9.7196,6.4325,9.9135,6.497L13.8672,7.8149C13.9465,7.8415,14,7.9158,14,7.9994C14,8.0831,13.9465,8.1574,13.8672,8.184L9.9135,9.5019C9.7196,9.5664,9.5674,9.7186,9.5029,9.9124L8.185,13.8662C8.1588,13.946,8.0842,14,8.0002,14C7.9161,14,7.8416,13.946,7.8153,13.8662L6.4981,9.9124C6.4335,9.7186,6.2814,9.5664,6.0875,9.5019L2.1338,8.184C2.054,8.1577,2,8.0832,2,7.9991C2,7.9151,2.054,7.8405,2.1338,7.8143L6.0875,6.4977C6.2814,6.4331,6.4335,6.281,6.4981,6.0871L7.816,2.1334C7.8499,2.0312,7.9603,1.9759,8.0624,2.0101L8.0618,2.0095Z"
                fill={`url(#${gradId})`}
              />
            </g>
          </svg>
        </div>
        <div style={aroundStyle}>
          <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <g style={{ opacity: 0.6 }}>
              <path
                d="M12.018,2.641C12.007,2.645,12,2.656,12,2.668C12,2.68,12.008,2.69,12.02,2.694L12.965,3.006L13.307,3.981C13.311,3.993,13.321,4,13.333,4C13.345,4,13.356,3.993,13.36,3.981L13.701,3.006L14.647,2.694C14.658,2.69,14.666,2.68,14.667,2.668C14.667,2.656,14.66,2.645,14.648,2.641L13.701,2.27L13.36,1.352C13.357,1.344,13.351,1.338,13.343,1.335C13.328,1.33,13.312,1.337,13.307,1.352L12.965,2.27L12.018,2.641Z"
                fill={`url(#${gradId})`}
              />
              <path
                d="M1.352,13.307C1.34,13.311,1.333,13.322,1.333,13.334C1.334,13.346,1.342,13.356,1.353,13.36L2.299,13.673L2.64,14.648C2.644,14.659,2.655,14.667,2.667,14.667C2.679,14.667,2.689,14.659,2.693,14.648L3.035,13.673L3.98,13.36C3.992,13.356,4,13.346,4,13.334C4,13.322,3.993,13.311,3.982,13.307L3.035,12.937L2.693,12.018C2.69,12.011,2.684,12.005,2.676,12.002C2.662,11.996,2.646,12.004,2.64,12.018L2.299,12.937L1.352,13.307Z"
                fill={`url(#${gradId})`}
              />
            </g>
          </svg>
        </div>
      </div>
      {props.text !== null && (
        <span style={{ background: `linear-gradient(90deg, ${from}, ${to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {props.text ?? 'AI is thinking…'}
        </span>
      )}
    </div>
  );
}
