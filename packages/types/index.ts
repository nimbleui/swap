type ModelType = 'swap' | 'drag' | 'swap-drag'

export type AnimationType = "dynamic" | "spring" | "none";
export type AnimateConfig = {
  duration: number
  easing: (t: number) => number
}

export type Vec2 = { x: number; y: number };

export type Position = { x: number; y: number };

export interface SwapOptions {
  model: ModelType;
  /** 容器 */
  current?: Element | (() => Element);
  /** 是否自动滑动滚动条 */
  autoScroll?: boolean;
  /** 动画 */
  animation?: AnimationType;
  /** 交换方式 */
  swapMode?: "hover" | "drop";
  /** 锁定拖拽方向 */
  dragAxis?: "both" | "y" | "x";
}

export interface MoveRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  el: Element;
  animate?: boolean;
}
export type MoveRectList = MoveRect[];
export type MoveRectObj = { [key: string]: MoveRect };
