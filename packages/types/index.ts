type ModelType = 'swap' | 'drag' | 'swap-drag'

export type AnimationType = "dynamic" | "spring" | "none";
export type AnimateConfig = {
  duration: number
  easing: (t: number) => number
}

export type Vec2 = { x: number; y: number };

export type Position = { x: number; y: number };
export type DragAxis = "both" | "y" | "x";
export type SwapMode = "hover" | "drop"

type ElementType = Element | (() => Element)

export interface SwapOptions {
  model: ModelType;
  /** 容器 */
  current?: ElementType;
  /** 是否自动滑动滚动条 */
  autoScroll?: boolean;
  /** 动画 */
  animation?: AnimationType;
  /** 交换方式 */
  swapMode?: SwapMode;
  /** 锁定拖拽方向 */
  dragAxis?: DragAxis;
  /** 拖拽到目标函数 */
  target?: ElementType;
  /** 交换成功执行回调函数 */
  onSwap?: (id: string | null, currentId: string | null) => void;
  /** 拖拽到目标元素并且松开执行回调函数 */
  onDrop?: () => void;
}

export interface MoveRect {
  id: string;
  width: number;
  height: number;
  el: Element;
  item?: Element | null;
  animate?: boolean;
}
export interface RectInfo {
  left: number;
  top: number;
  height: number;
  width: number;
}

export type MoveRectList = MoveRect[];
